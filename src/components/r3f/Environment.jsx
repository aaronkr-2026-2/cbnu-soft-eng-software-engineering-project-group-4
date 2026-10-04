import React, { useMemo } from "react";
import * as THREE from "three";
import { useGLTF, Clone } from "@react-three/drei";

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

  // Skyscraper 1 (O'ng tomondagi baland bino)
  const tower1Gltf = useGLTF("/models/skyscraper.glb");
  const processedTower1 = useMemo(() => {
    const scene = tower1Gltf.scene.clone(true);
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
    scene.position.set(16, -scaledBox.min.y, 20);
    return scene;
  }, [tower1Gltf]);

  const treePositions = useMemo(() => {
    const xs = [-18, -12, -6, 0, 6, 12, 18];
    return xs.map((x) => ({ x, z: 13.0, rotY: Math.random() * Math.PI * 2 }));
  }, []);

  const roadLines = useMemo(() => {
    const lines = [];
    for (let x = -22; x <= 22; x += 4.5) {
      lines.push(x);
    }
    return lines;
  }, []);

  return (
    <group>
      {/* Maysazor zamin */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]}>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#55aa55" roughness={0.9} />
      </mesh>

      {/* Asfalt yo'l */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0.02, 8]}>
        <planeGeometry args={[60, 6.5]} />
        <meshStandardMaterial color="#2e2e2e" roughness={0.85} />
      </mesh>

      {/* Bordurlar */}
      <mesh position={[0, 0.08, 4.7]} castShadow receiveShadow>
        <boxGeometry args={[60, 0.15, 0.25]} />
        <meshStandardMaterial color="#9e9e9e" />
      </mesh>
      <mesh position={[0, 0.08, 11.3]} castShadow receiveShadow>
        <boxGeometry args={[60, 0.15, 0.25]} />
        <meshStandardMaterial color="#9e9e9e" />
      </mesh>

      {/* Oq yo'l chiziqlari */}
      {roadLines.map((xVal, idx) => (
        <mesh key={idx} rotation={[-Math.PI / 2, 0, 0]} position={[xVal, 0.03, 8]}>
          <planeGeometry args={[2.2, 0.25]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      ))}

      {/* Baland binolar */}
      <primitive object={processedTower1} />
      <primitive object={processedTower2} />

      {/* Yo'l chetidagi daraxtlar */}
      {treePositions.map((pos, idx) => (
        <group key={idx} position={[pos.x, 0, pos.z]} rotation={[0, pos.rotY, 0]}>
          <Clone object={processedTree} />
        </group>
      ))}
    </group>
  );
}

// Preload models for fast instant load
useGLTF.preload("/models/tree.glb");
useGLTF.preload("/models/skyscraper.glb");
useGLTF.preload("/models/skyscraper2.glb");
