import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  getVoiceStatusPresentation,
  mapSpeechErrorToFeedback,
  canStartListening,
  canReplayVoice,
  getBestVoiceForNPC
} from "./voiceFeedbackLogic.js";

describe("voiceFeedbackLogic - getVoiceStatusPresentation", () => {
  it("maps idle status to IDLE presentation", () => {
    const res = getVoiceStatusPresentation("idle");
    assert.equal(res.label, "IDLE");
    assert.equal(res.icon, "⚪");
  });

  it("maps listening status to LISTENING presentation", () => {
    const res = getVoiceStatusPresentation("listening");
    assert.equal(res.label, "LISTENING");
    assert.equal(res.icon, "🔴");
  });

  it("maps thinking status to PROCESSING presentation", () => {
    const res = getVoiceStatusPresentation("thinking");
    assert.equal(res.label, "PROCESSING");
    assert.equal(res.icon, "⚡");
  });

  it("maps speaking status to SPEAKING presentation", () => {
    const res = getVoiceStatusPresentation("speaking");
    assert.equal(res.label, "SPEAKING");
    assert.equal(res.icon, "🔊");
  });
});

describe("voiceFeedbackLogic - mapSpeechErrorToFeedback", () => {
  it("maps microphone permission denial to an understandable error", () => {
    const res = mapSpeechErrorToFeedback("not-allowed");
    assert.equal(res.type, "error");
    assert.match(res.message, /permission was denied/i);

    const res2 = mapSpeechErrorToFeedback("permission-denied");
    assert.equal(res2.type, "error");
    assert.match(res2.message, /permission was denied/i);
  });

  it("maps missing audio device to error", () => {
    const res = mapSpeechErrorToFeedback("audio-capture");
    assert.equal(res.type, "error");
    assert.match(res.message, /no microphone detected/i);
  });

  it("maps unsupported browser to warning", () => {
    const res = mapSpeechErrorToFeedback("unsupported");
    assert.equal(res.type, "warning");
    assert.match(res.message, /not supported by your browser/i);
  });

  it("maps timeout to error", () => {
    const res = mapSpeechErrorToFeedback("timeout");
    assert.equal(res.type, "error");
    assert.match(res.message, /timed out/i);
  });

  it("maps network failure to error", () => {
    const res = mapSpeechErrorToFeedback("network");
    assert.equal(res.type, "error");
    assert.match(res.message, /network error/i);
  });
});

describe("voiceFeedbackLogic - canStartListening", () => {
  it("rejects when recognition is unsupported", () => {
    const res = canStartListening({
      status: "idle",
      isGenerating: false,
      isRecognitionAvailable: false
    });
    assert.equal(res.allowed, false);
    assert.equal(res.reason, "unsupported");
  });

  it("rejects when AI is thinking or processing", () => {
    const res = canStartListening({
      status: "thinking",
      isGenerating: true,
      isRecognitionAvailable: true
    });
    assert.equal(res.allowed, false);
    assert.equal(res.reason, "processing");
  });

  it("rejects when NPC is currently speaking", () => {
    const res = canStartListening({
      status: "speaking",
      isGenerating: false,
      isRecognitionAvailable: true
    });
    assert.equal(res.allowed, false);
    assert.equal(res.reason, "speaking");
  });

  it("allows when dialog is idle and recognition is available", () => {
    const res = canStartListening({
      status: "idle",
      isGenerating: false,
      isRecognitionAvailable: true
    });
    assert.equal(res.allowed, true);
  });
});

describe("voiceFeedbackLogic - canReplayVoice", () => {
  it("never allows replaying user messages", () => {
    assert.equal(
      canReplayVoice({ sender: "user", status: "idle", isGenerating: false }),
      false
    );
  });

  it("rejects replay while AI is processing", () => {
    assert.equal(
      canReplayVoice({ sender: "npc", status: "thinking", isGenerating: true }),
      false
    );
  });

  it("allows replay for NPC messages in idle state", () => {
    assert.equal(
      canReplayVoice({ sender: "npc", status: "idle", isGenerating: false }),
      true
    );
  });
});

describe("voiceFeedbackLogic - getBestVoiceForNPC", () => {
  const mockVoices = [
    { name: "Google US English", lang: "en-US", default: false },
    { name: "Alex (Natural)", lang: "en-US", default: false },
    { name: "Samantha", lang: "en-US", default: true },
    { name: "Yuna (Korean)", lang: "ko-KR", default: false },
    { name: "Minho", lang: "ko-KR", default: false }
  ];

  it("selects Korean voice when language preference is ko", () => {
    const voice = getBestVoiceForNPC(mockVoices, "Shop Seller", "ko");
    assert.ok(voice);
    assert.equal(voice.lang, "ko-KR");
  });

  it("selects male voice for Jack (Shop Seller)", () => {
    const voice = getBestVoiceForNPC(mockVoices, "Shop Seller", "en");
    assert.ok(voice);
    assert.equal(voice.name, "Alex (Natural)");
  });

  it("selects male voice for Mia (Cafe Barista)", () => {
    const voice = getBestVoiceForNPC(mockVoices, "Cafe Barista", "en");
    assert.ok(voice);
    assert.equal(voice.name, "Alex (Natural)");
  });

  it("handles null/empty voices gracefully", () => {
    assert.equal(getBestVoiceForNPC([], "Shop Seller", "en"), null);
    assert.equal(getBestVoiceForNPC(null, "Shop Seller", "en"), null);
  });
});
