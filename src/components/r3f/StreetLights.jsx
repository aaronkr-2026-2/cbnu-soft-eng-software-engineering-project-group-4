import React, { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";

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
 * StreetLights: Village street lamps rendered using high-performance InstancedMesh.
 * Replaces 80 individual draw calls with exactly 2 batched GPU draw calls (pole body + emissive lens).
 */
export function StreetLights({ enableShadows = true }) {
  const poleRef = useRef();
  const glowRef = useRef();

  // Create unified single-lamp structural geometry
  const { poleGeom, glowGeom, poleMat, glowMat } = useMemo(() => {
    // 1. Footing collar
    const collar = new THREE.CylinderGeometry(0.16, 0.2, 0.16, 6);
    collar.translate(0, 0.08, 0);

    // 2. Main vertical pole
    const pole = new THREE.CylinderGeometry(0.07, 0.09, 3.44, 6);
    pole.translate(0, 1.8, 0);

    // 3. Cantilever arm
    const arm = new THREE.BoxGeometry(0.09, 0.09, 0.65);
    arm.translate(0, 3.48, 0.3);

    // 4. Head casing
    const casing = new THREE.BoxGeometry(0.26, 0.12, 0.32);
    casing.translate(0, 3.4, 0.58);

    const mergedPole = BufferGeometryUtils.mergeGeometries([collar, pole, arm, casing], false);
    mergedPole.computeVertexNormals();

    // 5. Emissive lens panel
    const lens = new THREE.BoxGeometry(0.2, 0.04, 0.26);
    lens.translate(0, 3.32, 0.58);
    lens.computeVertexNormals();

    const pMat = new THREE.MeshStandardMaterial({
      color: "#2d3748",
      roughness: 0.7
    });

    const gMat = new THREE.MeshStandardMaterial({
      color: "#fffbe8",
      emissive: "#ffe57f",
      emissiveIntensity: 2.5,
      roughness: 0.2
    });

    return {
      poleGeom: mergedPole,
      glowGeom: lens,
      poleMat: pMat,
      glowMat: gMat
    };
  }, []);

  // Set instance transform matrices
  useEffect(() => {
    if (!poleRef.current || !glowRef.current) return;

    const matrix = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const up = new THREE.Vector3(0, 1, 0);
    const scale = new THREE.Vector3(1, 1, 1);

    STREET_LAMPS.forEach((lamp, idx) => {
      q.setFromAxisAngle(up, lamp.rotationY);
      matrix.compose(new THREE.Vector3(...lamp.position), q, scale);
      poleRef.current.setMatrixAt(idx, matrix);
      glowRef.current.setMatrixAt(idx, matrix);
    });

    poleRef.current.instanceMatrix.needsUpdate = true;
    glowRef.current.instanceMatrix.needsUpdate = true;
  }, []);

  return (
    <group name="village-street-lights">
      {/* Structural Pole & Head Casing (1 GPU draw call for all 16 lamps) */}
      <instancedMesh
        ref={poleRef}
        args={[poleGeom, poleMat, STREET_LAMPS.length]}
        castShadow={enableShadows}
        receiveShadow
      />

      {/* Warm Emissive Lens Panels (1 GPU draw call for all 16 lamps) */}
      <instancedMesh
        ref={glowRef}
        args={[glowGeom, glowMat, STREET_LAMPS.length]}
        castShadow={false}
        receiveShadow={false}
      />

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
