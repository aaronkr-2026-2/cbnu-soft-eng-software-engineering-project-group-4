import React, { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { VillageRoads } from "./VillageRoads";
import { StreetLights } from "./StreetLights";
import { ResidentialBoundaries } from "./ResidentialBoundaries";
import { WorldBackground } from "./WorldBackground";

/**
 * VILLAGE_TREES: Curated village tree placements.
 * Roadside trees are placed safely on green grass verges, completely clear of pedestrian walkways.
 */
const VILLAGE_TREES = [
  // 1. Roadside trees along North grass verge (behind North Sidewalk Z in [11.3, 13.0])
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
  { x: -16.5, z: 18.0, scale: 1.10, rotY: 4.8 },
  { x: -17.0, z: 22.0, scale: 0.90, rotY: 2.2 },
  { x: -14.5, z: 23.2, scale: 1.05, rotY: 0.5 },

  // 5. Trees around House E (North-East Police Station) & East Lawn
  { x: 17.5,  z: 23.2, scale: 1.05, rotY: 1.1 },
  { x: 17.0,  z: 18.5, scale: 0.95, rotY: 4.6 },
  { x: 17.0,  z: 27.5, scale: 1.10, rotY: 2.7 },

  // 6. Open green park area near North Entrance
  { x: 18.0,  z: 15.5, scale: 1.20, rotY: 3.9 },
  { x: 22.0,  z: 14.5, scale: 0.90, rotY: 0.8 },

  // 7. Trees around New North Residential Area (framing perimeter and community park)
  { x: -28.0, z: 35.5, scale: 1.05, rotY: 0.8 },
  { x: -28.0, z: 42.5, scale: 0.95, rotY: 2.3 },
  { x: -16.0, z: 53.5, scale: 1.10, rotY: 3.4 },
  { x: -4.0,  z: 44.0, scale: 1.00, rotY: 4.1 },
  { x: 0.0,   z: 43.5, scale: 1.15, rotY: 1.6 },
  { x: 4.0,   z: 44.0, scale: 1.00, rotY: 3.2 },
  { x: 16.0,  z: 53.5, scale: 1.10, rotY: 1.8 },
  { x: 28.0,  z: 42.5, scale: 1.05, rotY: 5.0 },
  { x: 28.0,  z: 35.5, scale: 0.95, rotY: 1.1 },
  { x: -3.5,  z: 39.5, scale: 1.05, rotY: 2.7 },
  { x: 3.5,   z: 39.5, scale: 0.95, rotY: 1.2 }
];

/**
 * InstancedVillageTrees:
 * High-performance batched tree rendering using Three.js InstancedMesh.
 */
function InstancedVillageTrees({ trees, treeGltf, enableShadows = true }) {
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

    const bGeom = barkMesh.geometry.clone().applyMatrix4(barkMesh.matrixWorld);
    const lGeom = leavesMesh.geometry.clone().applyMatrix4(leavesMesh.matrixWorld);

    bGeom.computeBoundingBox();
    lGeom.computeBoundingBox();

    const box = new THREE.Box3().union(bGeom.boundingBox).union(lGeom.boundingBox);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const targetScale = 6.8 / maxDim;

    bGeom.scale(targetScale, targetScale, targetScale);
    lGeom.scale(targetScale, targetScale, targetScale);

    const bMat = barkMesh.material.clone();
    const lMat = leavesMesh.material.clone();

    if (bMat.map) bMat.map.colorSpace = THREE.SRGBColorSpace;
    if (lMat.map) lMat.map.colorSpace = THREE.SRGBColorSpace;

    bMat.roughness = 0.85;
    lMat.roughness = 0.65;

    return { barkGeom: bGeom, leavesGeom: lGeom, barkMat: bMat, leavesMat: lMat };
  }, [treeGltf]);

  useEffect(() => {
    if (!barkRef.current || !leavesRef.current || !trees.length) return;

    const matrix = new THREE.Matrix4();
    const position = new THREE.Vector3();
    const rotation = new THREE.Euler();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();

    trees.forEach((t, index) => {
      position.set(t.x, 0, t.z);
      rotation.set(0, t.rotY, 0);
      quaternion.setFromEuler(rotation);
      scale.set(t.scale, t.scale, t.scale);
      matrix.compose(position, quaternion, scale);

      barkRef.current.setMatrixAt(index, matrix);
      leavesRef.current.setMatrixAt(index, matrix);
    });

    barkRef.current.instanceMatrix.needsUpdate = true;
    leavesRef.current.instanceMatrix.needsUpdate = true;
  }, [trees, barkGeom, leavesGeom]);

  if (!barkGeom || !leavesGeom) return null;

  return (
    <group name="instanced-village-trees">
      <instancedMesh
        ref={barkRef}
        args={[barkGeom, barkMat, trees.length]}
        castShadow={enableShadows}
        receiveShadow
      />
      <instancedMesh
        ref={leavesRef}
        args={[leavesGeom, leavesMat, trees.length]}
        castShadow={enableShadows}
        receiveShadow
      />
    </group>
  );
}

export function Environment({ enableShadows = true }) {
  const treeGltf = useGLTF("/models/tree.glb");
  const tower2Gltf = useGLTF("/models/skyscraper2.glb");

  const processedTower2 = useMemo(() => {
    const scene = tower2Gltf.scene.clone(true);
    scene.traverse((child) => {
      if (child.isMesh) {
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
      {/* Maysazor zamin */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 12]}>
        <planeGeometry args={[65, 80]} />
        <meshStandardMaterial color="#55aa55" roughness={0.9} />
      </mesh>

      {/* Qishloq yo'llari, yo'laklar va bordurlar */}
      <VillageRoads />

      {/* Ko'cha chiroqlari (Batched InstancedMesh) */}
      <StreetLights enableShadows={enableShadows} />

      {/* Koreys uslubidagi turar-joy past devorlari va darvoza ustunlari */}
      <ResidentialBoundaries />

      {/* Baland bino (Kafe orqasida - 268 tris ultra-lightweight) */}
      <primitive object={processedTower2} />

      {/* Qishloq daraxtlari (Optimallashtirilgan InstancedMesh) */}
      <InstancedVillageTrees trees={VILLAGE_TREES} treeGltf={treeGltf} enableShadows={enableShadows} />

      {/* Tabiiy atrof-muhit foni: Tog'lar (Shimol), O'rmon (Sharq), Okean (Janub), Megapolis (G'arb) */}
      <WorldBackground />
    </group>
  );
}

useGLTF.preload("/models/tree.glb");
useGLTF.preload("/models/skyscraper2.glb");
