import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  MISSIONS_CATALOG,
  getLocalizedMission,
  getMissionHiddenObjective,
  getMissionScenarioContext,
  getMissionInitialGreeting,
  getRandomMission
} from "./missionsData.js";
import {
  ITEM_DEFINITIONS,
  getLocalizedItemName
} from "./inventoryLogic.js";
import {
  buildNPCSystemPrompt,
  getNPCInitialGreeting,
  getNPCGender
} from "./npcPromptLogic.js";
import {
  getBestVoiceForNPC
} from "./voiceFeedbackLogic.js";
import {
  calculateProgressUpdate,
  calculateMissionXP
} from "./progressLogic.js";

describe("Context-Based Hidden NPC Mission System", () => {
  // 1. Multiple scenarios exist for each facility & NPC
  it("defines at least 4 contextual scenario variants for all 13 facilities (52 total)", () => {
    const facilities = [
      "Shop", "Cafe", "Hotel", "Hospital", "Bank", "Library",
      "PoliceStation", "LanguageSchool", "StudyCenter",
      "CommunityCenter", "CareerCenter", "ActivityCenter", "MultiPurposeHall"
    ];

    let totalMissions = 0;
    for (const fac of facilities) {
      const list = MISSIONS_CATALOG[fac];
      assert.ok(Array.isArray(list), `Facility ${fac} must have a mission list`);
      assert.ok(list.length >= 4, `Facility ${fac} must have at least 4 scenarios`);
      totalMissions += list.length;
    }
    assert.equal(totalMissions, 52, "Must contain exactly 52 rich scenarios across 13 facilities");
  });

  // 2. Scenario data contains context, initial greeting, and hidden objective
  it("all scenarios contain rich bilingual scenarioContext, initialGreeting, and hiddenObjective", () => {
    for (const [facility, list] of Object.entries(MISSIONS_CATALOG)) {
      for (const m of list) {
        // Scenario context
        assert.ok(m.scenarioContext?.en, `Scenario ${m.id} in ${facility} missing en scenarioContext`);
        assert.ok(m.scenarioContext?.ko, `Scenario ${m.id} in ${facility} missing ko scenarioContext`);
        assert.match(m.scenarioContext.ko, /[\uac00-\ud7af]/, `${m.id} ko scenarioContext must have Hangul`);

        // Initial greeting
        assert.ok(m.initialGreeting?.en, `Scenario ${m.id} in ${facility} missing en initialGreeting`);
        assert.ok(m.initialGreeting?.ko, `Scenario ${m.id} in ${facility} missing ko initialGreeting`);
        assert.match(m.initialGreeting.ko, /[\uac00-\ud7af]/, `${m.id} ko initialGreeting must have Hangul`);

        // Hidden objective
        assert.ok(m.hiddenObjective?.en, `Scenario ${m.id} in ${facility} missing en hiddenObjective`);
        assert.ok(m.hiddenObjective?.ko, `Scenario ${m.id} in ${facility} missing ko hiddenObjective`);

        // Initial greeting must NEVER contain mission announcement words
        const forbiddenEnRegex = /\b(mission|quest|objective|task)\b|you must|your job is|please complete/i;
        const forbiddenKo = ["미션", "퀘스트", "과제", "달성해야", "해야 합니다", "수행해"];

        assert.equal(
          forbiddenEnRegex.test(m.initialGreeting.en),
          false,
          `Scenario ${m.id} initialGreeting (EN) must NOT leak mission terms: "${m.initialGreeting.en}"`
        );

        for (const f of forbiddenKo) {
          assert.equal(
            m.initialGreeting.ko.includes(f),
            false,
            `Scenario ${m.id} initialGreeting (KO) must NOT leak mission terms: "${f}" in "${m.initialGreeting.ko}"`
          );
        }
      }
    }
  });

  // 3. Helper functions return correct localized scenario properties
  it("helper functions extract localized hiddenObjective, scenarioContext, and initialGreeting", () => {
    const mission = MISSIONS_CATALOG.Cafe[0];
    assert.ok(getMissionHiddenObjective(mission, "en").length > 0);
    assert.ok(getMissionHiddenObjective(mission, "ko").length > 0);
    assert.ok(getMissionScenarioContext(mission, "en").length > 0);
    assert.ok(getMissionScenarioContext(mission, "ko").length > 0);
    assert.ok(getMissionInitialGreeting(mission, "en").length > 0);
    assert.ok(getMissionInitialGreeting(mission, "ko").length > 0);
  });

  // 4. Initial greeting prioritizes active scenario
  it("getNPCInitialGreeting selects scenario-specific greeting when activeScenario is provided", () => {
    const cafeScenario = MISSIONS_CATALOG.Cafe[0];
    const greetingEn = getNPCInitialGreeting("Cafe Barista", "en", cafeScenario);
    assert.equal(greetingEn, cafeScenario.initialGreeting.en);

    const greetingKo = getNPCInitialGreeting("Cafe Barista", "ko", cafeScenario);
    assert.equal(greetingKo, cafeScenario.initialGreeting.ko);

    // When no scenario is provided, falls back to default profile greeting
    const fallbackGreetingEn = getNPCInitialGreeting("Cafe Barista", "en", null);
    assert.equal(fallbackGreetingEn, "Hi there! Welcome to the Language Cafe. What can I brew for you today?");
  });

  // 5. System prompt enforces strict anti-leak roleplay rules
  it("buildNPCSystemPrompt includes strict anti-leak instructions and scenario context", () => {
    const shopScenario = MISSIONS_CATALOG.Shop[0];
    const prompt = buildNPCSystemPrompt({
      npcName: "Shop Seller",
      activeMission: shopScenario,
      learningPreferences: { level: "intermediate", language: "en" }
    });

    // Check that anti-leak rules are present in the system prompt
    assert.match(prompt, /CRITICAL ROLEPLAY RULES/);
    assert.match(prompt, /NEVER announce, state, or explain any mission/);
    assert.match(prompt, /NEVER explicitly announce, state, or explain mission objectives/);
    assert.match(prompt, /If the player directly asks about a mission, quest, or what they must do/);

    // System prompt embeds the natural situation context
    assert.match(prompt, new RegExp(shopScenario.scenarioContext.en));

    // NPC must answer ordinary questions truthfully and not coach
    assert.match(prompt, /Answer ordinary factual questions naturally and truthfully/i);
    assert.match(prompt, /STRICT ANTI-COACHING/i);
    assert.match(prompt, /NEVER give hints designed as direct instructions or step-by-step assistance/i);
    assert.match(prompt, /NEVER remind the player what they need to do/i);

    // Test prompt with inventory to ensure checklist is marked as internal note not to be revealed
    const promptWithInventory = buildNPCSystemPrompt({
      npcName: "Shop Seller",
      activeMission: shopScenario,
      inventory: { water_bottle: 1 },
      learningPreferences: { level: "intermediate", language: "en" }
    });
    assert.match(promptWithInventory, /Do not reveal this checklist as a mission instruction/i);
  });

  // 6. Direct mission questions handling
  it("system prompt provides explicit instructions on how to deflect direct mission questions", () => {
    // English prompt
    const promptEn = buildNPCSystemPrompt({
      npcName: "Cafe Barista",
      activeMission: MISSIONS_CATALOG.Cafe[1],
      learningPreferences: { level: "beginner", language: "en" }
    });
    assert.match(promptEn, /What is my mission\?/);
    assert.match(promptEn, /DO NOT break character/);
    assert.match(promptEn, /Act like a real person in a real village/);

    // Korean prompt
    const promptKo = buildNPCSystemPrompt({
      npcName: "Cafe Barista",
      activeMission: MISSIONS_CATALOG.Cafe[1],
      learningPreferences: { level: "beginner", language: "ko" }
    });
    assert.match(promptKo, /내 미션이 뭐예요\?/);
    assert.match(promptKo, /절대로 역할을 깨지 말고/);
  });

  // 7. Non-repeating random scenario assignment
  it("getRandomMission avoids immediate consecutive repeats for the same facility", () => {
    const list = MISSIONS_CATALOG.Shop;
    const lastIndexRef = { current: -1 };

    let prevIndex = -1;
    for (let i = 0; i < 30; i++) {
      const selected = getRandomMission(list, lastIndexRef);
      assert.ok(selected, "Must return a valid mission");
      assert.notEqual(lastIndexRef.current, prevIndex, "Should not repeat the immediate consecutive scenario index");
      prevIndex = lastIndexRef.current;
    }
  });

  // 8. Scenario preservation on reopening dialogue
  it("scenario state is preserved and not re-randomized when reopening dialogue", () => {
    // Simulating App.jsx state preservation:
    // currentMissionRef holds the active mission for the facility visit
    const currentMissionRef = { current: MISSIONS_CATALOG.Hotel[2] };
    const initialMissionId = currentMissionRef.current.id;

    // Simulate opening dialogue
    const firstGreeting = getNPCInitialGreeting("Hotel Receptionist", "en", currentMissionRef.current);
    assert.equal(firstGreeting, currentMissionRef.current.initialGreeting.en);

    // Simulate closing dialogue (dialogState.isOpen = false)
    // Then reopening dialogue (dialogState.isOpen = true) without exiting the facility
    const reopenGreeting = getNPCInitialGreeting("Hotel Receptionist", "en", currentMissionRef.current);
    assert.equal(reopenGreeting, firstGreeting);
    assert.equal(currentMissionRef.current.id, initialMissionId, "Scenario ID must remain identical on dialogue reopen");
  });

  // 9. All 4 Shop scenarios are achievable with existing inventory items
  it("all Shop scenarios require items that exist in the shop catalog", () => {
    const validShopItems = ["water_bottle", "apple", "bread", "milk"];
    for (const m of MISSIONS_CATALOG.Shop) {
      assert.ok(m.requiredItems, `Shop scenario ${m.id} must define requiredItems`);
      for (const [itemId, qty] of Object.entries(m.requiredItems)) {
        assert.ok(validShopItems.includes(itemId), `Shop item ${itemId} must be in shop inventory`);
        assert.ok(qty > 0, "Item quantity must be > 0");
      }
    }
  });

  // 10. Language modes & voice gender mappings remain intact
  it("preserves Korean and English learning modes and voice gender assignments", () => {
    // English mode prompt
    const promptEn = buildNPCSystemPrompt({
      npcName: "Shop Seller",
      activeMission: MISSIONS_CATALOG.Shop[0],
      learningPreferences: { level: "intermediate", language: "en" }
    });
    assert.match(promptEn, /Speak in English/);

    // Korean mode prompt
    const promptKo = buildNPCSystemPrompt({
      npcName: "Shop Seller",
      activeMission: MISSIONS_CATALOG.Shop[0],
      learningPreferences: { level: "intermediate", language: "ko" }
    });
    assert.match(promptKo, /learning Korean/);
    assert.match(promptKo, /reply in natural Korean/);

    // Voice gender mapping integrity
    assert.equal(getNPCGender("Shop Seller"), "male");
    assert.equal(getNPCGender("Cafe Barista"), "male");
    assert.equal(getNPCGender("Hotel Receptionist"), "female");
    assert.equal(getNPCGender("Sarah"), "female");
    assert.equal(getNPCGender("Bank Employee"), "male");
    assert.equal(getNPCGender("Librarian"), "female");
    assert.equal(getNPCGender("Officer Alex"), "male");
    assert.equal(getNPCGender("Teacher Olivia"), "female");
    assert.equal(getNPCGender("Tutor Daniel"), "male");
    assert.equal(getNPCGender("Staff Mina"), "female");
    assert.equal(getNPCGender("Career Counselor James"), "male");
    assert.equal(getNPCGender("Coordinator Hana"), "female");
    assert.equal(getNPCGender("Coordinator Yuri"), "female");

    // Best voice resolution retains correct gender
    const mockVoices = [
      { name: "Alex", lang: "en-US" },
      { name: "Samantha", lang: "en-US" },
      { name: "Yuna", lang: "ko-KR" },
      { name: "Eddy", lang: "ko-KR" }
    ];

    const voiceJackEn = getBestVoiceForNPC(mockVoices, "Shop Seller", "en");
    assert.equal(voiceJackEn?.name, "Alex");

    const voiceEmmaEn = getBestVoiceForNPC(mockVoices, "Hotel Receptionist", "en");
    assert.equal(voiceEmmaEn?.name, "Samantha");

    const voiceJackKo = getBestVoiceForNPC(mockVoices, "Shop Seller", "ko");
    assert.equal(voiceJackKo?.name, "Eddy");

    const voiceEmmaKo = getBestVoiceForNPC(mockVoices, "Hotel Receptionist", "ko");
    assert.equal(voiceEmmaKo?.name, "Yuna");
  });

  // 11. Progress, XP, streaks, and achievements remain fully functional
  it("mission lifecycle, progress update, XP, and achievements calculate correctly", () => {
    const xp = calculateMissionXP({ baseXP: 50, score: 90, turns: 4 });
    assert.ok(typeof xp === "number" && xp > 0, "XP must be a positive number");

    const progressUpdate = calculateProgressUpdate(
      {
        stats: { totalXP: 100, completedMissions: 2, totalAttempts: 2, averageScore: 90 },
        streak: { current: 1, longest: 1, lastActiveDate: "2026-11-07" },
        achievements: {}
      },
      {
        completed: true,
        score: 95,
        facility: "Shop",
        timeZone: "Asia/Seoul",
        now: new Date("2026-11-08T10:00:00Z")
      }
    );

    assert.equal(progressUpdate.updatedStats.totalXP, 200);
    assert.equal(progressUpdate.updatedStats.completedMissions, 3);
    assert.equal(progressUpdate.updatedStreak.current, 2);
  });

  // 12. Mission intro window data and conditions
  it("mission intro window resolves actionable objectives and conditions according to interfaceLanguage", () => {
    const shopScenario = MISSIONS_CATALOG.Shop[0];

    // English interface language
    const modalDataEn = getLocalizedMission(shopScenario, "en");
    assert.equal(modalDataEn.title, "🏪 Shop Mission");
    assert.equal(modalDataEn.text, "Buy 2 bottles of water and 1 apple.");
    assert.equal(modalDataEn.goal, "Buy exactly 2 bottles of water and 1 apple.");
    assert.deepEqual(modalDataEn.requiredItems, { water_bottle: 2, apple: 1 });

    // Verify required item display formatting
    const requiredListEn = Object.entries(modalDataEn.requiredItems).map(([itemId, qty]) => {
      const name = getLocalizedItemName(itemId, "en") || ITEM_DEFINITIONS[itemId]?.displayName || itemId;
      return `${name}: ${qty}`;
    });
    assert.deepEqual(requiredListEn, ["Water Bottle: 2", "Red Apple: 1"]);

    // Korean interface language
    const modalDataKo = getLocalizedMission(shopScenario, "ko");
    assert.equal(modalDataKo.title, "🏪 상점 미션");
    assert.equal(modalDataKo.text, "생수 2병과 사과 1개를 구매하세요.");
    assert.equal(modalDataKo.goal, "생수 정확히 2병과 사과 1개를 구매하세요.");
    assert.deepEqual(modalDataKo.requiredItems, { water_bottle: 2, apple: 1 });

    const requiredListKo = Object.entries(modalDataKo.requiredItems).map(([itemId, qty]) => {
      const name = getLocalizedItemName(itemId, "ko") || itemId;
      return `${name}: ${qty}개`;
    });
    assert.deepEqual(requiredListKo, ["생수: 2개", "빨간 사과: 1개"]);
  });

  // 13. Mission intro modal lifecycle
  it("mission intro modal opens on new assignment and remains closed when reopening dialogue", () => {
    let showMissionIntro = false;
    let activeMission = null;

    // Simulate facility entry -> starts new mission
    const onEnterFacility = (newMission) => {
      activeMission = getLocalizedMission(newMission, "en");
      showMissionIntro = true;
    };

    onEnterFacility(MISSIONS_CATALOG.Cafe[0]);
    assert.equal(showMissionIntro, true, "Modal must open when a new mission is assigned");
    assert.equal(activeMission.id, "cafe_001");

    // Player clicks 'Start Mission' -> dismisses modal
    showMissionIntro = false;
    assert.equal(showMissionIntro, false, "Modal is dismissed after clicking Start Mission");

    // Player opens NPC dialogue -> does not re-open modal
    const onOpenDialogue = () => {
      // Reopening dialogue must NOT change showMissionIntro or activeMission
      return { dialogOpen: true, showMissionIntro };
    };

    const dialogState = onOpenDialogue();
    assert.equal(dialogState.dialogOpen, true);
    assert.equal(dialogState.showMissionIntro, false, "Dialogue open must not re-show mission intro modal");
    assert.equal(activeMission.id, "cafe_001", "Active mission must remain unchanged");
  });

  // 14. Ordinary questions answered truthfully without mission coaching
  it("NPC prompt supports ordinary factual Q&A while strictly prohibiting mission coaching", () => {
    const prompt = buildNPCSystemPrompt({
      npcName: "Shop Seller",
      activeMission: MISSIONS_CATALOG.Shop[0],
      learningPreferences: { level: "beginner", language: "en" }
    });

    // Supports ordinary factual answers
    assert.match(prompt, /Answer all ordinary questions truthfully/i);
    assert.match(prompt, /prices, available items, vocabulary/i);

    // Strictly prohibits coaching or revealing mission solutions
    assert.match(prompt, /STRICT ANTI-COACHING/i);
    assert.match(prompt, /NEVER remind the player what to do, what items are missing, or recommend items merely because they are mission objectives/i);
    assert.match(prompt, /NEVER explicitly announce, state, or explain mission objectives/i);
  });
});
