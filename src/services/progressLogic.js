/**
 * Pure calculation logic for Mission Progress, Streaks, and Achievements.
 * Completely free of external network, browser, or database dependencies.
 */

/**
 * Calculates XP earned based on mission completion and score.
 * - If completed is false: 0 XP
 * - If completed is true and score < 85: 50 XP
 * - If completed is true and score >= 85: 100 XP
 *
 * @param {boolean} completed - Whether the mission was completed.
 * @param {number} score - Evaluation score between 0 and 100.
 * @returns {number} Amount of XP awarded.
 */
export function calculateMissionXP(completed, score) {
  if (!completed) return 0;
  if (score >= 85) return 100;
  return 50;
}

/**
 * Derives the village facility name from doorType or mission title.
 *
 * @param {string} [facilityOrDoorType] - e.g. "Exit Shop", "Shop Door", or "Shop"
 * @param {string} [missionTitle] - e.g. "🏪 Shop Mission"
 * @returns {string} Human-readable facility name.
 */
export function deriveFacilityName(facilityOrDoorType, missionTitle) {
  if (facilityOrDoorType && typeof facilityOrDoorType === "string") {
    if (facilityOrDoorType.startsWith("Exit ")) {
      const name = facilityOrDoorType.replace("Exit ", "").trim();
      if (name) return name;
    }
    const name = facilityOrDoorType.replace(/Door$/i, "").trim();
    if (name) return name;
  }
  if (missionTitle && typeof missionTitle === "string") {
    const cleaned = missionTitle.replace(/[^\w\s-]/g, "").replace(/Mission/i, "").trim();
    if (cleaned) return cleaned;
  }
  return "Village";
}

/**
 * Safely derives a local calendar date string (YYYY-MM-DD) for a given Date and IANA timezone.
 *
 * If the provided timezone is invalid or unavailable, falls back deterministically to UTC.
 *
 * @param {Date} [date=new Date()] - The Date instance to format.
 * @param {string} [timeZone] - Optional IANA timezone string (e.g. "Asia/Seoul", "America/New_York").
 * @returns {string} Calendar date in "YYYY-MM-DD" format.
 */
export function getLocalDateString(date = new Date(), timeZone = null) {
  const safeDate = date instanceof Date && !isNaN(date.getTime()) ? date : new Date();

  let targetZone = "UTC";
  if (timeZone && typeof timeZone === "string") {
    const trimmed = timeZone.trim();
    if (trimmed) {
      try {
        Intl.DateTimeFormat(undefined, { timeZone: trimmed }).format();
        targetZone = trimmed;
      } catch {
        targetZone = "UTC";
      }
    }
  } else {
    try {
      const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (detected) targetZone = detected;
    } catch {
      targetZone = "UTC";
    }
  }

  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: targetZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).formatToParts(safeDate);

    const year = parts.find((p) => p.type === "year")?.value;
    const month = parts.find((p) => p.type === "month")?.value;
    const day = parts.find((p) => p.type === "day")?.value;

    if (year && month && day) {
      return `${year}-${month}-${day}`;
    }
  } catch {
    // Fallback to UTC ISO date string if formatting fails
  }

  return safeDate.toISOString().slice(0, 10);
}

/**
 * Calculates the exact difference in calendar days between two "YYYY-MM-DD" dates (dateB - dateA).
 * Uses UTC day calculation to eliminate daylight savings time (DST) distortions.
 *
 * @param {string} dateStrA - "YYYY-MM-DD"
 * @param {string} dateStrB - "YYYY-MM-DD"
 * @returns {number|null} Difference in days (positive if dateB is after dateA), or null if invalid.
 */
export function getCalendarDayDiff(dateStrA, dateStrB) {
  if (!dateStrA || typeof dateStrA !== "string" || !dateStrB || typeof dateStrB !== "string") {
    return null;
  }

  const partsA = dateStrA.trim().split("-");
  const partsB = dateStrB.trim().split("-");
  if (partsA.length !== 3 || partsB.length !== 3) return null;

  const yA = Number(partsA[0]);
  const mA = Number(partsA[1]);
  const dA = Number(partsA[2]);

  const yB = Number(partsB[0]);
  const mB = Number(partsB[1]);
  const dB = Number(partsB[2]);

  if (
    !Number.isInteger(yA) || !Number.isInteger(mA) || !Number.isInteger(dA) ||
    !Number.isInteger(yB) || !Number.isInteger(mB) || !Number.isInteger(dB)
  ) {
    return null;
  }

  const utcA = Date.UTC(yA, mA - 1, dA);
  const utcB = Date.UTC(yB, mB - 1, dB);

  return Math.round((utcB - utcA) / 86400000);
}

/**
 * Computes updated streak metrics based on previous streak state, mission completion, and today's local date.
 *
 * Rules:
 * - Incomplete missions do not advance the streak.
 * - Same-day missions maintain the current streak (do not increment more than once per calendar day).
 * - Next-day missions (diff = 1) increment current streak and update longest streak.
 * - Missed days (diff > 1) reset current streak to 1 while preserving longest streak.
 * - Negative diffs (clock skew or time traveler) do not alter the streak.
 *
 * @param {object} [prevStreak] - { current: number, longest: number, lastActiveDate: string|null }
 * @param {boolean} isMissionCompleted - Whether the mission was successfully completed.
 * @param {string} todayDateStr - Local date string "YYYY-MM-DD"
 * @returns {{ current: number, longest: number, lastActiveDate: string|null }}
 */
export function calculateUpdatedStreak(prevStreak, isMissionCompleted, todayDateStr) {
  const safeCurrent =
    typeof prevStreak?.current === "number" && Number.isFinite(prevStreak.current) && prevStreak.current >= 0
      ? prevStreak.current
      : 0;
  const safeLongest =
    typeof prevStreak?.longest === "number" && Number.isFinite(prevStreak.longest) && prevStreak.longest >= 0
      ? prevStreak.longest
      : 0;
  const safeLastActiveDate =
    typeof prevStreak?.lastActiveDate === "string" && prevStreak.lastActiveDate.trim()
      ? prevStreak.lastActiveDate.trim()
      : null;

  const currentStreakState = {
    current: safeCurrent,
    longest: Math.max(safeLongest, safeCurrent),
    lastActiveDate: safeLastActiveDate
  };

  if (!isMissionCompleted) {
    return currentStreakState;
  }

  // If user has never completed a mission before:
  if (!safeLastActiveDate) {
    return {
      current: 1,
      longest: Math.max(currentStreakState.longest, 1),
      lastActiveDate: todayDateStr
    };
  }

  const diff = getCalendarDayDiff(safeLastActiveDate, todayDateStr);

  if (diff === null) {
    // Malformed previous date; treat as fresh start
    return {
      current: 1,
      longest: Math.max(currentStreakState.longest, 1),
      lastActiveDate: todayDateStr
    };
  }

  if (diff === 0) {
    // Same day: preserve current streak count
    return {
      ...currentStreakState,
      lastActiveDate: todayDateStr
    };
  }

  if (diff === 1) {
    // Exactly consecutive day: increment current streak
    const newCurrent = safeCurrent + 1;
    return {
      current: newCurrent,
      longest: Math.max(currentStreakState.longest, newCurrent),
      lastActiveDate: todayDateStr
    };
  }

  if (diff > 1) {
    // Missed at least one day: reset current streak to 1, preserve longest
    return {
      current: 1,
      longest: Math.max(currentStreakState.longest, 1),
      lastActiveDate: todayDateStr
    };
  }

  // diff < 0 (clock skew / date traveling backwards): retain existing streak
  return currentStreakState;
}

/**
 * Evaluates unlock conditions for all 5 achievements based on updated progress and streak.
 * Never removes already unlocked achievements.
 *
 * Achievements:
 * 1. first_mission: First successfully completed mission.
 * 2. xp_500: Total accumulated XP reaches at least 500.
 * 3. perfect_score: A successfully completed mission receives exactly 100 points.
 * 4. missions_10: At least 10 successfully completed mission attempts.
 * 5. streak_3: Three consecutive local calendar days with at least one completed mission per day.
 *
 * @param {object} [prevAchievements] - Existing achievements map from user document.
 * @param {object} [newStats] - Updated profile stats (totalXP, completedMissions, etc.).
 * @param {object} [newStreak] - Updated streak object (current, longest, lastActiveDate).
 * @param {object} [currentAttempt] - Current evaluation { completed: boolean, score: number }.
 * @returns {{ newlyUnlocked: string[] }}
 */
export function evaluateAchievements(
  prevAchievements = {},
  newStats = {},
  newStreak = {},
  currentAttempt = {}
) {
  const safePrev =
    prevAchievements && typeof prevAchievements === "object" && !Array.isArray(prevAchievements)
      ? prevAchievements
      : {};

  const { completed = false, score = 0 } = currentAttempt || {};
  const completedMissions =
    typeof newStats?.completedMissions === "number" && Number.isFinite(newStats.completedMissions)
      ? newStats.completedMissions
      : 0;
  const totalXP =
    typeof newStats?.totalXP === "number" && Number.isFinite(newStats.totalXP)
      ? newStats.totalXP
      : 0;
  const currentStreak =
    typeof newStreak?.current === "number" && Number.isFinite(newStreak.current)
      ? newStreak.current
      : 0;
  const longestStreak =
    typeof newStreak?.longest === "number" && Number.isFinite(newStreak.longest)
      ? newStreak.longest
      : 0;
  const maxStreak = Math.max(currentStreak, longestStreak);

  const newlyUnlocked = [];

  // 1. first_mission: First successfully completed mission
  if (!safePrev.first_mission?.unlocked && completedMissions >= 1) {
    newlyUnlocked.push("first_mission");
  }

  // 2. xp_500: Total accumulated XP reaches at least 500
  if (!safePrev.xp_500?.unlocked && totalXP >= 500) {
    newlyUnlocked.push("xp_500");
  }

  // 3. perfect_score: A successfully completed mission receives exactly 100 points
  if (!safePrev.perfect_score?.unlocked && completed && score === 100) {
    newlyUnlocked.push("perfect_score");
  }

  // 4. missions_10: At least 10 successfully completed mission attempts
  if (!safePrev.missions_10?.unlocked && completedMissions >= 10) {
    newlyUnlocked.push("missions_10");
  }

  // 5. streak_3: Three consecutive local calendar days with at least one completed mission per day
  if (!safePrev.streak_3?.unlocked && maxStreak >= 3) {
    newlyUnlocked.push("streak_3");
  }

  return { newlyUnlocked };
}

/**
 * Pure helper function to compute the complete updated user progress payload.
 *
 * @param {object} prevProfile - Current user profile document data.
 * @param {object} attemptData - Attempt parameters { completed, score, facility, timeZone, now }.
 * @returns {{
 *   xpEarned: number,
 *   updatedStats: object,
 *   updatedStreak: object,
 *   newlyUnlocked: string[],
 *   prevAchievements: object
 * }}
 */
export function calculateProgressUpdate(prevProfile = {}, attemptData = {}) {
  const {
    completed = false,
    score = 0,
    facility = "Village",
    timeZone = null,
    now = new Date()
  } = attemptData || {};

  const prevStats =
    prevProfile && typeof prevProfile.stats === "object" && !Array.isArray(prevProfile.stats)
      ? prevProfile.stats
      : {};

  const prevStreak =
    prevProfile && typeof prevProfile.streak === "object" && !Array.isArray(prevProfile.streak)
      ? prevProfile.streak
      : {};

  const prevAchievements =
    prevProfile && typeof prevProfile.achievements === "object" && !Array.isArray(prevProfile.achievements)
      ? prevProfile.achievements
      : {};

  const prevAttempts =
    typeof prevStats.totalAttempts === "number" && Number.isFinite(prevStats.totalAttempts)
      ? prevStats.totalAttempts
      : 0;
  const prevTotalXP =
    typeof prevStats.totalXP === "number" && Number.isFinite(prevStats.totalXP)
      ? prevStats.totalXP
      : 0;
  const prevCompleted =
    typeof prevStats.completedMissions === "number" && Number.isFinite(prevStats.completedMissions)
      ? prevStats.completedMissions
      : 0;
  const prevAvg =
    typeof prevStats.averageScore === "number" && Number.isFinite(prevStats.averageScore)
      ? prevStats.averageScore
      : 0;

  const xpEarned = calculateMissionXP(completed, score);
  const newAttempts = prevAttempts + 1;
  const newTotalXP = prevTotalXP + xpEarned;
  const newCompleted = prevCompleted + (completed ? 1 : 0);
  const newAverageScore = Math.round(((prevAvg * prevAttempts) + score) / newAttempts);

  const updatedStats = {
    ...prevStats,
    totalXP: newTotalXP,
    completedMissions: newCompleted,
    totalAttempts: newAttempts,
    averageScore: newAverageScore,
    lastFacility: facility
  };

  const todayDateStr = getLocalDateString(now, timeZone);
  const updatedStreak = calculateUpdatedStreak(prevStreak, completed, todayDateStr);

  const { newlyUnlocked } = evaluateAchievements(
    prevAchievements,
    updatedStats,
    updatedStreak,
    { completed, score }
  );

  return {
    xpEarned,
    updatedStats,
    updatedStreak,
    newlyUnlocked,
    prevAchievements
  };
}
