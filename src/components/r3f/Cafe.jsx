import React, { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

export function Cafe({ isTalking = false, currentLocation = "outside" }) {
  // 1. Kafe devorlari
  const wallMat = useMemo(() => new THREE.MeshStandardMaterial({ color: 0xd9b38c }), []);
  const doorMat = useMemo(() => new THREE.MeshStandardMaterial({ color: 0x553322 }), []);

  // 2. Kafe interyeri (cafe_interior.glb)
  const cafeGltf = useGLTF("/models/cafe_interior.glb");
  useEffect(() => {
    cafeGltf.scene.scale.set(1, 1, 1);
    cafeGltf.scene.position.set(0, 0, 0);
    cafeGltf.scene.rotation.set(0, 0, 0);
    cafeGltf.scene.traverse((c) => {
      if (c.isMesh) {
        c.castShadow = true;
        c.receiveShadow = true;
      }
    });
  }, [cafeGltf]);

  // 3. Barista Mia (barista.glb)
  const baristaGltf = useGLTF("/models/barista.glb");
  const mixerRef = useRef(null);
  const talkActionRef = useRef(null);

  useEffect(() => {
    baristaGltf.scene.scale.set(1, 1, 1);
    baristaGltf.scene.position.set(0, 0, 0);
    baristaGltf.scene.rotation.set(0, 0, 0);

    if (baristaGltf.animations && baristaGltf.animations.length > 0) {
      const mixer = new THREE.AnimationMixer(baristaGltf.scene);
      const talkAction = mixer.clipAction(baristaGltf.animations[0]);
      talkAction.setLoop(THREE.LoopRepeat);
      talkAction.play();

      mixerRef.current = mixer;
      talkActionRef.current = talkAction;
    }
  }, [baristaGltf]);

  useFrame((_, delta) => {
    if (mixerRef.current) mixerRef.current.update(delta);
    if (talkActionRef.current) {
      talkActionRef.current.timeScale = isTalking && currentLocation === "Cafe" ? 1.0 : 0.6;
    }
  });

  return (
    <group>
      {/* Kafe tashqi devorlari */}
      <group position={[-12, 0, 0]}>
        {/* Orqa devor */}
        <mesh position={[0, 2.5, -3]} material={wallMat}>
          <boxGeometry args={[8, 5, 0.2]} />
        </mesh>
        {/* Chap devor */}
        <mesh position={[-4, 2.5, 0]} material={wallMat}>
          <boxGeometry args={[0.2, 5, 6]} />
        </mesh>
        {/* O'ng devor */}
        <mesh position={[4, 2.5, 0]} material={wallMat}>
          <boxGeometry args={[0.2, 5, 6]} />
        </mesh>
        {/* Old devor chap qismi */}
        <mesh position={[-2.375, 2.5, 3]} material={wallMat}>
          <boxGeometry args={[3.25, 5, 0.2]} />
        </mesh>
        {/* Old devor o'ng qismi */}
        <mesh position={[2.375, 2.5, 3]} material={wallMat}>
          <boxGeometry args={[3.25, 5, 0.2]} />
        </mesh>
        {/* Old devor tepa qismi */}
        <mesh position={[0, 3.9, 3]} material={wallMat}>
          <boxGeometry args={[1.5, 2.2, 0.2]} />
        </mesh>
        {/* Eshik */}
        <mesh position={[0, 1.4, 3.05]} material={doorMat}>
          <boxGeometry args={[1.5, 2.8, 0.2]} />
        </mesh>
      </group>

      {/* Kafe interyeri - aniq 7.6m o'lcham va x: -12 pozitsiyada */}
      <group
        position={[-12.034, 0, 0.641]}
        scale={[0.0013007, 0.0013007, 0.0013007]}
      >
        <primitive object={cafeGltf.scene} />
      </group>

      {/* Barista Mia - aniq 1.75m odam bo'yi va to'g'ri burchak */}
      <group
        position={[-13.2, 0, -1.75]}
        rotation={[0, -(25 * Math.PI) / 180, 0]}
        scale={[0.94678, 0.94678, 0.94678]}
      >
        <primitive object={baristaGltf.scene} />
      </group>
    </group>
  );
}

useGLTF.preload("/models/cafe_interior.glb");
useGLTF.preload("/models/barista.glb");
