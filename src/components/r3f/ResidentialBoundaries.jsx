import React, { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";

// 18 Gate Pillars (2 pillars per building property entrance)
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
  // Language School Pillars (West side, centered around X = -22.0)
  { position: [-23.1, 0, 32.6], hasMailbox: false },
  { position: [-20.9, 0, 32.6], hasMailbox: false },

  // Study Center Pillars (West plaza-side, centered around X = -9.5)
  { position: [-10.6, 0, 32.6], hasMailbox: false },
  { position: [-8.4, 0, 32.6], hasMailbox: false },

  // Community Center Pillars (East plaza-side, centered around X = 9.5)
  { position: [8.4, 0, 32.6], hasMailbox: false },
  { position: [10.6, 0, 32.6], hasMailbox: false },

  // Career Center Pillars (East roadside, centered around X = 22.0)
  { position: [20.9, 0, 32.6], hasMailbox: false },
  { position: [23.1, 0, 32.6], hasMailbox: false }
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
  { position: [-25.2, 32.6], length: 2.4, axis: "x" },
  { position: [-6.0, 32.6], length: 2.4, axis: "x" },
  { position: [6.0, 32.6], length: 2.4, axis: "x" },
  { position: [25.2, 32.6], length: 2.4, axis: "x" }
];

// Low-poly greenery bushes
const DISTRICT_BUSHES = [
  { position: [-24.5, 0, 34.5], scale: 1.1, color: "#16a34a" },
  { position: [-19.5, 0, 34.5], scale: 0.9, color: "#22c55e" },
  { position: [-12.0, 0, 34.5], scale: 1.0, color: "#15803d" },
  { position: [-7.0, 0, 34.5], scale: 0.9, color: "#22c55e" },
  { position: [7.0, 0, 34.5], scale: 1.0, color: "#16a34a" },
  { position: [12.0, 0, 34.5], scale: 1.1, color: "#22c55e" },
  { position: [19.5, 0, 34.5], scale: 0.9, color: "#15803d" },
  { position: [24.5, 0, 34.5], scale: 1.0, color: "#16a34a" },
  { position: [-18.5, 0, 45.0], scale: 1.0, color: "#16a34a" },
  { position: [-13.5, 0, 45.0], scale: 1.1, color: "#22c55e" },
  { position: [13.5, 0, 45.0], scale: 1.1, color: "#15803d" },
  { position: [18.5, 0, 45.0], scale: 0.9, color: "#16a34a" },
  { position: [-2.0, 0, 36.8], scale: 0.85, color: "#16a34a" },
  { position: [2.0, 0, 36.8], scale: 0.85, color: "#22c55e" }
];

const FACILITY_TOTEMS = [
  { position: [-21.0, 0, 34.5], title: "LANGUAGE SCHOOL", subtitle: "어학원", accentColor: "#0284c7" },
  { position: [-8.5, 0, 34.5], title: "STUDY CENTER", subtitle: "학습관", accentColor: "#7c3aed" },
  { position: [8.5, 0, 34.5], title: "COMMUNITY CENTER", subtitle: "주민센터", accentColor: "#059669" },
  { position: [21.0, 0, 34.5], title: "CAREER CENTER", subtitle: "진로상담센터", accentColor: "#d97706" },
  { position: [-15.0, 0, 45.5], title: "ACTIVITY CENTER", subtitle: "청소년활동관", accentColor: "#e11d48" },
  { position: [15.0, 0, 45.5], title: "MULTI-PURPOSE HALL", subtitle: "다목적강당", accentColor: "#4f46e5" }
];

function BatchedBoundaryWalls() {
  const { baseGeom, capGeom, railGeom, baseMat, capMat, railMat } = useMemo(() => {
    const baseList = [];
    const capList = [];
    const railList = [];

    BOUNDARY_WALLS.forEach((wall) => {
      const isX = wall.axis === "x";
      const x = wall.position[0];
      const z = wall.position[1];

      // Base
      const bg = new THREE.BoxGeometry(isX ? wall.length : 0.18, 0.42, isX ? 0.18 : wall.length);
      bg.translate(x, 0.21, z);
      baseList.push(bg);

      // Cap
      const cg = new THREE.BoxGeometry(isX ? wall.length + 0.04 : 0.22, 0.06, isX ? 0.22 : wall.length + 0.04);
      cg.translate(x, 0.45, z);
      capList.push(cg);

      // Rail
      const rg = new THREE.BoxGeometry(isX ? wall.length : 0.04, 0.04, isX ? 0.04 : wall.length);
      rg.translate(x, 0.58, z);
      railList.push(rg);
    });

    const mBase = BufferGeometryUtils.mergeGeometries(baseList, false);
    const mCap = BufferGeometryUtils.mergeGeometries(capList, false);
    const mRail = BufferGeometryUtils.mergeGeometries(railList, false);
    mBase.computeVertexNormals();
    mCap.computeVertexNormals();
    mRail.computeVertexNormals();

    return {
      baseGeom: mBase,
      capGeom: mCap,
      railGeom: mRail,
      baseMat: new THREE.MeshStandardMaterial({ color: "#b0b7bd", roughness: 0.85 }),
      capMat: new THREE.MeshStandardMaterial({ color: "#788089", roughness: 0.7 }),
      railMat: new THREE.MeshStandardMaterial({ color: "#2d3748", roughness: 0.6 })
    };
  }, []);

  return (
    <group name="batched-boundary-walls">
      <mesh geometry={baseGeom} material={baseMat} castShadow receiveShadow />
      <mesh geometry={capGeom} material={capMat} receiveShadow />
      <mesh geometry={railGeom} material={railMat} />
    </group>
  );
}

function InstancedGatePillars() {
  const pillarRef = useRef();

  const { geom, mat } = useMemo(() => {
    const col = new THREE.BoxGeometry(0.34, 1.2, 0.34);
    col.translate(0, 0.6, 0);

    const cap = new THREE.BoxGeometry(0.42, 0.08, 0.42);
    cap.translate(0, 1.24, 0);

    const merged = BufferGeometryUtils.mergeGeometries([col, cap], false);
    merged.computeVertexNormals();

    return {
      geom: merged,
      mat: new THREE.MeshStandardMaterial({ color: "#9ca3af", roughness: 0.75 })
    };
  }, []);

  useEffect(() => {
    if (!pillarRef.current) return;
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const s = new THREE.Vector3(1, 1, 1);

    GATE_PILLARS.forEach((p, i) => {
      m.compose(new THREE.Vector3(...p.position), q, s);
      pillarRef.current.setMatrixAt(i, m);
    });
    pillarRef.current.instanceMatrix.needsUpdate = true;
  }, []);

  return (
    <instancedMesh
      ref={pillarRef}
      args={[geom, mat, GATE_PILLARS.length]}
      castShadow
      receiveShadow
    />
  );
}

function InstancedDistrictBushes() {
  const bushRef = useRef();

  const { geom, mat } = useMemo(() => {
    const sphere = new THREE.DodecahedronGeometry(0.48, 1);
    sphere.computeVertexNormals();
    return {
      geom: sphere,
      mat: new THREE.MeshStandardMaterial({ color: "#16a34a", roughness: 0.85 })
    };
  }, []);

  useEffect(() => {
    if (!bushRef.current) return;
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();

    DISTRICT_BUSHES.forEach((b, i) => {
      const s = new THREE.Vector3(b.scale, b.scale, b.scale);
      m.compose(new THREE.Vector3(b.position[0], b.position[1] + 0.48 * b.scale, b.position[2]), q, s);
      bushRef.current.setMatrixAt(i, m);
    });
    bushRef.current.instanceMatrix.needsUpdate = true;
  }, []);

  return (
    <instancedMesh
      ref={bushRef}
      args={[geom, mat, DISTRICT_BUSHES.length]}
      receiveShadow
    />
  );
}

function FacilityEntranceTotem({ position, title, subtitle, accentColor }) {
  const texture = useMemo(() => {
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
      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={[0.08, 0.9, 0.08]} />
        <meshStandardMaterial color="#1e293b" roughness={0.6} />
      </mesh>
      <mesh position={[0, 1.0, 0]}>
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

function CentralDistrictDirectory({ position }) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, 512, 256);

    ctx.fillStyle = "#0284c7";
    ctx.fillRect(0, 0, 512, 28);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 26px system-ui, -apple-system, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("EDUCATION & COMMUNITY DISTRICT", 256, 50);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "bold 18px system-ui, -apple-system, sans-serif";
    ctx.fillText("North Village Expansion Area", 256, 85);

    const entries = [
      "F - Language School (어학원)",
      "G - Study Center (학습관)",
      "H - Community Center (주민센터)",
      "I - Career Center (진로상담센터)",
      "J - Activity Center (청소년활동관)",
      "K - Multi-Purpose Hall (다목적강당)"
    ];

    ctx.font = "16px monospace";
    ctx.textAlign = "left";
    entries.forEach((entry, i) => {
      const col = i < 3 ? 30 : 270;
      const row = 125 + (i % 3) * 35;
      ctx.fillStyle = "#e2e8f0";
      ctx.fillText(entry, col, row);
    });

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  return (
    <group position={position}>
      <mesh position={[0, 0.65, 0]}>
        <boxGeometry args={[1.5, 1.3, 0.12]} />
        <meshStandardMaterial color="#1e293b" roughness={0.6} />
      </mesh>
      {texture && (
        <mesh position={[0, 0.72, 0.065]}>
          <planeGeometry args={[1.38, 0.95]} />
          <meshStandardMaterial map={texture} roughness={0.4} />
        </mesh>
      )}
    </group>
  );
}

function PlazaFountain({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.15, 0]} receiveShadow>
        <cylinderGeometry args={[1.15, 1.25, 0.3, 16]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.24, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.05, 16]} />
        <meshStandardMaterial color="#38bdf8" roughness={0.15} metalness={0.7} />
      </mesh>
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.22, 0.28, 0.45, 10]} />
        <meshStandardMaterial color="#64748b" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.72, 0]}>
        <sphereGeometry args={[0.16, 10, 8]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.4} />
      </mesh>
    </group>
  );
}

function PlazaBench({ position, rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[1.2, 0.06, 0.4]} />
        <meshStandardMaterial color="#78350f" roughness={0.7} />
      </mesh>
      <mesh position={[-0.5, 0.17, 0]}>
        <boxGeometry args={[0.08, 0.34, 0.36]} />
        <meshStandardMaterial color="#1e293b" roughness={0.6} />
      </mesh>
      <mesh position={[0.5, 0.17, 0]}>
        <boxGeometry args={[0.08, 0.34, 0.36]} />
        <meshStandardMaterial color="#1e293b" roughness={0.6} />
      </mesh>
    </group>
  );
}

function PlazaPlanter({ position, flowerColor = "#facc15" }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[0.7, 0.5, 0.7]} />
        <meshStandardMaterial color="#475569" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.52, 0]}>
        <boxGeometry args={[0.6, 0.1, 0.6]} />
        <meshStandardMaterial color="#15803d" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.6, 0]}>
        <sphereGeometry args={[0.22, 8, 8]} />
        <meshStandardMaterial color={flowerColor} roughness={0.5} />
      </mesh>
    </group>
  );
}

export function ResidentialBoundaries() {
  return (
    <group name="residential-boundaries">
      {/* 1. Batched Boundary Walls (3 GPU draw calls for all 23 wall sections) */}
      <BatchedBoundaryWalls />

      {/* 2. Instanced Gate Pillars (1 GPU draw call for all 18 pillars) */}
      <InstancedGatePillars />

      {/* 3. Instanced Greenery Bushes (1 GPU draw call for all 14 bushes) */}
      <InstancedDistrictBushes />

      {/* 4. Facility Totems */}
      {FACILITY_TOTEMS.map((totem, idx) => (
        <FacilityEntranceTotem
          key={`fac-totem-${idx}`}
          position={totem.position}
          title={totem.title}
          subtitle={totem.subtitle}
          accentColor={totem.accentColor}
        />
      ))}

      {/* 5. Central Directory & Fountain */}
      <CentralDistrictDirectory position={[0.0, 0, 33.7]} />
      <PlazaFountain position={[0.0, 0, 36.8]} />

      {/* 6. Plaza Benches */}
      <PlazaBench position={[-3.2, 0, 36.8]} rotation={[0, Math.PI / 2, 0]} />
      <PlazaBench position={[3.2, 0, 36.8]} rotation={[0, -Math.PI / 2, 0]} />
      <PlazaBench position={[-1.6, 0, 39.5]} rotation={[0, 0, 0]} />
      <PlazaBench position={[1.6, 0, 39.5]} rotation={[0, 0, 0]} />

      {/* 7. Plaza Planters */}
      <PlazaPlanter position={[-3.8, 0, 33.8]} flowerColor="#facc15" />
      <PlazaPlanter position={[3.8, 0, 33.8]} flowerColor="#ec4899" />
      <PlazaPlanter position={[-3.8, 0, 39.5]} flowerColor="#38bdf8" />
      <PlazaPlanter position={[3.8, 0, 39.5]} flowerColor="#f87171" />
    </group>
  );
}
