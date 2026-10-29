import {
  doc,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  runTransaction,
  serverTimestamp
} from "firebase/firestore";
import { db } from "./firebase";
import { formatFirestoreError } from "./userService";

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

/**
 * Records mission completion, evaluation results, streak tracking, and achievements in Firestore atomically.
 *
 * Persists an immutable history record at `/users/{uid}/missionHistory/{attemptId}`
 * and atomically updates the user's aggregate progress statistics, streak, and achievements on `/users/{uid}`
 * using a Firestore transaction.
 *
 * If the attemptId has already been recorded, the transaction safely no-ops and returns
 * `{ alreadyRecorded: true }` to prevent duplicate XP, streak, or achievement awards.
 *
 * @param {string} uid - The Firebase Authentication User UID.
 * @param {object} mission - The mission object (must have title and goal/text).
 * @param {object} evaluation - The evaluation result object (must have score and completed).
 * @param {string} attemptId - Stable, unique attempt identifier for idempotency.
 * @param {string|object} [timeZoneOrOptions] - Optional IANA timezone string (e.g. "Asia/Seoul") or options object.
 * @returns {Promise<{ alreadyRecorded: boolean, xpEarned: number, historyId: string, stats?: object, streak?: object, achievements?: object, newlyUnlocked?: string[], message?: string }>}
 */
export async function recordMissionProgress(uid, mission, evaluation, attemptId, timeZoneOrOptions = null) {
  // 1. Input Validation
  if (!uid || typeof uid !== "string" || !uid.trim()) {
    const err = new Error("Invalid or missing user UID.");
    err.code = "invalid-uid";
    err.friendlyMessage = "User identifier is required to save progress.";
    throw err;
  }

  if (!attemptId || typeof attemptId !== "string" || !attemptId.trim()) {
    const err = new Error("Invalid or missing attemptId.");
    err.code = "invalid-attempt-id";
    err.friendlyMessage = "Attempt identifier is required to record progress.";
    throw err;
  }

  if (!mission || typeof mission !== "object" || Array.isArray(mission)) {
    const err = new Error("Invalid mission object provided.");
    err.code = "invalid-mission";
    err.friendlyMessage = "Mission data is required.";
    throw err;
  }

  if (!evaluation || typeof evaluation !== "object" || Array.isArray(evaluation)) {
    const err = new Error("Invalid evaluation object provided.");
    err.code = "invalid-evaluation";
    err.friendlyMessage = "Evaluation data is required.";
    throw err;
  }

  const score = evaluation.score;
  if (typeof score !== "number" || !Number.isFinite(score) || score < 0 || score > 100) {
    const err = new Error("Evaluation score must be a finite number between 0 and 100.");
    err.code = "invalid-score";
    err.friendlyMessage = "Valid score between 0 and 100 is required.";
    throw err;
  }

  if (typeof evaluation.completed !== "boolean") {
    const err = new Error("Evaluation completed status must be a boolean.");
    err.code = "invalid-completed";
    err.friendlyMessage = "Mission completion status must be true or false.";
    throw err;
  }

  const timeZone =
    typeof timeZoneOrOptions === "string" && timeZoneOrOptions.trim()
      ? timeZoneOrOptions.trim()
      : timeZoneOrOptions && typeof timeZoneOrOptions === "object" && typeof timeZoneOrOptions.timeZone === "string"
        ? timeZoneOrOptions.timeZone.trim()
        : null;

  const completed = evaluation.completed;
  const cleanUid = uid.trim();
  const cleanAttemptId = attemptId.trim();
  const facility = deriveFacilityName(
    evaluation.facility || evaluation.doorType || mission.facility,
    mission.title
  );

  const userDocRef = doc(db, "users", cleanUid);
  const historyDocRef = doc(db, "users", cleanUid, "missionHistory", cleanAttemptId);

  try {
    const result = await runTransaction(db, async (transaction) => {
      // --- PHASE 1: READS (Must precede any writes in Firestore) ---
      // Read 1: Check if this attempt has already been recorded
      const historySnap = await transaction.get(historyDocRef);
      if (historySnap.exists()) {
        return {
          alreadyRecorded: true,
          xpEarned: 0,
          historyId: cleanAttemptId,
          message: "Attempt already recorded. No duplicate XP awarded."
        };
      }

      // Read 2: Fetch current user profile to read existing statistics, streak, and achievements
      const userSnap = await transaction.get(userDocRef);
      const userData = userSnap.exists() ? userSnap.data() : {};

      const {
        xpEarned,
        updatedStats,
        updatedStreak,
        newlyUnlocked,
        prevAchievements
      } = calculateProgressUpdate(userData, {
        completed,
        score,
        facility,
        timeZone,
        now: new Date()
      });

      const clientCompletedAt = completed ? new Date() : (userData?.stats?.lastCompletedAt || null);

      if (completed) {
        updatedStats.lastCompletedAt = serverTimestamp();
      }

      // Build updated achievements maps
      const clientUnlockedAt = new Date();
      const updatedAchievementsForDb = { ...prevAchievements };
      const updatedAchievementsForClient = { ...prevAchievements };

      for (const achId of newlyUnlocked) {
        updatedAchievementsForDb[achId] = {
          unlocked: true,
          unlockedAt: serverTimestamp()
        };
        updatedAchievementsForClient[achId] = {
          unlocked: true,
          unlockedAt: clientUnlockedAt
        };
      }

      // --- PHASE 2: WRITES (All reads completed) ---
      // 1. Create history document
      const doorTypeVal =
        typeof evaluation.doorType === "string" && evaluation.doorType.trim()
          ? evaluation.doorType.trim()
          : `Exit ${facility}`;
      const missionTitleVal =
        typeof mission.title === "string" && mission.title.trim()
          ? mission.title.trim()
          : `${facility} Mission`;
      const missionGoalVal =
        typeof mission.goal === "string" && mission.goal.trim()
          ? mission.goal.trim()
          : typeof mission.text === "string" && mission.text.trim()
            ? mission.text.trim()
            : "";
      const feedbackVal =
        typeof evaluation.feedback === "string" ? evaluation.feedback.trim() : "";
      const mistakesVal = Array.isArray(evaluation.mistakes)
        ? evaluation.mistakes.filter((m) => typeof m === "string")
        : [];

      const historyRecord = {
        historyId: cleanAttemptId,
        facility,
        doorType: doorTypeVal,
        missionTitle: missionTitleVal,
        missionGoal: missionGoalVal,
        score,
        completed,
        xpEarned,
        mistakes: mistakesVal,
        feedback: feedbackVal,
        timestamp: serverTimestamp()
      };

      transaction.set(historyDocRef, historyRecord);

      // 2. Update user profile document statistics, streak, and achievements atomically
      if (userSnap.exists()) {
        transaction.update(userDocRef, {
          stats: updatedStats,
          streak: updatedStreak,
          achievements: updatedAchievementsForDb,
          updatedAt: serverTimestamp()
        });
      } else {
        transaction.set(
          userDocRef,
          {
            uid: cleanUid,
            displayName: "Student",
            onboardingCompleted: false,
            stats: updatedStats,
            streak: updatedStreak,
            achievements: updatedAchievementsForDb,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          },
          { merge: true }
        );
      }

      return {
        alreadyRecorded: false,
        historyId: cleanAttemptId,
        xpEarned,
        stats: {
          ...updatedStats,
          ...(clientCompletedAt ? { lastCompletedAt: clientCompletedAt } : {})
        },
        streak: updatedStreak,
        achievements: updatedAchievementsForClient,
        newlyUnlocked
      };
    });

    return result;
  } catch (err) {
    err.friendlyMessage = formatFirestoreError(err);
    console.error("Failed to record mission progress:", err.code || err.message);
    throw err;
  }
}

/**
 * Safely retrieves the most recent mission history records for an authenticated user.
 *
 * @param {string} uid - Firebase Authentication UID.
 * @param {number} [maxRecords=5] - Number of records to return (capped between 1 and 20, defaults to 5).
 * @returns {Promise<Array<object>>} List of mission records with document IDs, ordered by timestamp descending.
 */
export async function getRecentMissionHistory(uid, maxRecords = 5) {
  if (!uid || typeof uid !== "string" || !uid.trim()) {
    const err = new Error("Invalid or missing user UID for mission history lookup.");
    err.code = "invalid-uid";
    err.friendlyMessage = "User identifier is required to view mission history.";
    throw err;
  }

  const cleanUid = uid.trim();
  const safeLimit = Math.max(1, Math.min(20, Number.isFinite(maxRecords) ? Math.floor(maxRecords) : 5));

  try {
    const historyColRef = collection(db, "users", cleanUid, "missionHistory");
    const q = query(historyColRef, orderBy("timestamp", "desc"), limit(safeLimit));
    const snap = await getDocs(q);

    return snap.docs.map((d) => ({
      id: d.id,
      ...d.data()
    }));
  } catch (err) {
    err.friendlyMessage = formatFirestoreError(err);
    console.error("Failed to fetch mission history:", err.code || err.message);
    throw err;
  }
}
