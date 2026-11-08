import test from "node:test";
import assert from "node:assert/strict";
import {
  getNPCGender,
  getNPCProfile
} from "./npcPromptLogic.js";
import {
  getBestVoiceForNPC,
  detectVoiceGender,
  detectKoreanVoiceGender
} from "./voiceFeedbackLogic.js";
import {
  t,
  humanizeKeyFallback
} from "./i18n.js";
import { getNPCInitialGreeting } from "./npcPromptLogic.js";

// Comprehensive mock voices representing cross-platform TTS environments (macOS, Windows, Chrome)
const MOCK_SYSTEM_VOICES = [
  // English Male Voices
  { name: "Alex", lang: "en-US", voiceURI: "com.apple.speech.synthesis.voice.Alex" },
  { name: "Daniel", lang: "en-GB", voiceURI: "com.apple.speech.synthesis.voice.Daniel" },
  { name: "Microsoft David - English (United States)", lang: "en-US", voiceURI: "urn:microsoft:david" },
  { name: "Google UK English Male", lang: "en-GB", voiceURI: "Google UK English Male" },

  // English Female Voices
  { name: "Samantha", lang: "en-US", default: true, voiceURI: "com.apple.speech.synthesis.voice.Samantha" },
  { name: "Victoria", lang: "en-US", voiceURI: "com.apple.speech.synthesis.voice.Victoria" },
  { name: "Microsoft Zira - English (United States)", lang: "en-US", voiceURI: "urn:microsoft:zira" },
  { name: "Google US English", lang: "en-US", voiceURI: "Google US English" },

  // Korean Male Voices (including macOS Eddy, Reed; Windows Injoon; iOS/Apple Sinji)
  { name: "Eddy (Korean (South Korea))", lang: "ko_KR", voiceURI: "com.apple.speech.synthesis.voice.Eddy" },
  { name: "Reed (Korean (South Korea))", lang: "ko_KR", voiceURI: "com.apple.speech.synthesis.voice.Reed" },
  { name: "Sinji", lang: "ko-KR", voiceURI: "com.apple.speech.synthesis.voice.Sinji" },
  { name: "Microsoft Injoon - Korean (Korea)", lang: "ko-KR", voiceURI: "urn:microsoft:injoon" },

  // Korean Female Voices (including macOS Yuna, Flo; Windows Seoyeon; Chrome Google 한국어)
  { name: "Yuna", lang: "ko-KR", default: true, voiceURI: "com.apple.speech.synthesis.voice.Yuna" },
  { name: "Flo (Korean (South Korea))", lang: "ko_KR", voiceURI: "com.apple.speech.synthesis.voice.Flo" },
  { name: "Seoyeon", lang: "ko-KR", voiceURI: "urn:microsoft:seoyeon" },
  { name: "Google 한국어", lang: "ko-KR", voiceURI: "Google 한국어" }
];

const ALL_13_CANONICAL_NPCS = [
  { name: "Shop Seller", expectedGender: "male", characterName: "Jack" },
  { name: "Cafe Barista", expectedGender: "male", characterName: "Mia" },
  { name: "Hotel Receptionist", expectedGender: "female", characterName: "Emma" },
  { name: "Sarah", expectedGender: "female", characterName: "Sarah" },
  { name: "Bank Employee", expectedGender: "male", characterName: "David" },
  { name: "Librarian", expectedGender: "female", characterName: "Emily" },
  { name: "Police Officer", expectedGender: "male", characterName: "Alex" },
  { name: "Teacher Olivia", expectedGender: "female", characterName: "Olivia" },
  { name: "Tutor Daniel", expectedGender: "male", characterName: "Daniel" },
  { name: "Staff Mina", expectedGender: "female", characterName: "Mina" },
  { name: "Career Counselor James", expectedGender: "male", characterName: "James" },
  { name: "Coordinator Hana", expectedGender: "female", characterName: "Hana" },
  { name: "Coordinator Yuri", expectedGender: "female", characterName: "Yuri" }
];

test("Phase 3.2.2 - 1. Male NPC selects male English voice when available", () => {
  const maleNpcs = ["Shop Seller", "Cafe Barista", "Bank Employee", "Police Officer", "Tutor Daniel", "Career Counselor James"];

  for (const npc of maleNpcs) {
    const voice = getBestVoiceForNPC(MOCK_SYSTEM_VOICES, npc, "en");
    assert.ok(voice, `Expected a voice for ${npc}`);
    assert.ok(voice.lang.toLowerCase().startsWith("en"), `Expected English voice for ${npc}, got ${voice.lang}`);
    assert.equal(detectVoiceGender(voice), "male", `Expected male voice for ${npc}, got ${voice.name}`);
  }
});

test("Phase 3.2.2 - 2. Female NPC selects female English voice when available", () => {
  const femaleNpcs = ["Hotel Receptionist", "Sarah", "Librarian", "Teacher Olivia", "Staff Mina", "Coordinator Hana", "Coordinator Yuri"];

  for (const npc of femaleNpcs) {
    const voice = getBestVoiceForNPC(MOCK_SYSTEM_VOICES, npc, "en");
    assert.ok(voice, `Expected a voice for ${npc}`);
    assert.ok(voice.lang.toLowerCase().startsWith("en"), `Expected English voice for ${npc}, got ${voice.lang}`);
    assert.equal(detectVoiceGender(voice), "female", `Expected female voice for ${npc}, got ${voice.name}`);
  }
});

test("Phase 3.2.2 - 3. Male NPC selects male Korean voice when available", () => {
  const maleNpcs = ["Shop Seller", "Cafe Barista", "Bank Employee", "Police Officer", "Tutor Daniel", "Career Counselor James"];

  for (const npc of maleNpcs) {
    const voice = getBestVoiceForNPC(MOCK_SYSTEM_VOICES, npc, "ko");
    assert.ok(voice, `Expected a voice for ${npc}`);
    assert.ok(voice.lang.toLowerCase().startsWith("ko"), `Expected Korean voice for ${npc}, got ${voice.lang}`);
    assert.equal(detectVoiceGender(voice), "male", `Expected male Korean voice for ${npc}, got ${voice.name}`);
  }
});

test("Phase 3.2.2 - 4. Female NPC selects female Korean voice when available", () => {
  const femaleNpcs = ["Hotel Receptionist", "Sarah", "Librarian", "Teacher Olivia", "Staff Mina", "Coordinator Hana", "Coordinator Yuri"];

  for (const npc of femaleNpcs) {
    const voice = getBestVoiceForNPC(MOCK_SYSTEM_VOICES, npc, "ko");
    assert.ok(voice, `Expected a voice for ${npc}`);
    assert.ok(voice.lang.toLowerCase().startsWith("ko"), `Expected Korean voice for ${npc}, got ${voice.lang}`);
    assert.equal(detectVoiceGender(voice), "female", `Expected female Korean voice for ${npc}, got ${voice.name}`);
  }
});

test("Phase 3.2.2 - 5. Missing gender-specific voice falls back to same-language voice", () => {
  // Scenario: System only has Female Korean voices and Male English voices.
  // When a male NPC speaks in Korean, system must NOT pick English voice.
  const limitedVoices = [
    { name: "Alex", lang: "en-US" },
    { name: "David", lang: "en-US" },
    { name: "Yuna", lang: "ko-KR", default: true }
  ];

  const fallbackVoice = getBestVoiceForNPC(limitedVoices, "Shop Seller", "ko");
  assert.ok(fallbackVoice, "Expected a fallback voice");
  assert.equal(fallbackVoice.name, "Yuna");
  assert.ok(fallbackVoice.lang.startsWith("ko"), "Must retain Korean language even if gender differs");
});

test("Phase 3.2.2 - 6. TTS language always follows learningLanguage", () => {
  // Jack (male): Learning Korean, Interface English
  const voiceKo = getBestVoiceForNPC(MOCK_SYSTEM_VOICES, "Shop Seller", "ko");
  assert.ok(voiceKo.lang.startsWith("ko"), "Jack speaking Korean must have Korean voice");

  // Jack (male): Learning English, Interface Korean
  const voiceEn = getBestVoiceForNPC(MOCK_SYSTEM_VOICES, "Shop Seller", "en");
  assert.ok(voiceEn.lang.startsWith("en"), "Jack speaking English must have English voice");

  // Mia (female): Learning Korean
  const miaKo = getBestVoiceForNPC(MOCK_SYSTEM_VOICES, "Cafe Barista", "ko");
  assert.ok(miaKo.lang.startsWith("ko"), "Mia speaking Korean must have Korean voice");

  // Mia (female): Learning English
  const miaEn = getBestVoiceForNPC(MOCK_SYSTEM_VOICES, "Cafe Barista", "en");
  assert.ok(miaEn.lang.startsWith("en"), "Mia speaking English must have English voice");
});

test("Phase 3.2.2 - 7. Replay preserves NPC voice gender", () => {
  // Simulated replay voice calls: Replaying Jack's English speech
  const replayJackEn = getBestVoiceForNPC(MOCK_SYSTEM_VOICES, "Shop Seller", "en");
  assert.equal(detectVoiceGender(replayJackEn), "male");

  // Replaying Jack's Korean speech
  const replayJackKo = getBestVoiceForNPC(MOCK_SYSTEM_VOICES, "Shop Seller", "ko");
  assert.equal(detectVoiceGender(replayJackKo), "male");

  // Replaying Mia's English speech
  const replayMiaEn = getBestVoiceForNPC(MOCK_SYSTEM_VOICES, "Cafe Barista", "en");
  assert.equal(detectVoiceGender(replayMiaEn), "male");

  // Replaying Mia's Korean speech
  const replayMiaKo = getBestVoiceForNPC(MOCK_SYSTEM_VOICES, "Cafe Barista", "ko");
  assert.equal(detectVoiceGender(replayMiaKo), "male");
});

test("Phase 3.2.2 - 8. All 13 NPCs have explicit voice gender metadata", () => {
  assert.equal(ALL_13_CANONICAL_NPCS.length, 13);

  for (const { name, expectedGender, characterName } of ALL_13_CANONICAL_NPCS) {
    const profile = getNPCProfile(name);
    assert.ok(profile, `Profile must exist for ${name}`);
    assert.equal(profile.characterGender, expectedGender, `Explicit characterGender for ${name} must be ${expectedGender}`);
    assert.equal(profile.voiceGender, expectedGender, `Explicit voiceGender for ${name} must be ${expectedGender}`);
    assert.equal(profile.name, characterName, `Character name for ${name} must be ${characterName}`);

    // Verify helper does not infer from names
    const resolvedGender = getNPCGender(name);
    assert.equal(resolvedGender, expectedGender, `getNPCGender for ${name} must return ${expectedGender}`);
  }
});

test("Phase 3.2.2 - 9. No known translation key is displayed directly", () => {
  const sensitiveKeys = [
    "settings.interfaceLangLabel",
    "settings.interfaceLangDesc",
    "settings.learningLangLabel",
    "settings.learningLangDesc",
    "settings.levelLabel",
    "settings.levelDesc",
    "settings.saveChangesBtn",
    "settings.cancelBtn",
    "auth.signOut"
  ];

  for (const lang of ["en", "ko"]) {
    for (const key of sensitiveKeys) {
      const translated = t(key, {}, lang);
      assert.notEqual(translated, key, `Translation for ${key} in ${lang} must not equal raw key path`);
      assert.ok(!/[a-z0-9_]+\.[a-z0-9_]+/i.test(translated), `Translated text "${translated}" must not contain dot-separated key identifiers`);
      assert.notEqual(translated, "undefined", `Translation for ${key} must not be literal "undefined"`);
      assert.notEqual(translated, "Missing translation", `Translation for ${key} must not be "Missing translation"`);
    }
  }
});

test("Phase 3.2.2 - 10. Missing translation keys produce readable fallback text", () => {
  const customKey = "settings.customFeatureToggleLabel";
  const fallbackEn = t(customKey, {}, "en");
  assert.equal(fallbackEn, "Custom Feature Toggle");
  assert.ok(!fallbackEn.includes("."), "Fallback text must be human-readable, not dotted");

  const arbitraryKey = "dashboard.userProfileScore";
  assert.equal(humanizeKeyFallback(arbitraryKey), "User Profile Score");
  assert.equal(t(arbitraryKey, {}, "en"), "User Profile Score");
});

test("Phase 3.2.2 - 11. Settings labels render in English and Korean correctly", () => {
  // English terminology
  assert.equal(t("settings.interfaceLangLabel", {}, "en"), "Interface Language");
  assert.equal(t("settings.learningLangLabel", {}, "en"), "Learning Language");
  assert.equal(t("settings.levelLabel", {}, "en"), "Learning Level");
  assert.equal(t("settings.saveChangesBtn", {}, "en"), "Save Changes");
  assert.equal(t("settings.cancelBtn", {}, "en"), "Cancel");

  // Korean terminology
  assert.equal(t("settings.interfaceLangLabel", {}, "ko"), "인터페이스 언어");
  assert.equal(t("settings.learningLangLabel", {}, "ko"), "학습 언어");
  assert.equal(t("settings.levelLabel", {}, "ko"), "학습 수준");
  assert.equal(t("settings.saveChangesBtn", {}, "ko"), "변경사항 저장");
  assert.equal(t("settings.cancelBtn", {}, "ko"), "취소");
});

test("Phase 3.2.2 - 12. Existing translation interpolation and nested keys remain functional", () => {
  // Interpolation with parameters
  const welcomeEn = t("onboarding.welcomeStudent", { name: "Sarah" }, "en");
  assert.equal(welcomeEn, "Welcome, Sarah");

  const welcomeKo = t("onboarding.welcomeStudent", { name: "민호" }, "ko");
  assert.equal(welcomeKo, "환영합니다, 민호님");

  // Deeply nested keys
  const mapEn = t("hud.villageMap", {}, "en");
  assert.equal(mapEn, "VILLAGE MAP");

  const mapKo = t("hud.villageMap", {}, "ko");
  assert.equal(mapKo, "마을 지도");

  const errEn = t("onboarding.errSelectInterface", {}, "en");
  assert.equal(errEn, "Please select an interface language.");
});

test("Phase 3.2.2 - 13. Jack and David MUST select Korean male voices", () => {
  const jackVoice = getBestVoiceForNPC(MOCK_SYSTEM_VOICES, "Shop Seller", "ko");
  assert.ok(jackVoice, "Jack must receive a voice");
  assert.equal(detectKoreanVoiceGender(jackVoice), "male", `Jack must receive a male voice, got ${jackVoice.name}`);

  const davidVoice = getBestVoiceForNPC(MOCK_SYSTEM_VOICES, "Bank Employee", "ko");
  assert.ok(davidVoice, "David must receive a voice");
  assert.equal(detectKoreanVoiceGender(davidVoice), "male", `David must receive a male voice, got ${davidVoice.name}`);
});

test("Phase 3.2.2 - 14. Mia selects Korean male voice and Emma selects Korean female voice", () => {
  const miaVoice = getBestVoiceForNPC(MOCK_SYSTEM_VOICES, "Cafe Barista", "ko");
  assert.ok(miaVoice, "Mia must receive a voice");
  assert.equal(detectKoreanVoiceGender(miaVoice), "male", `Mia must receive a male voice, got ${miaVoice.name}`);

  const emmaVoice = getBestVoiceForNPC(MOCK_SYSTEM_VOICES, "Hotel Receptionist", "ko");
  assert.ok(emmaVoice, "Emma must receive a voice");
  assert.equal(detectKoreanVoiceGender(emmaVoice), "female", `Emma must receive a female voice, got ${emmaVoice.name}`);
});

test("Phase 3.2.2 - 15. Real macOS Korean voice pool assigns Eddy to male NPCs and Yuna to female NPCs", () => {
  // Actual macOS system voices installed on local Mac
  const macKoreanVoices = [
    { name: "Eddy (Korean (South Korea))", lang: "ko_KR" },
    { name: "Flo (Korean (South Korea))", lang: "ko_KR" },
    { name: "Grandma (Korean (South Korea))", lang: "ko_KR" },
    { name: "Grandpa (Korean (South Korea))", lang: "ko_KR" },
    { name: "Reed (Korean (South Korea))", lang: "ko_KR" },
    { name: "Rocko (Korean (South Korea))", lang: "ko_KR" },
    { name: "Sandy (Korean (South Korea))", lang: "ko_KR" },
    { name: "Shelley (Korean (South Korea))", lang: "ko_KR" },
    { name: "Yuna", lang: "ko_KR", default: true }
  ];

  // Male NPCs
  const jack = getBestVoiceForNPC(macKoreanVoices, "Shop Seller", "ko");
  assert.equal(detectKoreanVoiceGender(jack), "male");
  assert.equal(jack.name, "Eddy (Korean (South Korea))", "Jack must select Eddy, never Yuna");

  const david = getBestVoiceForNPC(macKoreanVoices, "Bank Employee", "ko");
  assert.equal(detectKoreanVoiceGender(david), "male");
  assert.equal(david.name, "Eddy (Korean (South Korea))", "David must select Eddy, never Yuna");

  const mia = getBestVoiceForNPC(macKoreanVoices, "Cafe Barista", "ko");
  assert.equal(detectKoreanVoiceGender(mia), "male");
  assert.equal(mia.name, "Eddy (Korean (South Korea))", "Mia (Cafe NPC) must select Eddy, never Yuna");

  // Female NPCs
  const emma = getBestVoiceForNPC(macKoreanVoices, "Hotel Receptionist", "ko");
  assert.equal(detectKoreanVoiceGender(emma), "female");
  assert.equal(emma.name, "Yuna", "Emma must select Yuna, never Eddy");
});

test("Phase 3.2.2 - 16. Real Windows Korean voice pool assigns Injoon to male NPCs and SunHi to female NPCs", () => {
  const windowsVoices = [
    { name: "Microsoft Injoon - Korean (Korea)", lang: "ko-KR" },
    { name: "Microsoft SunHi - Korean (Korea)", lang: "ko-KR" },
    { name: "Microsoft David - English (United States)", lang: "en-US" },
    { name: "Microsoft Zira - English (United States)", lang: "en-US" }
  ];

  const jack = getBestVoiceForNPC(windowsVoices, "Shop Seller", "ko");
  assert.equal(jack.name, "Microsoft Injoon - Korean (Korea)");
  assert.equal(detectKoreanVoiceGender(jack), "male");

  const mia = getBestVoiceForNPC(windowsVoices, "Cafe Barista", "ko");
  assert.equal(mia.name, "Microsoft Injoon - Korean (Korea)");
  assert.equal(detectKoreanVoiceGender(mia), "male");

  const emma = getBestVoiceForNPC(windowsVoices, "Hotel Receptionist", "ko");
  assert.equal(emma.name, "Microsoft SunHi - Korean (Korea)");
  assert.equal(detectKoreanVoiceGender(emma), "female");
});

test("Phase 3.2.2 - 17. Learning Language = Korean restricts all NPC greetings to pure Korean", () => {
  // Regardless of interface language, when learning Korean, greetings must be in Korean
  for (const { name } of ALL_13_CANONICAL_NPCS) {
    const greeting = getNPCInitialGreeting(name, "ko");
    assert.ok(greeting, `Greeting must exist for ${name}`);
    // Must contain Korean characters and no English greeting words
    assert.ok(/[가-힣]/.test(greeting), `Greeting for ${name} must contain Korean characters`);
    assert.ok(!/\b(Hello|Welcome|Good morning|Can I help)\b/i.test(greeting), `Greeting for ${name} must not contain English phrases`);
  }
});

