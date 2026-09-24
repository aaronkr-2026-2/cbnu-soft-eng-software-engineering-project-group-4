import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// ==========================================
// GLOBALL BINO KONFIGURATSIYASI (ENG YUQORIGA)
// ==========================================
const BUILDINGS_CONFIG = [
  { name: "Shop", x: 0, z: -2.5, wallColor: 0xf2e6d0, halfW: 3.8, halfD: 5.5 },
  { name: "Cafe", x: -12, z: 0, wallColor: 0xd9b38c, halfW: 4.0, halfD: 3.0 }
];

function App() {
  const mountRef = useRef(null);

  const [doorPrompt, setDoorPrompt] = useState(null);
  const [npcPrompt, setNpcPrompt] = useState(null);
  const [activeMission, setActiveMission] = useState(null);
  const [exitEvaluation, setExitEvaluation] = useState(null);

  const messagesHistoryRef = useRef([]);

  const [dialogState, setDialogState] = useState({
    isOpen: false,
    npcName: "",
    status: "idle",
    messages: []
  });

  const stateRef = useRef({
    currentLocation: "outside",
    keys: { w: false, a: false, s: false, d: false, e: false, f: false },
    cameraAngles: {
      theta: 0,
      phi: Math.PI / 4,
      radius: 6.0
    },
    isDragging: false,
    prevMousePos: { x: 0, y: 0 },
    isDialogOpen: false,
    playerObj: null,
    sellerAction: null,
    baristaAction: null
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

  // ==========================================
  // FUNKSIYA: evaluateOnExit
  // ==========================================
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

    if (stateRef.current.playerObj) {
      if (doorType === "Exit Shop") {
        stateRef.current.currentLocation = "outside";
        stateRef.current.playerObj.position.set(0, 0, 5.0);
      } else if (doorType === "Exit Cafe") {
        stateRef.current.currentLocation = "outside";
        stateRef.current.playerObj.position.set(-12, 0, 5.0);
      }
      stateRef.current.playerObj.rotation.y = 0;
      stateRef.current.cameraAngles.theta = 0;
      stateRef.current.cameraAngles.phi = Math.PI / 3.5;
      stateRef.current.cameraAngles.radius = 6.0;
    }
  };

  const closeDialog = () => {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    if (recognitionRef.current) recognitionRef.current.stop();

    stateRef.current.isDialogOpen = false;
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

  // Three.js
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let animationFrameId;
    let playerMixer = null;
    let playerWalkAction = null;
    let sellerMixer = null;
    let baristaMixer = null;
    const activeCars = [];

    let lastTime = performance.now();

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);

    // ==========================================
    // 1. GLTFLoader ENG BOSHIQDA YARATILADI
    // ==========================================
    const gltfLoader = new GLTFLoader();

    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    mount.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.25);
    dirLight.position.set(10, 20, 10);
    dirLight.castShadow = true;
    scene.add(dirLight);

    // ==========================================
    // O'YINCHI (PLAYERGROUP)
    // ==========================================
    const playerGroup = new THREE.Group();
    playerGroup.position.set(0, 0, 5);
    scene.add(playerGroup);
    stateRef.current.playerObj = playerGroup;

    gltfLoader.load(
      "/models/player.glb",
      (gltf) => {
        const pModel = gltf.scene;
        pModel.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        const box = new THREE.Box3().setFromObject(pModel);
        const size = box.getSize(new THREE.Vector3());
        const scaleFactor = 1.7 / (size.y || 1);
        pModel.scale.set(scaleFactor, scaleFactor, scaleFactor);

        const scaledBox = new THREE.Box3().setFromObject(pModel);
        pModel.position.y = -scaledBox.min.y;

        playerGroup.add(pModel);

        if (gltf.animations && gltf.animations.length > 0) {
          playerMixer = new THREE.AnimationMixer(pModel);
          playerWalkAction = playerMixer.clipAction(gltf.animations[0]);
          playerWalkAction.play();
          playerWalkAction.paused = true;
        }
      },
      undefined,
      () => {
        const dummy = new THREE.Mesh(
          new THREE.CylinderGeometry(0.3, 0.3, 1.6, 16),
          new THREE.MeshStandardMaterial({ color: 0x2266cc })
        );
        dummy.position.y = 0.8;
        dummy.castShadow = true;
        playerGroup.add(dummy);
      }
    );

    // Zamin
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(50, 50),
      new THREE.MeshStandardMaterial({ color: 0x55aa55 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // ==========================================
    // BITTA TOZA TO'G'RI ASFALT YO'L
    // ==========================================
    const roadMat = new THREE.MeshStandardMaterial({ 
      color: 0x2e2e2e, 
      roughness: 0.85 
    });
    const roadMesh = new THREE.Mesh(new THREE.PlaneGeometry(50, 6.5), roadMat);
    roadMesh.rotation.x = -Math.PI / 2;
    roadMesh.position.set(0, 0.02, 8);
    roadMesh.receiveShadow = true;
    scene.add(roadMesh);

    const curbMat = new THREE.MeshStandardMaterial({ color: 0x9e9e9e });
    const curbGeo = new THREE.BoxGeometry(50, 0.15, 0.25);

    const curbTop = new THREE.Mesh(curbGeo, curbMat);
    curbTop.position.set(0, 0.08, 4.7);
    scene.add(curbTop);

    const curbBottom = new THREE.Mesh(curbGeo, curbMat);
    curbBottom.position.set(0, 0.08, 11.3);
    scene.add(curbBottom);

    const lineMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const lineGeo = new THREE.PlaneGeometry(2.2, 0.25);
    for (let x = -22; x <= 22; x += 4.5) {
      const line = new THREE.Mesh(lineGeo, lineMat);
      line.rotation.x = -Math.PI / 2;
      line.position.set(x, 0.03, 8);
      scene.add(line);
    }
// ==========================================
    // 2-BALAND BINO MODELI (KAFE ORQASIDA FON)
    // ==========================================
    gltfLoader.load(
      "/models/skyscraper2.glb",
      (gltf) => {
        const cafeTower = gltf.scene;

        cafeTower.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.material && child.material.map) {
              child.material.map.colorSpace = THREE.SRGBColorSpace;
            }
          }
        });

        // Balandligini taxminan 16-18 metr qilish
        const box = new THREE.Box3().setFromObject(cafeTower);
        const size = box.getSize(new THREE.Vector3());
        const targetHeight = 16.0;
        const scaleFactor = targetHeight / (size.y || 1);
        cafeTower.scale.set(scaleFactor, scaleFactor, scaleFactor);

        // Tag qismini yerga tekislash va kafe orqasiga (x: -15, z: -10) qo'yish
        const scaledBox = new THREE.Box3().setFromObject(cafeTower);
        const yOffset = -scaledBox.min.y;
        cafeTower.position.set(-15, yOffset, -10);

        scene.add(cafeTower);
      },
      undefined,
      (err) => console.error("skyscraper2.glb yuklashda xatolik:", err)
    );
    
    // ==========================================
    // YANGI 3D DARAXT (YO'L BO'YI ALLEYASI)
    // ==========================================
    const treeRowPositions = [
      { x: -18, z: 13.0 },
      { x: -12, z: 13.0 },
      { x: -6,  z: 13.0 },
      { x: 0,   z: 13.0 },
      { x: 6,   z: 13.0 },
      { x: 12,  z: 13.0 },
      { x: 18,  z: 13.0 }
    ];

    gltfLoader.load(
      "/models/tree.glb",
      (gltf) => {
        const treeBase = gltf.scene;

        treeBase.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.material && child.material.map) {
              child.material.map.colorSpace = THREE.SRGBColorSpace;
            }
          }
        });

        const box = new THREE.Box3().setFromObject(treeBase);
        const size = box.getSize(new THREE.Vector3());
        const targetHeight = 3.8;
        const scaleFactor = targetHeight / (size.y || 1);
        treeBase.scale.set(scaleFactor, scaleFactor, scaleFactor);

        const scaledBox = new THREE.Box3().setFromObject(treeBase);
        const yOffset = -scaledBox.min.y;

        treeRowPositions.forEach((pos) => {
          const clone = treeBase.clone(true);
          clone.position.set(pos.x, yOffset, pos.z);
          clone.rotation.y = Math.random() * Math.PI * 2;
          scene.add(clone);
        });
      },
      undefined,
      (err) => console.error("tree.glb yuklashda xatolik:", err)
    );

    // ==========================================
    // 4 TA MCLAREN SENNA (2 TOMONLAMA HARAKAT)
    // ==========================================
    gltfLoader.load(
      "/models/car.glb",
      (gltf) => {
        const baseCar = gltf.scene;

        baseCar.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        const box = new THREE.Box3().setFromObject(baseCar);
        const size = box.getSize(new THREE.Vector3());
        const maxLen = Math.max(size.x, size.z) || 1;
        const targetLength = 4.0;
        const scaleFactor = targetLength / maxLen;
        baseCar.scale.set(scaleFactor, scaleFactor, scaleFactor);

        const scaledBox = new THREE.Box3().setFromObject(baseCar);
        const yPos = -scaledBox.min.y + 0.02;

        const carConfigs = [
          { startX: -25, z: 9.6, speed: 0.18, dir: 1 },
          { startX: -10, z: 9.6, speed: 0.23, dir: 1 },
          { startX:  20, z: 6.4, speed: 0.16, dir: -1 },
          { startX:   5, z: 6.4, speed: 0.21, dir: -1 }
        ];

        carConfigs.forEach((cfg) => {
          const carClone = baseCar.clone(true);
          carClone.position.set(cfg.startX, yPos, cfg.z);

          if (cfg.dir === 1) {
            carClone.rotation.y = -Math.PI / 2;
          } else {
            carClone.rotation.y = Math.PI / 2;
          }

          scene.add(carClone);

          let mixer = null;
          if (gltf.animations && gltf.animations.length > 0) {
            mixer = new THREE.AnimationMixer(carClone);
            gltf.animations.forEach((clip) => {
              mixer.clipAction(clip).play();
            });
          }

          activeCars.push({
            obj: carClone,
            speed: cfg.speed,
            dir: cfg.dir,
            mixer: mixer
          });
        });
      },
      undefined,
      (err) => console.error("car.glb xatosi:", err)
    );

    // ==========================================
    // 3D BALAND BINO MODELI (SKYSCRAPER.GLB)
    // ==========================================
    gltfLoader.load(
      "/models/skyscraper.glb",
      (gltf) => {
        const tower = gltf.scene;

        tower.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.material && child.material.map) {
              child.material.map.colorSpace = THREE.SRGBColorSpace;
            }
          }
        });

        const box = new THREE.Box3().setFromObject(tower);
        const size = box.getSize(new THREE.Vector3());
        const targetHeight = 16.0;
        const scaleFactor = targetHeight / (size.y || 1);
        tower.scale.set(scaleFactor, scaleFactor, scaleFactor);

        const scaledBox = new THREE.Box3().setFromObject(tower);
        const yOffset = -scaledBox.min.y;
        tower.position.set(16, yOffset, 20);

        scene.add(tower);
      },
      undefined,
      (err) => {
        console.error("skyscraper.glb yuklashda xatolik:", err);
        // Fayl topilmasa o'rniga zaxira bino chiqarish
        const towerGroup = new THREE.Group();
        towerGroup.position.set(14, 0, 15);
        const body = new THREE.Mesh(
          new THREE.BoxGeometry(6, 16, 6),
          new THREE.MeshStandardMaterial({ color: 0x263238, roughness: 0.3 })
        );
        body.position.y = 8;
        towerGroup.add(body);
        scene.add(towerGroup);
      }
    );

    // 2. SOTUVCHI JACK
    const sellerGroup = new THREE.Group();
    sellerGroup.position.set(0, 0, -1.85);
    sellerGroup.rotation.y = 0;
    scene.add(sellerGroup);

    gltfLoader.load(
      "/models/seller.glb",
      (gltf) => {
        const sellerModel = gltf.scene;
        const box = new THREE.Box3().setFromObject(sellerModel);
        const size = box.getSize(new THREE.Vector3());
        const scaleFactor = 1.75 / (size.y || 1);

        sellerModel.scale.set(scaleFactor, scaleFactor, scaleFactor);
        const scaledBox = new THREE.Box3().setFromObject(sellerModel);
        sellerModel.position.y = -scaledBox.min.y;

        sellerGroup.add(sellerModel);

        if (gltf.animations && gltf.animations.length > 0) {
          sellerMixer = new THREE.AnimationMixer(sellerModel);
          const talkAction = sellerMixer.clipAction(gltf.animations[0]);
          talkAction.setLoop(THREE.LoopRepeat);
          talkAction.play();
          talkAction.paused = false;
          stateRef.current.sellerAction = talkAction;
        }
      },
      undefined,
      (err) => console.error("seller.glb xatosi:", err)
    );

    // 3. BARISTA MIA
    const baristaGroup = new THREE.Group();
    baristaGroup.position.set(-13.2, 0, -1.75);
    baristaGroup.rotation.y = -(25 * Math.PI) / 180;
    scene.add(baristaGroup);

    gltfLoader.load(
      "/models/barista.glb",
      (gltf) => {
        const baristaModel = gltf.scene;
        const box = new THREE.Box3().setFromObject(baristaModel);
        const size = box.getSize(new THREE.Vector3());
        const scaleFactor = 1.75 / (size.y || 1);

        baristaModel.scale.set(scaleFactor, scaleFactor, scaleFactor);
        const scaledBox = new THREE.Box3().setFromObject(baristaModel);
        baristaModel.position.set(0, -scaledBox.min.y, 0);

        baristaGroup.add(baristaModel);

        if (gltf.animations && gltf.animations.length > 0) {
          baristaMixer = new THREE.AnimationMixer(baristaModel);
          const talkAction = baristaMixer.clipAction(gltf.animations[0]);
          talkAction.setLoop(THREE.LoopRepeat);
          talkAction.play();
          talkAction.paused = false;
          stateRef.current.baristaAction = talkAction;
        }
      },
      undefined,
      (err) => console.error("barista.glb xatosi:", err)
    );

    // FAQAT KAFE BINOSI DEVORLARI
    BUILDINGS_CONFIG.forEach((b) => {
      if (b.name === "Shop" || b.x === 0) return;

      const { x, z, wallColor } = b;
      const wallMat = new THREE.MeshStandardMaterial({ color: wallColor });

      const backWall = new THREE.Mesh(new THREE.BoxGeometry(8, 5, 0.2), wallMat);
      backWall.position.set(x, 2.5, z - 3);
      scene.add(backWall);

      const sideWallGeo = new THREE.BoxGeometry(0.2, 5, 6);
      const leftWall = new THREE.Mesh(sideWallGeo, wallMat);
      leftWall.position.set(x - 4, 2.5, z);
      scene.add(leftWall);

      const rightWall = new THREE.Mesh(sideWallGeo, wallMat);
      rightWall.position.set(x + 4, 2.5, z);
      scene.add(rightWall);

      const frontPartGeo = new THREE.BoxGeometry(3.25, 5, 0.2);
      const frontLeft = new THREE.Mesh(frontPartGeo, wallMat);
      frontLeft.position.set(x - 2.375, 2.5, z + 3);
      scene.add(frontLeft);

      const frontRight = new THREE.Mesh(frontPartGeo, wallMat);
      frontRight.position.set(x + 2.375, 2.5, z + 3);
      scene.add(frontRight);

      const frontTop = new THREE.Mesh(new THREE.BoxGeometry(1.5, 2.2, 0.2), wallMat);
      frontTop.position.set(x, 3.9, z + 3);
      scene.add(frontTop);

      const door = new THREE.Mesh(
        new THREE.BoxGeometry(1.5, 2.8, 0.2),
        new THREE.MeshStandardMaterial({ color: 0x553322 })
      );
      door.position.set(x, 1.4, z + 3.05);
      scene.add(door);
    });

    // DO'KON STOLI
    gltfLoader.load(
      "/models/shop_furniture.glb",
      (gltf) => {
        const furnitureModel = gltf.scene;
        furnitureModel.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        const box = new THREE.Box3().setFromObject(furnitureModel);
        const size = box.getSize(new THREE.Vector3());
        const desiredWidth = 3.2;
        const scaleFactor = desiredWidth / (size.x || 1);
        furnitureModel.scale.set(scaleFactor, scaleFactor, scaleFactor);
        furnitureModel.rotation.y = Math.PI;

        box.setFromObject(furnitureModel);
        const center = box.getCenter(new THREE.Vector3());

        furnitureModel.position.x = 0 - (center.x - furnitureModel.position.x);
        furnitureModel.position.y = -box.min.y;
        furnitureModel.position.z = -1.2;

        scene.add(furnitureModel);
      },
      undefined,
      (err) => console.error("shop_furniture.glb xatosi:", err)
    );

    // DO'KON INTERYERI
    gltfLoader.load(
      "/models/shop_interior.glb",
      (gltf) => {
        const shopRoom = gltf.scene;
        shopRoom.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        const box = new THREE.Box3().setFromObject(shopRoom);
        const size = box.getSize(new THREE.Vector3());
        const desiredWidth = 12.0;
        const scaleFactor = desiredWidth / (size.x || 1);
        shopRoom.scale.set(scaleFactor, scaleFactor, scaleFactor);
        shopRoom.rotation.y = -Math.PI / 2;

        box.setFromObject(shopRoom);
        const center = box.getCenter(new THREE.Vector3());

        shopRoom.position.x = 0 - (center.x - shopRoom.position.x);
        shopRoom.position.y = -box.min.y;
        shopRoom.position.z = -1.8 - (center.z - shopRoom.position.z);

        scene.add(shopRoom);
      },
      undefined,
      (err) => console.error("shop_interior.glb yuklashda xatolik:", err)
    );

    // KAFE INTERYERI
    gltfLoader.load(
      "/models/cafe_interior.glb",
      (gltf) => {
        const cafeRoom = gltf.scene;
        cafeRoom.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        const box = new THREE.Box3().setFromObject(cafeRoom);
        const size = box.getSize(new THREE.Vector3());
        const desiredWidth = 7.6;
        const scaleFactor = desiredWidth / (size.x || 1);
        cafeRoom.scale.set(scaleFactor, scaleFactor, scaleFactor);

        box.setFromObject(cafeRoom);
        const center = box.getCenter(new THREE.Vector3());

        cafeRoom.position.x = -12 - (center.x - cafeRoom.position.x);
        cafeRoom.position.y = -box.min.y;
        cafeRoom.position.z = 0 - (center.z - cafeRoom.position.z);

        scene.add(cafeRoom);
      },
      undefined,
      (err) => console.error("cafe_interior.glb yuklashda xatolik:", err)
    );

    // Sichqoncha nazorati
    const handleMouseDown = (e) => {
      if (stateRef.current.isDialogOpen) return;
      stateRef.current.isDragging = true;
      stateRef.current.prevMousePos = { x: e.clientX, y: e.clientY };
    };
    const handleMouseMove = (e) => {
      if (!stateRef.current.isDragging || stateRef.current.isDialogOpen) return;
      const deltaX = e.clientX - stateRef.current.prevMousePos.x;
      const deltaY = e.clientY - stateRef.current.prevMousePos.y;
      const angles = stateRef.current.cameraAngles;
      angles.theta -= deltaX * 0.005;
      angles.phi -= deltaY * 0.005;
      angles.phi = Math.max(0.2, Math.min(Math.PI / 2 - 0.05, angles.phi));
      stateRef.current.prevMousePos = { x: e.clientX, y: e.clientY };
    };
    const handleMouseUp = () => (stateRef.current.isDragging = false);

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    // Klaviatura nazorati
    const handleKeyDown = (e) => {
      const code = e.code;
      if (code === "KeyF") {
        if (stateRef.current.isDialogOpen) closeDialog();
        else stateRef.current.keys.f = true;
        return;
      }
      if (stateRef.current.isDialogOpen) return;
      if (code === "KeyW") stateRef.current.keys.w = true;
      if (code === "KeyS") stateRef.current.keys.s = true;
      if (code === "KeyA") stateRef.current.keys.a = true;
      if (code === "KeyD") stateRef.current.keys.d = true;
      if (code === "KeyE") stateRef.current.keys.e = true;
    };

    const handleKeyUp = (e) => {
      const code = e.code;
      if (code === "KeyW") stateRef.current.keys.w = false;
      if (code === "KeyS") stateRef.current.keys.s = false;
      if (code === "KeyA") stateRef.current.keys.a = false;
      if (code === "KeyD") stateRef.current.keys.d = false;
      if (code === "KeyE") stateRef.current.keys.e = false;
      if (code === "KeyF") stateRef.current.keys.f = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // ==========================================
    // TO'QNAShUV TO'SIQLARI
    // ==========================================
    const checkCollisions = (x, z) => {
      const loc = stateRef.current.currentLocation;
      const r = 0.5;

      if (loc === "outside") {
        for (const b of BUILDINGS_CONFIG) {
          const halfW = b.halfW || 4.0;
          const halfD = b.halfD || 3.0;

          const bLeft = b.x - halfW;
          const bRight = b.x + halfW;
          const bBack = b.z - halfD;
          const bFront = b.z + halfD;

          if (x > bLeft - r && x < bRight + r && z > bBack - r && z < bFront + r) {
            const overlapLeft = x - (bLeft - r);
            const overlapRight = bRight + r - x;
            const overlapBack = z - (bBack - r);
            const overlapFront = bFront + r - z;

            const minOverlap = Math.min(overlapLeft, overlapRight, overlapBack, overlapFront);

            if (minOverlap === overlapFront) z = bFront + r;
            else if (minOverlap === overlapBack) z = bBack - r;
            else if (minOverlap === overlapLeft) x = bLeft - r;
            else if (minOverlap === overlapRight) x = bRight + r;
          }
        }
// KAFE ORQASIDAGI BINO TO'SIG'I (x: -15, z: -10)
        const b2MinX = -15 - 3.5;
        const b2MaxX = -15 + 3.5;
        const b2MinZ = -10 - 3.5;
        const b2MaxZ = -10 + 3.5;

        if (x > b2MinX && x < b2MaxX && z > b2MinZ && z < b2MaxZ) {
          const dLeft = Math.abs(x - b2MinX);
          const dRight = Math.abs(b2MaxX - x);
          const dBack = Math.abs(z - b2MinZ);
          const dFront = Math.abs(b2MaxZ - z);

          const minDist = Math.min(dLeft, dRight, dBack, dFront);
          if (minDist === dLeft) x = b2MinX;
          else if (minDist === dRight) x = b2MaxX;
          else if (minDist === dBack) z = b2MinZ;
          else z = b2MaxZ;
        }
        // Baland bino to'sig'i
        const minX = 16 - 3.5;
        const maxX = 16 + 3.5;
        const minZ = 20 - 3.5;
        const maxZ = 20 + 3.5;
        if (x > minX && x < maxX && z > minZ && z < maxZ) {
          const dLeft = Math.abs(x - minX);
          const dRight = Math.abs(maxX - x);
          const dBack = Math.abs(z - minZ);
          const dFront = Math.abs(maxZ - z);

          const minDist = Math.min(dLeft, dRight, dBack, dFront);
          if (minDist === dLeft) x = minX;
          else if (minDist === dRight) x = maxX;
          else if (minDist === dBack) z = minZ;
          else z = maxZ;
        }
      } else if (loc === "Cafe") {
        x = Math.max(-14.2, Math.min(-9.8, x));
        z = Math.max(-0.2, Math.min(2.4, z));
      } else if (loc === "Shop") {
        x = Math.max(-2.8, Math.min(2.8, x));
        z = Math.max(-2.2, Math.min(2.4, z));
      }

      x = Math.max(-20, Math.min(20, x));
      z = Math.max(-20, Math.min(20, z));

      return { x, z };
    };

    // Animatsiya tsikli
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const currentTime = performance.now();
      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      const speed = 0.08;
      const { keys, currentLocation, cameraAngles, isDialogOpen } = stateRef.current;

      if (playerMixer) playerMixer.update(delta);
      const isMoving = keys.w || keys.s || keys.a || keys.d;
      if (playerWalkAction) {
        playerWalkAction.paused = !isMoving;
      }

      // Mashinalar harakati
      if (currentLocation === "outside") {
        activeCars.forEach((c) => {
          if (c.mixer) {
            c.mixer.update(delta);
          }

          c.obj.position.x += c.speed * c.dir;

          if (c.dir === 1 && c.obj.position.x > 26) {
            c.obj.position.x = -26;
          } else if (c.dir === -1 && c.obj.position.x < -26) {
            c.obj.position.x = 26;
          }
        });
      }

      if (sellerMixer) {
        if (stateRef.current.sellerAction) {
          stateRef.current.sellerAction.paused = false;
          stateRef.current.sellerAction.timeScale = isDialogOpen && currentLocation === "Shop" ? 1.0 : 0.6;
        }
        sellerMixer.update(delta);
      }

      if (baristaMixer) {
        if (stateRef.current.baristaAction) {
          stateRef.current.baristaAction.paused = false;
          stateRef.current.baristaAction.timeScale = isDialogOpen && currentLocation === "Cafe" ? 1.0 : 0.6;
        }
        baristaMixer.update(delta);
      }

      // O'yinchi harakati
      if (!isDialogOpen && playerGroup) {
        const forwardX = -Math.sin(cameraAngles.theta);
        const forwardZ = -Math.cos(cameraAngles.theta);
        const rightX = Math.cos(cameraAngles.theta);
        const rightZ = -Math.sin(cameraAngles.theta);

        let moveX = 0;
        let moveZ = 0;

        if (keys.w) { moveX += forwardX; moveZ += forwardZ; }
        if (keys.s) { moveX -= forwardX; moveZ -= forwardZ; }
        if (keys.a) { moveX -= rightX; moveZ -= rightZ; }
        if (keys.d) { moveX += rightX; moveZ += rightZ; }

        const moveLen = Math.hypot(moveX, moveZ);
        if (moveLen > 0) {
          moveX = (moveX / moveLen) * speed;
          moveZ = (moveZ / moveLen) * speed;
        }

        let newX = playerGroup.position.x + moveX;
        let newZ = playerGroup.position.z + moveZ;

        const corrected = checkCollisions(newX, newZ);
        playerGroup.position.x = corrected.x;
        playerGroup.position.z = corrected.z;

        if (moveLen > 0) {
          playerGroup.rotation.y = Math.atan2(moveX, moveZ);
        }
      }

      // Masofa tekshirish
      let activeDoor = null;
      let currentNpc = null;

      if (currentLocation === "outside") {
        const shopDist = Math.hypot(playerGroup.position.x - 0, playerGroup.position.z - 3.4);
        const cafeDist = Math.hypot(playerGroup.position.x - (-12), playerGroup.position.z - 3.6);

        if (shopDist < 1.4) activeDoor = "Shop Door";
        else if (cafeDist < 1.4) activeDoor = "Cafe Door";
      } else if (currentLocation === "Shop") {
        if (Math.hypot(playerGroup.position.x - 0, playerGroup.position.z - 2.5) < 1.4) {
          activeDoor = "Exit Shop";
        }
        if (playerGroup.position.distanceTo(sellerGroup.position) < 2.5) {
          currentNpc = "Shop Seller";
        }
      } else if (currentLocation === "Cafe") {
        if (Math.hypot(playerGroup.position.x - (-12), playerGroup.position.z - 2.5) < 1.4) {
          activeDoor = "Exit Cafe";
        }
        if (playerGroup.position.distanceTo(baristaGroup.position) < 2.5) {
          currentNpc = "Cafe Barista";
        }
      }

      setDoorPrompt(activeDoor);
      setNpcPrompt(currentNpc);

      // 'E' harakati
      if (keys.e && activeDoor && !isDialogOpen) {
        if (activeDoor === "Shop Door") {
          stateRef.current.currentLocation = "Shop";
          playerGroup.position.set(0, 0, 1.5);
          playerGroup.rotation.y = Math.PI;

          stateRef.current.cameraAngles.theta = 0;
          stateRef.current.cameraAngles.phi = Math.PI / 2.2;
          stateRef.current.cameraAngles.radius = 2.0;

          messagesHistoryRef.current = [];
          setActiveMission({
            title: "🏪 Shop Mission",
            text: "Buy 2 bottles of water and 1 apple."
          });
        } else if (activeDoor === "Cafe Door") {
          stateRef.current.currentLocation = "Cafe";
          playerGroup.position.set(-12, 0, 1.5);
          playerGroup.rotation.y = Math.PI;

          stateRef.current.cameraAngles.theta = 0;
          stateRef.current.cameraAngles.phi = Math.PI / 2.2;
          stateRef.current.cameraAngles.radius = 2.0;

          messagesHistoryRef.current = [];
          setActiveMission({
            title: "☕ Cafe Mission",
            text: "Order 1 hot Americano and 1 croissant."
          });
        } else if (activeDoor === "Exit Shop" || activeDoor === "Exit Cafe") {
          evaluateOnExit(activeDoor);
        }
        keys.e = false;
      }

      // 'F' suhbat
      if (keys.f && currentNpc && !isDialogOpen) {
        stateRef.current.isDialogOpen = true;

        const greeting =
          currentNpc === "Shop Seller"
            ? "Hello! Welcome to our village shop. What can I get for you today?"
            : "Hi there! Welcome to the Language Cafe. What can I brew for you today?";

        messagesHistoryRef.current.push({ sender: "npc", text: greeting });
        setDialogState({
          isOpen: true,
          npcName: currentNpc,
          status: "speaking",
          messages: [{ sender: "npc", text: greeting }]
        });

        speakText(greeting);
        keys.f = false;
      }

      // Kamera burchagi
      const { theta, phi, radius } = cameraAngles;

      if (currentLocation !== "outside") {
        const bX = currentLocation === "Shop" ? 0 : -12;
        const shoulderOffsetX = 0.7;
        const shoulderOffsetY = 1.45;

        let camX = playerGroup.position.x + shoulderOffsetX + radius * 0.8 * Math.sin(theta);
        let camY = shoulderOffsetY + radius * 0.4 * Math.cos(phi);
        let camZ = playerGroup.position.z + 1.25;

        camX = Math.max(bX - 3.4, Math.min(bX + 3.4, camX));
        camZ = Math.min(2.5, Math.max(-0.5, camZ));
        camY = Math.max(1.3, Math.min(2.5, camY));

        camera.position.set(camX, camY, camZ);
        camera.lookAt(bX, 1.35, -1.8);
      } else {
        let camX = playerGroup.position.x + radius * Math.sin(phi) * Math.sin(theta);
        let camY = playerGroup.position.y + radius * Math.cos(phi);
        let camZ = playerGroup.position.z + radius * Math.sin(phi) * Math.cos(theta);

        camera.position.set(camX, camY, camZ);
        camera.lookAt(playerGroup.position.x, playerGroup.position.y + 0.9, playerGroup.position.z);
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);

      scene.traverse((child) => {
        if (child.isMesh) {
          child.geometry.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach((mat) => mat.dispose());
          } else {
            child.material.dispose();
          }
        }
      });

      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
        cursor: dialogState.isOpen ? "default" : "grab",
        userSelect: "none"
      }}
    >
      {!dialogState.isOpen && (
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
          🖱️ <strong>Mouse Drag:</strong> Obzor | ⌨️ <strong>WASD:</strong> Harakat
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