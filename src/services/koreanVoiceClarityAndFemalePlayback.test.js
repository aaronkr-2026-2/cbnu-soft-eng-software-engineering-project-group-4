import test from "node:test";
import assert from "node:assert/strict";
import {
  getNPCGender,
  getNPCInitialGreeting,
  buildNPCSystemPrompt
} from "./npcPromptLogic.js";
import {
  getBestVoiceForNPC,
  detectKoreanVoiceGender,
  scoreQuality,
  sanitizeSpeechText,
  runKoreanTTSDiagnostics
} from "./voiceFeedbackLogic.js";

// Mock voice pools simulating real browser environments (macOS, Windows, Chrome)
const MOCK_MACOS_VOICES = [
  { name: "Yuna", lang: "ko_KR", default: true, voiceURI: "com.apple.speech.synthesis.voice.yuna" },
  { name: "Eddy (Korean (South Korea))", lang: "ko_KR", voiceURI: "com.apple.speech.synthesis.voice.eddy" },
  { name: "Reed (Korean (South Korea))", lang: "ko_KR", voiceURI: "com.apple.speech.synthesis.voice.reed" },
  { name: "Grandma (Korean (South Korea))", lang: "ko_KR", voiceURI: "com.apple.speech.synthesis.voice.grandma" },
  { name: "Grandpa (Korean (South Korea))", lang: "ko_KR", voiceURI: "com.apple.speech.synthesis.voice.grandpa" },
  { name: "Rocko (Korean (South Korea))", lang: "ko_KR", voiceURI: "com.apple.speech.synthesis.voice.rocko" },
  { name: "Sandy (Korean (South Korea))", lang: "ko_KR", voiceURI: "com.apple.speech.synthesis.voice.sandy" },
  { name: "Shelley (Korean (South Korea))", lang: "ko_KR", voiceURI: "com.apple.speech.synthesis.voice.shelley" },
  { name: "Samantha", lang: "en_US", default: false, voiceURI: "com.apple.speech.synthesis.voice.samantha" }
];

const MOCK_WINDOWS_VOICES = [
  { name: "Microsoft SunHi - Korean (Korea)", lang: "ko-KR", voiceURI: "urn:microsoft:sunhi" },
  { name: "Microsoft Seoyeon - Korean (Korea)", lang: "ko-KR", voiceURI: "urn:microsoft:seoyeon" },
  { name: "Microsoft Injoon - Korean (Korea)", lang: "ko-KR", voiceURI: "urn:microsoft:injoon" },
  { name: "Microsoft Minho - Korean (Korea)", lang: "ko-KR", voiceURI: "urn:microsoft:minho" },
  { name: "Microsoft David - English (United States)", lang: "en-US", voiceURI: "urn:microsoft:david" },
  { name: "Microsoft Zira - English (United States)", lang: "en-US", voiceURI: "urn:microsoft:zira" }
];

const MOCK_CHROME_VOICES = [
  { name: "Google 한국어", lang: "ko-KR", default: false, voiceURI: "Google 한국어" },
  { name: "Google US English", lang: "en-US", default: true, voiceURI: "Google US English" }
];

const FEMALE_NPCS = [
  { role: "Hotel Receptionist", characterName: "Emma" },
  { role: "Sarah", characterName: "Sarah" },
  { role: "Librarian", characterName: "Emily" },
  { role: "Teacher Olivia", characterName: "Olivia" },
  { role: "Staff Mina", characterName: "Mina" },
  { role: "Coordinator Hana", characterName: "Hana" },
  { role: "Coordinator Yuri", characterName: "Yuri" }
];

const MALE_NPCS = [
  { role: "Shop Seller", characterName: "Jack" },
  { role: "Cafe Barista", characterName: "Mia" },
  { role: "Bank Employee", characterName: "David" },
  { role: "Police Officer", characterName: "Alex" },
  { role: "Tutor Daniel", characterName: "Daniel" },
  { role: "Career Counselor James", characterName: "James" }
];

test("Phase 3.2.4 - 1. Female NPCs resolve valid female gender and initial greeting by role and name", () => {
  for (const { role, characterName } of FEMALE_NPCS) {
    // Both role and characterName resolve female gender
    assert.equal(getNPCGender(role), "female", `Role ${role} must resolve female`);
    assert.equal(getNPCGender(characterName), "female", `Name ${characterName} must resolve female`);

    // Korean greeting exists, is non-empty, and contains polite 해요체
    const greetingByRole = getNPCInitialGreeting(role, "ko");
    assert.ok(greetingByRole, `Greeting must exist for ${role}`);
    assert.match(greetingByRole, /[가-힣]/, `Greeting for ${role} must contain Korean characters`);

    const greetingByName = getNPCInitialGreeting(characterName, "ko");
    assert.ok(greetingByName, `Greeting must exist for ${characterName}`);
    assert.equal(greetingByName, greetingByRole, `Greeting by role and name must match for ${role}/${characterName}`);
  }
});

test("Phase 3.2.4 - 2. Female NPCs select genuine Korean female voice across macOS, Windows, and Chrome", () => {
  for (const { role } of FEMALE_NPCS) {
    // macOS: Yuna
    const macVoice = getBestVoiceForNPC(MOCK_MACOS_VOICES, role, "ko");
    assert.ok(macVoice, `macOS voice must be found for ${role}`);
    assert.equal(macVoice.name, "Yuna", `macOS female voice must be Yuna, not novelty or male`);
    assert.equal(detectKoreanVoiceGender(macVoice), "female");

    // Windows: SunHi or Seoyeon
    const winVoice = getBestVoiceForNPC(MOCK_WINDOWS_VOICES, role, "ko");
    assert.ok(winVoice, `Windows voice must be found for ${role}`);
    assert.ok(
      winVoice.name.includes("SunHi") || winVoice.name.includes("Seoyeon"),
      `Windows female voice must be SunHi or Seoyeon, got ${winVoice.name}`
    );
    assert.equal(detectKoreanVoiceGender(winVoice), "female");

    // Chrome: Google 한국어
    const chromeVoice = getBestVoiceForNPC(MOCK_CHROME_VOICES, role, "ko");
    assert.ok(chromeVoice, `Chrome voice must be found for ${role}`);
    assert.equal(chromeVoice.name, "Google 한국어");
    assert.equal(detectKoreanVoiceGender(chromeVoice), "female");
  }
});

test("Phase 3.2.4 - 3. Korean voice unavailable -> safe Korean fallback, never English", () => {
  // Scenario A: Only Male Korean voice is installed, female NPC speaks
  const maleOnlyKorean = [
    { name: "Microsoft Injoon - Korean (Korea)", lang: "ko-KR" },
    { name: "Samantha", lang: "en-US", default: true }
  ];

  const fallbackForEmma = getBestVoiceForNPC(maleOnlyKorean, "Hotel Receptionist", "ko");
  assert.ok(fallbackForEmma, "Must return a Korean fallback voice when female voice missing");
  assert.equal(fallbackForEmma.name, "Microsoft Injoon - Korean (Korea)");
  assert.ok(fallbackForEmma.lang.startsWith("ko"), "Fallback must be in Korean");

  // Scenario B: No Korean voices installed at all
  const englishOnly = [
    { name: "Alex", lang: "en-US" },
    { name: "Samantha", lang: "en-US", default: true }
  ];

  const noVoice = getBestVoiceForNPC(englishOnly, "Cafe Barista", "ko");
  assert.equal(noVoice, null, "Must return null (never English) when no Korean voice exists in Korean mode");
});

test("Phase 3.2.4 - 4. No English fallback in Korean mode for any NPC", () => {
  const mixedVoices = [
    { name: "Samantha", lang: "en-US", default: true },
    { name: "David", lang: "en-US" },
    { name: "Victoria", lang: "en-GB" }
  ];

  for (const { role } of [...FEMALE_NPCS, ...MALE_NPCS]) {
    const voice = getBestVoiceForNPC(mixedVoices, role, "ko");
    assert.equal(voice, null, `In Korean mode, ${role} must NEVER fall back to English voice`);
  }
});

test("Phase 3.2.4 - 5. Korean male/female voice selection preserved for all 13 NPCs", () => {
  const allVoices = [...MOCK_MACOS_VOICES, ...MOCK_WINDOWS_VOICES];

  // 8 Female NPCs -> female Korean voice
  for (const { role, characterName } of FEMALE_NPCS) {
    const v = getBestVoiceForNPC(allVoices, role, "ko");
    assert.ok(v, `Expected voice for female NPC ${role}`);
    assert.equal(detectKoreanVoiceGender(v), "female", `Voice for ${role} (${characterName}) must be female`);
  }

  // 5 Male NPCs -> male Korean voice
  for (const { role, characterName } of MALE_NPCS) {
    const v = getBestVoiceForNPC(allVoices, role, "ko");
    assert.ok(v, `Expected voice for male NPC ${role}`);
    assert.equal(detectKoreanVoiceGender(v), "male", `Voice for ${role} (${characterName}) must be male`);
  }
});

test("Phase 3.2.4 - 6. Novelty voices (Rocko, Grandpa, Grandma, Sandy, Shelley) strictly deprioritized", () => {
  const noveltyVoices = [
    { name: "Rocko (Korean (South Korea))", lang: "ko_KR" },
    { name: "Grandpa (Korean (South Korea))", lang: "ko_KR" },
    { name: "Grandma (Korean (South Korea))", lang: "ko_KR" },
    { name: "Sandy (Korean (South Korea))", lang: "ko_KR" },
    { name: "Shelley (Korean (South Korea))", lang: "ko_KR" }
  ];

  for (const v of noveltyVoices) {
    assert.equal(
      detectKoreanVoiceGender(v),
      "unknown",
      `Novelty voice ${v.name} must not be detected as valid standard gender voice`
    );
    assert.ok(
      scoreQuality(v) < 0,
      `Novelty voice ${v.name} must receive negative score, got ${scoreQuality(v)}`
    );
  }

  // When native voice Yuna and novelty voices compete, Yuna must win
  const poolWithNovelties = [...noveltyVoices, { name: "Yuna", lang: "ko_KR", default: false }];
  const chosenFemale = getBestVoiceForNPC(poolWithNovelties, "Hotel Receptionist", "ko");
  assert.equal(chosenFemale.name, "Yuna");
});

test("Phase 3.2.4 - 7. Speech text sanitization strips emojis, pictographs, brackets, and redundant punctuation", () => {
  const dirty = "Shop Seller: *미소를 지으며* 안녕하세요! 😊🍎 [웃음] 사과 하나 드릴까요??? (손을 흔들며)";
  const clean = sanitizeSpeechText(dirty);

  assert.equal(clean, "안녕하세요! 사과 하나 드릴까요?");
  assert.ok(!clean.includes("😊"), "Emojis must be stripped");
  assert.ok(!clean.includes("🍎"), "Pictographs must be stripped");
  assert.ok(!clean.includes("*"), "Asterisks must be stripped");
  assert.ok(!clean.includes("["), "Brackets must be stripped");
  assert.ok(!clean.includes("("), "Parentheses must be stripped");
  assert.ok(!clean.includes("Shop Seller:"), "Speaker prefixes must be stripped");
  assert.ok(!clean.includes("???"), "Repeated punctuation must be normalized");
});

test("Phase 3.2.4 - 8. Korean prompt generation adheres to polite 해요체 and clean spoken guidelines", () => {
  const prompt = buildNPCSystemPrompt({
    npcName: "Cafe Barista",
    learningLanguage: "ko",
    learningLevel: "beginner"
  });

  assert.match(prompt, /존댓말\(해요체\)/, "Must enforce polite 해요체");
  assert.match(prompt, /초급자/, "Must calibrate for beginner learner");
  assert.match(prompt, /이모지/, "Must forbid emojis in output");
  assert.match(prompt, /순수한 대사만 출력하세요/, "Must require pure spoken dialogue");
  assert.doesNotMatch(prompt, /Reply in English/i, "Must not instruct to reply in English");
});

test("Phase 3.2.4 - 9. Diagnostic utility returns structured data for male, female, and selected NPC", () => {
  const report = runKoreanTTSDiagnostics(MOCK_MACOS_VOICES, { npcName: "Cafe Barista" });

  assert.equal(typeof report.totalVoices, "number");
  assert.ok(report.koreanVoicesCount > 0, "Must report Korean voices count");

  // Male diagnostic
  assert.equal(report.male.expectedGender, "male");
  assert.equal(report.male.suggestedRate, 0.90);
  assert.equal(report.male.suggestedPitch, 0.98);

  // Female diagnostic
  assert.equal(report.female.expectedGender, "female");
  assert.equal(report.female.selectedVoice, "Yuna");
  assert.equal(report.female.suggestedRate, 0.90);
  assert.equal(report.female.suggestedPitch, 1.02);

  // Selected NPC diagnostic
  assert.ok(report.selectedNPC, "Must include selectedNPC report");
  assert.equal(report.selectedNPC.npc, "Cafe Barista");
  assert.equal(report.selectedNPC.gender, "male");
  assert.equal(report.selectedNPC.selectedVoice, "Eddy (Korean (South Korea))");
});
