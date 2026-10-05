import React, { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

/**
 * Stylized low-poly Officer Alex (Village Police Officer)
 * Friendly, professional officer with police blue uniform shirt, silver badge,
 * duty utility belt, dark navy trousers, black service shoes, and an "ALEX" badge.
 * Subtly animated with natural idle breathing and conversation gestures.
 */
function OfficerAlex({ isTalking = false }) {
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
    <group position={[5.0, 0, 15.8]}>
      {/* Trousers / Legs */}
      <mesh position={[-0.12, 0.45, 0]}>
        <cylinderGeometry args={[0.08, 0.09, 0.85, 12]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} />
      </mesh>
      <mesh position={[0.12, 0.45, 0]}>
        <cylinderGeometry args={[0.08, 0.09, 0.85, 12]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} />
      </mesh>

      {/* Black Duty Service Shoes */}
      <mesh position={[-0.12, 0.04, 0.04]}>
        <boxGeometry args={[0.13, 0.08, 0.22]} />
        <meshStandardMaterial color="#0f172a" roughness={0.4} />
      </mesh>
      <mesh position={[0.12, 0.04, 0.04]}>
        <boxGeometry args={[0.13, 0.08, 0.22]} />
        <meshStandardMaterial color="#0f172a" roughness={0.4} />
      </mesh>

      {/* Duty Utility Belt */}
      <mesh position={[0, 0.88, 0]}>
        <boxGeometry args={[0.4, 0.06, 0.25]} />
        <meshStandardMaterial color="#0f172a" roughness={0.6} />
      </mesh>
      {/* Belt Buckle */}
      <mesh position={[0, 0.88, 0.13]}>
        <boxGeometry args={[0.07, 0.05, 0.02]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Radio Holster & Equipment Pouches on Belt */}
      <mesh position={[-0.18, 0.9, 0.12]}>
        <boxGeometry args={[0.06, 0.1, 0.04]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>
      <mesh position={[0.18, 0.88, 0.12]}>
        <boxGeometry args={[0.05, 0.06, 0.03]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>

      {/* Torso / Police Blue Uniform Shirt */}
      <mesh position={[0, 1.12, 0]}>
        <boxGeometry args={[0.42, 0.48, 0.25]} />
        <meshStandardMaterial color="#1d4ed8" roughness={0.6} />
      </mesh>

      {/* Dark Navy Tie */}
      <mesh position={[0, 1.14, 0.13]}>
        <boxGeometry args={[0.06, 0.24, 0.02]} />
        <meshStandardMaterial color="#0f172a" roughness={0.5} />
      </mesh>

      {/* Shoulder Epaulets */}
      <mesh position={[-0.18, 1.34, 0]}>
        <boxGeometry args={[0.1, 0.02, 0.12]} />
        <meshStandardMaterial color="#0f172a" roughness={0.6} />
      </mesh>
      <mesh position={[0.18, 1.34, 0]}>
        <boxGeometry args={[0.1, 0.02, 0.12]} />
        <meshStandardMaterial color="#0f172a" roughness={0.6} />
      </mesh>

      {/* Silver Police Star Shield Badge (Left Chest) */}
      <mesh position={[-0.11, 1.22, 0.132]}>
        <cylinderGeometry args={[0.032, 0.032, 0.01, 7]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.85} roughness={0.2} />
      </mesh>

      {/* Name Badge: ALEX (Right Chest) */}
      <mesh position={[0.11, 1.22, 0.132]}>
        <boxGeometry args={[0.075, 0.03, 0.015]} />
        <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Arms & Hands */}
      {/* Left Arm */}
      <group position={[-0.25, 1.28, 0]}>
        <mesh position={[0, -0.22, 0]}>
          <cylinderGeometry args={[0.06, 0.065, 0.44, 10]} />
          <meshStandardMaterial color="#1d4ed8" roughness={0.6} />
        </mesh>
        <mesh ref={leftArmRef} position={[0, -0.48, 0]}>
          <sphereGeometry args={[0.05, 10, 10]} />
          <meshStandardMaterial color="#f5d0b0" roughness={0.6} />
        </mesh>
      </group>

      {/* Right Arm */}
      <group position={[0.25, 1.28, 0]}>
        <mesh position={[0, -0.22, 0]}>
          <cylinderGeometry args={[0.06, 0.065, 0.44, 10]} />
          <meshStandardMaterial color="#1d4ed8" roughness={0.6} />
        </mesh>
        <mesh ref={rightArmRef} position={[0, -0.48, 0]}>
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
        {/* Styled Short Dark Hair */}
        <mesh position={[0, 0.31, -0.01]}>
          <boxGeometry args={[0.24, 0.08, 0.24]} />
          <meshStandardMaterial color="#1e293b" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.25, -0.1]}>
          <boxGeometry args={[0.23, 0.16, 0.06]} />
          <meshStandardMaterial color="#1e293b" roughness={0.8} />
        </mesh>
        {/* Friendly Eyes */}
        <mesh position={[-0.05, 0.2, 0.113]}>
          <boxGeometry args={[0.035, 0.025, 0.01]} />
          <meshStandardMaterial color="#0f172a" roughness={0.3} />
        </mesh>
        <mesh position={[0.05, 0.2, 0.113]}>
          <boxGeometry args={[0.035, 0.025, 0.01]} />
          <meshStandardMaterial color="#0f172a" roughness={0.3} />
        </mesh>
        {/* Professional Polite Smile */}
        <mesh position={[0, 0.12, 0.113]}>
          <boxGeometry args={[0.06, 0.015, 0.01]} />
          <meshStandardMaterial color="#b97a57" roughness={0.5} />
        </mesh>
      </group>

      {/* Office Swivel Chair for Officer Alex */}
      <group position={[0, 0, -0.4]}>
        <mesh position={[0, 0.44, 0]}>
          <boxGeometry args={[0.46, 0.08, 0.46]} />
          <meshStandardMaterial color="#1e293b" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.8, -0.2]}>
          <boxGeometry args={[0.44, 0.6, 0.08]} />
          <meshStandardMaterial color="#1e293b" roughness={0.7} />
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
 * Low-Poly Waiting Chair
 */
function PoliceWaitingChair({ position, rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Seat Cushion */}
      <mesh position={[0, 0.42, 0]}>
        <boxGeometry args={[0.62, 0.09, 0.58]} />
        <meshStandardMaterial color="#1e3a8a" roughness={0.6} />
      </mesh>
      {/* Backrest */}
      <mesh position={[0, 0.76, -0.24]}>
        <boxGeometry args={[0.62, 0.54, 0.09]} />
        <meshStandardMaterial color="#1e3a8a" roughness={0.6} />
      </mesh>
      {/* Steel Frame Legs */}
      {[[-0.27, -0.22], [0.27, -0.22], [-0.27, 0.22], [0.27, 0.22]].map(([lx, lz], idx) => (
        <mesh key={`pchair-${idx}`} position={[lx, 0.2, lz]}>
          <cylinderGeometry args={[0.02, 0.02, 0.4, 8]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}
    </group>
  );
}

/**
 * Potted Indoor Plant
 */
function PolicePlant({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.22, 0.16, 0.6, 12]} />
        <meshStandardMaterial color="#334155" roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.59, 0]}>
        <cylinderGeometry args={[0.21, 0.21, 0.04, 12]} />
        <meshStandardMaterial color="#3e2723" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.92, 0]}>
        <sphereGeometry args={[0.28, 10, 10]} />
        <meshStandardMaterial color="#15803d" roughness={0.7} />
      </mesh>
      <mesh position={[0.08, 1.12, -0.05]}>
        <sphereGeometry args={[0.22, 10, 10]} />
        <meshStandardMaterial color="#16a34a" roughness={0.7} />
      </mesh>
    </group>
  );
}

/**
 * PoliceStation Component:
 * Clean, low-poly village police reception & service interior.
 * Renders ONLY when player is inside (currentLocation === "PoliceStation").
 */
export function PoliceStation({ isTalking = false, currentLocation = "outside" }) {
  // CRITICAL OPTIMIZATION: Only render when inside Police Station
  const isInside = currentLocation === "PoliceStation";

  // Reusable Materials
  const materials = useMemo(() => {
    return {
      floorTiles: new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.35 }),
      floorBorder: new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.4 }),
      welcomeMat: new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.85 }),
      wallBase: new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.7 }),
      wallWainscotNavy: new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6 }),
      ceilingMat: new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.9 }),
      deskBody: new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5 }),
      deskTop: new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 }),
      metalTrim: new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.75, roughness: 0.3 }),
      glassPartition: new THREE.MeshStandardMaterial({ color: 0xe0f2fe, transparent: true, opacity: 0.35, roughness: 0.1 }),
      exitGreen: new THREE.MeshStandardMaterial({ color: 0x15803d, emissive: 0x16a34a, emissiveIntensity: 0.8 })
    };
  }, []);

  // Main Wall Sign Texture: "VILLAGE POLICE STATION / 마을 경찰서"
  const policeSignTexture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, 512, 128);
    ctx.strokeStyle = "#2563eb";
    ctx.lineWidth = 6;
    ctx.strokeRect(6, 6, 500, 116);
    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 38px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("👮 VILLAGE POLICE STATION", 256, 48);
    ctx.font = "bold 24px sans-serif";
    ctx.fillStyle = "#cbd5e1";
    ctx.fillText("마 을 경 찰 서", 256, 92);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);

  // Community Notice / Emergency Board Texture
  const noticeBoardTexture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, 256, 256);
    ctx.strokeStyle = "#1d4ed8";
    ctx.lineWidth = 6;
    ctx.strokeRect(4, 4, 248, 248);
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(10, 10, 236, 236);
    ctx.fillStyle = "#1e3a8a";
    ctx.font = "bold 18px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("COMMUNITY SAFETY", 128, 38);
    ctx.font = "14px sans-serif";
    ctx.fillStyle = "#dc2626";
    ctx.fillText("🚨 EMERGENCY: 112 / 911", 128, 75);
    ctx.fillStyle = "#1e293b";
    ctx.fillText("• Lost & Found Inquiries", 128, 110);
    ctx.fillText("• Crime Prevention Patrol", 128, 142);
    ctx.fillText("• Report Filing Desk", 128, 174);
    ctx.fillStyle = "#2563eb";
    ctx.font = "bold 13px sans-serif";
    ctx.fillText("ALWAYS HERE TO HELP YOU", 128, 218);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);

  // Do not render anything when outside or in other buildings
  if (!isInside) return null;

  return (
    <group>
      {/* ============================================================ */}
      {/* 1. LIGHTING (2 Lightweight Lights, No Shadows)              */}
      {/* ============================================================ */}
      <ambientLight intensity={0.92} color="#f8fafc" />
      <directionalLight position={[5.0, 4.5, 18.0]} intensity={0.5} color="#ffffff" />
      <pointLight position={[5.0, 2.7, 16.5]} intensity={1.0} distance={7} color="#e0f2fe" />

      {/* ============================================================ */}
      {/* 2. FLOOR & CEILING                                           */}
      {/* ============================================================ */}
      {/* Neutral Light Gray Tiled Floor */}
      <mesh position={[5.0, 0.01, 17.8]} material={materials.floorTiles}>
        <boxGeometry args={[7.2, 0.02, 5.6]} />
      </mesh>
      {/* Floor Border Accent */}
      <mesh position={[5.0, 0.015, 17.8]} material={materials.floorBorder}>
        <boxGeometry args={[6.8, 0.01, 5.2]} />
      </mesh>
      <mesh position={[5.0, 0.02, 17.8]} material={materials.floorTiles}>
        <boxGeometry args={[6.6, 0.01, 5.0]} />
      </mesh>
      {/* Entrance Welcome Mat (Near Glass Doors) */}
      <mesh position={[5.0, 0.025, 19.5]} material={materials.welcomeMat}>
        <boxGeometry args={[2.2, 0.01, 1.0]} />
      </mesh>

      {/* Clean Modular Ceiling with Recessed Lights */}
      <mesh position={[5.0, 3.2, 17.8]} material={materials.ceilingMat}>
        <boxGeometry args={[7.2, 0.05, 5.6]} />
      </mesh>
      <mesh position={[5.0, 3.18, 16.8]}>
        <boxGeometry args={[2.2, 0.02, 0.8]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[5.0, 3.18, 18.8]}>
        <boxGeometry args={[2.2, 0.02, 0.8]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.8} />
      </mesh>

      {/* ============================================================ */}
      {/* 3. WALLS & STOREFRONT ENTRANCE                               */}
      {/* ============================================================ */}
      {/* North / Back Wall (Behind Alex & Desk) */}
      <mesh position={[5.0, 1.6, 15.0]} material={materials.wallBase}>
        <boxGeometry args={[7.2, 3.2, 0.1]} />
      </mesh>
      {/* Navy Wainscot Trim */}
      <mesh position={[5.0, 0.45, 15.04]} material={materials.wallWainscotNavy}>
        <boxGeometry args={[7.2, 0.9, 0.04]} />
      </mesh>

      {/* West / Left Wall */}
      <mesh position={[1.4, 1.6, 17.8]} material={materials.wallBase}>
        <boxGeometry args={[0.1, 3.2, 5.6]} />
      </mesh>
      <mesh position={[1.44, 0.45, 17.8]} material={materials.wallWainscotNavy}>
        <boxGeometry args={[0.04, 0.9, 5.6]} />
      </mesh>

      {/* East / Right Wall */}
      <mesh position={[8.6, 1.6, 17.8]} material={materials.wallBase}>
        <boxGeometry args={[0.1, 3.2, 5.6]} />
      </mesh>
      <mesh position={[8.56, 0.45, 17.8]} material={materials.wallWainscotNavy}>
        <boxGeometry args={[0.04, 0.9, 5.6]} />
      </mesh>

      {/* South / Front Wall with Sliding Glass Exit Doors */}
      <mesh position={[2.8, 1.6, 20.6]} material={materials.wallBase}>
        <boxGeometry args={[2.7, 3.2, 0.1]} />
      </mesh>
      <mesh position={[7.2, 1.6, 20.6]} material={materials.wallBase}>
        <boxGeometry args={[2.7, 3.2, 0.1]} />
      </mesh>
      <mesh position={[5.0, 2.85, 20.6]} material={materials.wallBase}>
        <boxGeometry args={[1.7, 0.7, 0.1]} />
      </mesh>

      {/* Double Glass Doors Frame */}
      <mesh position={[5.0, 1.25, 20.6]} material={materials.metalTrim}>
        <boxGeometry args={[1.7, 2.5, 0.08]} />
      </mesh>
      <mesh position={[5.0, 1.25, 20.61]} material={materials.glassPartition}>
        <boxGeometry args={[1.6, 2.38, 0.03]} />
      </mesh>
      {/* Handles */}
      <mesh position={[4.92, 1.1, 20.55]}>
        <cylinderGeometry args={[0.015, 0.015, 0.5, 8]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[5.08, 1.1, 20.55]}>
        <cylinderGeometry args={[0.015, 0.015, 0.5, 8]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Illuminated Green EXIT / 출구 Sign */}
      <mesh position={[5.0, 2.55, 20.54]} material={materials.exitGreen}>
        <boxGeometry args={[0.65, 0.22, 0.04]} />
      </mesh>

      {/* ============================================================ */}
      {/* 4. WALL SIGNAGE & NOTICE BOARD                               */}
      {/* ============================================================ */}
      {/* Main "VILLAGE POLICE STATION" Signboard on Back Wall */}
      {policeSignTexture && (
        <mesh position={[5.0, 2.35, 15.06]}>
          <planeGeometry args={[3.2, 0.8]} />
          <meshBasicMaterial map={policeSignTexture} />
        </mesh>
      )}

      {/* Community Safety Notice Board on East Wall */}
      {noticeBoardTexture && (
        <mesh position={[8.54, 1.85, 18.2]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[1.1, 1.1]} />
          <meshBasicMaterial map={noticeBoardTexture} />
        </mesh>
      )}

      {/* ============================================================ */}
      {/* 5. POLICE RECEPTION COUNTER & DESK ITEMS                     */}
      {/* ============================================================ */}
      <group position={[5.0, 0, 16.4]}>
        {/* Main Reception Counter Body */}
        <mesh position={[0, 0.48, 0]} material={materials.deskBody}>
          <boxGeometry args={[3.6, 0.96, 0.8]} />
        </mesh>
        {/* Blue Header Trim */}
        <mesh position={[0, 0.82, -0.405]}>
          <boxGeometry args={[3.62, 0.03, 0.02]} />
          <meshStandardMaterial color="#2563eb" roughness={0.4} />
        </mesh>
        {/* Countertop */}
        <mesh position={[0, 0.98, 0]} material={materials.deskTop}>
          <boxGeometry args={[3.8, 0.06, 0.9]} />
        </mesh>

        {/* Countertop Desk Sign: RECEPTION & INQUIRIES */}
        <mesh position={[-0.5, 1.03, -0.3]}>
          <boxGeometry args={[0.34, 0.04, 0.08]} />
          <meshStandardMaterial color="#1e3a8a" roughness={0.3} />
        </mesh>

        {/* Desktop PC Setup */}
        <group position={[0.25, 1.01, 0.1]}>
          {/* Base Stand */}
          <mesh position={[0, 0.01, 0]} material={materials.metalTrim}>
            <cylinderGeometry args={[0.09, 0.09, 0.02, 12]} />
          </mesh>
          <mesh position={[0, 0.13, 0.03]} material={materials.metalTrim}>
            <cylinderGeometry args={[0.015, 0.015, 0.24, 8]} />
          </mesh>
          {/* Screen Housing */}
          <mesh position={[0, 0.26, 0]}>
            <boxGeometry args={[0.5, 0.32, 0.03]} />
            <meshStandardMaterial color="#1e293b" roughness={0.4} />
          </mesh>
          {/* Glowing Dispatch System Screen facing Alex (-Z) */}
          <mesh position={[0, 0.26, -0.017]}>
            <boxGeometry args={[0.46, 0.28, 0.005]} />
            <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.6} />
          </mesh>
          {/* Keyboard & Mousepad */}
          <mesh position={[0, 0.01, -0.2]}>
            <boxGeometry args={[0.36, 0.015, 0.13]} />
            <meshStandardMaterial color="#334155" roughness={0.7} />
          </mesh>
          <mesh position={[0.23, 0.008, -0.2]}>
            <boxGeometry args={[0.13, 0.005, 0.13]} />
            <meshStandardMaterial color="#0f172a" roughness={0.8} />
          </mesh>
        </group>

        {/* Incident Report Forms Tray & Police Radio Dock */}
        <group position={[-0.95, 1.01, 0.1]}>
          <mesh position={[0, 0.03, 0]}>
            <boxGeometry args={[0.32, 0.06, 0.24]} />
            <meshStandardMaterial color="#475569" roughness={0.6} />
          </mesh>
          {/* Paper in Tray */}
          <mesh position={[0, 0.065, 0]}>
            <boxGeometry args={[0.28, 0.01, 0.21]} />
            <meshStandardMaterial color="#ffffff" roughness={0.4} />
          </mesh>
          {/* Radio Charging Cradle */}
          <mesh position={[0.24, 0.04, 0.05]}>
            <boxGeometry args={[0.08, 0.08, 0.08]} />
            <meshStandardMaterial color="#1e293b" roughness={0.5} />
          </mesh>
          {/* Handheld Police Radio */}
          <mesh position={[0.24, 0.14, 0.05]}>
            <boxGeometry args={[0.05, 0.12, 0.04]} />
            <meshStandardMaterial color="#0f172a" roughness={0.7} />
          </mesh>
          <mesh position={[0.24, 0.23, 0.05]}>
            <cylinderGeometry args={[0.005, 0.005, 0.08, 6]} />
            <meshStandardMaterial color="#0f172a" roughness={0.8} />
          </mesh>
        </group>
      </group>

      {/* ============================================================ */}
      {/* 6. POLICE OFFICER NPC (ALEX)                                 */}
      {/* ============================================================ */}
      <OfficerAlex isTalking={isTalking} />

      {/* ============================================================ */}
      {/* 7. WAITING AREA (WEST WALL)                                  */}
      {/* ============================================================ */}
      {/* 3 Waiting Chairs */}
      <PoliceWaitingChair position={[2.2, 0, 17.5]} rotation={[0, Math.PI / 2, 0]} />
      <PoliceWaitingChair position={[2.2, 0, 18.3]} rotation={[0, Math.PI / 2, 0]} />
      <PoliceWaitingChair position={[2.2, 0, 19.1]} rotation={[0, Math.PI / 2, 0]} />

      {/* Small Waiting Coffee Table */}
      <group position={[3.2, 0, 18.3]}>
        <mesh position={[0, 0.22, 0]}>
          <boxGeometry args={[0.5, 0.35, 0.9]} />
          <meshStandardMaterial color="#334155" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.4, 0]} material={materials.deskTop}>
          <boxGeometry args={[0.54, 0.03, 0.94]} />
        </mesh>
        {/* Safety Pamphlets */}
        <mesh position={[0, 0.42, 0.12]} rotation={[0, 0.1, 0]}>
          <boxGeometry args={[0.18, 0.015, 0.26]} />
          <meshStandardMaterial color="#2563eb" roughness={0.4} />
        </mesh>
      </group>

      {/* ============================================================ */}
      {/* 8. INDOOR DECORATIVE PLANTS                                  */}
      {/* ============================================================ */}
      <PolicePlant position={[2.1, 0, 15.6]} />
      <PolicePlant position={[7.9, 0, 15.6]} />
    </group>
  );
}
