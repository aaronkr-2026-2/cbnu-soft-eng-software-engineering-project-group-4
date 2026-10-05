import React, { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

/**
 * Stylized low-poly Teacher Olivia
 * Approachable, friendly English teacher at the village language school.
 * Styled with a teal cardigan, ivory blouse, smart dark trousers, leather flats,
 * spectacles, and a gold "OLIVIA" name badge.
 * Subtly animated with idle breathing, gentle head movement, and conversational arm gestures.
 */
function TeacherOlivia({ isTalking = false }) {
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
    <group position={[-14.4, 0, 35.0]}>
      {/* Lower Body / Smart Trousers */}
      <mesh position={[-0.1, 0.44, 0]}>
        <cylinderGeometry args={[0.075, 0.085, 0.86, 12]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} />
      </mesh>
      <mesh position={[0.1, 0.44, 0]}>
        <cylinderGeometry args={[0.075, 0.085, 0.86, 12]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} />
      </mesh>

      {/* Elegant Dark Leather Shoes */}
      <mesh position={[-0.1, 0.04, 0.03]}>
        <boxGeometry args={[0.11, 0.08, 0.18]} />
        <meshStandardMaterial color="#0f172a" roughness={0.4} />
      </mesh>
      <mesh position={[0.1, 0.04, 0.03]}>
        <boxGeometry args={[0.11, 0.08, 0.18]} />
        <meshStandardMaterial color="#0f172a" roughness={0.4} />
      </mesh>

      {/* Torso / Teal Teacher Cardigan */}
      <mesh position={[0, 1.1, 0]}>
        <boxGeometry args={[0.4, 0.48, 0.24]} />
        <meshStandardMaterial color="#0d9488" roughness={0.65} />
      </mesh>

      {/* Ivory Silk Blouse Inner V-Neck */}
      <mesh position={[0, 1.22, 0.11]}>
        <boxGeometry args={[0.14, 0.14, 0.03]} />
        <meshStandardMaterial color="#fef3c7" roughness={0.4} />
      </mesh>

      {/* Cardigan Buttons */}
      {[1.02, 1.1, 1.18].map((yBtn, idx) => (
        <mesh key={`btn-${idx}`} position={[0, yBtn, 0.125]}>
          <boxGeometry args={[0.02, 0.02, 0.01]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.3} />
        </mesh>
      ))}

      {/* Gold Name Badge: OLIVIA */}
      <mesh position={[0.12, 1.2, 0.125]}>
        <boxGeometry args={[0.08, 0.032, 0.015]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Left Arm */}
      <group position={[-0.24, 1.26, 0]}>
        <mesh position={[0, -0.22, 0]}>
          <cylinderGeometry args={[0.055, 0.06, 0.42, 10]} />
          <meshStandardMaterial color="#0d9488" roughness={0.65} />
        </mesh>
        <mesh ref={leftArmRef} position={[0, -0.46, 0]}>
          <sphereGeometry args={[0.045, 10, 10]} />
          <meshStandardMaterial color="#f5d0b0" roughness={0.6} />
        </mesh>
      </group>

      {/* Right Arm */}
      <group position={[0.24, 1.26, 0]}>
        <mesh position={[0, -0.22, 0]}>
          <cylinderGeometry args={[0.055, 0.06, 0.42, 10]} />
          <meshStandardMaterial color="#0d9488" roughness={0.65} />
        </mesh>
        <mesh ref={rightArmRef} position={[0, -0.46, 0]}>
          <sphereGeometry args={[0.045, 10, 10]} />
          <meshStandardMaterial color="#f5d0b0" roughness={0.6} />
        </mesh>
      </group>

      {/* Head Group */}
      <group ref={headRef} position={[0, 1.38, 0]}>
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
        {/* Warm Auburn Hair Bob with Side Bangs */}
        <mesh position={[0, 0.27, -0.01]}>
          <boxGeometry args={[0.23, 0.09, 0.22]} />
          <meshStandardMaterial color="#7c2d12" roughness={0.8} />
        </mesh>
        <mesh position={[-0.11, 0.16, 0]}>
          <boxGeometry args={[0.04, 0.2, 0.2]} />
          <meshStandardMaterial color="#7c2d12" roughness={0.8} />
        </mesh>
        <mesh position={[0.11, 0.16, 0]}>
          <boxGeometry args={[0.04, 0.2, 0.2]} />
          <meshStandardMaterial color="#7c2d12" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.16, -0.1]}>
          <boxGeometry args={[0.22, 0.2, 0.04]} />
          <meshStandardMaterial color="#7c2d12" roughness={0.8} />
        </mesh>

        {/* Eyes & Friendly Smile */}
        <mesh position={[-0.05, 0.16, 0.102]}>
          <planeGeometry args={[0.025, 0.015]} />
          <meshBasicMaterial color="#1e293b" />
        </mesh>
        <mesh position={[0.05, 0.16, 0.102]}>
          <planeGeometry args={[0.025, 0.015]} />
          <meshBasicMaterial color="#1e293b" />
        </mesh>
        <mesh position={[0, 0.09, 0.102]}>
          <planeGeometry args={[0.05, 0.012]} />
          <meshBasicMaterial color="#e11d48" />
        </mesh>

        {/* Teacher Glasses Frame */}
        <mesh position={[-0.05, 0.16, 0.11]}>
          <ringGeometry args={[0.022, 0.027, 12]} />
          <meshBasicMaterial color="#0f172a" />
        </mesh>
        <mesh position={[0.05, 0.16, 0.11]}>
          <ringGeometry args={[0.022, 0.027, 12]} />
          <meshBasicMaterial color="#0f172a" />
        </mesh>
        <mesh position={[0, 0.165, 0.11]}>
          <boxGeometry args={[0.04, 0.006, 0.005]} />
          <meshBasicMaterial color="#0f172a" />
        </mesh>
      </group>
    </group>
  );
}

/**
 * Reusable low-poly Student Desk and Chair set
 */
function StudentDeskSet({ position }) {
  return (
    <group position={position}>
      {/* Desk Top (Natural Wood) */}
      <mesh position={[0, 0.72, 0]}>
        <boxGeometry args={[1.0, 0.04, 0.55]} />
        <meshStandardMaterial color="#d4a373" roughness={0.7} />
      </mesh>
      {/* Book Basket Under Desk */}
      <mesh position={[0, 0.62, 0]}>
        <boxGeometry args={[0.85, 0.12, 0.45]} />
        <meshStandardMaterial color="#64748b" roughness={0.6} />
      </mesh>
      {/* Desk Metal Legs */}
      {[
        [-0.44, 0.35, -0.22],
        [0.44, 0.35, -0.22],
        [-0.44, 0.35, 0.22],
        [0.44, 0.35, 0.22]
      ].map((legPos, idx) => (
        <mesh key={`desk-leg-${idx}`} position={legPos}>
          <cylinderGeometry args={[0.018, 0.018, 0.7, 8]} />
          <meshStandardMaterial color="#334155" roughness={0.5} />
        </mesh>
      ))}

      {/* Student Notebook & Pencil */}
      <mesh position={[-0.15, 0.745, 0.02]} rotation={[0, 0.05, 0]}>
        <boxGeometry args={[0.26, 0.01, 0.2]} />
        <meshStandardMaterial color="#38bdf8" roughness={0.4} />
      </mesh>
      <mesh position={[0.15, 0.745, -0.05]}>
        <boxGeometry args={[0.012, 0.008, 0.18]} />
        <meshStandardMaterial color="#eab308" roughness={0.4} />
      </mesh>

      {/* Matching Student Chair (placed behind desk) */}
      <group position={[0, 0, 0.38]}>
        {/* Chair Seat */}
        <mesh position={[0, 0.44, 0]}>
          <boxGeometry args={[0.42, 0.04, 0.4]} />
          <meshStandardMaterial color="#475569" roughness={0.7} />
        </mesh>
        {/* Chair Backrest */}
        <mesh position={[0, 0.72, 0.18]}>
          <boxGeometry args={[0.38, 0.24, 0.03]} />
          <meshStandardMaterial color="#475569" roughness={0.7} />
        </mesh>
        {/* Chair Frame Support */}
        <mesh position={[0, 0.58, 0.18]}>
          <boxGeometry args={[0.24, 0.12, 0.02]} />
          <meshStandardMaterial color="#1e293b" roughness={0.5} />
        </mesh>
        {/* Chair Legs */}
        {[
          [-0.18, 0.22, -0.16],
          [0.18, 0.22, -0.16],
          [-0.18, 0.22, 0.16],
          [0.18, 0.22, 0.16]
        ].map((legPos, idx) => (
          <mesh key={`chair-leg-${idx}`} position={legPos}>
            <cylinderGeometry args={[0.015, 0.015, 0.44, 8]} />
            <meshStandardMaterial color="#1e293b" roughness={0.5} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/**
 * Potted indoor classroom plant
 */
function ClassroomPlant({ position }) {
  return (
    <group position={position}>
      {/* Ceramic Pot */}
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.2, 0.15, 0.5, 12]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.3} />
      </mesh>
      {/* Soil */}
      <mesh position={[0, 0.48, 0]}>
        <cylinderGeometry args={[0.19, 0.19, 0.04, 12]} />
        <meshStandardMaterial color="#3e2723" roughness={0.9} />
      </mesh>
      {/* Foliage Spheres */}
      <mesh position={[0, 0.72, 0]}>
        <sphereGeometry args={[0.26, 8, 8]} />
        <meshStandardMaterial color="#15803d" roughness={0.8} />
      </mesh>
      <mesh position={[0.08, 0.9, 0]}>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshStandardMaterial color="#22c55e" roughness={0.8} />
      </mesh>
    </group>
  );
}

/**
 * Wall Clock with minimalist low-poly hour and minute hands
 */
function ClassroomWallClock({ position, rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Outer Casing */}
      <mesh>
        <cylinderGeometry args={[0.22, 0.22, 0.04, 24]} />
        <meshStandardMaterial color="#1e293b" roughness={0.5} />
      </mesh>
      {/* White Dial Face */}
      <mesh position={[0, 0, 0.021]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.19, 24]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} />
      </mesh>
      {/* Hour Hand */}
      <mesh position={[0, 0.04, 0.023]}>
        <boxGeometry args={[0.015, 0.09, 0.005]} />
        <meshBasicMaterial color="#0f172a" />
      </mesh>
      {/* Minute Hand */}
      <mesh position={[0.05, 0, 0.023]} rotation={[0, 0, -Math.PI / 2]}>
        <boxGeometry args={[0.012, 0.12, 0.005]} />
        <meshBasicMaterial color="#0f172a" />
      </mesh>
      {/* Center Pin */}
      <mesh position={[0, 0, 0.025]}>
        <cylinderGeometry args={[0.015, 0.015, 0.01, 8]} />
        <meshBasicMaterial color="#e11d48" />
      </mesh>
    </group>
  );
}

/**
 * LanguageSchool Interior Component
 * Renders ONLY when currentLocation === "LanguageSchool".
 * Believable low-poly language school classroom with Teacher Olivia NPC,
 * teacher desk, whiteboard, posters, student desks, and entrance/exit door.
 */
export function LanguageSchool({ isTalking = false, currentLocation = "outside" }) {
  const isInside = currentLocation === "LanguageSchool";

  // Whiteboard Canvas Texture with Lesson Notes
  const whiteboardTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Clean white enamel surface
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 1024, 512);

    // Subtle aluminum inner border
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 12;
    ctx.strokeRect(6, 6, 1012, 500);

    // Title / Date Header
    ctx.fillStyle = "#0284c7";
    ctx.font = "bold 32px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("📚 TODAY'S ENGLISH LESSON", 48, 64);

    ctx.fillStyle = "#64748b";
    ctx.font = "bold 22px sans-serif";
    ctx.textAlign = "right";
    ctx.fillText("Unit 1: Introductions & Schedules", 976, 64);

    // Header divider line
    ctx.strokeStyle = "#0284c7";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(48, 80);
    ctx.lineTo(976, 80);
    ctx.stroke();

    // Key Questions & Phrases (Handwritten style simulation)
    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 26px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("Key Dialogue Phrases:", 48, 130);

    ctx.font = "24px sans-serif";
    ctx.fillStyle = "#1e293b";
    ctx.fillText("1. \"Hello Teacher Olivia, could you tell me about the class schedule?\"", 60, 180);
    ctx.fillText("2. \"What level is this English class, and how much is the course?\"", 60, 230);
    ctx.fillText("3. \"How many days a week does the class meet?\"", 60, 280);
    ctx.fillText("4. \"What textbooks and learning materials do I need to prepare?\"", 60, 330);

    // Pro-Tip / Idiom box
    ctx.fillStyle = "#f0fdf4";
    ctx.fillRect(48, 380, 928, 85);
    ctx.strokeStyle = "#22c55e";
    ctx.lineWidth = 2;
    ctx.strokeRect(48, 380, 928, 85);

    ctx.fillStyle = "#15803d";
    ctx.font = "bold 24px sans-serif";
    ctx.fillText("💡 Teacher's Tip: \"Practice speaking every day! Mistakes are proof you are learning.\"", 72, 432);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);

  // Main Bilingual Wall Signboard ("VILLAGE LANGUAGE SCHOOL" / "마을 어학원")
  const schoolSignTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, 512, 256);

    // Teal Accent stripe
    ctx.fillStyle = "#0d9488";
    ctx.fillRect(0, 0, 512, 24);

    // English Title
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 34px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("VILLAGE LANGUAGE SCHOOL", 256, 100);

    // Korean Subtitle
    ctx.fillStyle = "#5eead4";
    ctx.font = "bold 44px sans-serif";
    ctx.fillText("마을 어학원", 256, 175);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "20px sans-serif";
    ctx.fillText("Education & Community District", 256, 222);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);

  // Classroom Door Signboard ("ENGLISH CLASSROOM" / "영어 교실")
  const classroomSignTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = "#134e4a";
    ctx.fillRect(0, 0, 256, 128);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 20px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("ENGLISH CLASSROOM", 128, 48);

    ctx.fillStyle = "#99f6e4";
    ctx.font = "bold 26px sans-serif";
    ctx.fillText("영어 교실", 128, 88);

    ctx.fillStyle = "#fef08a";
    ctx.font = "bold 14px sans-serif";
    ctx.fillText("ROOM 101", 128, 114);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);

  // Educational Wall Poster
  const posterTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 384;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, 256, 384);
    ctx.fillStyle = "#0284c7";
    ctx.fillRect(0, 0, 256, 40);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 18px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("DAILY PHRASES", 128, 26);

    ctx.font = "bold 15px sans-serif";
    ctx.fillStyle = "#0369a1";
    ctx.fillText("Greetings & Polite Talk", 128, 70);

    ctx.font = "13px sans-serif";
    ctx.fillStyle = "#334155";
    ctx.textAlign = "left";
    const phrases = [
      "• Nice to meet you!",
      "• Could you help me?",
      "• Excuse me, please.",
      "• What time is it?",
      "• Have a wonderful day!",
      "• Thank you so much!",
      "• See you tomorrow!"
    ];
    phrases.forEach((phrase, idx) => {
      ctx.fillText(phrase, 20, 115 + idx * 36);
    });

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);

  // Performance requirement: return null if player is not in LanguageSchool
  if (!isInside) return null;

  return (
    <group>
      {/* ============================================================ */}
      {/* 1. CLASSROOM LIGHTING (Max 2 Lightweight Lights, No Shadows) */}
      {/* ============================================================ */}
      <ambientLight intensity={0.96} color="#f8fafc" />
      <pointLight position={[-14.4, 2.8, 36.0]} intensity={1.1} distance={9} color="#fffbeb" />

      {/* ============================================================ */}
      {/* 2. FLOOR & CEILING                                           */}
      {/* ============================================================ */}
      {/* Warm Light Hardwood Floor (X: [-16.8, -12.0], Z: [34.0, 38.0]) */}
      <mesh position={[-14.4, 0.01, 36.0]}>
        <boxGeometry args={[4.8, 0.02, 4.0]} />
        <meshStandardMaterial color="#e5c39c" roughness={0.75} />
      </mesh>

      {/* Classroom Center Walkway / Runner Rug */}
      <mesh position={[-14.4, 0.015, 36.0]}>
        <boxGeometry args={[1.4, 0.01, 3.2]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.9} />
      </mesh>

      {/* Entrance Welcome Mat */}
      <mesh position={[-14.4, 0.02, 37.3]}>
        <boxGeometry args={[1.2, 0.01, 0.8]} />
        <meshStandardMaterial color="#0f766e" roughness={0.8} />
      </mesh>

      {/* White Acoustic Ceiling with Flush Panels */}
      <mesh position={[-14.4, 3.2, 36.0]}>
        <boxGeometry args={[4.8, 0.05, 4.0]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.8} />
      </mesh>
      {/* Recessed Overhead Flush Light Fixtures */}
      <mesh position={[-14.4, 3.18, 35.2]}>
        <boxGeometry args={[2.0, 0.02, 0.6]} />
        <meshStandardMaterial color="#ffffff" emissive="#fef3c7" emissiveIntensity={0.85} />
      </mesh>
      <mesh position={[-14.4, 3.18, 36.8]}>
        <boxGeometry args={[2.0, 0.02, 0.6]} />
        <meshStandardMaterial color="#ffffff" emissive="#fef3c7" emissiveIntensity={0.85} />
      </mesh>

      {/* ============================================================ */}
      {/* 3. FOUR WALLS                                                */}
      {/* ============================================================ */}
      {/* South Wall (Behind Teacher Olivia & Whiteboard, Z = 34.0) */}
      <mesh position={[-14.4, 1.6, 34.0]}>
        <boxGeometry args={[4.8, 3.2, 0.08]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.85} />
      </mesh>
      {/* South Wainscot Panel */}
      <mesh position={[-14.4, 0.45, 34.03]}>
        <boxGeometry args={[4.8, 0.9, 0.03]} />
        <meshStandardMaterial color="#0f766e" roughness={0.7} />
      </mesh>

      {/* West Wall (X = -16.8) */}
      <mesh position={[-16.8, 1.6, 36.0]}>
        <boxGeometry args={[0.08, 3.2, 4.0]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.85} />
      </mesh>
      {/* West Wainscot Panel */}
      <mesh position={[-16.77, 0.45, 36.0]}>
        <boxGeometry args={[0.03, 0.9, 4.0]} />
        <meshStandardMaterial color="#0f766e" roughness={0.7} />
      </mesh>

      {/* East Wall (X = -12.0) */}
      <mesh position={[-12.0, 1.6, 36.0]}>
        <boxGeometry args={[0.08, 3.2, 4.0]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.85} />
      </mesh>
      {/* East Wainscot Panel */}
      <mesh position={[-12.03, 0.45, 36.0]}>
        <boxGeometry args={[0.03, 0.9, 4.0]} />
        <meshStandardMaterial color="#0f766e" roughness={0.7} />
      </mesh>

      {/* North / Entrance Wall (Z = 38.0) */}
      {/* North Wall Left Section */}
      <mesh position={[-15.85, 1.6, 38.0]}>
        <boxGeometry args={[1.9, 3.2, 0.08]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.85} />
      </mesh>
      {/* North Wall Right Section */}
      <mesh position={[-12.95, 1.6, 38.0]}>
        <boxGeometry args={[1.9, 3.2, 0.08]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.85} />
      </mesh>
      {/* North Wall Header Lintel over Exit Door */}
      <mesh position={[-14.4, 2.7, 38.0]}>
        <boxGeometry args={[1.0, 1.0, 0.08]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.85} />
      </mesh>

      {/* Double Glass Exit Door Frame */}
      <mesh position={[-14.4, 1.1, 38.0]}>
        <boxGeometry args={[1.0, 2.2, 0.07]} />
        <meshStandardMaterial color="#334155" roughness={0.6} />
      </mesh>
      {/* Frosted Glass Panes */}
      <mesh position={[-14.4, 1.1, 38.01]}>
        <boxGeometry args={[0.9, 2.1, 0.02]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.2} transparent opacity={0.6} />
      </mesh>
      {/* Door Handles */}
      <mesh position={[-14.45, 1.05, 37.95]}>
        <cylinderGeometry args={[0.012, 0.012, 0.4, 8]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[-14.35, 1.05, 37.95]}>
        <cylinderGeometry args={[0.012, 0.012, 0.4, 8]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Illuminated Green EXIT / 출구 Sign */}
      <mesh position={[-14.4, 2.45, 37.94]}>
        <boxGeometry args={[0.55, 0.18, 0.03]} />
        <meshStandardMaterial color="#15803d" emissive="#22c55e" emissiveIntensity={0.8} />
      </mesh>

      {/* Classroom Door Sign ("ENGLISH CLASSROOM / 영어 교실") */}
      {classroomSignTexture && (
        <mesh position={[-14.4, 2.8, 37.94]}>
          <planeGeometry args={[0.65, 0.32]} />
          <meshBasicMaterial map={classroomSignTexture} />
        </mesh>
      )}

      {/* ============================================================ */}
      {/* 4. WHITEBOARD & WALL CLOCK (South Wall)                      */}
      {/* ============================================================ */}
      {/* Whiteboard with Dynamic Canvas Texture */}
      {whiteboardTexture && (
        <group position={[-14.4, 1.7, 34.05]}>
          {/* Aluminum Frame */}
          <mesh>
            <boxGeometry args={[3.04, 1.44, 0.03]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.6} roughness={0.3} />
          </mesh>
          {/* Surface */}
          <mesh position={[0, 0, 0.016]}>
            <planeGeometry args={[3.0, 1.4]} />
            <meshBasicMaterial map={whiteboardTexture} />
          </mesh>
          {/* Marker Tray at Bottom */}
          <mesh position={[0, -0.73, 0.04]}>
            <boxGeometry args={[2.4, 0.02, 0.08]} />
            <meshStandardMaterial color="#64748b" roughness={0.5} />
          </mesh>
          {/* Dry-Erase Markers (Red, Blue, Black) */}
          <mesh position={[-0.4, -0.71, 0.04]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.01, 0.01, 0.12, 8]} />
            <meshBasicMaterial color="#e11d48" />
          </mesh>
          <mesh position={[-0.2, -0.71, 0.04]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.01, 0.01, 0.12, 8]} />
            <meshBasicMaterial color="#2563eb" />
          </mesh>
          <mesh position={[0.0, -0.71, 0.04]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.01, 0.01, 0.12, 8]} />
            <meshBasicMaterial color="#0f172a" />
          </mesh>
          {/* Whiteboard Eraser */}
          <mesh position={[0.3, -0.71, 0.04]}>
            <boxGeometry args={[0.12, 0.03, 0.05]} />
            <meshStandardMaterial color="#1e293b" roughness={0.8} />
          </mesh>
        </group>
      )}

      {/* Classroom Wall Clock */}
      <ClassroomWallClock position={[-14.4, 2.65, 34.05]} />

      {/* ============================================================ */}
      {/* 5. WALL SIGNS & EDUCATIONAL POSTERS                          */}
      {/* ============================================================ */}
      {/* Main Bilingual Sign on East Wall ("VILLAGE LANGUAGE SCHOOL" / "마을 어학원") */}
      {schoolSignTexture && (
        <group position={[-12.04, 2.0, 35.8]} rotation={[0, -Math.PI / 2, 0]}>
          <mesh>
            <boxGeometry args={[1.3, 0.65, 0.02]} />
            <meshStandardMaterial color="#0f172a" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0, 0.012]}>
            <planeGeometry args={[1.26, 0.61]} />
            <meshBasicMaterial map={schoolSignTexture} />
          </mesh>
        </group>
      )}

      {/* Educational Grammar / Daily Phrases Poster on West Wall */}
      {posterTexture && (
        <group position={[-16.76, 1.9, 35.8]} rotation={[0, Math.PI / 2, 0]}>
          <mesh>
            <boxGeometry args={[0.8, 1.2, 0.02]} />
            <meshStandardMaterial color="#cbd5e1" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0, 0.012]}>
            <planeGeometry args={[0.76, 1.16]} />
            <meshBasicMaterial map={posterTexture} />
          </mesh>
        </group>
      )}

      {/* ============================================================ */}
      {/* 6. TEACHER OLIVIA NPC & TEACHER WORKSTATION                 */}
      {/* ============================================================ */}
      {/* Teacher Olivia NPC */}
      <TeacherOlivia isTalking={isTalking} />

      {/* Teacher Desk (In front of Olivia at Z = 35.6) */}
      <group position={[-14.4, 0, 35.6]}>
        {/* Main Desktop (Warm Oak Wood) */}
        <mesh position={[0, 0.74, 0]}>
          <boxGeometry args={[1.8, 0.05, 0.7]} />
          <meshStandardMaterial color="#b45309" roughness={0.65} />
        </mesh>
        {/* Front Modesty Panel */}
        <mesh position={[0, 0.38, 0.3]}>
          <boxGeometry args={[1.65, 0.65, 0.02]} />
          <meshStandardMaterial color="#78350f" roughness={0.7} />
        </mesh>
        {/* Side Panel Legs */}
        <mesh position={[-0.82, 0.37, 0]}>
          <boxGeometry args={[0.04, 0.72, 0.65]} />
          <meshStandardMaterial color="#78350f" roughness={0.7} />
        </mesh>
        <mesh position={[0.82, 0.37, 0]}>
          <boxGeometry args={[0.04, 0.72, 0.65]} />
          <meshStandardMaterial color="#78350f" roughness={0.7} />
        </mesh>

        {/* Laptop on Teacher Desk */}
        <group position={[0, 0.765, 0.05]}>
          {/* Base */}
          <mesh>
            <boxGeometry args={[0.32, 0.015, 0.22]} />
            <meshStandardMaterial color="#64748b" metalness={0.6} roughness={0.4} />
          </mesh>
          {/* Keyboard Surface */}
          <mesh position={[0, 0.009, 0.02]}>
            <boxGeometry args={[0.28, 0.004, 0.14]} />
            <meshStandardMaterial color="#0f172a" roughness={0.6} />
          </mesh>
          {/* Screen (Open at 110-degree angle facing Olivia) */}
          <mesh position={[0, 0.11, -0.09]} rotation={[0.3, 0, 0]}>
            <boxGeometry args={[0.32, 0.22, 0.01]} />
            <meshStandardMaterial color="#475569" metalness={0.5} roughness={0.4} />
          </mesh>
          {/* Screen Display Glow */}
          <mesh position={[0, 0.11, -0.084]} rotation={[0.3, 0, 0]}>
            <planeGeometry args={[0.29, 0.19]} />
            <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.6} />
          </mesh>
        </group>

        {/* Textbooks & Graded Papers */}
        <group position={[-0.55, 0.765, 0]}>
          <mesh position={[0, 0.015, 0]}>
            <boxGeometry args={[0.28, 0.03, 0.22]} />
            <meshStandardMaterial color="#0284c7" roughness={0.4} />
          </mesh>
          <mesh position={[0.02, 0.04, 0]} rotation={[0, 0.08, 0]}>
            <boxGeometry args={[0.26, 0.025, 0.2]} />
            <meshStandardMaterial color="#e11d48" roughness={0.4} />
          </mesh>
        </group>

        {/* Pen Holder with Pens */}
        <group position={[0.55, 0.765, -0.08]}>
          <mesh position={[0, 0.06, 0]}>
            <cylinderGeometry args={[0.04, 0.035, 0.12, 10]} />
            <meshStandardMaterial color="#1e293b" roughness={0.5} />
          </mesh>
          <mesh position={[-0.015, 0.12, 0]}>
            <cylinderGeometry args={[0.006, 0.006, 0.14, 6]} />
            <meshBasicMaterial color="#e11d48" />
          </mesh>
          <mesh position={[0.015, 0.12, 0]}>
            <cylinderGeometry args={[0.006, 0.006, 0.14, 6]} />
            <meshBasicMaterial color="#0284c7" />
          </mesh>
        </group>
      </group>

      {/* Teacher Chair (Behind desk, placed near Olivia) */}
      <group position={[-14.4, 0, 34.65]}>
        <mesh position={[0, 0.46, 0]}>
          <boxGeometry args={[0.48, 0.05, 0.44]} />
          <meshStandardMaterial color="#1e293b" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.76, -0.19]}>
          <boxGeometry args={[0.44, 0.55, 0.04]} />
          <meshStandardMaterial color="#1e293b" roughness={0.7} />
        </mesh>
        {/* Chair Center Post */}
        <mesh position={[0, 0.24, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 0.45, 8]} />
          <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Star Base */}
        <mesh position={[0, 0.04, 0]}>
          <cylinderGeometry args={[0.26, 0.26, 0.04, 5]} />
          <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.4} />
        </mesh>
      </group>

      {/* ============================================================ */}
      {/* 7. STUDENT DESKS & CHAIRS (4 Sets)                           */}
      {/* ============================================================ */}
      {/* Row 1 Left (West) */}
      <StudentDeskSet position={[-15.7, 0, 36.4]} />
      {/* Row 1 Right (East) */}
      <StudentDeskSet position={[-13.1, 0, 36.4]} />
      {/* Row 2 Left (West) */}
      <StudentDeskSet position={[-15.7, 0, 37.3]} />
      {/* Row 2 Right (East) */}
      <StudentDeskSet position={[-13.1, 0, 37.3]} />

      {/* ============================================================ */}
      {/* 8. STORAGE CABINET & BOOKSHELF                               */}
      {/* ============================================================ */}
      {/* Storage Cabinet on East Wall */}
      <group position={[-12.25, 0, 34.8]}>
        <mesh position={[0, 0.6, 0]}>
          <boxGeometry args={[0.38, 1.2, 0.9]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.5} />
        </mesh>
        {/* Cabinet Door Seam */}
        <mesh position={[-0.195, 0.6, 0]}>
          <boxGeometry args={[0.01, 1.15, 0.02]} />
          <meshBasicMaterial color="#475569" />
        </mesh>
        {/* Handles */}
        <mesh position={[-0.205, 0.65, -0.04]}>
          <cylinderGeometry args={[0.008, 0.008, 0.1, 6]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[-0.205, 0.65, 0.04]}>
          <cylinderGeometry args={[0.008, 0.008, 0.1, 6]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>

      {/* Small Bookshelf on West Wall */}
      <group position={[-16.55, 0, 34.8]}>
        {/* Shelf Frame */}
        <mesh position={[0, 0.7, 0]}>
          <boxGeometry args={[0.36, 1.4, 0.9]} />
          <meshStandardMaterial color="#b45309" roughness={0.7} />
        </mesh>
        {/* Inner Cutout */}
        <mesh position={[0.02, 0.7, 0]}>
          <boxGeometry args={[0.34, 1.3, 0.82]} />
          <meshStandardMaterial color="#78350f" roughness={0.8} />
        </mesh>
        {/* Horizontal Shelves */}
        {[0.35, 0.75, 1.1].map((yShelf, idx) => (
          <mesh key={`shelf-divider-${idx}`} position={[0.02, yShelf, 0]}>
            <boxGeometry args={[0.33, 0.03, 0.82]} />
            <meshStandardMaterial color="#92400e" roughness={0.7} />
          </mesh>
        ))}
        {/* Colorful Textbooks on Shelves */}
        {[
          { pos: [0.02, 0.5, -0.25], color: "#0284c7", w: 0.18 },
          { pos: [0.02, 0.5, -0.05], color: "#e11d48", w: 0.16 },
          { pos: [0.02, 0.5, 0.15], color: "#16a34a", w: 0.2 },
          { pos: [0.02, 0.9, -0.2], color: "#eab308", w: 0.15 },
          { pos: [0.02, 0.9, 0.05], color: "#8b5cf6", w: 0.22 }
        ].map((book, idx) => (
          <mesh key={`shelf-book-${idx}`} position={book.pos}>
            <boxGeometry args={[0.22, 0.24, book.w]} />
            <meshStandardMaterial color={book.color} roughness={0.5} />
          </mesh>
        ))}
      </group>

      {/* ============================================================ */}
      {/* 9. DECORATIVE POTTED CLASSROOM PLANTS                        */}
      {/* ============================================================ */}
      <ClassroomPlant position={[-16.4, 0, 34.35]} />
      <ClassroomPlant position={[-12.4, 0, 34.35]} />
    </group>
  );
}
