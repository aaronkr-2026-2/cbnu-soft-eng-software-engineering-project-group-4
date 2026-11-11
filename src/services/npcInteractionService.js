/**
 * npcInteractionService.js
 * Centralized, testable interaction service for NPC dialogue lifecycle,
 * trace generation, state transitions, and TTS execution dispatch.
 */

import { getNPCGender, getNPCProfile, getNPCInitialGreeting } from "./npcPromptLogic.js";
import { canReplayVoice, sanitizeSpeechText } from "./voiceFeedbackLogic.js";

/**
 * Formats a structured NPC interaction trace object into the required diagnostic output.
 *
 * @param {Object} trace
 * @returns {string} Formatted trace string
 */
export function formatInteractionTrace(trace = {}) {
  return [
    "[NPC INTERACTION TRACE]",
    `NPC display name: ${trace.displayName || "Unknown"}`,
    `NPC internal ID: ${trace.internalId || "none"}`,
    `NPC gender: ${trace.gender || "unknown"}`,
    `Profile resolved: ${trace.profileResolved ? "true" : "false"}`,
    `Interaction handler entered: ${trace.handlerEntered ? "true" : "false"}`,
    `Dialog opened: ${trace.dialogOpened ? "true" : "false"}`,
    `Greeting generated: ${trace.greetingGenerated ? "true" : "false"}`,
    `Greeting text: ${trace.greetingText || "none"}`,
    `AI request started: ${trace.aiRequestStarted ? "true" : "false"}`,
    `AI response received: ${trace.aiResponseReceived ? "true" : "false"}`,
    `Displayed text: ${trace.displayedText || "none"}`,
    `speakText called: ${trace.speakTextCalled ? "true" : "false"}`,
    `TTS source: ${trace.ttsSource || "none"}`,
    `TTS text: ${trace.ttsText || "none"}`,
    `Voice selected: ${trace.voiceSelected || "none"}`,
    `Utterance language: ${trace.utteranceLanguage || "none"}`,
    `Playback started: ${trace.playbackStarted ? "true" : "false"}`,
    `Playback ended: ${trace.playbackEnded ? "true" : "false"}`,
    `Playback error: ${trace.playbackError || "none"}`,
    `Execution aborted at: ${trace.abortedAt || "none"}`
  ].join("\n");
}

/**
 * Evaluates an NPC interaction request (typically triggered by keypress F).
 * Determines the next state transition, greeting generation, and TTS dispatch.
 *
 * @param {Object} params
 * @param {string|null} params.npcPrompt - Active NPC identifier from proximity detection
 * @param {Array} params.messagesHistory - Current conversation history
 * @param {boolean} params.isDialogOpen - Whether dialog modal is already open
 * @param {"en"|"ko"} [params.learningLanguage="ko"] - Target learning language
 * @param {Object|null} [params.activeScenario=null] - Current active contextual scenario
 * @returns {Object} Interaction plan and diagnostic trace
 */
export function handleNPCInteraction({
  npcPrompt,
  messagesHistory = [],
  isDialogOpen = false,
  learningLanguage = "ko",
  activeScenario = null
}) {
  const currentLearningLang = learningLanguage === "ko" ? "ko" : "en";

  // If dialog is already open, the F key acts as a toggle to close
  if (isDialogOpen) {
    return {
      action: "close",
      shouldSpeak: false,
      trace: {
        internalId: npcPrompt || "none",
        handlerEntered: true,
        abortedAt: "dialog_already_open_toggle_close"
      }
    };
  }

  // If player is not near any NPC, abort cleanly
  if (!npcPrompt) {
    return {
      action: "ignore",
      shouldSpeak: false,
      trace: {
        internalId: "none",
        handlerEntered: true,
        abortedAt: "no_npc_prompt"
      }
    };
  }

  const profile = getNPCProfile(npcPrompt);
  const gender = getNPCGender(npcPrompt);
  const displayName = profile?.name || npcPrompt;

  // First interaction with this facility / session: generate and speak initial greeting
  if (!messagesHistory || messagesHistory.length === 0) {
    const greeting = getNPCInitialGreeting(npcPrompt, currentLearningLang, activeScenario);
    const initialMessage = { sender: "npc", text: greeting };
    const nextMessages = [initialMessage];

    const trace = {
      displayName,
      internalId: npcPrompt,
      gender,
      profileResolved: Boolean(profile),
      handlerEntered: true,
      dialogOpened: true,
      greetingGenerated: true,
      greetingText: greeting,
      aiRequestStarted: false,
      aiResponseReceived: false,
      displayedText: greeting,
      speakTextCalled: true,
      ttsSource: "initial_greeting",
      ttsText: greeting,
      voiceSelected: "",
      utteranceLanguage: currentLearningLang === "ko" ? "ko-KR" : "en-US",
      playbackStarted: false,
      playbackEnded: false,
      playbackError: null,
      abortedAt: null
    };

    return {
      action: "open_greeting",
      npcName: npcPrompt,
      displayName,
      gender,
      profile,
      greeting,
      nextMessages,
      shouldSpeak: true,
      textToSpeak: greeting,
      ttsSource: "initial_greeting",
      trace
    };
  }

  // Re-opening existing conversation
  const trace = {
    displayName,
    internalId: npcPrompt,
    gender,
    profileResolved: Boolean(profile),
    handlerEntered: true,
    dialogOpened: true,
    greetingGenerated: false,
    greetingText: "",
    aiRequestStarted: false,
    aiResponseReceived: false,
    displayedText: messagesHistory[messagesHistory.length - 1]?.text || "",
    speakTextCalled: false,
    ttsSource: "none",
    ttsText: "",
    voiceSelected: "",
    utteranceLanguage: currentLearningLang === "ko" ? "ko-KR" : "en-US",
    playbackStarted: false,
    playbackEnded: false,
    playbackError: null,
    abortedAt: null
  };

  return {
    action: "open_existing",
    npcName: npcPrompt,
    displayName,
    gender,
    profile,
    greeting: null,
    nextMessages: [...messagesHistory],
    shouldSpeak: false,
    textToSpeak: null,
    ttsSource: "none",
    trace
  };
}

/**
 * Sanitizes generated NPC responses to enforce the strict anti-mission-coaching policy.
 * - Detects direct player mission queries and ensures polite in-character deflection.
 * - Strips any unsolicited mission requirement suggestions, missing item lists, or quest coaching.
 * - Preserves natural factual answers about products, prices, vocabulary, and general conversation.
 *
 * @param {string} text - Raw cleaned AI reply
 * @param {Object} [options]
 * @param {string} [options.npcName] - Active NPC name/role
 * @param {"en"|"ko"} [options.learningLanguage="ko"] - Target learning language
 * @param {string} [options.playerInput=""] - Recent player message text
 * @param {Object|null} [options.activeMission=null] - Active mission object
 * @returns {string} Sanitized NPC dialogue
 */
export function sanitizeNPCResponse(text, options = {}) {
  if (!text || typeof text !== "string") return "";

  const {
    npcName = "",
    learningLanguage = "ko",
    playerInput = "",
    activeMission = null, // eslint-disable-line no-unused-vars
    diagnostics = null
  } = options;

  const isKo = learningLanguage === "ko";
  const profile = getNPCProfile(npcName);
  const cleanRoleEn = (profile?.role || "village resident").replace(/^(a|an)\s+/i, "");
  const baseRoleKo = profile?.koreanRole || "마을 주민";
  const lastChar = baseRoleKo.charCodeAt(baseRoleKo.length - 1);
  const hasBatchim = (lastChar - 0xac00) % 28 > 0;
  const particle = hasBatchim ? "이라서" : "라서";

  const normalizedInput = (playerInput || "").trim().toLowerCase();
  const normalizedText = text.trim();

  // 1. Check if the player directly asked about their mission/task/objective/items needed
  const isDirectMissionQuery =
    /(?:what('s| is| are)?\s*(?:my|the|your|this|our)?\s*(?:mission|task|objective|goal|job))\b/i.test(normalizedInput) ||
    /\b(what do i need|what should i (buy|order|get|do)|what am i supposed to)\b/i.test(normalizedInput) ||
    /\b(how do i complete|what is required|tell me the answer|what's the mission|what is your mission)\b/i.test(normalizedInput) ||
    /(?:미션|과제|퀘스트|목표).*(?:뭐|무엇|알려|어떻게)/i.test(normalizedInput) ||
    /(?:뭘|무엇을).*(?:해야|사야|주문해야|필요)/i.test(normalizedInput) ||
    /(?:내 미션|내 과제|정답이 뭐|할 일이 뭐|네 미션|너의 미션|당신의 미션)/i.test(normalizedInput);

  if (isDirectMissionQuery) {
    if (diagnostics) {
      diagnostics.applied = true;
      diagnostics.reason = "direct_mission_deflection";
    }

    const lowerNpc = (npcName || "").toLowerCase();
    const isCommercial =
      lowerNpc.includes("cafe") ||
      lowerNpc.includes("barista") ||
      lowerNpc.includes("mia") ||
      lowerNpc.includes("shop") ||
      lowerNpc.includes("jack");

    const closingEn = isCommercial
      ? "let me know if you need anything from our counter!"
      : "feel free to ask if you have any questions about our facility!";
    const closingKo = isCommercial
      ? "주문이나 찾으시는 것이 있으시면 편하게 말씀해 주세요."
      : "시설 이용이나 궁금하신 점이 있으시면 편하게 말씀해 주세요.";

    // If the NPC answered by giving instructions, items, or requirements, deflect politely in character!
    return isKo
      ? `미션이라니요? 무슨 말씀이신지 잘 모르겠어요! 저는 이곳 ${baseRoleKo}${particle} 손님의 개인 과제는 알지 못해요. 화면의 미션 안내창을 확인해 보시고, ${closingKo}`
      : `Mission? I'm not sure what you mean! I'm just the ${cleanRoleEn} here. Please check your Mission Introduction Window for your task details, and ${closingEn}`;
  }

  // 2. Strict anti-coaching pattern detection in NPC response
  // English coaching patterns
  const enCoachingPatterns = [
    /\b(?:for your|to complete your|finish your|fulfill your)\s+(?:mission|task|quest|goal)\b/i,
    /\b(?:you need to|you should|you must|you have to)\s+(?:buy|order|get|purchase|collect)\b.*(?:\bfor\b|\bto complete\b|\btask\b|\bmission\b)/i,
    /\b(?:you are missing|items? missing|you still need\s+\d+|missing \d+)\b/i,
    /\b(?:your mission is|your task is to|the requirement is to)\b/i,
    /\b(?:to finish the task|to pass the mission|finish the task|fulfill the task)\b/i,
    /\b(?:mission objective|task objective)\b/i
  ];

  // Korean coaching patterns
  const koCoachingPatterns = [
    /(?:미션|과제|퀘스트)\s*(?:을|를)?\s*(?:완료|성공|위해|목표로|해결|달성)/i,
    /(?:미션을|과제를)\s*(?:위해|해결하려면|달성하려면|통과하려면)/i,
    /(?:사셔야|주문하셔야|골라야|준비하셔야|고르셔야)\s*(?:미션|과제|완료)/i,
    /(?:부족한|부족합|모자란|모자랍|빠진|남은)\s*(?:아이템|물품|품목|수량|\d+개|개)/i,
    /(?:\d+개.*부족|사과.*부족|물품.*부족|아이템.*부족|수량.*부족)/i,
    /(?:부족합니다|부족해요|모자랍니다|모자라요)/i,
    /(?:미션 목표는|과제 목표는|요구 조건은)/i,
    /(?:사셔야 해요|주문하셔야 해요|사셔야 합니다|주문하셔야 합니다).*(?:미션|과제)/i,
    /(?:미션|과제).*(?:사셔야|주문하셔야|고르셔야|가져오셔야)/i
  ];

  const hasCoaching = isKo
    ? koCoachingPatterns.some((pattern) => pattern.test(normalizedText))
    : enCoachingPatterns.some((pattern) => pattern.test(normalizedText));

  if (hasCoaching) {
    if (diagnostics) {
      diagnostics.applied = true;
      diagnostics.reason = "anti_coaching_filter";
    }

    // Check if the reply is purely coaching or has natural conversational introductory sentences
    const sentences = normalizedText.split(/(?<=[.?!])\s+/);
    const cleanSentences = sentences.filter((s) => {
      return isKo
        ? !koCoachingPatterns.some((p) => p.test(s))
        : !enCoachingPatterns.some((p) => p.test(s));
    });

    const isOnlyGreeting = cleanSentences.every((s) =>
      /^(어서 오세요!?|안녕하세요!?|반갑습니다!?|welcome!?|hello!?|hi!?)$/i.test(s.trim())
    );

    if (cleanSentences.length > 0 && !isOnlyGreeting) {
      return cleanSentences.join(" ").trim();
    }

    const greetingPrefix = isOnlyGreeting && cleanSentences.length > 0 ? cleanSentences.join(" ").trim() + " " : "";

    // Default facility-appropriate in-character fallback response if entire message was coaching or just greeting
    const lowerNpc = (npcName || "").toLowerCase();
    if (lowerNpc.includes("cafe") || lowerNpc.includes("barista") || lowerNpc.includes("mia")) {
      return isKo
        ? `${greetingPrefix}저희 카페에는 다양한 커피와 신선한 디저트가 준비되어 있어요. 천천히 둘러보시고 편하게 말씀해 주세요.`.trim()
        : `${greetingPrefix}We have a wonderful selection of coffee and fresh pastries on our menu. Feel free to take your time and let me know when you're ready to order!`.trim();
    }

    if (lowerNpc.includes("shop") || lowerNpc.includes("jack")) {
      return isKo
        ? `${greetingPrefix}저희 상점에는 신선한 과일과 음료, 빵이 진열되어 있어요. 천천히 둘러보시고 필요한 것이 있으면 말씀해 주세요.`.trim()
        : `${greetingPrefix}We have fresh fruits, drinks, and bread in our shop. Feel free to browse and let me know if you need anything!`.trim();
    }

    return isKo
      ? `${greetingPrefix}오늘 어떤 도움이 필요하신가요? 편하게 말씀해 주세요.`.trim()
      : `${greetingPrefix}How can I help you today? Please feel free to ask.`.trim();
  }

  return normalizedText;
}

/**
 * Handles incoming AI-generated NPC responses.
 * Cleans the text, updates history, and prepares TTS parameters.
 *
 * @param {Object} params
 * @param {string|null} params.rawReply - Raw response from Groq LLM
 * @param {string} params.npcName - NPC identifier
 * @param {"en"|"ko"} [params.learningLanguage="ko"] - Target learning language
 * @param {string} [params.playerInput=""] - Recent player message text
 * @param {Object|null} [params.activeMission=null] - Active mission object
 * @param {string|null} [params.error=null] - Error category ("api_error", "timeout", "parse_error")
 * @param {string} [params.errorMessage=""] - Diagnostic error details
 * @returns {Object} Response plan and trace
 */
export function handleAIResponse({
  rawReply,
  npcName,
  learningLanguage = "ko",
  playerInput = "",
  activeMission = null,
  error = null,
  errorMessage = ""
}) {
  const currentLearningLang = learningLanguage === "ko" ? "ko" : "en";
  const profile = getNPCProfile(npcName);
  const gender = getNPCGender(npcName);
  const displayName = profile?.name || npcName;

  if (error || !rawReply || typeof rawReply !== "string" || !rawReply.trim()) {
    let fallbackError;
    let abortedAt = "empty_ai_response";

    if (error === "timeout") {
      abortedAt = "timeout";
      fallbackError =
        currentLearningLang === "ko"
          ? "죄송합니다. 응답 시간이 초과되었습니다. 다시 한 번 말씀해 주세요."
          : "I apologize, but the response timed out. Please try asking again.";
    } else if (error === "parse_error") {
      abortedAt = "parse_error";
      fallbackError =
        currentLearningLang === "ko"
          ? "죄송합니다. 서버 응답을 처리하는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
          : "I apologize, but I had trouble processing the response. Please try again.";
    } else if (error === "api_error") {
      abortedAt = "api_error";
      fallbackError =
        currentLearningLang === "ko"
          ? "죄송합니다. 현재 대화 서비스에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요."
          : "I apologize, but I cannot connect to the conversation service right now. Please try again.";
    } else {
      abortedAt = "empty_ai_response";
      fallbackError =
        currentLearningLang === "ko"
          ? "죄송합니다. 다시 한 번 말씀해 주시겠어요?"
          : "Sorry, could you repeat that please?";
    }

    return {
      reply: fallbackError,
      isError: true,
      shouldSpeak: true,
      textToSpeak: fallbackError,
      ttsSource: "ai_error_fallback",
      sanitizerApplied: false,
      sanitizerReason: "none",
      trace: {
        displayName,
        internalId: npcName,
        gender,
        profileResolved: Boolean(profile),
        handlerEntered: true,
        dialogOpened: true,
        greetingGenerated: false,
        greetingText: "",
        aiRequestStarted: true,
        aiResponseReceived: Boolean(rawReply),
        displayedText: fallbackError,
        speakTextCalled: true,
        ttsSource: "ai_error_fallback",
        ttsText: fallbackError,
        voiceSelected: "",
        utteranceLanguage: currentLearningLang === "ko" ? "ko-KR" : "en-US",
        playbackStarted: false,
        playbackEnded: false,
        playbackError: null,
        abortedAt,
        errorCategory: error || "empty_reply",
        errorMessage: errorMessage || null,
        sanitizerApplied: false,
        sanitizerReason: "none"
      }
    };
  }

  // Strip wrapping quotes
  const cleanReply = rawReply.replace(/^["'“”‘’]+|["'“”‘’]+$/g, "").trim();

  // Enforce anti-coaching policy at the final response generation layer
  const diagnostics = { applied: false, reason: "none", originalText: cleanReply };
  const sanitizedReply = sanitizeNPCResponse(cleanReply, {
    npcName,
    learningLanguage: currentLearningLang,
    playerInput,
    activeMission,
    diagnostics
  });

  const trace = {
    displayName,
    internalId: npcName,
    gender,
    profileResolved: Boolean(profile),
    handlerEntered: true,
    dialogOpened: true,
    greetingGenerated: false,
    greetingText: "",
    aiRequestStarted: true,
    aiResponseReceived: true,
    displayedText: sanitizedReply,
    speakTextCalled: true,
    ttsSource: "ai_response",
    ttsText: sanitizedReply,
    voiceSelected: "",
    utteranceLanguage: currentLearningLang === "ko" ? "ko-KR" : "en-US",
    playbackStarted: false,
    playbackEnded: false,
    playbackError: null,
    abortedAt: null,
    sanitizerApplied: diagnostics.applied,
    sanitizerReason: diagnostics.reason
  };

  return {
    reply: sanitizedReply,
    isError: false,
    shouldSpeak: true,
    textToSpeak: sanitizedReply,
    ttsSource: "ai_response",
    sanitizerApplied: diagnostics.applied,
    sanitizerReason: diagnostics.reason,
    trace
  };
}

/**
 * Handles TTS replay button click for a given NPC dialogue message.
 *
 * @param {Object} params
 * @param {string} params.text - Message text to replay
 * @param {number} params.messageIndex - Index in dialogState.messages
 * @param {string} params.status - Current dialogState.status
 * @param {boolean} params.isGenerating - Whether AI request is in flight
 * @param {string} params.npcName - Current NPC identifier
 * @param {"en"|"ko"} [params.learningLanguage="ko"] - Learning language
 * @returns {Object} Replay decision and trace
 */
export function handleReplayAction({
  text,
  messageIndex,
  status,
  isGenerating = false,
  npcName,
  learningLanguage = "ko"
}) {
  const currentLearningLang = learningLanguage === "ko" ? "ko" : "en";
  const profile = getNPCProfile(npcName);
  const gender = getNPCGender(npcName);
  const displayName = profile?.name || npcName;

  const isEligible = canReplayVoice({
    sender: "npc",
    status,
    isGenerating
  });

  if (!isEligible || !text) {
    return {
      allowed: false,
      shouldSpeak: false,
      trace: {
        displayName,
        internalId: npcName,
        gender,
        profileResolved: Boolean(profile),
        speakTextCalled: false,
        abortedAt: !text ? "empty_replay_text" : "replay_not_allowed"
      }
    };
  }

  const cleanText = sanitizeSpeechText(text) || text;

  const trace = {
    displayName,
    internalId: npcName,
    gender,
    profileResolved: Boolean(profile),
    handlerEntered: true,
    dialogOpened: true,
    greetingGenerated: false,
    greetingText: "",
    aiRequestStarted: false,
    aiResponseReceived: false,
    displayedText: text,
    speakTextCalled: true,
    ttsSource: "replay",
    ttsText: cleanText,
    voiceSelected: "",
    utteranceLanguage: currentLearningLang === "ko" ? "ko-KR" : "en-US",
    playbackStarted: false,
    playbackEnded: false,
    playbackError: null,
    abortedAt: null
  };

  return {
    allowed: true,
    messageIndex,
    shouldSpeak: true,
    textToSpeak: cleanText,
    ttsSource: "replay",
    trace
  };
}
