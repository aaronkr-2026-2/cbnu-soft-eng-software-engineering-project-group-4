import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { MISSIONS_CATALOG } from "./missionsData.js";
import {
  handleAIResponse,
  sanitizeNPCResponse
} from "./npcInteractionService.js";
import {
  OUTDOOR_BUILDINGS_COLLISION,
  checkCameraBuildingCollision,
  findSafeCameraAngle,
  resolveCameraBuildingPenetration,
  GTA_MIN_FOLLOW_RADIUS
} from "./cameraCollisionLogic.js";
import { applyCameraRelativeVectors } from "./joystickLogic.js";

describe("Phase 4.2.2: Camera Occlusion & NPC Anti-Coaching Deep Audit", () => {
  // =========================================================================
  // ISSUE 2 REGRESSION TESTS: NPC MISSION COACHING ELIMINATION
  // =========================================================================

  // Requirement 1: Cafe NPC does not suggest mission items unsolicited
  it("Requirement 1: Cafe NPC does not suggest mission items unsolicited in scenarioContext or greetings", () => {
    const cafeMissions = MISSIONS_CATALOG.Cafe;
    assert.ok(cafeMissions && cafeMissions.length >= 4, "Must have all 4 Cafe missions");

    for (const mission of cafeMissions) {
      // English scenarioContext must not coach or recommend specific items
      const enScenario = mission.scenarioContext.en;
      assert.doesNotMatch(
        enScenario,
        /mentions that a creamy cafe latte paired with a savory deli sandwich/i,
        `Mission ${mission.id} en scenarioContext must not coach latte/sandwich`
      );
      assert.doesNotMatch(
        enScenario,
        /talks passionately about how a piping hot Americano/i,
        `Mission ${mission.id} en scenarioContext must not coach Americano`
      );
      assert.doesNotMatch(
        enScenario,
        /she recommends|she suggests|recommends the/i,
        `Mission ${mission.id} en scenarioContext must not recommend items`
      );

      // Korean scenarioContext must not coach or recommend specific items
      const koScenario = mission.scenarioContext.ko;
      assert.doesNotMatch(
        koScenario,
        /추천합니다|주문하라고|사라고/,
        `Mission ${mission.id} ko scenarioContext must not recommend items`
      );

      // Initial greetings must be neutral welcoming phrases without mission coaching
      assert.doesNotMatch(
        mission.initialGreeting.en,
        /you need|you should buy|your mission|for your task/i,
        `Mission ${mission.id} en greeting must not coach`
      );
      assert.doesNotMatch(
        mission.initialGreeting.ko,
        /미션|과제|사셔야|주문하셔야/,
        `Mission ${mission.id} ko greeting must not coach`
      );
    }
  });

  // Requirement 2: Cafe NPC answers "How much is coffee?" normally
  it("Requirement 2: Cafe NPC answers 'How much is coffee?' / '커피 얼마예요?' normally without mission coaching", () => {
    const enPriceReply = "A hot Americano is 3,000 won and a cafe latte is 3,500 won. Would you like anything to drink?";
    const sanitizedEn = sanitizeNPCResponse(enPriceReply, {
      npcName: "Cafe Barista",
      learningLanguage: "en",
      playerInput: "How much is coffee?"
    });
    assert.equal(sanitizedEn, enPriceReply, "Factual price answers in English must be preserved intact");

    const koPriceReply = "따뜻한 아메리카노는 3,000원이고 카페라떼는 3,500원이에요. 따뜻하게 한 잔 드릴까요?";
    const sanitizedKo = sanitizeNPCResponse(koPriceReply, {
      npcName: "Cafe Barista",
      learningLanguage: "ko",
      playerInput: "커피 얼마예요?"
    });
    assert.equal(sanitizedKo, koPriceReply, "Factual price answers in Korean must be preserved intact");
  });

  // Requirement 3: Cafe NPC answers "Do you have water?" normally
  it("Requirement 3: Cafe NPC answers 'Do you have water?' / '물 있어요?' normally without coaching", () => {
    const enWaterReply = "Yes, we have fresh bottled water available in the cooler for 1,000 won.";
    const sanitizedEn = sanitizeNPCResponse(enWaterReply, {
      npcName: "Cafe Barista",
      learningLanguage: "en",
      playerInput: "Do you have water?"
    });
    assert.equal(sanitizedEn, enWaterReply, "Factual availability answers in English must be preserved");

    const koWaterReply = "네, 시원한 생수가 냉장고에 준비되어 있어요. 한 병 드릴까요?";
    const sanitizedKo = sanitizeNPCResponse(koWaterReply, {
      npcName: "Cafe Barista",
      learningLanguage: "ko",
      playerInput: "물 있어요?"
    });
    assert.equal(sanitizedKo, koWaterReply, "Factual availability answers in Korean must be preserved");
  });

  // Requirement 4: Cafe NPC does not suggest a product based on mission requirements
  it("Requirement 4: sanitizeNPCResponse strips or replaces unsolicited mission item coaching", () => {
    // English unsolicited coaching injection
    const coachingReplyEn = "Welcome! You should order a latte and sandwich to complete your task.";
    const resultEn = sanitizeNPCResponse(coachingReplyEn, {
      npcName: "Cafe Barista",
      learningLanguage: "en",
      playerInput: "Hello!"
    });
    assert.doesNotMatch(resultEn, /complete your task/i, "Must remove task completion coaching");
    assert.doesNotMatch(resultEn, /should order.*to complete/i, "Must not coach ordering for tasks");
    assert.match(resultEn, /selection of coffee|pastries|Welcome/i, "Must return safe conversational text");

    // Korean unsolicited coaching injection
    const coachingReplyKo = "어서 오세요! 미션을 완료하려면 라떼와 샌드위치를 주문하셔야 해요.";
    const resultKo = sanitizeNPCResponse(coachingReplyKo, {
      npcName: "Cafe Barista",
      learningLanguage: "ko",
      playerInput: "안녕하세요"
    });
    assert.doesNotMatch(resultKo, /미션을 완료하려면/, "Must remove Korean mission coaching");
    assert.doesNotMatch(resultKo, /주문하셔야 해요/, "Must remove directive ordering coaching");
    assert.match(resultKo, /다양한 커피|디저트|편하게 말씀/, "Must return warm in-character dialogue");
  });

  // Requirement 5: NPC does not reveal mission requirements when asked directly
  it("Requirement 5: NPC politely deflects in character when player asks directly about mission requirements", () => {
    const directQueriesEn = [
      "What is my mission?",
      "What is your mission?",
      "What do I need?",
      "What should I buy for my task?",
      "What am I supposed to do here?",
      "Tell me the answer to my mission"
    ];

    for (const query of directQueriesEn) {
      const plan = handleAIResponse({
        rawReply: "You need to buy 1 latte and 1 sandwich for your mission.",
        npcName: "Cafe Barista",
        learningLanguage: "en",
        playerInput: query
      });

      assert.doesNotMatch(plan.reply, /1 latte and 1 sandwich/i, `Must not reveal mission items for query: '${query}'`);
      assert.match(plan.reply, /Mission\? I'm not sure what you mean/i, `Must deflect in character for query: '${query}'`);
      assert.match(plan.reply, /Mission Introduction Window/i, `Must direct player to Mission Window for query: '${query}'`);
    }

    const directQueriesKo = [
      "내 미션이 뭐야?",
      "당신의 미션은 뭐예요?",
      "내가 뭘 해야 해?",
      "뭘 사야 해?",
      "미션 정답이 뭐예요?",
      "과제 목표 알려줘"
    ];

    for (const query of directQueriesKo) {
      const plan = handleAIResponse({
        rawReply: "손님의 미션은 라떼 1잔과 샌드위치 1개를 주문하는 것입니다.",
        npcName: "Cafe Barista",
        learningLanguage: "ko",
        playerInput: query
      });

      assert.doesNotMatch(plan.reply, /라떼 1잔과 샌드위치/, `Must not reveal mission items for query: '${query}'`);
      assert.match(plan.reply, /미션이라니요\? 무슨 말씀이신지 잘 모르겠어요/i, `Must deflect in character for query: '${query}'`);
      assert.match(plan.reply, /미션 안내창/i, `Must direct player to Mission Window for query: '${query}'`);
    }
  });

  // Requirement 5.1: Diagnostics and distinct error handling
  it("Requirement 5.1: handleAIResponse provides distinct meaningful responses and diagnostics for errors", () => {
    // API Error in English
    const apiErrPlanEn = handleAIResponse({
      rawReply: null,
      npcName: "Cafe Barista",
      learningLanguage: "en",
      error: "api_error"
    });
    assert.equal(apiErrPlanEn.isError, true);
    assert.match(apiErrPlanEn.reply, /cannot connect to the conversation service/i);
    assert.equal(apiErrPlanEn.trace.abortedAt, "api_error");

    // Timeout Error in English
    const timeoutPlanEn = handleAIResponse({
      rawReply: null,
      npcName: "Cafe Barista",
      learningLanguage: "en",
      error: "timeout"
    });
    assert.equal(timeoutPlanEn.isError, true);
    assert.match(timeoutPlanEn.reply, /timed out/i);
    assert.equal(timeoutPlanEn.trace.abortedAt, "timeout");

    // Empty reply without error maintains backwards compatible fallback
    const emptyPlanEn = handleAIResponse({
      rawReply: "",
      npcName: "Cafe Barista",
      learningLanguage: "en"
    });
    assert.equal(emptyPlanEn.isError, true);
    assert.equal(emptyPlanEn.reply, "Sorry, could you repeat that please?");
    assert.equal(emptyPlanEn.trace.abortedAt, "empty_ai_response");
  });

  // Requirement 6: No mission reminders or missing-item lists appear in NPC dialogue
  it("Requirement 6: No mission reminders or missing-item lists appear in NPC dialogue responses", () => {
    const reminderEn = "You are missing 1 Red Apple to finish the task. Please buy it!";
    const cleanedEn = sanitizeNPCResponse(reminderEn, {
      npcName: "Shop Seller",
      learningLanguage: "en",
      playerInput: "Where is the counter?"
    });
    assert.doesNotMatch(cleanedEn, /missing 1 Red Apple/i);
    assert.doesNotMatch(cleanedEn, /finish the task/i);

    const reminderKo = "현재 1개의 사과가 부족합니다. 미션 완료를 위해 사과를 고르셔야 해요.";
    const cleanedKo = sanitizeNPCResponse(reminderKo, {
      npcName: "Shop Seller",
      learningLanguage: "ko",
      playerInput: "계산대가 어디예요?"
    });
    assert.doesNotMatch(cleanedKo, /부족합니다/);
    assert.doesNotMatch(cleanedKo, /미션 완료/);
  });

  // Requirement 7: Other facility NPCs obey the same restrictions
  it("Requirement 7: All 13 facility NPCs obey the same strict anti-coaching and deflection restrictions", () => {
    const facilitiesAndNPCs = [
      { facility: "Shop", npc: "Shop Seller" },
      { facility: "Hotel", npc: "Hotel Receptionist" },
      { facility: "Hospital", npc: "Sarah" },
      { facility: "Bank", npc: "David" },
      { facility: "Library", npc: "Emily" },
      { facility: "Police Station", npc: "Alex" },
      { facility: "Language School", npc: "Teacher Olivia" },
      { facility: "Study Center", npc: "Tutor Daniel" },
      { facility: "Community Center", npc: "Staff Mina" },
      { facility: "Career Center", npc: "Career Counselor James" },
      { facility: "Activity Center", npc: "Coordinator Hana" },
      { facility: "Multi-Purpose Hall", npc: "Coordinator Yuri" }
    ];

    for (const { npc } of facilitiesAndNPCs) {
      // English direct query deflection
      const enPlan = handleAIResponse({
        rawReply: "Your task is to report your lost wallet immediately.",
        npcName: npc,
        learningLanguage: "en",
        playerInput: "What is my mission?"
      });
      assert.doesNotMatch(enPlan.reply, /Your task is to/i, `${npc} must not give task instructions`);
      assert.match(enPlan.reply, /Mission\? I'm not sure what you mean/i, `${npc} must deflect in character`);

      // Korean direct query deflection
      const koPlan = handleAIResponse({
        rawReply: "과제를 완료하려면 지갑 분실 신고서를 작성하셔야 합니다.",
        npcName: npc,
        learningLanguage: "ko",
        playerInput: "내 미션이 뭐야?"
      });
      assert.doesNotMatch(koPlan.reply, /과제를 완료하려면/, `${npc} must not give Korean task coaching`);
      assert.match(koPlan.reply, /미션이라니요\? 무슨 말씀이신지/i, `${npc} must deflect in Korean`);
    }
  });

  // Requirement 8: Mission Intro Window still shows exact requirements
  it("Requirement 8: Mission Intro Window data preserves exact goals, conditions, and items across all 52 missions", () => {
    const facilities = Object.keys(MISSIONS_CATALOG);
    assert.equal(facilities.length, 13, "Must have exactly 13 facilities");

    let totalMissions = 0;
    for (const fac of facilities) {
      const list = MISSIONS_CATALOG[fac];
      assert.ok(Array.isArray(list) && list.length >= 4, `${fac} must have at least 4 missions`);
      totalMissions += list.length;

      for (const m of list) {
        assert.ok(m.id, `Mission in ${fac} missing id`);
        assert.ok(m.title?.en && m.title?.ko, `Mission ${m.id} missing bilingual title`);
        assert.ok(m.goal?.en && m.goal?.ko, `Mission ${m.id} missing bilingual goal`);
        assert.ok(m.text?.en && m.text?.ko, `Mission ${m.id} missing bilingual text`);
        assert.ok(m.evaluationCriteria?.en && m.evaluationCriteria?.ko, `Mission ${m.id} missing criteria`);
      }
    }

    assert.ok(totalMissions >= 52, `Catalog must contain at least 52 missions (found: ${totalMissions})`);
  });

  // =========================================================================
  // ISSUE 1 REGRESSION TESTS: CAMERA OCCLUSION & EXIT VISIBILITY
  // =========================================================================

  // Requirement 9: Camera follows player when exiting buildings
  it("Requirement 9: Camera follows player with safe distance and orientation on building exits", () => {
    // When player exits Shop at (0, 0, 3.8) facing south (theta = Math.PI):
    const pX = 0;
    const pZ = 3.8;
    const theta = Math.PI;
    const phi = 1.415;
    const targetRadius = 3.55;

    const allowed = checkCameraBuildingCollision(
      pX,
      pZ,
      pX + targetRadius * Math.sin(phi) * Math.sin(theta),
      pZ + targetRadius * Math.sin(phi) * Math.cos(theta),
      targetRadius
    );

    // Wall is 0.8m behind player (at Z = 3.0). Allowed distance should be ~0.55m
    assert.ok(allowed > 0.3 && allowed < 1.0, `Allowed distance (${allowed}) should be between player and wall`);

    const effectiveTargetRadius = Math.min(targetRadius, Math.max(GTA_MIN_FOLLOW_RADIUS, allowed - 0.25));
    assert.ok(effectiveTargetRadius >= GTA_MIN_FOLLOW_RADIUS, "Radius must satisfy minimum follow radius");
    assert.ok(effectiveTargetRadius < 1.0, `Effective radius (${effectiveTargetRadius}) should shorten to clear wall`);

    // Verify final camera Z coordinate
    const hDist = effectiveTargetRadius * Math.sin(phi);
    const camZ = pZ + hDist * Math.cos(theta); // 3.8 - hDist
    assert.ok(camZ > 3.0, `Camera Z (${camZ}) must be outside the Shop building (front wall Z=3.0)`);
  });

  // Requirement 10: Camera does not remain behind walls
  it("Requirement 10: Camera is never trapped behind walls across all 13 building exits", () => {
    const buildingExits = [
      { name: "Shop", pX: 0, pZ: 3.8, wallZ: 3.0, side: "north_of_player" },
      { name: "Cafe", pX: -12, pZ: 3.8, wallZ: 3.0, side: "north_of_player" },
      { name: "Hotel", pX: 9.5, pZ: 3.8, wallZ: 2.3, side: "north_of_player" },
      { name: "Bank", pX: -23.0, pZ: 3.8, wallZ: 2.6, side: "north_of_player" },
      { name: "Library", pX: 19.8, pZ: 3.8, wallZ: 3.1, side: "north_of_player" },
      { name: "Hospital", pX: -8.0, pZ: 13.0, wallZ: 13.5, side: "north_of_player" },
      { name: "Police Station", pX: 5.0, pZ: 13.0, wallZ: 13.9, side: "north_of_player" },
      { name: "Language School", pX: -22.0, pZ: 32.8, wallZ: 34.5, side: "north_of_player" },
      { name: "Study Center", pX: -9.5, pZ: 33.2, wallZ: 34.8, side: "north_of_player" },
      { name: "Community Center", pX: 9.5, pZ: 33.2, wallZ: 34.8, side: "north_of_player" },
      { name: "Career Center", pX: 22.0, pZ: 32.8, wallZ: 34.5, side: "north_of_player" },
      { name: "Activity Center", pX: -16.0, pZ: 43.8, wallZ: 45.3, side: "north_of_player" },
      { name: "Multi-Purpose Hall", pX: 16.0, pZ: 43.5, wallZ: 45.0, side: "north_of_player" }
    ];

    const phi = 1.415;
    const targetRadius = 3.55;

    for (const b of buildingExits) {
      // Test 1: Full radius ray collision check
      const hDist = targetRadius * Math.sin(phi);
      const testCamX = b.pX + hDist * Math.sin(Math.PI);
      const testCamZ = b.pZ + hDist * Math.cos(Math.PI);

      const allowed = checkCameraBuildingCollision(b.pX, b.pZ, testCamX, testCamZ, targetRadius);

      // Radius shortens to fit outside wall
      const effectiveRadius = Math.min(targetRadius, Math.max(GTA_MIN_FOLLOW_RADIUS, allowed - 0.25));
      const finalHDist = effectiveRadius * Math.sin(phi);
      let camX = b.pX + finalHDist * Math.sin(Math.PI);
      let camZ = b.pZ + finalHDist * Math.cos(Math.PI);

      // Test 2: Penetration resolution guard
      const resolved = resolveCameraBuildingPenetration(camX, camZ, 0.2);
      camX = resolved.camX;
      camZ = resolved.camZ;

      // Assert camera is strictly outside the building footprint
      for (const obs of OUTDOOR_BUILDINGS_COLLISION) {
        const inX = camX >= obs.x - obs.halfW && camX <= obs.x + obs.halfW;
        const inZ = camZ >= obs.z - obs.halfD && camZ <= obs.z + obs.halfD;
        assert.ok(!(inX && inZ), `Camera at (${camX.toFixed(2)}, ${camZ.toFixed(2)}) must not be inside ${obs.name} for ${b.name} exit`);
      }
    }
  });

  // Requirement 11: Camera/player/NPC visibility remains correct around building entrances
  it("Requirement 11: findSafeCameraAngle automatically pivots camera when obstructed to preserve player visibility", () => {
    const pX = 0;
    const pZ = 3.8; // In front of Shop
    const phi = 1.415;
    const targetRadius = 3.55;

    // Angle theta = Math.PI points straight into Shop wall
    const blockedTheta = Math.PI;
    const safeTheta = findSafeCameraAngle(pX, pZ, blockedTheta, phi, targetRadius);

    // Verify safeTheta provides greater unobstructed clearance than blockedTheta
    const blockedClearance = checkCameraBuildingCollision(
      pX,
      pZ,
      pX + targetRadius * Math.sin(phi) * Math.sin(blockedTheta),
      pZ + targetRadius * Math.sin(phi) * Math.cos(blockedTheta),
      targetRadius
    );
    const safeClearance = checkCameraBuildingCollision(
      pX,
      pZ,
      pX + targetRadius * Math.sin(phi) * Math.sin(safeTheta),
      pZ + targetRadius * Math.sin(phi) * Math.cos(safeTheta),
      targetRadius
    );

    assert.ok(safeClearance > blockedClearance, `Safe angle clearance (${safeClearance}) must exceed blocked clearance (${blockedClearance})`);
    assert.ok(safeClearance >= 2.0, "Safe angle must provide at least 2.0m clearance");
  });

  // Requirement 12: Existing movement, controls, missions, and building interactions remain functional
  it("Requirement 12: Camera-relative movement vectors remain perfectly functional with theta=Math.PI", () => {
    // When facing south with camera at theta = Math.PI:
    // Pushing joystick forward (inputY = 1.0) must move south (+Z in world coordinates)
    const moveForward = applyCameraRelativeVectors({
      inputX: 0,
      inputY: 1.0,
      theta: Math.PI
    });

    assert.ok(Math.abs(moveForward.worldX) < 1e-4, "Forward input has negligible lateral drift");
    assert.ok(moveForward.worldZ > 0.99, "Forward input with theta=PI moves +Z (south, away from north building doors)");

    // Strafe right (inputX = 1.0)
    const strafeRight = applyCameraRelativeVectors({
      inputX: 1.0,
      inputY: 0,
      theta: Math.PI
    });

    assert.ok(strafeRight.worldX < -0.99, "Strafe right with theta=PI moves -X (west)");
    assert.ok(Math.abs(strafeRight.worldZ) < 1e-4, "Strafe right has negligible longitudinal drift");
  });
});
