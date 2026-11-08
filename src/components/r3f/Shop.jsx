import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

import { DEFAULT_SHOP_3D_ITEMS, isItemAlreadyCollected } from "../../services/inventoryLogic";

function ShopItem3D({ item }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime + item.position[0];
    meshRef.current.position.y = item.position[1] + Math.sin(t * 2.5) * 0.025;
    meshRef.current.rotation.y += 0.015;
  });

  return (
    <group position={[item.position[0], 0, item.position[2]]}>
      {/* Soft indicator ring on shelf surface */}
      <mesh position={[0, item.position[1] - 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.12, 0.16, 20]} />
        <meshBasicMaterial
          color={
            item.itemId === "water_bottle"
              ? "#38bdf8"
              : item.itemId === "apple"
                ? "#ef4444"
                : item.itemId === "milk"
                  ? "#60a5fa"
                  : "#f59e0b"
          }
          transparent
          opacity={0.5}
        />
      </mesh>

      <group ref={meshRef} position={[0, item.position[1], 0]}>
        {item.itemId === "water_bottle" && (
          <group scale={[0.85, 0.85, 0.85]}>
            {/* Bottle body */}
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.075, 0.075, 0.22, 16]} />
              <meshStandardMaterial
                color="#0284c7"
                roughness={0.1}
                metalness={0.1}
                transparent
                opacity={0.8}
              />
            </mesh>
            {/* White paper label */}
            <mesh position={[0, -0.01, 0]}>
              <cylinderGeometry args={[0.077, 0.077, 0.09, 16]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.4} />
            </mesh>
            {/* Bottle neck */}
            <mesh position={[0, 0.13, 0]}>
              <cylinderGeometry args={[0.035, 0.065, 0.05, 16]} />
              <meshStandardMaterial color="#0284c7" transparent opacity={0.8} />
            </mesh>
            {/* Cap */}
            <mesh position={[0, 0.165, 0]}>
              <cylinderGeometry args={[0.038, 0.038, 0.03, 16]} />
              <meshStandardMaterial color="#38bdf8" roughness={0.3} />
            </mesh>
          </group>
        )}

        {item.itemId === "apple" && (
          <group scale={[0.85, 0.85, 0.85]}>
            {/* Apple fruit */}
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[0.11, 20, 20]} />
              <meshStandardMaterial color="#dc2626" roughness={0.25} />
            </mesh>
            {/* Stem */}
            <mesh position={[0, 0.11, 0]} rotation={[0, 0, 0.15]}>
              <cylinderGeometry args={[0.01, 0.012, 0.05, 8]} />
              <meshStandardMaterial color="#78350f" roughness={0.8} />
            </mesh>
            {/* Little green leaf */}
            <mesh position={[0.03, 0.12, 0]} rotation={[0.4, 0.2, -0.6]}>
              <boxGeometry args={[0.04, 0.01, 0.025]} />
              <meshStandardMaterial color="#22c55e" roughness={0.4} />
            </mesh>
          </group>
        )}

        {item.itemId === "bread" && (
          <group scale={[0.85, 0.85, 0.85]}>
            {/* Loaf body */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.22, 0.12, 0.13]} />
              <meshStandardMaterial color="#b45309" roughness={0.7} />
            </mesh>
            {/* Bread top score marks */}
            <mesh position={[-0.04, 0.062, 0]}>
              <boxGeometry args={[0.02, 0.005, 0.09]} />
              <meshStandardMaterial color="#78350f" roughness={0.9} />
            </mesh>
            <mesh position={[0.04, 0.062, 0]}>
              <boxGeometry args={[0.02, 0.005, 0.09]} />
              <meshStandardMaterial color="#78350f" roughness={0.9} />
            </mesh>
          </group>
        )}

        {item.itemId === "milk" && (
          <group scale={[0.85, 0.85, 0.85]}>
            {/* Milk bottle body */}
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.075, 0.08, 0.22, 16]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.3} metalness={0.1} />
            </mesh>
            {/* Dairy label */}
            <mesh position={[0, -0.01, 0]}>
              <cylinderGeometry args={[0.077, 0.077, 0.09, 16]} />
              <meshStandardMaterial color="#60a5fa" roughness={0.4} />
            </mesh>
            {/* Bottle neck */}
            <mesh position={[0, 0.13, 0]}>
              <cylinderGeometry args={[0.04, 0.07, 0.05, 16]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.3} />
            </mesh>
            {/* Blue cap */}
            <mesh position={[0, 0.165, 0]}>
              <cylinderGeometry args={[0.042, 0.042, 0.03, 16]} />
              <meshStandardMaterial color="#0284c7" roughness={0.3} />
            </mesh>
          </group>
        )}
      </group>
    </group>
  );
}

export function Shop({
  isTalking = false,
  currentLocation = "outside",
  shopItems = DEFAULT_SHOP_3D_ITEMS,
  collectedItemIds = []
}) {
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

          {/* 3D Physical Pickable Grocery Items */}
          {shopItems.map((item) => {
            if (isItemAlreadyCollected(collectedItemIds, item.instanceId)) {
              return null;
            }
            return <ShopItem3D key={item.instanceId} item={item} />;
          })}
        </>
      )}
    </group>
  );
}

useGLTF.preload("/models/shop_interior.glb");
useGLTF.preload("/models/shop_furniture.glb");
useGLTF.preload("/models/shop_furniture_new.glb");
useGLTF.preload("/models/seller.glb");
