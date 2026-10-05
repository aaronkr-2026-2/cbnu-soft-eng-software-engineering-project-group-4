import React, { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

/**
 * Stylized low-poly Emma (Hotel Receptionist)
 */
function ReceptionistEmma({ isTalking = false }) {
  const headRef = useRef();
  const leftArmRef = useRef();
  const rightArmRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (headRef.current) {
      headRef.current.position.y = 1.38 + Math.sin(t * 2) * 0.005;
      if (isTalking) {
        headRef.current.rotation.y = Math.sin(t * 5) * 0.08;
        headRef.current.rotation.x = Math.sin(t * 8) * 0.04;
      } else {
        headRef.current.rotation.y = Math.sin(t * 0.8) * 0.03;
        headRef.current.rotation.x = 0;
      }
    }
    if (rightArmRef.current && isTalking) {
      rightArmRef.current.rotation.x = -0.4 + Math.sin(t * 6) * 0.15;
    }
    if (leftArmRef.current && isTalking) {
      leftArmRef.current.rotation.x = -0.4 - Math.sin(t * 6) * 0.12;
    }
  });

  return (
    <group position={[9.5, 0, -1.85]}>
      {/* Lower Body / Skirt */}
      <mesh position={[0, 0.45, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.28, 0.9, 16]} />
        <meshStandardMaterial color="#1a237e" roughness={0.7} />
      </mesh>

      {/* Torso / Blazer */}
      <mesh position={[0, 1.05, 0]} castShadow>
        <boxGeometry args={[0.42, 0.52, 0.26]} />
        <meshStandardMaterial color="#1a237e" roughness={0.6} />
      </mesh>

      {/* White Shirt Collar & Silk Scarf */}
      <mesh position={[0, 1.25, 0.12]}>
        <boxGeometry args={[0.16, 0.12, 0.04]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} />
      </mesh>
      <mesh position={[0, 1.18, 0.135]}>
        <boxGeometry args={[0.08, 0.08, 0.03]} />
        <meshStandardMaterial color="#c62828" roughness={0.5} />
      </mesh>

      {/* Gold Name Badge: EMMA */}
      <mesh position={[0.12, 1.18, 0.135]}>
        <boxGeometry args={[0.08, 0.04, 0.02]} />
        <meshStandardMaterial color="#ffd700" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Head & Neck */}
      <mesh position={[0, 1.34, 0]}>
        <cylinderGeometry args={[0.07, 0.08, 0.1, 12]} />
        <meshStandardMaterial color="#f5d0b0" roughness={0.6} />
      </mesh>

      <group ref={headRef} position={[0, 1.38, 0]}>
        {/* Face */}
        <mesh position={[0, 0.12, 0]} castShadow>
          <sphereGeometry args={[0.13, 16, 16]} />
          <meshStandardMaterial color="#f5d0b0" roughness={0.6} />
        </mesh>
        {/* Hair */}
        <mesh position={[0, 0.17, -0.02]}>
          <sphereGeometry args={[0.145, 16, 16]} />
          <meshStandardMaterial color="#4e342e" roughness={0.8} />
        </mesh>
        {/* Hair Bun */}
        <mesh position={[0, 0.22, -0.1]}>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshStandardMaterial color="#3e2723" roughness={0.8} />
        </mesh>
      </group>

      {/* Left Arm */}
      <group ref={leftArmRef} position={[-0.26, 1.25, 0]}>
        <mesh position={[0, -0.22, 0.08]} rotation={[-0.4, 0, 0]} castShadow>
          <boxGeometry args={[0.1, 0.44, 0.1]} />
          <meshStandardMaterial color="#1a237e" roughness={0.6} />
        </mesh>
        <mesh position={[0, -0.42, 0.18]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color="#f5d0b0" roughness={0.6} />
        </mesh>
      </group>

      {/* Right Arm */}
      <group ref={rightArmRef} position={[0.26, 1.25, 0]}>
        <mesh position={[0, -0.22, 0.08]} rotation={[-0.4, 0, 0]} castShadow>
          <boxGeometry args={[0.1, 0.44, 0.1]} />
          <meshStandardMaterial color="#1a237e" roughness={0.6} />
        </mesh>
        <mesh position={[0, -0.42, 0.18]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color="#f5d0b0" roughness={0.6} />
        </mesh>
      </group>
    </group>
  );
}

/**
 * Potted decorative hotel plant
 */
function PottedPlant({ position }) {
  return (
    <group position={position}>
      {/* Ceramic Planter */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.28, 0.22, 0.7, 16]} />
        <meshStandardMaterial color="#f5f5f5" roughness={0.3} />
      </mesh>
      {/* Gold Rim */}
      <mesh position={[0, 0.71, 0]}>
        <torusGeometry args={[0.28, 0.02, 8, 24]} />
        <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Soil */}
      <mesh position={[0, 0.68, 0]}>
        <cylinderGeometry args={[0.26, 0.26, 0.05, 16]} />
        <meshStandardMaterial color="#3e2723" roughness={0.9} />
      </mesh>
      {/* Foliage */}
      <mesh position={[0, 1.05, 0]} castShadow>
        <sphereGeometry args={[0.38, 12, 12]} />
        <meshStandardMaterial color="#2e7d32" roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.35, 0]} castShadow>
        <sphereGeometry args={[0.28, 12, 12]} />
        <meshStandardMaterial color="#388e3c" roughness={0.7} />
      </mesh>
    </group>
  );
}

/**
 * Vintage leather suitcase
 */
function Suitcase({ position, rotation = [0, 0, 0], color = "#8d6e63", size = [0.5, 0.2, 0.35] }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      {/* Brass corners & locks */}
      <mesh position={[size[0] / 2 - 0.04, 0, size[2] / 2 + 0.01]}>
        <boxGeometry args={[0.06, 0.06, 0.02]} />
        <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[-size[0] / 2 + 0.04, 0, size[2] / 2 + 0.01]}>
        <boxGeometry args={[0.06, 0.06, 0.02]} />
        <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  );
}

/**
 * Luggage cart with luggage
 */
function BellhopLuggageCart({ position }) {
  return (
    <group position={position}>
      {/* Base Platform with carpet */}
      <mesh position={[0, 0.12, 0]} castShadow>
        <boxGeometry args={[0.7, 0.06, 1.0]} />
        <meshStandardMaterial color="#801824" roughness={0.8} />
      </mesh>
      {/* Brass rails */}
      <mesh position={[0, 0.65, 0.46]}>
        <cylinderGeometry args={[0.02, 0.02, 1.0, 8]} />
        <meshStandardMaterial color="#ffd700" metalness={0.85} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.65, -0.46]}>
        <cylinderGeometry args={[0.02, 0.02, 1.0, 8]} />
        <meshStandardMaterial color="#ffd700" metalness={0.85} roughness={0.2} />
      </mesh>
      <mesh position={[0, 1.15, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.94, 8]} />
        <meshStandardMaterial color="#ffd700" metalness={0.85} roughness={0.2} />
      </mesh>
      {/* Wheels */}
      <mesh position={[0.3, 0.06, 0.35]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.06, 0.06, 0.04, 12]} />
        <meshStandardMaterial color="#212121" roughness={0.5} />
      </mesh>
      <mesh position={[-0.3, 0.06, 0.35]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.06, 0.06, 0.04, 12]} />
        <meshStandardMaterial color="#212121" roughness={0.5} />
      </mesh>
      <mesh position={[0.3, 0.06, -0.35]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.06, 0.06, 0.04, 12]} />
        <meshStandardMaterial color="#212121" roughness={0.5} />
      </mesh>
      <mesh position={[-0.3, 0.06, -0.35]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.06, 0.06, 0.04, 12]} />
        <meshStandardMaterial color="#212121" roughness={0.5} />
      </mesh>

      {/* Stacked suitcases */}
      <Suitcase position={[0, 0.25, 0]} size={[0.55, 0.2, 0.35]} color="#5d4037" />
      <Suitcase position={[0.02, 0.42, 0.02]} rotation={[0, 0.1, 0]} size={[0.48, 0.18, 0.32]} color="#bf360c" />
      <Suitcase position={[-0.02, 0.58, -0.01]} rotation={[0, -0.08, 0]} size={[0.42, 0.16, 0.28]} color="#3e2723" />
    </group>
  );
}

/**
 * Main Hotel component
 * Positioned around House A: [9.5, 0, -0.5]
 */
export function Hotel({ isTalking = false, currentLocation = "outside" }) {
  const isInside = currentLocation === "Hotel";
  const isOutside = currentLocation === "outside";

  const materials = useMemo(() => {
    return {
      exteriorSignWood: new THREE.MeshStandardMaterial({ color: 0x2b1810, roughness: 0.6 }),
      exteriorGoldText: new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.8, roughness: 0.2 }),
      woodFloor: new THREE.MeshStandardMaterial({ color: 0x8b5a2b, roughness: 0.45 }),
      carpetRed: new THREE.MeshStandardMaterial({ color: 0x801824, roughness: 0.8 }),
      carpetGoldBorder: new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.5, roughness: 0.4 }),
      wallCream: new THREE.MeshStandardMaterial({ color: 0xf5eedb, roughness: 0.7 }),
      woodWainscot: new THREE.MeshStandardMaterial({ color: 0x3e2723, roughness: 0.5 }),
      ceilingMat: new THREE.MeshStandardMaterial({ color: 0xfafafa, roughness: 0.8 }),
      deskMahogany: new THREE.MeshStandardMaterial({ color: 0x2d170e, roughness: 0.35 }),
      deskMarbleTop: new THREE.MeshStandardMaterial({ color: 0xf0e6d6, roughness: 0.25 }),
      brassMetal: new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.85, roughness: 0.2 }),
      lampGreen: new THREE.MeshStandardMaterial({ color: 0x1b5e20, roughness: 0.3 }),
      sofaNavy: new THREE.MeshStandardMaterial({ color: 0x1a233a, roughness: 0.75 }),
      cushionGold: new THREE.MeshStandardMaterial({ color: 0xd4a373, roughness: 0.6 }),
      coffeeTableWood: new THREE.MeshStandardMaterial({ color: 0x3e2723, roughness: 0.4 }),
      laptopGrey: new THREE.MeshStandardMaterial({ color: 0x424242, metalness: 0.5, roughness: 0.3 }),
      laptopScreen: new THREE.MeshStandardMaterial({ color: 0x64b5f6, emissive: 0x1976d2, emissiveIntensity: 0.6 }),
      doorFrameWood: new THREE.MeshStandardMaterial({ color: 0x3e2723, roughness: 0.5 }),
      glassMat: new THREE.MeshStandardMaterial({ color: 0x88ccff, transparent: true, opacity: 0.35, roughness: 0.1 }),
      exitSignGreen: new THREE.MeshStandardMaterial({ color: 0x2e7d32, emissive: 0x1b5e20, emissiveIntensity: 0.8 })
    };
  }, []);

  if (!isInside && !isOutside) return null;

  return (
    <group>
      {/* 1. EXTERIOR HOTEL SIGNAGE (Visible outside in front of House A) */}
      {isOutside && (
        <group position={[9.5, 3.2, 2.38]}>
          {/* Signboard Backing */}
          <mesh material={materials.exteriorSignWood} castShadow>
            <boxGeometry args={[3.2, 0.7, 0.12]} />
          </mesh>
          {/* Brass Border Frame */}
          <mesh position={[0, 0, 0.06]}>
            <boxGeometry args={[3.3, 0.76, 0.04]} />
            <meshStandardMaterial color="#ffd700" metalness={0.8} roughness={0.3} wireframe={false} />
          </mesh>
          {/* Hotel Icon & Gold Lettering Banner */}
          <mesh position={[0, 0.02, 0.08]} material={materials.exteriorGoldText}>
            <boxGeometry args={[2.8, 0.38, 0.04]} />
          </mesh>
          {/* Warm Over-Sign Lantern */}
          <mesh position={[0, 0.55, 0.2]}>
            <cylinderGeometry args={[0.08, 0.14, 0.18, 12]} />
            <meshStandardMaterial color="#ffd54f" emissive="#ffb300" emissiveIntensity={0.6} />
          </mesh>
          <pointLight position={[0, 0.6, 0.3]} intensity={1.2} distance={5} color="#ffe082" />
        </group>
      )}

      {/* 2. HOTEL INTERIOR (Rendered when player is inside the Hotel) */}
      {isInside && (
        <group>
          {/* Warm interior ambient and accent lights */}
          <ambientLight intensity={0.7} color="#fff8e7" />
          <pointLight position={[9.5, 2.6, -1.2]} intensity={1.8} distance={8} color="#fff1c5" />
          <pointLight position={[7.2, 2.4, 0.5]} intensity={1.2} distance={6} color="#ffe8b0" />

          {/* Floor: Polished Wood */}
          <mesh position={[9.5, 0.01, 0]} material={materials.woodFloor} receiveShadow>
            <boxGeometry args={[8.0, 0.02, 6.0]} />
          </mesh>

          {/* Grand Velvet Carpet Runner */}
          <mesh position={[9.5, 0.025, 0.5]} material={materials.carpetRed} receiveShadow>
            <boxGeometry args={[2.2, 0.01, 4.4]} />
          </mesh>
          {/* Carpet Gold Trim Border */}
          <mesh position={[9.5, 0.026, 0.5]} material={materials.carpetGoldBorder}>
            <boxGeometry args={[2.28, 0.008, 4.48]} />
          </mesh>

          {/* Ceiling */}
          <mesh position={[9.5, 3.2, 0]} material={materials.ceilingMat}>
            <boxGeometry args={[8.0, 0.05, 6.0]} />
          </mesh>

          {/* Walls */}
          {/* Back Wall */}
          <mesh position={[9.5, 2.1, -2.95]} material={materials.wallCream}>
            <boxGeometry args={[8.0, 2.2, 0.1]} />
          </mesh>
          <mesh position={[9.5, 0.5, -2.94]} material={materials.woodWainscot}>
            <boxGeometry args={[8.0, 1.0, 0.12]} />
          </mesh>

          {/* Left Wall */}
          <mesh position={[5.55, 2.1, 0]} material={materials.wallCream}>
            <boxGeometry args={[0.1, 2.2, 6.0]} />
          </mesh>
          <mesh position={[5.56, 0.5, 0]} material={materials.woodWainscot}>
            <boxGeometry args={[0.12, 1.0, 6.0]} />
          </mesh>

          {/* Right Wall */}
          <mesh position={[13.45, 2.1, 0]} material={materials.wallCream}>
            <boxGeometry args={[0.1, 2.2, 6.0]} />
          </mesh>
          <mesh position={[13.44, 0.5, 0]} material={materials.woodWainscot}>
            <boxGeometry args={[0.12, 1.0, 6.0]} />
          </mesh>

          {/* Front Wall with Glass Exit Doors */}
          <mesh position={[7.5, 1.6, 2.95]} material={materials.wallCream}>
            <boxGeometry args={[4.0, 3.2, 0.1]} />
          </mesh>
          <mesh position={[11.5, 1.6, 2.95]} material={materials.wallCream}>
            <boxGeometry args={[4.0, 3.2, 0.1]} />
          </mesh>
          <mesh position={[9.5, 2.8, 2.95]} material={materials.wallCream}>
            <boxGeometry args={[2.0, 0.8, 0.1]} />
          </mesh>

          {/* Glass Doors Frame */}
          <mesh position={[9.5, 1.2, 2.95]} material={materials.doorFrameWood}>
            <boxGeometry args={[1.8, 2.4, 0.12]} />
          </mesh>
          <mesh position={[9.5, 1.2, 2.96]} material={materials.glassMat}>
            <boxGeometry args={[1.6, 2.2, 0.04]} />
          </mesh>
          {/* Illuminated Exit Sign */}
          <mesh position={[9.5, 2.45, 2.88]} material={materials.exitSignGreen}>
            <boxGeometry args={[0.6, 0.2, 0.05]} />
          </mesh>

          {/* 3. RECEPTION DESK */}
          <group position={[9.5, 0, -1.2]}>
            {/* Main Wooden Counter Body */}
            <mesh position={[0, 0.55, 0]} material={materials.deskMahogany} castShadow receiveShadow>
              <boxGeometry args={[2.6, 1.1, 0.7]} />
            </mesh>
            {/* Crema Marble Countertop */}
            <mesh position={[0, 1.12, 0]} material={materials.deskMarbleTop} castShadow receiveShadow>
              <boxGeometry args={[2.7, 0.06, 0.8]} />
            </mesh>
            {/* Brass Kickplate */}
            <mesh position={[0, 0.04, 0.35]} material={materials.brassMetal}>
              <boxGeometry args={[2.58, 0.08, 0.02]} />
            </mesh>

            {/* Laptop / Management Terminal */}
            <group position={[-0.3, 1.15, -0.05]} rotation={[0, 0.1, 0]}>
              <mesh material={materials.laptopGrey}>
                <boxGeometry args={[0.35, 0.02, 0.25]} />
              </mesh>
              <mesh position={[0, 0.12, -0.11]} rotation={[-0.35, 0, 0]} material={materials.laptopScreen}>
                <boxGeometry args={[0.35, 0.22, 0.02]} />
              </mesh>
            </group>

            {/* Brass Banker's Lamp */}
            <group position={[0.85, 1.15, -0.05]}>
              <mesh position={[0, 0.02, 0]} material={materials.brassMetal}>
                <cylinderGeometry args={[0.07, 0.08, 0.04, 16]} />
              </mesh>
              <mesh position={[0, 0.16, 0]} material={materials.brassMetal}>
                <cylinderGeometry args={[0.015, 0.015, 0.28, 8]} />
              </mesh>
              <mesh position={[0, 0.3, 0]} rotation={[0, 0, Math.PI / 2]} material={materials.lampGreen}>
                <cylinderGeometry args={[0.05, 0.05, 0.22, 12]} />
              </mesh>
              <pointLight position={[0, 0.28, 0.05]} intensity={0.9} distance={2.5} color="#fff2af" />
            </group>

            {/* Service Bell & Counter Sign */}
            <mesh position={[0.4, 1.16, 0.1]} material={materials.brassMetal}>
              <cylinderGeometry args={[0.05, 0.06, 0.04, 12]} />
            </mesh>
            <mesh position={[-0.8, 1.16, 0.1]} rotation={[0, 0.05, 0]} material={materials.brassMetal}>
              <boxGeometry args={[0.3, 0.05, 0.08]} />
            </mesh>
          </group>

          {/* 4. EMMA (HOTEL RECEPTIONIST) */}
          <ReceptionistEmma isTalking={isTalking} />

          {/* 5. HOTEL BACK WALL DÉCOR */}
          {/* Grand Hotel Plaque */}
          <group position={[9.5, 2.2, -2.85]}>
            <mesh material={materials.deskMahogany} castShadow>
              <boxGeometry args={[2.4, 0.6, 0.06]} />
            </mesh>
            <mesh position={[0, 0, 0.04]} material={materials.brassMetal}>
              <boxGeometry args={[2.2, 0.44, 0.02]} />
            </mesh>
          </group>

          {/* Wooden Room Key Cabinet */}
          <group position={[7.6, 1.8, -2.85]}>
            <mesh material={materials.woodWainscot} castShadow>
              <boxGeometry args={[0.8, 0.9, 0.1]} />
            </mesh>
            {/* Small Brass Room Key pegs */}
            {[0, 1, 2].map((row) =>
              [0, 1, 2].map((col) => (
                <mesh
                  key={`${row}-${col}`}
                  position={[-0.25 + col * 0.25, 0.25 - row * 0.25, 0.06]}
                  material={materials.brassMetal}
                >
                  <boxGeometry args={[0.03, 0.06, 0.02]} />
                </mesh>
              ))
            )}
          </group>

          {/* Analog Wall Clock */}
          <group position={[11.4, 2.2, -2.85]}>
            <mesh material={materials.brassMetal}>
              <cylinderGeometry args={[0.26, 0.26, 0.04, 24]} rotation={[Math.PI / 2, 0, 0]} />
            </mesh>
            <mesh position={[0, 0, 0.025]} material={materials.ceilingMat}>
              <cylinderGeometry args={[0.22, 0.22, 0.02, 24]} rotation={[Math.PI / 2, 0, 0]} />
            </mesh>
            {/* Hands */}
            <mesh position={[0, 0.05, 0.04]} material={materials.deskMahogany}>
              <boxGeometry args={[0.02, 0.12, 0.01]} />
            </mesh>
            <mesh position={[0.04, 0, 0.04]} material={materials.deskMahogany}>
              <boxGeometry args={[0.1, 0.02, 0.01]} />
            </mesh>
          </group>

          {/* 6. WAITING LOUNGE (LEFT SIDE) */}
          {/* Plush Double Sofa */}
          <group position={[6.6, 0, 0.5]} rotation={[0, Math.PI / 2, 0]}>
            {/* Base Cushion */}
            <mesh position={[0, 0.35, 0]} material={materials.sofaNavy} castShadow receiveShadow>
              <boxGeometry args={[1.5, 0.35, 0.8]} />
            </mesh>
            {/* Backrest */}
            <mesh position={[0, 0.75, -0.32]} material={materials.sofaNavy} castShadow>
              <boxGeometry args={[1.5, 0.55, 0.22]} />
            </mesh>
            {/* Armrests */}
            <mesh position={[-0.78, 0.55, 0]} material={materials.sofaNavy} castShadow>
              <boxGeometry args={[0.18, 0.45, 0.8]} />
            </mesh>
            <mesh position={[0.78, 0.55, 0]} material={materials.sofaNavy} castShadow>
              <boxGeometry args={[0.18, 0.45, 0.8]} />
            </mesh>
            {/* Throw Cushions */}
            <mesh position={[-0.45, 0.5, -0.18]} rotation={[0.2, 0.1, 0]} material={materials.cushionGold}>
              <boxGeometry args={[0.3, 0.3, 0.1]} />
            </mesh>
            <mesh position={[0.45, 0.5, -0.18]} rotation={[0.2, -0.1, 0]} material={materials.cushionGold}>
              <boxGeometry args={[0.3, 0.3, 0.1]} />
            </mesh>
          </group>

          {/* Coffee Table with Village Guides */}
          <group position={[7.6, 0, 0.5]}>
            <mesh position={[0, 0.22, 0]} material={materials.coffeeTableWood} castShadow receiveShadow>
              <boxGeometry args={[0.6, 0.35, 0.9]} />
            </mesh>
            <mesh position={[0, 0.4, 0]} material={materials.deskMarbleTop}>
              <boxGeometry args={[0.64, 0.03, 0.94]} />
            </mesh>
            {/* Magazine / Guidebook */}
            <mesh position={[0, 0.43, 0.1]} rotation={[0, 0.15, 0]}>
              <boxGeometry args={[0.22, 0.02, 0.3]} />
              <meshStandardMaterial color="#ffffff" roughness={0.4} />
            </mesh>
          </group>

          {/* 7. BELLHOP LUGGAGE TROLLEY WITH SUITCASES */}
          <BellhopLuggageCart position={[12.2, 0, 0.8]} />

          {/* 8. POTTED PLANTS */}
          <PottedPlant position={[11.6, 0, -1.8]} />
          <PottedPlant position={[6.4, 0, -2.0]} />

          {/* 9. FRAMED WALL ART */}
          <group position={[5.62, 1.8, 1.6]} rotation={[0, Math.PI / 2, 0]}>
            <mesh material={materials.deskMahogany}>
              <boxGeometry args={[0.9, 0.65, 0.04]} />
            </mesh>
            <mesh position={[0, 0, 0.025]}>
              <boxGeometry args={[0.8, 0.55, 0.01]} />
              <meshStandardMaterial color="#81c784" roughness={0.5} />
            </mesh>
          </group>

          <group position={[13.38, 1.8, -1.0]} rotation={[0, -Math.PI / 2, 0]}>
            <mesh material={materials.deskMahogany}>
              <boxGeometry args={[0.9, 0.65, 0.04]} />
            </mesh>
            <mesh position={[0, 0, 0.025]}>
              <boxGeometry args={[0.8, 0.55, 0.01]} />
              <meshStandardMaterial color="#4fc3f7" roughness={0.5} />
            </mesh>
          </group>
        </group>
      )}
    </group>
  );
}
