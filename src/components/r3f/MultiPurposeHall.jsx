import React, { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

/**
 * Stylized low-poly Community Event Coordinator Yuri
 * Friendly, professional event coordinator at the village multi-purpose hall (마을 다목적 강당).
 * Dressed in a tailored navy blazer, ivory inner blouse, dark slate trousers,
 * polished dark shoes, neatly styled hair with barrette, and a gold "YURI" badge.
 * Subtly animated with gentle breathing, small head movements, and conversational hand gestures.
 */
function CoordinatorYuri({ isTalking = false }) {
  const headRef = useRef();
  const leftArmRef = useRef();
  const rightArmRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (headRef.current) {
      headRef.current.position.y = 1.38 + Math.sin(t * 2) * 0.005;
      if (isTalking) {
        headRef.current.rotation.y = Math.sin(t * 4.8) * 0.08;
        headRef.current.rotation.x = Math.sin(t * 6.5) * 0.04;
      } else {
        headRef.current.rotation.y = Math.sin(t * 0.8) * 0.03;
        headRef.current.rotation.x = 0;
      }
    }
    if (rightArmRef.current && isTalking) {
      rightArmRef.current.rotation.x = -0.35 + Math.sin(t * 5.5) * 0.15;
    }
    if (leftArmRef.current && isTalking) {
      leftArmRef.current.rotation.x = -0.35 - Math.sin(t * 5.5) * 0.12;
    }
  });

  return (
    <group position={[10.8, 0, 42.0]}>
      {/* Lower Body / Tailored Slate Trousers */}
      <mesh position={[-0.1, 0.44, 0]}>
        <cylinderGeometry args={[0.07, 0.08, 0.86, 12]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} />
      </mesh>
      <mesh position={[0.1, 0.44, 0]}>
        <cylinderGeometry args={[0.07, 0.08, 0.86, 12]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} />
      </mesh>

      {/* Dark Polished Shoes */}
      <mesh position={[-0.1, 0.04, 0.03]}>
        <boxGeometry args={[0.11, 0.08, 0.18]} />
        <meshStandardMaterial color="#0f172a" roughness={0.3} />
      </mesh>
      <mesh position={[0.1, 0.04, 0.03]}>
        <boxGeometry args={[0.11, 0.08, 0.18]} />
        <meshStandardMaterial color="#0f172a" roughness={0.3} />
      </mesh>

      {/* Torso / Tailored Navy Blazer & Ivory Blouse */}
      <mesh position={[0, 1.1, 0]}>
        <boxGeometry args={[0.4, 0.48, 0.24]} />
        <meshStandardMaterial color="#1e3a8a" roughness={0.65} />
      </mesh>

      {/* Ivory Blouse Inset */}
      <mesh position={[0, 1.15, 0.122]}>
        <planeGeometry args={[0.14, 0.22]} />
        <meshStandardMaterial color="#fffbeb" roughness={0.5} />
      </mesh>

      {/* Gold Coordinator Name Badge ("YURI") */}
      <mesh position={[-0.13, 1.18, 0.124]}>
        <boxGeometry args={[0.08, 0.035, 0.01]} />
        <meshStandardMaterial color="#f59e0b" roughness={0.2} metalness={0.8} />
      </mesh>

      {/* Left Arm & Hand */}
      <group ref={leftArmRef} position={[-0.24, 1.25, 0]}>
        <mesh position={[0, -0.22, 0]}>
          <cylinderGeometry args={[0.055, 0.05, 0.44, 10]} />
          <meshStandardMaterial color="#1e3a8a" roughness={0.65} />
        </mesh>
        <mesh position={[0, -0.46, 0]}>
          <sphereGeometry args={[0.045, 8, 8]} />
          <meshStandardMaterial color="#fed7aa" roughness={0.6} />
        </mesh>
      </group>

      {/* Right Arm & Hand */}
      <group ref={rightArmRef} position={[0.24, 1.25, 0]}>
        <mesh position={[0, -0.22, 0]}>
          <cylinderGeometry args={[0.055, 0.05, 0.44, 10]} />
          <meshStandardMaterial color="#1e3a8a" roughness={0.65} />
        </mesh>
        <mesh position={[0, -0.46, 0]}>
          <sphereGeometry args={[0.045, 8, 8]} />
          <meshStandardMaterial color="#fed7aa" roughness={0.6} />
        </mesh>
      </group>

      {/* Head, Hair & Friendly Expression */}
      <group ref={headRef} position={[0, 1.38, 0]}>
        {/* Head */}
        <mesh position={[0, 0.12, 0]}>
          <sphereGeometry args={[0.13, 16, 16]} />
          <meshStandardMaterial color="#fed7aa" roughness={0.6} />
        </mesh>

        {/* Styled Dark Espresso Hair */}
        <mesh position={[0, 0.2, -0.02]}>
          <sphereGeometry args={[0.14, 14, 14]} />
          <meshStandardMaterial color="#1c1917" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.21, 0.06]}>
          <boxGeometry args={[0.18, 0.06, 0.08]} />
          <meshStandardMaterial color="#1c1917" roughness={0.8} />
        </mesh>
        {/* Low Elegant Bun */}
        <mesh position={[0, 0.14, -0.13]}>
          <sphereGeometry args={[0.075, 10, 10]} />
          <meshStandardMaterial color="#1c1917" roughness={0.8} />
        </mesh>
        {/* Silver Hair Clip */}
        <mesh position={[0, 0.17, -0.14]}>
          <boxGeometry args={[0.08, 0.02, 0.015]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Eyes */}
        <mesh position={[-0.045, 0.13, 0.12]}>
          <sphereGeometry args={[0.018, 8, 8]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <mesh position={[0.045, 0.13, 0.12]}>
          <sphereGeometry args={[0.018, 8, 8]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>

        {/* Friendly Professional Smile */}
        <mesh position={[0, 0.075, 0.122]}>
          <boxGeometry args={[0.045, 0.014, 0.01]} />
          <meshStandardMaterial color="#e11d48" />
        </mesh>
      </group>
    </group>
  );
}

/**
 * Modern Low-Poly Community Hall Chair
 */
function HallChair({ position, rotation = [0, 0, 0], color = "#1e3a8a" }) {
  return (
    <group position={position} rotation={rotation}>
      {/* 4 Steel Tube Legs */}
      {[
        [-0.17, 0.22, -0.16],
        [0.17, 0.22, -0.16],
        [-0.17, 0.22, 0.16],
        [0.17, 0.22, 0.16]
      ].map((p, idx) => (
        <mesh key={`hall-leg-${idx}`} position={p}>
          <cylinderGeometry args={[0.016, 0.014, 0.44, 8]} />
          <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.3} />
        </mesh>
      ))}
      {/* Molded Polypropylene Seat */}
      <mesh position={[0, 0.44, 0]}>
        <boxGeometry args={[0.42, 0.05, 0.4]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
      {/* Curved Ergonomic Backrest */}
      <mesh position={[0, 0.72, -0.18]}>
        <boxGeometry args={[0.4, 0.44, 0.04]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
    </group>
  );
}

/**
 * Potted Community Hall Plant
 */
function HallPlant({ position }) {
  return (
    <group position={position}>
      {/* Sleek Planter */}
      <mesh position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.22, 0.17, 0.44, 12]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.4} />
      </mesh>
      {/* Navy Accent Rim Stripe */}
      <mesh position={[0, 0.44, 0]}>
        <torusGeometry args={[0.22, 0.015, 8, 16]} />
        <meshStandardMaterial color="#1e3a8a" roughness={0.4} />
      </mesh>
      {/* Soil */}
      <mesh position={[0, 0.42, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.04, 10]} />
        <meshStandardMaterial color="#3f2e18" roughness={0.9} />
      </mesh>
      {/* Main Stems & Leaves */}
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.03, 0.04, 0.54, 8]} />
        <meshStandardMaterial color="#15803d" roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.0, 0]}>
        <sphereGeometry args={[0.28, 10, 10]} />
        <meshStandardMaterial color="#16a34a" roughness={0.7} />
      </mesh>
      <mesh position={[0.07, 1.2, 0.05]}>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshStandardMaterial color="#22c55e" roughness={0.75} />
      </mesh>
      <mesh position={[-0.07, 1.15, -0.05]}>
        <sphereGeometry args={[0.18, 8, 8]} />
        <meshStandardMaterial color="#4ade80" roughness={0.8} />
      </mesh>
    </group>
  );
}

/**
 * MultiPurposeHall Interior Component
 * Renders ONLY when currentLocation === "MultiPurposeHall".
 * Believable Korean neighborhood multi-purpose hall (마을 다목적 강당) with:
 * - Coordinator Yuri NPC
 * - Raised main stage, podium, microphone stand, PA speakers, laptop table
 * - High-resolution presentation screen ("VILLAGE COMMUNITY HALL / 마을 다목적 강당")
 * - Audience seating with clear central corridor
 * - Registration desk with name tags, brochures, and sign-in sheets
 * - Storage area with cabinets, folded chairs, bins, rolled banners
 * - High-resolution canvas texture community event board & weekly schedule board
 * - Amenities: water dispenser, paper cups, wall clock, plants, recycling sorting bins, exit sign
 */
export function MultiPurposeHall({ isTalking = false, currentLocation = "outside" }) {
  const isInside = currentLocation === "MultiPurposeHall";

  // 1. Presentation Screen Canvas Texture (1024x512)
  const presentationScreenTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Dark slate background with deep navy gradient header
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, 1024, 512);

    const grad = ctx.createLinearGradient(0, 0, 1024, 0);
    grad.addColorStop(0, "#1e3a8a");
    grad.addColorStop(1, "#0f766e");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 88);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 34px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("🏛️ VILLAGE COMMUNITY HALL (마을 다목적 강당)", 40, 56);

    ctx.fillStyle = "#bae6fd";
    ctx.font = "bold 20px sans-serif";
    ctx.textAlign = "right";
    ctx.fillText("Resident Assembly & Education Hub", 984, 56);

    // Main Presentation Slide Box
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(40, 116, 944, 320);
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 3;
    ctx.strokeRect(40, 116, 944, 320);

    // Slide Title
    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 28px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("TODAY'S SPECIAL PRESENTATION & RESIDENT FORUM", 70, 168);

    // 3 Slide Topic Cards
    const topics = [
      {
        num: "01",
        title: "Community Agenda",
        kr: "주민 안건 발표",
        desc: "• Neighborhood safety & road updates",
        color: "#38bdf8"
      },
      {
        num: "02",
        title: "English Presentation",
        kr: "영어 발표회",
        desc: "• Language learners showcase & chat",
        color: "#fbbf24"
      },
      {
        num: "03",
        title: "Village Workshop",
        kr: "주민 참여 워크숍",
        desc: "• Weekend community programs",
        color: "#34d399"
      }
    ];

    topics.forEach((t, i) => {
      const cardX = 70 + i * 300;
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(cardX, 204, 280, 200);
      ctx.strokeStyle = t.color;
      ctx.lineWidth = 2;
      ctx.strokeRect(cardX, 204, 280, 200);

      ctx.fillStyle = t.color;
      ctx.font = "bold 22px sans-serif";
      ctx.fillText(`${t.num}. ${t.title}`, cardX + 16, 244);

      ctx.fillStyle = "#94a3b8";
      ctx.font = "bold 16px sans-serif";
      ctx.fillText(t.kr, cardX + 16, 276);

      ctx.fillStyle = "#e2e8f0";
      ctx.font = "15px sans-serif";
      ctx.fillText(t.desc, cardX + 16, 320);

      ctx.fillStyle = "#64748b";
      ctx.font = "14px sans-serif";
      ctx.fillText("• Open for Q&A after speech", cardX + 16, 352);
    });

    // Bottom presenter note
    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 17px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Coordinator Yuri • Hall Operations Desk • Welcoming All Village Residents", 512, 478);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);

  // 2. Community Events Notice Board (1024x512)
  const noticeBoardTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 1024, 512);

    // Navy header border
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 10;
    ctx.strokeRect(5, 5, 1014, 502);

    ctx.fillStyle = "#1e3a8a";
    ctx.fillRect(5, 5, 1014, 76);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 30px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("📢 VILLAGE COMMUNITY EVENTS (주민 행사 안내)", 36, 52);

    ctx.fillStyle = "#dbeafe";
    ctx.font = "bold 18px sans-serif";
    ctx.textAlign = "right";
    ctx.fillText("Multi-Purpose Hall • Free Admission", 980, 52);

    // 4 Key Programs
    const events = [
      {
        title: "1. COMMUNITY MEETING",
        kr: "주민 총회",
        color: "#1e3a8a",
        time: "Every Monday 10:00 AM - 11:30 AM",
        desc: "• Discuss village improvements, neighbor suggestions, and monthly updates"
      },
      {
        title: "2. ENGLISH PRESENTATION",
        kr: "영어 발표회",
        color: "#0284c7",
        time: "Wednesday 2:00 PM - 3:30 PM",
        desc: "• Short speeches by learners, friendly feedback, and speaking confidence games"
      },
      {
        title: "3. LOCAL WORKSHOP",
        kr: "마을 공예 워크숍",
        color: "#d97706",
        time: "Friday 3:00 PM - 5:00 PM",
        desc: "• Hands-on crafts, DIY hobbies, and resident talent-sharing sessions"
      },
      {
        title: "4. RESIDENT PROGRAM",
        kr: "주민 참여 프로그램",
        color: "#059669",
        time: "Saturday 11:00 AM - 1:00 PM",
        desc: "• Cultural events, family story sharing, and community neighborhood gathering"
      }
    ];

    events.forEach((ev, idx) => {
      const colX = 36 + (idx % 2) * 480;
      const colY = idx < 2 ? 112 : 282;

      ctx.fillStyle = ev.color;
      ctx.font = "bold 20px sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(`${ev.title} [${ev.kr}]`, colX, colY);

      ctx.fillStyle = "#475569";
      ctx.font = "bold 15px sans-serif";
      ctx.fillText(`⏰ ${ev.time}`, colX + 12, colY + 30);

      ctx.fillStyle = "#334155";
      ctx.font = "15px sans-serif";
      ctx.fillText(ev.desc, colX + 12, colY + 54);
    });

    // Bottom Callout
    ctx.fillStyle = "#eff6ff";
    ctx.fillRect(36, 436, 952, 58);
    ctx.strokeStyle = "#bfdbfe";
    ctx.lineWidth = 2;
    ctx.strokeRect(36, 436, 952, 58);

    ctx.fillStyle = "#1e40af";
    ctx.font = "bold 18px sans-serif";
    ctx.fillText("💡 Want to book the stage or suggest a new program? Ask Coordinator Yuri at the desk!", 56, 472);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);

  // 3. Information Board ("THIS WEEK" / "이번 주 일정") (512x512)
  const scheduleBoardTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, 0, 512, 512);

    ctx.fillStyle = "#3b82f6";
    ctx.fillRect(0, 0, 512, 70);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 28px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("THIS WEEK (이번 주)", 256, 46);

    const schedule = [
      { day: "MON", event: "COMMUNITY MEETING", time: "10:00 AM", color: "#38bdf8" },
      { day: "WED", event: "ENGLISH PRESENTATION", time: "2:00 PM", color: "#60a5fa" },
      { day: "FRI", event: "RESIDENT WORKSHOP", time: "3:00 PM", color: "#facc15" },
      { day: "SAT", event: "FAMILY EVENT", time: "11:00 AM", color: "#4ade80" },
      { day: "SUN", event: "COMMUNITY REHEARSALS", time: "2:00 PM", color: "#f472b6" }
    ];

    schedule.forEach((item, idx) => {
      const rowY = 110 + idx * 64;

      ctx.fillStyle = "#334155";
      ctx.fillRect(20, rowY - 24, 472, 52);
      ctx.strokeStyle = "rgba(255,255,255,0.1)";
      ctx.lineWidth = 1;
      ctx.strokeRect(20, rowY - 24, 472, 52);

      ctx.fillStyle = item.color;
      ctx.font = "bold 18px sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(`[${item.day}]`, 36, rowY + 8);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 16px sans-serif";
      ctx.fillText(item.event, 108, rowY + 8);

      ctx.fillStyle = "#cbd5e1";
      ctx.font = "14px sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(item.time, 476, rowY + 8);
    });

    ctx.fillStyle = "#94a3b8";
    ctx.font = "13px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Village Community Office • Tel: 043-261-0000", 256, 480);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);

  // 4. Main Bilingual Signboard ("VILLAGE MULTI-PURPOSE HALL" / "마을 다목적 강당") (512x256)
  const mainSignTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, 0, 512, 256);

    // Deep Indigo Top Stripe
    ctx.fillStyle = "#3b82f6";
    ctx.fillRect(0, 0, 512, 24);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 31px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("VILLAGE MULTI-PURPOSE HALL", 256, 100);

    ctx.fillStyle = "#93c5fd";
    ctx.font = "bold 28px sans-serif";
    ctx.fillText("마을 다목적 강당", 256, 150);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "16px sans-serif";
    ctx.fillText("Community Events • Resident Meetings • Public Lectures", 256, 195);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);

  // 5. Secondary Signboard ("COMMUNITY EVENTS & MEETINGS" / "주민 행사 및 모임") (512x256)
  const secondarySignTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, 512, 256);

    ctx.fillStyle = "#0d9488";
    ctx.fillRect(0, 0, 512, 20);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 28px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("COMMUNITY EVENTS & MEETINGS", 256, 96);

    ctx.fillStyle = "#2dd4bf";
    ctx.font = "bold 26px sans-serif";
    ctx.fillText("주민 행사 및 모임", 256, 146);

    ctx.fillStyle = "#cbd5e1";
    ctx.font = "16px sans-serif";
    ctx.fillText("Assembly Hall & Cultural Gathering Space", 256, 192);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);

  if (!isInside) return null;

  return (
    <group>
      {/* ============================================================ */}
      {/* 1. LIGHTING (Lightweight: Ambient + 1 Point Light, No Shadow) */}
      {/* ============================================================ */}
      <ambientLight intensity={0.96} color="#fffbf5" />
      <pointLight position={[10.8, 2.8, 41.8]} intensity={1.15} distance={9} color="#e0e7ff" />

      {/* ============================================================ */}
      {/* 2. FLOOR & CEILING                                           */}
      {/* ============================================================ */}
      {/* Polished Neutral Terrazzo Floor (X: [8.7, 12.9], Z: [39.6, 44.0]) */}
      <mesh position={[10.8, 0.01, 41.8]}>
        <boxGeometry args={[4.2, 0.02, 4.4]} />
        <meshStandardMaterial color="#dfd7cc" roughness={0.45} />
      </mesh>

      {/* Perimeter Dark Border Strip */}
      <mesh position={[10.8, 0.015, 39.7]}>
        <boxGeometry args={[4.2, 0.01, 0.2]} />
        <meshStandardMaterial color="#334155" roughness={0.6} />
      </mesh>
      <mesh position={[10.8, 0.015, 43.9]}>
        <boxGeometry args={[4.2, 0.01, 0.2]} />
        <meshStandardMaterial color="#334155" roughness={0.6} />
      </mesh>
      <mesh position={[8.8, 0.015, 41.8]}>
        <boxGeometry args={[0.2, 0.01, 4.4]} />
        <meshStandardMaterial color="#334155" roughness={0.6} />
      </mesh>
      <mesh position={[12.8, 0.015, 41.8]}>
        <boxGeometry args={[0.2, 0.01, 4.4]} />
        <meshStandardMaterial color="#334155" roughness={0.6} />
      </mesh>

      {/* Center Pathway Runner Rug (Navy Accent) */}
      <mesh position={[10.8, 0.018, 42.2]}>
        <boxGeometry args={[1.3, 0.01, 2.6]} />
        <meshStandardMaterial color="#1e3a8a" roughness={0.8} />
      </mesh>

      {/* Entrance Welcome Mat */}
      <mesh position={[10.8, 0.02, 43.3]}>
        <boxGeometry args={[1.2, 0.01, 0.7]} />
        <meshStandardMaterial color="#0f766e" roughness={0.8} />
      </mesh>

      {/* Ceiling with Recessed Warm LED Panels */}
      <mesh position={[10.8, 3.2, 41.8]}>
        <boxGeometry args={[4.2, 0.05, 4.4]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.85} />
      </mesh>
      <mesh position={[10.8, 3.18, 40.8]}>
        <boxGeometry args={[2.0, 0.02, 0.6]} />
        <meshStandardMaterial color="#ffffff" emissive="#fffdf0" emissiveIntensity={0.85} />
      </mesh>
      <mesh position={[10.8, 3.18, 42.4]}>
        <boxGeometry args={[2.0, 0.02, 0.6]} />
        <meshStandardMaterial color="#ffffff" emissive="#fffdf0" emissiveIntensity={0.85} />
      </mesh>

      {/* ============================================================ */}
      {/* 3. FOUR WALLS                                                */}
      {/* ============================================================ */}
      {/* Rear Stage Wall (Z = 39.6) */}
      <mesh position={[10.8, 1.6, 39.6]}>
        <boxGeometry args={[4.2, 3.2, 0.08]} />
        <meshStandardMaterial color="#fffdfa" roughness={0.85} />
      </mesh>
      {/* Rear Stage Wainscot Trim Panel (Muted Navy Accent) */}
      <mesh position={[10.8, 0.45, 39.63]}>
        <boxGeometry args={[4.2, 0.9, 0.03]} />
        <meshStandardMaterial color="#1e3a8a" roughness={0.7} />
      </mesh>

      {/* West Wall (X = 8.7) */}
      <mesh position={[8.7, 1.6, 41.8]}>
        <boxGeometry args={[0.08, 3.2, 4.4]} />
        <meshStandardMaterial color="#fffdfa" roughness={0.85} />
      </mesh>
      {/* West Wainscot Trim Panel */}
      <mesh position={[8.73, 0.45, 41.8]}>
        <boxGeometry args={[0.03, 0.9, 4.4]} />
        <meshStandardMaterial color="#1e3a8a" roughness={0.7} />
      </mesh>

      {/* East Wall (X = 12.9) */}
      <mesh position={[12.9, 1.6, 41.8]}>
        <boxGeometry args={[0.08, 3.2, 4.4]} />
        <meshStandardMaterial color="#fffdfa" roughness={0.85} />
      </mesh>
      {/* East Wainscot Trim Panel */}
      <mesh position={[12.87, 0.45, 41.8]}>
        <boxGeometry args={[0.03, 0.9, 4.4]} />
        <meshStandardMaterial color="#1e3a8a" roughness={0.7} />
      </mesh>

      {/* South / Entrance Wall (Z = 44.0, with doorway opening) */}
      <mesh position={[9.45, 1.6, 44.0]}>
        <boxGeometry args={[1.5, 3.2, 0.08]} />
        <meshStandardMaterial color="#fffdfa" roughness={0.85} />
      </mesh>
      <mesh position={[9.45, 0.45, 43.97]}>
        <boxGeometry args={[1.5, 0.9, 0.03]} />
        <meshStandardMaterial color="#1e3a8a" roughness={0.7} />
      </mesh>

      <mesh position={[12.15, 1.6, 44.0]}>
        <boxGeometry args={[1.5, 3.2, 0.08]} />
        <meshStandardMaterial color="#fffdfa" roughness={0.85} />
      </mesh>
      <mesh position={[12.15, 0.45, 43.97]}>
        <boxGeometry args={[1.5, 0.9, 0.03]} />
        <meshStandardMaterial color="#1e3a8a" roughness={0.7} />
      </mesh>

      {/* Doorway Header Above Entrance */}
      <mesh position={[10.8, 2.7, 44.0]}>
        <boxGeometry args={[1.2, 1.0, 0.08]} />
        <meshStandardMaterial color="#fffdfa" roughness={0.85} />
      </mesh>

      {/* Entrance Door Frame (Dark Architectural Aluminium) */}
      <mesh position={[10.19, 1.1, 43.98]}>
        <boxGeometry args={[0.06, 2.2, 0.08]} />
        <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[11.41, 1.1, 43.98]}>
        <boxGeometry args={[0.06, 2.2, 0.08]} />
        <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[10.8, 2.21, 43.98]}>
        <boxGeometry args={[1.28, 0.06, 0.08]} />
        <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Glass Exit Doors (Open Inward) */}
      <mesh position={[10.5, 1.1, 43.85]} rotation={[0, 0.35, 0]}>
        <boxGeometry args={[0.55, 2.1, 0.04]} />
        <meshStandardMaterial color="#bae6fd" transparent opacity={0.4} roughness={0.1} />
      </mesh>
      <mesh position={[11.1, 1.1, 43.85]} rotation={[0, -0.35, 0]}>
        <boxGeometry args={[0.55, 2.1, 0.04]} />
        <meshStandardMaterial color="#bae6fd" transparent opacity={0.4} roughness={0.1} />
      </mesh>

      {/* Emergency Exit Sign Above Door */}
      <mesh position={[10.8, 2.4, 43.94]}>
        <boxGeometry args={[0.42, 0.16, 0.03]} />
        <meshStandardMaterial color="#15803d" emissive="#22c55e" emissiveIntensity={0.6} />
      </mesh>

      {/* ============================================================ */}
      {/* 4. MAIN STAGE / PRESENTATION AREA                            */}
      {/* ============================================================ */}
      {/* Raised Stage Platform (X: [9.3, 12.3], Z: [39.7, 40.6], H: 0.22m) */}
      <mesh position={[10.8, 0.11, 40.15]}>
        <boxGeometry args={[3.2, 0.22, 0.9]} />
        <meshStandardMaterial color="#6b4226" roughness={0.5} />
      </mesh>
      {/* Stage Front Gold/Dark Trim Strip */}
      <mesh position={[10.8, 0.11, 40.61]}>
        <boxGeometry args={[3.22, 0.22, 0.02]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Stage Access Step */}
      <mesh position={[10.8, 0.055, 40.72]}>
        <boxGeometry args={[1.2, 0.11, 0.2]} />
        <meshStandardMaterial color="#52321c" roughness={0.6} />
      </mesh>

      {/* Large Presentation Screen on Rear Wall */}
      <mesh position={[10.8, 1.85, 39.66]}>
        <boxGeometry args={[2.5, 1.45, 0.04]} />
        <meshStandardMaterial color="#0284c7" />
      </mesh>
      <mesh position={[10.8, 1.85, 39.69]}>
        <planeGeometry args={[2.4, 1.38]} />
        {presentationScreenTexture ? (
          <meshBasicMaterial map={presentationScreenTexture} />
        ) : (
          <meshStandardMaterial color="#0f172a" />
        )}
      </mesh>

      {/* Ceiling-Mounted Projector */}
      <group position={[10.8, 2.85, 41.2]}>
        {/* Mount Pipe */}
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 0.4, 8]} />
          <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Projector Body */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.34, 0.12, 0.28]} />
          <meshStandardMaterial color="#ffffff" roughness={0.3} />
        </mesh>
        {/* Projector Lens (aimed forward at screen) */}
        <mesh position={[0, -0.02, -0.15]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.04, 12]} />
          <meshStandardMaterial color="#0284c7" emissive="#38bdf8" emissiveIntensity={0.6} />
        </mesh>
      </group>

      {/* Presentation Podium (Left of Center Stage) */}
      <group position={[9.9, 0.22, 40.2]}>
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[0.5, 1.0, 0.4]} />
          <meshStandardMaterial color="#451a03" roughness={0.6} />
        </mesh>
        {/* Slanted Top Plate */}
        <mesh position={[0, 1.02, 0]} rotation={[0.2, 0, 0]}>
          <boxGeometry args={[0.56, 0.04, 0.44]} />
          <meshStandardMaterial color="#291102" roughness={0.5} />
        </mesh>
        {/* Village Crest Badge on Podium Front */}
        <mesh position={[0, 0.72, 0.205]}>
          <cylinderGeometry args={[0.1, 0.1, 0.01, 16]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Gooseneck Microphone */}
        <mesh position={[0.12, 1.15, -0.04]} rotation={[0.4, 0, 0]}>
          <cylinderGeometry args={[0.008, 0.008, 0.28, 8]} />
          <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0.12, 1.28, 0.03]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshStandardMaterial color="#475569" roughness={0.4} />
        </mesh>
      </group>

      {/* Center Stage Mic Stand */}
      <group position={[10.8, 0.22, 40.3]}>
        <mesh position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.14, 0.14, 0.03, 12]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.55, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 1.1, 8]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, 1.12, 0]}>
          <cylinderGeometry args={[0.02, 0.015, 0.1, 8]} rotation={[0.3, 0, 0]} />
          <meshStandardMaterial color="#1e293b" roughness={0.4} />
        </mesh>
      </group>

      {/* Stage Speaker Boxes (Left & Right) */}
      <group position={[9.2, 0, 40.15]}>
        {/* Speaker Tripod */}
        <mesh position={[0, 0.45, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.9, 8]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Speaker Cabinet */}
        <mesh position={[0, 1.1, 0]}>
          <boxGeometry args={[0.3, 0.5, 0.26]} />
          <meshStandardMaterial color="#0f172a" roughness={0.4} />
        </mesh>
        {/* Speaker Cones */}
        <mesh position={[0, 1.2, 0.135]}>
          <cylinderGeometry args={[0.09, 0.09, 0.01, 12]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color="#334155" roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.98, 0.135]}>
          <cylinderGeometry args={[0.06, 0.06, 0.01, 12]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color="#334155" roughness={0.3} />
        </mesh>
      </group>

      <group position={[12.4, 0, 40.15]}>
        <mesh position={[0, 0.45, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.9, 8]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, 1.1, 0]}>
          <boxGeometry args={[0.3, 0.5, 0.26]} />
          <meshStandardMaterial color="#0f172a" roughness={0.4} />
        </mesh>
        <mesh position={[0, 1.2, 0.135]}>
          <cylinderGeometry args={[0.09, 0.09, 0.01, 12]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color="#334155" roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.98, 0.135]}>
          <cylinderGeometry args={[0.06, 0.06, 0.01, 12]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color="#334155" roughness={0.3} />
        </mesh>
      </group>

      {/* Presenter Laptop Table on Stage (Right side) */}
      <group position={[11.6, 0.22, 40.15]}>
        <mesh position={[0, 0.35, 0]}>
          <boxGeometry args={[0.7, 0.04, 0.4]} />
          <meshStandardMaterial color="#475569" roughness={0.5} />
        </mesh>
        {/* 4 Table Legs */}
        {[-0.3, 0.3].map((lx) =>
          [-0.16, 0.16].map((lz) => (
            <mesh key={`stagetab-${lx}-${lz}`} position={[lx, 0.17, lz]}>
              <cylinderGeometry args={[0.015, 0.015, 0.34, 8]} />
              <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
            </mesh>
          ))
        )}
        {/* Presenter Laptop */}
        <mesh position={[0, 0.38, 0]}>
          <boxGeometry args={[0.26, 0.015, 0.18]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.48, -0.09]} rotation={[-0.3, 0, 0]}>
          <boxGeometry args={[0.26, 0.18, 0.01]} />
          <meshStandardMaterial color="#0284c7" emissive="#38bdf8" emissiveIntensity={0.5} />
        </mesh>
      </group>

      {/* ============================================================ */}
      {/* 5. AUDIENCE SEATING (8 Lightweight Chairs Facing Stage)      */}
      {/* ============================================================ */}
      {/* Row 1 (Z = 41.1, left pair & right pair) */}
      <HallChair position={[9.5, 0, 41.1]} color="#1e3a8a" />
      <HallChair position={[10.0, 0, 41.1]} color="#1e3a8a" />
      <HallChair position={[11.6, 0, 41.1]} color="#1e3a8a" />
      <HallChair position={[12.1, 0, 41.1]} color="#1e3a8a" />

      {/* Row 2 (Z = 41.6, left pair & right pair) */}
      <HallChair position={[9.5, 0, 41.6]} color="#0f766e" />
      <HallChair position={[10.0, 0, 41.6]} color="#0f766e" />
      <HallChair position={[11.6, 0, 41.6]} color="#0f766e" />
      <HallChair position={[12.1, 0, 41.6]} color="#0f766e" />

      {/* ============================================================ */}
      {/* 6. COORDINATOR YURI NPC & REGISTRATION DESK                  */}
      {/* ============================================================ */}
      {/* Coordinator Yuri standing at [10.8, 0, 42.0] */}
      <CoordinatorYuri isTalking={isTalking} />

      {/* Registration Table (Right of Yuri, X: [11.3, 12.3], Z: 42.0) */}
      <group position={[11.8, 0, 42.0]}>
        <mesh position={[0, 0.44, 0]}>
          <boxGeometry args={[1.0, 0.04, 0.55]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.22, 0]}>
          <boxGeometry args={[0.96, 0.42, 0.5]} />
          <meshStandardMaterial color="#1e3a8a" roughness={0.6} />
        </mesh>
        {/* Name Tags Tray */}
        <mesh position={[-0.25, 0.47, 0.08]}>
          <boxGeometry args={[0.28, 0.02, 0.22]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.4} />
        </mesh>
        {/* Event Program Brochures Stack */}
        <mesh position={[0.15, 0.48, 0.08]}>
          <boxGeometry args={[0.22, 0.04, 0.28]} />
          <meshStandardMaterial color="#38bdf8" roughness={0.5} />
        </mesh>
        {/* Sign-in Guestbook */}
        <mesh position={[-0.05, 0.47, -0.1]}>
          <boxGeometry args={[0.24, 0.02, 0.18]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.6} />
        </mesh>
        {/* Pen Cup with Pens */}
        <mesh position={[0.35, 0.51, -0.1]}>
          <cylinderGeometry args={[0.035, 0.03, 0.1, 10]} />
          <meshStandardMaterial color="#334155" roughness={0.4} />
        </mesh>
        <mesh position={[0.35, 0.58, -0.1]} rotation={[0.1, 0, 0.1]}>
          <cylinderGeometry args={[0.005, 0.005, 0.12, 6]} />
          <meshStandardMaterial color="#e11d48" />
        </mesh>
      </group>

      {/* West Side Folding Table with Handouts */}
      <group position={[9.3, 0, 42.1]}>
        <mesh position={[0, 0.44, 0]}>
          <boxGeometry args={[0.9, 0.04, 0.5]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.3} />
        </mesh>
        {[-0.38, 0.38].map((lx) =>
          [-0.18, 0.18].map((lz) => (
            <mesh key={`sidetab-${lx}-${lz}`} position={[lx, 0.22, lz]}>
              <cylinderGeometry args={[0.016, 0.014, 0.44, 8]} />
              <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
            </mesh>
          ))
        )}
        {/* Community Questionnaires Stack */}
        <mesh position={[-0.15, 0.48, 0]}>
          <boxGeometry args={[0.24, 0.03, 0.32]} />
          <meshStandardMaterial color="#fbbf24" roughness={0.5} />
        </mesh>
        <mesh position={[0.2, 0.48, 0]}>
          <boxGeometry args={[0.22, 0.03, 0.28]} />
          <meshStandardMaterial color="#34d399" roughness={0.5} />
        </mesh>
      </group>

      {/* ============================================================ */}
      {/* 7. STORAGE AREA (Cabinets, Stacked Chairs, Bins, Mats)       */}
      {/* ============================================================ */}
      {/* Storage Cabinet along West Wall */}
      <group position={[8.95, 0, 43.1]}>
        <mesh position={[0, 0.9, 0]}>
          <boxGeometry args={[0.35, 1.8, 0.9]} />
          <meshStandardMaterial color="#475569" roughness={0.5} />
        </mesh>
        {/* Handles */}
        <mesh position={[0.18, 0.9, -0.1]}>
          <cylinderGeometry args={[0.01, 0.01, 0.14, 6]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0.18, 0.9, 0.1]}>
          <cylinderGeometry args={[0.01, 0.01, 0.14, 6]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>

      {/* Folded Chairs Stacked Beside Cabinet */}
      <group position={[8.95, 0, 42.4]}>
        {[0, 0.06, 0.12, 0.18].map((off, idx) => (
          <mesh key={`folded-chair-${idx}`} position={[0, 0.3 + off, 0]} rotation={[0.1, 0, 0.1]}>
            <boxGeometry args={[0.32, 0.04, 0.36]} />
            <meshStandardMaterial color="#1e3a8a" roughness={0.5} />
          </mesh>
        ))}
      </group>

      {/* Storage Bins & Event Equipment Boxes */}
      <group position={[8.95, 0, 43.7]}>
        <mesh position={[0, 0.16, 0]}>
          <boxGeometry args={[0.32, 0.32, 0.36]} />
          <meshStandardMaterial color="#0284c7" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.44, 0]}>
          <boxGeometry args={[0.28, 0.24, 0.32]} />
          <meshStandardMaterial color="#fbbf24" roughness={0.4} />
        </mesh>
      </group>

      {/* ============================================================ */}
      {/* 8. NOTICE BOARDS & SCHEDULE (Canvas Textures)                */}
      {/* ============================================================ */}
      {/* High-Resolution Community Events Board on East Wall */}
      <mesh position={[12.85, 1.6, 41.5]}>
        <boxGeometry args={[0.03, 1.25, 2.3]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh position={[12.83, 1.6, 41.5]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[2.24, 1.18]} />
        {noticeBoardTexture ? (
          <meshBasicMaterial map={noticeBoardTexture} />
        ) : (
          <meshStandardMaterial color="#ffffff" />
        )}
      </mesh>

      {/* Weekly Schedule Board on West Wall */}
      <mesh position={[8.75, 1.6, 41.4]}>
        <boxGeometry args={[0.03, 1.25, 1.25]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh position={[8.77, 1.6, 41.4]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[1.2, 1.2]} />
        {scheduleBoardTexture ? (
          <meshBasicMaterial map={scheduleBoardTexture} />
        ) : (
          <meshStandardMaterial color="#1e293b" />
        )}
      </mesh>

      {/* ============================================================ */}
      {/* 9. AMENITIES (Dispenser, Trash, Clock, Plants, Bilingual)    */}
      {/* ============================================================ */}
      {/* Modern Water Dispenser on East Wall */}
      <group position={[12.6, 0, 43.1]}>
        {/* Main Dispenser Base */}
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[0.34, 1.0, 0.34]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.3} />
        </mesh>
        {/* Dispenser Nook */}
        <mesh position={[-0.14, 0.65, 0]}>
          <boxGeometry args={[0.07, 0.22, 0.22]} />
          <meshStandardMaterial color="#0f172a" roughness={0.2} />
        </mesh>
        {/* Blue Water Bottle on Top */}
        <mesh position={[0, 1.16, 0]}>
          <cylinderGeometry args={[0.13, 0.13, 0.34, 12]} />
          <meshStandardMaterial color="#0284c7" transparent opacity={0.7} roughness={0.1} />
        </mesh>
        {/* Paper Cup Tube Dispenser */}
        <mesh position={[0, 0.75, 0.2]}>
          <cylinderGeometry args={[0.035, 0.035, 0.4, 8]} />
          <meshStandardMaterial color="#cbd5e1" transparent opacity={0.6} roughness={0.2} />
        </mesh>
      </group>

      {/* Dual Recycling / Trash Sorting Bins */}
      <group position={[12.6, 0, 42.5]}>
        <mesh position={[0, 0.3, -0.15]}>
          <boxGeometry args={[0.3, 0.6, 0.25]} />
          <meshStandardMaterial color="#0284c7" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.3, 0.15]}>
          <boxGeometry args={[0.3, 0.6, 0.25]} />
          <meshStandardMaterial color="#059669" roughness={0.5} />
        </mesh>
        {/* Bin Lids */}
        <mesh position={[0, 0.62, -0.15]}>
          <boxGeometry args={[0.32, 0.04, 0.27]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        <mesh position={[0, 0.62, 0.15]}>
          <boxGeometry args={[0.32, 0.04, 0.27]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
      </group>

      {/* Wall Clock Above Screen on Rear Wall */}
      <group position={[10.8, 2.75, 39.65]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.02, 20]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.2} />
        </mesh>
        {/* Dark Rim */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.2, 0.015, 8, 24]} />
          <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Clock Hands */}
        <mesh position={[0, 0.05, 0.013]}>
          <boxGeometry args={[0.012, 0.1, 0.005]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <mesh position={[0.04, 0, 0.013]}>
          <boxGeometry args={[0.08, 0.012, 0.005]} />
          <meshStandardMaterial color="#e11d48" />
        </mesh>
      </group>

      {/* Two Decorative Potted Plants */}
      <HallPlant position={[12.5, 0, 43.6]} />
      <HallPlant position={[9.1, 0, 40.0]} />

      {/* ============================================================ */}
      {/* 10. BILINGUAL SIGNAGE                                        */}
      {/* ============================================================ */}
      {/* Main Bilingual Sign Above Entrance Doors Inside */}
      {mainSignTexture && (
        <group position={[10.8, 2.7, 43.92]}>
          <mesh>
            <boxGeometry args={[1.8, 0.54, 0.02]} />
            <meshStandardMaterial color="#1e293b" roughness={0.3} />
          </mesh>
          <mesh position={[0, 0, -0.012]} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[1.76, 0.5]} />
            <meshBasicMaterial map={mainSignTexture} />
          </mesh>
        </group>
      )}

      {/* Secondary Sign / Directional Plaque (West Wall near Door) */}
      {secondarySignTexture && (
        <group position={[8.75, 2.2, 42.6]} rotation={[0, Math.PI / 2, 0]}>
          <mesh>
            <boxGeometry args={[1.1, 0.5, 0.02]} />
            <meshStandardMaterial color="#0f172a" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0, 0.012]}>
            <planeGeometry args={[1.06, 0.46]} />
            <meshBasicMaterial map={secondarySignTexture} />
          </mesh>
        </group>
      )}
    </group>
  );
}

export default MultiPurposeHall;

