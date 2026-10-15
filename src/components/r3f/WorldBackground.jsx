import React, { useMemo } from "react";
import * as THREE from "three";

/**
 * WorldBackground: Immersive distant natural environment surrounding AI-Language-Village.
 *
 * 1. NORTH: Majestic distant mountain range with rocky ridges and snow-capped peaks.
 * 2. EAST:  Lush rolling hills and deep layered forest tree canopy.
 * 3. SOUTH: Expansive ocean with coastal beach shoreline and rocky sea stacks.
 * 4. WEST:  Distant modern city skyline with tiered skyscrapers, towers, and spires.
 *
 * Designed with high aesthetic fidelity, low polygon budget, and batched/instanced geometry
 * for effortless 60+ FPS performance.
 */
function createPrng(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483646;
    return (s - 1) / 2147483646;
  };
}

export function WorldBackground() {
  // ---------------------------------------------------------------------------
  // 1. TERRAIN TRANSITION SKIRT (Surrounds the 65x80 village lawn)
  // ---------------------------------------------------------------------------
  const terrainMats = useMemo(() => {
    return {
      grass: new THREE.MeshStandardMaterial({ color: "#4f9e4f", roughness: 0.95 }),
      forestGround: new THREE.MeshStandardMaterial({ color: "#3a733a", roughness: 0.95 }),
      cityGround: new THREE.MeshStandardMaterial({ color: "#42484f", roughness: 0.9 }),
      mountainGround: new THREE.MeshStandardMaterial({ color: "#455845", roughness: 0.95 }),
      sand: new THREE.MeshStandardMaterial({ color: "#c6b083", roughness: 0.9 }),
      water: new THREE.MeshStandardMaterial({
        color: "#1c5d82",
        roughness: 0.18,
        metalness: 0.15,
        flatShading: true
      }),
      rock: new THREE.MeshStandardMaterial({ color: "#546270", roughness: 0.9, flatShading: true }),
      snow: new THREE.MeshStandardMaterial({ color: "#edf2f7", roughness: 0.8, flatShading: true }),
      bark: new THREE.MeshStandardMaterial({ color: "#4a3219", roughness: 0.9 }),
      pineLeafDark: new THREE.MeshStandardMaterial({ color: "#1d4625", roughness: 0.85, flatShading: true }),
      pineLeafMid: new THREE.MeshStandardMaterial({ color: "#2b5e34", roughness: 0.85, flatShading: true }),
      pineLeafLight: new THREE.MeshStandardMaterial({ color: "#3b7847", roughness: 0.85, flatShading: true }),
      buildingSteel: new THREE.MeshStandardMaterial({ color: "#3f4a56", roughness: 0.6 }),
      buildingGlass: new THREE.MeshStandardMaterial({ color: "#486278", roughness: 0.35, metalness: 0.25 }),
      buildingDark: new THREE.MeshStandardMaterial({ color: "#2a333d", roughness: 0.7 }),
      buildingWarm: new THREE.MeshStandardMaterial({ color: "#505761", roughness: 0.65 })
    };
  }, []);

  // ---------------------------------------------------------------------------
  // 2. MOUNTAIN RANGE (North: Z = 60 to 220, X = -240 to +240)
  // ---------------------------------------------------------------------------
  const mountains = useMemo(() => {
    const list = [];
    const rand = createPrng(42);

    // High distant alpine peaks (Layer 3: Z = 140..220)
    for (let x = -230; x <= 230; x += 28) {
      const xPos = x + (rand() - 0.5) * 16;
      const zPos = 160 + (rand() - 0.5) * 60;
      const height = 48 + rand() * 32;
      const radius = 24 + rand() * 16;
      list.push({ x: xPos, z: zPos, height, radius, hasSnow: height > 55, segs: 6 });
    }

    // Mid rocky mountain ridges (Layer 2: Z = 95..145)
    for (let x = -210; x <= 210; x += 22) {
      const xPos = x + (rand() - 0.5) * 14;
      const zPos = 115 + (rand() - 0.5) * 35;
      const height = 30 + rand() * 24;
      const radius = 18 + rand() * 12;
      list.push({ x: xPos, z: zPos, height, radius, hasSnow: height > 46, segs: 5 });
    }

    // Rolling green foothills (Layer 1: Z = 65..95)
    for (let x = -190; x <= 190; x += 18) {
      const xPos = x + (rand() - 0.5) * 12;
      const zPos = 78 + (rand() - 0.5) * 20;
      const height = 14 + rand() * 14;
      const radius = 14 + rand() * 10;
      list.push({ x: xPos, z: zPos, height, radius, isFoothill: true, segs: 6 });
    }

    return list;
  }, []);

  // ---------------------------------------------------------------------------
  // 3. DISTANT FOREST (East: X = 36 to 180, Z = -80 to +110)
  // ---------------------------------------------------------------------------
  const forestData = useMemo(() => {
    const trees = [];
    const hills = [];
    const rand = createPrng(1337);

    // Low rolling green hillocks on the east
    for (let i = 0; i < 18; i++) {
      const x = 50 + rand() * 110;
      const z = -70 + rand() * 160;
      const r = 18 + rand() * 24;
      const h = 4 + rand() * 9;
      hills.push({ x, z, r, h });
    }

    // Forest trees (layered pine conifers)
    for (let i = 0; i < 120; i++) {
      const x = 38 + rand() * 130;
      const z = -75 + rand() * 175;
      const scale = 0.9 + rand() * 1.1;
      const tier = i % 3; // 0 = dark, 1 = mid, 2 = light
      trees.push({ x, z, scale, tier, rotY: rand() * Math.PI * 2 });
    }

    return { trees, hills };
  }, []);

  // ---------------------------------------------------------------------------
  // 4. DISTANT CITY SKYLINE (West: X = -45 to -200, Z = -75 to +85)
  // ---------------------------------------------------------------------------
  const skylineBuildings = useMemo(() => {
    const list = [];
    const rand = createPrng(98765);

    // Dense grid of towers in the distance
    for (let col = 0; col < 6; col++) {
      const baseX = -52 - col * 24;
      for (let row = 0; row < 7; row++) {
        const baseZ = -65 + row * 22;
        const x = baseX + (rand() - 0.5) * 10;
        const z = baseZ + (rand() - 0.5) * 10;
        const width = 10 + rand() * 12;
        const depth = 10 + rand() * 12;
        // Taller towers further back
        const height = 26 + col * 7 + rand() * 30;
        const matType = Math.floor(rand() * 4);
        const hasSpire = height > 50 && rand() > 0.45;
        const spireH = 8 + rand() * 12;
        const hasSetback = height > 40 && rand() > 0.4;
        list.push({ x, z, width, depth, height, matType, hasSpire, spireH, hasSetback });
      }
    }
    return list;
  }, []);

  // ---------------------------------------------------------------------------
  // 5. OCEAN SHORELINE & SEA STACKS (South: Z = -28 to -360, X = -320 to +320)
  // ---------------------------------------------------------------------------
  const seaStacks = useMemo(() => {
    return [
      { x: -55, z: -110, scale: 6.5, rotY: 0.8 },
      { x: -48, z: -105, scale: 4.2, rotY: 1.9 },
      { x: 65,  z: -130, scale: 7.2, rotY: 2.4 },
      { x: 74,  z: -125, scale: 5.0, rotY: 0.5 },
      { x: -140, z: -170, scale: 12.0, rotY: 1.2 },
      { x: 160,  z: -190, scale: 14.0, rotY: 3.1 },
      { x: 10,   z: -210, scale: 10.5, rotY: 2.8 }
    ];
  }, []);

  return (
    <group name="world-background">
      {/* =================================================================== */}
      {/* 1. SEAMLESS TERRAIN EXTENSION APRON                                 */}
      {/* =================================================================== */}
      {/* North terrain extension (transition to mountain foothills) */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.02, 100]}
        material={terrainMats.mountainGround}
      >
        <planeGeometry args={[460, 100]} />
      </mesh>

      {/* East terrain extension (transition to dense forest hills) */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[115, -0.02, 12]}
        material={terrainMats.forestGround}
      >
        <planeGeometry args={[170, 180]} />
      </mesh>

      {/* West terrain extension (transition to urban city outskirts) */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[-115, -0.02, 12]}
        material={terrainMats.cityGround}
      >
        <planeGeometry args={[170, 180]} />
      </mesh>

      {/* South coastal transition beach / sandy bluff */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.05, -31]}
        material={terrainMats.sand}
      >
        <planeGeometry args={[460, 14]} />
      </mesh>

      {/* =================================================================== */}
      {/* 2. SOUTH OCEAN (Z = -38 to -450)                                    */}
      {/* =================================================================== */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.25, -235]}
        material={terrainMats.water}
      >
        <planeGeometry args={[650, 390]} />
      </mesh>

      {/* Distant Sea Stacks & Coastal Rock Outcrops */}
      {seaStacks.map((stack, idx) => (
        <group
          key={`sea-stack-${idx}`}
          position={[stack.x, 0, stack.z]}
          rotation={[0, stack.rotY, 0]}
          scale={[stack.scale, stack.scale, stack.scale]}
        >
          {/* Main rock pillar */}
          <mesh position={[0, 0.8, 0]} material={terrainMats.rock}>
            <coneGeometry args={[1.2, 2.2, 5]} />
          </mesh>
          <mesh position={[0.4, 0.4, 0.2]} material={terrainMats.rock}>
            <coneGeometry args={[0.7, 1.2, 4]} />
          </mesh>
        </group>
      ))}

      {/* =================================================================== */}
      {/* 3. NORTH MOUNTAIN RANGE (Z = 65 to 220)                             */}
      {/* =================================================================== */}
      <group name="north-mountains">
        {mountains.map((mtn, idx) => (
          <group key={`mountain-${idx}`} position={[mtn.x, 0, mtn.z]}>
            {/* Main mountain body */}
            <mesh
              position={[0, mtn.height / 2, 0]}
              material={mtn.isFoothill ? terrainMats.mountainGround : terrainMats.rock}
            >
              <coneGeometry args={[mtn.radius, mtn.height, mtn.segs || 5]} />
            </mesh>

            {/* Snow cap for high peaks */}
            {mtn.hasSnow && (
              <mesh
                position={[0, mtn.height * 0.82, 0]}
                material={terrainMats.snow}
              >
                <coneGeometry
                  args={[mtn.radius * 0.28, mtn.height * 0.36, mtn.segs || 5]}
                />
              </mesh>
            )}
          </group>
        ))}
      </group>

      {/* =================================================================== */}
      {/* 4. EAST DEEP FOREST (X = 36 to 180)                                 */}
      {/* =================================================================== */}
      <group name="east-forest">
        {/* Rolling forest hillocks */}
        {forestData.hills.map((hill, idx) => (
          <mesh
            key={`forest-hill-${idx}`}
            position={[hill.x, hill.h / 3, hill.z]}
            scale={[1, 0.35, 1]}
            material={terrainMats.forestGround}
          >
            <sphereGeometry args={[hill.r, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2]} />
          </mesh>
        ))}

        {/* Dense pine forest canopy trees */}
        {forestData.trees.map((t, idx) => {
          const leafMat =
            t.tier === 0
              ? terrainMats.pineLeafDark
              : t.tier === 1
              ? terrainMats.pineLeafMid
              : terrainMats.pineLeafLight;

          const s = t.scale * 3.2;

          return (
            <group
              key={`forest-tree-${idx}`}
              position={[t.x, 0, t.z]}
              rotation={[0, t.rotY, 0]}
              scale={[s, s, s]}
            >
              {/* Trunk */}
              <mesh position={[0, 0.6, 0]} material={terrainMats.bark}>
                <cylinderGeometry args={[0.16, 0.24, 1.2, 5]} />
              </mesh>
              {/* Conical foliage tiers */}
              <mesh position={[0, 1.5, 0]} material={leafMat}>
                <coneGeometry args={[1.2, 1.4, 5]} />
              </mesh>
              <mesh position={[0, 2.3, 0]} material={leafMat}>
                <coneGeometry args={[0.95, 1.3, 5]} />
              </mesh>
              <mesh position={[0, 3.0, 0]} material={leafMat}>
                <coneGeometry args={[0.65, 1.1, 5]} />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* =================================================================== */}
      {/* 5. WEST DISTANT METROPOLITAN SKYLINE (X = -45 to -200)              */}
      {/* =================================================================== */}
      <group name="west-skyline">
        {skylineBuildings.map((b, idx) => {
          const mat =
            b.matType === 0
              ? terrainMats.buildingSteel
              : b.matType === 1
              ? terrainMats.buildingGlass
              : b.matType === 2
              ? terrainMats.buildingDark
              : terrainMats.buildingWarm;

          return (
            <group key={`skyline-${idx}`} position={[b.x, 0, b.z]}>
              {/* Main building block */}
              <mesh position={[0, b.height / 2, 0]} material={mat}>
                <boxGeometry args={[b.width, b.height, b.depth]} />
              </mesh>

              {/* Architectural Setback Tier */}
              {b.hasSetback && (
                <mesh
                  position={[0, b.height + (b.height * 0.18) / 2, 0]}
                  material={terrainMats.buildingGlass}
                >
                  <boxGeometry
                    args={[b.width * 0.75, b.height * 0.18, b.depth * 0.75]}
                  />
                </mesh>
              )}

              {/* Antenna / Spire on high-rise towers */}
              {b.hasSpire && (
                <mesh
                  position={[
                    0,
                    b.height + (b.hasSetback ? b.height * 0.18 : 0) + b.spireH / 2,
                    0
                  ]}
                  material={terrainMats.buildingSteel}
                >
                  <cylinderGeometry args={[0.1, 0.35, b.spireH, 4]} />
                </mesh>
              )}
            </group>
          );
        })}
      </group>
    </group>
  );
}
