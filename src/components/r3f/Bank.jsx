import React, { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

/**
 * Stylized low-poly David (Bank Employee / Teller)
 * Professional navy suit, white dress shirt, silk tie, gold name badge.
 * Subtly animated with natural idle breathing and talking gestures.
 */
function BankEmployeeDavid({ isTalking = false }) {
  const headRef = useRef();
  const leftArmRef = useRef();
  const rightArmRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (headRef.current) {
      headRef.current.position.y = 1.38 + Math.sin(t * 2) * 0.005;
      if (isTalking) {
        headRef.current.rotation.y = Math.sin(t * 5) * 0.07;
        headRef.current.rotation.x = Math.sin(t * 7) * 0.04;
      } else {
        headRef.current.rotation.y = Math.sin(t * 0.7) * 0.03;
        headRef.current.rotation.x = 0;
      }
    }
    if (rightArmRef.current && isTalking) {
      rightArmRef.current.rotation.x = -0.35 + Math.sin(t * 6) * 0.14;
    }
    if (leftArmRef.current && isTalking) {
      leftArmRef.current.rotation.x = -0.35 - Math.sin(t * 6) * 0.12;
    }
  });

  return (
    <group position={[-23.0, 0, -1.85]}>
      {/* Trousers / Legs */}
      <mesh position={[-0.12, 0.45, 0]}>
        <cylinderGeometry args={[0.08, 0.09, 0.85, 12]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} />
      </mesh>
      <mesh position={[0.12, 0.45, 0]}>
        <cylinderGeometry args={[0.08, 0.09, 0.85, 12]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} />
      </mesh>

      {/* Formal Leather Shoes */}
      <mesh position={[-0.12, 0.04, 0.04]}>
        <boxGeometry args={[0.13, 0.08, 0.22]} />
        <meshStandardMaterial color="#0f172a" roughness={0.4} />
      </mesh>
      <mesh position={[0.12, 0.04, 0.04]}>
        <boxGeometry args={[0.13, 0.08, 0.22]} />
        <meshStandardMaterial color="#0f172a" roughness={0.4} />
      </mesh>

      {/* Belt */}
      <mesh position={[0, 0.88, 0]}>
        <boxGeometry args={[0.39, 0.05, 0.24]} />
        <meshStandardMaterial color="#0f172a" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.88, 0.122]}>
        <boxGeometry args={[0.07, 0.05, 0.02]} />
        <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Torso / Navy Blazer Suit */}
      <mesh position={[0, 1.12, 0]}>
        <boxGeometry args={[0.42, 0.48, 0.26]} />
        <meshStandardMaterial color="#1e293b" roughness={0.6} />
      </mesh>

      {/* Crisp White Shirt Collar & Navy Silk Tie */}
      <mesh position={[0, 1.25, 0.12]}>
        <boxGeometry args={[0.16, 0.12, 0.04]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} />
      </mesh>
      {/* Silk Tie */}
      <mesh position={[0, 1.12, 0.135]}>
        <boxGeometry args={[0.06, 0.26, 0.02]} />
        <meshStandardMaterial color="#1d4ed8" roughness={0.4} />
      </mesh>

      {/* Gold Name Badge: DAVID */}
      <mesh position={[0.13, 1.22, 0.135]}>
        <boxGeometry args={[0.08, 0.035, 0.015]} />
        <meshStandardMaterial color="#ffd700" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Arms & Hands */}
      {/* Left Arm */}
      <group position={[-0.26, 1.28, 0]}>
        <mesh position={[0, -0.22, 0]}>
          <cylinderGeometry args={[0.06, 0.065, 0.44, 10]} />
          <meshStandardMaterial color="#1e293b" roughness={0.6} />
        </mesh>
        {/* White shirt cuff */}
        <mesh position={[0, -0.44, 0]}>
          <cylinderGeometry args={[0.062, 0.062, 0.04, 10]} />
          <meshStandardMaterial color="#ffffff" roughness={0.3} />
        </mesh>
        {/* Hand */}
        <mesh ref={leftArmRef} position={[0, -0.5, 0]}>
          <sphereGeometry args={[0.05, 10, 10]} />
          <meshStandardMaterial color="#f5d0b0" roughness={0.6} />
        </mesh>
      </group>

      {/* Right Arm */}
      <group position={[0.26, 1.28, 0]}>
        <mesh position={[0, -0.22, 0]}>
          <cylinderGeometry args={[0.06, 0.065, 0.44, 10]} />
          <meshStandardMaterial color="#1e293b" roughness={0.6} />
        </mesh>
        {/* White shirt cuff */}
        <mesh position={[0, -0.44, 0]}>
          <cylinderGeometry args={[0.062, 0.062, 0.04, 10]} />
          <meshStandardMaterial color="#ffffff" roughness={0.3} />
        </mesh>
        {/* Hand */}
        <mesh ref={rightArmRef} position={[0, -0.5, 0]}>
          <sphereGeometry args={[0.05, 10, 10]} />
          <meshStandardMaterial color="#f5d0b0" roughness={0.6} />
        </mesh>
      </group>

      {/* Head Group */}
      <group ref={headRef} position={[0, 1.38, 0]}>
        {/* Neck */}
        <mesh position={[0, 0.04, 0]}>
          <cylinderGeometry args={[0.06, 0.07, 0.1, 10]} />
          <meshStandardMaterial color="#f5d0b0" roughness={0.6} />
        </mesh>
        {/* Head */}
        <mesh position={[0, 0.18, 0]}>
          <boxGeometry args={[0.22, 0.24, 0.22]} />
          <meshStandardMaterial color="#f5d0b0" roughness={0.6} />
        </mesh>
        {/* Short Styled Dark Brown Hair */}
        <mesh position={[0, 0.31, -0.01]}>
          <boxGeometry args={[0.24, 0.08, 0.24]} />
          <meshStandardMaterial color="#3d2314" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.25, -0.1]}>
          <boxGeometry args={[0.23, 0.16, 0.06]} />
          <meshStandardMaterial color="#3d2314" roughness={0.8} />
        </mesh>
        {/* Friendly Eyes */}
        <mesh position={[-0.05, 0.2, 0.113]}>
          <boxGeometry args={[0.035, 0.025, 0.01]} />
          <meshStandardMaterial color="#1e293b" roughness={0.3} />
        </mesh>
        <mesh position={[0.05, 0.2, 0.113]}>
          <boxGeometry args={[0.035, 0.025, 0.01]} />
          <meshStandardMaterial color="#1e293b" roughness={0.3} />
        </mesh>
        {/* Polite Smile */}
        <mesh position={[0, 0.12, 0.113]}>
          <boxGeometry args={[0.06, 0.015, 0.01]} />
          <meshStandardMaterial color="#b97a57" roughness={0.5} />
        </mesh>
      </group>

      {/* Office Task Chair for Employee */}
      <group position={[0, 0, -0.4]}>
        <mesh position={[0, 0.45, 0]}>
          <boxGeometry args={[0.46, 0.08, 0.46]} />
          <meshStandardMaterial color="#334155" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.8, -0.2]}>
          <boxGeometry args={[0.44, 0.6, 0.08]} />
          <meshStandardMaterial color="#334155" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.22, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.44, 8]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.26, 0.26, 0.04, 5]} />
          <meshStandardMaterial color="#475569" roughness={0.5} />
        </mesh>
      </group>
    </group>
  );
}

/**
 * Modern Low-Poly ATM Machine
 */
function ATMUnit({ position, rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Heavy Steel ATM Cabinet */}
      <mesh position={[0, 0.8, 0]}>
        <boxGeometry args={[0.78, 1.6, 0.72]} />
        <meshStandardMaterial color="#334155" roughness={0.6} />
      </mesh>
      {/* Front Beveled Panel */}
      <mesh position={[0, 0.8, 0.37]}>
        <boxGeometry args={[0.72, 1.52, 0.06]} />
        <meshStandardMaterial color="#1e293b" roughness={0.5} />
      </mesh>
      {/* Blue Header Box */}
      <mesh position={[0, 1.44, 0.39]}>
        <boxGeometry args={[0.66, 0.2, 0.04]} />
        <meshStandardMaterial color="#0284c7" emissive="#0369a1" emissiveIntensity={0.6} />
      </mesh>
      {/* Digital Touchscreen */}
      <mesh position={[0, 1.05, 0.4]}>
        <boxGeometry args={[0.42, 0.32, 0.02]} />
        <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.7} />
      </mesh>
      {/* Keypad */}
      <mesh position={[0, 0.74, 0.42]} rotation={[0.4, 0, 0]}>
        <boxGeometry args={[0.28, 0.18, 0.03]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Card Reader with Green LED */}
      <mesh position={[0.22, 0.84, 0.41]}>
        <boxGeometry args={[0.1, 0.04, 0.02]} />
        <meshStandardMaterial color="#22c55e" emissive="#16a34a" emissiveIntensity={0.8} />
      </mesh>
      {/* Cash Dispenser Slot */}
      <mesh position={[0, 0.52, 0.41]}>
        <boxGeometry args={[0.34, 0.06, 0.02]} />
        <meshStandardMaterial color="#0f172a" roughness={0.9} />
      </mesh>
      {/* Receipt Slot */}
      <mesh position={[-0.2, 0.84, 0.41]}>
        <boxGeometry args={[0.08, 0.02, 0.02]} />
        <meshStandardMaterial color="#0f172a" roughness={0.9} />
      </mesh>
      {/* Privacy Side Fins */}
      <mesh position={[-0.4, 0.95, 0.25]}>
        <boxGeometry args={[0.04, 1.0, 0.35]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} />
      </mesh>
      <mesh position={[0.4, 0.95, 0.25]}>
        <boxGeometry args={[0.04, 1.0, 0.35]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} />
      </mesh>
    </group>
  );
}

/**
 * Modern Bank Waiting Chair
 */
function WaitingChair({ position, rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Seat Cushion */}
      <mesh position={[0, 0.42, 0]}>
        <boxGeometry args={[0.62, 0.1, 0.58]} />
        <meshStandardMaterial color="#1e3a8a" roughness={0.6} />
      </mesh>
      {/* Backrest */}
      <mesh position={[0, 0.76, -0.24]}>
        <boxGeometry args={[0.62, 0.54, 0.1]} />
        <meshStandardMaterial color="#1e3a8a" roughness={0.6} />
      </mesh>
      {/* Chrome Steel Legs */}
      <mesh position={[-0.27, 0.2, -0.22]}>
        <cylinderGeometry args={[0.02, 0.02, 0.4, 8]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0.27, 0.2, -0.22]}>
        <cylinderGeometry args={[0.02, 0.02, 0.4, 8]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[-0.27, 0.2, 0.22]}>
        <cylinderGeometry args={[0.02, 0.02, 0.4, 8]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0.27, 0.2, 0.22]}>
        <cylinderGeometry args={[0.02, 0.02, 0.4, 8]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  );
}

/**
 * Potted Bank Plant
 */
function BankPottedPlant({ position }) {
  return (
    <group position={position}>
      {/* Ceramic White Planter */}
      <mesh position={[0, 0.32, 0]}>
        <cylinderGeometry args={[0.24, 0.18, 0.64, 12]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.3} />
      </mesh>
      {/* Soil */}
      <mesh position={[0, 0.63, 0]}>
        <cylinderGeometry args={[0.23, 0.23, 0.04, 12]} />
        <meshStandardMaterial color="#3e2723" roughness={0.9} />
      </mesh>
      {/* Foliage Spheres / Cones */}
      <mesh position={[0, 0.95, 0]}>
        <sphereGeometry args={[0.3, 10, 10]} />
        <meshStandardMaterial color="#15803d" roughness={0.7} />
      </mesh>
      <mesh position={[0.1, 1.15, -0.05]}>
        <sphereGeometry args={[0.24, 10, 10]} />
        <meshStandardMaterial color="#16a34a" roughness={0.7} />
      </mesh>
      <mesh position={[-0.1, 1.1, 0.08]}>
        <sphereGeometry args={[0.22, 10, 10]} />
        <meshStandardMaterial color="#15803d" roughness={0.7} />
      </mesh>
    </group>
  );
}

/**
 * Bank Interior Component:
 * Clean, optimized, low-poly bank reception interior inside the ground floor of skyscraper.glb.
 * Renders ONLY when player is inside the Bank (currentLocation === "Bank").
 */
export function Bank({ isTalking = false, currentLocation = "outside" }) {
  // CRITICAL OPTIMIZATION: Only render when inside Bank
  const isInside = currentLocation === "Bank";

  // Reusable Materials
  const materials = useMemo(() => {
    return {
      tileFloor: new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.35 }),
      tileBorder: new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.4 }),
      welcomeMat: new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.85 }),
      wallBase: new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.7 }),
      wallAccentNavy: new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.6 }),
      wallWoodSlat: new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5 }),
      counterBody: new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4 }),
      counterMarbleTop: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 }),
      counterGoldTrim: new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.8, roughness: 0.3 }),
      glassPartition: new THREE.MeshStandardMaterial({ color: 0xe0f2fe, transparent: true, opacity: 0.4, roughness: 0.1 }),
      metalChrome: new THREE.MeshStandardMaterial({ color: 0xcbd5e1, metalness: 0.85, roughness: 0.2 }),
      exitGreen: new THREE.MeshStandardMaterial({ color: 0x15803d, emissive: 0x16a34a, emissiveIntensity: 0.8 }),
      ceilingMat: new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.9 })
    };
  }, []);

  // Main Wall Sign Texture: "VILLAGE BANK / 마을은행"
  const bankSignTexture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, 512, 128);
    ctx.strokeStyle = "#d4af37";
    ctx.lineWidth = 6;
    ctx.strokeRect(6, 6, 500, 116);
    ctx.fillStyle = "#d4af37";
    ctx.font = "bold 42px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("🏛️ VILLAGE BANK", 256, 48);
    ctx.font = "bold 24px sans-serif";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText("마 을 은 행", 256, 92);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);

  // Digital Rates Board Texture
  const ratesBoardTexture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.fillStyle = "#090d16";
    ctx.fillRect(0, 0, 256, 256);
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 4;
    ctx.strokeRect(4, 4, 248, 248);
    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 18px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("EXCHANGE RATES", 128, 36);
    ctx.font = "16px monospace";
    ctx.fillStyle = "#22c55e";
    ctx.fillText("USD  1,320.50 ▲", 128, 80);
    ctx.fillText("EUR  1,442.10 ▲", 128, 120);
    ctx.fillStyle = "#f87171";
    ctx.fillText("JPY    912.40 ▼", 128, 160);
    ctx.fillStyle = "#94a3b8";
    ctx.font = "14px sans-serif";
    ctx.fillText("DEPOSIT RATE: 3.8%", 128, 210);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);

  // Do not render anything when outside or in other buildings
  if (!isInside) return null;

  return (
    <group>
      {/* ============================================================ */}
      {/* 1. BANK INTERIOR LIGHTING (2 Lightweight Lights, No Shadows) */}
      {/* ============================================================ */}
      <ambientLight intensity={0.9} color="#f8fafc" />
      <directionalLight position={[-23.0, 4.5, 0.5]} intensity={0.55} color="#ffffff" />
      <pointLight position={[-23.0, 2.7, -0.8]} intensity={1.1} distance={7} color="#ffffff" />

      {/* ============================================================ */}
      {/* 2. FLOOR & CEILING                                           */}
      {/* ============================================================ */}
      {/* Main Polished Porcelain Tile Floor */}
      <mesh position={[-23.0, 0.01, -0.5]} material={materials.tileFloor}>
        <boxGeometry args={[8.4, 0.02, 5.0]} />
      </mesh>
      {/* Floor Perimeter Accent Inlay */}
      <mesh position={[-23.0, 0.015, -0.5]} material={materials.tileBorder}>
        <boxGeometry args={[8.1, 0.01, 4.7]} />
      </mesh>
      <mesh position={[-23.0, 0.02, -0.5]} material={materials.tileFloor}>
        <boxGeometry args={[7.9, 0.01, 4.5]} />
      </mesh>
      {/* Entrance Welcome Mat */}
      <mesh position={[-23.0, 0.025, 1.3]} material={materials.welcomeMat}>
        <boxGeometry args={[2.4, 0.01, 1.0]} />
      </mesh>

      {/* Suspended Modular Ceiling with Flush LED Panels */}
      <mesh position={[-23.0, 3.2, -0.5]} material={materials.ceilingMat}>
        <boxGeometry args={[8.4, 0.05, 5.0]} />
      </mesh>
      {/* Recessed LED Ceiling Lights */}
      <mesh position={[-23.0, 3.17, -0.8]}>
        <boxGeometry args={[2.4, 0.02, 0.8]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[-23.0, 3.17, 0.8]}>
        <boxGeometry args={[2.4, 0.02, 0.8]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.8} />
      </mesh>

      {/* ============================================================ */}
      {/* 3. WALLS & STOREFRONT ENTRANCE                               */}
      {/* ============================================================ */}
      {/* North / Back Accent Wall (Behind Counter & David) */}
      <mesh position={[-23.0, 1.6, -3.0]} material={materials.wallAccentNavy}>
        <boxGeometry args={[8.4, 3.2, 0.1]} />
      </mesh>
      {/* Architectural vertical wood slats on back wall */}
      <mesh position={[-23.0, 1.6, -2.96]} material={materials.wallWoodSlat}>
        <boxGeometry args={[4.8, 3.0, 0.04]} />
      </mesh>

      {/* West / Left Wall */}
      <mesh position={[-27.2, 1.6, -0.5]} material={materials.wallBase}>
        <boxGeometry args={[0.1, 3.2, 5.0]} />
      </mesh>
      <mesh position={[-27.14, 0.45, -0.5]} material={materials.wallAccentNavy}>
        <boxGeometry args={[0.04, 0.9, 5.0]} />
      </mesh>

      {/* East / Right Wall */}
      <mesh position={[-18.8, 1.6, -0.5]} material={materials.wallBase}>
        <boxGeometry args={[0.1, 3.2, 5.0]} />
      </mesh>
      <mesh position={[-18.86, 0.45, -0.5]} material={materials.wallAccentNavy}>
        <boxGeometry args={[0.04, 0.9, 5.0]} />
      </mesh>

      {/* South / Front Wall with Sliding Glass Exit Doors */}
      <mesh position={[-25.6, 1.6, 2.0]} material={materials.wallBase}>
        <boxGeometry args={[3.2, 3.2, 0.1]} />
      </mesh>
      <mesh position={[-20.4, 1.6, 2.0]} material={materials.wallBase}>
        <boxGeometry args={[3.2, 3.2, 0.1]} />
      </mesh>
      <mesh position={[-23.0, 2.85, 2.0]} material={materials.wallBase}>
        <boxGeometry args={[2.0, 0.7, 0.1]} />
      </mesh>

      {/* Double Glass Doors Frame */}
      <mesh position={[-23.0, 1.25, 2.0]} material={materials.metalChrome}>
        <boxGeometry args={[2.0, 2.5, 0.08]} />
      </mesh>
      <mesh position={[-23.0, 1.25, 2.01]} material={materials.glassPartition}>
        <boxGeometry args={[1.88, 2.38, 0.03]} />
      </mesh>
      {/* Stainless Steel Door Handles */}
      <mesh position={[-23.08, 1.1, 1.95]}>
        <cylinderGeometry args={[0.015, 0.015, 0.5, 8]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[-22.92, 1.1, 1.95]}>
        <cylinderGeometry args={[0.015, 0.015, 0.5, 8]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Illuminated Green EXIT / 출구 Sign */}
      <mesh position={[-23.0, 2.55, 1.94]} material={materials.exitGreen}>
        <boxGeometry args={[0.65, 0.22, 0.04]} />
      </mesh>

      {/* ============================================================ */}
      {/* 4. WALL SIGNAGE & DIGITAL RATE BOARDS                         */}
      {/* ============================================================ */}
      {/* Main "VILLAGE BANK" Signboard on Back Wall */}
      {bankSignTexture && (
        <mesh position={[-23.0, 2.35, -2.93]}>
          <planeGeometry args={[3.4, 0.85]} />
          <meshBasicMaterial map={bankSignTexture} />
        </mesh>
      )}

      {/* Digital Exchange Rates Board on East Wall */}
      {ratesBoardTexture && (
        <mesh position={[-18.74, 1.85, -1.2]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[1.2, 1.2]} />
          <meshBasicMaterial map={ratesBoardTexture} />
        </mesh>
      )}

      {/* Framed Banking License / Artwork on West Wall */}
      <group position={[-27.14, 1.85, 0.9]} rotation={[0, Math.PI / 2, 0]}>
        <mesh material={materials.counterBody}>
          <boxGeometry args={[0.9, 0.65, 0.03]} />
        </mesh>
        <mesh position={[0, 0, 0.02]}>
          <boxGeometry args={[0.82, 0.57, 0.01]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0, 0.026]}>
          <boxGeometry args={[0.7, 0.45, 0.01]} />
          <meshStandardMaterial color="#0284c7" roughness={0.6} />
        </mesh>
      </group>

      {/* ============================================================ */}
      {/* 5. TELLER COUNTER & DESK ACCESSORIES                         */}
      {/* ============================================================ */}
      <group position={[-23.0, 0, -1.2]}>
        {/* Main Navy Counter Structure */}
        <mesh position={[0, 0.52, 0]} material={materials.counterBody}>
          <boxGeometry args={[4.4, 1.04, 0.8]} />
        </mesh>
        {/* Horizontal Gold Accent Trim */}
        <mesh position={[0, 0.65, 0.405]} material={materials.counterGoldTrim}>
          <boxGeometry args={[4.42, 0.04, 0.02]} />
        </mesh>
        {/* Polished White Marble Counter Ledge */}
        <mesh position={[0, 1.06, 0]} material={materials.counterMarbleTop}>
          <boxGeometry args={[4.6, 0.06, 0.9]} />
        </mesh>

        {/* Teller Protective Glass Partitions */}
        <mesh position={[0, 1.48, 0.35]} material={materials.glassPartition}>
          <boxGeometry args={[4.2, 0.78, 0.03]} />
        </mesh>
        {/* Glass Support Posts */}
        {[-2.0, -0.7, 0.7, 2.0].map((xPost, idx) => (
          <mesh key={`post-${idx}`} position={[xPost, 1.48, 0.35]} material={materials.metalChrome}>
            <cylinderGeometry args={[0.02, 0.02, 0.78, 8]} />
          </mesh>
        ))}
        {/* Teller Speaking Slot / Pass-Through Aperture */}
        <mesh position={[0, 1.15, 0.35]}>
          <boxGeometry args={[0.42, 0.12, 0.04]} />
          <meshStandardMaterial color="#1e293b" roughness={0.5} />
        </mesh>

        {/* Countertop Teller Nameplate */}
        <mesh position={[-0.45, 1.11, 0.3]}>
          <boxGeometry args={[0.26, 0.04, 0.06]} />
          <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.3} />
        </mesh>

        {/* Teller Desktop PC Monitor */}
        <group position={[0.25, 1.09, -0.1]}>
          {/* Base Stand */}
          <mesh position={[0, 0.01, 0]} material={materials.metalChrome}>
            <cylinderGeometry args={[0.1, 0.1, 0.02, 12]} />
          </mesh>
          <mesh position={[0, 0.14, -0.04]} material={materials.metalChrome}>
            <cylinderGeometry args={[0.015, 0.015, 0.26, 8]} />
          </mesh>
          {/* LCD Screen Housing */}
          <mesh position={[0, 0.28, 0]}>
            <boxGeometry args={[0.54, 0.34, 0.03]} />
            <meshStandardMaterial color="#1e293b" roughness={0.4} />
          </mesh>
          {/* Glowing Screen facing David */}
          <mesh position={[0, 0.28, -0.017]}>
            <boxGeometry args={[0.5, 0.3, 0.005]} />
            <meshStandardMaterial color="#0284c7" emissive="#0369a1" emissiveIntensity={0.6} />
          </mesh>
          {/* Keyboard */}
          <mesh position={[0, 0.01, -0.22]}>
            <boxGeometry args={[0.38, 0.015, 0.14]} />
            <meshStandardMaterial color="#334155" roughness={0.7} />
          </mesh>
          {/* Mouse & Pad */}
          <mesh position={[0.24, 0.008, -0.22]}>
            <boxGeometry args={[0.14, 0.005, 0.14]} />
            <meshStandardMaterial color="#0f172a" roughness={0.8} />
          </mesh>
          <mesh position={[0.24, 0.018, -0.22]}>
            <boxGeometry args={[0.05, 0.02, 0.08]} />
            <meshStandardMaterial color="#475569" roughness={0.5} />
          </mesh>
        </group>

        {/* Document Trays & Pen Stand */}
        <group position={[-0.8, 1.09, -0.1]}>
          <mesh position={[0, 0.04, 0]}>
            <boxGeometry args={[0.32, 0.08, 0.24]} />
            <meshStandardMaterial color="#475569" roughness={0.6} />
          </mesh>
          {/* White Paper in Tray */}
          <mesh position={[0, 0.085, 0]}>
            <boxGeometry args={[0.29, 0.01, 0.21]} />
            <meshStandardMaterial color="#ffffff" roughness={0.4} />
          </mesh>
          {/* Pen Stand */}
          <mesh position={[0.22, 0.04, 0.06]}>
            <cylinderGeometry args={[0.03, 0.035, 0.08, 10]} />
            <meshStandardMaterial color="#d4af37" metalness={0.7} roughness={0.3} />
          </mesh>
        </group>
      </group>

      {/* ============================================================ */}
      {/* 6. BANK EMPLOYEE (DAVID)                                     */}
      {/* ============================================================ */}
      <BankEmployeeDavid isTalking={isTalking} />

      {/* ============================================================ */}
      {/* 7. ATM MACHINE (WEST WALL)                                   */}
      {/* ============================================================ */}
      <ATMUnit position={[-26.4, 0, 0.2]} rotation={[0, Math.PI / 2, 0]} />

      {/* ============================================================ */}
      {/* 8. WAITING LOUNGE (EAST WALL)                                */}
      {/* ============================================================ */}
      {/* 3 Waiting Chairs */}
      <WaitingChair position={[-19.6, 0, -0.7]} rotation={[0, -Math.PI / 2, 0]} />
      <WaitingChair position={[-19.6, 0, 0.0]} rotation={[0, -Math.PI / 2, 0]} />
      <WaitingChair position={[-19.6, 0, 0.7]} rotation={[0, -Math.PI / 2, 0]} />

      {/* Low Waiting Area Magazine Table */}
      <group position={[-20.6, 0, 0.0]}>
        <mesh position={[0, 0.22, 0]}>
          <boxGeometry args={[0.5, 0.35, 0.9]} />
          <meshStandardMaterial color="#334155" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.4, 0]} material={materials.counterMarbleTop}>
          <boxGeometry args={[0.54, 0.03, 0.94]} />
        </mesh>
        {/* Financial Brochures */}
        <mesh position={[0, 0.42, 0.15]} rotation={[0, 0.1, 0]}>
          <boxGeometry args={[0.18, 0.015, 0.26]} />
          <meshStandardMaterial color="#0284c7" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.42, -0.15]} rotation={[0, -0.15, 0]}>
          <boxGeometry args={[0.18, 0.015, 0.26]} />
          <meshStandardMaterial color="#22c55e" roughness={0.4} />
        </mesh>
      </group>

      {/* ============================================================ */}
      {/* 9. DECORATIVE POTTED PLANTS                                  */}
      {/* ============================================================ */}
      <BankPottedPlant position={[-26.3, 0, -2.2]} />
      <BankPottedPlant position={[-19.6, 0, -2.2]} />
    </group>
  );
}
