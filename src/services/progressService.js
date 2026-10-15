import {
  doc,
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
 * Records mission completion and evaluation results in Firestore atomically.
 *
 * Persists an immutable history record at `/users/{uid}/missionHistory/{attemptId}`
 * and atomically updates the user's aggregate progress statistics on `/users/{uid}`
 * using a Firestore transaction.
 *
 * If the attemptId has already been recorded, the transaction safely no-ops and returns
 * `{ alreadyRecorded: true }` to prevent duplicate XP awards.
 *
 * @param {string} uid - The Firebase Authentication User UID.
 * @param {object} mission - The mission object (must have title and goal/text).
 * @param {object} evaluation - The evaluation result object (must have score and completed).
 * @param {string} attemptId - Stable, unique attempt identifier for idempotency.
 * @returns {Promise<{ alreadyRecorded: boolean, xpEarned: number, historyId: string, stats?: object, message?: string }>}
 */
export async function recordMissionProgress(uid, mission, evaluation, attemptId) {
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

  const completed = evaluation.completed;
  const cleanUid = uid.trim();
  const cleanAttemptId = attemptId.trim();
  const xpEarned = calculateMissionXP(completed, score);
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

      // Read 2: Fetch current user profile to read existing statistics
      const userSnap = await transaction.get(userDocRef);
      const userData = userSnap.exists() ? userSnap.data() : {};
      const prevStats =
        userData && typeof userData.stats === "object" && !Array.isArray(userData.stats)
          ? userData.stats
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

      // Calculate updated stats
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

      if (completed) {
        updatedStats.lastCompletedAt = serverTimestamp();
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

      // 2. Update user profile document statistics atomically
      if (userSnap.exists()) {
        transaction.update(userDocRef, {
          stats: updatedStats,
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
          totalXP: newTotalXP,
          completedMissions: newCompleted,
          totalAttempts: newAttempts,
          averageScore: newAverageScore,
          lastFacility: facility
        }
      };
    });

    return result;
  } catch (err) {
    err.friendlyMessage = formatFirestoreError(err);
    console.error("Failed to record mission progress:", err.code || err.message);
    throw err;
  }
}
