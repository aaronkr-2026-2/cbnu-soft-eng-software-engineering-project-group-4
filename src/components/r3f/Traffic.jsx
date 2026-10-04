import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

function SingleCar({ config, baseCarScene, animations, isOutside }) {
  const groupRef = useRef();

  // Har bir mashina uchun mustaqil klon
  const { clonedScene, yPos } = useMemo(() => {
    const clone = baseCarScene.clone(true);
    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    const box = new THREE.Box3().setFromObject(clone);
    const size = box.getSize(new THREE.Vector3());
    const maxLen = Math.max(size.x, size.z) || 1;
    const scaleFactor = 4.0 / maxLen;
    clone.scale.set(scaleFactor, scaleFactor, scaleFactor);

    const scaledBox = new THREE.Box3().setFromObject(clone);
    const y = -scaledBox.min.y + 0.02;
    return { clonedScene: clone, yPos: y };
  }, [baseCarScene]);

  // Animatsiyalar (masalan g'ildiraklar aylanishi)
  const { actions } = useAnimations(animations, groupRef);

  React.useEffect(() => {
    Object.values(actions).forEach((action) => {
      if (action) action.play();
    });
  }, [actions]);

  // Harakat kadrlar bo'yicha
  useFrame((_, delta) => {
    if (!groupRef.current || !isOutside) return;

    // Tezlikni sekundiga moslab harakatlantiramiz
    const moveStep = config.speed * config.dir * (delta * 60);
    groupRef.current.position.x += moveStep;

    if (config.dir === 1 && groupRef.current.position.x > 30) {
      groupRef.current.position.x = -30;
    } else if (config.dir === -1 && groupRef.current.position.x < -30) {
      groupRef.current.position.x = 30;
    }
  });

  const rotY = config.dir === 1 ? -Math.PI / 2 : Math.PI / 2;

  return (
    <group
      ref={groupRef}
      position={[config.startX, yPos, config.z]}
      rotation={[0, rotY, 0]}
    >
      <primitive object={clonedScene} />
    </group>
  );
}

export function Traffic({ isOutside = true }) {
  const { scene: baseCarScene, animations } = useGLTF("/models/car.glb");

  const carConfigs = useMemo(
    () => [
      { startX: -25, z: 9.6, speed: 0.18, dir: 1 },
      { startX: -10, z: 9.6, speed: 0.23, dir: 1 },
      { startX: 20, z: 6.4, speed: 0.16, dir: -1 },
      { startX: 5, z: 6.4, speed: 0.21, dir: -1 }
    ],
    []
  );

  return (
    <group>
      {carConfigs.map((cfg, idx) => (
        <SingleCar
          key={idx}
          config={cfg}
          baseCarScene={baseCarScene}
          animations={animations}
          isOutside={isOutside}
        />
      ))}
    </group>
  );
}

useGLTF.preload("/models/car.glb");
