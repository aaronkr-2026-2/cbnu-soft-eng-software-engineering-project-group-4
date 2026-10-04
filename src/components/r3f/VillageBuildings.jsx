import React, { useMemo } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { VILLAGE_BUILDINGS } from "./villageBuildingsConfig";

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
    const scene = gltf.scene.clone(true);
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material && child.material.map) {
          child.material.map.colorSpace = THREE.SRGBColorSpace;
        }
      }
    });
    return scene;
  }, [gltf]);

  return (
    <primitive
      object={processedScene}
      position={position}
      rotation={rotation}
      scale={scale}
    />
  );
}

/**
 * VillageBuildings: Renders all modular village houses (Types A through E).
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
    </group>
  );
}

// Preload all 5 building models for seamless instant rendering
useGLTF.preload("/models/village/building-type-a.glb");
useGLTF.preload("/models/village/building-type-b.glb");
useGLTF.preload("/models/village/building-type-c.glb");
useGLTF.preload("/models/village/building-type-d.glb");
useGLTF.preload("/models/village/building-type-e.glb");
