import React, { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { VillageRoads } from "./VillageRoads";
import { StreetLights } from "./StreetLights";
import { ResidentialBoundaries } from "./ResidentialBoundaries";
import { WorldBackground } from "./WorldBackground";

/**
 * VILLAGE_TREES: Carefully curated village tree placements.
 * All trees that obstructed roads (North Connector Avenue), sidewalks,
 * intersections, building entrances, or the pedestrian alley have been removed.
 * Roadside trees are placed safely on green grass verges, completely clear of pedestrian walkways.
 */
const VILLAGE_TREES = [
  // 1. Roadside trees along North grass verge (behind North Sidewalk Z in [11.3, 13.0])
  // Placed safely on the grass verge at Z = 14.0 - 14.2, avoiding sidewalks, curbs & street openings
  { x: -18.0, z: 14.0, scale: 1.05, rotY: 0.7 },
  { x: -14.5, z: 14.0, scale: 0.95, rotY: 2.1 },
  { x: -3.2,  z: 14.2, scale: 1.10, rotY: 4.2 },
  { x: 18.0,  z: 14.2, scale: 1.08, rotY: 0.3 },

  // 2. Trees around House C / Library (East yard & rear)
  { x: 26.5,  z: 0.0,  scale: 1.10, rotY: 1.2 },
  { x: 26.5,  z: 3.0,  scale: 0.95, rotY: 3.8 },
  { x: 20.0,  z: -6.5, scale: 1.05, rotY: 5.1 },
  { x: 25.0,  z: -6.0, scale: 1.00, rotY: 2.5 },
  { x: 15.0,  z: -6.5, scale: 0.90, rotY: 0.9 },

  // 3. Trees around House D / Bank (West yard & rear)
  { x: -17.0, z: -6.5, scale: 1.00, rotY: 0.4 },
  { x: -23.0, z: -6.5, scale: 1.15, rotY: 3.6 },
  { x: -28.0, z: -6.0, scale: 0.95, rotY: 1.9 },
  { x: -3.0,  z: -16.0, scale: 1.10, rotY: 1.7 },
  { x: -11.0, z: -16.0, scale: 0.95, rotY: 5.6 },

  // 4. Trees around House B (North-West Hospital lawn & perimeter)
  // Obstructive trees inside the pedestrian alley (x: -0.8) have been removed
  { x: -16.5, z: 18.0, scale: 1.10, rotY: 4.8 },
  { x: -17.0, z: 22.0, scale: 0.90, rotY: 2.2 },
  { x: -14.5, z: 23.2, scale: 1.05, rotY: 0.5 },

  // 5. Trees around House E (North-East Police Station) & East Lawn
  // Obstructive trees inside North Connector Avenue road (x: 11.0, 13.5) have been removed
  { x: 17.5,  z: 23.2, scale: 1.05, rotY: 1.1 },
  { x: 17.0,  z: 18.5, scale: 0.95, rotY: 4.6 },
  { x: 17.0,  z: 27.5, scale: 1.10, rotY: 2.7 },

  // 6. Open green park area near North Entrance
  { x: 18.0,  z: 15.5, scale: 1.20, rotY: 3.9 },
  { x: 22.0,  z: 14.5, scale: 0.90, rotY: 0.8 },

  // 7. Trees around New North Residential Area (framing perimeter and community park)
  { x: -17.5, z: 35.5, scale: 1.05, rotY: 0.8 },
  { x: -17.5, z: 41.5, scale: 0.95, rotY: 2.3 },
  { x: -10.8, z: 45.2, scale: 1.10, rotY: 3.4 },
  { x: -5.5,  z: 42.5, scale: 1.00, rotY: 4.1 },
  { x: 0.0,   z: 42.5, scale: 1.15, rotY: 1.6 },
  { x: 5.5,   z: 42.5, scale: 1.00, rotY: 3.2 },
  { x: 10.8,  z: 45.2, scale: 1.10, rotY: 1.8 },
  { x: 17.5,  z: 41.5, scale: 1.05, rotY: 5.0 },
  { x: 17.5,  z: 35.5, scale: 0.95, rotY: 1.1 },
  // Community park lawn trees (placed on green lawn, clearing paved plaza & walkways)
  { x: -5.0,  z: 34.2, scale: 1.05, rotY: 2.7 },
  { x: 4.8,   z: 34.2, scale: 0.95, rotY: 1.2 }
];

/**
 * InstancedVillageTrees:
 * High-performance batched tree rendering using Three.js InstancedMesh.
 * - Extracts clean normalized single-tree geometry from tree.glb (eliminating interior duplicate tree6 mesh).
 * - Renders all village trees in exactly 2 GPU draw calls (one for bark, one for leaves).
 * - Full shadow casting and receiving for rich visual depth.
 */
function InstancedVillageTrees({ trees, treeGltf }) {
  const barkRef = useRef();
  const leavesRef = useRef();

  const { barkGeom, leavesGeom, barkMat, leavesMat } = useMemo(() => {
    if (!treeGltf?.scene) return {};

    const cloned = treeGltf.scene.clone(true);
    cloned.updateMatrixWorld(true);

    let barkMesh = null;
    let leavesMesh = null;
    cloned.traverse((c) => {
      if (c.name === "tree4_bark_0") barkMesh = c;
      if (c.name === "tree4_leaves_0") leavesMesh = c;
    });

    if (!barkMesh || !leavesMesh) return {};

    // Apply scene transforms into geometry
    const bGeom = barkMesh.geometry.clone().applyMatrix4(barkMesh.matrixWorld);
    const lGeom = leavesMesh.geometry.clone().applyMatrix4(leavesMesh.matrixWorld);

    bGeom.computeBoundingBox();
    lGeom.computeBoundingBox();
    const box = new THREE.Box3().union(bGeom.boundingBox).union(lGeom.boundingBox);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const scale = 3.8 / (size.y || 1);

    // Normalize: center on X/Z, base at Y=0, scaled to standard 3.8m height
    const normMatrix = new THREE.Matrix4()
      .makeScale(scale, scale, scale)
      .multiply(new THREE.Matrix4().makeTranslation(-center.x, -box.min.y, -center.z));

    bGeom.applyMatrix4(normMatrix);
    lGeom.applyMatrix4(normMatrix);
    bGeom.computeVertexNormals();
    lGeom.computeVertexNormals();

    const bMat = barkMesh.material.clone();
    const lMat = leavesMesh.material.clone();
    if (bMat.map) bMat.map.colorSpace = THREE.SRGBColorSpace;
    if (lMat.map) lMat.map.colorSpace = THREE.SRGBColorSpace;

    return {
      barkGeom: bGeom,
      leavesGeom: lGeom,
      barkMat: bMat,
      leavesMat: lMat
    };
  }, [treeGltf]);

  useEffect(() => {
    if (!barkRef.current || !leavesRef.current) return;
    const dummy = new THREE.Object3D();
    trees.forEach((pos, idx) => {
      dummy.position.set(pos.x, 0, pos.z);
      dummy.rotation.set(0, pos.rotY, 0);
      dummy.scale.set(pos.scale, pos.scale, pos.scale);
      dummy.updateMatrix();
      barkRef.current.setMatrixAt(idx, dummy.matrix);
      leavesRef.current.setMatrixAt(idx, dummy.matrix);
    });
    barkRef.current.instanceMatrix.needsUpdate = true;
    leavesRef.current.instanceMatrix.needsUpdate = true;
  }, [trees, barkGeom, leavesGeom]);

  if (!barkGeom || !leavesGeom) return null;

  return (
    <group name="village-trees-instanced">
      <instancedMesh
        ref={barkRef}
        args={[barkGeom, barkMat, trees.length]}
        castShadow
        receiveShadow
      />
      <instancedMesh
        ref={leavesRef}
        args={[leavesGeom, leavesMat, trees.length]}
        castShadow
        receiveShadow
      />
    </group>
  );
}

export function Environment() {
  // Tree model
  const treeGltf = useGLTF("/models/tree.glb");

  // Skyscraper 2 (Tall building behind Cafe)
  const tower2Gltf = useGLTF("/models/skyscraper2.glb");
  const processedTower2 = useMemo(() => {
    const scene = tower2Gltf.scene.clone(true);
    scene.traverse((child) => {
      if (child.isMesh) {
        // ~1.1M triangles: casting shadows doubled its cost every frame
        child.castShadow = false;
        child.receiveShadow = true;
        if (child.material && child.material.map) {
          child.material.map.colorSpace = THREE.SRGBColorSpace;
        }
      }
    });
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const scaleFactor = 16.0 / (size.y || 1);
    scene.scale.set(scaleFactor, scaleFactor, scaleFactor);
    const scaledBox = new THREE.Box3().setFromObject(scene);
    scene.position.set(-15, -scaledBox.min.y, -10);
    return scene;
  }, [tower2Gltf]);

  return (
    <group name="village-environment">
      {/* Maysazor zamin (kengaytirilgan shimoliy turar-joy hududi bilan) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 12]}>
        <planeGeometry args={[65, 80]} />
        <meshStandardMaterial color="#55aa55" roughness={0.9} />
      </mesh>

      {/* Qishloq yo'llari, yo'laklar va bordurlar */}
      <VillageRoads />

      {/* Ko'cha chiroqlari */}
      <StreetLights />

      {/* Koreys uslubidagi turar-joy past devorlari va darvoza ustunlari */}
      <ResidentialBoundaries />

      {/* Baland bino (Kafe orqasida) */}
      <primitive object={processedTower2} />

      {/* Qishloq daraxtlari (Optimallashtirilgan InstancedMesh) */}
      <InstancedVillageTrees trees={VILLAGE_TREES} treeGltf={treeGltf} />

      {/* Tabiiy atrof-muhit foni: Tog'lar (Shimol), O'rmon (Sharq), Okean (Janub), Megapolis (G'arb) */}
      <WorldBackground />
    </group>
  );
}

// Preload models for fast instant load
useGLTF.preload("/models/tree.glb");
useGLTF.preload("/models/skyscraper2.glb");
