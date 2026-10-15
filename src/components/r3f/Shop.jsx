import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

export function Shop({ isTalking = false, currentLocation = "outside" }) {
  // 1. Do'kon interyeri
  const interiorGltf = useGLTF("/models/shop_interior.glb");
  useEffect(() => {
    // Keshdagi model transformatsiyasini tozalash (reset to 1)
    interiorGltf.scene.scale.set(1, 1, 1);
    interiorGltf.scene.position.set(0, 0, 0);
    interiorGltf.scene.rotation.set(0, 0, 0);
    interiorGltf.scene.traverse((c) => {
      if (c.isMesh) {
        c.castShadow = false;
        c.receiveShadow = true;
      }
    });
  }, [interiorGltf]);

  // 2. Do'kon peshtaxtasi (shop_furniture.glb)
  const furnitureGltf = useGLTF("/models/shop_furniture.glb");
  useEffect(() => {
    furnitureGltf.scene.scale.set(1, 1, 1);
    furnitureGltf.scene.position.set(0, 0, 0);
    furnitureGltf.scene.rotation.set(0, 0, 0);
    furnitureGltf.scene.traverse((c) => {
      if (c.isMesh) {
        c.castShadow = true;
        c.receiveShadow = true;
      }
    });
  }, [furnitureGltf]);

  // 3. Do'kon javoni (shop_furniture_new.glb)
  const shelfGltf = useGLTF("/models/shop_furniture_new.glb");
  useEffect(() => {
    shelfGltf.scene.scale.set(1, 1, 1);
    shelfGltf.scene.position.set(0, 0, 0);
    shelfGltf.scene.rotation.set(0, 0, 0);
    shelfGltf.scene.traverse((c) => {
      if (c.isMesh) {
        c.castShadow = false;
        c.receiveShadow = true;
        if (c.material && c.material.map) {
          c.material.map.colorSpace = THREE.SRGBColorSpace;
        }
      }
    });
  }, [shelfGltf]);

  // 4. Sotuvchi Jack (seller.glb)
  const sellerGltf = useGLTF("/models/seller.glb");
  const mixerRef = useRef(null);
  const talkActionRef = useRef(null);

  useEffect(() => {
    sellerGltf.scene.scale.set(1, 1, 1);
    sellerGltf.scene.position.set(0, 0, 0);
    sellerGltf.scene.rotation.set(0, 0, 0);
    sellerGltf.scene.traverse((c) => {
      if (c.isMesh) {
        c.castShadow = true;
        c.receiveShadow = true;
      }
    });

    if (sellerGltf.animations && sellerGltf.animations.length > 0) {
      const mixer = new THREE.AnimationMixer(sellerGltf.scene);
      const talkAction = mixer.clipAction(sellerGltf.animations[0]);
      talkAction.setLoop(THREE.LoopRepeat);
      talkAction.play();

      mixerRef.current = mixer;
      talkActionRef.current = talkAction;
    }
  }, [sellerGltf]);

  useFrame((_, delta) => {
    if (currentLocation !== "Shop") return;
    if (mixerRef.current) mixerRef.current.update(delta);
    if (talkActionRef.current) {
      talkActionRef.current.timeScale = isTalking ? 1.0 : 0.6;
    }
  });

  const isInside = currentLocation === "Shop";
  const isVisible = currentLocation === "outside" || isInside;

  if (!isVisible) return null;

  return (
    <group>
      {/* 1. Do'kon binosi - tashqarida ham, ichkarida ham ko'rinadi */}
      <group
        position={[0, 0, -3.5895]}
        rotation={[0, -Math.PI / 2, 0]}
        scale={[0.15579, 0.15579, 0.15579]}
      >
        <primitive object={interiorGltf.scene} />
      </group>

      {/* 2. Ichki mebellar va sotuvchi Jack faqat Shop ichida ko'rinadi */}
      {isInside && (
        <>
          <group
            position={[0, 0, -1.2]}
            rotation={[0, Math.PI, 0]}
            scale={[0.98375, 0.98375, 0.98375]}
          >
            <primitive object={furnitureGltf.scene} />
          </group>

          <group
            position={[0, 0, 3.2]}
            scale={[0.0012309, 0.0009468, 0.0009468]}
          >
            <primitive object={shelfGltf.scene} />
          </group>

          <group
            position={[0, 0, -1.85]}
            scale={[0.0093626, 0.0093626, 0.0093626]}
          >
            <primitive object={sellerGltf.scene} />
          </group>
        </>
      )}
    </group>
  );
}

useGLTF.preload("/models/shop_interior.glb");
useGLTF.preload("/models/shop_furniture.glb");
useGLTF.preload("/models/shop_furniture_new.glb");
useGLTF.preload("/models/seller.glb");
