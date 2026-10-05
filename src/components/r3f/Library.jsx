import React, { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

/**
 * Stylized low-poly Emily (Village Librarian)
 * Friendly, patient, professional librarian with an emerald/sage cardigan,
 * white blouse, dark pleated skirt, reading glasses, and an "EMILY" badge.
 * Subtly animated with natural idle breathing and conversation gestures.
 */
function LibrarianEmily({ isTalking = false }) {
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
    <group position={[19.8, 0, -1.85]}>
      {/* Lower Body / Pleated Midi Skirt */}
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.22, 0.28, 0.88, 14]} />
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

      {/* Torso / Emerald Knit Cardigan */}
      <mesh position={[0, 1.1, 0]}>
        <boxGeometry args={[0.4, 0.48, 0.24]} />
        <meshStandardMaterial color="#2d5a43" roughness={0.7} />
      </mesh>

      {/* White Silk Blouse Inner V-Neck */}
      <mesh position={[0, 1.22, 0.11]}>
        <boxGeometry args={[0.14, 0.14, 0.03]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.4} />
      </mesh>

      {/* Cardigan Buttons */}
      {[1.02, 1.1, 1.18].map((yBtn, idx) => (
        <mesh key={`btn-${idx}`} position={[0, yBtn, 0.125]}>
          <boxGeometry args={[0.02, 0.02, 0.01]} />
          <meshStandardMaterial color="#d4af37" metalness={0.7} roughness={0.3} />
        </mesh>
      ))}

      {/* Gold Name Badge: EMILY */}
      <mesh position={[0.12, 1.2, 0.125]}>
        <boxGeometry args={[0.075, 0.032, 0.015]} />
        <meshStandardMaterial color="#ffd700" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Arms & Hands */}
      {/* Left Arm */}
      <group position={[-0.24, 1.26, 0]}>
        <mesh position={[0, -0.22, 0]}>
          <cylinderGeometry args={[0.055, 0.06, 0.42, 10]} />
          <meshStandardMaterial color="#2d5a43" roughness={0.7} />
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
          <meshStandardMaterial color="#2d5a43" roughness={0.7} />
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
        {/* Elegant Styled Brown Hair (Side-parted Bob) */}
        <mesh position={[0, 0.27, -0.01]}>
          <boxGeometry args={[0.23, 0.09, 0.22]} />
          <meshStandardMaterial color="#4a2e18" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.2, -0.09]}>
          <boxGeometry args={[0.22, 0.18, 0.06]} />
          <meshStandardMaterial color="#4a2e18" roughness={0.8} />
        </mesh>
        <mesh position={[-0.105, 0.17, 0.02]}>
          <boxGeometry args={[0.04, 0.18, 0.18]} />
          <meshStandardMaterial color="#4a2e18" roughness={0.8} />
        </mesh>
        <mesh position={[0.105, 0.17, 0.02]}>
          <boxGeometry args={[0.04, 0.18, 0.18]} />
          <meshStandardMaterial color="#4a2e18" roughness={0.8} />
        </mesh>

        {/* Reading Glasses Frame */}
        <mesh position={[-0.045, 0.18, 0.108]}>
          <boxGeometry args={[0.04, 0.03, 0.01]} />
          <meshStandardMaterial color="#b45309" roughness={0.3} metalness={0.4} />
        </mesh>
        <mesh position={[0.045, 0.18, 0.108]}>
          <boxGeometry args={[0.04, 0.03, 0.01]} />
          <meshStandardMaterial color="#b45309" roughness={0.3} metalness={0.4} />
        </mesh>
        <mesh position={[0, 0.18, 0.108]}>
          <boxGeometry args={[0.02, 0.008, 0.01]} />
          <meshStandardMaterial color="#b45309" roughness={0.3} metalness={0.4} />
        </mesh>

        {/* Eyes behind spectacles */}
        <mesh position={[-0.045, 0.18, 0.103]}>
          <boxGeometry args={[0.025, 0.02, 0.005]} />
          <meshStandardMaterial color="#1e293b" roughness={0.3} />
        </mesh>
        <mesh position={[0.045, 0.18, 0.103]}>
          <boxGeometry args={[0.025, 0.02, 0.005]} />
          <meshStandardMaterial color="#1e293b" roughness={0.3} />
        </mesh>
        {/* Gentle Friendly Smile */}
        <mesh position={[0, 0.1, 0.103]}>
          <boxGeometry args={[0.05, 0.015, 0.005]} />
          <meshStandardMaterial color="#c27161" roughness={0.5} />
        </mesh>
      </group>

      {/* Librarian Oak Desk Chair */}
      <group position={[0, 0, -0.4]}>
        <mesh position={[0, 0.44, 0]}>
          <boxGeometry args={[0.45, 0.07, 0.45]} />
          <meshStandardMaterial color="#473322" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.78, -0.2]}>
          <boxGeometry args={[0.42, 0.55, 0.07]} />
          <meshStandardMaterial color="#473322" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.22, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.44, 8]} />
          <meshStandardMaterial color="#78716c" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.25, 0.25, 0.04, 5]} />
          <meshStandardMaterial color="#44403c" roughness={0.6} />
        </mesh>
      </group>
    </group>
  );
}

/**
 * Low-Poly Bookshelf with Colorful Book Spines
 */
function BookshelfUnit({ position, rotation = [0, 0, 0], width = 2.4, height = 2.6, depth = 0.45 }) {
  const shelfWoodMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: 0x5c3d24, roughness: 0.6 }),
    []
  );

  const bookColors = ["#b91c1c", "#1d4ed8", "#047857", "#b45309", "#4338ca", "#0e7490", "#831843", "#374151"];

  return (
    <group position={position} rotation={rotation}>
      {/* Outer Wooden Frame */}
      {/* Top, Bottom, Back */}
      <mesh position={[0, height / 2, 0]} material={shelfWoodMat}>
        <boxGeometry args={[width, 0.06, depth]} />
      </mesh>
      <mesh position={[0, 0.03, 0]} material={shelfWoodMat}>
        <boxGeometry args={[width, 0.06, depth]} />
      </mesh>
      <mesh position={[0, height / 2, -depth / 2 + 0.02]} material={shelfWoodMat}>
        <boxGeometry args={[width, height, 0.04]} />
      </mesh>
      {/* Left and Right Side Panels */}
      <mesh position={[-width / 2 + 0.03, height / 2, 0]} material={shelfWoodMat}>
        <boxGeometry args={[0.06, height, depth]} />
      </mesh>
      <mesh position={[width / 2 - 0.03, height / 2, 0]} material={shelfWoodMat}>
        <boxGeometry args={[0.06, height, depth]} />
      </mesh>

      {/* Intermediate Shelves & Books on 3 Tiers */}
      {[0.6, 1.25, 1.9].map((yShelf, sIdx) => (
        <group key={`shelf-${sIdx}`}>
          <mesh position={[0, yShelf, 0]} material={shelfWoodMat}>
            <boxGeometry args={[width - 0.08, 0.04, depth - 0.04]} />
          </mesh>
          {/* Row of Books on this Shelf */}
          {[-0.9, -0.6, -0.3, 0.0, 0.3, 0.6, 0.85].map((xBook, bIdx) => {
            const color = bookColors[(sIdx * 3 + bIdx) % bookColors.length];
            const bookH = 0.32 + ((bIdx % 3) * 0.04);
            const bookW = 0.16 + ((bIdx % 2) * 0.05);
            return (
              <mesh key={`b-${bIdx}`} position={[xBook, yShelf + bookH / 2 + 0.02, 0.04]}>
                <boxGeometry args={[bookW, bookH, depth * 0.6]} />
                <meshStandardMaterial color={color} roughness={0.5} />
              </mesh>
            );
          })}
        </group>
      ))}
    </group>
  );
}

/**
 * Library Study Table with 2 Chairs & Banker's Desk Lamp
 */
function StudyTableSet({ position, rotation = [0, 0, 0] }) {
  const tableOakMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: 0x7c4f2a, roughness: 0.5 }),
    []
  );
  const chairMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: 0x473322, roughness: 0.6 }),
    []
  );

  return (
    <group position={position} rotation={rotation}>
      {/* Table Top */}
      <mesh position={[0, 0.72, 0]} material={tableOakMat}>
        <boxGeometry args={[1.5, 0.05, 0.8]} />
      </mesh>
      {/* 4 Table Legs */}
      {[[-0.68, -0.34], [0.68, -0.34], [-0.68, 0.34], [0.68, 0.34]].map(([lx, lz], idx) => (
        <mesh key={`tleg-${idx}`} position={[lx, 0.35, lz]} material={tableOakMat}>
          <cylinderGeometry args={[0.03, 0.03, 0.7, 8]} />
        </mesh>
      ))}

      {/* Classic Banker's Lamp (Brass Base & Green Glass Shade) */}
      <group position={[0, 0.75, 0]}>
        <mesh position={[0, 0.015, 0]}>
          <cylinderGeometry args={[0.06, 0.07, 0.03, 10]} />
          <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.14, 0]}>
          <cylinderGeometry args={[0.01, 0.01, 0.24, 8]} />
          <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Emerald Green Glass Hood */}
        <mesh position={[0, 0.24, 0]}>
          <boxGeometry args={[0.18, 0.06, 0.08]} />
          <meshStandardMaterial color="#047857" roughness={0.2} emissive="#065f46" emissiveIntensity={0.6} />
        </mesh>
      </group>

      {/* Open Book & Study Notepad on Table */}
      <mesh position={[-0.35, 0.75, 0.05]} rotation={[0, 0.1, 0]}>
        <boxGeometry args={[0.26, 0.015, 0.34]} />
        <meshStandardMaterial color="#fef08a" roughness={0.4} />
      </mesh>
      <mesh position={[0.35, 0.75, -0.05]} rotation={[0, -0.15, 0]}>
        <boxGeometry args={[0.22, 0.012, 0.28]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.4} />
      </mesh>

      {/* Chair 1 (Facing Table from -Z) */}
      <group position={[0, 0, -0.55]}>
        <mesh position={[0, 0.42, 0]} material={chairMat}>
          <boxGeometry args={[0.42, 0.06, 0.42]} />
        </mesh>
        <mesh position={[0, 0.74, -0.18]} material={chairMat}>
          <boxGeometry args={[0.4, 0.52, 0.05]} />
        </mesh>
        {[[-0.17, -0.17], [0.17, -0.17], [-0.17, 0.17], [0.17, 0.17]].map(([cx, cz], cIdx) => (
          <mesh key={`cleg1-${cIdx}`} position={[cx, 0.2, cz]} material={chairMat}>
            <cylinderGeometry args={[0.02, 0.02, 0.4, 8]} />
          </mesh>
        ))}
      </group>

      {/* Chair 2 (Facing Table from +Z) */}
      <group position={[0, 0, 0.55]} rotation={[0, Math.PI, 0]}>
        <mesh position={[0, 0.42, 0]} material={chairMat}>
          <boxGeometry args={[0.42, 0.06, 0.42]} />
        </mesh>
        <mesh position={[0, 0.74, -0.18]} material={chairMat}>
          <boxGeometry args={[0.4, 0.52, 0.05]} />
        </mesh>
        {[[-0.17, -0.17], [0.17, -0.17], [-0.17, 0.17], [0.17, 0.17]].map(([cx, cz], cIdx) => (
          <mesh key={`cleg2-${cIdx}`} position={[cx, 0.2, cz]} material={chairMat}>
            <cylinderGeometry args={[0.02, 0.02, 0.4, 8]} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/**
 * Cozy Reading Armchair for the Library Lounge
 */
function LibraryArmchair({ position, rotation = [0, 0, 0] }) {
  const fabricMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: 0x1b4332, roughness: 0.7 }),
    []
  );
  const woodTrimMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: 0x5c3d24, roughness: 0.5 }),
    []
  );

  return (
    <group position={position} rotation={rotation}>
      {/* Seat Cushion */}
      <mesh position={[0, 0.38, 0]} material={fabricMat}>
        <boxGeometry args={[0.68, 0.14, 0.65]} />
      </mesh>
      {/* Backrest */}
      <mesh position={[0, 0.76, -0.26]} material={fabricMat}>
        <boxGeometry args={[0.68, 0.58, 0.14]} />
      </mesh>
      {/* Armrests */}
      <mesh position={[-0.36, 0.56, 0]} material={fabricMat}>
        <boxGeometry args={[0.1, 0.34, 0.65]} />
      </mesh>
      <mesh position={[0.36, 0.56, 0]} material={fabricMat}>
        <boxGeometry args={[0.1, 0.34, 0.65]} />
      </mesh>
      {/* Wood Tapered Legs */}
      {[[-0.3, -0.26], [0.3, -0.26], [-0.3, 0.26], [0.3, 0.26]].map(([lx, lz], idx) => (
        <mesh key={`aleg-${idx}`} position={[lx, 0.16, lz]} material={woodTrimMat}>
          <cylinderGeometry args={[0.025, 0.018, 0.32, 8]} />
        </mesh>
      ))}
    </group>
  );
}

/**
 * Potted Indoor Ficus / Plant
 */
function LibraryPlant({ position }) {
  return (
    <group position={position}>
      {/* Terracotta / Ceramic Planter */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.22, 0.16, 0.6, 12]} />
        <meshStandardMaterial color="#a16207" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.59, 0]}>
        <cylinderGeometry args={[0.21, 0.21, 0.04, 12]} />
        <meshStandardMaterial color="#3e2723" roughness={0.9} />
      </mesh>
      {/* Foliage */}
      <mesh position={[0, 0.92, 0]}>
        <sphereGeometry args={[0.28, 10, 10]} />
        <meshStandardMaterial color="#15803d" roughness={0.7} />
      </mesh>
      <mesh position={[0.08, 1.12, -0.05]}>
        <sphereGeometry args={[0.22, 10, 10]} />
        <meshStandardMaterial color="#16a34a" roughness={0.7} />
      </mesh>
      <mesh position={[-0.08, 1.06, 0.06]}>
        <sphereGeometry args={[0.2, 10, 10]} />
        <meshStandardMaterial color="#15803d" roughness={0.7} />
      </mesh>
    </group>
  );
}

/**
 * Library Component:
 * Clean, optimized, low-poly library reception & study interior.
 * Renders ONLY when player is inside the Library (currentLocation === "Library").
 */
export function Library({ isTalking = false, currentLocation = "outside" }) {
  // CRITICAL OPTIMIZATION: Only render when inside Library
  const isInside = currentLocation === "Library";

  // Reusable Materials
  const materials = useMemo(() => {
    return {
      hardwoodFloor: new THREE.MeshStandardMaterial({ color: 0x8b5a2b, roughness: 0.4 }),
      carpetRug: new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.8 }),
      rugBorder: new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.75 }),
      welcomeMat: new THREE.MeshStandardMaterial({ color: 0x292524, roughness: 0.85 }),
      wallBase: new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.7 }),
      wallWoodPanel: new THREE.MeshStandardMaterial({ color: 0x5c3d24, roughness: 0.6 }),
      ceilingMat: new THREE.MeshStandardMaterial({ color: 0xfafaf9, roughness: 0.9 }),
      deskOakBody: new THREE.MeshStandardMaterial({ color: 0x6b4423, roughness: 0.5 }),
      deskOakTop: new THREE.MeshStandardMaterial({ color: 0x85542b, roughness: 0.4 }),
      metalBrass: new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.75, roughness: 0.3 }),
      metalChrome: new THREE.MeshStandardMaterial({ color: 0xd6d3d1, metalness: 0.85, roughness: 0.2 }),
      glassPartition: new THREE.MeshStandardMaterial({ color: 0xe0f2fe, transparent: true, opacity: 0.35, roughness: 0.1 }),
      exitGreen: new THREE.MeshStandardMaterial({ color: 0x15803d, emissive: 0x16a34a, emissiveIntensity: 0.8 })
    };
  }, []);

  // Main Wall Sign Texture: "VILLAGE LIBRARY / 마을도서관"
  const librarySignTexture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.fillStyle = "#3b2210";
    ctx.fillRect(0, 0, 512, 128);
    ctx.strokeStyle = "#d4af37";
    ctx.lineWidth = 6;
    ctx.strokeRect(6, 6, 500, 116);
    ctx.fillStyle = "#fef08a";
    ctx.font = "bold 40px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("📖 VILLAGE LIBRARY", 256, 48);
    ctx.font = "bold 24px sans-serif";
    ctx.fillStyle = "#fed7aa";
    ctx.fillText("마 을 도 서 관", 256, 92);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);

  // Library Bulletin / Info Board Texture
  const infoBoardTexture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.fillStyle = "#78350f";
    ctx.fillRect(0, 0, 256, 256);
    ctx.strokeStyle = "#451a03";
    ctx.lineWidth = 6;
    ctx.strokeRect(4, 4, 248, 248);
    ctx.fillStyle = "#fef3c7";
    ctx.fillRect(12, 12, 232, 232);
    ctx.fillStyle = "#78350f";
    ctx.font = "bold 20px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("LIBRARY INFO", 128, 42);
    ctx.font = "14px sans-serif";
    ctx.fillStyle = "#1e293b";
    ctx.fillText("• Open: 09:00 - 18:00", 128, 80);
    ctx.fillText("• Loan Period: 14 Days", 128, 115);
    ctx.fillText("• Language Study Club: 3PM", 128, 150);
    ctx.fillStyle = "#047857";
    ctx.font = "bold 15px sans-serif";
    ctx.fillText("🤫 SILENCE PLEASE", 128, 195);
    ctx.font = "12px sans-serif";
    ctx.fillStyle = "#64748b";
    ctx.fillText("Free Wi-Fi: Village_Lib", 128, 225);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);

  // Return nothing when outside or in another building
  if (!isInside) return null;

  return (
    <group>
      {/* ============================================================ */}
      {/* 1. WARM SCHOLARLY LIGHTING (2 Lightweight Lights, No Shadows) */}
      {/* ============================================================ */}
      <ambientLight intensity={0.92} color="#fffbeb" />
      <directionalLight position={[19.8, 4.5, 0.5]} intensity={0.5} color="#fff7ed" />
      <pointLight position={[19.8, 2.6, -0.8]} intensity={1.0} distance={7} color="#fed7aa" />

      {/* ============================================================ */}
      {/* 2. FLOOR & CEILING                                           */}
      {/* ============================================================ */}
      {/* Warm Hardwood Plank Floor */}
      <mesh position={[19.8, 0.01, -0.5]} material={materials.hardwoodFloor}>
        <boxGeometry args={[7.8, 0.02, 5.0]} />
      </mesh>
      {/* Central Cozy Study Rug */}
      <mesh position={[19.8, 0.015, -0.2]} material={materials.rugBorder}>
        <boxGeometry args={[5.2, 0.01, 3.4]} />
      </mesh>
      <mesh position={[19.8, 0.02, -0.2]} material={materials.carpetRug}>
        <boxGeometry args={[4.9, 0.01, 3.1]} />
      </mesh>
      {/* Entrance Welcome Mat */}
      <mesh position={[19.8, 0.025, 1.3]} material={materials.welcomeMat}>
        <boxGeometry args={[2.2, 0.01, 1.0]} />
      </mesh>

      {/* Ceiling with Warm Wood Trim & Recessed Flush Light Panels */}
      <mesh position={[19.8, 3.2, -0.5]} material={materials.ceilingMat}>
        <boxGeometry args={[7.8, 0.05, 5.0]} />
      </mesh>
      <mesh position={[19.8, 3.18, -0.8]}>
        <boxGeometry args={[2.2, 0.02, 0.8]} />
        <meshStandardMaterial color="#fffbeb" emissive="#fef3c7" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[19.8, 3.18, 0.8]}>
        <boxGeometry args={[2.2, 0.02, 0.8]} />
        <meshStandardMaterial color="#fffbeb" emissive="#fef3c7" emissiveIntensity={0.8} />
      </mesh>

      {/* ============================================================ */}
      {/* 3. WALLS & STOREFRONT ENTRANCE                               */}
      {/* ============================================================ */}
      {/* North / Back Wall (Behind Emily & Tall Bookshelves) */}
      <mesh position={[19.8, 1.6, -3.0]} material={materials.wallBase}>
        <boxGeometry args={[7.8, 3.2, 0.1]} />
      </mesh>
      {/* Wood Wainscot Baseboard */}
      <mesh position={[19.8, 0.45, -2.96]} material={materials.wallWoodPanel}>
        <boxGeometry args={[7.8, 0.9, 0.04]} />
      </mesh>

      {/* West / Left Wall */}
      <mesh position={[16.0, 1.6, -0.5]} material={materials.wallBase}>
        <boxGeometry args={[0.1, 3.2, 5.0]} />
      </mesh>
      <mesh position={[16.06, 0.45, -0.5]} material={materials.wallWoodPanel}>
        <boxGeometry args={[0.04, 0.9, 5.0]} />
      </mesh>

      {/* East / Right Wall */}
      <mesh position={[23.6, 1.6, -0.5]} material={materials.wallBase}>
        <boxGeometry args={[0.1, 3.2, 5.0]} />
      </mesh>
      <mesh position={[23.54, 0.45, -0.5]} material={materials.wallWoodPanel}>
        <boxGeometry args={[0.04, 0.9, 5.0]} />
      </mesh>

      {/* South / Front Wall with Sliding Glass Exit Doors */}
      <mesh position={[17.5, 1.6, 2.0]} material={materials.wallBase}>
        <boxGeometry args={[2.9, 3.2, 0.1]} />
      </mesh>
      <mesh position={[22.1, 1.6, 2.0]} material={materials.wallBase}>
        <boxGeometry args={[2.9, 3.2, 0.1]} />
      </mesh>
      <mesh position={[19.8, 2.85, 2.0]} material={materials.wallBase}>
        <boxGeometry args={[2.0, 0.7, 0.1]} />
      </mesh>

      {/* Double Glass Doors Frame */}
      <mesh position={[19.8, 1.25, 2.0]} material={materials.deskOakBody}>
        <boxGeometry args={[2.0, 2.5, 0.08]} />
      </mesh>
      <mesh position={[19.8, 1.25, 2.01]} material={materials.glassPartition}>
        <boxGeometry args={[1.88, 2.38, 0.03]} />
      </mesh>
      {/* Door Handles */}
      <mesh position={[19.72, 1.1, 1.95]}>
        <cylinderGeometry args={[0.015, 0.015, 0.5, 8]} />
        <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[19.88, 1.1, 1.95]}>
        <cylinderGeometry args={[0.015, 0.015, 0.5, 8]} />
        <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Illuminated Green EXIT / 출구 Sign */}
      <mesh position={[19.8, 2.55, 1.94]} material={materials.exitGreen}>
        <boxGeometry args={[0.65, 0.22, 0.04]} />
      </mesh>

      {/* ============================================================ */}
      {/* 4. WALL SIGNAGE & BULLETIN BOARDS                            */}
      {/* ============================================================ */}
      {/* Main "VILLAGE LIBRARY" Signboard on Back Wall */}
      {librarySignTexture && (
        <mesh position={[19.8, 2.45, -2.93]}>
          <planeGeometry args={[3.2, 0.8]} />
          <meshBasicMaterial map={librarySignTexture} />
        </mesh>
      )}

      {/* Library Info Bulletin Board on East Wall */}
      {infoBoardTexture && (
        <mesh position={[23.53, 1.85, 0.8]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[1.1, 1.1]} />
          <meshBasicMaterial map={infoBoardTexture} />
        </mesh>
      )}

      {/* Framed World Literature Map / Print on West Wall */}
      <group position={[16.07, 1.85, 0.8]} rotation={[0, Math.PI / 2, 0]}>
        <mesh material={materials.deskOakBody}>
          <boxGeometry args={[1.0, 0.7, 0.03]} />
        </mesh>
        <mesh position={[0, 0, 0.02]}>
          <boxGeometry args={[0.92, 0.62, 0.01]} />
          <meshStandardMaterial color="#fef3c7" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0, 0.026]}>
          <boxGeometry args={[0.8, 0.5, 0.01]} />
          <meshStandardMaterial color="#0284c7" roughness={0.6} />
        </mesh>
      </group>

      {/* ============================================================ */}
      {/* 5. LIBRARIAN RECEPTION & CIRCULATION DESK                    */}
      {/* ============================================================ */}
      <group position={[19.8, 0, -1.2]}>
        {/* Main Solid Oak Desk Base */}
        <mesh position={[0, 0.48, 0]} material={materials.deskOakBody}>
          <boxGeometry args={[3.6, 0.96, 0.8]} />
        </mesh>
        {/* Brass Header Trim */}
        <mesh position={[0, 0.82, 0.405]} material={materials.metalBrass}>
          <boxGeometry args={[3.62, 0.03, 0.02]} />
        </mesh>
        {/* Thick Polished Oak Desktop Ledge */}
        <mesh position={[0, 0.98, 0]} material={materials.deskOakTop}>
          <boxGeometry args={[3.8, 0.06, 0.9]} />
        </mesh>

        {/* Countertop Desk Sign: INFORMATION & CIRCULATION */}
        <mesh position={[-0.5, 1.03, 0.3]}>
          <boxGeometry args={[0.34, 0.04, 0.08]} />
          <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.3} />
        </mesh>

        {/* Librarian Desktop PC Setup */}
        <group position={[0.25, 1.01, -0.1]}>
          {/* Monitor Base Stand */}
          <mesh position={[0, 0.01, 0]} material={materials.metalChrome}>
            <cylinderGeometry args={[0.09, 0.09, 0.02, 12]} />
          </mesh>
          <mesh position={[0, 0.13, -0.03]} material={materials.metalChrome}>
            <cylinderGeometry args={[0.015, 0.015, 0.24, 8]} />
          </mesh>
          {/* Screen Housing */}
          <mesh position={[0, 0.26, 0]}>
            <boxGeometry args={[0.5, 0.32, 0.03]} />
            <meshStandardMaterial color="#1e293b" roughness={0.4} />
          </mesh>
          {/* Glowing Catalog Screen facing Emily */}
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
          <mesh position={[0.23, 0.018, -0.2]}>
            <boxGeometry args={[0.05, 0.02, 0.08]} />
            <meshStandardMaterial color="#475569" roughness={0.5} />
          </mesh>
        </group>

        {/* Stack of Cataloged Returned Books on Desk */}
        <group position={[-0.95, 1.01, -0.1]}>
          <mesh position={[0, 0.02, 0]} rotation={[0, 0.05, 0]}>
            <boxGeometry args={[0.24, 0.04, 0.3]} />
            <meshStandardMaterial color="#b91c1c" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.06, 0]} rotation={[0, -0.1, 0]}>
            <boxGeometry args={[0.22, 0.04, 0.28]} />
            <meshStandardMaterial color="#1d4ed8" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.1, 0]} rotation={[0, 0.15, 0]}>
            <boxGeometry args={[0.2, 0.04, 0.26]} />
            <meshStandardMaterial color="#047857" roughness={0.5} />
          </mesh>
          {/* Date Stamp & Inkpad */}
          <mesh position={[0.22, 0.02, 0.08]}>
            <boxGeometry args={[0.08, 0.02, 0.08]} />
            <meshStandardMaterial color="#1e293b" roughness={0.5} />
          </mesh>
        </group>
      </group>

      {/* ============================================================ */}
      {/* 6. LIBRARIAN NPC (EMILY)                                     */}
      {/* ============================================================ */}
      <LibrarianEmily isTalking={isTalking} />

      {/* ============================================================ */}
      {/* 7. BOOKSHELVES                                               */}
      {/* ============================================================ */}
      {/* Back Wall Main Shelf (Behind Emily) */}
      <BookshelfUnit position={[19.8, 0, -2.75]} width={3.6} height={2.5} depth={0.4} />

      {/* West Wall Shelf (Language & Linguistics) */}
      <BookshelfUnit position={[16.26, 0, -0.6]} rotation={[0, Math.PI / 2, 0]} width={2.2} height={2.4} depth={0.4} />

      {/* East Wall Shelf (Literature & History) */}
      <BookshelfUnit position={[23.34, 0, -0.6]} rotation={[0, -Math.PI / 2, 0]} width={2.2} height={2.4} depth={0.4} />

      {/* ============================================================ */}
      {/* 8. STUDY TABLES & READING SEATS                              */}
      {/* ============================================================ */}
      {/* Study Table 1 (Left Study Zone) */}
      <StudyTableSet position={[17.6, 0, 0.25]} />

      {/* Study Table 2 (Right Study Zone) */}
      <StudyTableSet position={[22.0, 0, 0.25]} />

      {/* ============================================================ */}
      {/* 9. READING LOUNGE & BOOK DROP RETURN                         */}
      {/* ============================================================ */}
      {/* Armchair in Left Front Lounge Corner */}
      <LibraryArmchair position={[17.0, 0, 1.25]} rotation={[0, 0.6, 0]} />

      {/* Book Drop Bin / Rolling Return Cart (Near Entrance) */}
      <group position={[22.4, 0, 1.25]}>
        <mesh position={[0, 0.42, 0]}>
          <boxGeometry args={[0.65, 0.8, 0.55]} />
          <meshStandardMaterial color="#473322" roughness={0.6} />
        </mesh>
        {/* Book Drop Slot */}
        <mesh position={[0, 0.68, 0.28]}>
          <boxGeometry args={[0.42, 0.08, 0.02]} />
          <meshStandardMaterial color="#0f172a" roughness={0.8} />
        </mesh>
        {/* Label Plaque */}
        <mesh position={[0, 0.54, 0.28]}>
          <boxGeometry args={[0.36, 0.12, 0.01]} />
          <meshStandardMaterial color="#fef3c7" roughness={0.5} />
        </mesh>
      </group>

      {/* ============================================================ */}
      {/* 10. DECORATIVE POTTED INDOOR PLANTS                          */}
      {/* ============================================================ */}
      <LibraryPlant position={[16.6, 0, -2.4]} />
      <LibraryPlant position={[23.0, 0, -2.4]} />
    </group>
  );
}
