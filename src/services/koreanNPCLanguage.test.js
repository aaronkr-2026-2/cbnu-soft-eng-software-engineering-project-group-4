import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  buildNPCSystemPrompt,
  getNPCInitialGreeting
} from "./npcPromptLogic.js";
import {
  getBestVoiceForNPC,
  canReplayVoice,
  sanitizeSpeechText
} from "./voiceFeedbackLogic.js";
import { getLocalizedItemName } from "./inventoryLogic.js";
import { getLocalizedMission, MISSIONS_CATALOG } from "./missionsData.js";

describe("Phase 3.2.1: Korean NPC Language & Speech Regression Tests", () => {
  // Test 1: English interface + Korean learning → NPC prompt requires Korean
  it("1. English interface + Korean learning requires Korean in NPC prompt", () => {
    const localizedMission = getLocalizedMission(MISSIONS_CATALOG.Shop[0], "en");
    assert.equal(localizedMission.title, "🏪 Shop Mission");
    assert.equal(localizedMission.goal, "Buy exactly 2 bottles of water and 1 apple.");

    const prompt = buildNPCSystemPrompt({
      npcName: "Shop Seller",
      activeMission: localizedMission,
      learningLanguage: "ko",
      learningLevel: "beginner"
    });

    assert.match(prompt, /반드시 100% 자연스러운 한국어\(존댓말, 해요체\)로만 대답하세요/);
    assert.match(prompt, /생수.*2병.*사과 1개/);
    assert.doesNotMatch(prompt, /Speak in English/);
  });

  // Test 2: Korean interface + English learning → NPC prompt requires English
  it("2. Korean interface + English learning requires English in NPC prompt", () => {
    const localizedMission = getLocalizedMission(MISSIONS_CATALOG.Shop[0], "ko");
    assert.equal(localizedMission.title, "🏪 상점 미션");

    const prompt = buildNPCSystemPrompt({
      npcName: "Shop Seller",
      activeMission: localizedMission,
      learningLanguage: "en",
      learningLevel: "beginner"
    });

    assert.match(prompt, /Speak in English/);
    assert.match(prompt, /Buy exactly 2 bottles of water and 1 apple/);
    assert.doesNotMatch(prompt, /자연스러운 한국어/);
  });

  // Test 3: Interface language changes do not alter NPC response language
  it("3. Interface language changes do not alter NPC response language", () => {
    const enUiMission = getLocalizedMission(MISSIONS_CATALOG.Shop[0], "en");
    const koUiMission = getLocalizedMission(MISSIONS_CATALOG.Shop[0], "ko");

    const promptWithEnUi = buildNPCSystemPrompt({
      npcName: "Shop Seller",
      activeMission: enUiMission,
      learningLanguage: "ko"
    });

    const promptWithKoUi = buildNPCSystemPrompt({
      npcName: "Shop Seller",
      activeMission: koUiMission,
      learningLanguage: "ko"
    });

    // Both prompts must mandate Korean and forbid English replies
    assert.match(promptWithEnUi, /반드시 100% 자연스러운 한국어/);
    assert.match(promptWithKoUi, /반드시 100% 자연스러운 한국어/);
    assert.doesNotMatch(promptWithEnUi, /Speak in English/);
    assert.doesNotMatch(promptWithKoUi, /Speak in English/);
  });

  // Test 4: Learning language changes correctly update NPC prompt language
  it("4. Learning language changes correctly update NPC prompt language", () => {
    const englishPrompt = buildNPCSystemPrompt({
      npcName: "Cafe Barista",
      learningLanguage: "en"
    });
    assert.match(englishPrompt, /You are Mia/);
    assert.match(englishPrompt, /Speak in English/);

    const koreanPrompt = buildNPCSystemPrompt({
      npcName: "Cafe Barista",
      learningLanguage: "ko"
    });
    assert.match(koreanPrompt, /당신은 3D 언어 학습 마을의 랭귀지 카페에서 근무하는 따뜻하고 상냥한 카페 바리스타 미아입니다/);
    assert.match(koreanPrompt, /반드시 100% 자연스러운 한국어/);
  });

  // Test 5: Korean NPC prompts enforce natural polite conversational Korean
  it("5. Korean NPC prompts enforce natural polite conversational Korean (존댓말, 해요체)", () => {
    const prompt = buildNPCSystemPrompt({
      npcName: "Shop Seller",
      learningLanguage: "ko",
      learningLevel: "intermediate"
    });

    assert.match(prompt, /존댓말/);
    assert.match(prompt, /해요체/);
    assert.match(prompt, /기계적인 번역투나 부자연스러운 어순을 피하고/);
    assert.match(prompt, /1~3개의/);
  });

  // Test 6: Korean beginner prompts do not instruct AI to answer in English
  it("6. Korean beginner prompts do not instruct AI to answer in English", () => {
    const prompt = buildNPCSystemPrompt({
      npcName: "Shop Seller",
      learningLanguage: "ko",
      learningLevel: "beginner"
    });

    assert.match(prompt, /학습자가 영어나 서툰 말로 질문하더라도 다정하게 한국어로만 대답하세요/);
    assert.match(prompt, /영어나 로마자 발음 표기는 절대로 사용하지 마세요/);
    assert.doesNotMatch(prompt, /Reply in English/i);
    assert.doesNotMatch(prompt, /Speak in English/i);
  });

  // Test 7: TTS language follows learningLanguage, not interfaceLanguage
  it("7. TTS language follows learningLanguage, not interfaceLanguage", () => {
    const mockVoices = [
      { name: "Alex", lang: "en-US", default: true },
      { name: "Samantha", lang: "en-US", default: false },
      { name: "Yuna", lang: "ko-KR", default: false },
      { name: "Sinji", lang: "ko-KR", default: false }
    ];

    // Case A: learningLanguage = "ko" (even if UI is English)
    const voiceKo = getBestVoiceForNPC(mockVoices, "Shop Seller", "ko");
    assert.ok(voiceKo);
    assert.equal(voiceKo.lang, "ko-KR");

    // Case B: learningLanguage = "en" (even if UI is Korean)
    const voiceEn = getBestVoiceForNPC(mockVoices, "Shop Seller", "en");
    assert.ok(voiceEn);
    assert.equal(voiceEn.lang, "en-US");
  });

  // Test 8: Replay voice uses the correct language and sanitization
  it("8. Replay voice uses the correct language and sanitization", () => {
    const canReplay = canReplayVoice({ sender: "npc", status: "idle", isGenerating: false });
    assert.equal(canReplay, true);

    const cannotReplayUser = canReplayVoice({ sender: "user", status: "idle", isGenerating: false });
    assert.equal(cannotReplayUser, false);

    // Sanitization strips stage directions and asterisks
    const rawKorean = "*활짝 웃으며* 안녕하세요! (사과를 건네며) 맛있게 드세요. 😊🍎";
    const cleaned = sanitizeSpeechText(rawKorean);
    assert.equal(cleaned, "안녕하세요! 맛있게 드세요.");
  });

  // Test 9: Mission item labels can be English while NPC dialogue is Korean
  it("9. Mission item labels can be English while NPC dialogue is Korean", () => {
    // UI item label is English
    const itemLabel = getLocalizedItemName("water_bottle", "en");
    assert.equal(itemLabel, "Water Bottle");

    // NPC initial greeting is Korean
    const greeting = getNPCInitialGreeting("Shop Seller", "ko");
    assert.equal(greeting, "안녕하세요! 저희 상점에 오신 것을 환영해요. 오늘 어떤 물건을 찾으시나요?");
    assert.match(greeting, /안녕하세요/);
  });

  // Test 10: Existing English NPC behavior remains unchanged
  it("10. Existing English NPC behavior remains unchanged", () => {
    const englishGreeting = getNPCInitialGreeting("Shop Seller", "en");
    assert.equal(englishGreeting, "Hello! Welcome to our village shop. What can I get for you today?");

    const englishPrompt = buildNPCSystemPrompt({
      npcName: "Shop Seller",
      activeMission: {
        title: "First Shopping Mission",
        goal: "Buy 2 bottles of water and 1 apple."
      },
      learningLanguage: "en",
      learningLevel: "beginner"
    });

    assert.match(englishPrompt, /You are Jack, a lively and helpful shopkeeper/);
    assert.match(englishPrompt, /Village Grocery Store/);
    assert.match(englishPrompt, /Speak in English/);
  });
});
