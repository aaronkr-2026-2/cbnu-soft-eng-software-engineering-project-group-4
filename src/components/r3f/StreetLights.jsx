import React from "react";

/**
 * Low-poly street lamp matching Kenney suburban aesthetic.
 * Slender dark pole, cantilever arm, lamp head casing, and warm emissive light panel.
 */
function SingleStreetLamp({ position, rotationY = 0 }) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Base footing collar */}
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.16, 0.2, 0.16, 6]} />
        <meshStandardMaterial color="#2d3748" roughness={0.7} />
      </mesh>

      {/* Main vertical pole */}
      <mesh position={[0, 1.8, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.09, 3.44, 6]} />
        <meshStandardMaterial color="#2d3748" roughness={0.7} />
      </mesh>

      {/* Cantilever horizontal arm extending forward */}
      <mesh position={[0, 3.48, 0.3]}>
        <boxGeometry args={[0.09, 0.09, 0.65]} />
        <meshStandardMaterial color="#2d3748" roughness={0.7} />
      </mesh>

      {/* Lamp head casing */}
      <mesh position={[0, 3.4, 0.58]}>
        <boxGeometry args={[0.26, 0.12, 0.32]} />
        <meshStandardMaterial color="#1a202c" roughness={0.6} />
      </mesh>

      {/* Emissive light fixture (glows brightly without performance penalty) */}
      <mesh position={[0, 3.32, 0.58]}>
        <boxGeometry args={[0.2, 0.04, 0.26]} />
        <meshStandardMaterial
          color="#fffbe8"
          emissive="#ffe57f"
          emissiveIntensity={2.5}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
}

const STREET_LAMPS = [
  // --- South Main Road Curb Verge (facing road: rotY = 0) ---
  { position: [-17.0, 0, 4.65], rotationY: 0 },
  { position: [-11.0, 0, 4.65], rotationY: 0 },
  { position: [-2.5, 0, 4.65], rotationY: 0 },
  { position: [2.5, 0, 4.65], rotationY: 0 },
  { position: [6.8, 0, 4.65], rotationY: 0 },
  { position: [17.0, 0, 4.65], rotationY: 0 },

  // --- North Main Road Curb Verge (facing road: rotY = Math.PI) ---
  { position: [-17.0, 0, 11.35], rotationY: Math.PI },
  { position: [-11.0, 0, 11.35], rotationY: Math.PI },
  { position: [-1.5, 0, 11.35], rotationY: Math.PI },
  { position: [8.5, 0, 11.35], rotationY: Math.PI },
  { position: [17.0, 0, 11.35], rotationY: Math.PI },

  // --- Village Plaza & Residential Paths ---
  { position: [-4.0, 0, 1.0], rotationY: -Math.PI / 2 }, // Cafe-Shop Plaza
  { position: [-6.6, 0, -4.5], rotationY: Math.PI / 2 }, // West Residential Lane
  { position: [-23.0, 0, 4.65], rotationY: 0 },          // House D / Bank Front
  { position: [23.0, 0, 4.65], rotationY: 0 },           // House C / Library Front
  { position: [3.5, 0, 3.2], rotationY: -Math.PI / 2 }   // East Lane entrance from Sidewalk
];

/**
 * StreetLights: Village street lamps along main road, crosswalks, plaza, and residential lanes.
 */
export function StreetLights() {
  return (
    <group>
      {STREET_LAMPS.map((lamp, idx) => (
        <SingleStreetLamp
          key={`street-lamp-${idx}`}
          position={lamp.position}
          rotationY={lamp.rotationY}
        />
      ))}

      {/* Two soft ambient focal pointlights at key village hubs (lightweight, no shadows) */}
      <pointLight
        position={[-4.0, 3.2, 1.0]}
        intensity={0.6}
        distance={8}
        decay={2}
        color="#ffe57f"
      />
      <pointLight
        position={[3.5, 3.2, 3.2]}
        intensity={0.6}
        distance={8}
        decay={2}
        color="#ffe57f"
      />
    </group>
  );
}
