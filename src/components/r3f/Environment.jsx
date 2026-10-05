import React, { useMemo } from "react";
import * as THREE from "three";
import { useGLTF, Clone } from "@react-three/drei";
import { VillageRoads } from "./VillageRoads";
import { StreetLights } from "./StreetLights";
import { ResidentialBoundaries } from "./ResidentialBoundaries";

const VILLAGE_TREES = [
  // 1. Existing Roadside trees (North grass verge behind north sidewalk)
  { x: -18.0, z: 13.3, scale: 1.05, rotY: 0.7 },
  { x: -14.5, z: 13.3, scale: 0.95, rotY: 2.1 },
  { x: -2.8,  z: 13.4, scale: 1.10, rotY: 4.2 },
  { x: 0.0,   z: 13.4, scale: 0.90, rotY: 1.5 },
  { x: 11.0,  z: 13.3, scale: 1.15, rotY: 3.3 },
  { x: 13.5,  z: 13.3, scale: 1.00, rotY: 5.4 },
  { x: 18.0,  z: 13.3, scale: 1.08, rotY: 0.3 },

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

  // 6. Trees around House B (North-West)
  { x: -16.5, z: 18.0, scale: 1.10, rotY: 4.8 },
  { x: -17.0, z: 22.0, scale: 0.90, rotY: 2.2 },
  { x: -14.5, z: 23.2, scale: 1.05, rotY: 0.5 },
  { x: -0.8,  z: 18.5, scale: 1.00, rotY: 3.4 },
  { x: -0.8,  z: 22.0, scale: 1.15, rotY: 5.2 },

  // 7. Trees around House E (North-East) & New North Avenue
  { x: 17.5,  z: 23.2, scale: 1.05, rotY: 1.1 },
  { x: 17.0,  z: 18.5, scale: 0.95, rotY: 4.6 },
  { x: 17.0,  z: 27.5, scale: 1.10, rotY: 2.7 },

  // 8. Open green park area near North Entrance
  { x: 18.0,  z: 14.5, scale: 1.20, rotY: 3.9 },
  { x: 22.0,  z: 14.5, scale: 0.90, rotY: 0.8 },

  // 9. Trees around New North Residential Area (neatly framing perimeter and community park)
  { x: -17.5, z: 35.5, scale: 1.05, rotY: 0.8 },
  { x: -17.5, z: 41.5, scale: 0.95, rotY: 2.3 },
  { x: -10.8, z: 45.2, scale: 1.10, rotY: 3.4 },
  { x: -5.5,  z: 42.5, scale: 1.00, rotY: 4.1 },
  { x: 0.0,   z: 42.5, scale: 1.15, rotY: 1.6 },
  { x: 5.5,   z: 42.5, scale: 1.00, rotY: 3.2 },
  { x: 10.8,  z: 45.2, scale: 1.10, rotY: 1.8 },
  { x: 17.5,  z: 41.5, scale: 1.05, rotY: 5.0 },
  { x: 17.5,  z: 35.5, scale: 0.95, rotY: 1.1 },
  { x: -3.5,  z: 37.0, scale: 1.05, rotY: 2.7 },
  { x: 2.0,   z: 37.0, scale: 0.95, rotY: 1.2 }
];

export function Environment() {
  // Daraxt modeli
  const treeGltf = useGLTF("/models/tree.glb");
  const processedTree = useMemo(() => {
    const scene = treeGltf.scene.clone(true);
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material && child.material.map) {
          child.material.map.colorSpace = THREE.SRGBColorSpace;
        }
      }
    });
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const scaleFactor = 3.8 / (size.y || 1);
    scene.scale.set(scaleFactor, scaleFactor, scaleFactor);
    const scaledBox = new THREE.Box3().setFromObject(scene);
    scene.position.y = -scaledBox.min.y;
    return scene;
  }, [treeGltf]);

  // Skyscraper 2 (Kafe orqasidagi baland bino)
  const tower2Gltf = useGLTF("/models/skyscraper2.glb");
  const processedTower2 = useMemo(() => {
    const scene = tower2Gltf.scene.clone(true);
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
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
    <group>
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

      {/* Qishloq daraxtlari */}
      {VILLAGE_TREES.map((pos, idx) => (
        <group
          key={`village-tree-${idx}`}
          position={[pos.x, 0, pos.z]}
          rotation={[0, pos.rotY, 0]}
          scale={[pos.scale, pos.scale, pos.scale]}
        >
          <Clone object={processedTree} />
        </group>
      ))}
    </group>
  );
}

// Preload models for fast instant load
useGLTF.preload("/models/tree.glb");
useGLTF.preload("/models/skyscraper2.glb");
