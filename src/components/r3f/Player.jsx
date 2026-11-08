import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { VILLAGE_BUILDINGS } from "./villageBuildingsConfig";
import { DEFAULT_SHOP_3D_ITEMS } from "../../services/inventoryLogic";

const BUILDINGS_CONFIG = [
  { name: "Shop", x: 0, z: -2.5, halfW: 3.8, halfD: 5.5 },
  { name: "Cafe", x: -12, z: 0, halfW: 4.0, halfD: 3.0 },
  ...VILLAGE_BUILDINGS.map((b) => ({
    name: b.name,
    x: b.position[0],
    z: b.position[2],
    halfW: b.collision.halfW,
    halfD: b.collision.halfD
  }))
];

// Procedural relaxed standing idle rotations for Mixamo / Renderpeople skeleton
const IDLE_BONE_ROTATIONS = {
  // Relaxed arms hanging naturally beside body with gentle elbow bend
  shoulder_l: [-0.007, 0.818, -0.02, 0.575],
  upperarm_l: [0.03, 0.479, -0.079, 0.874],
  lowerarm_l: [0, 0, -0.098, 0.995],
  hand_l: [-0.726, 0.031, 0.039, 0.685],
  shoulder_r: [0.815, -0.01, -0.579, 0.001],
  upperarm_r: [0.029, 0.471, -0.008, 0.882],
  lowerarm_r: [0, 0, -0.111, 0.994],
  hand_r: [-0.629, 0.029, 0.036, 0.776],

  // Natural upright spine, neck, and head
  spine_01: [0, 0, 0, 1],
  spine_02: [0, 0, 0, 1],
  spine_03: [0, 0, 0, 1],
  neck: [0, -0.000029, -0.067279, 0.997734],
  head: [0, 0.000029, 0.067279, 0.997734],

  // Upright planted standing legs
  upperleg_l: [0, 0.000057, 0.013626, 0.999907],
  lowerleg_l: [0.000062, -0.002934, -0.048107, 0.998838],
  foot_l: [-0.000099, 0.002875, 0.034493, 0.999401],
  upperleg_r: [-0.000035, 0, 0.999907, -0.013668],
  lowerleg_r: [0.000096, -0.003558, -0.054287, 0.998519],
  foot_r: [-0.000143, 0.003521, 0.040634, 0.999168],

  hip: [0, -0.707107, 0, 0.707107],
  root: [0, 0, 0, 1]
};

export function Player({
  playerRef,
  cameraAnglesRef,
  currentLocation,
  isDialogOpen,
  hasModalOpen,
  shopItems = DEFAULT_SHOP_3D_ITEMS,
  collectedItemIds = [],
  onPromptChange,
  onInteractDoor,
  onInteractNPC,
  onPickupItem
}) {
  const groupRef = useRef();
  const keysRef = useRef({ w: false, a: false, s: false, d: false });
  const prevPromptRef = useRef({ door: null, npc: null, item: null });
  const activeItemRef = useRef(null);
  const forwardVecRef = useRef(new THREE.Vector3());
  const rightVecRef = useRef(new THREE.Vector3());

  const mixerRef = useRef(null);
  const walkActionRef = useRef(null);
  const idleActionRef = useRef(null);
  const isWalkingRef = useRef(false);

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
      mixerRef.current = mixer;

      // Look for idle clip in GLTF, or build procedural relaxed standing clip
      let idleClip = gltf.animations.find(
        (a) => /idle|stand|wait/i.test(a.name) && a.tracks && a.tracks.length > 0
      );

      if (!idleClip) {
        const idleTracks = [];
        const times = [0, 1];
        for (const [boneName, q] of Object.entries(IDLE_BONE_ROTATIONS)) {
          idleTracks.push(
            new THREE.QuaternionKeyframeTrack(`${boneName}.quaternion`, times, [...q, ...q])
          );
        }
        idleClip = new THREE.AnimationClip("procedural_idle", 1, idleTracks);
      }

      const idleAction = mixer.clipAction(idleClip);
      idleAction.setLoop(THREE.LoopRepeat);
      idleAction.play();
      idleActionRef.current = idleAction;

      // Look for walk clip (by name or first animation with tracks)
      const walkClip =
        gltf.animations.find(
          (a) => /walk|run/i.test(a.name) && a.tracks && a.tracks.length > 0
        ) || gltf.animations.find((a) => a.tracks && a.tracks.length > 0) || gltf.animations[0];

      if (walkClip && walkClip.tracks && walkClip.tracks.length > 0) {
        const walkAction = mixer.clipAction(walkClip);
        walkAction.setLoop(THREE.LoopRepeat);
        walkAction.timeScale = 1.25;
        walkActionRef.current = walkAction;
      }
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
      if (e.isComposing || e.keyCode === 229) return;
      const targetTag = e.target?.tagName?.toLowerCase();
      if (targetTag === "input" || targetTag === "textarea" || e.target?.isContentEditable) {
        return;
      }

      const code = e.code;
      if (code === "KeyF") {
        onInteractNPC();
        return;
      }
      if (isDialogOpen || hasModalOpen) return;
      if (code === "KeyE") {
        if (activeItemRef.current && onPickupItem) {
          onPickupItem(activeItemRef.current);
          return;
        }
        onInteractDoor();
        return;
      }

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

    const handleBlur = () => {
      keysRef.current.w = false;
      keysRef.current.s = false;
      keysRef.current.a = false;
      keysRef.current.d = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleBlur);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleBlur);
    };
  }, [isDialogOpen, hasModalOpen, onInteractNPC, onInteractDoor, onPickupItem]);

  // Kolliziya
  const checkCollisions = (x, z) => {
    const r = 0.5;

    if (currentLocation === "outside") {
      for (const b of BUILDINGS_CONFIG) {
        // Special exterior collision handling for Education & Community District buildings with South doorway opening
        if (
          b.name === "Language School" ||
          b.name === "Study Center" ||
          b.name === "Community Center" ||
          b.name === "Career Center" ||
          b.name === "Activity Center" ||
          b.name === "Multi-Purpose Hall"
        ) {
          const bLeft = b.x - (b.halfW || 4.5);
          const bRight = b.x + (b.halfW || 4.5);
          const bBack = b.z - (b.halfD || 3.5);
          const bFront = b.z + (b.halfD || 3.5);

          if (x > bLeft - r && x < bRight + r && z > bBack - r && z < bFront + r) {
            const isDoorway = Math.abs(x - b.x) <= 0.85;
            if (isDoorway) {
              // In the doorway opening, block penetration past front door face
              if (z > bBack - 0.1) {
                z = bBack - 0.1;
              }
            } else {
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
          continue;
        }

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
    } else if (currentLocation === "Cafe") {
      x = Math.max(-14.2, Math.min(-9.8, x));
      z = Math.max(-0.2, Math.min(2.4, z));
    } else if (currentLocation === "Shop") {
      x = Math.max(-2.8, Math.min(2.8, x));
      z = Math.max(-2.2, Math.min(2.4, z));
    } else if (currentLocation === "Hotel") {
      x = Math.max(7.2, Math.min(11.8, x));
      z = Math.max(-0.6, Math.min(2.4, z));
    } else if (currentLocation === "Hospital") {
      x = Math.max(-10.8, Math.min(-5.2, x));
      z = Math.max(17.0, Math.min(20.2, z));
    } else if (currentLocation === "Bank") {
      x = Math.max(-26.2, Math.min(-19.8, x));
      z = Math.max(-0.6, Math.min(1.6, z));
    } else if (currentLocation === "Library") {
      x = Math.max(16.8, Math.min(22.8, x));
      z = Math.max(-0.6, Math.min(1.6, z));
    } else if (currentLocation === "PoliceStation") {
      x = Math.max(2.2, Math.min(7.8, x));
      z = Math.max(17.0, Math.min(20.2, z));
    } else if (currentLocation === "LanguageSchool") {
      // Room perimeter bounds: X in [-24.1, -19.9], Z in [36.4, 39.6]
      x = Math.max(-24.1, Math.min(-19.9, x));
      z = Math.max(36.4, Math.min(39.6, z));

      // Block Teacher Desk area: X in [-23.0, -21.0], Z in [36.4, 37.95]
      if (x > -23.0 && x < -21.0 && z < 37.95) {
        z = 37.95;
      }

      // Block Left Student Desks: X in [-24.1, -22.6], Z in [38.1, 39.6]
      if (x > -24.1 && x < -22.6 && z > 38.1 && z < 39.6) {
        x = -22.6;
      }

      // Block Right Student Desks: X in [-21.4, -19.9], Z in [38.1, 39.6]
      if (x > -21.4 && x < -19.9 && z > 38.1 && z < 39.6) {
        x = -21.4;
      }
    } else if (currentLocation === "StudyCenter") {
      // Room perimeter bounds: X in [-11.6, -7.4], Z in [36.4, 39.6]
      x = Math.max(-11.6, Math.min(-7.4, x));
      z = Math.max(36.4, Math.min(39.6, z));

      // Block Tutor Desk area: X in [-10.5, -8.5], Z in [36.4, 37.95]
      if (x > -10.5 && x < -8.5 && z < 37.95) {
        z = 37.95;
      }

      // Block Left Study Carrels: X in [-11.6, -10.1], Z in [38.0, 39.6]
      if (x > -11.6 && x < -10.1 && z > 38.0 && z < 39.6) {
        x = -10.1;
      }

      // Block Right Collaborative Table & Printer: X in [-8.9, -7.4], Z in [36.8, 39.2]
      if (x > -8.9 && x < -7.4 && z > 36.8 && z < 39.2) {
        x = -8.9;
      }
    } else if (currentLocation === "CommunityCenter") {
      // Room perimeter bounds: X in [7.4, 11.6], Z in [36.6, 39.5]
      x = Math.max(7.4, Math.min(11.6, x));
      z = Math.max(36.6, Math.min(39.5, z));

      // Block Reception Service Counter & Staff area: X in [8.1, 10.9], Z in [36.6, 38.25]
      if (x > 8.1 && x < 10.9 && z < 38.25) {
        z = 38.25;
      }

      // Block West Application Counter & Filling Table: X in [7.4, 8.1], Z in [37.0, 39.4]
      if (x < 8.1 && z > 37.0 && z < 39.4) {
        x = 8.1;
      }

      // Block East Waiting Chairs & Brochure Stand: X in [10.9, 11.6], Z in [36.9, 39.4]
      if (x > 10.9 && z > 36.9 && z < 39.4) {
        x = 10.9;
      }
    } else if (currentLocation === "CareerCenter") {
      // Room perimeter bounds: X in [19.9, 24.1], Z in [36.5, 39.5]
      x = Math.max(19.9, Math.min(24.1, x));
      z = Math.max(36.5, Math.min(39.5, z));

      // Block Counselor Desk & James area: X in [21.0, 23.0], Z in [36.5, 38.15]
      if (x > 21.0 && x < 23.0 && z < 38.15) {
        z = 38.15;
      }

      // Block West Consultation Table & Bookshelf: X in [19.9, 20.9], Z in [36.8, 39.3]
      if (x < 20.9 && z > 36.8 && z < 39.3) {
        x = 20.9;
      }

      // Block East Waiting Area & Filing Cabinet: X in [23.1, 24.1], Z in [36.8, 39.4]
      if (x > 23.1 && z > 36.8 && z < 39.4) {
        x = 23.1;
      }
    } else if (currentLocation === "ActivityCenter") {
      // Room perimeter bounds: X in [-18.2, -13.8], Z in [47.1, 50.0]
      x = Math.max(-18.2, Math.min(-13.8, x));
      z = Math.max(47.1, Math.min(50.0, z));

      // Block Coordinator Desk & Hana area: X in [-16.9, -15.1], Z in [47.1, 48.55]
      if (x > -16.9 && x < -15.1 && z < 48.55) {
        z = 48.55;
      }

      // Block West Craft Table & Storage Shelves: X in [-18.2, -16.8], Z in [47.2, 49.9]
      if (x < -16.8 && z > 47.2 && z < 49.9) {
        x = -16.8;
      }

      // Block East Language Club Table, Bookshelf & Dispenser: X in [-15.2, -13.8], Z in [47.2, 49.9]
      if (x > -15.2 && z > 47.2 && z < 49.9) {
        x = -15.2;
      }
    } else if (currentLocation === "MultiPurposeHall") {
      // Room perimeter bounds: X in [14.2, 17.8], Z in [46.8, 50.2]
      x = Math.max(14.2, Math.min(17.8, x));
      z = Math.max(46.8, Math.min(50.2, z));

      // Block Stage & Podium Area at rear: Z < 47.45
      if (z < 47.45) {
        z = 47.45;
      }

      // Block West Audience Chairs & Storage: X in [14.2, 15.4], Z in [47.5, 49.1]
      if (x < 15.4 && z > 47.5 && z < 49.1) {
        x = 15.4;
      }

      // Block East Audience Chairs & Registration Desk: X in [16.6, 17.8], Z in [47.5, 49.1]
      if (x > 16.6 && z > 47.5 && z < 49.1) {
        x = 16.6;
      }

      // Block Coordinator Yuri's standing post: X in [15.7, 16.3], Z in [48.5, 48.8]
      if (x > 15.7 && x < 16.3 && z > 48.5 && z < 48.8) {
        z = 48.8;
      }
    }

    if (currentLocation === "outside") {
      x = Math.max(-30, Math.min(30, x));
      z = Math.max(-20, Math.min(54.0, z));
    }
    return { x, z };
  };

  // Harakat va animatsiya kadrlar bo'yicha
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }

    if (playerRef) {
      playerRef.current = groupRef.current;
    }

    const keys = keysRef.current;
    const hasInput = (keys.w || keys.s || keys.a || keys.d) && !isDialogOpen && !hasModalOpen;

    let moveX = 0;
    let moveZ = 0;

    if (hasInput) {
      const theta = cameraAnglesRef.current.theta;
      const forward = forwardVecRef.current;
      const right = rightVecRef.current;

      forward.set(-Math.sin(theta), 0, -Math.cos(theta));
      right.set(Math.cos(theta), 0, -Math.sin(theta));

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
    }

    const inputLen = Math.hypot(moveX, moveZ);
    const isMoving = hasInput && inputLen > 0.001;
    groupRef.current.userData.isMoving = isMoving;

    // Handle walk / idle animation transitions smoothly
    if (isMoving) {
      if (!isWalkingRef.current) {
        isWalkingRef.current = true;
        if (idleActionRef.current) {
          idleActionRef.current.fadeOut(0.25);
        }
        if (walkActionRef.current) {
          walkActionRef.current.reset();
          walkActionRef.current.enabled = true;
          walkActionRef.current.fadeIn(0.25);
          walkActionRef.current.play();
        }
      }
    } else {
      if (isWalkingRef.current) {
        isWalkingRef.current = false;
        if (walkActionRef.current) {
          walkActionRef.current.fadeOut(0.3);
        }
        if (idleActionRef.current) {
          idleActionRef.current.reset();
          idleActionRef.current.enabled = true;
          idleActionRef.current.fadeIn(0.3);
          idleActionRef.current.play();
        }
      }
    }

    if (isMoving) {
      const speed = 0.065 * (delta * 60);

      const normX = moveX / inputLen;
      const normZ = moveZ / inputLen;

      // Smoothly rotate character to face movement direction
      const targetRotation = Math.atan2(normX, normZ);
      let diff = targetRotation - groupRef.current.rotation.y;
      diff = Math.atan2(Math.sin(diff), Math.cos(diff));
      const turnSpeed = 14;
      groupRef.current.rotation.y += diff * Math.min(1.0, turnSpeed * delta);

      const deltaX = normX * speed;
      const deltaZ = normZ * speed;

      const newX = groupRef.current.position.x + deltaX;
      const newZ = groupRef.current.position.z + deltaZ;
      const safe = checkCollisions(newX, newZ);
      groupRef.current.position.x = safe.x;
      groupRef.current.position.z = safe.z;
    }

    // Masofalarni tekshirish (Eshik va NPC)
    const posX = groupRef.current.position.x;
    const posZ = groupRef.current.position.z;

    let door = null;
    let npc = null;
    let item = null;

    if (currentLocation === "outside") {
      const shopDist = Math.hypot(posX - 0, posZ - 3.4);
      const cafeDist = Math.hypot(posX - -12, posZ - 3.6);
      const hotelDist = Math.hypot(posX - 9.5, posZ - 3.0);
      const hospitalDist = Math.hypot(posX - -8.0, posZ - 13.5);
      const bankDist = Math.hypot(posX - -23.0, posZ - 3.0);
      const libraryDist = Math.hypot(posX - 19.8, posZ - 3.0);
      const policeDist = Math.hypot(posX - 5.0, posZ - 13.5);
      const langDist = Math.hypot(posX - -22.0, posZ - 34.0);
      const studyDist = Math.hypot(posX - -9.5, posZ - 34.2);
      const commDist = Math.hypot(posX - 9.5, posZ - 34.2);
      const careerDist = Math.hypot(posX - 22.0, posZ - 34.0);
      const actDist = Math.hypot(posX - -16.0, posZ - 44.8);
      const hallDist = Math.hypot(posX - 16.0, posZ - 44.5);
      if (shopDist < 1.4) door = "Shop Door";
      else if (cafeDist < 1.4) door = "Cafe Door";
      else if (hotelDist < 1.6) door = "Hotel Door";
      else if (hospitalDist < 1.6) door = "Hospital Door";
      else if (bankDist < 1.6) door = "Bank Door";
      else if (libraryDist < 1.6) door = "Library Door";
      else if (policeDist < 1.6) door = "Police Station Door";
      else if (langDist < 1.8) door = "Language School Door";
      else if (studyDist < 1.8) door = "Study Center Door";
      else if (commDist < 1.8) door = "Community Center Door";
      else if (careerDist < 1.8) door = "Career Center Door";
      else if (actDist < 1.8) door = "Activity Center Door";
      else if (hallDist < 1.8) door = "Multi-Purpose Hall Door";
    } else if (currentLocation === "Shop") {
      if (Math.hypot(posX - 0, posZ - 2.5) < 1.4) door = "Exit Shop";
      if (Math.hypot(posX - 0, posZ - -1.85) < 2.5) npc = "Shop Seller";

      // Detect closest uncollected 3D item within pickup radius (1.35m)
      const collectedSet = new Set(collectedItemIds);
      let closestItem = null;
      let minItemDist = 1.35;

      if (Array.isArray(shopItems)) {
        for (const it of shopItems) {
          if (collectedSet.has(it.instanceId)) continue;
          const [ix, , iz] = it.position;
          const dist = Math.hypot(posX - ix, posZ - iz);
          if (dist < minItemDist) {
            minItemDist = dist;
            closestItem = it;
          }
        }
      }

      item = closestItem;
    } else if (currentLocation === "Cafe") {
      if (Math.hypot(posX - -12, posZ - 2.5) < 1.4) door = "Exit Cafe";
      if (Math.hypot(posX - -13.2, posZ - -1.75) < 2.5) npc = "Cafe Barista";
    } else if (currentLocation === "Hotel") {
      if (Math.hypot(posX - 9.5, posZ - 2.5) < 1.4) door = "Exit Hotel";
      if (Math.hypot(posX - 9.5, posZ - -1.85) < 2.5) npc = "Hotel Receptionist";
    } else if (currentLocation === "Hospital") {
      if (Math.hypot(posX - -8.0, posZ - 20.0) < 1.3) door = "Exit Hospital";
      if (Math.hypot(posX - -8.0, posZ - 16.2) < 2.2) npc = "Sarah";
    } else if (currentLocation === "Bank") {
      if (Math.hypot(posX - -23.0, posZ - 1.5) < 1.4 || posZ > 1.3) door = "Exit Bank";
      if (Math.hypot(posX - -23.0, posZ - -1.2) < 2.5) npc = "Bank Employee";
    } else if (currentLocation === "Library") {
      if (Math.hypot(posX - 19.8, posZ - 1.5) < 1.4 || posZ > 1.3) door = "Exit Library";
      if (Math.hypot(posX - 19.8, posZ - -1.2) < 2.5) npc = "Librarian";
    } else if (currentLocation === "PoliceStation") {
      if (Math.hypot(posX - 5.0, posZ - 20.0) < 1.4 || posZ > 19.3) door = "Exit Police Station";
      if (Math.hypot(posX - 5.0, posZ - 16.2) < 2.5) npc = "Officer Alex";
    } else if (currentLocation === "LanguageSchool") {
      if (Math.hypot(posX - -22.0, posZ - 39.8) < 1.4 || posZ > 39.1) door = "Exit Language School";
      if (Math.hypot(posX - -22.0, posZ - 37.0) < 2.0) npc = "Teacher Olivia";
    } else if (currentLocation === "StudyCenter") {
      if (Math.hypot(posX - -9.5, posZ - 39.8) < 1.4 || posZ > 39.1) door = "Exit Study Center";
      if (Math.hypot(posX - -9.5, posZ - 37.2) < 2.0) npc = "Tutor Daniel";
    } else if (currentLocation === "CommunityCenter") {
      if (Math.hypot(posX - 9.5, posZ - 39.8) < 1.4 || posZ > 39.1) door = "Exit Community Center";
      if (Math.hypot(posX - 9.5, posZ - 37.2) < 2.0) npc = "Staff Mina";
    } else if (currentLocation === "CareerCenter") {
      if (Math.hypot(posX - 22.0, posZ - 39.8) < 1.4 || posZ > 39.1) door = "Exit Career Center";
      if (Math.hypot(posX - 22.0, posZ - 37.2) < 2.0) npc = "Career Counselor James";
    } else if (currentLocation === "ActivityCenter") {
      if (Math.hypot(posX - -16.0, posZ - 50.1) < 1.4 || posZ > 49.4) door = "Exit Activity Center";
      if (Math.hypot(posX - -16.0, posZ - 47.7) < 2.0) npc = "Coordinator Hana";
    } else if (currentLocation === "MultiPurposeHall") {
      if (Math.hypot(posX - 16.0, posZ - 50.1) < 1.4 || posZ > 49.4) door = "Exit Multi-Purpose Hall";
      if (Math.hypot(posX - 16.0, posZ - 48.7) < 2.0) npc = "Coordinator Yuri";
    }

    activeItemRef.current = item;

    if (
      prevPromptRef.current.door !== door ||
      prevPromptRef.current.npc !== npc ||
      prevPromptRef.current.item?.instanceId !== item?.instanceId
    ) {
      prevPromptRef.current = { door, npc, item };
      onPromptChange({ door, npc, item });
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
