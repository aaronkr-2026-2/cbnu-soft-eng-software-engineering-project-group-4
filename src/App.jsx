import React, { useEffect, useRef, useState } from "react";
import { VillageCanvas } from "./components/r3f/VillageCanvas";

function App() {
  const [currentLocation, setCurrentLocation] = useState("outside");
  const [doorPrompt, setDoorPrompt] = useState(null);
  const [npcPrompt, setNpcPrompt] = useState(null);
  const [activeMission, setActiveMission] = useState(null);
  const [exitEvaluation, setExitEvaluation] = useState(null);

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
  const speakText = (text) => {
    if (!("speechSynthesis" in window)) {
      setDialogState((prev) => ({ ...prev, status: "idle" }));
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.95;

    const voices = window.speechSynthesis.getVoices();
    const enVoice = voices.find((v) => v.lang.includes("en-US") || v.lang.includes("en"));
    if (enVoice) utterance.voice = enVoice;

    utterance.onstart = () => setDialogState((prev) => ({ ...prev, status: "speaking" }));
    utterance.onend = () => setDialogState((prev) => ({ ...prev, status: "idle" }));
    utterance.onerror = () => setDialogState((prev) => ({ ...prev, status: "idle" }));

    setTimeout(() => {
      window.speechSynthesis.speak(utterance);
    }, 60);
  };

  useEffect(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
    }
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
      speakText(warning);
      return;
    }

    const systemPrompt =
      npc === "Shop Seller"
        ? `You are Jack, a lively shopkeeper in a 3D village store. Respond in 1-2 short conversational English sentences without quotes or markdown.`
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
            ...history,
            { role: "user", content: userMessage }
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

      speakText(reply);
    } catch (error) {
      console.error(error);
      const errorMsg = "Sorry, could you repeat that please?";
      messagesHistoryRef.current.push({ sender: "npc", text: errorMsg });
      setDialogState((prev) => ({
        ...prev,
        status: "idle",
        messages: [...prev.messages, { sender: "npc", text: errorMsg }]
      }));
      speakText(errorMsg);
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
    const missionGoal = isShop
      ? "Buy exactly 2 bottles of water and 1 apple."
      : "Order exactly 1 hot Americano and 1 croissant.";

    const conversationTranscript = messagesHistoryRef.current
      .map((m) => `${m.sender === "user" ? "Student (Spoken)" : "NPC"}: "${m.text}"`)
      .join("\n");

    try {
      const evaluationSystemPrompt = `You are an English Speaking Examiner evaluating a student's LIVE SPOKEN conversation transcribed via Speech-to-Text (STT).

Location: ${isShop ? "Grocery Store" : "Italian Cafe"}
Assigned Mission: "${missionGoal}"

Dialogue Transcript:
${conversationTranscript}

CRITICAL RULES FOR SPOKEN EVALUATION:
1. IGNORE CAPITALIZATION AND PUNCTUATION COMPLETELY: The user is speaking via microphone, so ignore lowercase letters (e.g. 'i want', 'apple', 'london') and missing periods/commas. NEVER count these as mistakes!
2. FOCUS ONLY ON SPOKEN LANGUAGE:
   - Did they ask for the mission items clearly? (Shop: 2 waters, 1 apple; Cafe: 1 Americano, 1 croissant).
   - Real grammar errors (e.g. "I wants", "give me two apple", "I buy water") should be corrected.
   - Natural spoken phrasing and politeness ("Could I have...", "Please", etc.).
3. 'score': (Integer 0-100). High score (85-100) if items were asked correctly regardless of text case. Low score only for missing items, completely wrong vocabulary, or broken grammar.
4. 'completed': (Boolean true/false). true if they ordered/bought the required items.
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

    if (playerRef.current) {
      if (doorType === "Exit Shop") {
        setCurrentLocation("outside");
        playerRef.current.position.set(0, 0, 5.0);
      } else if (doorType === "Exit Cafe") {
        setCurrentLocation("outside");
        playerRef.current.position.set(-12, 0, 5.0);
      }
      playerRef.current.rotation.y = 0;
      cameraAnglesRef.current.theta = 0;
      cameraAnglesRef.current.phi = Math.PI / 3.5;
      cameraAnglesRef.current.radius = 6.0;
    }
  };

  const closeDialog = () => {
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
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        const userText = event.results[0][0].transcript;
        handleUserSpeech(userText);
      };

      recognition.onerror = () => setDialogState((prev) => ({ ...prev, status: "idle" }));
      recognition.onend = () => {
        setDialogState((prev) => {
          if (prev.status === "listening") return { ...prev, status: "idle" };
          return prev;
        });
      };
      recognitionRef.current = recognition;
    }
  }, [dialogState.npcName]);

  const handleUserSpeech = (text) => {
    if (!text || text.trim() === "") return;
    messagesHistoryRef.current.push({ sender: "user", text });
    setDialogState((prev) => ({
      ...prev,
      messages: [...prev.messages, { sender: "user", text }]
    }));
    generateNPCResponseWithAI(text, dialogState.npcName);
  };

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
      setActiveMission({
        title: "🏪 Shop Mission",
        text: "Buy 2 bottles of water and 1 apple."
      });
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
      setActiveMission({
        title: "☕ Cafe Mission",
        text: "Order 1 hot Americano and 1 croissant."
      });
    } else if (doorPrompt === "Exit Shop" || doorPrompt === "Exit Cafe") {
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

    const greeting =
      npcPrompt === "Shop Seller"
        ? "Hello! Welcome to our village shop. What can I get for you today?"
        : "Hi there! Welcome to the Language Cafe. What can I brew for you today?";

    messagesHistoryRef.current.push({ sender: "npc", text: greeting });
    setDialogState({
      isOpen: true,
      npcName: npcPrompt,
      status: "speaking",
      messages: [{ sender: "npc", text: greeting }]
    });

    speakText(greeting);
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