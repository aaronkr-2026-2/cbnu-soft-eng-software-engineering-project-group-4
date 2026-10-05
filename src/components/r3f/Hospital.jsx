import React, { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

/**
 * Stylized low-poly Sarah (Hospital Receptionist)
 */
function ReceptionistSarah({ isTalking = false }) {
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
      rightArmRef.current.rotation.x = 0.4 - Math.sin(t * 6) * 0.15;
    }
    if (leftArmRef.current && isTalking) {
      leftArmRef.current.rotation.x = 0.4 + Math.sin(t * 6) * 0.12;
    }
  });

  return (
    <group position={[-8.0, 0, 15.6]} rotation={[0, 0, 0]}>
      {/* Lower Body: Medical Scrub Pants */}
      <mesh position={[0, 0.45, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.26, 0.9, 16]} />
        <meshStandardMaterial color="#00838f" roughness={0.7} />
      </mesh>

      {/* Torso: Medical Scrub Top */}
      <mesh position={[0, 1.05, 0]} castShadow>
        <boxGeometry args={[0.42, 0.52, 0.26]} />
        <meshStandardMaterial color="#00acc1" roughness={0.6} />
      </mesh>

      {/* V-Neck Collar */}
      <mesh position={[0, 1.25, 0.12]}>
        <boxGeometry args={[0.16, 0.1, 0.03]} />
        <meshStandardMaterial color="#ffffff" roughness={0.4} />
      </mesh>

      {/* ID Badge: SARAH */}
      <mesh position={[0.12, 1.16, 0.135]}>
        <boxGeometry args={[0.08, 0.05, 0.02]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} />
      </mesh>
      <mesh position={[0.12, 1.16, 0.146]}>
        <boxGeometry args={[0.06, 0.03, 0.01]} />
        <meshStandardMaterial color="#00838f" roughness={0.3} />
      </mesh>

      {/* Stethoscope around neck */}
      <mesh position={[0, 1.12, 0.13]}>
        <torusGeometry args={[0.11, 0.012, 8, 20, Math.PI]} rotation={[0, 0, Math.PI]} />
        <meshStandardMaterial color="#37474f" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Head & Neck */}
      <mesh position={[0, 1.34, 0]}>
        <cylinderGeometry args={[0.07, 0.08, 0.1, 12]} />
        <meshStandardMaterial color="#fce4d6" roughness={0.6} />
      </mesh>

      <group ref={headRef} position={[0, 1.38, 0]}>
        {/* Face */}
        <mesh position={[0, 0.12, 0]} castShadow>
          <sphereGeometry args={[0.13, 16, 16]} />
          <meshStandardMaterial color="#fce4d6" roughness={0.6} />
        </mesh>
        {/* Blonde/Auburn Hair */}
        <mesh position={[0, 0.17, -0.02]}>
          <sphereGeometry args={[0.145, 16, 16]} />
          <meshStandardMaterial color="#d4a373" roughness={0.8} />
        </mesh>
        {/* Hair Ponytail */}
        <mesh position={[0, 0.18, -0.12]} rotation={[0.4, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.07, 0.18, 12]} />
          <meshStandardMaterial color="#bc8a5f" roughness={0.8} />
        </mesh>
      </group>

      {/* Left Arm */}
      <group ref={leftArmRef} position={[-0.26, 1.25, 0]}>
        <mesh position={[0, -0.22, -0.08]} rotation={[0.4, 0, 0]} castShadow>
          <boxGeometry args={[0.1, 0.44, 0.1]} />
          <meshStandardMaterial color="#00acc1" roughness={0.6} />
        </mesh>
        <mesh position={[0, -0.42, -0.18]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color="#fce4d6" roughness={0.6} />
        </mesh>
      </group>

      {/* Right Arm */}
      <group ref={rightArmRef} position={[0.26, 1.25, 0]}>
        <mesh position={[0, -0.22, -0.08]} rotation={[0.4, 0, 0]} castShadow>
          <boxGeometry args={[0.1, 0.44, 0.1]} />
          <meshStandardMaterial color="#00acc1" roughness={0.6} />
        </mesh>
        <mesh position={[0, -0.42, -0.18]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color="#fce4d6" roughness={0.6} />
        </mesh>
      </group>
    </group>
  );
}

/**
 * Hospital Examination Bed with pillow & blanket
 */
function ExaminationBed({ position }) {
  return (
    <group position={position}>
      {/* Chrome Bed Frame */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <boxGeometry args={[1.0, 0.1, 2.0]} />
        <meshStandardMaterial color="#cfd8dc" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* 4 Metal Legs */}
      {[[-0.45, -0.9], [0.45, -0.9], [-0.45, 0.9], [0.45, 0.9]].map(([lx, lz], i) => (
        <mesh key={i} position={[lx, 0.175, lz]}>
          <cylinderGeometry args={[0.025, 0.025, 0.35, 8]} />
          <meshStandardMaterial color="#90a4ae" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}
      {/* Sanitary Mattress (Pale Mint Green) */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.96, 0.12, 1.96]} />
        <meshStandardMaterial color="#e0f2f1" roughness={0.6} />
      </mesh>
      {/* Pillow */}
      <mesh position={[0, 0.53, -0.75]}>
        <boxGeometry args={[0.7, 0.08, 0.35]} />
        <meshStandardMaterial color="#ffffff" roughness={0.5} />
      </mesh>
      {/* Folded Sheet / Blanket */}
      <mesh position={[0, 0.52, 0.25]}>
        <boxGeometry args={[0.94, 0.04, 1.3]} />
        <meshStandardMaterial color="#b2dfdb" roughness={0.5} />
      </mesh>
    </group>
  );
}

/**
 * Mobile IV Drip Stand
 */
function IvDripStand({ position }) {
  return (
    <group position={position}>
      {/* Base with castors */}
      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.04, 12]} />
        <meshStandardMaterial color="#78909c" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Main Chrome Pole */}
      <mesh position={[0, 0.95, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 1.8, 8]} />
        <meshStandardMaterial color="#eceff1" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Top Hook Crossbar */}
      <mesh position={[0, 1.85, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.01, 0.01, 0.3, 8]} />
        <meshStandardMaterial color="#eceff1" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Saline Bag */}
      <mesh position={[0.1, 1.7, 0]}>
        <boxGeometry args={[0.08, 0.16, 0.04]} />
        <meshStandardMaterial color="#e1f5fe" transparent opacity={0.7} roughness={0.2} />
      </mesh>
    </group>
  );
}

/**
 * Main Hospital Component
 * Placed around House B: [-8.0, 0, 18.0]
 */
export function Hospital({ isTalking = false, currentLocation = "outside" }) {
  const isInside = currentLocation === "Hospital";
  const isOutside = currentLocation === "outside";

  const materials = useMemo(() => {
    return {
      exteriorSignWhite: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 }),
      exteriorTealTrim: new THREE.MeshStandardMaterial({ color: 0x00897b, roughness: 0.4 }),
      medicalRedCross: new THREE.MeshStandardMaterial({ color: 0xd32f2f, roughness: 0.3 }),
      medicalGreenCross: new THREE.MeshStandardMaterial({ color: 0x2e7d32, roughness: 0.3 }),
      vinylFloor: new THREE.MeshStandardMaterial({ color: 0xe0f2f1, roughness: 0.4 }),
      floorBorder: new THREE.MeshStandardMaterial({ color: 0x80cbc4, roughness: 0.5 }),
      wallWhite: new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.7 }),
      wallTealWainscot: new THREE.MeshStandardMaterial({ color: 0x00897b, roughness: 0.5 }),
      deskWhite: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.25 }),
      deskTealAccent: new THREE.MeshStandardMaterial({ color: 0x00acc1, roughness: 0.4 }),
      glassMat: new THREE.MeshStandardMaterial({ color: 0x80deea, transparent: true, opacity: 0.35, roughness: 0.1 }),
      screenGlow: new THREE.MeshStandardMaterial({ color: 0x4fc3f7, emissive: 0x0288d1, emissiveIntensity: 0.7 }),
      chairBlue: new THREE.MeshStandardMaterial({ color: 0x1976d2, roughness: 0.6 }),
      metalFrame: new THREE.MeshStandardMaterial({ color: 0xb0bec5, metalness: 0.8, roughness: 0.2 }),
      exitSign: new THREE.MeshStandardMaterial({ color: 0x2e7d32, emissive: 0x1b5e20, emissiveIntensity: 0.8 })
    };
  }, []);

  const signTexture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 1024, 256);
    ctx.strokeStyle = "#00897b";
    ctx.lineWidth = 14;
    ctx.strokeRect(8, 8, 1008, 240);
    ctx.fillStyle = "#00897b";
    ctx.fillRect(20, 20, 984, 8);
    ctx.fillStyle = "#00695c";
    ctx.font = "bold 76px system-ui, -apple-system, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("HOSPITAL", 512, 98);
    ctx.fillStyle = "#00897b";
    ctx.font = "bold 44px system-ui, -apple-system, sans-serif";
    ctx.fillText("마을병원", 512, 182);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    return texture;
  }, []);

  if (!isInside && !isOutside) return null;

  return (
    <group>
      {/* 1. EXTERIOR HOSPITAL SIGNAGE (House B South Entrance at Z: ~13.8) */}
      {isOutside && (
        <group position={[-8.0, 3.8, 13.9]} rotation={[0, Math.PI, 0]}>
          {/* Main Clean White Signboard */}
          <mesh material={materials.exteriorSignWhite} castShadow>
            <boxGeometry args={[4.2, 0.85, 0.12]} />
          </mesh>
          {/* Teal Header & Footer Trim */}
          <mesh position={[0, 0.44, 0.01]} material={materials.exteriorTealTrim}>
            <boxGeometry args={[4.24, 0.08, 0.14]} />
          </mesh>
          <mesh position={[0, -0.44, 0.01]} material={materials.exteriorTealTrim}>
            <boxGeometry args={[4.24, 0.08, 0.14]} />
          </mesh>
          {/* Medical Red Cross Icon Left */}
          <group position={[-1.65, 0, 0.07]}>
            <mesh material={materials.medicalRedCross}>
              <boxGeometry args={[0.12, 0.4, 0.03]} />
            </mesh>
            <mesh material={materials.medicalRedCross}>
              <boxGeometry args={[0.4, 0.12, 0.03]} />
            </mesh>
          </group>
          {/* Medical Red Cross Icon Right */}
          <group position={[1.65, 0, 0.07]}>
            <mesh material={materials.medicalRedCross}>
              <boxGeometry args={[0.12, 0.4, 0.03]} />
            </mesh>
            <mesh material={materials.medicalRedCross}>
              <boxGeometry args={[0.4, 0.12, 0.03]} />
            </mesh>
          </group>
          {/* Title Plaque with 🏥 VILLAGE HOSPITAL */}
          {signTexture && (
            <mesh position={[0, 0, 0.07]}>
              <planeGeometry args={[2.7, 0.68]} />
              <meshStandardMaterial map={signTexture} roughness={0.3} />
            </mesh>
          )}
          {/* Exterior Lantern Light */}
          <mesh position={[0, 0.65, 0.2]}>
            <cylinderGeometry args={[0.08, 0.14, 0.18, 12]} />
            <meshStandardMaterial color="#e0f7fa" emissive="#80deea" emissiveIntensity={0.6} />
          </mesh>
          <pointLight position={[0, 0.7, 0.35]} intensity={1.4} distance={6} color="#e0f7fa" />
        </group>
      )}

      {/* 2. HOSPITAL INTERIOR (Rendered when inside) */}
      {isInside && (
        <group>
          {/* Hospital Clean Overhead Lighting */}
          <ambientLight intensity={0.9} color="#f0fdf4" />
          <directionalLight position={[-8.0, 5.0, 18.0]} intensity={0.6} color="#ffffff" />
          <pointLight position={[-8.0, 2.8, 16.5]} intensity={1.8} distance={8} color="#ffffff" />
          <pointLight position={[-10.2, 2.8, 17.5]} intensity={1.2} distance={6} color="#e0f2f1" />

          {/* Floor: Sanitary Vinyl Tiles */}
          <mesh position={[-8.0, 0.01, 18.0]} material={materials.vinylFloor} receiveShadow>
            <boxGeometry args={[7.0, 0.02, 5.6]} />
          </mesh>
          {/* Clean Floor Accent Border */}
          <mesh position={[-8.0, 0.015, 18.0]} material={materials.floorBorder}>
            <boxGeometry args={[6.8, 0.01, 5.4]} />
          </mesh>
          <mesh position={[-8.0, 0.02, 18.0]} material={materials.vinylFloor}>
            <boxGeometry args={[6.6, 0.01, 5.2]} />
          </mesh>

          {/* Ceiling */}
          <mesh position={[-8.0, 3.2, 18.0]}>
            <boxGeometry args={[7.0, 0.05, 5.6]} />
            <meshStandardMaterial color="#f5f5f5" roughness={0.8} />
          </mesh>

          {/* Walls */}
          {/* North Wall (Behind Reception & Sarah) */}
          <mesh position={[-8.0, 2.1, 15.2]} material={materials.wallWhite}>
            <boxGeometry args={[7.0, 2.2, 0.1]} />
          </mesh>
          <mesh position={[-8.0, 0.5, 15.21]} material={materials.wallTealWainscot}>
            <boxGeometry args={[7.0, 1.0, 0.12]} />
          </mesh>

          {/* West Wall (Left side with Medical Bed) */}
          <mesh position={[-11.45, 2.1, 18.0]} material={materials.wallWhite}>
            <boxGeometry args={[0.1, 2.2, 5.6]} />
          </mesh>
          <mesh position={[-11.44, 0.5, 18.0]} material={materials.wallTealWainscot}>
            <boxGeometry args={[0.12, 1.0, 5.6]} />
          </mesh>

          {/* East Wall (Right side with Waiting Chairs) */}
          <mesh position={[-4.55, 2.1, 18.0]} material={materials.wallWhite}>
            <boxGeometry args={[0.1, 2.2, 5.6]} />
          </mesh>
          <mesh position={[-4.56, 0.5, 18.0]} material={materials.wallTealWainscot}>
            <boxGeometry args={[0.12, 1.0, 5.6]} />
          </mesh>

          {/* South Wall with Entrance Glass Doors */}
          <mesh position={[-10.0, 1.6, 20.75]} material={materials.wallWhite}>
            <boxGeometry args={[3.0, 3.2, 0.1]} />
          </mesh>
          <mesh position={[-6.0, 1.6, 20.75]} material={materials.wallWhite}>
            <boxGeometry args={[3.0, 3.2, 0.1]} />
          </mesh>
          <mesh position={[-8.0, 2.8, 20.75]} material={materials.wallWhite}>
            <boxGeometry args={[1.5, 0.8, 0.1]} />
          </mesh>
          {/* Double Glass Doors */}
          <mesh position={[-8.0, 1.2, 20.75]} material={materials.metalFrame}>
            <boxGeometry args={[1.6, 2.4, 0.08]} />
          </mesh>
          <mesh position={[-8.0, 1.2, 20.76]} material={materials.glassMat}>
            <boxGeometry args={[1.44, 2.2, 0.03]} />
          </mesh>
          {/* Illuminated Exit Sign */}
          <mesh position={[-8.0, 2.45, 20.68]} material={materials.exitSign}>
            <boxGeometry args={[0.55, 0.18, 0.04]} />
          </mesh>

          {/* 3. RECEPTION DESK */}
          <group position={[-8.0, 0, 16.2]}>
            {/* White Counter Body */}
            <mesh position={[0, 0.55, 0]} material={materials.deskWhite} castShadow receiveShadow>
              <boxGeometry args={[2.5, 1.1, 0.65]} />
            </mesh>
            {/* Teal Front Trim Panel */}
            <mesh position={[0, 0.55, 0.33]} material={materials.deskTealAccent}>
              <boxGeometry args={[2.3, 0.8, 0.02]} />
            </mesh>
            {/* Medical Cross on Desk */}
            <group position={[0, 0.55, 0.35]}>
              <mesh material={materials.medicalRedCross}>
                <boxGeometry args={[0.06, 0.22, 0.02]} />
              </mesh>
              <mesh material={materials.medicalRedCross}>
                <boxGeometry args={[0.22, 0.06, 0.02]} />
              </mesh>
            </group>
            {/* White Quartz Countertop */}
            <mesh position={[0, 1.12, 0]} material={materials.deskWhite} castShadow receiveShadow>
              <boxGeometry args={[2.6, 0.06, 0.75]} />
            </mesh>

            {/* Reception Computer / Monitor */}
            <group position={[0.4, 1.15, 0]} rotation={[0, -0.15, 0]}>
              <mesh material={materials.metalFrame}>
                <boxGeometry args={[0.42, 0.26, 0.02]} />
              </mesh>
              <mesh position={[0, 0, -0.015]} material={materials.screenGlow}>
                <boxGeometry args={[0.4, 0.24, 0.01]} />
              </mesh>
              <mesh position={[0, -0.16, 0]}>
                <cylinderGeometry args={[0.02, 0.02, 0.1, 8]} />
                <meshStandardMaterial color="#455a64" />
              </mesh>
            </group>

            {/* Acrylic Clipboard & Desk Hand Sanitizer */}
            <mesh position={[-0.6, 1.16, 0.05]} rotation={[0, 0.1, 0]}>
              <boxGeometry args={[0.22, 0.02, 0.3]} />
              <meshStandardMaterial color="#eceff1" roughness={0.4} />
            </mesh>
            <mesh position={[-0.95, 1.22, 0.05]}>
              <cylinderGeometry args={[0.035, 0.04, 0.14, 12]} />
              <meshStandardMaterial color="#b2ebf2" transparent opacity={0.8} />
            </mesh>
          </group>

          {/* 4. RECEPTIONIST SARAH */}
          <ReceptionistSarah isTalking={isTalking} />

          {/* 5. WALL MEDICAL DECORATION (Behind Reception) */}
          <group position={[-8.0, 2.25, 15.28]}>
            <mesh material={materials.medicalRedCross}>
              <boxGeometry args={[0.22, 0.8, 0.04]} />
            </mesh>
            <mesh material={materials.medicalRedCross}>
              <boxGeometry args={[0.8, 0.22, 0.04]} />
            </mesh>
          </group>

          {/* 6. EXAMINATION AREA (LEFT SIDE) */}
          <ExaminationBed position={[-10.1, 0, 17.5]} />
          <IvDripStand position={[-10.9, 0, 16.5]} />

          {/* Medical Vitals Monitor on Rolling Cart */}
          <group position={[-10.9, 0, 18.5]}>
            <mesh position={[0, 0.45, 0]} material={materials.metalFrame}>
              <boxGeometry args={[0.35, 0.9, 0.35]} />
            </mesh>
            {/* Monitor Screen */}
            <mesh position={[0, 1.05, 0]}>
              <boxGeometry args={[0.3, 0.25, 0.04]} />
              <meshStandardMaterial color="#263238" />
            </mesh>
            <mesh position={[0, 1.05, 0.025]} material={materials.screenGlow}>
              <boxGeometry args={[0.28, 0.22, 0.01]} />
            </mesh>
          </group>

          {/* Medical Wall Cabinet with First Aid supplies */}
          <group position={[-11.38, 1.8, 16.5]} rotation={[0, Math.PI / 2, 0]}>
            <mesh material={materials.deskWhite} castShadow>
              <boxGeometry args={[0.9, 0.7, 0.2]} />
            </mesh>
            <mesh position={[0, 0, 0.11]} material={materials.glassMat}>
              <boxGeometry args={[0.84, 0.64, 0.02]} />
            </mesh>
            {/* Small red cross on cabinet */}
            <mesh position={[0, 0, 0.13]} material={materials.medicalRedCross}>
              <boxGeometry args={[0.04, 0.14, 0.01]} />
            </mesh>
            <mesh position={[0, 0, 0.13]} material={materials.medicalRedCross}>
              <boxGeometry args={[0.14, 0.04, 0.01]} />
            </mesh>
          </group>

          {/* Privacy Screen Divider */}
          <group position={[-8.9, 0, 17.8]}>
            <mesh position={[0, 0.9, 0]} material={materials.metalFrame}>
              <boxGeometry args={[0.04, 1.8, 1.6]} />
            </mesh>
            <mesh position={[0, 0.9, 0]}>
              <boxGeometry args={[0.02, 1.6, 1.5]} />
              <meshStandardMaterial color="#e0f2f1" roughness={0.7} />
            </mesh>
          </group>

          {/* 7. WAITING AREA (RIGHT SIDE) */}
          {/* Row of 3 Blue Hospital Waiting Chairs */}
          <group position={[-4.9, 0, 18.2]} rotation={[0, -Math.PI / 2, 0]}>
            {[-0.6, 0, 0.6].map((cx, i) => (
              <group key={i} position={[cx, 0, 0]}>
                {/* Seat Cushion */}
                <mesh position={[0, 0.35, 0]} material={materials.chairBlue} castShadow>
                  <boxGeometry args={[0.48, 0.08, 0.48]} />
                </mesh>
                {/* Backrest */}
                <mesh position={[0, 0.65, -0.22]} material={materials.chairBlue} castShadow>
                  <boxGeometry args={[0.48, 0.5, 0.06]} />
                </mesh>
                {/* Metal Legs */}
                <mesh position={[0, 0.16, 0]} material={materials.metalFrame}>
                  <cylinderGeometry args={[0.02, 0.02, 0.32, 8]} />
                </mesh>
              </group>
            ))}
            {/* Connecting Frame Beam */}
            <mesh position={[0, 0.3, 0]} material={materials.metalFrame}>
              <boxGeometry args={[1.7, 0.04, 0.04]} />
            </mesh>
          </group>

          {/* Water Dispenser Cooler */}
          <group position={[-4.9, 0, 16.4]}>
            <mesh position={[0, 0.45, 0]} material={materials.deskWhite} castShadow>
              <boxGeometry args={[0.35, 0.9, 0.35]} />
            </mesh>
            {/* Water Bottle inverted on top */}
            <mesh position={[0, 1.05, 0]}>
              <cylinderGeometry args={[0.13, 0.13, 0.32, 16]} />
              <meshStandardMaterial color="#80deea" transparent opacity={0.75} roughness={0.1} />
            </mesh>
          </group>

          {/* Decorative Plant beside water cooler */}
          <group position={[-5.8, 0, 15.8]}>
            <mesh position={[0, 0.25, 0]}>
              <cylinderGeometry args={[0.2, 0.15, 0.5, 12]} />
              <meshStandardMaterial color="#ffffff" roughness={0.3} />
            </mesh>
            <mesh position={[0, 0.7, 0]}>
              <sphereGeometry args={[0.3, 10, 10]} />
              <meshStandardMaterial color="#2e7d32" roughness={0.7} />
            </mesh>
          </group>
        </group>
      )}
    </group>
  );
}
