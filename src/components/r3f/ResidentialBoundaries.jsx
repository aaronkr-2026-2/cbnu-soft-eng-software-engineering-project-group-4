import React from "react";
import * as THREE from "three";

/**
 * Low-poly Korean-style stone gate pillar ("대문 기둥").
 * Sturdy light-grey concrete/stone column with a dark cap stone and optional nameplate/mailbox.
 */
function GatePillar({ position, hasMailbox = false, mailboxRot = 0 }) {
  return (
    <group position={position}>
      {/* Stone Column Base */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <boxGeometry args={[0.34, 1.2, 0.34]} />
        <meshStandardMaterial color="#c2c7cc" roughness={0.8} />
      </mesh>

      {/* Stone Coping Cap */}
      <mesh position={[0, 1.24, 0]} castShadow>
        <boxGeometry args={[0.42, 0.08, 0.42]} />
        <meshStandardMaterial color="#788089" roughness={0.7} />
      </mesh>

      {/* Detail: Mailbox / Nameplate */}
      {hasMailbox && (
        <mesh position={[0, 0.8, 0.19]} rotation={[0, mailboxRot, 0]}>
          <boxGeometry args={[0.16, 0.22, 0.04]} />
          <meshStandardMaterial color="#2d3748" roughness={0.5} />
        </mesh>
      )}
    </group>
  );
}

/**
 * Reusable low residential boundary wall / fence ("담장").
 * Low stone/concrete base topped with coping stone and a sleek dark metal top rail.
 * Total height: 0.62m (waist-height, keeping houses 100% visible and unobtrusive).
 */
function BoundaryWall({ position, length, axis = "x" }) {
  const isX = axis === "x";
  return (
    <group position={[position[0], 0, position[1]]}>
      {/* Concrete / Stone Wall Base (height 0.42m) */}
      <mesh position={[0, 0.21, 0]} castShadow receiveShadow>
        <boxGeometry args={isX ? [length, 0.42, 0.18] : [0.18, 0.42, length]} />
        <meshStandardMaterial color="#b0b7bd" roughness={0.85} />
      </mesh>

      {/* Coping Cap Stone (height 0.06m) */}
      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={isX ? [length + 0.04, 0.06, 0.22] : [0.22, 0.06, length + 0.04]} />
        <meshStandardMaterial color="#788089" roughness={0.7} />
      </mesh>

      {/* Dark Metal Top Railing (height 0.12m) */}
      <mesh position={[0, 0.58, 0]}>
        <boxGeometry args={isX ? [length, 0.04, 0.04] : [0.04, 0.04, length]} />
        <meshStandardMaterial color="#2d3748" roughness={0.6} />
      </mesh>
    </group>
  );
}

// 10 Gate Pillars (2 pillars per building property entrance)
const GATE_PILLARS = [
  // House A / Hotel (South front entrance along South Sidewalk)
  { position: [7.8, 0, 3.0], hasMailbox: true, mailboxRot: 0 },
  { position: [11.2, 0, 3.0], hasMailbox: false },

  // House C / Library (South front entrance along South Sidewalk, beside Hotel)
  { position: [18.2, 0, 3.1], hasMailbox: true, mailboxRot: 0 },
  { position: [21.4, 0, 3.1], hasMailbox: false },

  // House D / Bank (South front entrance along South Sidewalk, beside Cafe)
  { position: [-24.6, 0, 3.1], hasMailbox: true, mailboxRot: 0 },
  { position: [-21.4, 0, 3.1], hasMailbox: false },

  // House E / Police Station (South entrance facing North Sidewalk & Crosswalk 2)
  { position: [3.2, 0, 13.0], hasMailbox: true, mailboxRot: 0 },
  { position: [6.8, 0, 13.0], hasMailbox: false },

  // House B / Hospital (South civic entrance facing North Sidewalk & Crosswalk 1)
  { position: [-9.8, 0, 13.0], hasMailbox: true, mailboxRot: 0 },
  { position: [-6.2, 0, 13.0], hasMailbox: false },

  // --- Education & Community District Entrance Pillars (Front Sidewalk Z = 32.6) ---
  // Language School Pillars (West side)
  { position: [-15.4, 0, 32.6], hasMailbox: false },
  { position: [-13.4, 0, 32.6], hasMailbox: false },

  // Study Center Pillars (West plaza-side)
  { position: [-8.5, 0, 32.6], hasMailbox: false },
  { position: [-6.5, 0, 32.6], hasMailbox: false },

  // Community Center Pillars (East plaza-side)
  { position: [6.2, 0, 32.6], hasMailbox: false },
  { position: [8.2, 0, 32.6], hasMailbox: false },

  // Career Center Pillars (East roadside)
  { position: [13.4, 0, 32.6], hasMailbox: false },
  { position: [15.4, 0, 32.6], hasMailbox: false }
];

// Reorganized Low Boundary Wall Sections snugly framing property lots
const BOUNDARY_WALLS = [
  // --- House A / Hotel Boundary (3 sections) ---
  { position: [6.375, 3.0], length: 2.85, axis: "x" },
  { position: [12.625, 3.0], length: 2.85, axis: "x" },
  { position: [14.05, -0.15], length: 6.3, axis: "z" },

  // --- House C / Library Boundary (4 sections) beside Hotel ---
  { position: [16.75, 3.1], length: 2.9, axis: "x" },
  { position: [22.85, 3.1], length: 2.9, axis: "x" },
  { position: [24.3, -0.5], length: 7.2, axis: "z" },
  { position: [19.8, -4.1], length: 9.0, axis: "x" },

  // --- House D / Bank Boundary (4 sections) beside Cafe ---
  { position: [-26.875, 3.1], length: 4.55, axis: "x" },
  { position: [-19.125, 3.1], length: 4.55, axis: "x" },
  { position: [-29.15, -0.5], length: 7.2, axis: "z" },
  { position: [-23.0, -4.1], length: 12.3, axis: "x" },

  // --- House E / Police Station Boundary (4 sections) ---
  { position: [1.825, 13.0], length: 2.75, axis: "x" },
  { position: [8.175, 13.0], length: 2.75, axis: "x" },
  { position: [0.45, 17.05], length: 8.1, axis: "z" },
  { position: [9.55, 17.05], length: 8.1, axis: "z" },

  // --- House B / Hospital Boundary (4 sections) ---
  { position: [-12.1, 13.0], length: 4.6, axis: "x" },
  { position: [-3.9, 13.0], length: 4.6, axis: "x" },
  { position: [-14.4, 17.25], length: 8.5, axis: "z" },
  { position: [-1.6, 17.25], length: 8.5, axis: "z" },

  // --- Education & Community District Low Front Walls (Z = 32.6) ---
  { position: [-16.2, 32.6], length: 1.4, axis: "x" },
  { position: [-5.7, 32.6], length: 1.4, axis: "x" },
  { position: [5.4, 32.6], length: 1.4, axis: "x" },
  { position: [16.2, 32.6], length: 1.4, axis: "x" }
];

// Low-poly greenery bushes
const DISTRICT_BUSHES = [
  // Language School yard (F)
  { position: [-16.0, 0, 34.0], scale: 1.1, color: "#16a34a" },
  { position: [-12.8, 0, 34.0], scale: 0.9, color: "#22c55e" },
  // Study Center yard (G)
  { position: [-8.8, 0, 34.0], scale: 1.0, color: "#15803d" },
  { position: [-6.2, 0, 34.0], scale: 0.9, color: "#22c55e" },
  // Activity Center yard (J)
  { position: [-12.2, 0, 40.2], scale: 1.05, color: "#16a34a" },
  { position: [-9.4, 0, 40.2], scale: 0.85, color: "#15803d" },
  // Community Center yard (H)
  { position: [5.8, 0, 34.0], scale: 0.9, color: "#22c55e" },
  { position: [8.6, 0, 34.0], scale: 1.05, color: "#16a34a" },
  // Career Center yard (I)
  { position: [12.8, 0, 34.0], scale: 0.9, color: "#15803d" },
  { position: [16.0, 0, 34.0], scale: 1.1, color: "#22c55e" },
  // Multi-Purpose Hall yard (K)
  { position: [9.4, 0, 40.2], scale: 0.85, color: "#16a34a" },
  { position: [12.2, 0, 40.2], scale: 1.0, color: "#15803d" }
];

function GardenBush({ position, scale = 1.0, color = "#22c55e" }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.32, 0]} castShadow receiveShadow>
        <dodecahedronGeometry args={[0.34, 1]} />
        <meshStandardMaterial color={color} roughness={0.85} />
      </mesh>
    </group>
  );
}

// 6 Freestanding Entrance Totems (F through K)
const FACILITY_TOTEMS = [
  { position: [-12.9, 0, 33.1], title: "Language School", subtitle: "어학원", accentColor: "#0284c7" },
  { position: [-6.0, 0, 33.4], title: "Study Center", subtitle: "학습센터", accentColor: "#7c3aed" },
  { position: [5.7, 0, 33.9], title: "Community Center", subtitle: "주민센터", accentColor: "#059669" },
  { position: [12.9, 0, 33.6], title: "Career Center", subtitle: "취업지원센터", accentColor: "#d97706" },
  { position: [-9.3, 0, 39.8], title: "Activity Center", subtitle: "활동센터", accentColor: "#e11d48" },
  { position: [9.3, 0, 39.4], title: "Multi-Purpose Hall", subtitle: "다목적홀", accentColor: "#4f46e5" }
];

/**
 * Modern freestanding information totem near facility entrances.
 */
function FacilityEntranceTotem({ position, title, subtitle, accentColor }) {
  const texture = React.useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, 512, 256);

    ctx.fillStyle = accentColor;
    ctx.fillRect(0, 0, 512, 28);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 56px system-ui, -apple-system, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(subtitle, 256, 110);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "bold 34px system-ui, -apple-system, sans-serif";
    ctx.fillText(title, 256, 190);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [title, subtitle, accentColor]);

  return (
    <group position={position}>
      <mesh position={[0, 0.45, 0]} castShadow>
        <boxGeometry args={[0.08, 0.9, 0.08]} />
        <meshStandardMaterial color="#1e293b" roughness={0.6} />
      </mesh>
      <mesh position={[0, 1.0, 0]} castShadow>
        <boxGeometry args={[0.55, 0.55, 0.05]} />
        <meshStandardMaterial color="#1e293b" roughness={0.5} />
      </mesh>
      {texture && (
        <mesh position={[0, 1.0, 0.028]}>
          <planeGeometry args={[0.51, 0.51]} />
          <meshStandardMaterial map={texture} roughness={0.3} />
        </mesh>
      )}
    </group>
  );
}

/**
 * Central District Directory kiosk in the Community Education Plaza.
 */
function CentralDistrictDirectory({ position }) {
  const texture = React.useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, 1024, 512);

    ctx.fillStyle = "#0284c7";
    ctx.fillRect(0, 0, 1024, 48);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 44px system-ui, -apple-system, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("EDUCATION & COMMUNITY DISTRICT", 512, 100);

    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 32px system-ui, -apple-system, sans-serif";
    ctx.fillText("교육 및 주민 복합 지구 종합 안내", 512, 160);

    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(80, 205);
    ctx.lineTo(944, 205);
    ctx.stroke();

    ctx.font = "bold 26px system-ui, -apple-system, sans-serif";
    ctx.textAlign = "left";

    // Left Column
    ctx.fillStyle = "#38bdf8";
    ctx.fillText("• 어학원 (Language School)", 100, 260);
    ctx.fillStyle = "#a78bfa";
    ctx.fillText("• 학습센터 (Study Center)", 100, 330);
    ctx.fillStyle = "#34d399";
    ctx.fillText("• 주민센터 (Community Center)", 100, 400);

    // Right Column
    ctx.fillStyle = "#fbbf24";
    ctx.fillText("• 취업지원센터 (Career Center)", 550, 260);
    ctx.fillStyle = "#fb7185";
    ctx.fillText("• 활동센터 (Activity Center)", 550, 330);
    ctx.fillStyle = "#818cf8";
    ctx.fillText("• 다목적홀 (Multi-Purpose Hall)", 550, 400);

    ctx.fillStyle = "#64748b";
    ctx.font = "italic 22px system-ui, -apple-system, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("AI Language Village Community Education Hub", 512, 465);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  return (
    <group position={position}>
      <mesh position={[-0.7, 0.65, 0]} castShadow>
        <boxGeometry args={[0.08, 1.3, 0.08]} />
        <meshStandardMaterial color="#1e293b" roughness={0.6} />
      </mesh>
      <mesh position={[0.7, 0.65, 0]} castShadow>
        <boxGeometry args={[0.08, 1.3, 0.08]} />
        <meshStandardMaterial color="#1e293b" roughness={0.6} />
      </mesh>
      <mesh position={[0, 1.45, 0]} castShadow>
        <boxGeometry args={[1.7, 0.95, 0.06]} />
        <meshStandardMaterial color="#1e293b" roughness={0.5} />
      </mesh>
      {texture && (
        <mesh position={[0, 1.45, 0.035]}>
          <planeGeometry args={[1.64, 0.89]} />
          <meshStandardMaterial map={texture} roughness={0.3} />
        </mesh>
      )}
    </group>
  );
}

/**
 * Slatted wood and steel public plaza bench.
 */
function PlazaBench({ position, rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.4, 0.06, 0.44]} />
        <meshStandardMaterial color="#8b5a2b" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.68, -0.19]} castShadow receiveShadow>
        <boxGeometry args={[1.4, 0.36, 0.05]} />
        <meshStandardMaterial color="#8b5a2b" roughness={0.7} />
      </mesh>
      <mesh position={[-0.6, 0.22, 0]} castShadow>
        <boxGeometry args={[0.06, 0.44, 0.4]} />
        <meshStandardMaterial color="#1e293b" roughness={0.5} />
      </mesh>
      <mesh position={[0.6, 0.22, 0]} castShadow>
        <boxGeometry args={[0.06, 0.44, 0.4]} />
        <meshStandardMaterial color="#1e293b" roughness={0.5} />
      </mesh>
    </group>
  );
}

/**
 * Modern concrete square flower planter with colorful blossoms.
 */
function PlazaPlanter({ position, flowerColor = "#facc15" }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.75, 0.5, 0.75]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.48, 0]}>
        <boxGeometry args={[0.68, 0.04, 0.68]} />
        <meshStandardMaterial color="#3e2723" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.62, 0]} castShadow>
        <dodecahedronGeometry args={[0.32, 1]} />
        <meshStandardMaterial color="#15803d" roughness={0.85} />
      </mesh>
      <mesh position={[0.15, 0.72, 0.1]}>
        <sphereGeometry args={[0.06, 6, 6]} />
        <meshStandardMaterial color={flowerColor} roughness={0.4} />
      </mesh>
      <mesh position={[-0.12, 0.68, -0.12]}>
        <sphereGeometry args={[0.055, 6, 6]} />
        <meshStandardMaterial color="#ffffff" roughness={0.4} />
      </mesh>
    </group>
  );
}

/**
 * Modern decorative circular stone water fountain in the center of the plaza.
 */
function PlazaFountain({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.15, 1.25, 0.3, 20]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.24, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.05, 20]} />
        <meshStandardMaterial
          color="#38bdf8"
          roughness={0.15}
          metalness={0.7}
        />
      </mesh>
      <mesh position={[0, 0.45, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.28, 0.45, 12]} />
        <meshStandardMaterial color="#64748b" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.72, 0]} castShadow>
        <sphereGeometry args={[0.16, 12, 12]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.4} />
      </mesh>
    </group>
  );
}

/**
 * ResidentialBoundaries: Boundary walls, entrance pillars,
 * and Community Education Plaza amenities.
 */
export function ResidentialBoundaries() {
  return (
    <group>
      {/* Gate Pillars */}
      {GATE_PILLARS.map((pillar, idx) => (
        <GatePillar
          key={`gate-pillar-${idx}`}
          position={pillar.position}
          hasMailbox={pillar.hasMailbox}
          mailboxRot={pillar.mailboxRot}
        />
      ))}

      {/* Low Boundary Walls */}
      {BOUNDARY_WALLS.map((wall, idx) => (
        <BoundaryWall
          key={`boundary-wall-${idx}`}
          position={wall.position}
          length={wall.length}
          axis={wall.axis}
        />
      ))}

      {/* Low-Poly Greenery */}
      {DISTRICT_BUSHES.map((bush, idx) => (
        <GardenBush
          key={`res-bush-${idx}`}
          position={bush.position}
          scale={bush.scale}
          color={bush.color}
        />
      ))}

      {/* Facility Entrance Totems (Bilingual directory totem beside each building entrance) */}
      {FACILITY_TOTEMS.map((totem, idx) => (
        <FacilityEntranceTotem
          key={`fac-totem-${idx}`}
          position={totem.position}
          title={totem.title}
          subtitle={totem.subtitle}
          accentColor={totem.accentColor}
        />
      ))}

      {/* Community Education Plaza: Central Directory Kiosk */}
      <CentralDistrictDirectory position={[-0.75, 0, 33.7]} />

      {/* Community Education Plaza: Central Decorative Fountain */}
      <PlazaFountain position={[-0.75, 0, 36.8]} />

      {/* Community Education Plaza: 4 Public Benches */}
      <PlazaBench position={[-3.8, 0, 36.8]} rotation={[0, Math.PI / 2, 0]} />
      <PlazaBench position={[2.3, 0, 36.8]} rotation={[0, -Math.PI / 2, 0]} />
      <PlazaBench position={[-2.2, 0, 39.2]} rotation={[0, 0, 0]} />
      <PlazaBench position={[0.7, 0, 39.2]} rotation={[0, 0, 0]} />

      {/* Community Education Plaza: 4 Corner Flower Planters */}
      <PlazaPlanter position={[-4.4, 0, 33.8]} flowerColor="#facc15" />
      <PlazaPlanter position={[2.9, 0, 33.8]} flowerColor="#ec4899" />
      <PlazaPlanter position={[-4.4, 0, 39.4]} flowerColor="#38bdf8" />
      <PlazaPlanter position={[2.9, 0, 39.4]} flowerColor="#f87171" />
    </group>
  );
}
