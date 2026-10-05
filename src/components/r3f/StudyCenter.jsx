import React, { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

/**
 * Stylized low-poly Tutor Daniel
 * Warm, friendly, supportive tutor at the village study center.
 * Dressed in an indigo knit pullover, collared shirt, dark grey slacks,
 * brown leather shoes, stylish spectacles, and a gold "DANIEL" name badge.
 * Subtly animated with gentle breathing, small head movements, and conversational gestures.
 */
function TutorDaniel({ isTalking = false }) {
  const headRef = useRef();
  const leftArmRef = useRef();
  const rightArmRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (headRef.current) {
      headRef.current.position.y = 1.38 + Math.sin(t * 2) * 0.005;
      if (isTalking) {
        headRef.current.rotation.y = Math.sin(t * 5.0) * 0.07;
        headRef.current.rotation.x = Math.sin(t * 6.8) * 0.04;
      } else {
        headRef.current.rotation.y = Math.sin(t * 0.75) * 0.03;
        headRef.current.rotation.x = 0;
      }
    }
    if (rightArmRef.current && isTalking) {
      rightArmRef.current.rotation.x = -0.35 + Math.sin(t * 5.8) * 0.14;
    }
    if (leftArmRef.current && isTalking) {
      leftArmRef.current.rotation.x = -0.35 - Math.sin(t * 5.8) * 0.12;
    }
  });

  return (
    <group position={[-7.5, 0, 35.2]}>
      {/* Lower Body / Trousers */}
      <mesh position={[-0.1, 0.45, 0]}>
        <cylinderGeometry args={[0.08, 0.09, 0.86, 12]} />
        <meshStandardMaterial color="#334155" roughness={0.7} />
      </mesh>
      <mesh position={[0.1, 0.45, 0]}>
        <cylinderGeometry args={[0.08, 0.09, 0.86, 12]} />
        <meshStandardMaterial color="#334155" roughness={0.7} />
      </mesh>

      {/* Brown Leather Shoes */}
      <mesh position={[-0.1, 0.04, 0.03]}>
        <boxGeometry args={[0.12, 0.08, 0.2]} />
        <meshStandardMaterial color="#543824" roughness={0.4} />
      </mesh>
      <mesh position={[0.1, 0.04, 0.03]}>
        <boxGeometry args={[0.12, 0.08, 0.2]} />
        <meshStandardMaterial color="#543824" roughness={0.4} />
      </mesh>

      {/* Torso / Indigo Knit Pullover */}
      <mesh position={[0, 1.1, 0]}>
        <boxGeometry args={[0.42, 0.5, 0.25]} />
        <meshStandardMaterial color="#312e81" roughness={0.7} />
      </mesh>

      {/* White Collared Shirt V-Neck Accent */}
      <mesh position={[0, 1.25, 0.115]}>
        <boxGeometry args={[0.12, 0.12, 0.03]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.4} />
      </mesh>

      {/* Gold Name Badge: DANIEL */}
      <mesh position={[0.13, 1.22, 0.13]}>
        <boxGeometry args={[0.08, 0.032, 0.015]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Left Arm */}
      <group position={[-0.25, 1.28, 0]}>
        <mesh position={[0, -0.22, 0]}>
          <cylinderGeometry args={[0.06, 0.065, 0.44, 10]} />
          <meshStandardMaterial color="#312e81" roughness={0.7} />
        </mesh>
        <mesh ref={leftArmRef} position={[0, -0.48, 0]}>
          <sphereGeometry args={[0.045, 10, 10]} />
          <meshStandardMaterial color="#f5d0b0" roughness={0.6} />
        </mesh>
      </group>

      {/* Right Arm */}
      <group position={[0.25, 1.28, 0]}>
        <mesh position={[0, -0.22, 0]}>
          <cylinderGeometry args={[0.06, 0.065, 0.44, 10]} />
          <meshStandardMaterial color="#312e81" roughness={0.7} />
        </mesh>
        <mesh ref={rightArmRef} position={[0, -0.48, 0]}>
          <sphereGeometry args={[0.045, 10, 10]} />
          <meshStandardMaterial color="#f5d0b0" roughness={0.6} />
        </mesh>
      </group>

      {/* Head Group */}
      <group ref={headRef} position={[0, 1.4, 0]}>
        {/* Neck */}
        <mesh position={[0, 0.03, 0]}>
          <cylinderGeometry args={[0.05, 0.06, 0.1, 10]} />
          <meshStandardMaterial color="#f5d0b0" roughness={0.6} />
        </mesh>
        {/* Head */}
        <mesh position={[0, 0.16, 0]}>
          <boxGeometry args={[0.2, 0.22, 0.2]} />
          <meshStandardMaterial color="#f5d0b0" roughness={0.6} />
        </mesh>
        {/* Styled Dark Brown Hair */}
        <mesh position={[0, 0.28, 0]}>
          <boxGeometry args={[0.22, 0.08, 0.22]} />
          <meshStandardMaterial color="#2d1b10" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.25, 0.08]}>
          <boxGeometry args={[0.2, 0.06, 0.06]} />
          <meshStandardMaterial color="#2d1b10" roughness={0.8} />
        </mesh>
        <mesh position={[-0.1, 0.18, 0]}>
          <boxGeometry args={[0.03, 0.16, 0.2]} />
          <meshStandardMaterial color="#2d1b10" roughness={0.8} />
        </mesh>
        <mesh position={[0.1, 0.18, 0]}>
          <boxGeometry args={[0.03, 0.16, 0.2]} />
          <meshStandardMaterial color="#2d1b10" roughness={0.8} />
        </mesh>

        {/* Eyes & Warm Expression */}
        <mesh position={[-0.05, 0.16, 0.102]}>
          <planeGeometry args={[0.024, 0.014]} />
          <meshBasicMaterial color="#0f172a" />
        </mesh>
        <mesh position={[0.05, 0.16, 0.102]}>
          <planeGeometry args={[0.024, 0.014]} />
          <meshBasicMaterial color="#0f172a" />
        </mesh>
        <mesh position={[0, 0.09, 0.102]}>
          <planeGeometry args={[0.045, 0.01]} />
          <meshBasicMaterial color="#b91c1c" />
        </mesh>

        {/* Modern Dark Glasses Frame */}
        <mesh position={[-0.05, 0.16, 0.11]}>
          <ringGeometry args={[0.022, 0.027, 12]} />
          <meshBasicMaterial color="#1e293b" />
        </mesh>
        <mesh position={[0.05, 0.16, 0.11]}>
          <ringGeometry args={[0.022, 0.027, 12]} />
          <meshBasicMaterial color="#1e293b" />
        </mesh>
        <mesh position={[0, 0.165, 0.11]}>
          <boxGeometry args={[0.04, 0.006, 0.005]} />
          <meshBasicMaterial color="#1e293b" />
        </mesh>
      </group>
    </group>
  );
}

/**
 * Reusable Individual Study Carrel (Korean "독서실" study booth)
 */
function StudyCarrel({ position }) {
  return (
    <group position={position}>
      {/* Desk Surface (Natural Oak) */}
      <mesh position={[0, 0.72, 0]}>
        <boxGeometry args={[0.9, 0.04, 0.55]} />
        <meshStandardMaterial color="#d4a373" roughness={0.7} />
      </mesh>
      {/* Back Privacy Partition */}
      <mesh position={[0, 1.05, -0.27]}>
        <boxGeometry args={[0.9, 0.65, 0.03]} />
        <meshStandardMaterial color="#4338ca" roughness={0.65} />
      </mesh>
      {/* Left Privacy Divider */}
      <mesh position={[-0.44, 1.05, 0]}>
        <boxGeometry args={[0.03, 0.65, 0.56]} />
        <meshStandardMaterial color="#4338ca" roughness={0.65} />
      </mesh>
      {/* Right Privacy Divider */}
      <mesh position={[0.44, 1.05, 0]}>
        <boxGeometry args={[0.03, 0.65, 0.56]} />
        <meshStandardMaterial color="#4338ca" roughness={0.65} />
      </mesh>

      {/* Overhead Shelf with LED Light Bar */}
      <mesh position={[0, 1.34, -0.15]}>
        <boxGeometry args={[0.85, 0.03, 0.24]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.5} />
      </mesh>
      <mesh position={[0, 1.32, -0.1]}>
        <boxGeometry args={[0.7, 0.015, 0.04]} />
        <meshStandardMaterial color="#fffbeb" emissive="#fef08a" emissiveIntensity={0.8} />
      </mesh>

      {/* Textbooks & Study Materials on Shelf */}
      <mesh position={[-0.25, 1.45, -0.15]}>
        <boxGeometry args={[0.15, 0.2, 0.18]} />
        <meshStandardMaterial color="#0284c7" roughness={0.5} />
      </mesh>
      <mesh position={[-0.1, 1.45, -0.15]}>
        <boxGeometry args={[0.12, 0.2, 0.18]} />
        <meshStandardMaterial color="#e11d48" roughness={0.5} />
      </mesh>

      {/* Desk Items: Open Notebook, Flashcards, Highlighter */}
      <mesh position={[-0.12, 0.745, 0.02]} rotation={[0, 0.04, 0]}>
        <boxGeometry args={[0.26, 0.012, 0.2]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.4} />
      </mesh>
      <mesh position={[0.18, 0.745, -0.05]} rotation={[0, -0.1, 0]}>
        <boxGeometry args={[0.14, 0.015, 0.1]} />
        <meshStandardMaterial color="#fef08a" roughness={0.5} />
      </mesh>
      <mesh position={[0.22, 0.745, 0.08]}>
        <boxGeometry args={[0.015, 0.01, 0.14]} />
        <meshBasicMaterial color="#a855f7" />
      </mesh>

      {/* Desk Metal Legs */}
      {[
        [-0.42, 0.35, -0.22],
        [0.42, 0.35, -0.22],
        [-0.42, 0.35, 0.22],
        [0.42, 0.35, 0.22]
      ].map((legPos, idx) => (
        <mesh key={`carrel-leg-${idx}`} position={legPos}>
          <cylinderGeometry args={[0.018, 0.018, 0.7, 8]} />
          <meshStandardMaterial color="#1e293b" roughness={0.5} />
        </mesh>
      ))}

      {/* Comfortable High-Back Mesh Study Chair */}
      <group position={[0, 0, 0.4]}>
        <mesh position={[0, 0.44, 0]}>
          <boxGeometry args={[0.42, 0.05, 0.4]} />
          <meshStandardMaterial color="#1e293b" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.75, 0.18]}>
          <boxGeometry args={[0.38, 0.52, 0.03]} />
          <meshStandardMaterial color="#334155" roughness={0.8} />
        </mesh>
        {/* Chrome Central Post */}
        <mesh position={[0, 0.22, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 0.42, 8]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Star Base */}
        <mesh position={[0, 0.03, 0]}>
          <cylinderGeometry args={[0.24, 0.24, 0.03, 5]} />
          <meshStandardMaterial color="#1e293b" roughness={0.6} />
        </mesh>
      </group>
    </group>
  );
}

/**
 * Wall Clock with minimalist hour and minute hands
 */
function StudyWallClock({ position }) {
  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[0.22, 0.22, 0.04, 24]} />
        <meshStandardMaterial color="#1e293b" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0, 0.021]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.19, 24]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.04, 0.023]}>
        <boxGeometry args={[0.015, 0.09, 0.005]} />
        <meshBasicMaterial color="#0f172a" />
      </mesh>
      <mesh position={[0.05, 0, 0.023]} rotation={[0, 0, -Math.PI / 2]}>
        <boxGeometry args={[0.012, 0.12, 0.005]} />
        <meshBasicMaterial color="#0f172a" />
      </mesh>
      <mesh position={[0, 0, 0.025]}>
        <cylinderGeometry args={[0.015, 0.015, 0.01, 8]} />
        <meshBasicMaterial color="#4f46e5" />
      </mesh>
    </group>
  );
}

/**
 * Potted indoor classroom plant
 */
function StudyPlant({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.18, 0.14, 0.5, 12]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.48, 0]}>
        <cylinderGeometry args={[0.17, 0.17, 0.04, 12]} />
        <meshStandardMaterial color="#3e2723" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.7, 0]}>
        <sphereGeometry args={[0.24, 8, 8]} />
        <meshStandardMaterial color="#047857" roughness={0.8} />
      </mesh>
      <mesh position={[0.06, 0.86, 0]}>
        <sphereGeometry args={[0.18, 8, 8]} />
        <meshStandardMaterial color="#10b981" roughness={0.8} />
      </mesh>
    </group>
  );
}

/**
 * StudyCenter Interior Component
 * Renders ONLY when currentLocation === "StudyCenter".
 * Low-poly neighborhood study center with Tutor Daniel NPC,
 * consultation desk, private study carrels, study table, computer station,
 * organized bookshelves, schedule boards, and entrance/exit.
 */
export function StudyCenter({ isTalking = false, currentLocation = "outside" }) {
  const isInside = currentLocation === "StudyCenter";

  // Whiteboard Canvas Texture: Study Timetable & Daily Vocabulary
  const timetableTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 1024, 512);

    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 12;
    ctx.strokeRect(6, 6, 1012, 500);

    // Title Header
    ctx.fillStyle = "#3730a3";
    ctx.font = "bold 32px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("📋 STUDY CENTER TIMETABLE & VOCABULARY", 48, 64);

    ctx.fillStyle = "#6366f1";
    ctx.font = "bold 22px sans-serif";
    ctx.textAlign = "right";
    ctx.fillText("Self-Study & Tutoring Hours", 976, 64);

    // Header divider line
    ctx.strokeStyle = "#3730a3";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(48, 80);
    ctx.lineTo(976, 80);
    ctx.stroke();

    // Table / Schedule Sections
    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 24px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("Daily Schedule:", 48, 125);

    ctx.font = "22px sans-serif";
    ctx.fillStyle = "#334155";
    ctx.fillText("• 09:00 - 12:00 : Morning Self-Study & Listening Clinic", 60, 170);
    ctx.fillText("• 13:00 - 15:00 : English Speaking & Pronunciation Workshop", 60, 215);
    ctx.fillText("• 15:30 - 17:30 : Vocabulary Building & Exam Preparation", 60, 260);
    ctx.fillText("• 18:00 - 21:00 : Evening Quiet Study & Homework Support", 60, 305);

    // Highlighted Vocabulary Box
    ctx.fillStyle = "#e0e7ff";
    ctx.fillRect(48, 360, 928, 105);
    ctx.strokeStyle = "#6366f1";
    ctx.lineWidth = 2;
    ctx.strokeRect(48, 360, 928, 105);

    ctx.fillStyle = "#312e81";
    ctx.font = "bold 24px sans-serif";
    ctx.fillText("🌟 Key Vocabulary of the Day:", 70, 400);

    ctx.font = "21px sans-serif";
    ctx.fillStyle = "#4338ca";
    ctx.fillText("1. Consistency (꾸준함)  |  2. Fluency (유창성)  |  3. Vocabulary (어휘)", 70, 440);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);

  // Main Bilingual Wall Signboard ("VILLAGE STUDY CENTER" / "마을 학습센터")
  const mainSignTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, 512, 256);

    // Indigo accent stripe
    ctx.fillStyle = "#4f46e5";
    ctx.fillRect(0, 0, 512, 24);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 34px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("VILLAGE STUDY CENTER", 256, 100);

    ctx.fillStyle = "#a5b4fc";
    ctx.font = "bold 44px sans-serif";
    ctx.fillText("마을 학습센터", 256, 175);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "20px sans-serif";
    ctx.fillText("Education & Community District", 256, 222);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);

  // Secondary Classroom / Focus Signboard ("SELF STUDY & LANGUAGE PRACTICE" / "자율학습 & 언어연습")
  const secondarySignTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = "#1e1b4b";
    ctx.fillRect(0, 0, 512, 256);

    ctx.fillStyle = "#6366f1";
    ctx.fillRect(0, 0, 512, 20);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 28px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("SELF STUDY & LANGUAGE PRACTICE", 256, 95);

    ctx.fillStyle = "#c7d2fe";
    ctx.font = "bold 38px sans-serif";
    ctx.fillText("자율학습 & 언어연습", 256, 165);

    ctx.fillStyle = "#fef08a";
    ctx.font = "bold 22px sans-serif";
    ctx.fillText("Quiet Learning Zone", 256, 218);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);

  // Exam Preparation & Study Tips Poster
  const examPosterTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 384;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, 256, 384);
    ctx.fillStyle = "#4338ca";
    ctx.fillRect(0, 0, 256, 42);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 18px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("EXAM PREPARATION", 128, 28);

    ctx.font = "bold 15px sans-serif";
    ctx.fillStyle = "#312e81";
    ctx.fillText("5 Golden Study Habits", 128, 72);

    ctx.font = "13px sans-serif";
    ctx.fillStyle = "#334155";
    ctx.textAlign = "left";
    const tips = [
      "1. Study 30 mins every day",
      "2. Review new words weekly",
      "3. Speak aloud while reading",
      "4. Practice real dialogues",
      "5. Ask the tutor for guidance",
      "6. Stay curious and confident!"
    ];
    tips.forEach((tip, idx) => {
      ctx.fillText(tip, 18, 120 + idx * 38);
    });

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);

  if (!isInside) return null;

  return (
    <group>
      {/* ============================================================ */}
      {/* 1. STUDY LIGHTING (Max 2 Lightweight Lights, No Shadows)      */}
      {/* ============================================================ */}
      <ambientLight intensity={0.96} color="#f8fafc" />
      <pointLight position={[-7.5, 2.8, 36.0]} intensity={1.1} distance={9} color="#e0e7ff" />

      {/* ============================================================ */}
      {/* 2. FLOOR & CEILING                                           */}
      {/* ============================================================ */}
      {/* Light Hardwood Floor (X: [-9.9, -5.1], Z: [34.1, 37.9]) */}
      <mesh position={[-7.5, 0.01, 36.0]}>
        <boxGeometry args={[4.8, 0.02, 3.8]} />
        <meshStandardMaterial color="#dec29b" roughness={0.75} />
      </mesh>

      {/* Central Indigo Border Runner Rug */}
      <mesh position={[-7.5, 0.015, 36.0]}>
        <boxGeometry args={[1.3, 0.01, 3.0]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.9} />
      </mesh>

      {/* Entrance Welcome Mat */}
      <mesh position={[-7.5, 0.02, 37.25]}>
        <boxGeometry args={[1.2, 0.01, 0.8]} />
        <meshStandardMaterial color="#312e81" roughness={0.8} />
      </mesh>

      {/* Ceiling with Recessed Light Panels */}
      <mesh position={[-7.5, 3.2, 36.0]}>
        <boxGeometry args={[4.8, 0.05, 3.8]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.8} />
      </mesh>
      <mesh position={[-7.5, 3.18, 35.2]}>
        <boxGeometry args={[2.0, 0.02, 0.6]} />
        <meshStandardMaterial color="#ffffff" emissive="#e0e7ff" emissiveIntensity={0.85} />
      </mesh>
      <mesh position={[-7.5, 3.18, 36.8]}>
        <boxGeometry args={[2.0, 0.02, 0.6]} />
        <meshStandardMaterial color="#ffffff" emissive="#e0e7ff" emissiveIntensity={0.85} />
      </mesh>

      {/* ============================================================ */}
      {/* 3. FOUR WALLS                                                */}
      {/* ============================================================ */}
      {/* South Wall (Behind Tutor Daniel, Z = 34.1) */}
      <mesh position={[-7.5, 1.6, 34.1]}>
        <boxGeometry args={[4.8, 3.2, 0.08]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.85} />
      </mesh>
      {/* South Wainscot Panel */}
      <mesh position={[-7.5, 0.45, 34.13]}>
        <boxGeometry args={[4.8, 0.9, 0.03]} />
        <meshStandardMaterial color="#312e81" roughness={0.7} />
      </mesh>

      {/* West Wall (X = -9.9) */}
      <mesh position={[-9.9, 1.6, 36.0]}>
        <boxGeometry args={[0.08, 3.2, 3.8]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.85} />
      </mesh>
      {/* West Wainscot Panel */}
      <mesh position={[-9.87, 0.45, 36.0]}>
        <boxGeometry args={[0.03, 0.9, 3.8]} />
        <meshStandardMaterial color="#312e81" roughness={0.7} />
      </mesh>

      {/* East Wall (X = -5.1) */}
      <mesh position={[-5.1, 1.6, 36.0]}>
        <boxGeometry args={[0.08, 3.2, 3.8]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.85} />
      </mesh>
      {/* East Wainscot Panel */}
      <mesh position={[-5.13, 0.45, 36.0]}>
        <boxGeometry args={[0.03, 0.9, 3.8]} />
        <meshStandardMaterial color="#312e81" roughness={0.7} />
      </mesh>

      {/* North / Entrance Wall (Z = 37.9) */}
      <mesh position={[-8.95, 1.6, 37.9]}>
        <boxGeometry args={[1.9, 3.2, 0.08]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.85} />
      </mesh>
      <mesh position={[-6.05, 1.6, 37.9]}>
        <boxGeometry args={[1.9, 3.2, 0.08]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.85} />
      </mesh>
      {/* Lintel over Door */}
      <mesh position={[-7.5, 2.7, 37.9]}>
        <boxGeometry args={[1.0, 1.0, 0.08]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.85} />
      </mesh>

      {/* Glass Exit Door Frame */}
      <mesh position={[-7.5, 1.1, 37.9]}>
        <boxGeometry args={[1.0, 2.2, 0.07]} />
        <meshStandardMaterial color="#1e293b" roughness={0.6} />
      </mesh>
      {/* Glass Panes */}
      <mesh position={[-7.5, 1.1, 37.91]}>
        <boxGeometry args={[0.9, 2.1, 0.02]} />
        <meshStandardMaterial color="#e0e7ff" roughness={0.2} transparent opacity={0.6} />
      </mesh>
      {/* Door Handles */}
      <mesh position={[-7.55, 1.05, 37.85]}>
        <cylinderGeometry args={[0.012, 0.012, 0.4, 8]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[-7.45, 1.05, 37.85]}>
        <cylinderGeometry args={[0.012, 0.012, 0.4, 8]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Illuminated Green EXIT / 출구 Sign */}
      <mesh position={[-7.5, 2.45, 37.84]}>
        <boxGeometry args={[0.55, 0.18, 0.03]} />
        <meshStandardMaterial color="#15803d" emissive="#22c55e" emissiveIntensity={0.8} />
      </mesh>

      {/* ============================================================ */}
      {/* 4. WHITEBOARD & WALL CLOCK (South Wall)                      */}
      {/* ============================================================ */}
      {timetableTexture && (
        <group position={[-7.5, 1.7, 34.15]}>
          <mesh>
            <boxGeometry args={[3.04, 1.44, 0.03]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.6} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0, 0.016]}>
            <planeGeometry args={[3.0, 1.4]} />
            <meshBasicMaterial map={timetableTexture} />
          </mesh>
          {/* Marker Tray */}
          <mesh position={[0, -0.73, 0.04]}>
            <boxGeometry args={[2.4, 0.02, 0.08]} />
            <meshStandardMaterial color="#64748b" roughness={0.5} />
          </mesh>
        </group>
      )}

      {/* Wall Clock */}
      <StudyWallClock position={[-7.5, 2.65, 34.15]} />

      {/* ============================================================ */}
      {/* 5. BILINGUAL WALL SIGNAGE & EDUCATIONAL POSTERS              */}
      {/* ============================================================ */}
      {/* Main Bilingual Sign on East Wall ("VILLAGE STUDY CENTER" / "마을 학습센터") */}
      {mainSignTexture && (
        <group position={[-5.14, 2.0, 35.8]} rotation={[0, -Math.PI / 2, 0]}>
          <mesh>
            <boxGeometry args={[1.3, 0.65, 0.02]} />
            <meshStandardMaterial color="#0f172a" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0, 0.012]}>
            <planeGeometry args={[1.26, 0.61]} />
            <meshBasicMaterial map={mainSignTexture} />
          </mesh>
        </group>
      )}

      {/* Secondary Sign on West Wall ("SELF STUDY & LANGUAGE PRACTICE" / "자율학습 & 언어연습") */}
      {secondarySignTexture && (
        <group position={[-9.86, 2.0, 35.8]} rotation={[0, Math.PI / 2, 0]}>
          <mesh>
            <boxGeometry args={[1.3, 0.65, 0.02]} />
            <meshStandardMaterial color="#0f172a" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0, 0.012]}>
            <planeGeometry args={[1.26, 0.61]} />
            <meshBasicMaterial map={secondarySignTexture} />
          </mesh>
        </group>
      )}

      {/* Exam Prep & Study Tips Poster on East Wall */}
      {examPosterTexture && (
        <group position={[-5.14, 1.9, 36.8]} rotation={[0, -Math.PI / 2, 0]}>
          <mesh>
            <boxGeometry args={[0.8, 1.2, 0.02]} />
            <meshStandardMaterial color="#cbd5e1" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0, 0.012]}>
            <planeGeometry args={[0.76, 1.16]} />
            <meshBasicMaterial map={examPosterTexture} />
          </mesh>
        </group>
      )}

      {/* ============================================================ */}
      {/* 6. TUTOR DANIEL NPC & CONSULTATION WORKSTATION              */}
      {/* ============================================================ */}
      {/* Tutor Daniel NPC */}
      <TutorDaniel isTalking={isTalking} />

      {/* Tutor Consultation Desk (In front of Daniel at Z = 35.7) */}
      <group position={[-7.5, 0, 35.7]}>
        <mesh position={[0, 0.74, 0]}>
          <boxGeometry args={[1.8, 0.05, 0.7]} />
          <meshStandardMaterial color="#b45309" roughness={0.65} />
        </mesh>
        <mesh position={[0, 0.38, 0.3]}>
          <boxGeometry args={[1.65, 0.65, 0.02]} />
          <meshStandardMaterial color="#78350f" roughness={0.7} />
        </mesh>
        <mesh position={[-0.82, 0.37, 0]}>
          <boxGeometry args={[0.04, 0.72, 0.65]} />
          <meshStandardMaterial color="#78350f" roughness={0.7} />
        </mesh>
        <mesh position={[0.82, 0.37, 0]}>
          <boxGeometry args={[0.04, 0.72, 0.65]} />
          <meshStandardMaterial color="#78350f" roughness={0.7} />
        </mesh>

        {/* Laptop on Consultation Desk */}
        <group position={[-0.2, 0.765, 0.04]}>
          <mesh>
            <boxGeometry args={[0.32, 0.015, 0.22]} />
            <meshStandardMaterial color="#64748b" metalness={0.6} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.009, 0.02]}>
            <boxGeometry args={[0.28, 0.004, 0.14]} />
            <meshStandardMaterial color="#0f172a" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.11, -0.09]} rotation={[0.3, 0, 0]}>
            <boxGeometry args={[0.32, 0.22, 0.01]} />
            <meshStandardMaterial color="#475569" metalness={0.5} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.11, -0.084]} rotation={[0.3, 0, 0]}>
            <planeGeometry args={[0.29, 0.19]} />
            <meshStandardMaterial color="#818cf8" emissive="#818cf8" emissiveIntensity={0.6} />
          </mesh>
        </group>

        {/* Small Desktop Laser Printer */}
        <group position={[0.55, 0.765, 0.05]}>
          <mesh position={[0, 0.1, 0]}>
            <boxGeometry args={[0.35, 0.2, 0.28]} />
            <meshStandardMaterial color="#e2e8f0" roughness={0.4} />
          </mesh>
          {/* Paper Output Tray */}
          <mesh position={[0, 0.14, 0.15]}>
            <boxGeometry args={[0.26, 0.015, 0.12]} />
            <meshStandardMaterial color="#94a3b8" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.15, 0.14]}>
            <boxGeometry args={[0.22, 0.005, 0.1]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>

        {/* Vocabulary Flashcards & Notes */}
        <group position={[-0.6, 0.765, -0.06]}>
          <mesh position={[0, 0.015, 0]} rotation={[0, 0.1, 0]}>
            <boxGeometry args={[0.16, 0.03, 0.1]} />
            <meshStandardMaterial color="#fef08a" roughness={0.4} />
          </mesh>
          <mesh position={[0.08, 0.015, 0.1]} rotation={[0, -0.15, 0]}>
            <boxGeometry args={[0.16, 0.02, 0.1]} />
            <meshStandardMaterial color="#67e8f9" roughness={0.4} />
          </mesh>
        </group>

        {/* Pen Holder */}
        <mesh position={[0.18, 0.82, -0.15]}>
          <cylinderGeometry args={[0.04, 0.035, 0.12, 10]} />
          <meshStandardMaterial color="#1e293b" roughness={0.5} />
        </mesh>
      </group>

      {/* Tutor Chair */}
      <group position={[-7.5, 0, 34.8]}>
        <mesh position={[0, 0.46, 0]}>
          <boxGeometry args={[0.48, 0.05, 0.44]} />
          <meshStandardMaterial color="#1e293b" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.76, -0.19]}>
          <boxGeometry args={[0.44, 0.55, 0.04]} />
          <meshStandardMaterial color="#1e293b" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.24, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 0.45, 8]} />
          <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>

      {/* ============================================================ */}
      {/* 7. INDIVIDUAL STUDY CARRELS (West Zone)                      */}
      {/* ============================================================ */}
      {/* Study Booth 1 */}
      <StudyCarrel position={[-8.9, 0, 36.4]} label="BOOTH 1" />
      {/* Study Booth 2 */}
      <StudyCarrel position={[-8.9, 0, 37.3]} label="BOOTH 2" />

      {/* ============================================================ */}
      {/* 8. COLLABORATIVE STUDY TABLE (East Zone)                     */}
      {/* ============================================================ */}
      <group position={[-6.0, 0, 36.6]}>
        {/* Tabletop */}
        <mesh position={[0, 0.72, 0]}>
          <boxGeometry args={[1.2, 0.04, 0.7]} />
          <meshStandardMaterial color="#d4a373" roughness={0.7} />
        </mesh>
        {/* Legs */}
        {[
          [-0.52, 0.35, -0.28],
          [0.52, 0.35, -0.28],
          [-0.52, 0.35, 0.28],
          [0.52, 0.35, 0.28]
        ].map((legPos, idx) => (
          <mesh key={`collab-leg-${idx}`} position={legPos}>
            <cylinderGeometry args={[0.02, 0.02, 0.7, 8]} />
            <meshStandardMaterial color="#334155" roughness={0.5} />
          </mesh>
        ))}
        {/* Table Study Materials: Books, Open Notebook, Flashcards */}
        <mesh position={[-0.25, 0.745, 0]}>
          <boxGeometry args={[0.28, 0.02, 0.22]} />
          <meshStandardMaterial color="#4f46e5" roughness={0.4} />
        </mesh>
        <mesh position={[0.2, 0.745, -0.05]} rotation={[0, 0.1, 0]}>
          <boxGeometry args={[0.25, 0.015, 0.18]} />
          <meshStandardMaterial color="#10b981" roughness={0.4} />
        </mesh>
        <mesh position={[0.2, 0.745, 0.12]}>
          <boxGeometry args={[0.15, 0.01, 0.1]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.4} />
        </mesh>

        {/* Chair 1 (Front Facing Table) */}
        <group position={[0, 0, 0.45]}>
          <mesh position={[0, 0.44, 0]}>
            <boxGeometry args={[0.4, 0.04, 0.38]} />
            <meshStandardMaterial color="#334155" roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.72, 0.17]}>
            <boxGeometry args={[0.36, 0.24, 0.03]} />
            <meshStandardMaterial color="#334155" roughness={0.7} />
          </mesh>
          {[
            [-0.17, 0.22, -0.15],
            [0.17, 0.22, -0.15],
            [-0.17, 0.22, 0.15],
            [0.17, 0.22, 0.15]
          ].map((cLeg, idx) => (
            <mesh key={`collab-chair1-leg-${idx}`} position={cLeg}>
              <cylinderGeometry args={[0.015, 0.015, 0.44, 8]} />
              <meshStandardMaterial color="#1e293b" roughness={0.5} />
            </mesh>
          ))}
        </group>
      </group>

      {/* ============================================================ */}
      {/* 9. COMPUTER STATION & PRINTER (East Wall Zone)               */}
      {/* ============================================================ */}
      <group position={[-5.9, 0, 35.1]}>
        {/* Computer Table */}
        <mesh position={[0, 0.72, 0]}>
          <boxGeometry args={[0.9, 0.04, 0.55]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.5} />
        </mesh>
        {[
          [-0.4, 0.35, -0.22],
          [0.4, 0.35, -0.22],
          [-0.4, 0.35, 0.22],
          [0.4, 0.35, 0.22]
        ].map((legPos, idx) => (
          <mesh key={`pc-leg-${idx}`} position={legPos}>
            <cylinderGeometry args={[0.02, 0.02, 0.7, 8]} />
            <meshStandardMaterial color="#1e293b" roughness={0.5} />
          </mesh>
        ))}
        {/* Desktop Monitor */}
        <group position={[0, 0.74, -0.1]}>
          <mesh position={[0, 0.015, 0]}>
            <boxGeometry args={[0.18, 0.02, 0.14]} />
            <meshStandardMaterial color="#0f172a" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.12, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.2, 8]} />
            <meshStandardMaterial color="#334155" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.24, 0]}>
            <boxGeometry args={[0.42, 0.28, 0.02]} />
            <meshStandardMaterial color="#0f172a" roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.24, 0.012]}>
            <planeGeometry args={[0.39, 0.25]} />
            <meshStandardMaterial color="#6366f1" emissive="#6366f1" emissiveIntensity={0.5} />
          </mesh>
        </group>
        {/* Keyboard & Mouse */}
        <mesh position={[0, 0.745, 0.12]}>
          <boxGeometry args={[0.34, 0.01, 0.12]} />
          <meshStandardMaterial color="#0f172a" roughness={0.6} />
        </mesh>
        <mesh position={[0.22, 0.745, 0.12]}>
          <boxGeometry args={[0.05, 0.015, 0.08]} />
          <meshStandardMaterial color="#1e293b" roughness={0.5} />
        </mesh>
      </group>

      {/* ============================================================ */}
      {/* 10. BOOKSHELF & STORAGE CABINET                              */}
      {/* ============================================================ */}
      {/* Tall Bookcase with English & Korean Dictionaries (West Wall) */}
      <group position={[-9.65, 0, 35.0]}>
        <mesh position={[0, 0.8, 0]}>
          <boxGeometry args={[0.36, 1.6, 1.0]} />
          <meshStandardMaterial color="#b45309" roughness={0.7} />
        </mesh>
        <mesh position={[0.02, 0.8, 0]}>
          <boxGeometry args={[0.34, 1.5, 0.92]} />
          <meshStandardMaterial color="#78350f" roughness={0.8} />
        </mesh>
        {[0.35, 0.75, 1.15].map((yShelf, idx) => (
          <mesh key={`study-shelf-${idx}`} position={[0.02, yShelf, 0]}>
            <boxGeometry args={[0.33, 0.03, 0.92]} />
            <meshStandardMaterial color="#92400e" roughness={0.7} />
          </mesh>
        ))}
        {/* Books on Shelves */}
        {[
          { pos: [0.02, 0.52, -0.3], color: "#4f46e5", w: 0.18 },
          { pos: [0.02, 0.52, -0.1], color: "#06b6d4", w: 0.16 },
          { pos: [0.02, 0.52, 0.12], color: "#e11d48", w: 0.22 },
          { pos: [0.02, 0.52, 0.32], color: "#16a34a", w: 0.14 },
          { pos: [0.02, 0.92, -0.25], color: "#f59e0b", w: 0.2 },
          { pos: [0.02, 0.92, 0.0], color: "#8b5cf6", w: 0.24 },
          { pos: [0.02, 0.92, 0.25], color: "#3b82f6", w: 0.18 }
        ].map((book, idx) => (
          <mesh key={`study-book-${idx}`} position={book.pos}>
            <boxGeometry args={[0.22, 0.28, book.w]} />
            <meshStandardMaterial color={book.color} roughness={0.5} />
          </mesh>
        ))}
      </group>

      {/* Storage Cabinet on East Wall */}
      <group position={[-5.35, 0, 34.4]}>
        <mesh position={[0, 0.55, 0]}>
          <boxGeometry args={[0.36, 1.1, 0.8]} />
          <meshStandardMaterial color="#64748b" roughness={0.5} />
        </mesh>
        {/* Handles */}
        <mesh position={[-0.19, 0.6, -0.04]}>
          <cylinderGeometry args={[0.008, 0.008, 0.1, 6]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[-0.19, 0.6, 0.04]}>
          <cylinderGeometry args={[0.008, 0.008, 0.1, 6]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>

      {/* ============================================================ */}
      {/* 11. WAITING / RECEPTION BENCH & PLANTS                       */}
      {/* ============================================================ */}
      {/* Upholstered Waiting Bench Near Entrance */}
      <group position={[-5.8, 0, 37.4]}>
        <mesh position={[0, 0.24, 0]}>
          <boxGeometry args={[0.9, 0.08, 0.44]} />
          <meshStandardMaterial color="#312e81" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.45, 0.2]}>
          <boxGeometry args={[0.9, 0.35, 0.05]} />
          <meshStandardMaterial color="#312e81" roughness={0.8} />
        </mesh>
        {/* Wooden Bench Base */}
        <mesh position={[0, 0.1, 0]}>
          <boxGeometry args={[0.85, 0.2, 0.4]} />
          <meshStandardMaterial color="#b45309" roughness={0.7} />
        </mesh>
      </group>

      {/* Potted Plants in Corners */}
      <StudyPlant position={[-9.5, 0, 34.45]} />
      <StudyPlant position={[-5.5, 0, 34.45]} />
    </group>
  );
}
