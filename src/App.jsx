import React, { useEffect, useRef, useState } from "react";
import { VillageCanvas } from "./components/r3f/VillageCanvas";
import { MiniMap } from "./components/ui/MiniMap";
import { ProgressPanelModal } from "./components/ui/ProgressPanelModal";
import { SettingsModal } from "./components/ui/SettingsModal";
import { MobileJoystick } from "./components/ui/MobileJoystick";
import { MobileActionButtons } from "./components/ui/MobileActionButtons";
import {
  useDeviceCapabilities,
  getLayoutMode,
  isTouchCapable,
  shouldShowTouchControls,
  getLayoutClass
} from "./services/deviceDetection";
import { AuthScreen } from "./components/auth/AuthScreen";
import { OnboardingScreen } from "./components/onboarding/OnboardingScreen";
import { subscribeToAuthState, signOutUser, isUserVerified } from "./services/auth";
import { createUserProfileIfMissing, updateUserProfile } from "./services/userService";
import { recordMissionProgress, deriveFacilityName, calculateMissionXP } from "./services/progressService";
import { getSpeechRecognitionLanguage, processSpeechRecognitionResults } from "./services/speechLogic";
import {
  buildNPCSystemPrompt,
  formatConversationHistory,
  getNPCInitialGreeting,
  getNPCGender,
  getNPCProfile
} from "./services/npcPromptLogic";
import {
  getVoiceStatusPresentation,
  mapSpeechErrorToFeedback,
  canStartListening,
  getBestVoiceForNPC,
  sanitizeSpeechText,
  runKoreanTTSDiagnostics
} from "./services/voiceFeedbackLogic";
import {
  handleNPCInteraction,
  handleAIResponse,
  handleReplayAction,
  formatInteractionTrace
} from "./services/npcInteractionService";
import {
  ITEM_DEFINITIONS,
  DEFAULT_SHOP_3D_ITEMS,
  addItemToInventory,
  isItemAlreadyCollected,
  validateMissionInventory,
  getLocalizedItemName
} from "./services/inventoryLogic";
import {
  MISSIONS_CATALOG,
  getLocalizedMission,
  getMissionGoal,
  getRandomMission,
  selectNextMission
} from "./services/missionsData";
import {
  t,
  resolveUserLanguagePreferences,
  getLanguageName,
  getLevelName
} from "./services/i18n";

const OUTDOOR_RADIUS = 3.55;
const OUTDOOR_BASE_PHI = 1.415;

const isDevModeRequested =
  typeof window !== "undefined" &&
  new URLSearchParams(window.location.search).get("dev") === "true";

function App() {
  const [authUser, setAuthUser] = useState(() => {
    if (isDevModeRequested) {
      return {
        uid: "dev_mock_uid",
        email: "dev@languagevillage.test",
        displayName: "Student Explorer",
        emailVerified: true
      };
    }
    return null;
  });
  const [authLoading, setAuthLoading] = useState(() => !isDevModeRequested);
  const [userProfile, setUserProfile] = useState(() => {
    if (isDevModeRequested) {
      return {
        uid: "dev_mock_uid",
        displayName: "Student Explorer",
        onboardingCompleted: true,
        learningPreferences: {
          language: "en",
          learningLanguage: "en",
          level: "beginner"
        },
        stats: { totalXP: 100 }
      };
    }
    return null;
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState(null);

  const fetchProfileForUser = async (user) => {
    if (!user || !isUserVerified(user)) {
      setUserProfile(null);
      setProfileLoading(false);
      setProfileError(null);
      return;
    }

    setProfileLoading(true);
    setProfileError(null);

    try {
      const profile = await createUserProfileIfMissing(user);
      setUserProfile(profile);
    } catch (err) {
      console.error("Failed to load user profile:", err);
      setProfileError(err.friendlyMessage || "Failed to load user profile from database.");
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    if (isDevModeRequested) return;

    let isCancelled = false;

    const unsubscribe = subscribeToAuthState(async (user) => {
      setAuthUser(user);
      setAuthLoading(false);

      if (!user || !isUserVerified(user)) {
        if (!isCancelled) {
          setUserProfile(null);
          setProfileLoading(false);
          setProfileError(null);
        }
        return;
      }

      if (!isCancelled) {
        setProfileLoading(true);
        setProfileError(null);
      }

      try {
        const profile = await createUserProfileIfMissing(user);
        if (!isCancelled) {
          setUserProfile(profile);
          setProfileLoading(false);
        }
      } catch (err) {
        console.error("Failed to load user profile:", err);
        if (!isCancelled) {
          setProfileError(err.friendlyMessage || "Failed to load user profile from database.");
          setProfileLoading(false);
        }
      }
    });

    return () => {
      isCancelled = true;
      unsubscribe();
    };
  }, []);

  const [currentLocation, setCurrentLocation] = useState("outside");
  const [doorPrompt, setDoorPrompt] = useState(null);
  const [npcPrompt, setNpcPrompt] = useState(null);
  const [activeMission, setActiveMission] = useState(null);
  const [showMissionIntro, setShowMissionIntro] = useState(false);
  const [exitEvaluation, setExitEvaluation] = useState(null);
  const [isProgressPanelOpen, setIsProgressPanelOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [localInterfaceLanguage, setLocalInterfaceLanguage] = useState(null);
  const resolvedPrefs = resolveUserLanguagePreferences(userProfile);
  const interfaceLanguage = localInterfaceLanguage || resolvedPrefs.interfaceLanguage;
  const setInterfaceLanguage = setLocalInterfaceLanguage;
  const learningLanguage = resolvedPrefs.learningLanguage;
  const learningLevel = resolvedPrefs.learningLevel;

  const learningLanguageRef = useRef(learningLanguage);
  useEffect(() => {
    learningLanguageRef.current = learningLanguage;
  }, [learningLanguage]);

  const learningLevelRef = useRef(learningLevel);
  useEffect(() => {
    learningLevelRef.current = learningLevel;
  }, [learningLevel]);
  const [itemPrompt, setItemPrompt] = useState(null);
  const [inventory, setInventory] = useState({});
  const [collectedItemIds, setCollectedItemIds] = useState([]);
  const [pickupToast, setPickupToast] = useState(null);

  const inventoryRef = useRef(inventory);
  useEffect(() => {
    inventoryRef.current = inventory;
  }, [inventory]);

  const collectedItemIdsRef = useRef(collectedItemIds);
  useEffect(() => {
    collectedItemIdsRef.current = collectedItemIds;
  }, [collectedItemIds]);

  const pickupToastTimeoutRef = useRef(null);

  const currentMissionRef = useRef(null);
  const messagesHistoryRef = useRef([]);

  // Dynamically re-localize activeMission if interface language switches during a mission
  useEffect(() => {
    if (currentMissionRef.current) {
      setActiveMission(getLocalizedMission(currentMissionRef.current, interfaceLanguage));
    }
  }, [interfaceLanguage]);

  // Mobile virtual joystick & device capability detection
  const joystickVecRef = useRef({ x: 0, y: 0 });
  const device = useDeviceCapabilities();
  const showMobileControls = device.showTouchControls;

  // Phase 4.2: First meaningful user gesture unlocks Web Audio / TTS on mobile Safari & mobile Chrome
  useEffect(() => {
    if (typeof window === "undefined") return;

    let unlocked = false;
    const unlockAudio = () => {
      if (unlocked) return;
      unlocked = true;

      try {
        if ("speechSynthesis" in window) {
          if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
          }
        }
      } catch {}

      window.removeEventListener("pointerdown", unlockAudio);
      window.removeEventListener("touchstart", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
    };

    window.addEventListener("pointerdown", unlockAudio, { passive: true, once: true });
    window.addEventListener("touchstart", unlockAudio, { passive: true, once: true });
    window.addEventListener("keydown", unlockAudio, { passive: true, once: true });

    return () => {
      window.removeEventListener("pointerdown", unlockAudio);
      window.removeEventListener("touchstart", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
    };
  }, []);

  const lastShopMissionIndexRef = useRef(-1);
  const recentShopMissionIdsRef = useRef([]);
  const lastCafeMissionIndexRef = useRef(-1);
  const lastHotelMissionIndexRef = useRef(-1);
  const lastHospitalMissionIndexRef = useRef(-1);
  const lastBankMissionIndexRef = useRef(-1);
  const lastLibraryMissionIndexRef = useRef(-1);
  const lastPoliceMissionIndexRef = useRef(-1);
  const lastLanguageSchoolMissionIndexRef = useRef(-1);
  const lastStudyCenterMissionIndexRef = useRef(-1);
  const lastCommunityCenterMissionIndexRef = useRef(-1);
  const lastCareerCenterMissionIndexRef = useRef(-1);
  const lastActivityCenterMissionIndexRef = useRef(-1);
  const lastMultiPurposeHallMissionIndexRef = useRef(-1);
  const isEvaluatingRef = useRef(false);
  const currentAttemptIdRef = useRef(null);
  const isSavingProgressRef = useRef(false);
  const failedAttemptRef = useRef(null);
  const isMountedRef = useRef(true);
  const saveBannerTimeoutRef = useRef(null);

  const [isSavingProgress, setIsSavingProgress] = useState(false);
  const [isRetryingSave, setIsRetryingSave] = useState(false);
  const [saveErrorBanner, setSaveErrorBanner] = useState(null);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (saveBannerTimeoutRef.current) {
        clearTimeout(saveBannerTimeoutRef.current);
      }
      if (pickupToastTimeoutRef.current) {
        clearTimeout(pickupToastTimeoutRef.current);
      }
    };
  }, []);

  const isProgressPanelOpenRef = useRef(isProgressPanelOpen);
  useEffect(() => {
    isProgressPanelOpenRef.current = isProgressPanelOpen;
  }, [isProgressPanelOpen]);

  const isSettingsOpenRef = useRef(isSettingsOpen);
  useEffect(() => {
    isSettingsOpenRef.current = isSettingsOpen;
  }, [isSettingsOpen]);

  const exitEvaluationRef = useRef(exitEvaluation);
  useEffect(() => {
    exitEvaluationRef.current = exitEvaluation;
  }, [exitEvaluation]);

  // Global 'M' shortcut: toggle progress panel
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (e.isComposing || e.keyCode === 229) return;
      if (e.ctrlKey || e.altKey || e.metaKey) return;

      const targetTag = e.target?.tagName?.toLowerCase();
      if (targetTag === "input" || targetTag === "textarea" || e.target?.isContentEditable) {
        return;
      }

      if (e.code === "KeyM" || e.key === "m" || e.key === "M") {
        if (!authUser || !isUserVerified(authUser) || !userProfile?.learningPreferences) {
          return;
        }
        if (exitEvaluationRef.current || isSettingsOpenRef.current) {
          return;
        }

        setIsProgressPanelOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => {
      window.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, [authUser, userProfile]);

  const generateAttemptId = () => {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
    return `attempt_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  };

  const startNewMissionAttempt = (mission) => {
    currentAttemptIdRef.current = generateAttemptId();
    currentMissionRef.current = mission;
    setActiveMission(getLocalizedMission(mission, interfaceLanguage));
    setShowMissionIntro(true);
  };

  const handleUpdateSettings = async ({
    interfaceLanguage: nextInterface,
    learningLanguage: nextLearning,
    learningLevel: nextLevel
  }) => {
    setInterfaceLanguage(nextInterface);
    learningLanguageRef.current = nextLearning;
    learningLevelRef.current = nextLevel;

    setUserProfile((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        interfaceLanguage: nextInterface,
        learningPreferences: {
          ...(prev.learningPreferences || {}),
          language: nextLearning,
          learningLanguage: nextLearning,
          level: nextLevel
        }
      };
    });

    if (currentMissionRef.current) {
      setActiveMission(getLocalizedMission(currentMissionRef.current, nextInterface));
    }

    // When the learning language itself is changed, reset dialogue history to prevent mixing languages
    if (nextLearning !== learningLanguage) {
      if (dialogState.isOpen && dialogState.npcName) {
        const newGreeting = getNPCInitialGreeting(dialogState.npcName, nextLearning);
        messagesHistoryRef.current = [{ sender: "npc", text: newGreeting }];
        setDialogState((prev) => ({
          ...prev,
          status: "idle",
          messages: [{ sender: "npc", text: newGreeting }]
        }));
      } else {
        messagesHistoryRef.current = [];
      }
    }

    if (authUser?.uid) {
      await updateUserProfile(authUser.uid, {
        interfaceLanguage: nextInterface,
        learningPreferences: {
          ...(userProfile?.learningPreferences || {}),
          language: nextLearning,
          learningLanguage: nextLearning,
          level: nextLevel
        }
      });
    }
  };

  const playerRef = useRef(null);
  const cameraAnglesRef = useRef({
    theta: Math.PI,
    phi: OUTDOOR_BASE_PHI,
    radius: OUTDOOR_RADIUS
  });

  const [dialogState, setDialogState] = useState({
    isOpen: false,
    npcName: "",
    status: "idle",
    messages: []
  });

  // TTS & STT Refs & State
  const voicesRef = useRef([]);
  const ttsTimeoutRef = useRef(null);
  const activeUtteranceRef = useRef(null);
  const ttsSafetyTimeoutRef = useRef(null);
  const [sttInterimText, setSttInterimText] = useState("");
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const handleUserSpeechRef = useRef(null);
  const speechSessionIdRef = useRef(0);
  const speechSessionSubmittedRef = useRef(false);
  const accumulatedFinalTranscriptRef = useRef("");
  const currentInterimTranscriptRef = useRef("");
  const silenceTimerRef = useRef(null);
  const lastSubmittedSpeechRef = useRef({ text: "", timestamp: 0 });
  const isGeneratingRef = useRef(false);
  const [voiceFeedback, setVoiceFeedback] = useState(null);
  const [replayingMessageIndex, setReplayingMessageIndex] = useState(null);
  const speakTextRef = useRef(null);

  // Window diagnostic hook for testing and inspecting responsive controls in real-time
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.__diagnoseMobileControls = () => {
      const joystickEl = document.querySelector(".mobile-joystick");
      const actionButtonsEl = document.querySelector(".mobile-action-buttons");
      const isMovementLocked = Boolean(
        dialogState.isOpen || exitEvaluation || isProgressPanelOpen || isSettingsOpen
      );

      const liveWidth = window.innerWidth;
      const liveHeight = window.innerHeight;
      const liveTouch = isTouchCapable();
      const liveMode = getLayoutMode(liveWidth, liveHeight);
      const liveShowControls = shouldShowTouchControls(liveMode, liveTouch);
      const liveLayoutClass = getLayoutClass(liveMode);

      return {
        viewportWidth: liveWidth,
        viewportHeight: liveHeight,
        visualViewport: window.visualViewport
          ? {
              width: window.visualViewport.width,
              height: window.visualViewport.height,
              scale: window.visualViewport.scale
            }
          : null,
        isTouchCapable: liveTouch,
        layoutMode: liveMode,
        layoutClass: liveLayoutClass,
        showMobileControls: liveShowControls,
        joystickDomPresent: Boolean(joystickEl),
        joystickVisible: joystickEl
          ? window.getComputedStyle(joystickEl).display !== "none" &&
            window.getComputedStyle(joystickEl).opacity !== "0"
          : false,
        actionButtonsDomPresent: Boolean(actionButtonsEl),
        actionButtonsVisible: actionButtonsEl
          ? window.getComputedStyle(actionButtonsEl).display !== "none"
          : false,
        joystickVector: { ...joystickVecRef.current },
        isMovementLocked,
        currentLocation,
        playerPosition: playerRef.current
          ? {
              x: playerRef.current.position.x,
              y: playerRef.current.position.y,
              z: playerRef.current.position.z
            }
          : null
      };
    };
  }, [dialogState.isOpen, exitEvaluation, isProgressPanelOpen, isSettingsOpen, currentLocation]);

  const speakText = (text, npcName = null, ttsSource = "npc_dialogue", initialTrace = null) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setDialogState((prev) => ({ ...prev, status: "idle" }));
      return;
    }

    if (ttsTimeoutRef.current) {
      clearTimeout(ttsTimeoutRef.current);
      ttsTimeoutRef.current = null;
    }
    if (ttsSafetyTimeoutRef.current) {
      clearTimeout(ttsSafetyTimeoutRef.current);
      ttsSafetyTimeoutRef.current = null;
    }

    // Stop active speech recognition before NPC TTS begins to avoid acoustic feedback
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {
        // Safe ignore if already stopped
      }
    }

    // Unpause speech engine if browser paused it after a previous interruption
    if (window.speechSynthesis.paused) {
      try {
        window.speechSynthesis.resume();
      } catch {}
    }

    // Cancel ongoing speech only if speaking or pending to prevent accidental cancellation of new utterances
    if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }

    const cleanSpeechText = sanitizeSpeechText(text);
    const speechContent = cleanSpeechText || text || "";

    const character = npcName || dialogState.npcName || "Shop Seller";
    const currentLearningLang = learningLanguageRef.current || learningLanguage || "en";
    const npcVoiceGender = getNPCGender(character);
    const profile = getNPCProfile(character);
    const displayName = profile?.name || character || "Unknown";

    const trace = initialTrace
      ? { ...initialTrace }
      : {
          displayName,
          internalId: character,
          gender: npcVoiceGender,
          profileResolved: Boolean(profile),
          handlerEntered: true,
          dialogOpened: dialogState.isOpen,
          greetingGenerated: ttsSource === "initial_greeting",
          greetingText: ttsSource === "initial_greeting" ? speechContent : "",
          aiRequestStarted: ttsSource === "ai_response",
          aiResponseReceived: ttsSource === "ai_response",
          displayedText: speechContent,
          speakTextCalled: true,
          ttsSource,
          ttsText: speechContent,
          voiceSelected: "",
          utteranceLanguage: currentLearningLang === "ko" ? "ko-KR" : "en-US",
          playbackStarted: false,
          playbackEnded: false,
          playbackError: null,
          abortedAt: null
        };

    if (!speechContent) {
      trace.abortedAt = "empty_speech_content";
      console.log(formatInteractionTrace(trace));
      setDialogState((prev) => (prev.status === "speaking" ? { ...prev, status: "idle" } : prev));
      return;
    }

    const utterance = new SpeechSynthesisUtterance(speechContent);
    activeUtteranceRef.current = utterance;

    // Retain global reference on window to prevent premature JavaScript garbage collection in Blink/WebKit
    if (typeof window !== "undefined") {
      window.__activeTTSUtterances = window.__activeTTSUtterances || new Set();
      window.__activeTTSUtterances.add(utterance);
    }

    // Rate, Pitch, and Volume parameters
    if (currentLearningLang === "ko") {
      // Conservative natural defaults for Korean learners: rate 0.90, natural pitch
      utterance.rate = 0.90;
      utterance.volume = 1.0;
      utterance.pitch = npcVoiceGender === "female" ? 1.02 : 0.98;
      utterance.lang = "ko-KR";
    } else {
      utterance.rate = 1.0;
      utterance.volume = 1.0;
      utterance.pitch = npcVoiceGender === "female" ? 1.04 : 1.0;
      utterance.lang = "en-US";
    }

    // Voice resolution with fallback safety
    const availableVoices =
      voicesRef.current && voicesRef.current.length > 0
        ? voicesRef.current
        : window.speechSynthesis.getVoices() || [];

    if (availableVoices.length > 0) {
      voicesRef.current = availableVoices;
    }

    const selectedVoice = getBestVoiceForNPC(
      availableVoices,
      character,
      currentLearningLang
    );

    if (currentLearningLang === "ko") {
      // Strict Korean voice assignment: NEVER fall back to English voice in Korean mode
      utterance.lang = "ko-KR";
      if (selectedVoice && (selectedVoice.lang || "").toLowerCase().startsWith("ko")) {
        utterance.voice = selectedVoice;
      } else {
        // Safe Korean fallback: find ANY available Korean voice
        const anyKoVoice = availableVoices.find((v) =>
          (v.lang || "").toLowerCase().startsWith("ko")
        );
        if (anyKoVoice) {
          utterance.voice = anyKoVoice;
        }
      }
    } else if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang || "en-US";
    } else {
      utterance.lang = "en-US";
    }

    const voiceDisplayName = utterance.voice ? utterance.voice.name : "System Default (ko-KR)";
    trace.voiceSelected = voiceDisplayName;
    trace.utteranceLanguage = utterance.lang;

    // Diagnostic trace log
    console.log(formatInteractionTrace(trace));

    if (currentLearningLang === "ko") {
      console.log(
        `[KOREAN TTS PLAYBACK]\nNPC: ${displayName}\nVoice: ${voiceDisplayName}\nLanguage: ${utterance.lang}\nText: ${speechContent}\nStatus: queued`
      );
    } else if (import.meta.env.DEV) {
      console.log(
        `[ENGLISH NPC VOICE]\nNPC: ${displayName}\nGender: ${npcVoiceGender}\nLearning Language: en\nSelected voice: ${voiceDisplayName}\nVoice language: ${utterance.lang}`
      );
    }

    const clearActiveUtterance = () => {
      if (typeof window !== "undefined" && window.__activeTTSUtterances) {
        window.__activeTTSUtterances.delete(utterance);
      }
      if (ttsSafetyTimeoutRef.current) {
        clearTimeout(ttsSafetyTimeoutRef.current);
        ttsSafetyTimeoutRef.current = null;
      }
      if (activeUtteranceRef.current === utterance) {
        activeUtteranceRef.current = null;
      }
      setReplayingMessageIndex(null);
    };

    utterance.onstart = () => {
      if (activeUtteranceRef.current !== utterance) return;

      trace.playbackStarted = true;
      console.log(formatInteractionTrace(trace));

      if (currentLearningLang === "ko") {
        console.log(
          `[KOREAN TTS PLAYBACK]\nNPC: ${displayName}\nVoice: ${voiceDisplayName}\nLanguage: ${utterance.lang}\nText: ${speechContent}\nStatus: started`
        );
      }

      setDialogState((prev) => {
        if (prev.status !== "speaking") {
          return { ...prev, status: "speaking" };
        }
        return prev;
      });

      // Safe fallback timeout to prevent permanent speaking state
      if (ttsSafetyTimeoutRef.current) {
        clearTimeout(ttsSafetyTimeoutRef.current);
      }
      const safeDurationMs = Math.max(8000, Math.ceil((speechContent.length / 10) * 1000) + 5000);
      ttsSafetyTimeoutRef.current = setTimeout(() => {
        ttsSafetyTimeoutRef.current = null;
        if (activeUtteranceRef.current === utterance) {
          clearActiveUtterance();
          try {
            window.speechSynthesis.cancel();
          } catch {}
          setDialogState((prev) => (prev.status === "speaking" ? { ...prev, status: "idle" } : prev));
        }
      }, safeDurationMs);
    };

    utterance.onend = () => {
      if (activeUtteranceRef.current !== utterance) return;

      trace.playbackEnded = true;
      console.log(formatInteractionTrace(trace));

      if (currentLearningLang === "ko") {
        console.log(
          `[KOREAN TTS PLAYBACK]\nNPC: ${displayName}\nVoice: ${voiceDisplayName}\nLanguage: ${utterance.lang}\nText: ${speechContent}\nStatus: ended`
        );
      }

      clearActiveUtterance();
      setDialogState((prev) => (prev.status === "speaking" ? { ...prev, status: "idle" } : prev));
    };

    utterance.onerror = (event) => {
      if (activeUtteranceRef.current !== utterance) return;

      trace.playbackError = event?.error || "unknown";
      console.error(formatInteractionTrace(trace));

      if (currentLearningLang === "ko") {
        console.error(
          `[KOREAN TTS PLAYBACK]\nNPC: ${displayName}\nVoice: ${voiceDisplayName}\nLanguage: ${utterance.lang}\nText: ${speechContent}\nStatus: error\nError: ${event?.error || "unknown"}`
        );
      }

      clearActiveUtterance();
      setDialogState((prev) => (prev.status === "speaking" ? { ...prev, status: "idle" } : prev));
    };

    ttsTimeoutRef.current = setTimeout(() => {
      ttsTimeoutRef.current = null;
      if (activeUtteranceRef.current === utterance) {
        if (window.speechSynthesis.paused) {
          try {
            window.speechSynthesis.resume();
          } catch {}
        }
        try {
          window.speechSynthesis.speak(utterance);
        } catch (speakErr) {
          trace.playbackError = speakErr?.message || "speak_exception";
          trace.abortedAt = "speak_failed";
          console.error(formatInteractionTrace(trace));
          console.error("SpeechSynthesis.speak failed:", speakErr);
          clearActiveUtterance();
          setDialogState((prev) => (prev.status === "speaking" ? { ...prev, status: "idle" } : prev));
        }
      }
    }, 60);
  };

  useEffect(() => {
    speakTextRef.current = speakText;
  });

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const updateVoices = () => {
      try {
        const available = window.speechSynthesis.getVoices();
        if (available && available.length > 0) {
          voicesRef.current = available;
        }
      } catch {}
    };

    updateVoices();
    window.speechSynthesis.addEventListener("voiceschanged", updateVoices);
    if ("onvoiceschanged" in window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }

    // Attach diagnostic utilities to window for dev inspection and testing
    window.diagnoseKoreanTTS = (npcName = "Cafe Barista") => {
      const diag = runKoreanTTSDiagnostics(voicesRef.current, { npcName });
      console.table(diag);
      return diag;
    };
    window.testKoreanTTSPlayback = (npcName = "Cafe Barista", text = "안녕하세요!") => {
      speakTextRef.current?.(text, npcName);
    };

    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", updateVoices);
      if (window.speechSynthesis.onvoiceschanged === updateVoices) {
        window.speechSynthesis.onvoiceschanged = null;
      }
      if (ttsTimeoutRef.current) {
        clearTimeout(ttsTimeoutRef.current);
        ttsTimeoutRef.current = null;
      }
      if (ttsSafetyTimeoutRef.current) {
        clearTimeout(ttsSafetyTimeoutRef.current);
        ttsSafetyTimeoutRef.current = null;
      }
    };
  }, []);

  // Groq AI
  const generateNPCResponseWithAI = async (userMessage, npc) => {
    // Prevent concurrent/duplicate requests
    if (isGeneratingRef.current) return;
    isGeneratingRef.current = true;
    setVoiceFeedback(null);

    setDialogState((prev) => ({ ...prev, status: "thinking" }));
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;

    if (!apiKey) {
      isGeneratingRef.current = false;
      setVoiceFeedback(mapSpeechErrorToFeedback("api_error", interfaceLanguage));
      const currentLearningLang = learningLanguageRef.current || learningLanguage;
      const warning =
        currentLearningLang === "ko"
          ? "죄송합니다. 현재 대화 서비스에 연결할 수 없습니다."
          : "I apologize, but I cannot connect to the conversation service right now.";
      setDialogState((prev) => ({
        ...prev,
        status: "idle",
        messages: [...prev.messages, { sender: "npc", text: warning }]
      }));
      speakText(warning, npc);
      return;
    }

    const currentLearningLang = learningLanguageRef.current || learningLanguage;
    const currentLearningLevel = learningLevelRef.current || learningLevel;

    const systemPrompt = buildNPCSystemPrompt({
      npcName: npc,
      activeMission: currentMissionRef.current || activeMission,
      learningLanguage: currentLearningLang,
      learningLevel: currentLearningLevel,
      inventory: inventoryRef.current
    });

    // Format conversation history, ensuring the active user message is always present
    const history = formatConversationHistory(messagesHistoryRef.current, 10);
    const lastHistoryItem = history[history.length - 1];
    if (!lastHistoryItem || lastHistoryItem.role !== "user" || lastHistoryItem.content !== userMessage.trim()) {
      history.push({ role: "user", content: userMessage.trim() });
      const lastRefMsg = messagesHistoryRef.current[messagesHistoryRef.current.length - 1];
      if (!lastRefMsg || lastRefMsg.sender !== "user" || lastRefMsg.text !== userMessage) {
        messagesHistoryRef.current.push({ sender: "user", text: userMessage });
      }
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey.trim()}`
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-120b",
          messages: [
            { role: "system", content: systemPrompt },
            ...history
          ],
          max_tokens: 180,
          temperature: 0.5
        })
      });

      clearTimeout(timeoutId);

      let data;
      try {
        data = await response.json();
      } catch (jsonErr) {
        console.error("[AI Diagnostic: JSON Parsing Failure]", jsonErr);
        throw new Error(`JSON parsing failure: ${jsonErr.message}`);
      }

      if (!response.ok || data?.error) {
        const errorMsg = data?.error?.message || `HTTP ${response.status}: ${response.statusText}`;
        console.error("[AI Diagnostic: API Failure]", {
          status: response.status,
          statusText: response.statusText,
          error: data?.error
        });
        throw new Error(`API error: ${errorMsg}`);
      }

      const rawReply = data?.choices?.[0]?.message?.content?.trim();
      if (!rawReply) {
        console.warn("[AI Diagnostic: Empty Reply Content]", data);
      }

      const plan = handleAIResponse({
        rawReply,
        npcName: npc,
        learningLanguage: currentLearningLang,
        playerInput: userMessage,
        activeMission: currentMissionRef.current || activeMission
      });

      if (plan.sanitizerApplied) {
        console.info("[AI Diagnostic: Sanitizer Modified Reply]", {
          reason: plan.sanitizerReason,
          rawReply,
          sanitizedReply: plan.reply
        });
      } else {
        console.info("[AI Diagnostic: Contextual NPC Reply Generated]", {
          npc,
          input: userMessage,
          reply: plan.reply
        });
      }

      messagesHistoryRef.current.push({ sender: "npc", text: plan.reply });
      setDialogState((prev) => ({
        ...prev,
        status: "idle",
        messages: [...prev.messages, { sender: "npc", text: plan.reply }]
      }));

      speakText(plan.textToSpeak, npc, plan.ttsSource, plan.trace);

      if (typeof window !== "undefined") {
        window.lastAIDiagnostic = {
          status: "success",
          npc,
          userMessage,
          rawReply,
          reply: plan.reply,
          sanitizerApplied: plan.sanitizerApplied,
          sanitizerReason: plan.sanitizerReason,
          plan
        };
      }
      return plan;
    } catch (error) {
      clearTimeout(timeoutId);
      console.error("[AI Diagnostic: Pipeline Exception]", error);
      const isTimeout = error.name === "AbortError";
      const isParseError = error?.message?.includes("JSON parsing failure");
      const errorCategory = isTimeout ? "timeout" : (isParseError ? "parse_error" : "api_error");
      setVoiceFeedback(mapSpeechErrorToFeedback(isTimeout ? "timeout" : "api_error", interfaceLanguage));
      const currentLearningLang = learningLanguageRef.current || learningLanguage;

      const plan = handleAIResponse({
        rawReply: null,
        npcName: npc,
        learningLanguage: currentLearningLang,
        error: errorCategory,
        errorMessage: error?.message
      });

      // Notice: Do NOT push errorMsg into messagesHistoryRef.current to avoid polluting history!
      setDialogState((prev) => ({
        ...prev,
        status: "idle",
        messages: [...prev.messages, { sender: "npc", text: plan.reply }]
      }));
      speakText(plan.textToSpeak, npc, plan.ttsSource, plan.trace);

      if (typeof window !== "undefined") {
        window.lastAIDiagnostic = {
          status: "error",
          npc,
          userMessage,
          errorCategory,
          errorMessage: error?.message,
          reply: plan.reply,
          plan
        };
      }
      return plan;
    } finally {
      isGeneratingRef.current = false;
    }
  };

  const generateNPCResponseWithAIRef = useRef(generateNPCResponseWithAI);
  useEffect(() => {
    generateNPCResponseWithAIRef.current = generateNPCResponseWithAI;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.testNPCDialogue = async (message, npc = "Cafe Barista", languageOverride = null) => {
        if (languageOverride) {
          learningLanguageRef.current = languageOverride;
        }
        return await generateNPCResponseWithAIRef.current?.(message, npc);
      };
    }
  }, []);

  const getExaminerNpcTitle = (doorType, lang) => {
    const isKo = lang === "ko";
    if (doorType === "Exit Shop") return isKo ? "상점 직원 잭" : "Shop Seller Jack";
    if (doorType === "Exit Hotel") return isKo ? "호텔 리셉셔니스트 엠마" : "Hotel Receptionist Emma";
    if (doorType === "Exit Hospital") return isKo ? "병원 접수원 사라" : "Receptionist Sarah";
    if (doorType === "Exit Bank") return isKo ? "은행원 데이비드" : "Bank Employee David";
    if (doorType === "Exit Library") return isKo ? "사서 에밀리" : "Librarian Emily";
    if (doorType === "Exit Police Station") return isKo ? "경찰관 알렉스" : "Police Officer Alex";
    if (doorType === "Exit Language School") return isKo ? "어학당 교사 올리비아" : "Language Teacher Olivia";
    if (doorType === "Exit Study Center") return isKo ? "스터디 센터 튜터 대니얼" : "Study Center Tutor Daniel";
    if (doorType === "Exit Community Center") return isKo ? "커뮤니티 센터 직원 미나" : "Community Center Staff Mina";
    if (doorType === "Exit Career Center") return isKo ? "취업 지원관 제임스" : "Career Counselor James";
    if (doorType === "Exit Activity Center") return isKo ? "액티비티 코디네이터 하나" : "Activity Coordinator Hana";
    if (doorType === "Exit Multi-Purpose Hall") return isKo ? "다목적 홀 코디네이터 유리" : "Multi-Purpose Hall Coordinator Yuri";
    return isKo ? "바리스타 미아" : "Barista Mia";
  };

  // evaluateOnExit
  const evaluateOnExit = async (doorType) => {
    if (isEvaluatingRef.current) return;
    isEvaluatingRef.current = true;

    const uiLang = interfaceLanguage === "ko" ? "ko" : "en";
    const learningLang = (learningLanguageRef.current || learningLanguage) === "ko" ? "ko" : "en";
    const npcTitle = getExaminerNpcTitle(doorType, uiLang);

    try {
      const apiKey = import.meta.env.VITE_GROQ_API_KEY;
      const isShop = doorType === "Exit Shop";

      const userSpeeches = messagesHistoryRef.current.filter((m) => m.sender === "user");

      if (userSpeeches.length === 0) {
        if (isShop) {
          const invValidation = validateMissionInventory(
            currentMissionRef.current || MISSIONS_CATALOG.Shop[0],
            inventoryRef.current,
            uiLang
          );
          setExitEvaluation({
            doorType,
            score: invValidation.isComplete ? 35 : 0,
            completed: false,
            mistakes: [
              uiLang === "ko"
                ? `내부에서 ${npcTitle}와(과) 대화하지 않았습니다.`
                : `You did not speak with ${npcTitle} inside.`
            ],
            feedback: uiLang === "ko"
              ? "상황에 맞는 소통을 연습하려면 시설 직원과 대화를 나누고 필요한 물건을 확인해 보세요."
              : "To practice natural communication, converse with the staff and explore what is needed."
          });
          return;
        }

        setExitEvaluation({
          doorType,
          score: 0,
          completed: false,
          mistakes: [
            uiLang === "ko"
              ? `내부에서 ${npcTitle}와(과) 대화하지 않았습니다.`
              : `You did not speak with ${npcTitle} inside.`
          ],
          feedback: uiLang === "ko"
            ? "상황에 맞는 소통을 연습하려면 먼저 'F' 키를 눌러 캐릭터와 대화를 나눠보세요."
            : "To practice communication, first press 'F' to converse with the character."
        });
        return;
      }

      setExitEvaluation({ doorType, loading: true });

      const missionGoal = currentMissionRef.current
        ? (currentMissionRef.current.hiddenObjective?.[learningLang] || getMissionGoal(currentMissionRef.current, learningLang))
        : (learningLang === "ko" ? "목표 언어로 원활한 상황 대화를 수행하세요." : "Communicate naturally to complete your situational goal.");

      const conversationTranscript = messagesHistoryRef.current
        .map((m) => `${m.sender === "user" ? "Student (Spoken)" : "NPC"}: "${m.text}"`)
        .join("\n");

      const examinerTargetLang = learningLang === "ko" ? "Korean" : "English";
      const examinerFeedbackLang = uiLang === "ko" ? "Korean" : "English";

      const evaluationSystemPrompt = `You are an expert ${examinerTargetLang} Speaking Examiner evaluating a student's LIVE SPOKEN conversation transcribed via Speech-to-Text (STT).

Location: ${deriveFacilityName(doorType)}
Target Learning Language: ${examinerTargetLang}
Assigned Mission Goal: "${missionGoal}"
Feedback Language: ${examinerFeedbackLang} (All feedback, notes, and explanations MUST be written in natural, fluent ${examinerFeedbackLang}!)

Dialogue Transcript:
${conversationTranscript}

CRITICAL RULES FOR SPOKEN EVALUATION:
1. IGNORE CAPITALIZATION AND PUNCTUATION COMPLETELY: The user is speaking via microphone (STT). Ignore lowercase letters and missing periods/commas. NEVER penalize these!
2. FOCUS ONLY ON SPOKEN LANGUAGE IN ${examinerTargetLang}:
   - Did they address the assigned mission goal ("${missionGoal}") clearly?
   - Real grammar errors, unnatural phrasings, or vocabulary slips in ${examinerTargetLang} should be corrected.
   - Politeness and natural spoken style in ${examinerTargetLang} (e.g. polite 존댓말/해요체 in Korean, polite requests in English).
3. 'score': (Integer 0-100). High score (85-100) if mission communication was successful and mostly accurate. Lower score only for missing required items/topics, severely broken grammar, or off-topic speech.
4. 'completed': (Boolean true/false). true if the student fulfilled the mission requirements in ${examinerTargetLang}.
5. 'mistakes': Array of feedback strings in ${examinerFeedbackLang} ONLY for real grammatical or lexical mistakes. Format:
   ${uiLang === "ko" ? '"말씀하신 문장: \'[spoken sentence]\' ➔ 올바른 표현: \'[correct target phrase]\' (설명: [간결한 한국어 피드백])"' : '"You said: \'[spoken sentence]\' ➔ Better: \'[correct target phrase]\' (Note: [brief English explanation])"'}
   DO NOT include any mistake about capital letters or punctuation marks. If no real grammar mistake exists, return [].
6. 'feedback': A concise, encouraging 1-2 sentence overall summary in ${examinerFeedbackLang}.

CRITICAL: Return ONLY valid pure JSON without markdown backticks.
JSON Schema:
{
  "score": 90,
  "completed": true,
  "mistakes": [],
  "feedback": "..."
}`;

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey.trim()}`
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-120b",
          messages: [
            {
              role: "system",
              content: `You are a JSON-only generating assistant for spoken ${examinerTargetLang} analysis. Output pure JSON without markdown.`
            },
            {
              role: "user",
              content: evaluationSystemPrompt
            }
          ],
          temperature: 0.2
        })
      });

      const data = await response.json();
      let rawReply = data?.choices?.[0]?.message?.content?.trim();

      if (!rawReply) throw new Error("Empty response received from evaluation model");

      rawReply = rawReply.replace(/```json/gi, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(rawReply);

      const defaultSummary = uiLang === "ko" ? "대화 분석이 완료되었습니다." : "Conversation evaluation completed.";
      let finalScore = typeof parsed.score === "number" ? parsed.score : 70;
      let finalCompleted = Boolean(parsed.completed);
      let finalMistakes = Array.isArray(parsed.mistakes) ? [...parsed.mistakes] : [];
      let finalFeedback = parsed.feedback || defaultSummary;

      if (isShop) {
        const invValidation = validateMissionInventory(
          currentMissionRef.current || MISSIONS_CATALOG.Shop[0],
          inventoryRef.current,
          uiLang
        );

        if (!invValidation.isComplete) {
          finalCompleted = false;
          finalMistakes.push(
            uiLang === "ko"
              ? "가방에 담은 물품이 현재 상황 맥락에 부합하지 않습니다."
              : "The items collected in your backpack did not match the current situational context."
          );
          finalScore = Math.min(finalScore, 70);
          finalFeedback += uiLang === "ko"
            ? " (상황에 맞는 물품 선택과 대화가 더 필요합니다)."
            : " (Further exploration of items and contextual conversation is needed).";
        } else {
          finalFeedback += uiLang === "ko"
            ? " (상황에 어울리는 물품을 알맞게 고르고 훌륭하게 소통했습니다)."
            : " (You selected fitting items and communicated wonderfully).";
        }
      }

      setExitEvaluation({
        doorType,
        loading: false,
        score: finalScore,
        completed: finalCompleted,
        mistakes: finalMistakes,
        feedback: finalFeedback
      });
    } catch (err) {
      console.error("Evaluation error:", err);
      setExitEvaluation({
        doorType,
        loading: false,
        score: 50,
        completed: false,
        mistakes: [
          uiLang === "ko"
            ? "AI 분석 연결 중 기술적 문제가 발생했습니다. 네트워크를 확인해주세요."
            : "A temporary network issue occurred during AI analysis. Please check your connection."
        ],
        feedback: uiLang === "ko"
          ? "평가 결과를 불러오는 중 오류가 발생했습니다."
          : "An error occurred while generating the evaluation."
      });
    } finally {
      isEvaluatingRef.current = false;
    }
  };

  const teleportPlayerOutside = (doorType) => {
    if (!playerRef.current) return;

    if (doorType === "Exit Shop") {
      setCurrentLocation("outside");
      playerRef.current.position.set(0, 0, 3.8);
    } else if (doorType === "Exit Cafe") {
      setCurrentLocation("outside");
      playerRef.current.position.set(-12, 0, 3.8);
    } else if (doorType === "Exit Hotel") {
      setCurrentLocation("outside");
      playerRef.current.position.set(9.5, 0, 3.8);
    } else if (doorType === "Exit Hospital") {
      setCurrentLocation("outside");
      playerRef.current.position.set(-8.0, 0, 13.0);
    } else if (doorType === "Exit Bank") {
      setCurrentLocation("outside");
      playerRef.current.position.set(-23.0, 0, 3.8);
    } else if (doorType === "Exit Library") {
      setCurrentLocation("outside");
      playerRef.current.position.set(19.8, 0, 3.8);
    } else if (doorType === "Exit Police Station") {
      setCurrentLocation("outside");
      playerRef.current.position.set(5.0, 0, 13.0);
    } else if (doorType === "Exit Language School") {
      setCurrentLocation("outside");
      playerRef.current.position.set(-22.0, 0, 32.8);
    } else if (doorType === "Exit Study Center") {
      setCurrentLocation("outside");
      playerRef.current.position.set(-9.5, 0, 33.2);
    } else if (doorType === "Exit Community Center") {
      setCurrentLocation("outside");
      playerRef.current.position.set(9.5, 0, 33.2);
    } else if (doorType === "Exit Career Center") {
      setCurrentLocation("outside");
      playerRef.current.position.set(22.0, 0, 32.8);
    } else if (doorType === "Exit Activity Center") {
      setCurrentLocation("outside");
      playerRef.current.position.set(-16.0, 0, 43.8);
    } else if (doorType === "Exit Multi-Purpose Hall") {
      setCurrentLocation("outside");
      playerRef.current.position.set(16.0, 0, 43.5);
    }
    playerRef.current.rotation.y = 0;
    cameraAnglesRef.current.theta = Math.PI;
    cameraAnglesRef.current.phi = OUTDOOR_BASE_PHI;
    cameraAnglesRef.current.radius = OUTDOOR_RADIUS;
  };

  const formatSaveSuccessMessage = (result) => {
    if (result?.alreadyRecorded) {
      return interfaceLanguage === "ko"
        ? "이미 기록된 미션 시도입니다. 중복 XP는 지급되지 않습니다."
        : "This attempt was already recorded. No duplicate XP awarded.";
    }
    const xpEarned = typeof result?.xpEarned === "number" ? result.xpEarned : 0;
    const totalXP = typeof result?.stats?.totalXP === "number" ? result.stats.totalXP : 0;
    const newlyUnlocked = Array.isArray(result?.newlyUnlocked) ? result.newlyUnlocked : [];

    let achMsg = "";
    if (newlyUnlocked.length > 0) {
      achMsg = interfaceLanguage === "ko"
        ? ` 🏆 ${newlyUnlocked.length}개의 새로운 업적이 달성되었습니다!`
        : ` 🏆 ${newlyUnlocked.length} new achievement(s) unlocked!`;
    }

    if (xpEarned > 0) {
      return interfaceLanguage === "ko"
        ? `🎉 +${xpEarned} XP 획득! 총 ${totalXP} XP.${achMsg}`
        : `🎉 +${xpEarned} XP earned! Total: ${totalXP} XP.${achMsg}`;
    }
    return interfaceLanguage === "ko"
      ? `📋 미션 결과가 저장되었습니다 (+0 XP).${achMsg}`
      : `📋 Mission result saved (+0 XP).${achMsg}`;
  };

  const confirmExitToOutside = async (doorType) => {
    if (isSavingProgressRef.current) return;
    isSavingProgressRef.current = true;
    if (isMountedRef.current) {
      setIsSavingProgress(true);
    }
    isEvaluatingRef.current = false;

    const uid = authUser?.uid;
    const attemptId = currentAttemptIdRef.current || generateAttemptId();
    currentAttemptIdRef.current = attemptId;

    const activeLocMission = currentMissionRef.current
      ? getLocalizedMission(currentMissionRef.current, interfaceLanguage)
      : null;

    const missionData = activeLocMission || {
      id: "exit_mission",
      facility: deriveFacilityName(doorType),
      title: `${deriveFacilityName(doorType)} Mission`,
      goal: ""
    };

    const evaluationData = exitEvaluation
      ? {
          doorType: exitEvaluation.doorType || doorType,
          score: typeof exitEvaluation.score === "number" ? exitEvaluation.score : 0,
          completed: Boolean(exitEvaluation.completed),
          mistakes: Array.isArray(exitEvaluation.mistakes) ? exitEvaluation.mistakes : [],
          feedback: typeof exitEvaluation.feedback === "string" ? exitEvaluation.feedback : ""
        }
      : null;

    const userTimeZone =
      typeof Intl !== "undefined" && typeof Intl.DateTimeFormat === "function"
        ? Intl.DateTimeFormat().resolvedOptions().timeZone
        : null;

    if (uid && evaluationData) {
      try {
        const result = await recordMissionProgress(uid, missionData, evaluationData, attemptId, userTimeZone);
        failedAttemptRef.current = null;
        if (isMountedRef.current) {
          if (result) {
            setUserProfile((prev) => {
              if (!prev) return prev;
              return {
                ...prev,
                stats: {
                  ...(prev.stats || {}),
                  ...(result.stats || {})
                },
                streak: result.streak || prev.streak || { current: 0, longest: 0, lastActiveDate: null },
                achievements: {
                  ...(prev.achievements || {}),
                  ...(result.achievements || {})
                }
              };
            });
          }

          setSaveErrorBanner({
            success: true,
            canRetry: false,
            message: formatSaveSuccessMessage(result)
          });

          if (saveBannerTimeoutRef.current) {
            clearTimeout(saveBannerTimeoutRef.current);
          }
          saveBannerTimeoutRef.current = setTimeout(() => {
            if (isMountedRef.current) {
              setSaveErrorBanner(null);
            }
          }, 4000);
        }
      } catch (err) {
        console.error("Failed to persist mission progress:", err);
        failedAttemptRef.current = {
          uid,
          mission: missionData,
          evaluation: evaluationData,
          attemptId
        };
        if (isMountedRef.current) {
          if (saveBannerTimeoutRef.current) {
            clearTimeout(saveBannerTimeoutRef.current);
          }
          setSaveErrorBanner({
            success: false,
            canRetry: true,
            message: err?.friendlyMessage || (interfaceLanguage === "ko" ? "미션 결과 저장 중 오류가 발생했습니다." : "Failed to persist mission progress.")
          });
        }
      }
    }

    if (isMountedRef.current) {
      setIsSavingProgress(false);
      setExitEvaluation(null);
      setActiveMission(null);
      setShowMissionIntro(false);
      setInventory({});
      setCollectedItemIds([]);
      setItemPrompt(null);
    }
    isSavingProgressRef.current = false;

    messagesHistoryRef.current = [];
    currentMissionRef.current = null;
    currentAttemptIdRef.current = null;

    teleportPlayerOutside(doorType);
  };

  const handleRetrySaveProgress = async () => {
    if (isSavingProgressRef.current || !failedAttemptRef.current) return;
    const { uid, mission, evaluation, attemptId } = failedAttemptRef.current;
    if (!uid || !evaluation || !attemptId) return;

    isSavingProgressRef.current = true;
    if (isMountedRef.current) {
      setIsRetryingSave(true);
    }

    const userTimeZone =
      typeof Intl !== "undefined" && typeof Intl.DateTimeFormat === "function"
        ? Intl.DateTimeFormat().resolvedOptions().timeZone
        : null;

    try {
      const result = await recordMissionProgress(uid, mission, evaluation, attemptId, userTimeZone);
      failedAttemptRef.current = null;
      if (isMountedRef.current) {
        if (result) {
          setUserProfile((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              stats: {
                ...(prev.stats || {}),
                ...(result.stats || {})
              },
              streak: result.streak || prev.streak || { current: 0, longest: 0, lastActiveDate: null },
              achievements: {
                ...(prev.achievements || {}),
                ...(result.achievements || {})
              }
            };
          });
        }
        setSaveErrorBanner({
          success: true,
          canRetry: false,
          message: formatSaveSuccessMessage(result)
        });
        if (saveBannerTimeoutRef.current) {
          clearTimeout(saveBannerTimeoutRef.current);
        }
        saveBannerTimeoutRef.current = setTimeout(() => {
          if (isMountedRef.current) {
            setSaveErrorBanner(null);
          }
        }, 4000);
      }
    } catch (err) {
      console.error("Retry mission progress save failed:", err);
      if (isMountedRef.current) {
        if (saveBannerTimeoutRef.current) {
          clearTimeout(saveBannerTimeoutRef.current);
        }
        setSaveErrorBanner({
          success: false,
          canRetry: true,
          message: err?.friendlyMessage || (interfaceLanguage === "ko" ? "미션 결과 저장 중 다시 오류가 발생했습니다." : "Failed again to save mission progress.")
        });
      }
    } finally {
      isSavingProgressRef.current = false;
      if (isMountedRef.current) {
        setIsRetryingSave(false);
      }
    }
  };

  const closeDialog = () => {
    isGeneratingRef.current = false;
    setReplayingMessageIndex(null);
    setVoiceFeedback(null);
    if (ttsTimeoutRef.current) {
      clearTimeout(ttsTimeoutRef.current);
      ttsTimeoutRef.current = null;
    }
    if (ttsSafetyTimeoutRef.current) {
      clearTimeout(ttsSafetyTimeoutRef.current);
      ttsSafetyTimeoutRef.current = null;
    }
    activeUtteranceRef.current = null;
    if ("speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }

    // Cancel active silence timer and invalidate speech session
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    speechSessionSubmittedRef.current = true;
    accumulatedFinalTranscriptRef.current = "";
    currentInterimTranscriptRef.current = "";
    setSttInterimText("");

    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {}
    }

    setDialogState((prev) => ({
      ...prev,
      isOpen: false,
      status: "idle"
    }));
  };

  // STT Lifecycle & Session Tracking

  // Auto-scroll chat window when new messages arrive or while user is speaking
  useEffect(() => {
    if (messagesEndRef.current && dialogState.isOpen) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [dialogState.messages, dialogState.status, sttInterimText, dialogState.isOpen]);

  // Exactly-once submission coordinator
  const finalizeAndSubmitSpeech = (targetSessionId) => {
    // 1. Guard against callbacks from an old/stale session
    if (speechSessionIdRef.current !== targetSessionId) return;

    // 2. Exactly-once submission guard
    if (speechSessionSubmittedRef.current) return;

    // 3. Clear silence timer
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }

    // 4. Assemble the complete transcript from final segments and interim hypothesis
    const finalText = accumulatedFinalTranscriptRef.current.trim();
    const interimText = currentInterimTranscriptRef.current.trim();
    const fullTranscript = (finalText + (finalText && interimText ? " " : "") + interimText).trim();

    // 5. If no audible speech was captured, reset cleanly without AI request
    if (!fullTranscript) {
      speechSessionSubmittedRef.current = true;
      setSttInterimText("");
      try {
        recognitionRef.current?.stop();
      } catch {}
      setDialogState((prev) => (prev.status === "listening" ? { ...prev, status: "idle" } : prev));
      return;
    }

    // 6. Block duplicate submissions within 2 seconds with identical text
    const now = Date.now();
    if (
      lastSubmittedSpeechRef.current.text === fullTranscript &&
      now - lastSubmittedSpeechRef.current.timestamp < 2000
    ) {
      speechSessionSubmittedRef.current = true;
      setSttInterimText("");
      try {
        recognitionRef.current?.stop();
      } catch {}
      setDialogState((prev) => (prev.status === "listening" ? { ...prev, status: "idle" } : prev));
      return;
    }

    // 7. Mark session submitted BEFORE dispatching to prevent duplicate triggers
    speechSessionSubmittedRef.current = true;
    lastSubmittedSpeechRef.current = { text: fullTranscript, timestamp: now };
    setSttInterimText("");

    // 8. Stop recognition audio capture cleanly
    try {
      recognitionRef.current?.stop();
    } catch {}

    // 9. Dispatch to AI handler
    if (handleUserSpeechRef.current) {
      handleUserSpeechRef.current(fullTranscript);
    }
  };

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        if (speechSessionSubmittedRef.current) return;

        const { finalTranscript, interimTranscript, fullTranscript } =
          processSpeechRecognitionResults(event.results);

        accumulatedFinalTranscriptRef.current = finalTranscript;
        currentInterimTranscriptRef.current = interimTranscript;
        setSttInterimText(fullTranscript);

        // Reset silence timer on every speech event
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = null;
        }

        // When words are present, debounce silence for 1600ms before auto-submitting
        if (fullTranscript.length > 0) {
          const currentSessionId = speechSessionIdRef.current;
          silenceTimerRef.current = setTimeout(() => {
            finalizeAndSubmitSpeech(currentSessionId);
          }, 1600);
        }
      };

      recognition.onerror = (event) => {
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = null;
        }

        const errType = event?.error;
        if (errType && errType !== "no-speech") {
          setVoiceFeedback(mapSpeechErrorToFeedback(errType));
        }

        // If we already accumulated speech before error occurred, finalize it
        const currentText = (
          accumulatedFinalTranscriptRef.current + " " + currentInterimTranscriptRef.current
        ).trim();

        if (!speechSessionSubmittedRef.current && currentText.length > 0) {
          finalizeAndSubmitSpeech(speechSessionIdRef.current);
        } else {
          speechSessionSubmittedRef.current = true;
          setSttInterimText("");
          setDialogState((prev) => (prev.status === "listening" ? { ...prev, status: "idle" } : prev));
        }
      };

      recognition.onend = () => {
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = null;
        }

        // If speech was captured and not yet submitted, finalize now
        if (!speechSessionSubmittedRef.current) {
          finalizeAndSubmitSpeech(speechSessionIdRef.current);
        } else {
          setSttInterimText("");
        }

        setDialogState((prev) => (prev.status === "listening" ? { ...prev, status: "idle" } : prev));
      };

      recognitionRef.current = recognition;

      return () => {
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = null;
        }
        try {
          recognition.abort();
        } catch {}
      };
    }
  }, []);

  const handleUserSpeech = (text) => {
    if (!text || text.trim() === "") return;
    messagesHistoryRef.current.push({ sender: "user", text });
    setDialogState((prev) => ({
      ...prev,
      messages: [...prev.messages, { sender: "user", text }]
    }));
    generateNPCResponseWithAI(text, dialogState.npcName);
  };

  useEffect(() => {
    handleUserSpeechRef.current = handleUserSpeech;
  });

  const handleReplaySpeech = (text, messageIndex) => {
    const currentLearningLang = learningLanguageRef.current || learningLanguage;
    const plan = handleReplayAction({
      text,
      messageIndex,
      status: dialogState.status,
      isGenerating: isGeneratingRef.current,
      npcName: dialogState.npcName,
      learningLanguage: currentLearningLang
    });

    if (!plan.allowed) {
      if (plan.trace) console.log(formatInteractionTrace(plan.trace));
      return;
    }

    // If currently listening, stop recognition cleanly without submitting
    if (dialogState.status === "listening" || recognitionRef.current) {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
      speechSessionSubmittedRef.current = true;
      try {
        recognitionRef.current?.abort();
      } catch {}
      setSttInterimText("");
    }

    setReplayingMessageIndex(plan.messageIndex);
    speakText(plan.textToSpeak, dialogState.npcName, plan.ttsSource, plan.trace);
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const canStart = canStartListening({
      status: dialogState.status,
      isGenerating: isGeneratingRef.current,
      isRecognitionAvailable: Boolean(SpeechRecognition && recognitionRef.current)
    });

    if (!canStart.allowed) {
      if (canStart.reason === "unsupported") {
        setVoiceFeedback(mapSpeechErrorToFeedback("unsupported"));
      }
      return;
    }

    // 1. Cancel ongoing speech synthesis before starting STT to prevent acoustic feedback
    if (ttsTimeoutRef.current) {
      clearTimeout(ttsTimeoutRef.current);
      ttsTimeoutRef.current = null;
    }
    if (ttsSafetyTimeoutRef.current) {
      clearTimeout(ttsSafetyTimeoutRef.current);
      ttsSafetyTimeoutRef.current = null;
    }
    activeUtteranceRef.current = null;
    if ("speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
    setReplayingMessageIndex(null);

    // 2. Clear any lingering silence timer and feedback
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    setVoiceFeedback(null);

    // 3. Reset session state
    speechSessionIdRef.current += 1;
    speechSessionSubmittedRef.current = false;
    accumulatedFinalTranscriptRef.current = "";
    currentInterimTranscriptRef.current = "";
    setSttInterimText("");

    // 4. Set language dynamically (English or Korean)
    const targetLang = getSpeechRecognitionLanguage(learningLanguageRef.current || learningLanguage);
    recognitionRef.current.lang = targetLang;

    // 5. Start speech recognition safely
    try {
      setDialogState((prev) => ({ ...prev, status: "listening" }));
      recognitionRef.current.start();
    } catch (err) {
      setDialogState((prev) => ({ ...prev, status: "idle" }));
      setVoiceFeedback(mapSpeechErrorToFeedback(err?.error || "audio-capture"));
    }
  };

  const stopListeningAndSubmit = () => {
    if (dialogState.status === "listening") {
      finalizeAndSubmitSpeech(speechSessionIdRef.current);
    }
  };

  const handleToggleListening = () => {
    if (dialogState.status === "listening") {
      stopListeningAndSubmit();
    } else if (dialogState.status === "idle") {
      startListening();
    }
  };

  // Handle item pickup (E)
  const handlePickupItem = (item) => {
    if (!item) return;
    if (isItemAlreadyCollected(collectedItemIdsRef.current, item.instanceId)) {
      return;
    }

    setCollectedItemIds((prev) => {
      if (prev.includes(item.instanceId)) return prev;
      return [...prev, item.instanceId];
    });

    setInventory((prev) => addItemToInventory(prev, item));

    const def = ITEM_DEFINITIONS[item.itemId];
    const itemName = getLocalizedItemName(item.itemId, interfaceLanguage) || def?.displayName || item.name || "Item";

    if (pickupToastTimeoutRef.current) {
      clearTimeout(pickupToastTimeoutRef.current);
    }
    setPickupToast({
      text: `${def?.icon || "📦"} ${itemName} (+1)`,
      time: Date.now()
    });
    pickupToastTimeoutRef.current = setTimeout(() => {
      setPickupToast(null);
    }, 2400);
  };

  // Door interaction (E)
  const handleInteractDoor = () => {
    if (!doorPrompt || dialogState.isOpen || isEvaluatingRef.current || exitEvaluation) return;

    if (doorPrompt === "Shop Door") {
      setCurrentLocation("Shop");
      setInventory({});
      setCollectedItemIds([]);
      setItemPrompt(null);
      if (playerRef.current) {
        playerRef.current.position.set(0, 0, 1.5);
        playerRef.current.rotation.y = Math.PI;
      }
      cameraAnglesRef.current.theta = 0;
      cameraAnglesRef.current.phi = Math.PI / 2.2;
      cameraAnglesRef.current.radius = 2.0;

      messagesHistoryRef.current = [];
      const completedMissionIds = Object.keys(userProfile?.missionHistory || {});
      const nextShopMission = selectNextMission(MISSIONS_CATALOG.Shop, {
        lastIndexRef: lastShopMissionIndexRef,
        recentMissionIds: recentShopMissionIdsRef.current,
        completedMissionIds
      });
      if (nextShopMission?.id) {
        recentShopMissionIdsRef.current = [
          ...recentShopMissionIdsRef.current.slice(-3),
          nextShopMission.id
        ];
      }
      startNewMissionAttempt(nextShopMission);
    } else if (doorPrompt === "Cafe Door") {
      setCurrentLocation("Cafe");
      if (playerRef.current) {
        playerRef.current.position.set(-12, 0, 1.5);
        playerRef.current.rotation.y = Math.PI;
      }
      cameraAnglesRef.current.theta = 0;
      cameraAnglesRef.current.phi = Math.PI / 2.2;
      cameraAnglesRef.current.radius = 2.0;

      messagesHistoryRef.current = [];
      startNewMissionAttempt(getRandomMission(MISSIONS_CATALOG.Cafe, lastCafeMissionIndexRef));
    } else if (doorPrompt === "Hotel Door") {
      setCurrentLocation("Hotel");
      if (playerRef.current) {
        playerRef.current.position.set(9.5, 0, 1.5);
        playerRef.current.rotation.y = Math.PI;
      }
      cameraAnglesRef.current.theta = 0;
      cameraAnglesRef.current.phi = Math.PI / 2.2;
      cameraAnglesRef.current.radius = 2.0;

      messagesHistoryRef.current = [];
      startNewMissionAttempt(getRandomMission(MISSIONS_CATALOG.Hotel, lastHotelMissionIndexRef));
    } else if (doorPrompt === "Hospital Door") {
      setCurrentLocation("Hospital");
      if (playerRef.current) {
        playerRef.current.position.set(-8.0, 0, 19.5);
        playerRef.current.rotation.y = Math.PI;
      }
      cameraAnglesRef.current.theta = 0;
      cameraAnglesRef.current.phi = Math.PI / 2.2;
      cameraAnglesRef.current.radius = 2.0;

      messagesHistoryRef.current = [];
      startNewMissionAttempt(getRandomMission(MISSIONS_CATALOG.Hospital, lastHospitalMissionIndexRef));
    } else if (doorPrompt === "Bank Door") {
      setCurrentLocation("Bank");
      if (playerRef.current) {
        playerRef.current.position.set(-23.0, 0, 1.3);
        playerRef.current.rotation.y = Math.PI;
      }
      cameraAnglesRef.current.theta = 0;
      cameraAnglesRef.current.phi = Math.PI / 2.2;
      cameraAnglesRef.current.radius = 2.0;

      messagesHistoryRef.current = [];
      startNewMissionAttempt(getRandomMission(MISSIONS_CATALOG.Bank, lastBankMissionIndexRef));
    } else if (doorPrompt === "Library Door") {
      setCurrentLocation("Library");
      if (playerRef.current) {
        playerRef.current.position.set(19.8, 0, 1.3);
        playerRef.current.rotation.y = Math.PI;
      }
      cameraAnglesRef.current.theta = 0;
      cameraAnglesRef.current.phi = Math.PI / 2.2;
      cameraAnglesRef.current.radius = 2.0;

      messagesHistoryRef.current = [];
      startNewMissionAttempt(getRandomMission(MISSIONS_CATALOG.Library, lastLibraryMissionIndexRef));
    } else if (doorPrompt === "Police Station Door") {
      setCurrentLocation("PoliceStation");
      if (playerRef.current) {
        playerRef.current.position.set(5.0, 0, 19.5);
        playerRef.current.rotation.y = Math.PI;
      }
      cameraAnglesRef.current.theta = 0;
      cameraAnglesRef.current.phi = Math.PI / 2.2;
      cameraAnglesRef.current.radius = 2.0;

      messagesHistoryRef.current = [];
      startNewMissionAttempt(getRandomMission(MISSIONS_CATALOG.PoliceStation, lastPoliceMissionIndexRef));
    } else if (doorPrompt === "Language School Door") {
      setCurrentLocation("LanguageSchool");
      if (playerRef.current) {
        playerRef.current.position.set(-22.0, 0, 39.2);
        playerRef.current.rotation.y = Math.PI;
      }
      cameraAnglesRef.current.theta = 0;
      cameraAnglesRef.current.phi = Math.PI / 2.2;
      cameraAnglesRef.current.radius = 2.0;

      messagesHistoryRef.current = [];
      startNewMissionAttempt(getRandomMission(MISSIONS_CATALOG.LanguageSchool, lastLanguageSchoolMissionIndexRef));
    } else if (doorPrompt === "Study Center Door") {
      setCurrentLocation("StudyCenter");
      if (playerRef.current) {
        playerRef.current.position.set(-9.5, 0, 39.2);
        playerRef.current.rotation.y = Math.PI;
      }
      cameraAnglesRef.current.theta = 0;
      cameraAnglesRef.current.phi = Math.PI / 2.2;
      cameraAnglesRef.current.radius = 2.0;

      messagesHistoryRef.current = [];
      startNewMissionAttempt(getRandomMission(MISSIONS_CATALOG.StudyCenter, lastStudyCenterMissionIndexRef));
    } else if (doorPrompt === "Community Center Door") {
      setCurrentLocation("CommunityCenter");
      if (playerRef.current) {
        playerRef.current.position.set(9.5, 0, 39.2);
        playerRef.current.rotation.y = Math.PI;
      }
      cameraAnglesRef.current.theta = 0;
      cameraAnglesRef.current.phi = Math.PI / 2.2;
      cameraAnglesRef.current.radius = 2.0;

      messagesHistoryRef.current = [];
      startNewMissionAttempt(getRandomMission(MISSIONS_CATALOG.CommunityCenter, lastCommunityCenterMissionIndexRef));
    } else if (doorPrompt === "Career Center Door") {
      setCurrentLocation("CareerCenter");
      if (playerRef.current) {
        playerRef.current.position.set(22.0, 0, 39.2);
        playerRef.current.rotation.y = Math.PI;
      }
      cameraAnglesRef.current.theta = 0;
      cameraAnglesRef.current.phi = Math.PI / 2.2;
      cameraAnglesRef.current.radius = 2.0;

      messagesHistoryRef.current = [];
      startNewMissionAttempt(getRandomMission(MISSIONS_CATALOG.CareerCenter, lastCareerCenterMissionIndexRef));
    } else if (doorPrompt === "Activity Center Door") {
      setCurrentLocation("ActivityCenter");
      if (playerRef.current) {
        playerRef.current.position.set(-16.0, 0, 49.5);
        playerRef.current.rotation.y = Math.PI;
      }
      cameraAnglesRef.current.theta = 0;
      cameraAnglesRef.current.phi = Math.PI / 2.2;
      cameraAnglesRef.current.radius = 2.0;

      messagesHistoryRef.current = [];
      startNewMissionAttempt(getRandomMission(MISSIONS_CATALOG.ActivityCenter, lastActivityCenterMissionIndexRef));
    } else if (doorPrompt === "Multi-Purpose Hall Door") {
      setCurrentLocation("MultiPurposeHall");
      if (playerRef.current) {
        playerRef.current.position.set(16.0, 0, 49.5);
        playerRef.current.rotation.y = Math.PI;
      }
      cameraAnglesRef.current.theta = 0;
      cameraAnglesRef.current.phi = Math.PI / 2.2;
      cameraAnglesRef.current.radius = 2.0;

      messagesHistoryRef.current = [];
      startNewMissionAttempt(getRandomMission(MISSIONS_CATALOG.MultiPurposeHall, lastMultiPurposeHallMissionIndexRef));
    } else if (
      doorPrompt === "Exit Shop" ||
      doorPrompt === "Exit Cafe" ||
      doorPrompt === "Exit Hotel" ||
      doorPrompt === "Exit Hospital" ||
      doorPrompt === "Exit Bank" ||
      doorPrompt === "Exit Library" ||
      doorPrompt === "Exit Police Station" ||
      doorPrompt === "Exit Language School" ||
      doorPrompt === "Exit Study Center" ||
      doorPrompt === "Exit Community Center" ||
      doorPrompt === "Exit Career Center" ||
      doorPrompt === "Exit Activity Center" ||
      doorPrompt === "Exit Multi-Purpose Hall"
    ) {
      evaluateOnExit(doorPrompt);
    }
  };

  // NPC bilan suhbat bosilganda (F)
  const handleInteractNPC = () => {
    const currentLearningLang = learningLanguageRef.current || learningLanguage;
    const plan = handleNPCInteraction({
      npcPrompt,
      messagesHistory: messagesHistoryRef.current,
      isDialogOpen: dialogState.isOpen,
      learningLanguage: currentLearningLang,
      activeScenario: currentMissionRef.current
    });

    if (plan.action === "close") {
      console.log(formatInteractionTrace(plan.trace));
      closeDialog();
      return;
    }

    if (plan.action === "ignore") {
      console.log(formatInteractionTrace(plan.trace));
      return;
    }

    if (plan.action === "open_greeting") {
      messagesHistoryRef.current.push({ sender: "npc", text: plan.greeting });
      setDialogState({
        isOpen: true,
        npcName: plan.npcName,
        status: "speaking",
        messages: [{ sender: "npc", text: plan.greeting }]
      });

      speakText(plan.textToSpeak, plan.npcName, plan.ttsSource, plan.trace);
      return;
    }

    if (plan.action === "open_existing") {
      console.log(formatInteractionTrace(plan.trace));
      setDialogState({
        isOpen: true,
        npcName: plan.npcName,
        status: "idle",
        messages: [...messagesHistoryRef.current]
      });
      return;
    }
  };

  const handleMobileInteract = () => {
    if (dialogState.isOpen || exitEvaluation || isEvaluatingRef.current) return;
    if (itemPrompt) {
      handlePickupItem(itemPrompt);
    } else if (doorPrompt) {
      handleInteractDoor();
    }
  };

  const handleMobileTalk = () => {
    if (exitEvaluation) return;
    handleInteractNPC();
  };

  const handleMobileStats = () => {
    if (exitEvaluationRef.current || isSettingsOpenRef.current) return;
    setIsProgressPanelOpen((prev) => !prev);
  };

  if (authLoading) {
    return (
      <div
        style={{
          width: "100%",
          height: "100dvh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "radial-gradient(ellipse at 50% 25%, #1e293b 0%, #0f172a 65%, #020617 100%)",
          color: "#fff",
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        }}
      >
        <div style={{ fontSize: "40px", marginBottom: "14px" }}>🏡</div>
        <div style={{ fontSize: "18px", fontWeight: "600", letterSpacing: "-0.01em" }}>
          Entering AI Language Village...
        </div>
      </div>
    );
  }

  if (!authUser || !isUserVerified(authUser)) {
    return (
      <AuthScreen
        user={authUser}
        onAuthSuccess={(u) => {
          setAuthUser(u);
          fetchProfileForUser(u);
        }}
        onSignOut={() => {
          setAuthUser(null);
          setUserProfile(null);
        }}
      />
    );
  }

  if (profileLoading) {
    return (
      <div
        style={{
          width: "100%",
          height: "100dvh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "radial-gradient(ellipse at 50% 25%, #1e293b 0%, #0f172a 65%, #020617 100%)",
          color: "#fff",
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        }}
      >
        <div style={{ fontSize: "40px", marginBottom: "14px" }}>📚</div>
        <div style={{ fontSize: "18px", fontWeight: "600", letterSpacing: "-0.01em" }}>
          Loading your learning profile...
        </div>
      </div>
    );
  }

  if (profileError) {
    return (
      <div
        style={{
          width: "100%",
          height: "100dvh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "radial-gradient(ellipse at 50% 25%, #1e293b 0%, #0f172a 65%, #020617 100%)",
          color: "#fff",
          padding: "20px",
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        }}
      >
        <div
          style={{
            maxWidth: "420px",
            background: "rgba(30, 30, 38, 0.9)",
            border: "1px solid rgba(239, 68, 68, 0.35)",
            borderRadius: "18px",
            padding: "28px",
            textAlign: "center"
          }}
        >
          <div style={{ fontSize: "36px", marginBottom: "12px" }}>⚠️</div>
          <h2 style={{ fontSize: "18px", margin: "0 0 10px 0", color: "#fca5a5" }}>
            Profile Connection Issue
          </h2>
          <p style={{ fontSize: "13px", color: "#94a3b8", lineHeight: 1.4, margin: "0 0 20px 0" }}>
            {profileError}
          </p>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => fetchProfileForUser(authUser)}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "10px",
                border: "none",
                background: "#2563eb",
                color: "#fff",
                fontWeight: "600",
                fontSize: "14px",
                cursor: "pointer"
              }}
            >
              Retry
            </button>
            <button
              onClick={() => {
                signOutUser();
                setAuthUser(null);
                setUserProfile(null);
              }}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "10px",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                background: "rgba(255, 255, 255, 0.05)",
                color: "#cbd5e1",
                fontWeight: "500",
                fontSize: "14px",
                cursor: "pointer"
              }}
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!userProfile || !userProfile.onboardingCompleted) {
    return (
      <OnboardingScreen
        user={authUser}
        profile={userProfile}
        onComplete={(updated) => setUserProfile(updated)}
        onSignOut={() => {
          signOutUser();
          setAuthUser(null);
          setUserProfile(null);
        }}
      />
    );
  }

  return (
    <div className={`game-viewport ${device.layoutClass}`} style={{ width: "100%", height: "100dvh", position: "relative", overflow: "hidden" }}>
      {/* R3F 3D Canvas */}
      <VillageCanvas
        playerRef={playerRef}
        cameraAnglesRef={cameraAnglesRef}
        currentLocation={currentLocation}
        isDialogOpen={dialogState.isOpen}
        hasModalOpen={Boolean(exitEvaluation || isProgressPanelOpen || isSettingsOpen)}
        isTalking={dialogState.status === "speaking"}
        shopItems={DEFAULT_SHOP_3D_ITEMS}
        collectedItemIds={collectedItemIds}
        onPickupItem={handlePickupItem}
        onPromptChange={({ door, npc, item }) => {
          setDoorPrompt(door);
          setNpcPrompt(npc);
          setItemPrompt(item);
        }}
        onInteractDoor={handleInteractDoor}
        onInteractNPC={handleInteractNPC}
        joystickVecRef={joystickVecRef}
      />

      {/* Mobile Touch Gameplay Controls (Joystick & Action Buttons) */}
      {showMobileControls && (
        <>
          <MobileJoystick
            onMove={(vec) => {
              joystickVecRef.current = vec;
            }}
            disabled={
              dialogState.isOpen ||
              Boolean(exitEvaluation || isProgressPanelOpen || isSettingsOpen)
            }
            size={device.height <= 480 && device.isLandscape ? 116 : 140}
            knobSize={device.height <= 480 && device.isLandscape ? 46 : 54}
          />
          <MobileActionButtons
            doorPrompt={doorPrompt}
            npcPrompt={npcPrompt}
            itemPrompt={itemPrompt}
            onInteract={handleMobileInteract}
            onTalk={handleMobileTalk}
            onToggleStats={handleMobileStats}
            disabled={
              dialogState.isOpen ||
              Boolean(exitEvaluation || isProgressPanelOpen || isSettingsOpen)
            }
            interfaceLanguage={interfaceLanguage}
          />
        </>
      )}

      {/* Control navigation hints (hidden on touch/mobile devices) */}
      {!dialogState.isOpen && !exitEvaluation && !showMobileControls && (
        <div className="controls-hint-bar">
          {interfaceLanguage === "ko" ? (
            <span>
              🖱️ <strong>마우스 드래그:</strong> 시점 전환 | ⌨️ <strong>WASD:</strong> 이동 | 🚪 <strong>E:</strong> 출입 / 결과 | 💬 <strong>F:</strong> 대화 | 📊 <strong>M:</strong> 통계
            </span>
          ) : (
            <span>
              🖱️ <strong>Mouse Drag:</strong> Look Around | ⌨️ <strong>WASD:</strong> Move | 🚪 <strong>E:</strong> Enter / Exit | 💬 <strong>F:</strong> Talk | 📊 <strong>M:</strong> Stats
            </span>
          )}
        </div>
      )}

      {/* Non-blocking Save Progress Notification */}
      {saveErrorBanner && (
        <div
          style={{
            position: "absolute",
            top: "16px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 60,
            background: saveErrorBanner.success
              ? "rgba(16, 185, 129, 0.92)"
              : "rgba(220, 38, 38, 0.92)",
            backdropFilter: "blur(8px)",
            color: "#fff",
            padding: "8px 16px",
            borderRadius: "10px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            fontSize: "13px",
            fontWeight: "500",
            maxWidth: "90vw"
          }}
        >
          <span>{saveErrorBanner.success ? "" : "⚠️ "}{saveErrorBanner.message}</span>
          {!saveErrorBanner.success && saveErrorBanner.canRetry && (
            <button
              onClick={handleRetrySaveProgress}
              disabled={isRetryingSave}
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                border: "1px solid rgba(255, 255, 255, 0.4)",
                color: "#fff",
                borderRadius: "6px",
                padding: "3px 8px",
                fontSize: "11px",
                fontWeight: "600",
                cursor: isRetryingSave ? "not-allowed" : "pointer"
              }}
            >
              {isRetryingSave
                ? (interfaceLanguage === "ko" ? "⏳ 저장 중..." : "⏳ Saving...")
                : (interfaceLanguage === "ko" ? "🔄 다시 시도" : "🔄 Retry")}
            </button>
          )}
          <button
            onClick={() => {
              if (saveBannerTimeoutRef.current) {
                clearTimeout(saveBannerTimeoutRef.current);
              }
              setSaveErrorBanner(null);
            }}
            style={{
              background: "transparent",
              border: "none",
              color: "#fff",
              fontSize: "15px",
              cursor: "pointer",
              marginLeft: "4px",
              lineHeight: 1
            }}
            title={interfaceLanguage === "ko" ? "닫기" : "Close"}
          >
            ✕
          </button>
        </div>
      )}

      {/* User Session & Settings (Top-Left HUD) */}
      {!dialogState.isOpen && !exitEvaluation && (
        <div className="hud-top-left hud-container">
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "14px" }}>👤</span>
            <strong>{userProfile?.displayName || authUser?.displayName || authUser?.email?.split("@")[0] || "Student"}</strong>
            <span
              style={{
                fontSize: "11px",
                fontWeight: "700",
                background: "rgba(234, 179, 8, 0.2)",
                color: "#fde047",
                padding: "2px 6px",
                borderRadius: "6px"
              }}
            >
              ⚡ {userProfile?.stats?.totalXP ?? 0} XP
            </span>
            {Boolean(userProfile?.streak?.current) && (
              <span
                className="hud-badge-streak"
                style={{
                  fontSize: "11px",
                  fontWeight: "700",
                  background: "rgba(249, 115, 22, 0.2)",
                  color: "#fb923c",
                  padding: "2px 6px",
                  borderRadius: "6px"
                }}
              >
                🔥 {t("hud.streakDays", { count: userProfile.streak.current }, interfaceLanguage)}
              </span>
            )}
            {learningLevel && (
              <span
                className="hud-badge-level"
                style={{
                  fontSize: "11px",
                  fontWeight: "600",
                  background: "rgba(37, 99, 235, 0.25)",
                  color: "#93c5fd",
                  padding: "2px 6px",
                  borderRadius: "6px",
                  textTransform: "capitalize"
                }}
              >
                {learningLanguage === "ko" ? "🇰🇷" : "🇺🇸"}{" "}
                {getLevelName(learningLevel, interfaceLanguage)}
              </span>
            )}
          </span>
          <div className="hud-btn-group" style={{ display: "inline-flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
            <button
              className="hud-stats-btn"
              onClick={() => setIsProgressPanelOpen(true)}
              style={{
                background: "rgba(37, 99, 235, 0.25)",
                border: "1px solid rgba(37, 99, 235, 0.5)",
                color: "#93c5fd",
                borderRadius: "6px",
                padding: "5px 9px",
                fontSize: "11px",
                fontWeight: "600",
                cursor: "pointer",
                minHeight: "32px",
                display: "inline-flex",
                alignItems: "center"
              }}
            >
              📊 {interfaceLanguage === "ko" ? "통계" : "Stats"}
            </button>
            <button
              className="hud-settings-btn"
              onClick={() => setIsSettingsOpen(true)}
              style={{
                background: "rgba(168, 85, 247, 0.25)",
                border: "1px solid rgba(168, 85, 247, 0.5)",
                color: "#d8b4fe",
                borderRadius: "6px",
                padding: "5px 9px",
                fontSize: "11px",
                fontWeight: "600",
                cursor: "pointer",
                minHeight: "32px",
                display: "inline-flex",
                alignItems: "center"
              }}
            >
              ⚙️ {t("hud.openSettings", {}, interfaceLanguage)}
            </button>
            <button
              className="hud-signout-btn"
              onClick={() => {
                setIsProgressPanelOpen(false);
                setIsSettingsOpen(false);
                signOutUser();
              }}
              style={{
                background: "rgba(239, 68, 68, 0.2)",
                border: "1px solid rgba(239, 68, 68, 0.4)",
                color: "#fca5a5",
                borderRadius: "6px",
                padding: "5px 9px",
                fontSize: "11px",
                fontWeight: "600",
                cursor: "pointer",
                minHeight: "32px",
                display: "inline-flex",
                alignItems: "center"
              }}
            >
              {t("auth.signOut", {}, interfaceLanguage) || "Log Out"}
            </button>
          </div>
        </div>
      )}

      {/* Real-time Village Minimap (Top-Right HUD) */}
      {!exitEvaluation && (
        <MiniMap
          playerRef={playerRef}
          currentLocation={currentLocation}
          interfaceLanguage={interfaceLanguage}
          compact={device.isMobile}
        />
      )}

      {/* Shop Backpack Inventory Panel (Top-Right, below MiniMap) */}
      {currentLocation === "Shop" && !exitEvaluation && (
        <div className="shop-inventory-panel modal-scrollable hud-container">
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255, 255, 255, 0.12)", paddingBottom: "6px" }}>
            <span style={{ fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px", color: "#60a5fa" }}>
              🎒 {t("hud.backpackTitle", {}, interfaceLanguage)}
            </span>
            <span style={{ fontSize: "11px", color: "#94a3b8" }}>
              {t("hud.itemsCount", { count: Object.values(inventory).reduce((sum, count) => sum + count, 0) }, interfaceLanguage)}
            </span>
          </div>

          {/* Inventory Items List */}
          <div>
            {Object.keys(inventory).length === 0 ? (
              <div style={{ fontSize: "11px", color: "#64748b", fontStyle: "italic", textAlign: "center", padding: "10px 0", whiteSpace: "pre-line" }}>
                {t("hud.backpackEmpty", {}, interfaceLanguage)}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginTop: "4px" }}>
                {Object.entries(inventory).map(([itemId, qty]) => {
                  const def = ITEM_DEFINITIONS[itemId];
                  const localizedName = getLocalizedItemName(itemId, interfaceLanguage) || def?.displayName || itemId;
                  return (
                    <div
                      key={itemId}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        fontSize: "12px",
                        padding: "4px 8px",
                        borderRadius: "6px",
                        background: "rgba(255, 255, 255, 0.05)",
                        border: "1px solid rgba(255, 255, 255, 0.08)"
                      }}
                    >
                      <span>
                        {def?.icon || "📦"} {localizedName}
                      </span>
                      <strong style={{ color: "#38bdf8" }}>×{qty}</strong>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pickup Toast Notification */}
      {pickupToast && !exitEvaluation && (
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(34, 197, 94, 0.95)",
            color: "white",
            padding: "8px 18px",
            borderRadius: "20px",
            fontSize: "14px",
            fontWeight: "600",
            boxShadow: "0 6px 20px rgba(0, 0, 0, 0.35)",
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}
        >
          <span>✓</span>
          <span>{pickupToast.text}</span>
        </div>
      )}

      {/* Item Pickup prompt (E / Tap) */}
      {itemPrompt && !dialogState.isOpen && !exitEvaluation && (
        <button
          type="button"
          className="interaction-prompt-btn"
          onClick={() => handlePickupItem(itemPrompt)}
          title={
            showMobileControls
              ? (interfaceLanguage === "ko" ? "아이템 획득" : "Pick up item")
              : (interfaceLanguage === "ko" ? "아이템 획득 (터치 또는 E)" : "Pick up item (Tap or E)")
          }
        >
          <span style={{ fontSize: "20px" }}>
            {ITEM_DEFINITIONS[itemPrompt.itemId]?.icon || "📦"}
          </span>
          {showMobileControls ? (
            <span>
              {interfaceLanguage === "ko" ? (
                <>터치: <strong>{getLocalizedItemName(itemPrompt.itemId, interfaceLanguage) || itemPrompt.displayName}</strong> 획득</>
              ) : (
                <>Tap to pick up <strong>{getLocalizedItemName(itemPrompt.itemId, interfaceLanguage) || itemPrompt.displayName}</strong></>
              )}
            </span>
          ) : (
            <span>
              {interfaceLanguage === "ko" ? (
                <><strong style={{ color: "#60a5fa" }}>E</strong> / 터치: <strong>{getLocalizedItemName(itemPrompt.itemId, interfaceLanguage) || itemPrompt.displayName}</strong> 획득</>
              ) : (
                <>Press <strong style={{ color: "#60a5fa" }}>E</strong> or Tap to pick up <strong>{getLocalizedItemName(itemPrompt.itemId, interfaceLanguage) || itemPrompt.displayName}</strong></>
              )}
            </span>
          )}
        </button>
      )}

      {/* Door interaction prompt (E / Tap) */}
      {doorPrompt && !itemPrompt && !dialogState.isOpen && !exitEvaluation && (
        <button
          type="button"
          className="interaction-prompt-btn"
          onClick={handleInteractDoor}
          title={doorPrompt}
        >
          <span style={{ fontSize: "20px" }}>🚪</span>
          <div>
            <div><strong>{doorPrompt}</strong></div>
            <div style={{ marginTop: "2px", fontSize: "12px", color: "#93c5fd", fontWeight: "normal" }}>
              {showMobileControls
                ? (doorPrompt.startsWith("Exit")
                    ? (interfaceLanguage === "ko" ? "터치하여 나가기" : "Tap to exit")
                    : (interfaceLanguage === "ko" ? "터치하여 입장" : "Tap to enter"))
                : (doorPrompt.startsWith("Exit")
                    ? (interfaceLanguage === "ko" ? "터치 또는 E: 나가기" : "Tap or press E to exit")
                    : (interfaceLanguage === "ko" ? "터치 또는 E: 입장" : "Tap or press E to enter"))}
            </div>
          </div>
        </button>
      )}



      {/* Active Mission Intro Modal */}
      {showMissionIntro && activeMission && !dialogState.isOpen && !exitEvaluation && (
        <div
          role="dialog"
          aria-modal="true"
          className="modal-scrollable"
          style={{
            position: "absolute",
            zIndex: 25,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "rgba(15, 23, 42, 0.95)",
            color: "#f8fafc",
            border: "1px solid rgba(59, 130, 246, 0.35)",
            backdropFilter: "blur(12px)",
            padding: "clamp(20px, 4vw, 28px)",
            borderRadius: "18px",
            width: "min(440px, calc(100vw - 32px))",
            maxHeight: "min(560px, calc(100dvh - 40px))",
            overflowY: "auto",
            boxShadow: "0 20px 45px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.08)",
            textAlign: "center"
          }}
        >
          {/* Badge */}
          <div style={{ display: "inline-block", padding: "4px 12px", borderRadius: "999px", background: "rgba(59, 130, 246, 0.2)", border: "1px solid rgba(59, 130, 246, 0.4)", color: "#93c5fd", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "12px" }}>
            {interfaceLanguage === "ko" ? "🎯 새로운 미션 목표" : "🎯 New Mission Objective"}
          </div>

          {/* Title */}
          <h2 style={{ margin: "0 0 12px 0", fontSize: "21px", color: "#ffffff", fontWeight: "800" }}>
            {activeMission.title}
          </h2>

          {/* Objective / Description */}
          <div style={{ background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "12px", padding: "14px", marginBottom: "16px", textAlign: "left" }}>
            <div style={{ fontSize: "11px", fontWeight: "700", color: "#38bdf8", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>
              {interfaceLanguage === "ko" ? "미션 과제" : "Task"}
            </div>
            <p style={{ margin: 0, fontSize: "15px", lineHeight: "1.5", color: "#e2e8f0", fontWeight: "500" }}>
              {activeMission.goal || activeMission.text}
            </p>
          </div>

          {/* Required Items & Exact Conditions (if applicable) */}
          {activeMission.requiredItems && Object.keys(activeMission.requiredItems).length > 0 && (
            <div style={{ background: "rgba(30, 41, 59, 0.7)", border: "1px solid rgba(59, 130, 246, 0.2)", borderRadius: "12px", padding: "12px 14px", marginBottom: "16px", textAlign: "left" }}>
              <div style={{ fontSize: "11px", fontWeight: "700", color: "#60a5fa", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>
                {interfaceLanguage === "ko" ? "📋 필수 수집 물품" : "📋 Required Items"}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {Object.entries(activeMission.requiredItems).map(([itemId, qty]) => {
                  const def = ITEM_DEFINITIONS[itemId];
                  const itemName = getLocalizedItemName(itemId, interfaceLanguage) || def?.displayName || itemId;
                  return (
                    <div key={itemId} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "13px", padding: "4px 8px", background: "rgba(255, 255, 255, 0.04)", borderRadius: "6px" }}>
                      <span>{def?.icon || "📦"} {itemName}</span>
                      <strong style={{ color: "#38bdf8" }}>{interfaceLanguage === "ko" ? `${qty}개` : `${qty}`}</strong>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Relevant Task Instructions & Guidance */}
          <div style={{ fontSize: "12px", color: "#94a3b8", lineHeight: "1.45", marginBottom: "18px", textAlign: "left", background: "rgba(255, 255, 255, 0.02)", padding: "10px 12px", borderRadius: "10px" }}>
            <p style={{ margin: "0 0 6px 0" }}>
              💡 {interfaceLanguage === "ko" ? (
                <span>NPC는 미션 정답이나 해결법을 대신 안내하지 않습니다. 상황에 맞게 직접 대화하고 행동을 완수하세요.</span>
              ) : (
                <span>NPCs will not complete the mission for you or give away solutions. Converse naturally and discover what to do on your own.</span>
              )}
            </p>
            <p style={{ margin: 0, color: "#64748b", fontSize: "11px" }}>
              {interfaceLanguage === "ko" ? (
                <span><strong>F</strong> 키 또는 대화 버튼으로 대화 | 퇴장 문을 통해 나가면 평가가 시작됩니다.</span>
              ) : (
                <span>Press <strong>F</strong> or tap prompt to speak | Evaluation begins upon leaving via door.</span>
              )}
            </p>
          </div>

          {/* Action Button */}
          <button
            type="button"
            onClick={() => setShowMissionIntro(false)}
            style={{
              width: "100%",
              padding: "12px",
              border: "none",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
              color: "#ffffff",
              cursor: "pointer",
              fontSize: "15px",
              fontWeight: "700",
              minHeight: "44px",
              boxShadow: "0 4px 14px rgba(37, 99, 235, 0.4)",
              transition: "transform 0.1s ease, filter 0.2s ease"
            }}
          >
            {interfaceLanguage === "ko" ? "미션 시작하기" : "Start Mission"}
          </button>
        </div>
      )}

      {/* NPC Proximity Prompt (F / Tap) */}
      {npcPrompt && !itemPrompt && !dialogState.isOpen && !exitEvaluation && (
        <button
          type="button"
          className="interaction-prompt-btn"
          onClick={handleInteractNPC}
          title={npcPrompt}
        >
          <span style={{ fontSize: "20px" }}>💬</span>
          <span>
            {showMobileControls
              ? (interfaceLanguage === "ko"
                  ? `${npcPrompt} (터치하여 대화)`
                  : `Talk to ${npcPrompt} (Tap)`)
              : (interfaceLanguage === "ko"
                  ? `${npcPrompt} (터치 또는 F: 대화)`
                  : `Talk to ${npcPrompt} (Tap or F)`)}
          </span>
        </button>
      )}

      {/* Exit Evaluation Modal */}
      {exitEvaluation && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "absolute",
            zIndex: 50,
            top: 0,
            left: 0,
            width: "100%",
            height: "100dvh",
            background: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "clamp(10px, 3vw, 20px)"
          }}
        >
          <div
            className="modal-scrollable"
            style={{
              width: "min(480px, calc(100vw - 24px))",
              maxHeight: "min(640px, calc(100dvh - 32px))",
              overflowY: "auto",
              background: "#1e1e24",
              color: "#fff",
              borderRadius: "18px",
              padding: "clamp(18px, 4vw, 28px)",
              boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
              border: "1px solid rgba(255,255,255,0.15)",
              fontFamily: "system-ui, sans-serif"
            }}
          >
            {exitEvaluation.loading ? (
              <div style={{ textAlign: "center", padding: "30px 10px" }}>
                <h3 style={{ color: "#64b5f6", margin: "0 0 10px 0" }}>⏳ {t("evaluation.analyzingSpeech", {}, interfaceLanguage)}</h3>
                <p style={{ color: "#aaa", fontSize: "14px" }}>
                  {interfaceLanguage === "ko" ? "AI가 대화 내용을 평가하고 있습니다..." : "AI is evaluating your spoken conversation..."}
                </p>
              </div>
            ) : (
              <>
                <h2 style={{ margin: "0 0 8px 0", color: exitEvaluation.completed ? "#4caf50" : "#ffb74d" }}>
                  {exitEvaluation.completed
                    ? t("evaluation.modalTitleSuccess", {}, interfaceLanguage)
                    : t("evaluation.modalTitleResult", {}, interfaceLanguage)}
                </h2>
                <p style={{ margin: "0 0 16px 0", color: "#aaa", fontSize: "14px" }}>
                  {interfaceLanguage === "ko" ? "퇴장 전 언어 평가 결과 리포트:" : "Speaking evaluation report before exit:"}
                </p>

                <div style={{ marginBottom: "18px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", fontSize: "15px" }}>
                    <span>{t("evaluation.scoreLabel", {}, interfaceLanguage)}</span>
                    <strong style={{ color: "#64b5f6" }}>{exitEvaluation.score}%</strong>
                  </div>
                  <div style={{ width: "100%", height: "8px", background: "#333", borderRadius: "4px", overflow: "hidden" }}>
                    <div
                      style={{
                        width: `${exitEvaluation.score}%`,
                        height: "100%",
                        background:
                          exitEvaluation.score > 70
                            ? "#4caf50"
                            : exitEvaluation.score > 40
                              ? "#ff9800"
                              : "#f44336",
                        transition: "width 0.4s ease"
                      }}
                    />
                  </div>
                </div>

                {/* XP Reward Preview */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "18px",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    background: exitEvaluation.completed
                      ? "rgba(234, 179, 8, 0.12)"
                      : "rgba(255, 255, 255, 0.05)",
                    border: `1px solid ${
                      exitEvaluation.completed ? "rgba(234, 179, 8, 0.3)" : "rgba(255, 255, 255, 0.1)"
                    }`,
                    fontSize: "14px"
                  }}
                >
                  <span style={{ color: "#ccc" }}>{interfaceLanguage === "ko" ? "XP 보상:" : "XP Reward:"}</span>
                  <strong
                    style={{
                      color: exitEvaluation.completed ? "#fde047" : "#94a3b8",
                      fontWeight: "700"
                    }}
                  >
                    {exitEvaluation.completed
                      ? `+${calculateMissionXP(true, exitEvaluation.score)} XP`
                      : t("evaluation.noXpEarned", {}, interfaceLanguage)}
                  </strong>
                </div>

                <div style={{ marginBottom: "18px" }}>
                  <strong style={{ color: "#ef5350", fontSize: "14px" }}>
                    {t("evaluation.mistakesTitle", {}, interfaceLanguage)}
                  </strong>
                  <div style={{ marginTop: "8px", display: "flex", flexDirection: "column", gap: "8px", maxHeight: "150px", overflowY: "auto" }}>
                    {exitEvaluation.mistakes && exitEvaluation.mistakes.length > 0 ? (
                      exitEvaluation.mistakes.map((item, idx) => (
                        <div
                          key={idx}
                          style={{
                            background: "rgba(255,255,255,0.06)",
                            padding: "10px 12px",
                            borderRadius: "8px",
                            fontSize: "13px",
                            borderLeft: "3px solid #ef5350"
                          }}
                        >
                          {item}
                        </div>
                      ))
                    ) : (
                      <div style={{ color: "#4caf50", fontSize: "13px" }}>
                        {t("evaluation.noMistakes", {}, interfaceLanguage)}
                      </div>
                    )}
                  </div>
                </div>

                <div
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    padding: "12px",
                    borderRadius: "10px",
                    fontSize: "13px",
                    color: "#ddd",
                    marginBottom: "20px"
                  }}
                >
                  <strong style={{ color: "#64b5f6" }}>
                    {t("evaluation.aiSummaryTitle", {}, interfaceLanguage)}{" "}
                  </strong>
                  {exitEvaluation.feedback}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <button
                    onClick={() => confirmExitToOutside(exitEvaluation.doorType)}
                    disabled={isSavingProgress}
                    style={{
                      width: "100%",
                      padding: "12px",
                      background: isSavingProgress ? "#555" : "#1976d2",
                      color: "#fff",
                      border: "none",
                      borderRadius: "10px",
                      fontSize: "15px",
                      fontWeight: "bold",
                      cursor: isSavingProgress ? "not-allowed" : "pointer",
                      opacity: isSavingProgress ? 0.8 : 1
                    }}
                  >
                    {isSavingProgress
                      ? (interfaceLanguage === "ko" ? "⏳ 저장 중..." : "⏳ Saving...")
                      : t("evaluation.returnToVillage", {}, interfaceLanguage)}
                  </button>

                  <button
                    onClick={() => setExitEvaluation(null)}
                    disabled={isSavingProgress}
                    style={{
                      width: "100%",
                      padding: "12px",
                      background: "rgba(255,255,255,0.08)",
                      color: "#fff",
                      border: "1px solid rgba(255,255,255,0.2)",
                      borderRadius: "10px",
                      fontSize: "14px",
                      fontWeight: "bold",
                      cursor: isSavingProgress ? "not-allowed" : "pointer"
                    }}
                  >
                    {interfaceLanguage === "ko" ? "대화 계속하기" : "Continue Conversation"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Progress Panel Modal */}
      <ProgressPanelModal
        open={isProgressPanelOpen}
        onClose={() => setIsProgressPanelOpen(false)}
        authUser={authUser}
        userProfile={userProfile}
        interfaceLanguage={interfaceLanguage}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        initialInterfaceLanguage={interfaceLanguage}
        initialLearningLanguage={learningLanguage}
        initialLearningLevel={learningLevel}
        onSave={handleUpdateSettings}
      />

      {/* NPC Chat Window */}
      {dialogState.isOpen && (
        <div className="dialog-window" role="dialog" aria-modal="true">
          <div
            style={{
              padding: "14px 18px",
              background: "rgba(255,255,255,0.05)",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <div>
              <div style={{ fontWeight: "bold", fontSize: "17px" }}>{dialogState.npcName}</div>
              <div style={{ fontSize: "12px", color: "#64b5f6", marginTop: "2px" }}>
                {t("dialog.poweredBy", {}, interfaceLanguage)}
              </div>
            </div>
            <button
              type="button"
              onClick={closeDialog}
              title={t("dialog.closeDialogTitle", {}, interfaceLanguage)}
              aria-label={t("dialog.closeDialogTitle", {}, interfaceLanguage)}
              style={{
                background: "transparent",
                border: "none",
                color: "#aaa",
                fontSize: "22px",
                cursor: "pointer",
                padding: "8px",
                minWidth: "44px",
                minHeight: "44px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              ✕
            </button>
          </div>

          {voiceFeedback && (
            <div
              style={{
                padding: "8px 16px",
                fontSize: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background:
                  voiceFeedback.type === "error"
                    ? "rgba(239, 68, 68, 0.22)"
                    : "rgba(245, 158, 11, 0.22)",
                borderBottom: `1px solid ${
                  voiceFeedback.type === "error"
                    ? "rgba(239, 68, 68, 0.45)"
                    : "rgba(245, 158, 11, 0.45)"
                }`,
                color: voiceFeedback.type === "error" ? "#fca5a5" : "#fcd34d"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1 }}>
                <span style={{ fontSize: "14px" }}>
                  {voiceFeedback.type === "error" ? "⚠️" : "ℹ️"}
                </span>
                <span style={{ lineHeight: "1.3" }}>{voiceFeedback.message}</span>
              </div>
              <button
                type="button"
                onClick={() => setVoiceFeedback(null)}
                title="Dismiss"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "inherit",
                  cursor: "pointer",
                  fontSize: "16px",
                  padding: "0 4px",
                  lineHeight: 1
                }}
              >
                ×
              </button>
            </div>
          )}

          <div
            style={{
              padding: "15px",
              flex: 1,
              overflowY: "auto",
              maxHeight: "310px",
              display: "flex",
              flexDirection: "column",
              gap: "12px"
            }}
          >
            {dialogState.messages.map((msg, idx) => {
              const isUser = msg.sender === "user";
              const isCurrentlyPlaying =
                replayingMessageIndex === idx && dialogState.status === "speaking";

              return (
                <div
                  key={idx}
                  style={{
                    alignSelf: isUser ? "flex-end" : "flex-start",
                    maxWidth: "84%",
                    padding: "10px 14px",
                    borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                    fontSize: "14px",
                    lineHeight: "1.45",
                    background: isUser
                      ? "linear-gradient(135deg, #1d4ed8, #2563eb)"
                      : "linear-gradient(135deg, #1e293b, #334155)",
                    color: "white",
                    border: isUser
                      ? "1px solid rgba(96, 165, 250, 0.4)"
                      : "1px solid rgba(148, 163, 184, 0.25)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.18)"
                  }}
                >
                  <div
                    style={{
                      fontSize: "11px",
                      color: isUser ? "#93c5fd" : "#94a3b8",
                      marginBottom: "4px",
                      fontWeight: "700",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px"
                    }}
                  >
                    <span>{isUser ? "👤" : "🤖"}</span>
                    <span>{isUser ? t("dialog.youLabel", {}, interfaceLanguage) : dialogState.npcName}</span>
                  </div>
                  <div>{msg.text}</div>

                  {!isUser && (
                    <div style={{ marginTop: "7px", display: "flex", justifyContent: "flex-start" }}>
                      <button
                        type="button"
                        onClick={() => handleReplaySpeech(msg.text, idx)}
                        disabled={dialogState.status === "thinking"}
                        title={t("dialog.replayVoice", {}, interfaceLanguage)}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          padding: "3px 8px",
                          borderRadius: "6px",
                          border: isCurrentlyPlaying
                            ? "1px solid rgba(34, 197, 94, 0.5)"
                            : "1px solid rgba(255, 255, 255, 0.15)",
                          background: isCurrentlyPlaying
                            ? "rgba(34, 197, 94, 0.25)"
                            : "rgba(255, 255, 255, 0.08)",
                          color: isCurrentlyPlaying ? "#4ade80" : "#cbd5e1",
                          fontSize: "11px",
                          fontWeight: "600",
                          cursor: dialogState.status === "thinking" ? "not-allowed" : "pointer",
                          transition: "all 0.15s ease"
                        }}
                      >
                        <span>{isCurrentlyPlaying ? "🔊" : "🔈"}</span>
                        <span>
                          {isCurrentlyPlaying
                            ? t("dialog.playingVoice", {}, interfaceLanguage)
                            : t("dialog.replayVoice", {}, interfaceLanguage)}
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
            {dialogState.status === "listening" && sttInterimText && (
              <div
                style={{
                  alignSelf: "flex-end",
                  maxWidth: "84%",
                  padding: "10px 14px",
                  borderRadius: "16px 16px 4px 16px",
                  fontSize: "14px",
                  lineHeight: "1.4",
                  background: "rgba(25, 118, 210, 0.35)",
                  border: "1px dashed #64b5f6",
                  color: "#e2e8f0",
                  fontStyle: "italic"
                }}
              >
                <div style={{ fontSize: "11px", opacity: 0.8, marginBottom: "3px", fontWeight: "bold" }}>
                  {t("dialog.speakingInterim", {}, interfaceLanguage)}
                </div>
                "{sttInterimText}"
              </div>
            )}
            {dialogState.status === "thinking" && (
              <div style={{ alignSelf: "flex-start", color: "#64b5f6", fontSize: "13px" }}>
                {t("dialog.npcThinking", { npc: dialogState.npcName }, interfaceLanguage)}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const input = e.target.elements.chatInput;
              if (input.value.trim() && dialogState.status !== "thinking" && !isGeneratingRef.current) {
                if (dialogState.status === "speaking" && "speechSynthesis" in window) {
                  try {
                    window.speechSynthesis.cancel();
                  } catch {}
                  setReplayingMessageIndex(null);
                }
                setVoiceFeedback(null);
                handleUserSpeech(input.value.trim());
                input.value = "";
              }
            }}
            style={{
              padding: "10px 15px",
              display: "flex",
              gap: "8px",
              background: "rgba(255,255,255,0.05)",
              borderTop: "1px solid rgba(255,255,255,0.1)"
            }}
          >
            <input
              name="chatInput"
              type="text"
              placeholder={t("dialog.inputPlaceholder", {
                lang: getLanguageName(learningLanguage, interfaceLanguage)
              }, interfaceLanguage)}
              disabled={dialogState.status === "thinking"}
              style={{
                flex: 1,
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid #555",
                background: "#222",
                color: "white",
                fontSize: "13px"
              }}
            />
            <button
              type="submit"
              disabled={dialogState.status === "thinking"}
              style={{
                padding: "8px 14px",
                borderRadius: "8px",
                border: "none",
                background: "#1976d2",
                color: "white",
                cursor: dialogState.status === "thinking" ? "not-allowed" : "pointer",
                fontWeight: "bold",
                opacity: dialogState.status === "thinking" ? 0.6 : 1
              }}
            >
              {t("dialog.sendBtn", {}, interfaceLanguage)}
            </button>
          </form>

          <div
            style={{
              padding: "12px 20px",
              background: "rgba(0,0,0,0.3)",
              borderTop: "1px solid rgba(255,255,255,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "500" }}>
                {t("dialog.statusLabel", {}, interfaceLanguage)}
              </span>
              {(() => {
                const statusInfo = getVoiceStatusPresentation(dialogState.status, interfaceLanguage);
                return (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px",
                      fontSize: "11px",
                      fontWeight: "700",
                      letterSpacing: "0.5px",
                      padding: "3px 9px",
                      borderRadius: "12px",
                      background: statusInfo.bg,
                      color: statusInfo.color,
                      border: `1px solid ${statusInfo.color}40`
                    }}
                  >
                    <span>{statusInfo.icon}</span>
                    <span>{statusInfo.label}</span>
                  </span>
                );
              })()}
            </div>

            <button
              type="button"
              onClick={handleToggleListening}
              disabled={dialogState.status === "thinking" || dialogState.status === "speaking"}
              style={{
                padding: "10px 18px",
                borderRadius: "22px",
                minHeight: "44px",
                border: "none",
                background: dialogState.status === "listening" ? "#ef4444" : "#1976d2",
                color: "white",
                cursor:
                  dialogState.status === "thinking" || dialogState.status === "speaking"
                    ? "not-allowed"
                    : "pointer",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "13px",
                opacity:
                  dialogState.status === "thinking" || dialogState.status === "speaking"
                    ? 0.6
                    : 1
              }}
            >
              {dialogState.status === "listening"
                ? (interfaceLanguage === "ko" ? "⏹️ 완료 (전송)" : "⏹️ Done (Send)")
                : (interfaceLanguage === "ko" ? "🎤 말하기" : "🎤 Speak")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;