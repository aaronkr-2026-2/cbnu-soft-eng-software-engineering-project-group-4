/**
 * speechLogic.js
 * Pure functions and session coordinator for Speech-to-Text (STT) aggregation,
 * interim vs final result segregation, and exactly-once submission lifecycle.
 */

/**
 * Derives the Web Speech API language tag from the user's learning preferences.
 * @param {string|null|undefined} learningLanguage - "en" or "ko"
 * @returns {string} "ko-KR" or "en-US"
 */
export function getSpeechRecognitionLanguage(learningLanguage) {
  if (learningLanguage === "ko") {
    return "ko-KR";
  }
  return "en-US";
}

/**
 * Extracts and segregates final vs interim transcript segments from a SpeechRecognitionResultList.
 * Handles both native browser SpeechRecognitionResultList and mock arrays for testing.
 *
 * @param {Array<{ isFinal: boolean, 0?: { transcript: string }, transcript?: string }>} results
 * @returns {{ finalTranscript: string, interimTranscript: string, fullTranscript: string }}
 */
export function processSpeechRecognitionResults(results) {
  if (!results || typeof results.length !== "number") {
    return { finalTranscript: "", interimTranscript: "", fullTranscript: "" };
  }

  let finalTranscript = "";
  let interimTranscript = "";

  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    if (!result) continue;

    // Support both native result[0].transcript and plain { transcript: "..." }
    const transcriptText = (result[0]?.transcript || result.transcript || "").trim();
    if (!transcriptText) continue;

    if (result.isFinal) {
      finalTranscript += (finalTranscript ? " " : "") + transcriptText;
    } else {
      interimTranscript += (interimTranscript ? " " : "") + transcriptText;
    }
  }

  const fullTranscript = (
    finalTranscript + (finalTranscript && interimTranscript ? " " : "") + interimTranscript
  ).trim();

  return {
    finalTranscript: finalTranscript.trim(),
    interimTranscript: interimTranscript.trim(),
    fullTranscript
  };
}

/**
 * Validates whether a transcript is eligible for submission to the AI.
 *
 * @param {Object} params
 * @param {string|null|undefined} params.transcript
 * @param {boolean} params.isSubmitted
 * @returns {{ canSubmit: boolean, reason: string, cleanedTranscript: string }}
 */
export function shouldSubmitSpeech({ transcript, isSubmitted }) {
  if (isSubmitted) {
    return {
      canSubmit: false,
      reason: "ALREADY_SUBMITTED",
      cleanedTranscript: ""
    };
  }

  const cleaned = typeof transcript === "string" ? transcript.trim() : "";
  if (!cleaned) {
    return {
      canSubmit: false,
      reason: "EMPTY_TRANSCRIPT",
      cleanedTranscript: ""
    };
  }

  return {
    canSubmit: true,
    reason: "OK",
    cleanedTranscript: cleaned
  };
}

/**
 * Creates a lightweight speech session coordinator to guarantee exactly-once
 * submission across asynchronous debounce timers, manual stops, and onend events.
 */
export function createSpeechSessionCoordinator() {
  let activeSessionId = 0;
  let sessionSubmitted = false;
  let accumulatedFinal = "";
  let currentInterim = "";

  return {
    startSession() {
      activeSessionId += 1;
      sessionSubmitted = false;
      accumulatedFinal = "";
      currentInterim = "";
      return activeSessionId;
    },

    getActiveSessionId() {
      return activeSessionId;
    },

    isSubmitted() {
      return sessionSubmitted;
    },

    updateResults(results) {
      const { finalTranscript, interimTranscript, fullTranscript } =
        processSpeechRecognitionResults(results);
      accumulatedFinal = finalTranscript;
      currentInterim = interimTranscript;
      return {
        finalTranscript,
        interimTranscript,
        fullTranscript
      };
    },

    getCurrentTranscript() {
      return (
        accumulatedFinal + (accumulatedFinal && currentInterim ? " " : "") + currentInterim
      ).trim();
    },

    finalize(targetSessionId) {
      if (targetSessionId !== activeSessionId) {
        return {
          canSubmit: false,
          reason: "STALE_SESSION",
          transcript: ""
        };
      }

      if (sessionSubmitted) {
        return {
          canSubmit: false,
          reason: "ALREADY_SUBMITTED",
          transcript: ""
        };
      }

      const fullTranscript = (
        accumulatedFinal + (accumulatedFinal && currentInterim ? " " : "") + currentInterim
      ).trim();

      if (!fullTranscript) {
        sessionSubmitted = true;
        return {
          canSubmit: false,
          reason: "EMPTY_TRANSCRIPT",
          transcript: ""
        };
      }

      sessionSubmitted = true;
      return {
        canSubmit: true,
        reason: "OK",
        transcript: fullTranscript
      };
    },

    reset() {
      sessionSubmitted = true;
      accumulatedFinal = "";
      currentInterim = "";
    }
  };
}
