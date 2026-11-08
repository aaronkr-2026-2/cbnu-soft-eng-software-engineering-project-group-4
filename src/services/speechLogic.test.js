import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  getSpeechRecognitionLanguage,
  processSpeechRecognitionResults,
  shouldSubmitSpeech,
  createSpeechSessionCoordinator
} from "./speechLogic.js";

describe("speechLogic - Language Resolution", () => {
  it("maps Korean to ko-KR and default/English to en-US", () => {
    assert.equal(getSpeechRecognitionLanguage("ko"), "ko-KR");
    assert.equal(getSpeechRecognitionLanguage("en"), "en-US");
    assert.equal(getSpeechRecognitionLanguage(null), "en-US");
    assert.equal(getSpeechRecognitionLanguage(undefined), "en-US");
    assert.equal(getSpeechRecognitionLanguage("other"), "en-US");
  });
});

describe("speechLogic - processSpeechRecognitionResults", () => {
  it("handles empty or invalid results gracefully", () => {
    const res = processSpeechRecognitionResults(null);
    assert.deepEqual(res, {
      finalTranscript: "",
      interimTranscript: "",
      fullTranscript: ""
    });
  });

  it("correctly segregates final from interim results", () => {
    // Native browser result structure: result[0].transcript + result.isFinal
    const mockResults = [
      { isFinal: true, 0: { transcript: "Hello" } },
      { isFinal: true, 0: { transcript: "I want to buy" } },
      { isFinal: false, 0: { transcript: "two bottles of" } }
    ];

    const res = processSpeechRecognitionResults(mockResults);
    assert.equal(res.finalTranscript, "Hello I want to buy");
    assert.equal(res.interimTranscript, "two bottles of");
    assert.equal(res.fullTranscript, "Hello I want to buy two bottles of");
  });

  it("handles purely interim results without finalizing", () => {
    const mockResults = [
      { isFinal: false, 0: { transcript: "Hello I" } }
    ];
    const res = processSpeechRecognitionResults(mockResults);
    assert.equal(res.finalTranscript, "");
    assert.equal(res.interimTranscript, "Hello I");
    assert.equal(res.fullTranscript, "Hello I");
  });

  it("handles fully final results", () => {
    const mockResults = [
      { isFinal: true, 0: { transcript: "Order one hot Americano." } }
    ];
    const res = processSpeechRecognitionResults(mockResults);
    assert.equal(res.finalTranscript, "Order one hot Americano.");
    assert.equal(res.interimTranscript, "");
    assert.equal(res.fullTranscript, "Order one hot Americano.");
  });
});

describe("speechLogic - shouldSubmitSpeech", () => {
  it("rejects already submitted speech", () => {
    const res = shouldSubmitSpeech({ transcript: "Hello world", isSubmitted: true });
    assert.equal(res.canSubmit, false);
    assert.equal(res.reason, "ALREADY_SUBMITTED");
  });

  it("rejects empty or whitespace-only transcripts", () => {
    const res1 = shouldSubmitSpeech({ transcript: "", isSubmitted: false });
    assert.equal(res1.canSubmit, false);
    assert.equal(res1.reason, "EMPTY_TRANSCRIPT");

    const res2 = shouldSubmitSpeech({ transcript: "    ", isSubmitted: false });
    assert.equal(res2.canSubmit, false);
    assert.equal(res2.reason, "EMPTY_TRANSCRIPT");
  });

  it("approves valid non-submitted speech and trims whitespace", () => {
    const res = shouldSubmitSpeech({ transcript: "  Hello, world!  ", isSubmitted: false });
    assert.equal(res.canSubmit, true);
    assert.equal(res.reason, "OK");
    assert.equal(res.cleanedTranscript, "Hello, world!");
  });
});

describe("speechLogic - createSpeechSessionCoordinator", () => {
  it("prevents premature submissions during interim phases and submits once on finalize", () => {
    const coordinator = createSpeechSessionCoordinator();
    const sessionId = coordinator.startSession();

    // Step 1: User says "Hello I" (interim)
    coordinator.updateResults([
      { isFinal: false, 0: { transcript: "Hello I" } }
    ]);
    assert.equal(coordinator.isSubmitted(), false);
    assert.equal(coordinator.getCurrentTranscript(), "Hello I");

    // Step 2: User says "Hello I want" (interim)
    coordinator.updateResults([
      { isFinal: false, 0: { transcript: "Hello I want" } }
    ]);
    assert.equal(coordinator.isSubmitted(), false);
    assert.equal(coordinator.getCurrentTranscript(), "Hello I want");

    // Step 3: First chunk finalized, second chunk interim
    coordinator.updateResults([
      { isFinal: true, 0: { transcript: "Hello, I want to take" } },
      { isFinal: false, 0: { transcript: "two bottles of water" } }
    ]);
    assert.equal(coordinator.isSubmitted(), false);
    assert.equal(coordinator.getCurrentTranscript(), "Hello, I want to take two bottles of water");

    // Step 4: All chunks finalized
    coordinator.updateResults([
      { isFinal: true, 0: { transcript: "Hello, I want to take" } },
      { isFinal: true, 0: { transcript: "two bottles of water and one apple." } }
    ]);
    assert.equal(coordinator.isSubmitted(), false);

    // Finalize session (e.g. silence timer or manual stop)
    const finalSubmission = coordinator.finalize(sessionId);
    assert.equal(finalSubmission.canSubmit, true);
    assert.equal(finalSubmission.reason, "OK");
    assert.equal(finalSubmission.transcript, "Hello, I want to take two bottles of water and one apple.");
    assert.equal(coordinator.isSubmitted(), true);

    // Step 5: Duplicate finalize attempt (e.g. natural onend firing after silence timer)
    const duplicateSubmission = coordinator.finalize(sessionId);
    assert.equal(duplicateSubmission.canSubmit, false);
    assert.equal(duplicateSubmission.reason, "ALREADY_SUBMITTED");
  });

  it("rejects finalize from stale session ID", () => {
    const coordinator = createSpeechSessionCoordinator();
    const session1 = coordinator.startSession();
    coordinator.updateResults([{ isFinal: true, 0: { transcript: "First session text" } }]);

    // User restarts microphone -> creates session 2
    const session2 = coordinator.startSession();
    coordinator.updateResults([{ isFinal: true, 0: { transcript: "Second session text" } }]);

    // Delayed callback from session 1 tries to finalize
    const staleResult = coordinator.finalize(session1);
    assert.equal(staleResult.canSubmit, false);
    assert.equal(staleResult.reason, "STALE_SESSION");

    // Active session 2 finalizes successfully
    const activeResult = coordinator.finalize(session2);
    assert.equal(activeResult.canSubmit, true);
    assert.equal(activeResult.transcript, "Second session text");
  });

  it("handles empty speech session without submitting", () => {
    const coordinator = createSpeechSessionCoordinator();
    const sessionId = coordinator.startSession();

    // User clicked mic but said nothing before onend fired
    const result = coordinator.finalize(sessionId);
    assert.equal(result.canSubmit, false);
    assert.equal(result.reason, "EMPTY_TRANSCRIPT");
  });
});
