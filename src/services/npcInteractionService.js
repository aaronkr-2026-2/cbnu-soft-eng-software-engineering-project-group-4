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
 * @returns {Object} Interaction plan and diagnostic trace
 */
export function handleNPCInteraction({
  npcPrompt,
  messagesHistory = [],
  isDialogOpen = false,
  learningLanguage = "ko"
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
    const greeting = getNPCInitialGreeting(npcPrompt, currentLearningLang);
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
 * Handles incoming AI-generated NPC responses.
 * Cleans the text, updates history, and prepares TTS parameters.
 *
 * @param {Object} params
 * @param {string} params.rawReply - Raw response from Groq LLM
 * @param {string} params.npcName - NPC identifier
 * @param {"en"|"ko"} [params.learningLanguage="ko"] - Target learning language
 * @returns {Object} Response plan and trace
 */
export function handleAIResponse({
  rawReply,
  npcName,
  learningLanguage = "ko"
}) {
  const currentLearningLang = learningLanguage === "ko" ? "ko" : "en";
  const profile = getNPCProfile(npcName);
  const gender = getNPCGender(npcName);
  const displayName = profile?.name || npcName;

  if (!rawReply || typeof rawReply !== "string" || !rawReply.trim()) {
    const fallbackError =
      currentLearningLang === "ko"
        ? "죄송합니다. 다시 한 번 말씀해 주시겠어요?"
        : "Sorry, could you repeat that please?";

    return {
      reply: fallbackError,
      isError: true,
      shouldSpeak: true,
      textToSpeak: fallbackError,
      ttsSource: "ai_error_fallback",
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
        aiResponseReceived: false,
        displayedText: fallbackError,
        speakTextCalled: true,
        ttsSource: "ai_error_fallback",
        ttsText: fallbackError,
        utteranceLanguage: currentLearningLang === "ko" ? "ko-KR" : "en-US",
        abortedAt: "empty_ai_response"
      }
    };
  }

  // Strip wrapping quotes
  const cleanReply = rawReply.replace(/^["'“”‘’]+|["'“”‘’]+$/g, "").trim();

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
    displayedText: cleanReply,
    speakTextCalled: true,
    ttsSource: "ai_response",
    ttsText: cleanReply,
    voiceSelected: "",
    utteranceLanguage: currentLearningLang === "ko" ? "ko-KR" : "en-US",
    playbackStarted: false,
    playbackEnded: false,
    playbackError: null,
    abortedAt: null
  };

  return {
    reply: cleanReply,
    isError: false,
    shouldSpeak: true,
    textToSpeak: cleanReply,
    ttsSource: "ai_response",
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
