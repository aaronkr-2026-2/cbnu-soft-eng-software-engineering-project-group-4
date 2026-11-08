import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  handleNPCInteraction,
  handleAIResponse,
  handleReplayAction,
  formatInteractionTrace
} from "./npcInteractionService.js";

import {
  getNPCProfile,
  getNPCGender,
  getNPCInitialGreeting
} from "./npcPromptLogic.js";

import {
  getBestVoiceForNPC,
  detectKoreanVoiceGender
} from "./voiceFeedbackLogic.js";

describe("Phase 3.2.5 — Female NPC Interaction & Speech Execution Regression Suite", () => {
  const chromeMacOSVoices = [
    { name: "Eddy (Korean (South Korea))", lang: "ko-KR", default: false, localService: true },
    { name: "Flo (Korean (South Korea))", lang: "ko-KR", default: false, localService: true },
    { name: "Grandma (Korean (South Korea))", lang: "ko-KR", default: false, localService: true },
    { name: "Grandpa (Korean (South Korea))", lang: "ko-KR", default: false, localService: true },
    { name: "Reed (Korean (South Korea))", lang: "ko-KR", default: false, localService: true },
    { name: "Rocko (Korean (South Korea))", lang: "ko-KR", default: false, localService: true },
    { name: "Sandy (Korean (South Korea))", lang: "ko-KR", default: false, localService: true },
    { name: "Shelley (Korean (South Korea))", lang: "ko-KR", default: false, localService: true },
    { name: "Yuna", lang: "ko-KR", default: false, localService: true },
    { name: "Google 한국의", lang: "ko-KR", default: true, localService: false }
  ];

  const windowsVoices = [
    { name: "Microsoft Injoon - Korean (Korea)", lang: "ko-KR", default: false },
    { name: "Microsoft SunHi Online (Natural) - Korean (Korea)", lang: "ko-KR", default: true },
    { name: "Microsoft Minho - Korean (Korea)", lang: "ko-KR", default: false },
    { name: "Microsoft Seoyeon - Korean (Korea)", lang: "ko-KR", default: false }
  ];

  const femaleNPCIdentifiers = [
    { id: "Hotel Receptionist", name: "Emma" },
    { id: "Emma", name: "Emma" },
    { id: "Sarah", name: "Sarah" },
    { id: "Nurse Sarah", name: "Sarah" },
    { id: "Librarian", name: "Emily" },
    { id: "Emily", name: "Emily" },
    { id: "Teacher Olivia", name: "Olivia" },
    { id: "Olivia", name: "Olivia" },
    { id: "Staff Mina", name: "Mina" },
    { id: "Mina", name: "Mina" },
    { id: "Coordinator Hana", name: "Hana" },
    { id: "Hana", name: "Hana" },
    { id: "Coordinator Yuri", name: "Yuri" },
    { id: "Yuri", name: "Yuri" }
  ];

  const maleNPCIdentifiers = [
    { id: "Shop Seller", name: "Jack" },
    { id: "Jack", name: "Jack" },
    { id: "Bank Employee", name: "David" },
    { id: "David", name: "David" },
    { id: "Officer Alex", name: "Alex" },
    { id: "Alex", name: "Alex" },
    { id: "Tutor Daniel", name: "Daniel" },
    { id: "Daniel", name: "Daniel" },
    { id: "Career Counselor James", name: "James" },
    { id: "James", name: "James" }
  ];

  // 1. Jack interaction invokes speakText()
  it("1. Jack interaction invokes speakText()", () => {
    const plan = handleNPCInteraction({
      npcPrompt: "Shop Seller",
      messagesHistory: [],
      isDialogOpen: false,
      learningLanguage: "ko"
    });

    assert.equal(plan.action, "open_greeting");
    assert.equal(plan.shouldSpeak, true);
    assert.equal(typeof plan.textToSpeak, "string");
    assert.ok(plan.textToSpeak.length > 0);
    assert.equal(plan.gender, "male");
    assert.equal(plan.ttsSource, "initial_greeting");
  });

  // 2. Emma interaction invokes speakText()
  it("2. Emma interaction invokes speakText()", () => {
    const plan = handleNPCInteraction({
      npcPrompt: "Hotel Receptionist",
      messagesHistory: [],
      isDialogOpen: false,
      learningLanguage: "ko"
    });

    assert.equal(plan.action, "open_greeting");
    assert.equal(plan.shouldSpeak, true);
    assert.equal(typeof plan.textToSpeak, "string");
    assert.ok(plan.textToSpeak.length > 0);
    assert.equal(plan.gender, "female");
    assert.equal(plan.displayName, "Emma");
    assert.equal(plan.ttsSource, "initial_greeting");
  });

  // 3. Emma interaction invokes speakText()
  it("3. Emma interaction invokes speakText()", () => {
    const plan = handleNPCInteraction({
      npcPrompt: "Hotel Receptionist",
      messagesHistory: [],
      isDialogOpen: false,
      learningLanguage: "ko"
    });

    assert.equal(plan.action, "open_greeting");
    assert.equal(plan.shouldSpeak, true);
    assert.equal(plan.gender, "female");
    assert.equal(plan.displayName, "Emma");
    assert.equal(plan.ttsSource, "initial_greeting");
  });

  // 4. Sarah interaction invokes speakText()
  it("4. Sarah interaction invokes speakText() with Sarah and Nurse Sarah", () => {
    const planSarah = handleNPCInteraction({
      npcPrompt: "Sarah",
      messagesHistory: [],
      isDialogOpen: false,
      learningLanguage: "ko"
    });
    assert.equal(planSarah.action, "open_greeting");
    assert.equal(planSarah.shouldSpeak, true);
    assert.equal(planSarah.gender, "female");
    assert.equal(planSarah.displayName, "Sarah");

    const planNurse = handleNPCInteraction({
      npcPrompt: "Nurse Sarah",
      messagesHistory: [],
      isDialogOpen: false,
      learningLanguage: "ko"
    });
    assert.equal(planNurse.action, "open_greeting");
    assert.equal(planNurse.shouldSpeak, true);
    assert.equal(planNurse.gender, "female");
    assert.equal(planNurse.displayName, "Sarah");
  });

  // 5. Every female NPC initial greeting reaches TTS
  it("5. Every female NPC initial greeting reaches TTS", () => {
    femaleNPCIdentifiers.forEach(({ id }) => {
      const plan = handleNPCInteraction({
        npcPrompt: id,
        messagesHistory: [],
        isDialogOpen: false,
        learningLanguage: "ko"
      });

      assert.equal(plan.action, "open_greeting", `Failed for ${id}`);
      assert.equal(plan.shouldSpeak, true, `shouldSpeak is false for ${id}`);
      assert.equal(plan.ttsSource, "initial_greeting", `ttsSource incorrect for ${id}`);
      assert.ok(plan.textToSpeak && plan.textToSpeak.trim().length > 0, `Empty speech text for ${id}`);
      assert.equal(plan.gender, "female", `Gender not female for ${id}`);
    });
  });

  // 6. Every female NPC AI response reaches TTS
  it("6. Every female NPC AI response reaches TTS", () => {
    femaleNPCIdentifiers.forEach(({ id }) => {
      const sampleResponse = "안녕하세요! 무엇을 도와드릴까요?";
      const plan = handleAIResponse({
        rawReply: sampleResponse,
        npcName: id,
        learningLanguage: "ko"
      });

      assert.equal(plan.shouldSpeak, true, `shouldSpeak false for AI response on ${id}`);
      assert.equal(plan.textToSpeak, sampleResponse, `Text mismatch on ${id}`);
      assert.equal(plan.ttsSource, "ai_response", `TTS source mismatch on ${id}`);
      assert.equal(plan.trace.aiResponseReceived, true, `Trace failed on ${id}`);
    });
  });

  // 7. Female NPC interaction opens chat modal
  it("7. Female NPC interaction opens chat modal", () => {
    const plan = handleNPCInteraction({
      npcPrompt: "Hotel Receptionist",
      messagesHistory: [],
      isDialogOpen: false,
      learningLanguage: "ko"
    });

    assert.equal(plan.action, "open_greeting");
    assert.equal(plan.trace.dialogOpened, true);
    assert.equal(plan.nextMessages.length, 1);
    assert.equal(plan.nextMessages[0].sender, "npc");
  });

  // 8. Female NPC profile resolves using actual production identifiers
  it("8. Female NPC profile resolves using actual production identifiers", () => {
    const prodIdentifiers = [
      { id: "Hotel Receptionist", expected: "Emma" },
      { id: "Sarah", expected: "Sarah" },
      { id: "Librarian", expected: "Emily" },
      { id: "Teacher Olivia", expected: "Olivia" },
      { id: "Staff Mina", expected: "Mina" },
      { id: "Coordinator Hana", expected: "Hana" },
      { id: "Coordinator Yuri", expected: "Yuri" }
    ];

    prodIdentifiers.forEach(({ id, expected }) => {
      const profile = getNPCProfile(id);
      assert.ok(profile, `Profile not resolved for production id: ${id}`);
      assert.equal(profile.name, expected, `Profile name mismatch for ${id}`);
      assert.equal(getNPCGender(id), "female", `Gender mismatch for ${id}`);
      const greeting = getNPCInitialGreeting(id, "ko");
      assert.ok(greeting && greeting.length > 0, `Greeting missing for ${id}`);
    });
  });

  // 9. Female NPC replay invokes TTS
  it("9. Female NPC replay invokes TTS", () => {
    const replayPlan = handleReplayAction({
      text: "따뜻한 아메리카노 한 잔 드릴까요?",
      messageIndex: 0,
      status: "idle",
      isGenerating: false,
      npcName: "Hotel Receptionist",
      learningLanguage: "ko"
    });

    assert.equal(replayPlan.allowed, true);
    assert.equal(replayPlan.shouldSpeak, true);
    assert.equal(replayPlan.ttsSource, "replay");
    assert.equal(replayPlan.textToSpeak, "따뜻한 아메리카노 한 잔 드릴까요?");
    assert.equal(replayPlan.trace.speakTextCalled, true);
  });

  // 10. Female NPC interaction errors are observable
  it("10. Female NPC interaction errors are observable", () => {
    // 10.1 Aborted when no NPC nearby
    const noPromptPlan = handleNPCInteraction({
      npcPrompt: null,
      messagesHistory: [],
      isDialogOpen: false,
      learningLanguage: "ko"
    });
    assert.equal(noPromptPlan.action, "ignore");
    assert.equal(noPromptPlan.shouldSpeak, false);
    assert.equal(noPromptPlan.trace.abortedAt, "no_npc_prompt");
    const traceString = formatInteractionTrace(noPromptPlan.trace);
    assert.ok(traceString.includes("[NPC INTERACTION TRACE]"));
    assert.ok(traceString.includes("Execution aborted at: no_npc_prompt"));

    // 10.2 Aborted on empty replay text
    const emptyReplay = handleReplayAction({
      text: "",
      messageIndex: 0,
      status: "idle",
      isGenerating: false,
      npcName: "Mia",
      learningLanguage: "ko"
    });
    assert.equal(emptyReplay.allowed, false);
    assert.equal(emptyReplay.trace.abortedAt, "empty_replay_text");

    // 10.3 Empty AI response handled cleanly with Korean fallback
    const emptyAi = handleAIResponse({
      rawReply: "",
      npcName: "Mia",
      learningLanguage: "ko"
    });
    assert.equal(emptyAi.isError, true);
    assert.equal(emptyAi.shouldSpeak, true);
    assert.ok(emptyAi.textToSpeak.includes("죄송합니다"));
    assert.equal(emptyAi.trace.abortedAt, "empty_ai_response");
  });

  // 11. Male NPC behavior remains unchanged
  it("11. Male NPC behavior remains unchanged", () => {
    maleNPCIdentifiers.forEach(({ id, name }) => {
      const plan = handleNPCInteraction({
        npcPrompt: id,
        messagesHistory: [],
        isDialogOpen: false,
        learningLanguage: "ko"
      });

      assert.equal(plan.action, "open_greeting", `Male greeting failed for ${id}`);
      assert.equal(plan.shouldSpeak, true, `Male speak failed for ${id}`);
      assert.equal(plan.gender, "male", `Male gender failed for ${id}`);
      assert.equal(plan.displayName, name, `Male name mismatch for ${id}`);

      // Voice selection for male on Chrome selects Eddy (Korean male voice)
      const voice = getBestVoiceForNPC(chromeMacOSVoices, id, "ko");
      assert.ok(voice, `No voice found for male NPC ${id}`);
      assert.equal(voice.name, "Eddy (Korean (South Korea))");
    });
  });

  // 12. Korean learning language remains ko-KR
  it("12. Korean learning language remains ko-KR", () => {
    const plan = handleNPCInteraction({
      npcPrompt: "Hotel Receptionist",
      messagesHistory: [],
      isDialogOpen: false,
      learningLanguage: "ko"
    });

    assert.equal(plan.trace.utteranceLanguage, "ko-KR");

    // Strictly ensure no English fallback when learningLanguage is ko
    const englishOnlyVoices = [
      { name: "Samantha", lang: "en-US" },
      { name: "Daniel", lang: "en-GB" }
    ];
    const voice = getBestVoiceForNPC(englishOnlyVoices, "Emma", "ko");
    assert.equal(voice, null);
  });

  // 13. Female Korean voice is selected when available
  it("13. Female Korean voice is selected when available", () => {
    // 13.1 Chrome macOS: Google 한국의 detected as female and selected over dropped local voices
    assert.equal(detectKoreanVoiceGender({ name: "Google 한국의", lang: "ko-KR" }), "female");
    assert.equal(detectKoreanVoiceGender({ name: "Google 한국어", lang: "ko-KR" }), "female");

    const chromeFemaleVoice = getBestVoiceForNPC(chromeMacOSVoices, "Emma", "ko");
    assert.ok(chromeFemaleVoice);
    assert.equal(chromeFemaleVoice.name, "Google 한국의");

    // 13.2 Windows: SunHi selected
    const winFemaleVoice = getBestVoiceForNPC(windowsVoices, "Hotel Receptionist", "ko");
    assert.ok(winFemaleVoice);
    assert.equal(winFemaleVoice.name, "Microsoft SunHi Online (Natural) - Korean (Korea)");

    // 13.3 Native macOS without Google voice: Yuna selected
    const macOnlyVoices = [
      { name: "Eddy (Korean (South Korea))", lang: "ko-KR" },
      { name: "Yuna", lang: "ko-KR" }
    ];
    const macFemaleVoice = getBestVoiceForNPC(macOnlyVoices, "Sarah", "ko");
    assert.ok(macFemaleVoice);
    assert.equal(macFemaleVoice.name, "Yuna");
  });

  // 14. Dialog state resets correctly after repeated interactions
  it("14. Dialog state resets correctly after repeated interactions", () => {
    let history = [];
    let isDialogOpen = false;

    // Step 1: First interaction opens dialog and speaks greeting
    const firstPlan = handleNPCInteraction({
      npcPrompt: "Hotel Receptionist",
      messagesHistory: history,
      isDialogOpen,
      learningLanguage: "ko"
    });
    assert.equal(firstPlan.action, "open_greeting");
    assert.equal(firstPlan.shouldSpeak, true);
    history = [...firstPlan.nextMessages];
    isDialogOpen = true;

    // Step 2: Pressing F again toggles dialog closed
    const toggleClosePlan = handleNPCInteraction({
      npcPrompt: "Hotel Receptionist",
      messagesHistory: history,
      isDialogOpen,
      learningLanguage: "ko"
    });
    assert.equal(toggleClosePlan.action, "close");
    assert.equal(toggleClosePlan.shouldSpeak, false);
    isDialogOpen = false;

    // Step 3: Re-opening existing conversation displays history without repeating initial greeting speech
    const reopenPlan = handleNPCInteraction({
      npcPrompt: "Hotel Receptionist",
      messagesHistory: history,
      isDialogOpen,
      learningLanguage: "ko"
    });
    assert.equal(reopenPlan.action, "open_existing");
    assert.equal(reopenPlan.shouldSpeak, false);
    assert.equal(reopenPlan.nextMessages.length, 1);
    assert.equal(reopenPlan.nextMessages[0].text, firstPlan.greeting);
  });
});
