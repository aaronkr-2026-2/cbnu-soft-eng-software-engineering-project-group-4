/**
 * voiceFeedbackLogic.js
 * Pure logic for voice status presentation, speech recognition error mapping,
 * replay eligibility, and language-aware voice selection.
 */

const NOVELTY_VOICE_NAMES = [
  "bad news",
  "bahh",
  "bells",
  "boing",
  "bubbles",
  "cellos",
  "deranged",
  "good news",
  "hysterical",
  "pipe organ",
  "trinoids",
  "whisper",
  "zarvox",
  "wobble"
];

import { getNPCGender } from "./npcPromptLogic.js";
import { t } from "./i18n.js";

export function detectKoreanVoiceGender(v) {
  if (!v) return "unknown";
  const str = `${v.name || ""} ${v.voiceURI || ""}`.toLowerCase();

  // Novelty / robotic / caricature voices that sound distorted or comedic
  if (
    NOVELTY_VOICE_NAMES.some((n) => str.includes(n)) ||
    /\b(grandpa|grandma|rocko|sandy|shelley)\b/i.test(str)
  ) {
    return "unknown";
  }

  // Explicit male Korean markers & actual system voice names (macOS Eddy, Reed; Windows Injoon, Minho, Minsu; Google/Android)
  const isMale =
    /\b(eddy|reed|injoon|minho|minsu|joon|gwang-su|남성|남자|male|man|boy)\b/i.test(str) ||
    str.includes("ko-kr-x-ism") ||
    str.includes("korean male");

  // Explicit female Korean markers & actual system voice names (macOS Yuna, Flo, Nari, Sora; Windows SunHi, Heami, Seoyeon; Google 한국어 / Google 한국의)
  const isFemale =
    /\b(yuna|flo|nari|sora|sunhi|sun-hi|heami|seoyeon|여성|여자|female|woman|girl)\b/i.test(str) ||
    str.includes("google 한국어") ||
    str.includes("google 한국의") ||
    str.includes("google 한국") ||
    str.includes("ko-kr-x-isf") ||
    str.includes("korean female");

  if (isMale && !isFemale) return "male";
  if (isFemale && !isMale) return "female";
  return "unknown";
}

export function detectEnglishVoiceGender(v) {
  if (!v) return "unknown";
  const str = `${v.name || ""} ${v.voiceURI || ""}`.toLowerCase();

  // Novelty / robotic voices
  if (NOVELTY_VOICE_NAMES.some((n) => str.includes(n))) {
    return "unknown";
  }

  // Explicit male English markers
  const isMale =
    /\b(david|mark|george|james|alex|daniel|fred|guy|tom|male|man|boy|aaron|oliver|harry|ryan|eric|brian|matthew|justin)\b/i.test(str) ||
    str.includes("english male");

  // Explicit female English markers
  const isFemale =
    /\b(samantha|ava|allison|susan|zoe|karen|victoria|fiona|jenny|aria|female|woman|girl|zira|hazel|catherine|linda|stephanie|moira|tessa|veena|serena)\b/i.test(str) ||
    str.includes("english female") ||
    str.includes("google us english");

  if (isMale && !isFemale) return "male";
  if (isFemale && !isMale) return "female";
  return "unknown";
}

export function detectVoiceGender(v, language = null) {
  if (!v) return "unknown";
  const lang = (language || v.lang || "").toLowerCase();
  if (lang.startsWith("ko")) {
    return detectKoreanVoiceGender(v);
  }
  return detectEnglishVoiceGender(v);
}

export const isMaleVoice = (v) => detectVoiceGender(v) === "male";
export const isFemaleVoice = (v) => detectVoiceGender(v) === "female";

export const scoreQuality = (v) => {
  if (!v) return 0;
  const nameLower = (v.name || "").toLowerCase();
  const langLower = (v.lang || "").toLowerCase();

  // Strongly deprioritize novelty, caricature, and toy voices
  if (
    NOVELTY_VOICE_NAMES.some((n) => nameLower.includes(n)) ||
    /\b(grandpa|grandma|rocko|sandy|shelley)\b/i.test(nameLower)
  ) {
    return -60;
  }

  let score = 10;

  // Quality keywords
  if (nameLower.includes("natural")) score += 60;
  if (nameLower.includes("enhanced")) score += 50;
  if (nameLower.includes("premium")) score += 50;
  if (nameLower.includes("neural")) score += 50;
  if (nameLower.includes("google")) score += 40;
  if (nameLower.includes("online")) score += 30;

  // High-clarity native Korean voices
  if (
    nameLower.includes("yuna") ||
    nameLower.includes("google 한국어") ||
    nameLower.includes("google 한국의") ||
    nameLower.includes("google 한국") ||
    nameLower.includes("injoon") ||
    nameLower.includes("sunhi") ||
    nameLower.includes("sun-hi") ||
    nameLower.includes("seoyeon") ||
    nameLower.includes("heami") ||
    nameLower.includes("minho") ||
    nameLower.includes("minsu") ||
    nameLower.includes("nari") ||
    nameLower.includes("sora")
  ) {
    score += 45;
  }

  // Secondary platform voices (macOS Eddy, Reed; Flo)
  if (nameLower.includes("eddy") || nameLower.includes("reed")) {
    score += 20;
  }
  if (nameLower.includes("flo")) {
    score += 15;
  }

  // Preferred accents
  if (langLower.startsWith("en-us") || langLower === "en_us") score += 20;
  else if (langLower.startsWith("en-gb") || langLower === "en_gb") score += 10;
  else if (langLower.startsWith("ko-kr") || langLower === "ko_kr" || langLower === "ko") score += 25;

  if (v.default) score += 5;

  return score;
};

/**
 * Returns user-facing visual configuration for the given dialog/voice status.
 *
 * @param {"idle"|"listening"|"thinking"|"speaking"|string} status
 * @param {"en"|"ko"} [lang="en"]
 * @returns {{ label: string, color: string, bg: string, icon: string }}
 */
export function getVoiceStatusPresentation(status, lang = "en") {
  switch (status) {
    case "listening":
      return {
        label: t("voice.listening", {}, lang),
        color: "#ef4444",
        bg: "rgba(239, 68, 68, 0.15)",
        icon: "🔴"
      };
    case "thinking":
      return {
        label: t("voice.processing", {}, lang),
        color: "#38bdf8",
        bg: "rgba(56, 189, 248, 0.15)",
        icon: "⚡"
      };
    case "speaking":
      return {
        label: t("voice.speaking", {}, lang),
        color: "#22c55e",
        bg: "rgba(34, 197, 94, 0.15)",
        icon: "🔊"
      };
    case "idle":
    default:
      return {
        label: t("voice.idle", {}, lang),
        color: "#94a3b8",
        bg: "rgba(148, 163, 184, 0.15)",
        icon: "⚪"
      };
  }
}

/**
 * Maps Web Speech API or network error codes to user-friendly messages.
 *
 * @param {string} errorType
 * @param {"en"|"ko"} [lang="en"]
 * @returns {{ type: "error"|"warning"|"info", message: string }}
 */
export function mapSpeechErrorToFeedback(errorType, lang = "en") {
  switch (errorType) {
    case "not-allowed":
    case "service-not-allowed":
    case "permission-denied":
      return {
        type: "error",
        message: t("voice.micDenied", {}, lang)
      };
    case "audio-capture":
      return {
        type: "error",
        message: t("voice.noMicDetected", {}, lang)
      };
    case "network":
      return {
        type: "error",
        message: t("voice.networkError", {}, lang)
      };
    case "unsupported":
      return {
        type: "warning",
        message: t("voice.unsupported", {}, lang)
      };
    case "timeout":
      return {
        type: "error",
        message: t("voice.timeout", {}, lang)
      };
    case "api_error":
      return {
        type: "error",
        message: t("voice.apiError", {}, lang)
      };
    case "no-speech":
    default:
      return {
        type: "info",
        message: t("voice.noSpeechDetected", {}, lang)
      };
  }
}

/**
 * Evaluates whether microphone recording can be initiated.
 *
 * @param {Object} params
 * @param {string} params.status - Current dialogState.status
 * @param {boolean} params.isGenerating - Whether an AI response is being generated
 * @param {boolean} params.isRecognitionAvailable - Whether speech recognition is supported
 * @returns {{ allowed: boolean, reason?: string }}
 */
export function canStartListening({ status, isGenerating = false, isRecognitionAvailable = true }) {
  if (!isRecognitionAvailable) {
    return { allowed: false, reason: "unsupported" };
  }
  if (isGenerating || status === "thinking") {
    return { allowed: false, reason: "processing" };
  }
  if (status === "speaking") {
    return { allowed: false, reason: "speaking" };
  }
  if (status !== "idle") {
    return { allowed: false, reason: "busy" };
  }
  return { allowed: true };
}

/**
 * Evaluates whether a chat message is eligible for TTS voice replay.
 *
 * @param {Object} params
 * @param {string} params.sender - "npc" or "user"
 * @param {string} params.status - Current dialogState.status
 * @param {boolean} params.isGenerating - Whether AI is processing
 * @returns {boolean}
 */
export function canReplayVoice({ sender, status, isGenerating = false }) {
  if (sender !== "npc") return false;
  if (isGenerating || status === "thinking") return false;
  return true;
}

/**
 * Sanitizes and cleans dialogue text before sending it to Web Speech API.
 * Strips markdown asterisks, bracketed stage directions, speaker prefixes,
 * and emojis so that speech synthesis produces natural, unbroken spoken sentences.
 *
 * @param {string} text
 * @returns {string} Clean spoken text
 */
export function sanitizeSpeechText(text) {
  if (!text || typeof text !== "string") return "";

  let cleaned = text;

  // 1. Remove markdown bold/italic asterisks and action asterisks (e.g. *활짝 웃으며*, *smiles*)
  cleaned = cleaned.replace(/\*[^*]+\*/g, " ");

  // 2. Remove stage directions in parentheses or brackets (e.g. (손을 흔들며), [giggles])
  cleaned = cleaned.replace(/\([^)]*\)/g, " ");
  cleaned = cleaned.replace(/\[[^\]]*\]/g, " ");

  // 3. Remove speaker name prefixes (e.g. "Jack: ", "Seller: ", "잭: ", "미아: ")
  cleaned = cleaned.replace(/^[A-Za-z가-힣\s]{2,15}:\s*/, "");

  // 4. Remove emojis and pictographs that cause speech engines to speak out emoji descriptions
  cleaned = cleaned.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}]/gu, " ");
  cleaned = cleaned.replace(/\p{Extended_Pictographic}/gu, " ");

  // 5. Remove quotes, hashtags, and standalone formatting symbols
  cleaned = cleaned.replace(/^["'“”‘’]+|["'“”‘’]+$/g, "");
  cleaned = cleaned.replace(/[*#`_~]/g, " ");

  // 6. Normalize repetitive punctuation (e.g. "???", "!!!", "...") into single clear pauses
  cleaned = cleaned.replace(/!{2,}/g, "!");
  cleaned = cleaned.replace(/\?{2,}/g, "?");
  cleaned = cleaned.replace(/\.{3,}/g, ".");

  // 7. Normalize whitespace so pauses are based purely on natural punctuation
  cleaned = cleaned.replace(/\s+/g, " ").trim();

  return cleaned;
}

/**
 * Selects the best synthesis voice for an NPC, respecting target learning language,
 * NPC voice gender, and speech voice quality.
 *
 * Fallback behavior:
 * - Never returns a voice from an incorrect language (never sacrifices learningLanguage for gender).
 * - Matches target gender if matching same-language voices exist.
 * - If no matching gender voice exists in the target language, falls back to the highest
 *   quality voice available in the target learning language.
 *
 * @param {SpeechSynthesisVoice[]} voices
 * @param {string} npcNameOrGender - NPC name (e.g. "Shop Seller", "Jack") or explicit gender ("male"|"female")
 * @param {string} [language="en"] - "en" or "ko"
 * @returns {SpeechSynthesisVoice|null}
 */
export function getBestVoiceForNPC(voices, npcNameOrGender, language = "en") {
  if (!voices || voices.length === 0) return null;

  const targetLang = language === "ko" ? "ko" : "en";
  const targetGender =
    npcNameOrGender === "male" || npcNameOrGender === "female"
      ? npcNameOrGender
      : getNPCGender(npcNameOrGender);

  // 1. Strict filtering by target learning language
  const sameLangVoices = voices.filter((v) => {
    if (!v || !v.lang) return false;
    const l = v.lang.toLowerCase();
    if (targetLang === "ko") {
      return l.startsWith("ko");
    }
    return l.startsWith("en") || l.includes("en-") || l.includes("en_");
  });

  if (sameLangVoices.length === 0) {
    // When learning Korean, never fallback to an English voice
    if (targetLang === "ko") return null;
    return voices.find((v) => v.default) || voices[0] || null;
  }

  // 2. Korean Voice Selection (Strict gender matching with dedicated Korean detector)
  if (targetLang === "ko") {
    if (targetGender === "male") {
      const maleKoreanVoices = sameLangVoices.filter(
        (v) => detectKoreanVoiceGender(v) === "male"
      );
      if (maleKoreanVoices.length > 0) {
        maleKoreanVoices.sort((a, b) => scoreQuality(b) - scoreQuality(a));
        return maleKoreanVoices[0];
      }
      // If no explicit male, check non-female Korean voices
      const nonFemaleKoreanVoices = sameLangVoices.filter(
        (v) => detectKoreanVoiceGender(v) !== "female"
      );
      if (nonFemaleKoreanVoices.length > 0) {
        nonFemaleKoreanVoices.sort((a, b) => scoreQuality(b) - scoreQuality(a));
        return nonFemaleKoreanVoices[0];
      }
    } else {
      const femaleKoreanVoices = sameLangVoices.filter(
        (v) => detectKoreanVoiceGender(v) === "female"
      );
      if (femaleKoreanVoices.length > 0) {
        femaleKoreanVoices.sort((a, b) => scoreQuality(b) - scoreQuality(a));
        return femaleKoreanVoices[0];
      }
      // If no explicit female, check non-male Korean voices
      const nonMaleKoreanVoices = sameLangVoices.filter(
        (v) => detectKoreanVoiceGender(v) !== "male"
      );
      if (nonMaleKoreanVoices.length > 0) {
        nonMaleKoreanVoices.sort((a, b) => scoreQuality(b) - scoreQuality(a));
        return nonMaleKoreanVoices[0];
      }
    }

    // Safe Fallback: Return best available Korean voice (never an English voice)
    sameLangVoices.sort((a, b) => scoreQuality(b) - scoreQuality(a));
    return sameLangVoices.find((v) => v.default) || sameLangVoices[0];
  }

  // 3. English Voice Selection (Preserve existing logic exactly)
  const exactGenderVoices = sameLangVoices.filter(
    (v) => detectEnglishVoiceGender(v) === targetGender
  );

  if (exactGenderVoices.length > 0) {
    exactGenderVoices.sort((a, b) => scoreQuality(b) - scoreQuality(a));
    return exactGenderVoices[0];
  }

  // If male NPC requested but no explicit male voice found, try voices not explicitly tagged female
  if (targetGender === "male") {
    const nonFemaleVoices = sameLangVoices.filter(
      (v) => detectEnglishVoiceGender(v) !== "female"
    );
    if (nonFemaleVoices.length > 0) {
      nonFemaleVoices.sort((a, b) => scoreQuality(b) - scoreQuality(a));
      return nonFemaleVoices[0];
    }
  }

  // Fallback: Return best available voice in English
  sameLangVoices.sort((a, b) => scoreQuality(b) - scoreQuality(a));
  return sameLangVoices.find((v) => v.default) || sameLangVoices[0];
}

/**
 * Diagnostic utility for evaluating Korean TTS voice resolution and playback configuration.
 *
 * @param {SpeechSynthesisVoice[]} [voices=[]]
 * @param {Object} [options={}]
 * @param {string} [options.npcName]
 * @returns {Object} Diagnostic report
 */
export function runKoreanTTSDiagnostics(voices = [], options = {}) {
  const testVoices =
    voices && voices.length > 0
      ? voices
      : typeof window !== "undefined" && "speechSynthesis" in window
        ? window.speechSynthesis.getVoices()
        : [];

  const maleVoice = getBestVoiceForNPC(testVoices, "Shop Seller", "ko");
  const femaleVoice = getBestVoiceForNPC(testVoices, "Hotel Receptionist", "ko");
  const requestedNpcVoice = options.npcName
    ? getBestVoiceForNPC(testVoices, options.npcName, "ko")
    : null;

  const diagnostics = {
    totalVoices: testVoices.length,
    koreanVoicesCount: testVoices.filter((v) => (v.lang || "").toLowerCase().startsWith("ko")).length,
    male: {
      npc: "Shop Seller (Jack)",
      expectedGender: "male",
      selectedVoice: maleVoice ? maleVoice.name : null,
      voiceURI: maleVoice?.voiceURI || null,
      detectedGender: maleVoice ? detectKoreanVoiceGender(maleVoice) : "none",
      suggestedRate: 0.90,
      suggestedPitch: 0.98
    },
    female: {
      npc: "Hotel Receptionist (Emma)",
      expectedGender: "female",
      selectedVoice: femaleVoice ? femaleVoice.name : null,
      voiceURI: femaleVoice?.voiceURI || null,
      detectedGender: femaleVoice ? detectKoreanVoiceGender(femaleVoice) : "none",
      suggestedRate: 0.90,
      suggestedPitch: 1.02
    }
  };

  if (options.npcName) {
    const gender = getNPCGender(options.npcName);
    diagnostics.selectedNPC = {
      npc: options.npcName,
      gender,
      selectedVoice: requestedNpcVoice ? requestedNpcVoice.name : null,
      voiceURI: requestedNpcVoice?.voiceURI || null,
      detectedGender: requestedNpcVoice ? detectKoreanVoiceGender(requestedNpcVoice) : "none",
      suggestedRate: 0.90,
      suggestedPitch: gender === "female" ? 1.02 : 0.98
    };
  }

  return diagnostics;
}
