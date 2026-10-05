import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { VILLAGE_BUILDINGS } from "./villageBuildingsConfig";

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
  const forwardVecRef = useRef(new THREE.Vector3());
  const rightVecRef = useRef(new THREE.Vector3());

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
        // Special exterior collision handling for Language School with doorway opening
        if (b.name === "Language School") {
          // Language School: Center [-14.4, 36.0], Bounds X in [-17.0, -11.8], Z in [33.5, 38.5]
          // Doorway threshold is at X in [-15.2, -13.6] on the South frontage (Z = 33.5).
          const bLeft = -17.0;
          const bRight = -11.8;
          const bBack = 33.5;
          const bFront = 38.5;

          if (x > bLeft - r && x < bRight + r && z > bBack - r && z < bFront + r) {
            const isDoorway = x >= -15.1 && x <= -13.7;
            if (isDoorway) {
              // In the doorway opening, block penetration past front door face (Z = 33.4)
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

        // Special exterior collision handling for Study Center with doorway opening
        if (b.name === "Study Center") {
          // Study Center: Center [-7.5, 36.0], Bounds X in [-10.1, -4.9], Z in [33.7, 38.3]
          // Doorway threshold is at X in [-8.2, -6.8] on the South frontage (Z = 33.7).
          const bLeft = -10.1;
          const bRight = -4.9;
          const bBack = 33.7;
          const bFront = 38.3;

          if (x > bLeft - r && x < bRight + r && z > bBack - r && z < bFront + r) {
            const isDoorway = x >= -8.2 && x <= -6.8;
            if (isDoorway) {
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

        // Special exterior collision handling for Community Center with doorway opening
        if (b.name === "Community Center") {
          // Community Center: Center [7.2, 36.0], Bounds X in [4.7, 9.7], Z in [34.0, 38.0]
          // Doorway threshold is at X in [6.5, 7.9] on the South frontage (Z = 34.0).
          const bLeft = 4.7;
          const bRight = 9.7;
          const bBack = 34.0;
          const bFront = 38.0;

          if (x > bLeft - r && x < bRight + r && z > bBack - r && z < bFront + r) {
            const isDoorway = x >= 6.5 && x <= 7.9;
            if (isDoorway) {
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

        // Special exterior collision handling for Career Center with doorway opening
        if (b.name === "Career Center") {
          // Career Center: Center [14.4, 36.0], Bounds X in [11.9, 16.9], Z in [33.8, 38.2]
          // Doorway threshold is at X in [13.7, 15.1] on the South frontage (Z = 33.8).
          const bLeft = 11.9;
          const bRight = 16.9;
          const bBack = 33.8;
          const bFront = 38.2;

          if (x > bLeft - r && x < bRight + r && z > bBack - r && z < bFront + r) {
            const isDoorway = x >= 13.7 && x <= 15.1;
            if (isDoorway) {
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

        // Special exterior collision handling for Activity Center with doorway opening
        if (b.name === "Activity Center") {
          // Activity Center: Center [-10.8, 41.8], Bounds X in [-13.4, -8.2], Z in [39.9, 43.7]
          // Doorway threshold is at X in [-11.5, -10.1] on the South frontage (Z = 39.9).
          const bLeft = -13.4;
          const bRight = -8.2;
          const bBack = 39.9;
          const bFront = 43.7;

          if (x > bLeft - r && x < bRight + r && z > bBack - r && z < bFront + r) {
            const isDoorway = x >= -11.5 && x <= -10.1;
            if (isDoorway) {
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

        // Special exterior collision handling for Multi-Purpose Hall with doorway opening
        if (b.name === "Multi-Purpose Hall") {
          // Multi-Purpose Hall: Center [10.8, 41.8], Bounds X in [8.7, 12.9], Z in [39.6, 44.0]
          // Doorway threshold is at X in [10.1, 11.5] on the South frontage (Z = 39.6).
          const bLeft = 8.7;
          const bRight = 12.9;
          const bBack = 39.6;
          const bFront = 44.0;

          if (x > bLeft - r && x < bRight + r && z > bBack - r && z < bFront + r) {
            const isDoorway = x >= 10.1 && x <= 11.5;
            if (isDoorway) {
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
      // Room perimeter bounds: X in [-16.5, -12.3], Z in [34.4, 37.6]
      x = Math.max(-16.5, Math.min(-12.3, x));
      z = Math.max(34.4, Math.min(37.6, z));

      // Block Teacher Desk area: X in [-15.4, -13.4], Z in [34.4, 35.95]
      if (x > -15.4 && x < -13.4 && z < 35.95) {
        z = 35.95;
      }

      // Block Left Student Desks: X in [-16.5, -15.0], Z in [36.1, 37.6]
      if (x > -16.5 && x < -15.0 && z > 36.1 && z < 37.6) {
        x = -15.0;
      }

      // Block Right Student Desks: X in [-13.8, -12.3], Z in [36.1, 37.6]
      if (x > -13.8 && x < -12.3 && z > 36.1 && z < 37.6) {
        x = -13.8;
      }
    } else if (currentLocation === "StudyCenter") {
      // Room perimeter bounds: X in [-9.6, -5.4], Z in [34.4, 37.6]
      x = Math.max(-9.6, Math.min(-5.4, x));
      z = Math.max(34.4, Math.min(37.6, z));

      // Block Tutor Desk area: X in [-8.5, -6.5], Z in [34.4, 35.95]
      if (x > -8.5 && x < -6.5 && z < 35.95) {
        z = 35.95;
      }

      // Block Left Study Carrels: X in [-9.6, -8.1], Z in [36.0, 37.6]
      if (x > -9.6 && x < -8.1 && z > 36.0 && z < 37.6) {
        x = -8.1;
      }

      // Block Right Collaborative Table & Printer: X in [-6.9, -5.4], Z in [34.8, 37.2]
      if (x > -6.9 && x < -5.4 && z > 34.8 && z < 37.2) {
        x = -6.9;
      }
    } else if (currentLocation === "CommunityCenter") {
      // Room perimeter bounds: X in [5.1, 9.3], Z in [34.6, 37.5]
      x = Math.max(5.1, Math.min(9.3, x));
      z = Math.max(34.6, Math.min(37.5, z));

      // Block Reception Service Counter & Staff area: X in [5.8, 8.6], Z in [34.6, 36.25]
      if (x > 5.8 && x < 8.6 && z < 36.25) {
        z = 36.25;
      }

      // Block West Application Counter & Filling Table: X in [5.1, 5.8], Z in [35.0, 37.4]
      if (x < 5.8 && z > 35.0 && z < 37.4) {
        x = 5.8;
      }

      // Block East Waiting Chairs & Brochure Stand: X in [8.6, 9.3], Z in [34.9, 37.4]
      if (x > 8.6 && z > 34.9 && z < 37.4) {
        x = 8.6;
      }
    } else if (currentLocation === "CareerCenter") {
      // Room perimeter bounds: X in [12.3, 16.5], Z in [34.5, 37.5]
      x = Math.max(12.3, Math.min(16.5, x));
      z = Math.max(34.5, Math.min(37.5, z));

      // Block Counselor Desk & James area: X in [13.4, 15.4], Z in [34.5, 36.15]
      if (x > 13.4 && x < 15.4 && z < 36.15) {
        z = 36.15;
      }

      // Block West Consultation Table & Bookshelf: X in [12.3, 13.3], Z in [34.8, 37.3]
      if (x < 13.3 && z > 34.8 && z < 37.3) {
        x = 13.3;
      }

      // Block East Waiting Area & Filing Cabinet: X in [15.5, 16.5], Z in [34.8, 37.4]
      if (x > 15.5 && z > 34.8 && z < 37.4) {
        x = 15.5;
      }
    } else if (currentLocation === "ActivityCenter") {
      // Room perimeter bounds: X in [-13.0, -8.6], Z in [40.4, 43.3]
      x = Math.max(-13.0, Math.min(-8.6, x));
      z = Math.max(40.4, Math.min(43.3, z));

      // Block Coordinator Desk & Hana area: X in [-11.7, -9.9], Z in [40.4, 41.85]
      if (x > -11.7 && x < -9.9 && z < 41.85) {
        z = 41.85;
      }

      // Block West Craft Table & Storage Shelves: X in [-13.0, -11.6], Z in [40.5, 43.2]
      if (x < -11.6 && z > 40.5 && z < 43.2) {
        x = -11.6;
      }

      // Block East Language Club Table, Bookshelf & Dispenser: X in [-10.0, -8.6], Z in [40.5, 43.2]
      if (x > -10.0 && z > 40.5 && z < 43.2) {
        x = -10.0;
      }
    } else if (currentLocation === "MultiPurposeHall") {
      // Room perimeter bounds: X in [9.0, 12.6], Z in [40.1, 43.5]
      x = Math.max(9.0, Math.min(12.6, x));
      z = Math.max(40.1, Math.min(43.5, z));

      // Block Stage & Podium Area at rear: Z < 40.75
      if (z < 40.75) {
        z = 40.75;
      }

      // Block West Audience Chairs & Storage: X in [9.0, 10.2], Z in [40.8, 42.4]
      if (x < 10.2 && z > 40.8 && z < 42.4) {
        x = 10.2;
      }

      // Block East Audience Chairs & Registration Desk: X in [11.4, 12.6], Z in [40.8, 42.4]
      if (x > 11.4 && z > 40.8 && z < 42.4) {
        x = 11.4;
      }

      // Block Coordinator Yuri's standing post: X in [10.5, 11.1], Z in [41.8, 42.1]
      if (x > 10.5 && x < 11.1 && z > 41.8 && z < 42.1) {
        z = 42.1;
      }
    }

    if (currentLocation === "outside") {
      x = Math.max(-28, Math.min(28, x));
      z = Math.max(-20, Math.min(46.0, z));
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
    const isMoving = (keys.w || keys.s || keys.a || keys.d) && !isDialogOpen && !hasModalOpen;

    if (walkActionRef.current) {
      walkActionRef.current.paused = !isMoving;
    }

    if (isMoving) {
      const speed = 0.08 * (delta * 60);

      const theta = cameraAnglesRef.current.theta;
      const forward = forwardVecRef.current;
      const right = rightVecRef.current;

      forward.set(-Math.sin(theta), 0, -Math.cos(theta));
      right.set(Math.cos(theta), 0, -Math.sin(theta));

      let moveX = 0;
      let moveZ = 0;

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
      const hotelDist = Math.hypot(posX - 9.5, posZ - 3.0);
      const hospitalDist = Math.hypot(posX - -8.0, posZ - 13.5);
      const bankDist = Math.hypot(posX - -23.0, posZ - 3.0);
      const libraryDist = Math.hypot(posX - 19.8, posZ - 3.0);
      const policeDist = Math.hypot(posX - 5.0, posZ - 13.5);
      const langDist = Math.hypot(posX - -14.4, posZ - 33.0);
      const studyDist = Math.hypot(posX - -7.5, posZ - 33.2);
      const commDist = Math.hypot(posX - 7.2, posZ - 33.4);
      const careerDist = Math.hypot(posX - 14.4, posZ - 33.4);
      const actDist = Math.hypot(posX - -10.8, posZ - 39.4);
      const hallDist = Math.hypot(posX - 10.8, posZ - 39.4);
      if (shopDist < 1.4) door = "Shop Door";
      else if (cafeDist < 1.4) door = "Cafe Door";
      else if (hotelDist < 1.6) door = "Hotel Door";
      else if (hospitalDist < 1.6) door = "Hospital Door";
      else if (bankDist < 1.6) door = "Bank Door";
      else if (libraryDist < 1.6) door = "Library Door";
      else if (policeDist < 1.6) door = "Police Station Door";
      else if (langDist < 1.6) door = "Language School Door";
      else if (studyDist < 1.6) door = "Study Center Door";
      else if (commDist < 1.6) door = "Community Center Door";
      else if (careerDist < 1.6) door = "Career Center Door";
      else if (actDist < 1.6) door = "Activity Center Door";
      else if (hallDist < 1.6) door = "Multi-Purpose Hall Door";
    } else if (currentLocation === "Shop") {
      if (Math.hypot(posX - 0, posZ - 2.5) < 1.4) door = "Exit Shop";
      if (Math.hypot(posX - 0, posZ - -1.85) < 2.5) npc = "Shop Seller";
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
      if (Math.hypot(posX - -14.4, posZ - 37.8) < 1.4 || posZ > 37.1) door = "Exit Language School";
      if (Math.hypot(posX - -14.4, posZ - 35.0) < 2.0) npc = "Teacher Olivia";
    } else if (currentLocation === "StudyCenter") {
      if (Math.hypot(posX - -7.5, posZ - 37.8) < 1.4 || posZ > 37.1) door = "Exit Study Center";
      if (Math.hypot(posX - -7.5, posZ - 35.2) < 2.0) npc = "Tutor Daniel";
    } else if (currentLocation === "CommunityCenter") {
      if (Math.hypot(posX - 7.2, posZ - 37.8) < 1.4 || posZ > 37.1) door = "Exit Community Center";
      if (Math.hypot(posX - 7.2, posZ - 35.2) < 2.0) npc = "Staff Mina";
    } else if (currentLocation === "CareerCenter") {
      if (Math.hypot(posX - 14.4, posZ - 37.8) < 1.4 || posZ > 37.1) door = "Exit Career Center";
      if (Math.hypot(posX - 14.4, posZ - 35.2) < 2.0) npc = "Career Counselor James";
    } else if (currentLocation === "ActivityCenter") {
      if (Math.hypot(posX - -10.8, posZ - 43.4) < 1.4 || posZ > 42.7) door = "Exit Activity Center";
      if (Math.hypot(posX - -10.8, posZ - 41.0) < 2.0) npc = "Coordinator Hana";
    } else if (currentLocation === "MultiPurposeHall") {
      if (Math.hypot(posX - 10.8, posZ - 43.4) < 1.4 || posZ > 42.7) door = "Exit Multi-Purpose Hall";
      if (Math.hypot(posX - 10.8, posZ - 42.0) < 2.0) npc = "Coordinator Yuri";
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
