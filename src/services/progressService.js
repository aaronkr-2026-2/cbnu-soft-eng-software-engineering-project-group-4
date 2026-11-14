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

import {
  calculateMissionXP,
  deriveFacilityName,
  getLocalDateString,
  getCalendarDayDiff,
  calculateUpdatedStreak,
  evaluateAchievements,
  calculateProgressUpdate
} from "./progressLogic.js";

export {
  calculateMissionXP,
  deriveFacilityName,
  getLocalDateString,
  getCalendarDayDiff,
  calculateUpdatedStreak,
  evaluateAchievements,
  calculateProgressUpdate
};


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
