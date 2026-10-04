import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

const BUILDINGS_CONFIG = [
  { name: "Shop", x: 0, z: -2.5, halfW: 3.8, halfD: 5.5 },
  { name: "Cafe", x: -12, z: 0, halfW: 4.0, halfD: 3.0 }
];

export function Player({
  playerRef,
  cameraAnglesRef,
  currentLocation,
  isDialogOpen,
  hasModalOpen,
  onPromptChange,
  onInteractDoor,
  onInteractNPC
}) {
  const groupRef = useRef();
  const keysRef = useRef({ w: false, a: false, s: false, d: false });
  const prevPromptRef = useRef({ door: null, npc: null });

  const mixerRef = useRef(null);
  const walkActionRef = useRef(null);

  const gltf = useGLTF("/models/player.glb");

  useEffect(() => {
    // Model transformatsiyasini tozalash (reset to 1)
    gltf.scene.scale.set(1, 1, 1);
    gltf.scene.position.set(0, 0, 0);
    gltf.scene.rotation.set(0, 0, 0);
    gltf.scene.traverse((c) => {
      if (c.isMesh) {
        c.castShadow = true;
        c.receiveShadow = true;
      }
    });

    if (gltf.animations && gltf.animations.length > 0) {
      const mixer = new THREE.AnimationMixer(gltf.scene);
      const walkAction = mixer.clipAction(gltf.animations[0]);
      walkAction.play();
      walkAction.paused = true;

      mixerRef.current = mixer;
      walkActionRef.current = walkAction;
    }
  }, [gltf]);

  // playerRef ni biriktirish
  useEffect(() => {
    if (playerRef && groupRef.current) {
      playerRef.current = groupRef.current;
    }
  }, [playerRef]);

  // Klaviatura
  useEffect(() => {
    const handleKeyDown = (e) => {
      const code = e.code;
      if (code === "KeyF") {
        onInteractNPC();
        return;
      }
      if (code === "KeyE") {
        onInteractDoor();
        return;
      }

      if (isDialogOpen || hasModalOpen) return;
      if (code === "KeyW") keysRef.current.w = true;
      if (code === "KeyS") keysRef.current.s = true;
      if (code === "KeyA") keysRef.current.a = true;
      if (code === "KeyD") keysRef.current.d = true;
    };

    const handleKeyUp = (e) => {
      const code = e.code;
      if (code === "KeyW") keysRef.current.w = false;
      if (code === "KeyS") keysRef.current.s = false;
      if (code === "KeyA") keysRef.current.a = false;
      if (code === "KeyD") keysRef.current.d = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isDialogOpen, hasModalOpen, onInteractNPC, onInteractDoor]);

  // Kolliziya
  const checkCollisions = (x, z) => {
    const r = 0.5;

    if (currentLocation === "outside") {
      for (const b of BUILDINGS_CONFIG) {
        const halfW = b.halfW || 4.0;
        const halfD = b.halfD || 3.0;

        const bLeft = b.x - halfW;
        const bRight = b.x + halfW;
        const bBack = b.z - halfD;
        const bFront = b.z + halfD;

        if (x > bLeft - r && x < bRight + r && z > bBack - r && z < bFront + r) {
          const overlapLeft = x - (bLeft - r);
          const overlapRight = bRight + r - x;
          const overlapBack = z - (bBack - r);
          const overlapFront = bFront + r - z;

          const minOverlap = Math.min(overlapLeft, overlapRight, overlapBack, overlapFront);
          if (minOverlap === overlapFront) z = bFront + r;
          else if (minOverlap === overlapBack) z = bBack - r;
          else if (minOverlap === overlapLeft) x = bLeft - r;
          else if (minOverlap === overlapRight) x = bRight + r;
        }
      }

      // Kafe orqasidagi bino (x: -15, z: -10)
      const b2MinX = -15 - 3.5;
      const b2MaxX = -15 + 3.5;
      const b2MinZ = -10 - 3.5;
      const b2MaxZ = -10 + 3.5;
      if (x > b2MinX && x < b2MaxX && z > b2MinZ && z < b2MaxZ) {
        const dLeft = Math.abs(x - b2MinX);
        const dRight = Math.abs(b2MaxX - x);
        const dBack = Math.abs(z - b2MinZ);
        const dFront = Math.abs(b2MaxZ - z);
        const minDist = Math.min(dLeft, dRight, dBack, dFront);
        if (minDist === dLeft) x = b2MinX;
        else if (minDist === dRight) x = b2MaxX;
        else if (minDist === dBack) z = b2MinZ;
        else z = b2MaxZ;
      }

      // Baland bino to'sig'i (x: 16, z: 20)
      const minX = 16 - 3.5;
      const maxX = 16 + 3.5;
      const minZ = 20 - 3.5;
      const maxZ = 20 + 3.5;
      if (x > minX && x < maxX && z > minZ && z < maxZ) {
        const dLeft = Math.abs(x - minX);
        const dRight = Math.abs(maxX - x);
        const dBack = Math.abs(z - minZ);
        const dFront = Math.abs(maxZ - z);
        const minDist = Math.min(dLeft, dRight, dBack, dFront);
        if (minDist === dLeft) x = minX;
        else if (minDist === dRight) x = maxX;
        else if (minDist === dBack) z = minZ;
        else z = maxZ;
      }
    } else if (currentLocation === "Cafe") {
      x = Math.max(-14.2, Math.min(-9.8, x));
      z = Math.max(-0.2, Math.min(2.4, z));
    } else if (currentLocation === "Shop") {
      x = Math.max(-2.8, Math.min(2.8, x));
      z = Math.max(-2.2, Math.min(2.4, z));
    }

    x = Math.max(-20, Math.min(20, x));
    z = Math.max(-20, Math.min(20, z));
    return { x, z };
  };

  // Harakat va animatsiya kadrlar bo'yicha
  useFrame((_, delta) => {
    if (!groupRef.current) return;

    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }

    if (playerRef) {
      playerRef.current = groupRef.current;
    }

    const keys = keysRef.current;
    const isMoving = (keys.w || keys.s || keys.a || keys.d) && !isDialogOpen && !hasModalOpen;

    if (walkActionRef.current) {
      walkActionRef.current.paused = !isMoving;
    }

    if (isMoving) {
      const speed = 0.08 * (delta * 60);
      const theta = cameraAnglesRef.current.theta;

      let moveX = 0;
      let moveZ = 0;
      const forward = new THREE.Vector3(-Math.sin(theta), 0, -Math.cos(theta));
      const right = new THREE.Vector3(Math.cos(theta), 0, -Math.sin(theta));

      if (keys.w) {
        moveX += forward.x;
        moveZ += forward.z;
      }
      if (keys.s) {
        moveX -= forward.x;
        moveZ -= forward.z;
      }
      if (keys.a) {
        moveX -= right.x;
        moveZ -= right.z;
      }
      if (keys.d) {
        moveX += right.x;
        moveZ += right.z;
      }

      const len = Math.hypot(moveX, moveZ);
      if (len > 0) {
        moveX = (moveX / len) * speed;
        moveZ = (moveZ / len) * speed;

        groupRef.current.rotation.y = Math.atan2(moveX, moveZ);

        const newX = groupRef.current.position.x + moveX;
        const newZ = groupRef.current.position.z + moveZ;
        const safe = checkCollisions(newX, newZ);
        groupRef.current.position.x = safe.x;
        groupRef.current.position.z = safe.z;
      }
    }

    // Masofalarni tekshirish (Eshik va NPC)
    const posX = groupRef.current.position.x;
    const posZ = groupRef.current.position.z;

    let door = null;
    let npc = null;

    if (currentLocation === "outside") {
      const shopDist = Math.hypot(posX - 0, posZ - 3.4);
      const cafeDist = Math.hypot(posX - -12, posZ - 3.6);
      if (shopDist < 1.4) door = "Shop Door";
      else if (cafeDist < 1.4) door = "Cafe Door";
    } else if (currentLocation === "Shop") {
      if (Math.hypot(posX - 0, posZ - 2.5) < 1.4) door = "Exit Shop";
      if (Math.hypot(posX - 0, posZ - -1.85) < 2.5) npc = "Shop Seller";
    } else if (currentLocation === "Cafe") {
      if (Math.hypot(posX - -12, posZ - 2.5) < 1.4) door = "Exit Cafe";
      if (Math.hypot(posX - -13.2, posZ - -1.75) < 2.5) npc = "Cafe Barista";
    }

    if (prevPromptRef.current.door !== door || prevPromptRef.current.npc !== npc) {
      prevPromptRef.current = { door, npc };
      onPromptChange({ door, npc });
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 5.0]}>
      {/* Qahramon - aniq 1.70m bo'y va to'g'ri masshtab guruhi */}
      <group scale={[0.0091225, 0.0091225, 0.0091225]}>
        <primitive object={gltf.scene} />
      </group>
    </group>
  );
}

useGLTF.preload("/models/player.glb");
