import React, { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

/**
 * Stylized low-poly Activity Coordinator Hana
 * Friendly, cheerful activity coordinator at the village activity center (마을 활동센터).
 * Dressed in a soft coral knit cardigan, ivory inner blouse, deep teal-slate pleated skirt,
 * comfortable dark flats, neatly styled hair with a coral hair accessory, and a gold "HANA" badge.
 * Subtly animated with gentle breathing, small head movements, and conversational hand gestures.
 */
function CoordinatorHana({ isTalking = false }) {
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
    <group position={[-10.8, 0, 41.0]}>
      {/* Lower Body / Pleated Midi Skirt */}
      <mesh position={[0, 0.44, 0]}>
        <cylinderGeometry args={[0.2, 0.26, 0.86, 14]} />
        <meshStandardMaterial color="#0f766e" roughness={0.7} />
      </mesh>

      {/* Dark Leather Flats */}
      <mesh position={[-0.1, 0.04, 0.03]}>
        <boxGeometry args={[0.11, 0.08, 0.18]} />
        <meshStandardMaterial color="#1e293b" roughness={0.4} />
      </mesh>
      <mesh position={[0.1, 0.04, 0.03]}>
        <boxGeometry args={[0.11, 0.08, 0.18]} />
        <meshStandardMaterial color="#1e293b" roughness={0.4} />
      </mesh>

      {/* Torso / Soft Coral Cardigan & Ivory Blouse */}
      <mesh position={[0, 1.1, 0]}>
        <boxGeometry args={[0.4, 0.48, 0.24]} />
        <meshStandardMaterial color="#fb7185" roughness={0.65} />
      </mesh>

      {/* Ivory Blouse Inset */}
      <mesh position={[0, 1.15, 0.122]}>
        <planeGeometry args={[0.14, 0.22]} />
        <meshStandardMaterial color="#fffbeb" roughness={0.5} />
      </mesh>

      {/* Gold Coordinator Name Badge ("HANA") */}
      <mesh position={[-0.13, 1.18, 0.124]}>
        <boxGeometry args={[0.08, 0.035, 0.01]} />
        <meshStandardMaterial color="#f59e0b" roughness={0.2} metalness={0.8} />
      </mesh>

      {/* Left Arm & Hand */}
      <group ref={leftArmRef} position={[-0.24, 1.25, 0]}>
        <mesh position={[0, -0.22, 0]}>
          <cylinderGeometry args={[0.055, 0.05, 0.44, 10]} />
          <meshStandardMaterial color="#fb7185" roughness={0.65} />
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
          <meshStandardMaterial color="#fb7185" roughness={0.65} />
        </mesh>
        <mesh position={[0, -0.46, 0]}>
          <sphereGeometry args={[0.045, 8, 8]} />
          <meshStandardMaterial color="#fed7aa" roughness={0.6} />
        </mesh>
      </group>

      {/* Head, Hair & Smiling Face */}
      <group ref={headRef} position={[0, 1.38, 0]}>
        {/* Head */}
        <mesh position={[0, 0.12, 0]}>
          <sphereGeometry args={[0.13, 16, 16]} />
          <meshStandardMaterial color="#fed7aa" roughness={0.6} />
        </mesh>

        {/* Styled Warm Brown Hair */}
        <mesh position={[0, 0.2, -0.02]}>
          <sphereGeometry args={[0.14, 14, 14]} />
          <meshStandardMaterial color="#451a03" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.21, 0.06]}>
          <boxGeometry args={[0.18, 0.06, 0.08]} />
          <meshStandardMaterial color="#451a03" roughness={0.8} />
        </mesh>
        {/* Hair Bun / Ponytail */}
        <mesh position={[0, 0.22, -0.13]}>
          <sphereGeometry args={[0.07, 10, 10]} />
          <meshStandardMaterial color="#451a03" roughness={0.8} />
        </mesh>

        {/* Coral Hair Ribbon */}
        <mesh position={[0, 0.22, -0.09]}>
          <torusGeometry args={[0.075, 0.015, 8, 16]} />
          <meshStandardMaterial color="#f43f5e" roughness={0.5} />
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

        {/* Cheerful Smile */}
        <mesh position={[0, 0.075, 0.122]}>
          <boxGeometry args={[0.045, 0.014, 0.01]} />
          <meshStandardMaterial color="#e11d48" />
        </mesh>
      </group>
    </group>
  );
}

/**
 * Modern Community Activity Chair
 */
function ActivityChair({ position, rotation = [0, 0, 0], color = "#0f766e" }) {
  return (
    <group position={position} rotation={rotation}>
      {/* 4 Steel Tube Legs */}
      {[
        [-0.17, 0.22, -0.16],
        [0.17, 0.22, -0.16],
        [-0.17, 0.22, 0.16],
        [0.17, 0.22, 0.16]
      ].map((p, idx) => (
        <mesh key={`act-leg-${idx}`} position={p}>
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
 * Potted Community Center Plant
 */
function ActivityPlant({ position }) {
  return (
    <group position={position}>
      {/* Terracotta/White Planter */}
      <mesh position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.22, 0.17, 0.44, 12]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.4} />
      </mesh>
      {/* Coral Rim Stripe */}
      <mesh position={[0, 0.44, 0]}>
        <torusGeometry args={[0.22, 0.015, 8, 16]} />
        <meshStandardMaterial color="#fb7185" roughness={0.4} />
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
 * ActivityCenter Interior Component
 * Renders ONLY when currentLocation === "ActivityCenter".
 * Believable Korean neighborhood 주민 활동 공간 with Coordinator Hana NPC,
 * instructor desk, workshop crafting tables, game/study tables,
 * stacked chairs, materials shelves, water dispenser, and activity schedule boards.
 */
export function ActivityCenter({ isTalking = false, currentLocation = "outside" }) {
  const isInside = currentLocation === "ActivityCenter";

  // Activity Schedule Board (1024x512 Canvas Texture)
  const scheduleBoardTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 1024, 512);

    // Coral header border
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 10;
    ctx.strokeRect(5, 5, 1014, 502);

    ctx.fillStyle = "#e11d48";
    ctx.fillRect(5, 5, 1014, 76);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 30px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("🎨 VILLAGE COMMUNITY ACTIVITY SCHEDULE (주민 활동 일정)", 36, 52);

    ctx.fillStyle = "#ffe4e6";
    ctx.font = "bold 18px sans-serif";
    ctx.textAlign = "right";
    ctx.fillText("All Residents Welcome • Free Membership", 980, 52);

    // 4 Key Programs
    const programs = [
      {
        title: "1. ENGLISH CONVERSATION CLUB",
        kr: "영어 회화 동아리",
        color: "#0284c7",
        time: "Tue & Thu 3:00 PM - 4:30 PM",
        desc: "• Casual speaking games, daily expressions, and friendly village chat"
      },
      {
        title: "2. WATERCOLOR & CRAFT ART CLASS",
        kr: "수채화 및 공예 교실",
        color: "#e11d48",
        time: "Wed 2:00 PM - 4:00 PM",
        desc: "• Free paper & basic paint provided; bring your creativity and apron"
      },
      {
        title: "3. KOREAN HOME COOKING WORKSHOP",
        kr: "한국 가정식 요리 교실",
        color: "#d97706",
        time: "Fri 10:30 AM - 12:30 PM",
        desc: "• Simple side dishes, seasonal ingredients, and recipe sharing"
      },
      {
        title: "4. DIGITAL & COMPUTER BASICS",
        kr: "스마트폰 & 컴퓨터 기초",
        color: "#059669",
        time: "Sat 1:00 PM - 2:30 PM",
        desc: "• Smartphone apps, internet safety, and digital village services"
      }
    ];

    programs.forEach((prog, idx) => {
      const colX = 36 + (idx % 2) * 480;
      const colY = idx < 2 ? 112 : 282;

      ctx.fillStyle = prog.color;
      ctx.font = "bold 20px sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(`${prog.title} [${prog.kr}]`, colX, colY);

      ctx.fillStyle = "#475569";
      ctx.font = "bold 15px sans-serif";
      ctx.fillText(`⏰ ${prog.time}`, colX + 12, colY + 30);

      ctx.fillStyle = "#334155";
      ctx.font = "15px sans-serif";
      ctx.fillText(prog.desc, colX + 12, colY + 54);
    });

    // Bottom Callout
    ctx.fillStyle = "#fff1f2";
    ctx.fillRect(36, 436, 952, 58);
    ctx.strokeStyle = "#fda4af";
    ctx.lineWidth = 2;
    ctx.strokeRect(36, 436, 952, 58);

    ctx.fillStyle = "#9f1239";
    ctx.font = "bold 18px sans-serif";
    ctx.fillText("📢 Want to start a new club? Ask Coordinator Hana at the desk anytime!", 56, 472);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);

  // Community Poster ("JOIN OUR COMMUNITY" / "함께하는 마을") (512x512)
  const communityPosterTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = "#0f766e";
    ctx.fillRect(0, 0, 512, 512);

    ctx.fillStyle = "#f43f5e";
    ctx.fillRect(0, 0, 512, 70);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 28px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("JOIN OUR COMMUNITY", 256, 46);

    ctx.fillStyle = "#fef08a";
    ctx.font = "bold 24px sans-serif";
    ctx.fillText("함께하는 마을", 256, 115);

    ctx.fillStyle = "#ccfbf1";
    ctx.font = "16px sans-serif";
    ctx.fillText("Connect • Learn • Share • Smile", 256, 145);

    // 4 Highlights
    const items = [
      "🤝 Meet new neighbors & make friends",
      "☕ Enjoy tea, snacks, and good conversation",
      "🎨 Share your favorite hobbies & skills",
      "🌟 Free for all village residents!"
    ];

    items.forEach((item, idx) => {
      ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
      ctx.fillRect(40, 180 + idx * 72, 432, 54);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
      ctx.lineWidth = 1;
      ctx.strokeRect(40, 180 + idx * 72, 432, 54);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 16px sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(item, 56, 214 + idx * 72);
    });

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);

  // Main Bilingual Wall Signboard ("VILLAGE ACTIVITY CENTER" / "마을 활동센터")
  const mainSignTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, 0, 512, 256);

    // Soft Coral Top Stripe
    ctx.fillStyle = "#f43f5e";
    ctx.fillRect(0, 0, 512, 24);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 32px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("VILLAGE ACTIVITY CENTER", 256, 100);

    ctx.fillStyle = "#fda4af";
    ctx.font = "bold 28px sans-serif";
    ctx.fillText("마을 활동센터", 256, 150);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "16px sans-serif";
    ctx.fillText("Community Clubs • Art Workshops • Neighborhood Gathering", 256, 195);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);

  // Secondary Signboard ("HOBBY & COMMUNITY ACTIVITIES" / "취미 및 주민 활동")
  const secondarySignTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, 512, 256);

    ctx.fillStyle = "#0d9488";
    ctx.fillRect(0, 0, 512, 18);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 28px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("HOBBY & COMMUNITY ACTIVITIES", 256, 96);

    ctx.fillStyle = "#2dd4bf";
    ctx.font = "bold 26px sans-serif";
    ctx.fillText("취미 및 주민 활동", 256, 146);

    ctx.fillStyle = "#cbd5e1";
    ctx.font = "16px sans-serif";
    ctx.fillText("Open Studio & Club Meeting Space", 256, 192);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);

  if (!isInside) return null;

  return (
    <group>
      {/* ============================================================ */}
      {/* 1. WARM NEUTRAL LIGHTING (Max 2 Lightweight Lights)          */}
      {/* ============================================================ */}
      <ambientLight intensity={0.96} color="#fffbf5" />
      <pointLight position={[-10.8, 2.8, 41.8]} intensity={1.15} distance={9} color="#fff1f2" />

      {/* ============================================================ */}
      {/* 2. FLOOR & CEILING                                           */}
      {/* ============================================================ */}
      {/* Warm Birch Wood Floor (X: [-13.2, -8.4], Z: [40.1, 43.5])    */}
      <mesh position={[-10.8, 0.01, 41.8]}>
        <boxGeometry args={[4.8, 0.02, 3.4]} />
        <meshStandardMaterial color="#deb887" roughness={0.65} />
      </mesh>

      {/* Center Pathway & Craft Rug Accent */}
      <mesh position={[-10.8, 0.015, 42.1]}>
        <boxGeometry args={[1.5, 0.01, 2.4]} />
        <meshStandardMaterial color="#fb7185" roughness={0.8} />
      </mesh>

      {/* Entrance Welcome Mat */}
      <mesh position={[-10.8, 0.02, 43.1]}>
        <boxGeometry args={[1.2, 0.01, 0.7]} />
        <meshStandardMaterial color="#0f766e" roughness={0.8} />
      </mesh>

      {/* Ceiling with Warm Light Panel Recesses */}
      <mesh position={[-10.8, 3.2, 41.8]}>
        <boxGeometry args={[4.8, 0.05, 3.4]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.85} />
      </mesh>
      <mesh position={[-10.8, 3.18, 41.1]}>
        <boxGeometry args={[2.0, 0.02, 0.6]} />
        <meshStandardMaterial color="#ffffff" emissive="#fff1f2" emissiveIntensity={0.85} />
      </mesh>
      <mesh position={[-10.8, 3.18, 42.6]}>
        <boxGeometry args={[2.0, 0.02, 0.6]} />
        <meshStandardMaterial color="#ffffff" emissive="#fff1f2" emissiveIntensity={0.85} />
      </mesh>

      {/* ============================================================ */}
      {/* 3. FOUR WALLS                                                */}
      {/* ============================================================ */}
      {/* South Wall (Behind Coordinator Hana, Z = 40.1) */}
      <mesh position={[-10.8, 1.6, 40.1]}>
        <boxGeometry args={[4.8, 3.2, 0.08]} />
        <meshStandardMaterial color="#fffdfa" roughness={0.85} />
      </mesh>
      {/* South Wainscot Trim Panel (Soft Coral Accent) */}
      <mesh position={[-10.8, 0.45, 40.13]}>
        <boxGeometry args={[4.8, 0.9, 0.03]} />
        <meshStandardMaterial color="#fb7185" roughness={0.7} />
      </mesh>

      {/* West Wall (X = -13.2) */}
      <mesh position={[-13.2, 1.6, 41.8]}>
        <boxGeometry args={[0.08, 3.2, 3.4]} />
        <meshStandardMaterial color="#fffdfa" roughness={0.85} />
      </mesh>
      {/* West Wainscot Trim Panel */}
      <mesh position={[-13.17, 0.45, 41.8]}>
        <boxGeometry args={[0.03, 0.9, 3.4]} />
        <meshStandardMaterial color="#fb7185" roughness={0.7} />
      </mesh>

      {/* East Wall (X = -8.4) */}
      <mesh position={[-8.4, 1.6, 41.8]}>
        <boxGeometry args={[0.08, 3.2, 3.4]} />
        <meshStandardMaterial color="#fffdfa" roughness={0.85} />
      </mesh>
      {/* East Wainscot Trim Panel */}
      <mesh position={[-8.43, 0.45, 41.8]}>
        <boxGeometry args={[0.03, 0.9, 3.4]} />
        <meshStandardMaterial color="#fb7185" roughness={0.7} />
      </mesh>

      {/* North Wall (Entrance/Exit Facade, Z = 43.5) */}
      {/* Left Wall Segment */}
      <mesh position={[-12.3, 1.6, 43.5]}>
        <boxGeometry args={[1.8, 3.2, 0.08]} />
        <meshStandardMaterial color="#fffdfa" roughness={0.85} />
      </mesh>
      {/* Right Wall Segment */}
      <mesh position={[-9.3, 1.6, 43.5]}>
        <boxGeometry args={[1.8, 3.2, 0.08]} />
        <meshStandardMaterial color="#fffdfa" roughness={0.85} />
      </mesh>
      {/* Header Above Doorway */}
      <mesh position={[-10.8, 2.75, 43.5]}>
        <boxGeometry args={[1.4, 0.9, 0.08]} />
        <meshStandardMaterial color="#fffdfa" roughness={0.85} />
      </mesh>

      {/* Transparent Glass Exit Doors with Stainless Steel Handles */}
      <group position={[-10.8, 1.15, 43.45]}>
        <mesh position={[-0.34, 0, 0]}>
          <boxGeometry args={[0.62, 2.2, 0.04]} />
          <meshStandardMaterial color="#38bdf8" roughness={0.1} transparent opacity={0.35} />
        </mesh>
        <mesh position={[0.34, 0, 0]}>
          <boxGeometry args={[0.62, 2.2, 0.04]} />
          <meshStandardMaterial color="#38bdf8" roughness={0.1} transparent opacity={0.35} />
        </mesh>
        {/* Door Frames */}
        <mesh position={[-0.34, 0, 0]}>
          <boxGeometry args={[0.66, 2.24, 0.02]} />
          <meshStandardMaterial color="#334155" wireframe />
        </mesh>
        <mesh position={[0.34, 0, 0]}>
          <boxGeometry args={[0.66, 2.24, 0.02]} />
          <meshStandardMaterial color="#334155" wireframe />
        </mesh>
        {/* Stainless Steel Pull Handles */}
        <mesh position={[-0.08, 0, -0.035]}>
          <cylinderGeometry args={[0.015, 0.015, 0.45, 8]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0.08, 0, -0.035]}>
          <cylinderGeometry args={[0.015, 0.015, 0.45, 8]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* ============================================================ */}
      {/* 4. COORDINATOR HANA & INSTRUCTOR TABLE                       */}
      {/* ============================================================ */}
      {/* Coordinator Hana NPC */}
      <CoordinatorHana isTalking={isTalking} />

      {/* Instructor Desk */}
      <group position={[-10.8, 0, 41.4]}>
        {/* Tabletop in Birch Wood with Coral Trim */}
        <mesh position={[0, 0.74, 0]}>
          <boxGeometry args={[1.6, 0.06, 0.7]} />
          <meshStandardMaterial color="#fef3c7" roughness={0.5} />
        </mesh>
        {/* Front Panel (Muted Teal with Coral Accent) */}
        <mesh position={[0, 0.38, 0.31]}>
          <boxGeometry args={[1.56, 0.68, 0.04]} />
          <meshStandardMaterial color="#0f766e" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.38, 0.332]}>
          <boxGeometry args={[1.5, 0.02, 0.01]} />
          <meshStandardMaterial color="#fb7185" roughness={0.5} />
        </mesh>
        {/* Steel Legs */}
        {[
          [-0.72, 0.36, -0.28],
          [0.72, 0.36, -0.28],
          [-0.72, 0.36, 0.28],
          [0.72, 0.36, 0.28]
        ].map((p, idx) => (
          <mesh key={`desk-leg-${idx}`} position={p}>
            <cylinderGeometry args={[0.025, 0.02, 0.7, 8]} />
            <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.3} />
          </mesh>
        ))}

        {/* Desk Laptop */}
        <group position={[-0.35, 0.77, -0.05]} rotation={[0, 0.1, 0]}>
          <mesh position={[0, 0.005, 0]}>
            <boxGeometry args={[0.3, 0.012, 0.2]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.1, -0.09]} rotation={[-0.25, 0, 0]}>
            <boxGeometry args={[0.3, 0.18, 0.01]} />
            <meshStandardMaterial color="#0f172a" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.1, -0.084]} rotation={[-0.25, 0, 0]}>
            <planeGeometry args={[0.27, 0.15]} />
            <meshStandardMaterial color="#f43f5e" emissive="#f43f5e" emissiveIntensity={0.5} />
          </mesh>
        </group>

        {/* Attendance Clipboard & Pen */}
        <mesh position={[0.25, 0.775, 0.05]}>
          <boxGeometry args={[0.24, 0.01, 0.32]} />
          <meshStandardMaterial color="#deb887" roughness={0.6} />
        </mesh>
        <mesh position={[0.25, 0.782, 0.05]}>
          <planeGeometry args={[0.2, 0.28]} />
          <meshStandardMaterial color="#ffffff" roughness={0.4} />
        </mesh>

        {/* Table Bell & Ceramic Pen Cup */}
        <mesh position={[0.0, 0.785, 0.1]}>
          <cylinderGeometry args={[0.035, 0.045, 0.03, 10]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0.5, 0.81, -0.1]}>
          <cylinderGeometry args={[0.04, 0.035, 0.08, 10]} />
          <meshStandardMaterial color="#0d9488" roughness={0.4} />
        </mesh>

        {/* Desk Nameplate ("HANA • ACTIVITY COORDINATOR") */}
        <group position={[-0.1, 0.78, 0.25]}>
          <mesh>
            <boxGeometry args={[0.24, 0.045, 0.03]} />
            <meshStandardMaterial color="#0f766e" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0, 0.016]}>
            <planeGeometry args={[0.22, 0.035]} />
            <meshStandardMaterial color="#fef08a" metalness={0.7} roughness={0.3} />
          </mesh>
        </group>
      </group>

      {/* Coordinator Chair behind Desk */}
      <ActivityChair position={[-10.8, 0, 40.75]} rotation={[0, 0, 0]} color="#0f766e" />

      {/* ============================================================ */}
      {/* 5. ART & CRAFT WORKSHOP TABLE (West Side)                    */}
      {/* ============================================================ */}
      <group position={[-12.2, 0, 41.8]}>
        {/* Sturdy Craft Table */}
        <mesh position={[0, 0.72, 0]}>
          <boxGeometry args={[1.3, 0.05, 0.9]} />
          <meshStandardMaterial color="#fef3c7" roughness={0.5} />
        </mesh>
        {[
          [-0.58, 0.35, -0.38],
          [0.58, 0.35, -0.38],
          [-0.58, 0.35, 0.38],
          [0.58, 0.35, 0.38]
        ].map((p, idx) => (
          <mesh key={`craft-leg-${idx}`} position={p}>
            <cylinderGeometry args={[0.02, 0.02, 0.7, 8]} />
            <meshStandardMaterial color="#475569" metalness={0.6} roughness={0.3} />
          </mesh>
        ))}

        {/* Art Paper Sheets & Drawing Mats */}
        <mesh position={[-0.25, 0.75, 0]}>
          <boxGeometry args={[0.42, 0.01, 0.32]} />
          <meshStandardMaterial color="#ffffff" roughness={0.4} />
        </mesh>
        <mesh position={[0.25, 0.75, 0]}>
          <boxGeometry args={[0.42, 0.01, 0.32]} />
          <meshStandardMaterial color="#fef9c3" roughness={0.4} />
        </mesh>

        {/* Small Paint Containers (Blue, Red, Yellow, Green) */}
        {[
          { pos: [-0.08, 0.765, -0.25], col: "#0284c7" },
          { pos: [0.0, 0.765, -0.25], col: "#e11d48" },
          { pos: [0.08, 0.765, -0.25], col: "#eab308" },
          { pos: [0.16, 0.765, -0.25], col: "#16a34a" }
        ].map((pot, idx) => (
          <mesh key={`paint-${idx}`} position={pot.pos}>
            <cylinderGeometry args={[0.025, 0.025, 0.035, 8]} />
            <meshStandardMaterial color={pot.col} roughness={0.4} />
          </mesh>
        ))}

        {/* Paintbrush Cup & Brushes */}
        <group position={[-0.45, 0.79, -0.25]}>
          <mesh>
            <cylinderGeometry args={[0.035, 0.03, 0.08, 8]} />
            <meshStandardMaterial color="#f1f5f9" roughness={0.3} />
          </mesh>
          <mesh position={[0.01, 0.06, 0]} rotation={[0, 0, 0.15]}>
            <cylinderGeometry args={[0.004, 0.004, 0.14, 6]} />
            <meshStandardMaterial color="#b45309" roughness={0.6} />
          </mesh>
          <mesh position={[-0.01, 0.06, 0.01]} rotation={[0.1, 0, -0.15]}>
            <cylinderGeometry args={[0.004, 0.004, 0.14, 6]} />
            <meshStandardMaterial color="#b45309" roughness={0.6} />
          </mesh>
        </group>

        {/* Colored Pencil Tin Box */}
        <mesh position={[0.4, 0.755, -0.2]}>
          <boxGeometry args={[0.18, 0.015, 0.12]} />
          <meshStandardMaterial color="#e11d48" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* 2 Activity Chairs around Table */}
        <ActivityChair position={[-0.75, 0, 0]} rotation={[0, Math.PI / 2, 0]} color="#fb7185" />
        <ActivityChair position={[0.75, 0, 0]} rotation={[0, -Math.PI / 2, 0]} color="#fb7185" />
      </group>

      {/* ============================================================ */}
      {/* 6. LANGUAGE CLUB & BOARD GAME TABLE (East Side)              */}
      {/* ============================================================ */}
      <group position={[-9.4, 0, 41.8]}>
        {/* Table */}
        <mesh position={[0, 0.72, 0]}>
          <boxGeometry args={[1.3, 0.05, 0.9]} />
          <meshStandardMaterial color="#fef3c7" roughness={0.5} />
        </mesh>
        {[
          [-0.58, 0.35, -0.38],
          [0.58, 0.35, -0.38],
          [-0.58, 0.35, 0.38],
          [0.58, 0.35, 0.38]
        ].map((p, idx) => (
          <mesh key={`game-leg-${idx}`} position={p}>
            <cylinderGeometry args={[0.02, 0.02, 0.7, 8]} />
            <meshStandardMaterial color="#475569" metalness={0.6} roughness={0.3} />
          </mesh>
        ))}

        {/* Board Game Box ("VILLAGE WORDS") */}
        <group position={[0, 0.76, 0]}>
          <mesh>
            <boxGeometry args={[0.34, 0.04, 0.34]} />
            <meshStandardMaterial color="#0284c7" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.022, 0]}>
            <planeGeometry args={[0.3, 0.3]} />
            <meshStandardMaterial color="#38bdf8" roughness={0.4} />
          </mesh>
        </group>

        {/* English Notebooks & Cards */}
        <mesh position={[-0.38, 0.755, 0.15]}>
          <boxGeometry args={[0.18, 0.015, 0.24]} />
          <meshStandardMaterial color="#10b981" roughness={0.5} />
        </mesh>
        <mesh position={[0.38, 0.755, 0.15]}>
          <boxGeometry args={[0.18, 0.015, 0.24]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.5} />
        </mesh>

        {/* 2 Activity Chairs around Table */}
        <ActivityChair position={[-0.75, 0, 0]} rotation={[0, Math.PI / 2, 0]} color="#0d9488" />
        <ActivityChair position={[0.75, 0, 0]} rotation={[0, -Math.PI / 2, 0]} color="#0d9488" />
      </group>

      {/* ============================================================ */}
      {/* 7. STORAGE, MATERIALS & WATER DISPENSER                      */}
      {/* ============================================================ */}
      {/* Craft Materials Open Cubby Shelving Unit (West Wall) */}
      <group position={[-13.0, 0, 40.7]}>
        <mesh position={[0, 0.85, 0]}>
          <boxGeometry args={[0.32, 1.7, 0.9]} />
          <meshStandardMaterial color="#deb887" roughness={0.6} />
        </mesh>
        {/* Storage Bins (Red, Teal, Yellow, Blue) */}
        {[
          { pos: [0.03, 0.25, -0.22], col: "#f43f5e" },
          { pos: [0.03, 0.25, 0.22], col: "#0d9488" },
          { pos: [0.03, 0.65, -0.22], col: "#eab308" },
          { pos: [0.03, 0.65, 0.22], col: "#0284c7" }
        ].map((bin, idx) => (
          <mesh key={`bin-${idx}`} position={bin.pos}>
            <boxGeometry args={[0.26, 0.26, 0.34]} />
            <meshStandardMaterial color={bin.col} roughness={0.4} />
          </mesh>
        ))}
        {/* Folded Yoga/Activity Exercise Mats */}
        <mesh position={[0.03, 1.1, -0.2]}>
          <cylinderGeometry args={[0.07, 0.07, 0.35, 12]} rotation={[0, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#a855f7" roughness={0.8} />
        </mesh>
        <mesh position={[0.03, 1.1, 0.2]}>
          <cylinderGeometry args={[0.07, 0.07, 0.35, 12]} rotation={[0, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#06b6d4" roughness={0.8} />
        </mesh>
        {/* Craft Paper Roll / Sketch Pads */}
        <mesh position={[0.03, 1.45, 0]}>
          <boxGeometry args={[0.24, 0.22, 0.6]} />
          <meshStandardMaterial color="#ffffff" roughness={0.4} />
        </mesh>
      </group>

      {/* Community Lending Bookshelf & Supply Cabinet (East Wall) */}
      <group position={[-8.6, 0, 40.7]}>
        <mesh position={[0, 0.85, 0]}>
          <boxGeometry args={[0.32, 1.7, 0.9]} />
          <meshStandardMaterial color="#deb887" roughness={0.6} />
        </mesh>
        {/* Row of Books on Middle Shelf */}
        {[
          { pos: [-0.03, 0.95, -0.3], col: "#0284c7", w: 0.12 },
          { pos: [-0.03, 0.95, -0.15], col: "#e11d48", w: 0.14 },
          { pos: [-0.03, 0.95, 0.0], col: "#10b981", w: 0.13 },
          { pos: [-0.03, 0.95, 0.15], col: "#f59e0b", w: 0.14 },
          { pos: [-0.03, 0.95, 0.3], col: "#8b5cf6", w: 0.12 }
        ].map((book, idx) => (
          <mesh key={`comm-book-${idx}`} position={book.pos}>
            <boxGeometry args={[0.22, 0.25, book.w]} />
            <meshStandardMaterial color={book.col} roughness={0.5} />
          </mesh>
        ))}
        {/* Board Games on Top Shelf */}
        <mesh position={[-0.03, 1.4, -0.18]}>
          <boxGeometry args={[0.24, 0.08, 0.34]} />
          <meshStandardMaterial color="#f43f5e" roughness={0.4} />
        </mesh>
        <mesh position={[-0.03, 1.4, 0.18]}>
          <boxGeometry args={[0.24, 0.08, 0.34]} />
          <meshStandardMaterial color="#0284c7" roughness={0.4} />
        </mesh>
        {/* Lower Cabinet Doors */}
        <mesh position={[-0.03, 0.35, 0]}>
          <boxGeometry args={[0.28, 0.6, 0.84]} />
          <meshStandardMaterial color="#0f766e" roughness={0.6} />
        </mesh>
      </group>

      {/* Water Dispenser with Paper Cup Stack (East Wall near entrance) */}
      <group position={[-8.65, 0, 42.6]}>
        {/* Stand Cabinet */}
        <mesh position={[0, 0.45, 0]}>
          <boxGeometry args={[0.34, 0.9, 0.34]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.4} />
        </mesh>
        {/* Water Bottle Inverted on Top */}
        <mesh position={[0, 1.1, 0]}>
          <cylinderGeometry args={[0.13, 0.13, 0.36, 12]} />
          <meshStandardMaterial color="#38bdf8" roughness={0.1} transparent opacity={0.6} />
        </mesh>
        {/* Taps & Drip Tray */}
        <mesh position={[-0.14, 0.72, 0]}>
          <boxGeometry args={[0.06, 0.04, 0.12]} />
          <meshStandardMaterial color="#334155" roughness={0.5} />
        </mesh>
        {/* Paper Cups Stack */}
        <mesh position={[0, 0.94, -0.1]}>
          <cylinderGeometry args={[0.03, 0.025, 0.14, 8]} />
          <meshStandardMaterial color="#ffffff" roughness={0.5} />
        </mesh>
      </group>

      {/* Stack of 3 Community Activity Chairs in Corner */}
      <group position={[-12.95, 0, 42.9]}>
        <ActivityChair position={[0, 0, 0]} rotation={[0, 0.4, 0]} color="#fb7185" />
        <ActivityChair position={[0, 0.08, 0]} rotation={[0, 0.4, 0]} color="#0d9488" />
        <ActivityChair position={[0, 0.16, 0]} rotation={[0, 0.4, 0]} color="#eab308" />
      </group>

      {/* Analog Wall Clock on South Wall */}
      <group position={[-10.8, 2.5, 40.15]}>
        <mesh>
          <cylinderGeometry args={[0.2, 0.2, 0.03, 20]} />
          <meshStandardMaterial color="#0f766e" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0, 0.018]}>
          <cylinderGeometry args={[0.17, 0.17, 0.01, 20]} />
          <meshStandardMaterial color="#fffdfa" roughness={0.3} />
        </mesh>
        {/* Hour & Minute Hands */}
        <mesh position={[0, 0.04, 0.026]}>
          <boxGeometry args={[0.014, 0.09, 0.005]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <mesh position={[0.04, 0, 0.026]} rotation={[0, 0, -Math.PI / 3]}>
          <boxGeometry args={[0.01, 0.12, 0.005]} />
          <meshStandardMaterial color="#f43f5e" />
        </mesh>
      </group>

      {/* ============================================================ */}
      {/* 8. SIGNBOARDS, SCHEDULE BOARD & POSTERS                      */}
      {/* ============================================================ */}
      {/* Main Bilingual Wall Signboard ("VILLAGE ACTIVITY CENTER" / "마을 활동센터") */}
      {mainSignTexture && (
        <group position={[-10.8, 2.05, 40.15]}>
          <mesh>
            <boxGeometry args={[1.6, 0.72, 0.02]} />
            <meshStandardMaterial color="#1e293b" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0, 0.012]}>
            <planeGeometry args={[1.56, 0.68]} />
            <meshBasicMaterial map={mainSignTexture} />
          </mesh>
        </group>
      )}

      {/* Secondary Signboard on East Wall ("HOBBY & COMMUNITY ACTIVITIES" / "취미 및 주민 활동") */}
      {secondarySignTexture && (
        <group position={[-8.44, 2.1, 41.7]} rotation={[0, -Math.PI / 2, 0]}>
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

      {/* Activity Schedule Board on West Wall (1024x512) */}
      {scheduleBoardTexture && (
        <group position={[-13.16, 1.85, 42.1]} rotation={[0, Math.PI / 2, 0]}>
          <mesh>
            <boxGeometry args={[1.8, 1.0, 0.02]} />
            <meshStandardMaterial color="#cbd5e1" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0, 0.012]}>
            <planeGeometry args={[1.76, 0.96]} />
            <meshBasicMaterial map={scheduleBoardTexture} />
          </mesh>
        </group>
      )}

      {/* Community Poster ("JOIN OUR COMMUNITY" / "함께하는 마을") on East Wall (512x512) */}
      {communityPosterTexture && (
        <group position={[-8.44, 1.85, 43.0]} rotation={[0, -Math.PI / 2, 0]}>
          <mesh>
            <boxGeometry args={[0.85, 0.85, 0.02]} />
            <meshStandardMaterial color="#f43f5e" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0, 0.012]}>
            <planeGeometry args={[0.81, 0.81]} />
            <meshBasicMaterial map={communityPosterTexture} />
          </mesh>
        </group>
      )}

      {/* ============================================================ */}
      {/* 9. POTTED PLANTS                                             */}
      {/* ============================================================ */}
      <ActivityPlant position={[-12.9, 0, 40.35]} />
      <ActivityPlant position={[-8.65, 0, 40.35]} />
    </group>
  );
}

export default ActivityCenter;
