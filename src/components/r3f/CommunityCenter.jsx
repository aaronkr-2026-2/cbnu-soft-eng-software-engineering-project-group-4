import React, { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

/**
 * Stylized low-poly Staff Member Mina
 * Friendly, helpful municipal staff member at the village community center (주민센터).
 * Dressed in a professional slate-blue blazer, cream silk blouse, dark navy skirt,
 * neat styled hair, and a gold "MINA" name badge.
 * Subtly animated with gentle breathing, small head movements, and conversational hand gestures.
 */
function StaffMina({ isTalking = false }) {
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
    <group position={[7.2, 0, 35.2]}>
      {/* Lower Body / Navy Pencil Midi Skirt */}
      <mesh position={[0, 0.44, 0]}>
        <cylinderGeometry args={[0.2, 0.25, 0.86, 14]} />
        <meshStandardMaterial color="#0f172a" roughness={0.7} />
      </mesh>

      {/* Dark Leather Flats */}
      <mesh position={[-0.1, 0.04, 0.03]}>
        <boxGeometry args={[0.11, 0.08, 0.18]} />
        <meshStandardMaterial color="#0f172a" roughness={0.4} />
      </mesh>
      <mesh position={[0.1, 0.04, 0.03]}>
        <boxGeometry args={[0.11, 0.08, 0.18]} />
        <meshStandardMaterial color="#0f172a" roughness={0.4} />
      </mesh>

      {/* Torso / Slate-Blue Office Blazer */}
      <mesh position={[0, 1.1, 0]}>
        <boxGeometry args={[0.4, 0.48, 0.24]} />
        <meshStandardMaterial color="#0284c7" roughness={0.65} />
      </mesh>

      {/* Cream Inner Blouse Lapel */}
      <mesh position={[0, 1.22, 0.11]}>
        <boxGeometry args={[0.14, 0.14, 0.03]} />
        <meshStandardMaterial color="#fef3c7" roughness={0.4} />
      </mesh>

      {/* Blazer Lapel Buttons */}
      {[1.02, 1.1, 1.18].map((yBtn, idx) => (
        <mesh key={`btn-${idx}`} position={[0, yBtn, 0.125]}>
          <boxGeometry args={[0.02, 0.02, 0.01]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.3} />
        </mesh>
      ))}

      {/* Gold Name Badge: MINA */}
      <mesh position={[0.12, 1.2, 0.125]}>
        <boxGeometry args={[0.075, 0.032, 0.015]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Left Arm */}
      <group position={[-0.24, 1.26, 0]}>
        <mesh position={[0, -0.22, 0]}>
          <cylinderGeometry args={[0.055, 0.06, 0.42, 10]} />
          <meshStandardMaterial color="#0284c7" roughness={0.65} />
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
          <meshStandardMaterial color="#0284c7" roughness={0.65} />
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
        {/* Neat Dark Brown Updo / Professional Bob */}
        <mesh position={[0, 0.27, -0.01]}>
          <boxGeometry args={[0.23, 0.09, 0.22]} />
          <meshStandardMaterial color="#2d1b10" roughness={0.8} />
        </mesh>
        <mesh position={[-0.11, 0.16, 0]}>
          <boxGeometry args={[0.04, 0.2, 0.2]} />
          <meshStandardMaterial color="#2d1b10" roughness={0.8} />
        </mesh>
        <mesh position={[0.11, 0.16, 0]}>
          <boxGeometry args={[0.04, 0.2, 0.2]} />
          <meshStandardMaterial color="#2d1b10" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.16, -0.1]}>
          <boxGeometry args={[0.22, 0.2, 0.04]} />
          <meshStandardMaterial color="#2d1b10" roughness={0.8} />
        </mesh>

        {/* Eyes & Friendly Expression */}
        <mesh position={[-0.05, 0.16, 0.102]}>
          <planeGeometry args={[0.024, 0.014]} />
          <meshBasicMaterial color="#0f172a" />
        </mesh>
        <mesh position={[0.05, 0.16, 0.102]}>
          <planeGeometry args={[0.024, 0.014]} />
          <meshBasicMaterial color="#0f172a" />
        </mesh>
        <mesh position={[0, 0.09, 0.102]}>
          <planeGeometry args={[0.045, 0.011]} />
          <meshBasicMaterial color="#e11d48" />
        </mesh>
      </group>
    </group>
  );
}

/**
 * Wall Clock with minimalist hour and minute hands
 */
function OfficeWallClock({ position }) {
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
        <meshBasicMaterial color="#0284c7" />
      </mesh>
    </group>
  );
}

/**
 * Potted indoor plant
 */
function OfficePlant({ position }) {
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
 * CommunityCenter Interior Component
 * Renders ONLY when currentLocation === "CommunityCenter".
 * Believable Korean neighborhood 주민센터 with Staff Mina NPC,
 * service counter, queue display, citizen application filling table,
 * waiting area, brochure racks, and administrative notices.
 */
export function CommunityCenter({ isTalking = false, currentLocation = "outside" }) {
  const isInside = currentLocation === "CommunityCenter";

  // Information Board Canvas Texture: Citizen Services & Programs
  const serviceBoardTexture = useMemo(() => {
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
    ctx.fillStyle = "#0369a1";
    ctx.font = "bold 32px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("🏛️ VILLAGE COMMUNITY SERVICES (주민 행정 안내)", 48, 64);

    ctx.fillStyle = "#64748b";
    ctx.font = "bold 20px sans-serif";
    ctx.textAlign = "right";
    ctx.fillText("Window 1 : Resident Services", 976, 64);

    // Header divider line
    ctx.strokeStyle = "#0284c7";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(48, 80);
    ctx.lineTo(976, 80);
    ctx.stroke();

    // 4 Key Service Columns / Items
    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 22px sans-serif";
    ctx.textAlign = "left";

    // 1. Resident Registration
    ctx.fillText("1. RESIDENT REGISTRATION (전입신고 / 주민등록)", 48, 130);
    ctx.font = "19px sans-serif";
    ctx.fillStyle = "#475569";
    ctx.fillText("• Change of address, new resident registration & ID verification", 60, 162);

    // 2. Certificates
    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 22px sans-serif";
    ctx.fillText("2. CERTIFICATES & DOCUMENTS (각종 증명서 발급)", 48, 215);
    ctx.font = "19px sans-serif";
    ctx.fillStyle = "#475569";
    ctx.fillText("• Proof of Residence (등본·초본), seal registration & identification forms", 60, 247);

    // 3. Local Programs
    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 22px sans-serif";
    ctx.fillText("3. LOCAL COMMUNITY PROGRAMS (주민 문화·어학 강좌)", 48, 300);
    ctx.font = "19px sans-serif";
    ctx.fillStyle = "#475569";
    ctx.fillText("• Korean & English conversation clubs, local workshops, volunteering", 60, 332);

    // Highlighted Citizen Notice Box
    ctx.fillStyle = "#f0f9ff";
    ctx.fillRect(48, 375, 928, 95);
    ctx.strokeStyle = "#0284c7";
    ctx.lineWidth = 2;
    ctx.strokeRect(48, 375, 928, 95);

    ctx.fillStyle = "#0369a1";
    ctx.font = "bold 22px sans-serif";
    ctx.fillText("📢 Helpful Notice for New Village Residents:", 70, 412);

    ctx.font = "19px sans-serif";
    ctx.fillStyle = "#0c4a6e";
    ctx.fillText("Please bring your ID card or passport when requesting official certificates.", 70, 445);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);

  // Main Bilingual Wall Signboard ("VILLAGE COMMUNITY CENTER" / "마을 주민센터")
  const mainSignTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, 512, 256);

    // Blue/Teal Accent stripe
    ctx.fillStyle = "#0284c7";
    ctx.fillRect(0, 0, 512, 24);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 32px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("VILLAGE COMMUNITY CENTER", 256, 100);

    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 44px sans-serif";
    ctx.fillText("마을 주민센터", 256, 175);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "20px sans-serif";
    ctx.fillText("Education & Community District", 256, 222);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);

  // Secondary Signboard ("COMMUNITY SERVICES" / "주민 행정 서비스")
  const secondarySignTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = "#082f49";
    ctx.fillRect(0, 0, 512, 256);

    ctx.fillStyle = "#0ea5e9";
    ctx.fillRect(0, 0, 512, 20);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 30px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("COMMUNITY SERVICES", 256, 95);

    ctx.fillStyle = "#7dd3fc";
    ctx.font = "bold 40px sans-serif";
    ctx.fillText("주민 행정 서비스", 256, 165);

    ctx.fillStyle = "#fef08a";
    ctx.font = "bold 20px sans-serif";
    ctx.fillText("Window 1 : General Assistance", 256, 218);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);

  // Community Events & Workshops Poster
  const eventsPosterTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 384;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, 256, 384);
    ctx.fillStyle = "#0284c7";
    ctx.fillRect(0, 0, 256, 42);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 17px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("COMMUNITY EVENTS", 128, 28);

    ctx.font = "bold 15px sans-serif";
    ctx.fillStyle = "#0369a1";
    ctx.fillText("Monthly Neighborhood Programs", 128, 72);

    ctx.font = "13px sans-serif";
    ctx.fillStyle = "#334155";
    ctx.textAlign = "left";
    const programs = [
      "• Korean Cooking Class (Tue 2PM)",
      "• English Chat Circle (Thu 4PM)",
      "• Senior Wellness Yoga (Mon 10AM)",
      "• Youth Coding Club (Sat 1PM)",
      "• Green Village Cleanup (1st Sat)",
      "• New Resident Tea Meetup (Fri)"
    ];
    programs.forEach((prog, idx) => {
      ctx.fillText(prog, 16, 115 + idx * 38);
    });

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);

  if (!isInside) return null;

  return (
    <group>
      {/* ============================================================ */}
      {/* 1. CIVIC LIGHTING (Max 2 Lightweight Lights, No Shadows)      */}
      {/* ============================================================ */}
      <ambientLight intensity={0.96} color="#f8fafc" />
      <pointLight position={[7.2, 2.8, 36.1]} intensity={1.1} distance={9} color="#e0f2fe" />

      {/* ============================================================ */}
      {/* 2. FLOOR & CEILING                                           */}
      {/* ============================================================ */}
      {/* Light Cream/Gray Ceramic Tile Floor (X: [4.9, 9.5], Z: [34.4, 37.8]) */}
      <mesh position={[7.2, 0.01, 36.1]}>
        <boxGeometry args={[4.6, 0.02, 3.4]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.7} />
      </mesh>

      {/* Central Service Aisle Tile Accent */}
      <mesh position={[7.2, 0.015, 36.4]}>
        <boxGeometry args={[1.4, 0.01, 2.6]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.8} />
      </mesh>

      {/* Entrance Welcome Mat */}
      <mesh position={[7.2, 0.02, 37.25]}>
        <boxGeometry args={[1.2, 0.01, 0.8]} />
        <meshStandardMaterial color="#0369a1" roughness={0.8} />
      </mesh>

      {/* Ceiling with Recessed Light Panels */}
      <mesh position={[7.2, 3.2, 36.1]}>
        <boxGeometry args={[4.6, 0.05, 3.4]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.8} />
      </mesh>
      <mesh position={[7.2, 3.18, 35.3]}>
        <boxGeometry args={[2.0, 0.02, 0.6]} />
        <meshStandardMaterial color="#ffffff" emissive="#e0f2fe" emissiveIntensity={0.85} />
      </mesh>
      <mesh position={[7.2, 3.18, 36.9]}>
        <boxGeometry args={[2.0, 0.02, 0.6]} />
        <meshStandardMaterial color="#ffffff" emissive="#e0f2fe" emissiveIntensity={0.85} />
      </mesh>

      {/* ============================================================ */}
      {/* 3. FOUR WALLS                                                */}
      {/* ============================================================ */}
      {/* South Wall (Behind Staff Mina, Z = 34.4) */}
      <mesh position={[7.2, 1.6, 34.4]}>
        <boxGeometry args={[4.6, 3.2, 0.08]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.85} />
      </mesh>
      {/* South Wainscot Panel */}
      <mesh position={[7.2, 0.45, 34.43]}>
        <boxGeometry args={[4.6, 0.9, 0.03]} />
        <meshStandardMaterial color="#0284c7" roughness={0.7} />
      </mesh>

      {/* West Wall (X = 4.9) */}
      <mesh position={[4.9, 1.6, 36.1]}>
        <boxGeometry args={[0.08, 3.2, 3.4]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.85} />
      </mesh>
      {/* West Wainscot Panel */}
      <mesh position={[4.93, 0.45, 36.1]}>
        <boxGeometry args={[0.03, 0.9, 3.4]} />
        <meshStandardMaterial color="#0284c7" roughness={0.7} />
      </mesh>

      {/* East Wall (X = 9.5) */}
      <mesh position={[9.5, 1.6, 36.1]}>
        <boxGeometry args={[0.08, 3.2, 3.4]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.85} />
      </mesh>
      {/* East Wainscot Panel */}
      <mesh position={[9.47, 0.45, 36.1]}>
        <boxGeometry args={[0.03, 0.9, 3.4]} />
        <meshStandardMaterial color="#0284c7" roughness={0.7} />
      </mesh>

      {/* North / Entrance Wall (Z = 37.8) */}
      <mesh position={[5.8, 1.6, 37.8]}>
        <boxGeometry args={[1.8, 3.2, 0.08]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.85} />
      </mesh>
      <mesh position={[8.6, 1.6, 37.8]}>
        <boxGeometry args={[1.8, 3.2, 0.08]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.85} />
      </mesh>
      {/* Header over Door */}
      <mesh position={[7.2, 2.7, 37.8]}>
        <boxGeometry args={[1.0, 1.0, 0.08]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.85} />
      </mesh>

      {/* Double Glass Exit Door Frame */}
      <mesh position={[7.2, 1.1, 37.8]}>
        <boxGeometry args={[1.0, 2.2, 0.07]} />
        <meshStandardMaterial color="#1e293b" roughness={0.6} />
      </mesh>
      <mesh position={[7.2, 1.1, 37.81]}>
        <boxGeometry args={[0.9, 2.1, 0.02]} />
        <meshStandardMaterial color="#e0f2fe" roughness={0.2} transparent opacity={0.6} />
      </mesh>
      {/* Door Handles */}
      <mesh position={[7.15, 1.05, 37.75]}>
        <cylinderGeometry args={[0.012, 0.012, 0.4, 8]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[7.25, 1.05, 37.75]}>
        <cylinderGeometry args={[0.012, 0.012, 0.4, 8]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Illuminated Green EXIT / 출구 Sign */}
      <mesh position={[7.2, 2.45, 37.74]}>
        <boxGeometry args={[0.55, 0.18, 0.03]} />
        <meshStandardMaterial color="#15803d" emissive="#22c55e" emissiveIntensity={0.8} />
      </mesh>

      {/* ============================================================ */}
      {/* 4. RECEPTION / SERVICE COUNTER & QUEUE DISPLAY               */}
      {/* ============================================================ */}
      {/* Staff Mina NPC */}
      <StaffMina isTalking={isTalking} />

      {/* Main Reception Service Counter (In front of Mina at Z = 35.8) */}
      <group position={[7.2, 0, 35.8]}>
        {/* Lower Counter Body */}
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[2.0, 1.0, 0.6]} />
          <meshStandardMaterial color="#0284c7" roughness={0.65} />
        </mesh>
        {/* Wood Countertop */}
        <mesh position={[0, 1.02, 0]}>
          <boxGeometry args={[2.1, 0.05, 0.7]} />
          <meshStandardMaterial color="#b45309" roughness={0.6} />
        </mesh>
        {/* Glass Service Window Partition */}
        <mesh position={[0, 1.35, -0.05]}>
          <boxGeometry args={[1.9, 0.6, 0.02]} />
          <meshStandardMaterial color="#e0f2fe" roughness={0.1} transparent opacity={0.4} />
        </mesh>
        {/* Service Window Cutout Frame */}
        <mesh position={[0, 1.15, -0.05]}>
          <boxGeometry args={[0.8, 0.2, 0.03]} />
          <meshStandardMaterial color="#334155" roughness={0.5} />
        </mesh>

        {/* Digital Queue LED Display Above Counter */}
        <group position={[0, 1.72, 0]}>
          <mesh>
            <boxGeometry args={[0.8, 0.22, 0.08]} />
            <meshStandardMaterial color="#0f172a" roughness={0.3} />
          </mesh>
          <mesh position={[0, 0, 0.042]}>
            <planeGeometry args={[0.74, 0.17]} />
            <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.9} />
          </mesh>
        </group>

        {/* Desktop Monitor on Staff Side */}
        <group position={[-0.35, 1.05, -0.15]}>
          <mesh position={[0, 0.01, 0]}>
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
          <mesh position={[0, 0.24, -0.012]}>
            <planeGeometry args={[0.39, 0.25]} />
            <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.5} />
          </mesh>
        </group>

        {/* Keyboard on Staff Side */}
        <mesh position={[-0.35, 1.055, -0.25]}>
          <boxGeometry args={[0.32, 0.01, 0.12]} />
          <meshStandardMaterial color="#0f172a" roughness={0.6} />
        </mesh>

        {/* Official Document Trays & Stamp Pad */}
        <group position={[0.45, 1.055, -0.1]}>
          <mesh position={[0, 0.025, 0]}>
            <boxGeometry args={[0.26, 0.05, 0.2]} />
            <meshStandardMaterial color="#475569" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.07, 0]}>
            <boxGeometry args={[0.26, 0.05, 0.2]} />
            <meshStandardMaterial color="#475569" roughness={0.5} />
          </mesh>
          {/* Red Stamp Pad */}
          <mesh position={[0.22, 0.01, 0.05]}>
            <boxGeometry args={[0.08, 0.02, 0.08]} />
            <meshStandardMaterial color="#b91c1c" roughness={0.4} />
          </mesh>
        </group>
      </group>

      {/* Staff Chair Behind Counter */}
      <group position={[7.2, 0, 34.8]}>
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
      {/* 5. SOUTH WALL: NOTICE BOARD, WALL CLOCK & FILING CABINETS    */}
      {/* ============================================================ */}
      {/* Main Service Board with Dynamic Canvas Texture */}
      {serviceBoardTexture && (
        <group position={[7.2, 1.7, 34.45]}>
          <mesh>
            <boxGeometry args={[3.04, 1.44, 0.03]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.6} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0, 0.016]}>
            <planeGeometry args={[3.0, 1.4]} />
            <meshBasicMaterial map={serviceBoardTexture} />
          </mesh>
        </group>
      )}

      {/* Wall Clock */}
      <OfficeWallClock position={[7.2, 2.65, 34.45]} />

      {/* Filing Cabinets Behind Counter */}
      <group position={[5.4, 0, 34.7]}>
        <mesh position={[0, 0.65, 0]}>
          <boxGeometry args={[0.4, 1.3, 0.8]} />
          <meshStandardMaterial color="#64748b" roughness={0.6} />
        </mesh>
        {/* Drawers */}
        {[0.3, 0.6, 0.9, 1.2].map((yD, idx) => (
          <mesh key={`drawer-${idx}`} position={[0.2, yD, 0]}>
            <boxGeometry args={[0.02, 0.24, 0.7]} />
            <meshStandardMaterial color="#475569" roughness={0.5} />
          </mesh>
        ))}
      </group>

      {/* ============================================================ */}
      {/* 6. SELF-SERVICE DOCUMENT APPLICATION TABLE (West Zone)       */}
      {/* ============================================================ */}
      <group position={[5.5, 0, 36.2]}>
        {/* Standing Height Writing Counter */}
        <mesh position={[0, 0.92, 0]}>
          <boxGeometry args={[0.7, 0.04, 1.2]} />
          <meshStandardMaterial color="#d4a373" roughness={0.7} />
        </mesh>
        {/* Frame / Legs */}
        {[
          [-0.3, 0.45, -0.55],
          [0.3, 0.45, -0.55],
          [-0.3, 0.45, 0.55],
          [0.3, 0.45, 0.55]
        ].map((legPos, idx) => (
          <mesh key={`doc-leg-${idx}`} position={legPos}>
            <cylinderGeometry args={[0.02, 0.02, 0.9, 8]} />
            <meshStandardMaterial color="#1e293b" roughness={0.5} />
          </mesh>
        ))}
        {/* Application Form Paper Trays */}
        <mesh position={[0, 0.95, -0.3]}>
          <boxGeometry args={[0.35, 0.04, 0.28]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.95, 0.1]}>
          <boxGeometry args={[0.35, 0.04, 0.28]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.4} />
        </mesh>
        {/* Pen Stand with Tethered Pens */}
        <mesh position={[0.2, 0.96, 0.4]}>
          <cylinderGeometry args={[0.03, 0.03, 0.05, 8]} />
          <meshStandardMaterial color="#0f172a" roughness={0.5} />
        </mesh>
      </group>

      {/* Information Brochure Floor Rack */}
      <group position={[5.4, 0, 37.2]}>
        <mesh position={[0, 0.65, 0]}>
          <boxGeometry args={[0.3, 1.3, 0.5]} />
          <meshStandardMaterial color="#334155" roughness={0.6} />
        </mesh>
        {/* Colorful Pamphlets */}
        {[0.4, 0.7, 1.0].map((yP, idx) => (
          <mesh key={`pamphlet-${idx}`} position={[0.16, yP, 0]} rotation={[0, 0, 0.15]}>
            <boxGeometry args={[0.02, 0.2, 0.42]} />
            <meshStandardMaterial color={idx === 0 ? "#0284c7" : idx === 1 ? "#10b981" : "#f59e0b"} roughness={0.4} />
          </mesh>
        ))}
      </group>

      {/* ============================================================ */}
      {/* 7. WAITING CHAIRS & WATER STATION (East Zone)                */}
      {/* ============================================================ */}
      {/* Row of 3 Connected Waiting Chairs */}
      <group position={[8.7, 0, 36.6]}>
        {/* Beam Support */}
        <mesh position={[0, 0.25, 0]}>
          <boxGeometry args={[0.4, 0.04, 1.4]} />
          <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* 3 Seats */}
        {[-0.45, 0, 0.45].map((zSeat, idx) => (
          <group key={`wait-seat-${idx}`} position={[0, 0, zSeat]}>
            <mesh position={[0, 0.42, 0]}>
              <boxGeometry args={[0.38, 0.04, 0.38]} />
              <meshStandardMaterial color="#0369a1" roughness={0.7} />
            </mesh>
            <mesh position={[0.17, 0.68, 0]}>
              <boxGeometry args={[0.03, 0.48, 0.36]} />
              <meshStandardMaterial color="#0369a1" roughness={0.7} />
            </mesh>
          </group>
        ))}
        {/* Chair Legs */}
        {[
          [0, 0.12, -0.6],
          [0, 0.12, 0.6]
        ].map((legP, idx) => (
          <mesh key={`wait-leg-${idx}`} position={legP}>
            <cylinderGeometry args={[0.025, 0.025, 0.24, 8]} />
            <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.2} />
          </mesh>
        ))}
      </group>

      {/* Cold Water Dispenser Station */}
      <group position={[8.9, 0, 37.3]}>
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[0.32, 1.0, 0.32]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.3} />
        </mesh>
        {/* Water Bottle Inverted on Top */}
        <mesh position={[0, 1.15, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.3, 12]} />
          <meshStandardMaterial color="#38bdf8" roughness={0.1} transparent opacity={0.7} />
        </mesh>
        {/* Paper Cups Holder */}
        <mesh position={[-0.17, 0.7, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 0.35, 8]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.5} />
        </mesh>
      </group>

      {/* ============================================================ */}
      {/* 8. BILINGUAL WALL SIGNAGE & EVENT POSTERS                    */}
      {/* ============================================================ */}
      {/* Main Bilingual Sign on East Wall ("VILLAGE COMMUNITY CENTER" / "마을 주민센터") */}
      {mainSignTexture && (
        <group position={[9.46, 2.0, 35.8]} rotation={[0, -Math.PI / 2, 0]}>
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

      {/* Secondary Sign on West Wall ("COMMUNITY SERVICES" / "주민 행정 서비스") */}
      {secondarySignTexture && (
        <group position={[4.94, 2.0, 35.8]} rotation={[0, Math.PI / 2, 0]}>
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

      {/* Monthly Programs & Events Poster on East Wall */}
      {eventsPosterTexture && (
        <group position={[9.46, 1.9, 36.8]} rotation={[0, -Math.PI / 2, 0]}>
          <mesh>
            <boxGeometry args={[0.8, 1.2, 0.02]} />
            <meshStandardMaterial color="#cbd5e1" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0, 0.012]}>
            <planeGeometry args={[0.76, 1.16]} />
            <meshBasicMaterial map={eventsPosterTexture} />
          </mesh>
        </group>
      )}

      {/* Potted Indoor Plants in Corners */}
      <OfficePlant position={[5.2, 0, 34.7]} />
      <OfficePlant position={[9.2, 0, 34.7]} />
    </group>
  );
}
