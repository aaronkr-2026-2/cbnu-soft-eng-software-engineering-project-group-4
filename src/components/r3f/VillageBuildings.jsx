import React, { useMemo } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { VILLAGE_BUILDINGS } from "./villageBuildingsConfig";
import { VillageSigns } from "./VillageSigns";

/**
 * Reusable component for rendering individual Kenney village buildings.
 * Configures mesh shadows and ensures sRGB color space for colormap.png texture.
 */
export function VillageBuilding({
  modelPath,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [7, 7, 7]
}) {
  const gltf = useGLTF(modelPath);

  const processedScene = useMemo(() => {
    const isSkyscraper = modelPath.includes("skyscraper");
    const scene = gltf.scene.clone(true);

    const isDistrictBuilding =
      modelPath.includes("building-type-f") ||
      modelPath.includes("building-type-g") ||
      modelPath.includes("building-type-h") ||
      modelPath.includes("building-type-i") ||
      modelPath.includes("building-type-j") ||
      modelPath.includes("building-type-k");

    if (isSkyscraper) {
      // Skyscraper has ~1,200 meshes. Disable castShadow and receiveShadow
      // to eliminate 1,200 shadow-map passes and optimize rendering performance.
      scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = false;
          child.receiveShadow = false;
          if (child.material && child.material.map) {
            child.material.map.colorSpace = THREE.SRGBColorSpace;
          }
        }
      });
      // Normalize pivot: compute raw bounding box and offset so the footprint center is (0, 0) and base is Y=0.
      const box = new THREE.Box3().setFromObject(scene);
      const center = new THREE.Vector3();
      box.getCenter(center);
      scene.position.set(-center.x, -box.min.y, -center.z);
    } else if (isDistrictBuilding) {
      // Performance optimization: do not add dynamic shadows to new district buildings (F - K)
      scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = false;
          child.receiveShadow = false;
          if (child.material && child.material.map) {
            child.material.map.colorSpace = THREE.SRGBColorSpace;
          }
        }
      });
    } else {
      scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          if (child.material && child.material.map) {
            child.material.map.colorSpace = THREE.SRGBColorSpace;
          }
        }
      });
    }

    return scene;
  }, [gltf, modelPath]);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <primitive object={processedScene} />
    </group>
  );
}

// Entrance step thresholds for the 6 Education & Community District buildings (F - K)
const DISTRICT_STEPS = [
  { id: "step-lang", position: [-14.4, 0.04, 33.1] },
  { id: "step-study", position: [-7.5, 0.04, 33.4] },
  { id: "step-comm", position: [7.2, 0.04, 33.9] },
  { id: "step-career", position: [14.4, 0.04, 33.6] },
  { id: "step-act", position: [-10.8, 0.04, 39.8] },
  { id: "step-hall", position: [10.8, 0.04, 39.4] }
];

/**
 * VillageBuildings: Renders all modular village houses (Types A through E)
 * and Education & Community District buildings (F through K).
 */
export function VillageBuildings() {
  return (
    <group>
      {/* Kenney village buildings */}
      {VILLAGE_BUILDINGS.map((b) => (
        <VillageBuilding
          key={b.id}
          modelPath={b.modelPath}
          position={b.position}
          rotation={b.rotation}
          scale={b.scale}
        />
      ))}

      {/* District Entrance Threshold Steps */}
      {DISTRICT_STEPS.map((s) => (
        <mesh key={s.id} position={s.position} receiveShadow>
          <boxGeometry args={[2.2, 0.08, 0.7]} />
          <meshStandardMaterial color="#88929b" roughness={0.7} />
        </mesh>
      ))}

      {/* Exterior Building Signs */}
      <VillageSigns />
    </group>
  );
}

// Preload all building models for seamless instant rendering
useGLTF.preload("/models/village/building-type-a.glb");
useGLTF.preload("/models/village/building-type-b.glb");
useGLTF.preload("/models/village/building-type-c.glb");
useGLTF.preload("/models/village/building-type-e.glb");
useGLTF.preload("/models/village/building-type-f.glb");
useGLTF.preload("/models/village/building-type-g.glb");
useGLTF.preload("/models/village/building-type-h.glb");
useGLTF.preload("/models/village/building-type-i.glb");
useGLTF.preload("/models/village/building-type-j.glb");
useGLTF.preload("/models/village/building-type-k.glb");
useGLTF.preload("/models/skyscraper.glb");

