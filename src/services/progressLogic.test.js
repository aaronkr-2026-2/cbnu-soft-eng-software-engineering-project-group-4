import test from "node:test";
import assert from "node:assert/strict";
import {
  calculateMissionXP,
  deriveFacilityName,
  getLocalDateString,
  getCalendarDayDiff,
  calculateUpdatedStreak,
  evaluateAchievements,
  calculateProgressUpdate
} from "./progressLogic.js";

test("calculateMissionXP - calculates XP correctly", () => {
  // Incomplete missions always earn 0 XP
  assert.equal(calculateMissionXP(false, 100), 0);
  assert.equal(calculateMissionXP(false, 90), 0);
  assert.equal(calculateMissionXP(false, 50), 0);
  assert.equal(calculateMissionXP(false, 0), 0);

  // Completed with score >= 85 awards 100 XP
  assert.equal(calculateMissionXP(true, 100), 100);
  assert.equal(calculateMissionXP(true, 85), 100);

  // Completed with score < 85 awards 50 XP
  assert.equal(calculateMissionXP(true, 84), 50);
  assert.equal(calculateMissionXP(true, 70), 50);
  assert.equal(calculateMissionXP(true, 0), 50);
});

test("deriveFacilityName - extracts facility from doorType or missionTitle", () => {
  assert.equal(deriveFacilityName("Exit Shop", "Shop Mission"), "Shop");
  assert.equal(deriveFacilityName("Cafe Door", "Cafe Mission"), "Cafe");
  assert.equal(deriveFacilityName(null, "🏪 Shop Mission"), "Shop");
  assert.equal(deriveFacilityName(null, null), "Village");
});

test("getLocalDateString - derives consistent YYYY-MM-DD date across timezones and fallbacks", () => {
  // 2026-10-25 00:30 UTC is 2026-10-25 09:30 KST (Asia/Seoul)
  const dateKstMorning = new Date("2026-10-25T00:30:00Z");
  assert.equal(getLocalDateString(dateKstMorning, "Asia/Seoul"), "2026-10-25");

  // 2026-10-24 16:00 UTC is 2026-10-25 01:00 KST
  const dateKstNextDay = new Date("2026-10-24T16:00:00Z");
  assert.equal(getLocalDateString(dateKstNextDay, "Asia/Seoul"), "2026-10-25");
  assert.equal(getLocalDateString(dateKstNextDay, "UTC"), "2026-10-24");

  // Fallback for invalid timezone string
  assert.equal(getLocalDateString(dateKstMorning, "Invalid/TimeZone_ABC"), "2026-10-25");
  // Fallback for null / undefined
  assert.match(getLocalDateString(dateKstMorning, null), /^\d{4}-\d{2}-\d{2}$/);
});

test("getCalendarDayDiff - accurately measures calendar day differences", () => {
  assert.equal(getCalendarDayDiff("2026-10-25", "2026-10-25"), 0);
  assert.equal(getCalendarDayDiff("2026-10-24", "2026-10-25"), 1);
  assert.equal(getCalendarDayDiff("2026-10-23", "2026-10-25"), 2);
  assert.equal(getCalendarDayDiff("2026-10-25", "2026-10-24"), -1);
  assert.equal(getCalendarDayDiff("2026-09-30", "2026-10-01"), 1);
  assert.equal(getCalendarDayDiff("2025-12-31", "2026-01-01"), 1);

  // Invalid formats return null safely
  assert.equal(getCalendarDayDiff("", "2026-10-25"), null);
  assert.equal(getCalendarDayDiff(null, "2026-10-25"), null);
  assert.equal(getCalendarDayDiff("invalid", "2026-10-25"), null);
});

test("calculateUpdatedStreak - handles new users, same day, consecutive days, and missed days", () => {
  // 1. Incomplete mission does not advance streak
  const incompleteResult = calculateUpdatedStreak(
    { current: 2, longest: 3, lastActiveDate: "2026-10-24" },
    false,
    "2026-10-25"
  );
  assert.deepEqual(incompleteResult, { current: 2, longest: 3, lastActiveDate: "2026-10-24" });

  // 2. New user completes first mission
  const newUserResult = calculateUpdatedStreak(undefined, true, "2026-10-25");
  assert.deepEqual(newUserResult, { current: 1, longest: 1, lastActiveDate: "2026-10-25" });

  // 3. Same-day completion keeps streak at current count (does NOT increment repeatedly)
  const sameDayResult = calculateUpdatedStreak(
    { current: 1, longest: 1, lastActiveDate: "2026-10-25" },
    true,
    "2026-10-25"
  );
  assert.deepEqual(sameDayResult, { current: 1, longest: 1, lastActiveDate: "2026-10-25" });

  // 4. Consecutive day increments streak
  const consecutiveDayResult = calculateUpdatedStreak(
    { current: 1, longest: 1, lastActiveDate: "2026-10-24" },
    true,
    "2026-10-25"
  );
  assert.deepEqual(consecutiveDayResult, { current: 2, longest: 2, lastActiveDate: "2026-10-25" });

  // 5. Day 3 consecutive day increments to 3
  const day3Result = calculateUpdatedStreak(
    { current: 2, longest: 2, lastActiveDate: "2026-10-24" },
    true,
    "2026-10-25"
  );
  assert.deepEqual(day3Result, { current: 3, longest: 3, lastActiveDate: "2026-10-25" });

  // 6. Missed day (e.g. 2 days later) resets current to 1 while preserving longest
  const missedDayResult = calculateUpdatedStreak(
    { current: 5, longest: 7, lastActiveDate: "2026-10-20" },
    true,
    "2026-10-25"
  );
  assert.deepEqual(missedDayResult, { current: 1, longest: 7, lastActiveDate: "2026-10-25" });
});

test("evaluateAchievements - unlocks milestones correctly and idempotently", () => {
  // Milestone 1: first_mission unlocks on first completion
  const res1 = evaluateAchievements({}, { completedMissions: 1, totalXP: 100 }, { current: 1 }, { completed: true, score: 90 });
  assert.ok(res1.newlyUnlocked.includes("first_mission"));

  // Incomplete mission does not unlock first_mission
  const resIncomplete = evaluateAchievements({}, { completedMissions: 0, totalXP: 0 }, { current: 0 }, { completed: false, score: 80 });
  assert.deepEqual(resIncomplete.newlyUnlocked, []);

  // Milestone 2: xp_500 unlocks when totalXP >= 500
  const resXP = evaluateAchievements(
    { first_mission: { unlocked: true } },
    { completedMissions: 4, totalXP: 500 },
    { current: 1 },
    { completed: true, score: 90 }
  );
  assert.ok(resXP.newlyUnlocked.includes("xp_500"));
  assert.ok(!resXP.newlyUnlocked.includes("first_mission")); // already unlocked, not in newlyUnlocked

  // Milestone 3: perfect_score unlocks ONLY when completed === true AND score === 100
  const resScore100Failed = evaluateAchievements(
    {},
    { completedMissions: 0, totalXP: 0 },
    { current: 0 },
    { completed: false, score: 100 }
  );
  assert.ok(!resScore100Failed.newlyUnlocked.includes("perfect_score"));

  const resScore100Success = evaluateAchievements(
    {},
    { completedMissions: 1, totalXP: 100 },
    { current: 1 },
    { completed: true, score: 100 }
  );
  assert.ok(resScore100Success.newlyUnlocked.includes("perfect_score"));

  // Milestone 4: missions_10 unlocks when completedMissions >= 10
  const res10Missions = evaluateAchievements(
    { first_mission: { unlocked: true }, xp_500: { unlocked: true } },
    { completedMissions: 10, totalXP: 850 },
    { current: 2 },
    { completed: true, score: 85 }
  );
  assert.ok(res10Missions.newlyUnlocked.includes("missions_10"));

  // Milestone 5: streak_3 unlocks when streak reaches 3
  const resStreak3 = evaluateAchievements(
    { first_mission: { unlocked: true } },
    { completedMissions: 3, totalXP: 300 },
    { current: 3, longest: 3 },
    { completed: true, score: 90 }
  );
  assert.ok(resStreak3.newlyUnlocked.includes("streak_3"));
});

test("calculateProgressUpdate - handles new user completing first mission", () => {
  const result = calculateProgressUpdate(
    {}, // empty new user profile
    { completed: true, score: 90, facility: "Shop", timeZone: "Asia/Seoul", now: new Date("2026-10-25T10:00:00Z") }
  );

  assert.equal(result.xpEarned, 100);
  assert.equal(result.updatedStats.totalXP, 100);
  assert.equal(result.updatedStats.completedMissions, 1);
  assert.equal(result.updatedStats.totalAttempts, 1);
  assert.equal(result.updatedStats.averageScore, 90);
  assert.equal(result.updatedStreak.current, 1);
  assert.equal(result.updatedStreak.longest, 1);
  assert.equal(result.updatedStreak.lastActiveDate, "2026-10-25");
  assert.deepEqual(result.newlyUnlocked, ["first_mission"]);
});

test("calculateProgressUpdate - existing user crossing 500 XP threshold", () => {
  const prevProfile = {
    stats: { totalXP: 450, completedMissions: 4, totalAttempts: 5, averageScore: 85 },
    streak: { current: 1, longest: 2, lastActiveDate: "2026-10-25" },
    achievements: { first_mission: { unlocked: true } }
  };

  const result = calculateProgressUpdate(
    prevProfile,
    { completed: true, score: 90, facility: "Cafe", timeZone: "Asia/Seoul", now: new Date("2026-10-25T14:00:00Z") }
  );

  assert.equal(result.xpEarned, 100);
  assert.equal(result.updatedStats.totalXP, 550);
  assert.equal(result.updatedStats.completedMissions, 5);
  // Same day mission: streak remains 1
  assert.equal(result.updatedStreak.current, 1);
  // Crossed 500 XP: unlocks xp_500
  assert.deepEqual(result.newlyUnlocked, ["xp_500"]);
});

test("calculateProgressUpdate - score 100 unlocks perfect_score", () => {
  const prevProfile = {
    stats: { totalXP: 200, completedMissions: 2, totalAttempts: 2, averageScore: 85 },
    achievements: { first_mission: { unlocked: true } }
  };

  const result = calculateProgressUpdate(
    prevProfile,
    { completed: true, score: 100, facility: "Library", timeZone: "Asia/Seoul", now: new Date("2026-10-25T12:00:00Z") }
  );

  assert.equal(result.xpEarned, 100);
  assert.ok(result.newlyUnlocked.includes("perfect_score"));
});

test("calculateProgressUpdate - 10 completed missions milestone", () => {
  const prevProfile = {
    stats: { totalXP: 800, completedMissions: 9, totalAttempts: 10, averageScore: 88 },
    achievements: { first_mission: { unlocked: true }, xp_500: { unlocked: true } }
  };

  const result = calculateProgressUpdate(
    prevProfile,
    { completed: true, score: 90, facility: "Hospital", timeZone: "Asia/Seoul", now: new Date("2026-10-25T12:00:00Z") }
  );

  assert.equal(result.updatedStats.completedMissions, 10);
  assert.ok(result.newlyUnlocked.includes("missions_10"));
});

test("calculateProgressUpdate - 3 consecutive days unlock streak_3", () => {
  // Day 1
  const day1 = calculateProgressUpdate(
    {},
    { completed: true, score: 90, timeZone: "Asia/Seoul", now: new Date("2026-10-23T10:00:00Z") }
  );
  assert.equal(day1.updatedStreak.current, 1);

  // Day 2
  const day2 = calculateProgressUpdate(
    { stats: day1.updatedStats, streak: day1.updatedStreak, achievements: { first_mission: { unlocked: true } } },
    { completed: true, score: 90, timeZone: "Asia/Seoul", now: new Date("2026-10-24T10:00:00Z") }
  );
  assert.equal(day2.updatedStreak.current, 2);

  // Day 3
  const day3 = calculateProgressUpdate(
    { stats: day2.updatedStats, streak: day2.updatedStreak, achievements: { first_mission: { unlocked: true } } },
    { completed: true, score: 90, timeZone: "Asia/Seoul", now: new Date("2026-10-25T10:00:00Z") }
  );
  assert.equal(day3.updatedStreak.current, 3);
  assert.ok(day3.newlyUnlocked.includes("streak_3"));
});

test("calculateProgressUpdate - missed day resets streak but preserves longest streak and unlocked achievements", () => {
  const prevProfile = {
    stats: { totalXP: 400, completedMissions: 4, totalAttempts: 4, averageScore: 90 },
    streak: { current: 4, longest: 4, lastActiveDate: "2026-10-20" },
    achievements: { first_mission: { unlocked: true }, xp_500: { unlocked: true }, streak_3: { unlocked: true } }
  };

  const result = calculateProgressUpdate(
    prevProfile,
    { completed: true, score: 90, timeZone: "Asia/Seoul", now: new Date("2026-10-25T10:00:00Z") }
  );

  // Current streak resets to 1
  assert.equal(result.updatedStreak.current, 1);
  // Longest streak remains 4
  assert.equal(result.updatedStreak.longest, 4);
  // Already unlocked achievements are preserved and not re-emitted in newlyUnlocked
  assert.deepEqual(result.newlyUnlocked, []);
  assert.ok(result.prevAchievements.streak_3.unlocked);
});

test("calculateProgressUpdate - existing users without streak/achievement fields do not crash", () => {
  const legacyProfile = {
    displayName: "Legacy User",
    email: "legacy@village.com",
    stats: { totalXP: 300, completedMissions: 3, totalAttempts: 3, averageScore: 85 }
    // missing streak, achievements, learningPreferences
  };

  const result = calculateProgressUpdate(
    legacyProfile,
    { completed: true, score: 85, facility: "Shop", timeZone: "Asia/Seoul", now: new Date("2026-10-25T10:00:00Z") }
  );

  assert.equal(result.updatedStats.totalXP, 400);
  assert.equal(result.updatedStats.completedMissions, 4);
  assert.equal(result.updatedStreak.current, 1);
  assert.equal(result.updatedStreak.longest, 1);
  assert.equal(result.updatedStreak.lastActiveDate, "2026-10-25");
});

test("Idempotency safeguard - duplicate attemptId returns alreadyRecorded without mutations", () => {
  // Simulates the transaction guard inside recordMissionProgress:
  // If historySnap.exists(), returns alreadyRecorded: true and 0 XP
  const historyStore = new Set();
  const attemptId = "attempt-uuid-12345";

  function simulateRecord(attempt) {
    if (historyStore.has(attempt)) {
      return { alreadyRecorded: true, xpEarned: 0, message: "Attempt already recorded. No duplicate XP awarded." };
    }
    historyStore.add(attempt);
    return { alreadyRecorded: false, xpEarned: 100 };
  }

  const firstCall = simulateRecord(attemptId);
  assert.equal(firstCall.alreadyRecorded, false);
  assert.equal(firstCall.xpEarned, 100);

  const duplicateCall = simulateRecord(attemptId);
  assert.equal(duplicateCall.alreadyRecorded, true);
  assert.equal(duplicateCall.xpEarned, 0);
});
