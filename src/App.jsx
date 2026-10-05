import React, { useEffect, useRef, useState } from "react";
import { VillageCanvas } from "./components/r3f/VillageCanvas";
import { MiniMap } from "./components/ui/MiniMap";

const SHOP_MISSIONS = [
  {
    title: "🏪 Shop Mission",
    text: "Buy 2 bottles of water and 1 apple.",
    goal: "Buy exactly 2 bottles of water and 1 apple."
  },
  {
    title: "🏪 Shop Mission",
    text: "Buy 3 apples and 1 bottle of milk.",
    goal: "Buy exactly 3 apples and 1 bottle of milk."
  },
  {
    title: "🏪 Shop Mission",
    text: "Buy 1 loaf of bread and 2 bottles of water.",
    goal: "Buy exactly 1 loaf of bread and 2 bottles of water."
  },
  {
    title: "🏪 Shop Mission",
    text: "Buy 2 bottles of milk and 1 apple.",
    goal: "Buy exactly 2 bottles of milk and 1 apple."
  }
];

const CAFE_MISSIONS = [
  {
    title: "☕ Cafe Mission",
    text: "Order 1 hot Americano and 1 croissant.",
    goal: "Order exactly 1 hot Americano and 1 croissant."
  },
  {
    title: "☕ Cafe Mission",
    text: "Order 1 latte and 1 sandwich.",
    goal: "Order exactly 1 latte and 1 sandwich."
  },
  {
    title: "☕ Cafe Mission",
    text: "Order 1 green tea and 1 cake.",
    goal: "Order exactly 1 green tea and 1 cake."
  },
  {
    title: "☕ Cafe Mission",
    text: "Order 1 cappuccino and 1 muffin.",
    goal: "Order exactly 1 cappuccino and 1 muffin."
  }
];

const HOTEL_MISSIONS = [
  {
    title: "🏨 Hotel Mission",
    text: "Book a single room for two nights.",
    goal: "Book exactly one single room for two nights."
  },
  {
    title: "🏨 Hotel Mission",
    text: "Ask for a double room for one night and ask about the breakfast.",
    goal: "Ask about a double room for one night and ask about breakfast."
  },
  {
    title: "🏨 Hotel Mission",
    text: "Check in and ask what time breakfast starts.",
    goal: "Complete a hotel check-in conversation and ask what time breakfast starts."
  },
  {
    title: "🏨 Hotel Mission",
    text: "Ask for a room with Wi-Fi and ask about the price.",
    goal: "Ask for a room with Wi-Fi and ask about its price."
  }
];

const HOSPITAL_MISSIONS = [
  {
    title: "🏥 Hospital Mission",
    text: "Make a doctor's appointment and ask what time it is.",
    goal: "Make a doctor's appointment and ask what time it is."
  },
  {
    title: "🏥 Hospital Mission",
    text: "Ask for a general check-up and ask about the price.",
    goal: "Ask for a general check-up and ask about the price."
  },
  {
    title: "🏥 Hospital Mission",
    text: "Ask where the emergency room is and what time the hospital closes.",
    goal: "Ask where the emergency room is and what time the hospital closes."
  },
  {
    title: "🏥 Hospital Mission",
    text: "Ask to see a doctor and ask how long you need to wait.",
    goal: "Ask to see a doctor and ask how long you need to wait."
  }
];

const BANK_MISSIONS = [
  {
    title: "🏦 Bank Mission",
    text: "Ask about opening a bank account and what documents are needed.",
    goal: "Ask about opening a bank account and ask what documents are needed."
  },
  {
    title: "🏦 Bank Mission",
    text: "Ask about transferring money and the transfer fee.",
    goal: "Ask about transferring money and the transfer fee."
  },
  {
    title: "🏦 Bank Mission",
    text: "Ask how to get a bank card and how long it takes.",
    goal: "Ask how to get a bank card and how long it takes."
  },
  {
    title: "🏦 Bank Mission",
    text: "Ask about depositing money and the minimum amount.",
    goal: "Ask about depositing money and the minimum amount."
  }
];

const LIBRARY_MISSIONS = [
  {
    title: "📚 Library Mission",
    text: "Ask the librarian where the English learning books are and ask if you can borrow one.",
    goal: "Ask the librarian where the English learning books are and ask if you can borrow one."
  },
  {
    title: "📚 Library Mission",
    text: "Ask for a book about Korean language learning and ask how long you can borrow it.",
    goal: "Ask for a book about Korean language learning and ask how long you can borrow it."
  },
  {
    title: "📚 Library Mission",
    text: "Ask where the history section is and ask if the library has beginner books.",
    goal: "Ask where the history section is and ask if the library has beginner books."
  },
  {
    title: "📚 Library Mission",
    text: "Ask how to get a library card and ask what documents are needed.",
    goal: "Ask how to get a library card and ask what documents are needed."
  }
];

const POLICE_MISSIONS = [
  {
    title: "👮 Police Station Mission",
    text: "Report a lost wallet and ask what information you need to provide.",
    goal: "Report a lost wallet and ask what information you need to provide."
  },
  {
    title: "👮 Police Station Mission",
    text: "Ask the police officer how to report a lost phone and what you should do next.",
    goal: "Ask the police officer how to report a lost phone and what you should do next."
  },
  {
    title: "👮 Police Station Mission",
    text: "Ask where the nearest police station is and ask for the emergency phone number.",
    goal: "Ask where the nearest police station is and ask for the emergency phone number."
  },
  {
    title: "👮 Police Station Mission",
    text: "Ask how to get a police report and what documents you need.",
    goal: "Ask how to get a police report and what documents you need."
  }
];

const LANGUAGE_SCHOOL_MISSIONS = [
  {
    id: "language_school_1",
    title: "🏫 Language School Mission",
    text: "Introduce yourself to the teacher and ask about the English class schedule.",
    goal: "Introduce yourself to the teacher and ask about the English class schedule."
  },
  {
    id: "language_school_2",
    title: "🏫 Language School Mission",
    text: "Ask the teacher about the English class level and the class price.",
    goal: "Ask the teacher about the English class level and the class price."
  },
  {
    id: "language_school_3",
    title: "🏫 Language School Mission",
    text: "Ask how many days per week the English class meets and how long each class lasts.",
    goal: "Ask how many days per week the English class meets and how long each class lasts."
  },
  {
    id: "language_school_4",
    title: "🏫 Language School Mission",
    text: "Ask about joining the class and what materials you need to bring.",
    goal: "Ask about joining the class and what materials you need to bring."
  }
];

const STUDY_CENTER_MISSIONS = [
  {
    id: "study_center_1",
    title: "📖 Study Center Mission",
    text: "Ask the tutor where you can study English and ask what study materials are available.",
    goal: "Ask the tutor where you can study English and ask what study materials are available."
  },
  {
    id: "study_center_2",
    title: "📖 Study Center Mission",
    text: "Ask the tutor about the best way to practice English speaking and ask for a study schedule.",
    goal: "Ask the tutor about the best way to practice English speaking and ask for a study schedule."
  },
  {
    id: "study_center_3",
    title: "📖 Study Center Mission",
    text: "Ask which books are good for beginner English learners and ask if you can borrow them.",
    goal: "Ask which books are good for beginner English learners and ask if you can borrow them."
  },
  {
    id: "study_center_4",
    title: "📖 Study Center Mission",
    text: "Ask the tutor how to improve your English vocabulary and ask for one useful study tip.",
    goal: "Ask the tutor how to improve your English vocabulary and ask for one useful study tip."
  }
];

const COMMUNITY_CENTER_MISSIONS = [
  {
    id: "community_center_1",
    title: "🏛️ Community Center Mission",
    text: "Ask the staff member where you can get a residence certificate and ask what document you need.",
    goal: "Ask the staff member where you can get a residence certificate and ask what document you need."
  },
  {
    id: "community_center_2",
    title: "🏛️ Community Center Mission",
    text: "Ask about a local community program and ask when it takes place.",
    goal: "Ask about a local community program and ask when it takes place."
  },
  {
    id: "community_center_3",
    title: "🏛️ Community Center Mission",
    text: "Ask how to get a local resident registration document and ask about the processing time.",
    goal: "Ask how to get a local resident registration document and ask about the processing time."
  },
  {
    id: "community_center_4",
    title: "🏛️ Community Center Mission",
    text: "Ask what services the community center provides and ask which service is useful for new residents.",
    goal: "Ask what services the community center provides and ask which service is useful for new residents."
  }
];

const CAREER_CENTER_MISSIONS = [
  {
    id: "career_center_1",
    title: "💼 Career Center Mission",
    text: "Ask the career counselor about finding a part-time job and ask what kind of jobs are available.",
    goal: "Ask the career counselor about finding a part-time job and ask what kind of jobs are available."
  },
  {
    id: "career_center_2",
    title: "💼 Career Center Mission",
    text: "Ask how to prepare a resume and ask what information should be included.",
    goal: "Ask how to prepare a resume and ask what information should be included."
  },
  {
    id: "career_center_3",
    title: "💼 Career Center Mission",
    text: "Ask for advice about a job interview and ask what you should do before the interview.",
    goal: "Ask for advice about a job interview and ask what you should do before the interview."
  },
  {
    id: "career_center_4",
    title: "💼 Career Center Mission",
    text: "Ask about job training programs and ask how to apply for one.",
    goal: "Ask about job training programs and ask how to apply for one."
  }
];

const ACTIVITY_CENTER_MISSIONS = [
  {
    id: "activity_center_1",
    title: "🎨 Activity Center Mission",
    text: "Ask the coordinator what community activities are available and ask when the English club meets.",
    goal: "Ask the coordinator what community activities are available and ask when the English club meets."
  },
  {
    id: "activity_center_2",
    title: "🎨 Activity Center Mission",
    text: "Ask about an art class and ask what materials you need to bring.",
    goal: "Ask about an art class and ask what materials you need to bring."
  },
  {
    id: "activity_center_3",
    title: "🎨 Activity Center Mission",
    text: "Ask about a cooking class and ask how much it costs to join.",
    goal: "Ask about a cooking class and ask how much it costs to join."
  },
  {
    id: "activity_center_4",
    title: "🎨 Activity Center Mission",
    text: "Ask which activity is good for meeting new people and ask when the next activity starts.",
    goal: "Ask which activity is good for meeting new people and ask when the next activity starts."
  }
];

const MULTI_PURPOSE_HALL_MISSIONS = [
  {
    id: "multi_purpose_hall_1",
    title: "🏛️ Multi-Purpose Hall Mission",
    text: "Ask the coordinator what events are held in the hall and ask when the next community meeting is.",
    goal: "Ask the coordinator what events are held in the hall and ask when the next community meeting is."
  },
  {
    id: "multi_purpose_hall_2",
    title: "🏛️ Multi-Purpose Hall Mission",
    text: "Ask about the English presentation and ask what time it starts.",
    goal: "Ask about the English presentation and ask what time it starts."
  },
  {
    id: "multi_purpose_hall_3",
    title: "🏛️ Multi-Purpose Hall Mission",
    text: "Ask about a resident workshop and ask what you need to bring.",
    goal: "Ask about a resident workshop and ask what you need to bring."
  },
  {
    id: "multi_purpose_hall_4",
    title: "🏛️ Multi-Purpose Hall Mission",
    text: "Ask which event is good for meeting local residents and ask when it will happen.",
    goal: "Ask which event is good for meeting local residents and ask when it will happen."
  }
];

const getRandomMission = (missions, lastIndexRef) => {
  let nextIndex = Math.floor(Math.random() * missions.length);
  if (missions.length > 1 && nextIndex === lastIndexRef.current) {
    nextIndex = (nextIndex + 1) % missions.length;
  }
  lastIndexRef.current = nextIndex;
  return missions[nextIndex];
};

const NOVELTY_VOICE_NAMES = [
  "albert",
  "bad news",
  "bahh",
  "bells",
  "boing",
  "bubbles",
  "cellos",
  "deranged",
  "good news",
  "hysterical",
  "junior",
  "pipe organ",
  "trinoids",
  "whisper",
  "zarvox",
  "kathy",
  "ralph"
];

const isMaleVoice = (v) => {
  const name = (v.name || "").toLowerCase();
  return /\b(alex|daniel|tom|oliver|guy|david|george|christopher|aaron|fred|male)\b/i.test(name);
};

const isFemaleVoice = (v) => {
  const name = (v.name || "").toLowerCase();
  return (
    /\b(samantha|ava|allison|susan|zoe|karen|victoria|fiona|jenny|aria|female)\b/i.test(name) ||
    name.includes("google us english")
  );
};

const scoreQuality = (v) => {
  const nameLower = (v.name || "").toLowerCase();
  const langLower = (v.lang || "").toLowerCase();

  // Deprioritize novelty/robotic toy voices
  if (NOVELTY_VOICE_NAMES.some((n) => nameLower.includes(n))) {
    return -50;
  }

  let score = 10;

  // Quality keywords
  if (nameLower.includes("natural")) score += 60;
  if (nameLower.includes("enhanced")) score += 50;
  if (nameLower.includes("premium")) score += 50;
  if (nameLower.includes("google")) score += 40;

  // Preferred accents
  if (langLower.startsWith("en-us") || langLower === "en_us") score += 20;
  else if (langLower.startsWith("en-gb") || langLower === "en_gb") score += 10;

  if (v.default) score += 5;

  return score;
};

const getBestEnglishVoice = (voices, npcName) => {
  if (!voices || voices.length === 0) return null;

  const englishVoices = voices.filter(
    (v) =>
      v.lang &&
      (v.lang.toLowerCase().startsWith("en") ||
        v.lang.toLowerCase().includes("en-") ||
        v.lang.toLowerCase().includes("en_"))
  );

  if (englishVoices.length === 0) {
    return voices.find((v) => v.default) || voices[0] || null;
  }

  const isJack =
    npcName === "Shop Seller" ||
    npcName === "Bank Employee" ||
    npcName === "Police Officer" ||
    npcName === "Officer Alex" ||
    npcName === "Alex" ||
    npcName === "Tutor Daniel" ||
    npcName === "Daniel" ||
    npcName === "Career Counselor James" ||
    npcName === "James";
  const isFemale =
    npcName === "Cafe Barista" ||
    npcName === "Hotel Receptionist" ||
    npcName === "Sarah" ||
    npcName === "Librarian" ||
    npcName === "Emily" ||
    npcName === "Teacher Olivia" ||
    npcName === "Olivia" ||
    npcName === "Staff Mina" ||
    npcName === "Mina" ||
    npcName === "Coordinator Hana" ||
    npcName === "Hana" ||
    npcName === "Coordinator Yuri" ||
    npcName === "Yuri";

  if (isJack) {
    // 1. Prefer male English voices, sorted by quality
    const maleVoices = englishVoices.filter(isMaleVoice);
    if (maleVoices.length > 0) {
      maleVoices.sort((a, b) => scoreQuality(b) - scoreQuality(a));
      return maleVoices[0];
    }

    // 2. If no male voice exists, prefer non-female English voices
    const nonFemaleVoices = englishVoices.filter((v) => !isFemaleVoice(v));
    if (nonFemaleVoices.length > 0) {
      nonFemaleVoices.sort((a, b) => scoreQuality(b) - scoreQuality(a));
      return nonFemaleVoices[0];
    }

    // 3. Fallback to best overall English voice
    englishVoices.sort((a, b) => scoreQuality(b) - scoreQuality(a));
    return englishVoices[0];
  }

  if (isFemale) {
    // 1. Prefer female English voices, sorted by quality
    const femaleVoices = englishVoices.filter(isFemaleVoice);
    if (femaleVoices.length > 0) {
      femaleVoices.sort((a, b) => scoreQuality(b) - scoreQuality(a));
      return femaleVoices[0];
    }

    // 2. Fallback to best overall English voice
    englishVoices.sort((a, b) => scoreQuality(b) - scoreQuality(a));
    return englishVoices[0];
  }

  // Generic / default
  englishVoices.sort((a, b) => scoreQuality(b) - scoreQuality(a));
  return englishVoices[0];
};

function App() {
  const [currentLocation, setCurrentLocation] = useState("outside");
  const [doorPrompt, setDoorPrompt] = useState(null);
  const [npcPrompt, setNpcPrompt] = useState(null);
  const [activeMission, setActiveMission] = useState(null);
  const [exitEvaluation, setExitEvaluation] = useState(null);

  const currentMissionRef = useRef(null);
  const lastShopMissionIndexRef = useRef(-1);
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

  const messagesHistoryRef = useRef([]);
  const playerRef = useRef(null);
  const cameraAnglesRef = useRef({
    theta: 0,
    phi: Math.PI / 4,
    radius: 6.0
  });

  const [dialogState, setDialogState] = useState({
    isOpen: false,
    npcName: "",
    status: "idle",
    messages: []
  });

  // TTS
  const voicesRef = useRef([]);
  const ttsTimeoutRef = useRef(null);

  const speakText = (text, npcName = null) => {
    if (!("speechSynthesis" in window)) {
      setDialogState((prev) => ({ ...prev, status: "idle" }));
      return;
    }

    if (ttsTimeoutRef.current) {
      clearTimeout(ttsTimeoutRef.current);
      ttsTimeoutRef.current = null;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const character = npcName || dialogState.npcName;

    utterance.rate = 1.0;
    if (
      character === "Shop Seller" ||
      character === "Bank Employee" ||
      character === "Police Officer" ||
      character === "Officer Alex" ||
      character === "Alex" ||
      character === "Tutor Daniel" ||
      character === "Daniel" ||
      character === "Career Counselor James" ||
      character === "James"
    ) {
      utterance.pitch = 1.0;
    } else if (
      character === "Cafe Barista" ||
      character === "Hotel Receptionist" ||
      character === "Sarah" ||
      character === "Librarian" ||
      character === "Emily" ||
      character === "Teacher Olivia" ||
      character === "Olivia" ||
      character === "Staff Mina" ||
      character === "Mina" ||
      character === "Coordinator Hana" ||
      character === "Hana" ||
      character === "Coordinator Yuri" ||
      character === "Yuri"
    ) {
      utterance.pitch = 1.04;
    } else {
      utterance.pitch = 1.0;
    }

    const availableVoices =
      voicesRef.current.length > 0
        ? voicesRef.current
        : window.speechSynthesis.getVoices();
    if (availableVoices && availableVoices.length > 0) {
      voicesRef.current = availableVoices;
    }

    const selectedVoice = getBestEnglishVoice(availableVoices, character);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang || "en-US";
    } else {
      utterance.lang = "en-US";
    }

    if (import.meta.env.DEV) {
      const npcLabel =
        character === "Shop Seller"
          ? "Jack"
          : character === "Hotel Receptionist"
            ? "Emma"
            : character === "Sarah"
              ? "Sarah"
              : character === "Bank Employee"
                ? "David"
                : character === "Librarian" || character === "Emily"
                  ? "Emily"
                  : character === "Police Officer" || character === "Officer Alex" || character === "Alex"
                    ? "Alex"
                    : character === "Cafe Barista"
                ? "Mia"
                : character || "Unknown";
      console.log(
        `[TTS]\nNPC: ${npcLabel}\nSelected voice: ${selectedVoice?.name || "Default"}\nLanguage: ${selectedVoice?.lang || utterance.lang}\nRate: ${utterance.rate}\nPitch: ${utterance.pitch}`
      );
    }

    utterance.onstart = () => setDialogState((prev) => ({ ...prev, status: "speaking" }));
    utterance.onend = () => setDialogState((prev) => ({ ...prev, status: "idle" }));
    utterance.onerror = () => setDialogState((prev) => ({ ...prev, status: "idle" }));

    ttsTimeoutRef.current = setTimeout(() => {
      ttsTimeoutRef.current = null;
      window.speechSynthesis.speak(utterance);
    }, 60);
  };

  useEffect(() => {
    if (!("speechSynthesis" in window)) return;

    const updateVoices = () => {
      const available = window.speechSynthesis.getVoices();
      if (available && available.length > 0) {
        voicesRef.current = available;
      }
    };

    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;

    return () => {
      if (window.speechSynthesis.onvoiceschanged === updateVoices) {
        window.speechSynthesis.onvoiceschanged = null;
      }
      if (ttsTimeoutRef.current) {
        clearTimeout(ttsTimeoutRef.current);
      }
    };
  }, []);

  // Groq AI
  const generateNPCResponseWithAI = async (userMessage, npc) => {
    setDialogState((prev) => ({ ...prev, status: "thinking" }));
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;

    if (!apiKey) {
      const warning = "Groq API key topilmadi. .env faylini tekshiring.";
      setDialogState((prev) => ({
        ...prev,
        status: "idle",
        messages: [...prev.messages, { sender: "npc", text: warning }]
      }));
      speakText(warning, npc);
      return;
    }

    const systemPrompt =
      npc === "Shop Seller"
        ? `You are Jack, a lively shopkeeper in a 3D village store. Respond in 1-2 short conversational English sentences without quotes or markdown.`
        : npc === "Hotel Receptionist"
          ? `You are Emma, a friendly hotel receptionist in a small village hotel. Speak naturally in short conversational English sentences. Help guests with check-in, rooms, reservations, prices, and basic hotel questions. Do not use markdown or quotation marks.`
          : npc === "Sarah"
            ? `You are Sarah, a friendly hospital receptionist in a small village hospital. Help visitors with appointments, doctors, rooms, prices, directions, and basic hospital questions. Speak naturally in short conversational English sentences. Do not use markdown or quotation marks.`
            : npc === "Bank Employee"
              ? `You are David, a polite and professional bank employee at Village Bank. Speak naturally in 1-2 short conversational English sentences. Help customers with opening a bank account, money transfers, debit/credit cards, deposits, and account inquiries. Do not use markdown or quotation marks.`
              : npc === "Librarian" || npc === "Emily"
                ? `You are Emily, a friendly, patient, and helpful librarian at Village Library. Speak naturally in 1-2 short conversational English sentences. Help visitors find books, borrow language learning materials, locate sections, and get library cards. Do not use markdown or quotation marks.`
                : npc === "Police Officer" || npc === "Officer Alex" || npc === "Alex"
                  ? `You are Alex, a friendly and professional village police officer at Village Police Station. Speak clearly and simply in 1-2 short conversational English sentences suitable for language learners. Help citizens with reporting lost items (wallet, phone), emergency numbers (112 or 911), filing police reports, and safety advice. Do not use markdown or quotation marks.`
                  : npc === "Teacher Olivia" || npc === "Olivia"
                    ? `You are Olivia, a friendly English teacher at a small language school in a Korean village. Speak clearly and naturally using simple English appropriate for beginner/intermediate learners. Help the student complete the assigned mission. Do not reveal the mission answer directly. Ask natural follow-up questions when appropriate.`
                    : npc === "Tutor Daniel" || npc === "Daniel"
                      ? `You are Daniel, a friendly tutor at a small study center in a Korean village. You help students learn English and develop good study habits. Speak clearly and naturally using simple English appropriate for beginner/intermediate learners. Help the student complete the assigned mission without directly giving them the answer. Ask natural follow-up questions when appropriate.`
                      : npc === "Staff Mina" || npc === "Mina"
                        ? `You are Mina, a friendly staff member at a small Korean village community center. You help residents understand local administrative services, certificates, community programs, and neighborhood information. Speak clearly and naturally using simple English suitable for beginner/intermediate learners. Help the student complete the assigned mission without directly giving the mission answer immediately. Ask natural follow-up questions when appropriate.`
                        : npc === "Career Counselor James" || npc === "James"
                          ? `You are James, a friendly career counselor at a small employment support center in a Korean village. You help visitors with job searching, resumes, interviews, training programs, and career planning. Speak clearly and naturally using simple English suitable for beginner/intermediate learners. Help the student complete the assigned mission without directly giving the mission answer immediately. Ask natural follow-up questions when appropriate.`
                          : npc === "Coordinator Hana" || npc === "Hana"
                            ? `You are Hana, a friendly activity coordinator at a small Korean village community center. You organize hobby classes, language clubs, workshops, and community activities. Speak clearly and naturally using simple English suitable for beginner/intermediate learners. Help the student complete the assigned mission without directly giving the answer immediately. Ask natural follow-up questions when appropriate.`
                            : npc === "Coordinator Yuri" || npc === "Yuri"
                              ? `You are Yuri, a friendly community event coordinator at a small Korean village multi-purpose hall. You organize community events, lectures, workshops, presentations, and resident meetings. Speak clearly and naturally using simple English suitable for beginner/intermediate learners. Help the student complete the assigned mission without directly giving the answer immediately. Ask natural follow-up questions when appropriate.`
                              : `You are Mia, a friendly cafe barista in a 3D village cafe. Respond in 1-2 short conversational English sentences without quotes or markdown.`;

    try {
      const history = messagesHistoryRef.current.slice(-4).map((m) => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.text
      }));

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
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
          max_tokens: 250,
          temperature: 0.8
        })
      });

      const data = await response.json();
      if (!response.ok || data.error) throw new Error(data?.error?.message || "API xatosi");

      const reply = data?.choices?.[0]?.message?.content?.trim();
      if (!reply) throw new Error("Bo'sh javob");

      messagesHistoryRef.current.push({ sender: "npc", text: reply });
      setDialogState((prev) => ({
        ...prev,
        status: "idle",
        messages: [...prev.messages, { sender: "npc", text: reply }]
      }));

      speakText(reply, npc);
    } catch (error) {
      console.error(error);
      const errorMsg = "Sorry, could you repeat that please?";
      messagesHistoryRef.current.push({ sender: "npc", text: errorMsg });
      setDialogState((prev) => ({
        ...prev,
        status: "idle",
        messages: [...prev.messages, { sender: "npc", text: errorMsg }]
      }));
      speakText(errorMsg, npc);
    }
  };

  // evaluateOnExit
  const evaluateOnExit = async (doorType) => {
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;

    const userSpeeches = messagesHistoryRef.current.filter((m) => m.sender === "user");

    if (userSpeeches.length === 0) {
      setExitEvaluation({
        doorType,
        score: 0,
        completed: false,
        mistakes: ["Siz ichkarida sotuvchi yoki barista bilan umuman inglizcha gaplashmadingiz."],
        feedback: "Vazifani bajarish uchun avval 'F' tugmasini bosib, kerakli narsalarni ingliz tilida so'rab ko'ring."
      });
      return;
    }

    setExitEvaluation({ doorType, loading: true });

    const isShop = doorType === "Exit Shop";
    const isHotel = doorType === "Exit Hotel";
    const isHospital = doorType === "Exit Hospital";
    const isBank = doorType === "Exit Bank";
    const isLibrary = doorType === "Exit Library";
    const isPolice = doorType === "Exit Police Station";
    const isLanguageSchool = doorType === "Exit Language School";
    const isStudyCenter = doorType === "Exit Study Center";
    const isCommunityCenter = doorType === "Exit Community Center";
    const isCareerCenter = doorType === "Exit Career Center";
    const isActivityCenter = doorType === "Exit Activity Center";
    const isMultiPurposeHall = doorType === "Exit Multi-Purpose Hall";
    const defaultGoal = isShop
      ? "Buy exactly 2 bottles of water and 1 apple."
      : isHotel
        ? "Book exactly one single room for two nights."
        : isHospital
          ? "Make a doctor's appointment and ask what time it is."
          : isBank
            ? "Ask about opening a bank account and ask what documents are needed."
            : isLibrary
              ? "Ask the librarian where the English learning books are and ask if you can borrow one."
              : isPolice
                ? "Report a lost wallet and ask what information you need to provide."
                : isLanguageSchool
                  ? "Introduce yourself to the teacher and ask about the English class schedule."
                  : isStudyCenter
                    ? "Ask the tutor where you can study English and ask what study materials are available."
                    : isCommunityCenter
                      ? "Ask the staff member where you can get a residence certificate and ask what document you need."
                      : isCareerCenter
                        ? "Ask the career counselor about finding a part-time job and ask what kind of jobs are available."
                        : isActivityCenter
                          ? "Ask the coordinator what community activities are available and ask when the English club meets."
                          : isMultiPurposeHall
                            ? "Ask the coordinator what events are held in the hall and ask when the next community meeting is."
                            : "Order exactly 1 hot Americano and 1 croissant.";
    const missionGoal = currentMissionRef.current?.goal || defaultGoal;

    const conversationTranscript = messagesHistoryRef.current
      .map((m) => `${m.sender === "user" ? "Student (Spoken)" : "NPC"}: "${m.text}"`)
      .join("\n");

    try {
      const evaluationSystemPrompt = `You are an English Speaking Examiner evaluating a student's LIVE SPOKEN conversation transcribed via Speech-to-Text (STT).

Location: ${isShop ? "Grocery Store" : isHotel ? "Village Hotel" : isHospital ? "Village Hospital" : isBank ? "Village Bank" : isLibrary ? "Village Library" : isPolice ? "Village Police Station" : isLanguageSchool ? "Village Language School" : isStudyCenter ? "Village Study Center" : isCommunityCenter ? "Village Community Center" : isCareerCenter ? "Village Career Center" : isActivityCenter ? "Village Activity Center" : isMultiPurposeHall ? "Village Multi-Purpose Hall" : "Italian Cafe"}
Assigned Mission: "${missionGoal}"

Dialogue Transcript:
${conversationTranscript}

CRITICAL RULES FOR SPOKEN EVALUATION:
1. IGNORE CAPITALIZATION AND PUNCTUATION COMPLETELY: The user is speaking via microphone, so ignore lowercase letters (e.g. 'i want', 'apple', 'london') and missing periods/commas. NEVER count these as mistakes!
2. FOCUS ONLY ON SPOKEN LANGUAGE:
   - Did they ask for the assigned mission items clearly according to Assigned Mission ("${missionGoal}")?
   - Real grammar errors (e.g. "I wants", "give me two apple", "I buy water") should be corrected.
   - Natural spoken phrasing and politeness ("Could I have...", "Please", etc.).
3. 'score': (Integer 0-100). High score (85-100) if items were asked correctly regardless of text case. Low score only for missing items, completely wrong vocabulary, or broken grammar.
4. 'completed': (Boolean true/false). true if they completed the mission requirements.
5. 'mistakes': Array of Uzbek feedback strings ONLY for real grammatical or lexical mistakes. Format:
   "Siz aytdingiz: '[jumla]' ➔ To'g'risi: '[to'g'ri inglizcha variant]' (Izoh: qisqa o'zbekcha tushuntirish)"
   DO NOT include any mistake about capital letters or punctuation marks. If no real grammar mistake exists, return [].
6. 'feedback': Short, positive summary in Uzbek.

CRITICAL: Return ONLY valid pure JSON without markdown backticks.
JSON Schema:
{
  "score": 90,
  "completed": true,
  "mistakes": [],
  "feedback": "Vazifani a'lo darajada bajardingiz..."
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
              content: "You are a JSON-only generating assistant for spoken English analysis. Output pure JSON without markdown."
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

      if (!rawReply) throw new Error("Bo'sh javob qaytdi");

      rawReply = rawReply.replace(/```json/gi, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(rawReply);

      setExitEvaluation({
        doorType,
        loading: false,
        score: typeof parsed.score === "number" ? parsed.score : 70,
        completed: Boolean(parsed.completed),
        mistakes: Array.isArray(parsed.mistakes) ? parsed.mistakes : [],
        feedback: parsed.feedback || "Suhbat tahlili yakunlandi."
      });
    } catch (err) {
      console.error("Tahlil xatosi:", err);
      setExitEvaluation({
        doorType,
        loading: false,
        score: 50,
        completed: false,
        mistakes: ["AI tahlilida texnik uzilish bo'ldi. Internetni tekshiring."],
        feedback: "Javobni yuklashda xatolik yuz berdi."
      });
    }
  };

  const confirmExitToOutside = (doorType) => {
    setExitEvaluation(null);
    messagesHistoryRef.current = [];
    currentMissionRef.current = null;

    if (playerRef.current) {
      if (doorType === "Exit Shop") {
        setCurrentLocation("outside");
        playerRef.current.position.set(0, 0, 5.0);
      } else if (doorType === "Exit Cafe") {
        setCurrentLocation("outside");
        playerRef.current.position.set(-12, 0, 5.0);
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
        playerRef.current.position.set(-14.4, 0, 32.5);
      } else if (doorType === "Exit Study Center") {
        setCurrentLocation("outside");
        playerRef.current.position.set(-7.5, 0, 32.5);
      } else if (doorType === "Exit Community Center") {
        setCurrentLocation("outside");
        playerRef.current.position.set(7.2, 0, 32.5);
      } else if (doorType === "Exit Career Center") {
        setCurrentLocation("outside");
        playerRef.current.position.set(14.4, 0, 32.5);
      } else if (doorType === "Exit Activity Center") {
        setCurrentLocation("outside");
        playerRef.current.position.set(-10.8, 0, 38.8);
      } else if (doorType === "Exit Multi-Purpose Hall") {
        setCurrentLocation("outside");
        playerRef.current.position.set(10.8, 0, 38.8);
      }
      playerRef.current.rotation.y = 0;
      cameraAnglesRef.current.theta = 0;
      cameraAnglesRef.current.phi = Math.PI / 3.5;
      cameraAnglesRef.current.radius = 6.0;
    }
  };

  const closeDialog = () => {
    if (ttsTimeoutRef.current) {
      clearTimeout(ttsTimeoutRef.current);
      ttsTimeoutRef.current = null;
    }
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    if (recognitionRef.current) recognitionRef.current.stop();

    setDialogState((prev) => ({
      ...prev,
      isOpen: false,
      status: "idle"
    }));
  };

  // STT
  const recognitionRef = useRef(null);
  const handleUserSpeechRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        const userText = event.results[0][0].transcript;
        if (handleUserSpeechRef.current) {
          handleUserSpeechRef.current(userText);
        }
      };

      recognition.onerror = () => setDialogState((prev) => ({ ...prev, status: "idle" }));
      recognition.onend = () => {
        setDialogState((prev) => {
          if (prev.status === "listening") return { ...prev, status: "idle" };
          return prev;
        });
      };
      recognitionRef.current = recognition;

      return () => {
        recognition.stop();
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

  const startListening = () => {
    if (recognitionRef.current && dialogState.status === "idle") {
      try {
        setDialogState((prev) => ({ ...prev, status: "listening" }));
        recognitionRef.current.start();
      } catch (e) {
        setDialogState((prev) => ({ ...prev, status: "idle" }));
      }
    }
  };

  // Eshik bosilganda (E)
  const handleInteractDoor = () => {
    if (!doorPrompt || dialogState.isOpen) return;

    if (doorPrompt === "Shop Door") {
      setCurrentLocation("Shop");
      if (playerRef.current) {
        playerRef.current.position.set(0, 0, 1.5);
        playerRef.current.rotation.y = Math.PI;
      }
      cameraAnglesRef.current.theta = 0;
      cameraAnglesRef.current.phi = Math.PI / 2.2;
      cameraAnglesRef.current.radius = 2.0;

      messagesHistoryRef.current = [];
      const mission = getRandomMission(SHOP_MISSIONS, lastShopMissionIndexRef);
      currentMissionRef.current = mission;
      setActiveMission(mission);
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
      const mission = getRandomMission(CAFE_MISSIONS, lastCafeMissionIndexRef);
      currentMissionRef.current = mission;
      setActiveMission(mission);
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
      const mission = getRandomMission(HOTEL_MISSIONS, lastHotelMissionIndexRef);
      currentMissionRef.current = mission;
      setActiveMission(mission);
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
      const mission = getRandomMission(HOSPITAL_MISSIONS, lastHospitalMissionIndexRef);
      currentMissionRef.current = mission;
      setActiveMission(mission);
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
      const mission = getRandomMission(BANK_MISSIONS, lastBankMissionIndexRef);
      currentMissionRef.current = mission;
      setActiveMission(mission);
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
      const mission = getRandomMission(LIBRARY_MISSIONS, lastLibraryMissionIndexRef);
      currentMissionRef.current = mission;
      setActiveMission(mission);
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
      const mission = getRandomMission(POLICE_MISSIONS, lastPoliceMissionIndexRef);
      currentMissionRef.current = mission;
      setActiveMission(mission);
    } else if (doorPrompt === "Language School Door") {
      setCurrentLocation("LanguageSchool");
      if (playerRef.current) {
        playerRef.current.position.set(-14.4, 0, 37.2);
        playerRef.current.rotation.y = Math.PI;
      }
      cameraAnglesRef.current.theta = 0;
      cameraAnglesRef.current.phi = Math.PI / 2.2;
      cameraAnglesRef.current.radius = 2.0;

      messagesHistoryRef.current = [];
      const mission = getRandomMission(LANGUAGE_SCHOOL_MISSIONS, lastLanguageSchoolMissionIndexRef);
      currentMissionRef.current = mission;
      setActiveMission(mission);
    } else if (doorPrompt === "Study Center Door") {
      setCurrentLocation("StudyCenter");
      if (playerRef.current) {
        playerRef.current.position.set(-7.5, 0, 37.2);
        playerRef.current.rotation.y = Math.PI;
      }
      cameraAnglesRef.current.theta = 0;
      cameraAnglesRef.current.phi = Math.PI / 2.2;
      cameraAnglesRef.current.radius = 2.0;

      messagesHistoryRef.current = [];
      const mission = getRandomMission(STUDY_CENTER_MISSIONS, lastStudyCenterMissionIndexRef);
      currentMissionRef.current = mission;
      setActiveMission(mission);
    } else if (doorPrompt === "Community Center Door") {
      setCurrentLocation("CommunityCenter");
      if (playerRef.current) {
        playerRef.current.position.set(7.2, 0, 37.2);
        playerRef.current.rotation.y = Math.PI;
      }
      cameraAnglesRef.current.theta = 0;
      cameraAnglesRef.current.phi = Math.PI / 2.2;
      cameraAnglesRef.current.radius = 2.0;

      messagesHistoryRef.current = [];
      const mission = getRandomMission(COMMUNITY_CENTER_MISSIONS, lastCommunityCenterMissionIndexRef);
      currentMissionRef.current = mission;
      setActiveMission(mission);
    } else if (doorPrompt === "Career Center Door") {
      setCurrentLocation("CareerCenter");
      if (playerRef.current) {
        playerRef.current.position.set(14.4, 0, 37.2);
        playerRef.current.rotation.y = Math.PI;
      }
      cameraAnglesRef.current.theta = 0;
      cameraAnglesRef.current.phi = Math.PI / 2.2;
      cameraAnglesRef.current.radius = 2.0;

      messagesHistoryRef.current = [];
      const mission = getRandomMission(CAREER_CENTER_MISSIONS, lastCareerCenterMissionIndexRef);
      currentMissionRef.current = mission;
      setActiveMission(mission);
    } else if (doorPrompt === "Activity Center Door") {
      setCurrentLocation("ActivityCenter");
      if (playerRef.current) {
        playerRef.current.position.set(-10.8, 0, 42.8);
        playerRef.current.rotation.y = Math.PI;
      }
      cameraAnglesRef.current.theta = 0;
      cameraAnglesRef.current.phi = Math.PI / 2.2;
      cameraAnglesRef.current.radius = 2.0;

      messagesHistoryRef.current = [];
      const mission = getRandomMission(ACTIVITY_CENTER_MISSIONS, lastActivityCenterMissionIndexRef);
      currentMissionRef.current = mission;
      setActiveMission(mission);
    } else if (doorPrompt === "Multi-Purpose Hall Door") {
      setCurrentLocation("MultiPurposeHall");
      if (playerRef.current) {
        playerRef.current.position.set(10.8, 0, 42.8);
        playerRef.current.rotation.y = Math.PI;
      }
      cameraAnglesRef.current.theta = 0;
      cameraAnglesRef.current.phi = Math.PI / 2.2;
      cameraAnglesRef.current.radius = 2.0;

      messagesHistoryRef.current = [];
      const mission = getRandomMission(MULTI_PURPOSE_HALL_MISSIONS, lastMultiPurposeHallMissionIndexRef);
      currentMissionRef.current = mission;
      setActiveMission(mission);
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
    if (dialogState.isOpen) {
      closeDialog();
      return;
    }
    if (!npcPrompt) return;

    if (messagesHistoryRef.current.length === 0) {
      const greeting =
        npcPrompt === "Shop Seller"
          ? "Hello! Welcome to our village shop. What can I get for you today?"
          : npcPrompt === "Hotel Receptionist"
            ? "Hello! Welcome to the Village Hotel. How can I help you today?"
            : npcPrompt === "Sarah"
              ? "Hello! Welcome to the Village Hospital. How can I help you today?"
              : npcPrompt === "Bank Employee"
                ? "Hello! Welcome to Village Bank. How can I help you today?"
                : npcPrompt === "Librarian" || npcPrompt === "Emily"
                  ? "Hello! Welcome to Village Library. How can I help you?"
                  : npcPrompt === "Police Officer" || npcPrompt === "Officer Alex" || npcPrompt === "Alex"
                    ? "Hello! Welcome to the village police station. How can I help you today?"
                    : npcPrompt === "Teacher Olivia" || npcPrompt === "Olivia"
                      ? "Hello! Welcome to our village language school. I'm Teacher Olivia. How can I help you today?"
                      : npcPrompt === "Tutor Daniel" || npcPrompt === "Daniel"
                        ? "Hi there! Welcome to the village study center. I'm Tutor Daniel. What would you like to study today?"
                        : npcPrompt === "Staff Mina" || npcPrompt === "Mina"
                          ? "Hello! Welcome to the village community center. I'm Mina. How can I help you today?"
                          : npcPrompt === "Career Counselor James" || npcPrompt === "James"
                            ? "Hello! Welcome to the village career center. I'm James. How can I help you today?"
                            : npcPrompt === "Coordinator Hana" || npcPrompt === "Hana"
                              ? "Hello! Welcome to the village activity center. I'm Hana. Are you interested in joining one of our activities?"
                              : npcPrompt === "Coordinator Yuri" || npcPrompt === "Yuri"
                                ? "Hello! Welcome to the village multi-purpose hall. I'm Yuri. Are you here for a community event?"
                                : "Hi there! Welcome to the Language Cafe. What can I brew for you today?";

      messagesHistoryRef.current.push({ sender: "npc", text: greeting });
      setDialogState({
        isOpen: true,
        npcName: npcPrompt,
        status: "speaking",
        messages: [{ sender: "npc", text: greeting }]
      });

      speakText(greeting, npcPrompt);
    } else {
      setDialogState({
        isOpen: true,
        npcName: npcPrompt,
        status: "idle",
        messages: [...messagesHistoryRef.current]
      });
    }
  };

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative", overflow: "hidden" }}>
      {/* R3F 3D Canvas */}
      <VillageCanvas
        playerRef={playerRef}
        cameraAnglesRef={cameraAnglesRef}
        currentLocation={currentLocation}
        isDialogOpen={dialogState.isOpen}
        hasModalOpen={Boolean(activeMission || exitEvaluation)}
        isTalking={dialogState.status === "speaking"}
        onPromptChange={({ door, npc }) => {
          setDoorPrompt(door);
          setNpcPrompt(npc);
        }}
        onInteractDoor={handleInteractDoor}
        onInteractNPC={handleInteractNPC}
      />

      {/* Nazorat eslatmasi */}
      {!dialogState.isOpen && !exitEvaluation && (
        <div
          style={{
            position: "absolute",
            top: "15px",
            left: "15px",
            background: "rgba(0,0,0,0.6)",
            color: "white",
            padding: "8px 14px",
            borderRadius: "8px",
            fontSize: "13px",
            pointerEvents: "none"
          }}
        >
          🖱️ <strong>Mouse Drag:</strong> Obzor | ⌨️ <strong>WASD:</strong> Harakat | 🚪 <strong>E:</strong> Eshik | 💬 <strong>F:</strong> Suhbat
        </div>
      )}

      {/* Real-time Village Minimap (Top-Right HUD) */}
      {!exitEvaluation && (
        <MiniMap
          playerRef={playerRef}
          currentLocation={currentLocation}
        />
      )}

      {/* Eshik belgisi (E) */}
      {doorPrompt && !dialogState.isOpen && !exitEvaluation && (
        <div
          style={{
            position: "absolute",
            zIndex: 10,
            bottom: "80px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(0, 0, 0, 0.8)",
            color: "white",
            padding: "12px 24px",
            borderRadius: "10px",
            textAlign: "center",
            fontSize: "17px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.4)"
          }}
        >
          <div><strong>{doorPrompt}</strong></div>
          <div style={{ marginTop: "4px", fontSize: "14px", color: "#ddd" }}>
            Press <strong>E</strong> to {doorPrompt.startsWith("Exit") ? "exit and view results" : "enter"}
          </div>
        </div>
      )}

      {/* Missiya modali */}
      {activeMission && !dialogState.isOpen && !exitEvaluation && (
        <div
          style={{
            position: "absolute",
            zIndex: 20,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "white",
            color: "#222",
            padding: "30px",
            borderRadius: "15px",
            width: "380px",
            boxShadow: "0 10px 35px rgba(0,0,0,0.4)",
            textAlign: "center"
          }}
        >
          <h2 style={{ margin: "0 0 10px 0" }}>{activeMission.title}</h2>
          <p style={{ fontSize: "16px", lineHeight: "1.5" }}>{activeMission.text}</p>
          <p style={{ color: "#666", fontSize: "14px" }}>
            Talk to the NPC using <strong>F</strong>. Press <strong>F</strong> again to close dialogue.
          </p>
          <button
            onClick={() => setActiveMission(null)}
            style={{
              marginTop: "15px",
              padding: "10px 24px",
              border: "none",
              borderRadius: "8px",
              background: "#222",
              color: "white",
              cursor: "pointer",
              fontSize: "16px"
            }}
          >
            Start Mission
          </button>
        </div>
      )}

      {/* NPC belgisi (F) */}
      {npcPrompt && !dialogState.isOpen && !exitEvaluation && (
        <div
          style={{
            position: "absolute",
            zIndex: 10,
            bottom: "80px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(0, 0, 0, 0.8)",
            color: "white",
            padding: "12px 24px",
            borderRadius: "10px",
            fontSize: "17px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.4)"
          }}
        >
          Press <strong>F</strong> to talk to <strong>{npcPrompt}</strong>
        </div>
      )}

      {/* Chiqishdagi tahlil modali */}
      {exitEvaluation && (
        <div
          style={{
            position: "absolute",
            zIndex: 50,
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(8px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <div
            style={{
              width: "480px",
              background: "#1e1e24",
              color: "#fff",
              borderRadius: "18px",
              padding: "28px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
              border: "1px solid rgba(255,255,255,0.15)",
              fontFamily: "system-ui, sans-serif"
            }}
          >
            {exitEvaluation.loading ? (
              <div style={{ textAlign: "center", padding: "30px 10px" }}>
                <h3 style={{ color: "#64b5f6", margin: "0 0 10px 0" }}>⏳ Tahlil qilinmoqda...</h3>
                <p style={{ color: "#aaa", fontSize: "14px" }}>AI suhbatingizni tekshirmoqda...</p>
              </div>
            ) : (
              <>
                <h2 style={{ margin: "0 0 8px 0", color: exitEvaluation.completed ? "#4caf50" : "#ffb74d" }}>
                  {exitEvaluation.completed ? "🎉 Vazifa Bajarildi!" : "📋 Vazifa Natijasi"}
                </h2>
                <p style={{ margin: "0 0 16px 0", color: "#aaa", fontSize: "14px" }}>
                  Chiqish oldidan til tahlili hisoboti:
                </p>

                <div style={{ marginBottom: "18px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", fontSize: "15px" }}>
                    <span>Bajarilish darajasi:</span>
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

                <div style={{ marginBottom: "18px" }}>
                  <strong style={{ color: "#ef5350", fontSize: "14px" }}>Xatolar va to'g'rilash:</strong>
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
                      <div style={{ color: "#4caf50", fontSize: "13px" }}>Ajoyib! Hech qanday xato yo'q.</div>
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
                  <strong style={{ color: "#64b5f6" }}>Umumiy xulosa: </strong>
                  {exitEvaluation.feedback}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <button
                    onClick={() => confirmExitToOutside(exitEvaluation.doorType)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      background: "#1976d2",
                      color: "#fff",
                      border: "none",
                      borderRadius: "10px",
                      fontSize: "15px",
                      fontWeight: "bold",
                      cursor: "pointer"
                    }}
                  >
                    Davom etish (Qishloqqa chiqish)
                  </button>

                  <button
                    onClick={() => setExitEvaluation(null)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      background: "rgba(255,255,255,0.08)",
                      color: "#fff",
                      border: "1px solid rgba(255,255,255,0.2)",
                      borderRadius: "10px",
                      fontSize: "14px",
                      fontWeight: "bold",
                      cursor: "pointer"
                    }}
                  >
                    Qaytish (Suhbatni davom ettirish)
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Chat oynasi */}
      {dialogState.isOpen && (
        <div
          style={{
            position: "absolute",
            zIndex: 30,
            right: "30px",
            bottom: "30px",
            width: "420px",
            maxHeight: "560px",
            background: "rgba(25, 25, 25, 0.95)",
            backdropFilter: "blur(12px)",
            borderRadius: "18px",
            boxShadow: "0 12px 40px rgba(0,0,0,0.6)",
            border: "1px solid rgba(255,255,255,0.15)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            color: "white"
          }}
        >
          <div
            style={{
              padding: "16px 20px",
              background: "rgba(255,255,255,0.05)",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <div>
              <div style={{ fontWeight: "bold", fontSize: "17px" }}>{dialogState.npcName}</div>
              <div style={{ fontSize: "12px", color: "#64b5f6", marginTop: "2px" }}>✨ Powered by Groq AI</div>
            </div>
            <button
              onClick={closeDialog}
              style={{
                background: "transparent",
                border: "none",
                color: "#aaa",
                fontSize: "20px",
                cursor: "pointer"
              }}
            >
              ✕
            </button>
          </div>

          <div
            style={{
              padding: "15px",
              flex: 1,
              overflowY: "auto",
              maxHeight: "310px",
              display: "flex",
              flexDirection: "column",
              gap: "10px"
            }}
          >
            {dialogState.messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                  maxWidth: "82%",
                  padding: "10px 14px",
                  borderRadius: "14px",
                  fontSize: "14px",
                  lineHeight: "1.4",
                  background: msg.sender === "user" ? "#1976d2" : "#37474f",
                  color: "white"
                }}
              >
                <div style={{ fontSize: "11px", opacity: 0.7, marginBottom: "3px", fontWeight: "bold" }}>
                  {msg.sender === "user" ? "You" : dialogState.npcName}
                </div>
                {msg.text}
              </div>
            ))}
            {dialogState.status === "thinking" && (
              <div style={{ alignSelf: "flex-start", color: "#64b5f6", fontSize: "13px" }}>
                ✨ {dialogState.npcName} is thinking...
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const input = e.target.elements.chatInput;
              if (input.value.trim() && dialogState.status === "idle") {
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
              placeholder="Ask anything in English..."
              disabled={dialogState.status !== "idle"}
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
              disabled={dialogState.status !== "idle"}
              style={{
                padding: "8px 14px",
                borderRadius: "8px",
                border: "none",
                background: "#1976d2",
                color: "white",
                cursor: dialogState.status === "idle" ? "pointer" : "not-allowed",
                fontWeight: "bold"
              }}
            >
              Send
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
            <div style={{ fontSize: "13px", color: "#bbb" }}>
              Status:{" "}
              <strong
                style={{
                  color:
                    dialogState.status === "listening"
                      ? "#ff5252"
                      : dialogState.status === "speaking"
                        ? "#4caf50"
                        : dialogState.status === "thinking"
                          ? "#64b5f6"
                          : "#aaa"
                }}
              >
                {dialogState.status.toUpperCase()}
              </strong>
            </div>

            <button
              onClick={startListening}
              disabled={dialogState.status !== "idle"}
              style={{
                padding: "8px 16px",
                borderRadius: "20px",
                border: "none",
                background: dialogState.status === "listening" ? "#ff5252" : "#1976d2",
                color: "white",
                cursor: dialogState.status === "idle" ? "pointer" : "not-allowed",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "13px"
              }}
            >
              🎤 {dialogState.status === "listening" ? "Listening..." : "Speak"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;