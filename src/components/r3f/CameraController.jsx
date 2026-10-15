import { useEffect, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { VILLAGE_BUILDINGS } from "./villageBuildingsConfig";

const GTA_OUTDOOR_RADIUS = 3.55;
const GTA_OUTDOOR_BASE_PHI = 1.415;
const GTA_MIN_PHI = 0.65;
const GTA_MAX_PHI = 1.70;
const GTA_TARGET_Y = 1.35;
const GTA_MIN_CAMERA_Y = 0.45;
const GTA_MIN_FOLLOW_RADIUS = 1.2;

const OUTDOOR_BUILDINGS_COLLISION = [
  { name: "Shop", x: 0, z: -2.5, halfW: 3.8, halfD: 5.5 },
  { name: "Cafe", x: -12, z: 0, halfW: 4.0, halfD: 3.0 },
  { name: "Building Behind Cafe", x: -15, z: -10, halfW: 3.5, halfD: 3.5 },
  ...VILLAGE_BUILDINGS.map((b) => ({
    name: b.name,
    x: b.position[0],
    z: b.position[2],
    halfW: b.collision.halfW,
    halfD: b.collision.halfD
  }))
];

function checkCameraBuildingCollision(pX, pZ, camX, camZ, maxDist) {
  const dx = camX - pX;
  const dz = camZ - pZ;
  const rayLen = Math.hypot(dx, dz);
  if (rayLen < 0.001) return maxDist;

  const ux = dx / rayLen;
  const uz = dz / rayLen;
  const margin = 0.35;

  let closestDist = maxDist;

  for (let i = 0; i < OUTDOOR_BUILDINGS_COLLISION.length; i++) {
    const b = OUTDOOR_BUILDINGS_COLLISION[i];
    const minX = b.x - b.halfW - margin;
    const maxX = b.x + b.halfW + margin;
    const minZ = b.z - b.halfD - margin;
    const maxZ = b.z + b.halfD + margin;

    let tNear = -Infinity;
    let tFar = Infinity;

    if (Math.abs(ux) > 1e-6) {
      let t1 = (minX - pX) / ux;
      let t2 = (maxX - pX) / ux;
      if (t1 > t2) {
        const tmp = t1;
        t1 = t2;
        t2 = tmp;
      }
      if (t1 > tNear) tNear = t1;
      if (t2 < tFar) tFar = t2;
      if (tNear > tFar) continue;
    } else if (pX < minX || pX > maxX) {
      continue;
    }

    if (Math.abs(uz) > 1e-6) {
      let t1 = (minZ - pZ) / uz;
      let t2 = (maxZ - pZ) / uz;
      if (t1 > t2) {
        const tmp = t1;
        t1 = t2;
        t2 = tmp;
      }
      if (t1 > tNear) tNear = t1;
      if (t2 < tFar) tFar = t2;
      if (tNear > tFar) continue;
    } else if (pZ < minZ || pZ > maxZ) {
      continue;
    }

    if (tNear > 0 && tNear < closestDist) {
      closestDist = tNear;
    }
  }

  return closestDist;
}

export function CameraController({
  playerRef,
  cameraAnglesRef,
  currentLocation,
  isDialogOpen
}) {
  const { camera } = useThree();
  const isDraggingRef = useRef(false);
  const prevMousePosRef = useRef({ x: 0, y: 0 });
  const currentLocationRef = useRef(currentLocation);
  const prevPlayerPosRef = useRef({ x: 0, z: 0 });
  const smoothRadiusRef = useRef(GTA_OUTDOOR_RADIUS);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    currentLocationRef.current = currentLocation;
  }, [currentLocation]);

  useEffect(() => {
    const handleMouseDown = (e) => {
      if (isDialogOpen) return;
      if (e.button !== 0) return;
      if (e.target && (e.target.tagName === "BUTTON" || e.target.tagName === "INPUT" || e.target.closest("button") || e.target.closest("input"))) return;
      isDraggingRef.current = true;
      prevMousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
      if (!isDraggingRef.current || isDialogOpen) return;
      const deltaX = e.clientX - prevMousePosRef.current.x;
      const deltaY = e.clientY - prevMousePosRef.current.y;
      prevMousePosRef.current = { x: e.clientX, y: e.clientY };

      const angles = cameraAnglesRef.current;
      if (currentLocationRef.current === "outside") {
        angles.theta -= deltaX * 0.004;
        angles.theta = Math.atan2(Math.sin(angles.theta), Math.cos(angles.theta));

        angles.phi += deltaY * 0.004;
        angles.phi = Math.max(GTA_MIN_PHI, Math.min(GTA_MAX_PHI, angles.phi));
      } else {
        angles.theta -= deltaX * 0.005;
        angles.phi -= deltaY * 0.005;
        angles.phi = Math.max(0.2, Math.min(Math.PI / 2 - 0.05, angles.phi));
      }
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("blur", handleMouseUp);
    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("blur", handleMouseUp);
    };
  }, [isDialogOpen, cameraAnglesRef]);

  useFrame((state, delta) => {
    if (!playerRef.current) return;

    const playerPos = playerRef.current.position;
    const angles = cameraAnglesRef.current;
    const { theta, phi, radius } = angles;

    if (currentLocation !== "outside") {
      let bX = 0;
      let bZ = -1.8;
      let targetY = 1.35;
      let minZ = -0.5;
      let maxZ = 2.5;
      let minX = -3.4;
      let maxX = 3.4;
      let camZOffset = 1.25;
      let shoulderOffsetX = 0.7;
      let shoulderOffsetY = 1.45;

      if (currentLocation === "Shop") {
        bX = 0;
        bZ = -1.8;
        minZ = -0.5;
        maxZ = 2.5;
        minX = bX - 3.4;
        maxX = bX + 3.4;
      } else if (currentLocation === "Hotel") {
        bX = 9.5;
        bZ = -1.85;
        minZ = -0.5;
        maxZ = 2.5;
        minX = bX - 3.4;
        maxX = bX + 3.4;
      } else if (currentLocation === "Cafe") {
        bX = -12;
        bZ = -1.75;
        minZ = -0.5;
        maxZ = 2.5;
        minX = bX - 3.4;
        maxX = bX + 3.4;
      } else if (currentLocation === "Hospital") {
        bX = -8;
        bZ = 16.2;
        minZ = 16.5;
        maxZ = 21.2;
        minX = bX - 3.4;
        maxX = bX + 3.4;
      } else if (currentLocation === "Bank") {
        // Bank reception interior: X in [-26.2, -19.8], Z in [-0.6, 1.6]
        // David & counter are at X = -23.0, Z = -1.45
        // Clamping camZ to [0.2, 1.48] ensures the camera stays on the entrance side
        // with a 0.52m safety buffer from the front wall (Z=2.0) and skyscraper exterior.
        bX = -23.0;
        bZ = -1.45;
        targetY = 1.32;
        minZ = 0.2;
        maxZ = 1.48;
        minX = -26.4;
        maxX = -19.6;
        camZOffset = 1.15;
        shoulderOffsetX = 0.55;
        shoulderOffsetY = 1.45;
      } else if (currentLocation === "Library") {
        // Library reception & study interior: X in [16.8, 22.8], Z in [-0.6, 1.6]
        // Emily & reception desk are at X = 19.8, Z = -1.45
        // Clamping camZ to [0.2, 1.48] keeps the camera on the entrance side
        // with a 0.52m safety margin inside the front wall (Z=2.0) and building exterior.
        bX = 19.8;
        bZ = -1.45;
        targetY = 1.32;
        minZ = 0.2;
        maxZ = 1.48;
        minX = 16.8;
        maxX = 22.8;
        camZOffset = 1.15;
        shoulderOffsetX = 0.55;
        shoulderOffsetY = 1.45;
      } else if (currentLocation === "PoliceStation") {
        // Police Station reception interior: X in [2.2, 7.8], Z in [17.0, 20.2]
        // Alex & reception counter are at X = 5.0, Z = 16.2
        // Clamping camZ to [17.2, 20.1] keeps the camera on the entrance side
        // with a safe buffer inside the south entrance wall (Z=20.6) and side walls.
        bX = 5.0;
        bZ = 16.2;
        targetY = 1.32;
        minZ = 17.2;
        maxZ = 20.1;
        minX = 2.6;
        maxX = 7.4;
        camZOffset = 1.15;
        shoulderOffsetX = 0.55;
        shoulderOffsetY = 1.45;
      } else if (currentLocation === "LanguageSchool") {
        // Language School classroom interior: X in [-16.5, -12.3], Z in [34.4, 37.6]
        // Teacher Olivia is at X = -14.4, Z = 35.0
        // Clamping camZ to [35.6, 37.6] keeps the camera securely inside the classroom
        bX = -14.4;
        bZ = 35.0;
        targetY = 1.32;
        minZ = 35.6;
        maxZ = 37.6;
        minX = -16.2;
        maxX = -12.6;
        camZOffset = 1.15;
        shoulderOffsetX = 0.55;
        shoulderOffsetY = 1.45;
      } else if (currentLocation === "StudyCenter") {
        // Study Center interior: X in [-9.6, -5.4], Z in [34.4, 37.6]
        // Tutor Daniel is at X = -7.5, Z = 35.2
        // Clamping camZ to [35.6, 37.6] keeps the camera securely inside the room
        bX = -7.5;
        bZ = 35.2;
        targetY = 1.32;
        minZ = 35.6;
        maxZ = 37.6;
        minX = -9.3;
        maxX = -5.7;
        camZOffset = 1.15;
        shoulderOffsetX = 0.55;
        shoulderOffsetY = 1.45;
      } else if (currentLocation === "CommunityCenter") {
        // Community Center interior: X in [4.9, 9.5], Z in [34.4, 37.8]
        // Staff Mina is at X = 7.2, Z = 35.2
        // Clamping camZ to [35.6, 37.5] keeps the camera inside the civic hall
        bX = 7.2;
        bZ = 35.2;
        targetY = 1.32;
        minZ = 35.6;
        maxZ = 37.5;
        minX = 5.4;
        maxX = 9.0;
        camZOffset = 1.15;
        shoulderOffsetX = 0.55;
        shoulderOffsetY = 1.45;
      } else if (currentLocation === "CareerCenter") {
        // Career Center interior: X in [12.1, 16.7], Z in [34.2, 37.9]
        // Career Counselor James is at X = 14.4, Z = 35.2
        // Clamping camZ to [35.6, 37.5] keeps the camera inside the counseling office
        bX = 14.4;
        bZ = 35.2;
        targetY = 1.32;
        minZ = 35.6;
        maxZ = 37.5;
        minX = 12.6;
        maxX = 16.2;
        camZOffset = 1.15;
        shoulderOffsetX = 0.55;
        shoulderOffsetY = 1.45;
      } else if (currentLocation === "ActivityCenter") {
        // Activity Center interior: X in [-13.2, -8.4], Z in [40.1, 43.5]
        // Coordinator Hana is at X = -10.8, Z = 41.0
        // Clamping camZ to [41.4, 43.1] keeps camera inside the activity hall
        bX = -10.8;
        bZ = 41.0;
        targetY = 1.32;
        minZ = 41.4;
        maxZ = 43.1;
        minX = -12.7;
        maxX = -8.9;
        camZOffset = 1.15;
        shoulderOffsetX = 0.55;
        shoulderOffsetY = 1.45;
      } else if (currentLocation === "MultiPurposeHall") {
        // Multi-Purpose Hall interior: X in [8.7, 12.9], Z in [39.6, 44.0]
        // Coordinator Yuri is at X = 10.8, Z = 42.0
        // Clamping camZ to [41.3, 43.3], camX to [9.2, 12.4] keeps camera safely inside the hall
        bX = 10.8;
        bZ = 42.0;
        targetY = 1.32;
        minZ = 41.3;
        maxZ = 43.3;
        minX = 9.2;
        maxX = 12.4;
        camZOffset = 1.15;
        shoulderOffsetX = 0.55;
        shoulderOffsetY = 1.45;
      }

      let camX = playerPos.x + shoulderOffsetX + radius * 0.8 * Math.sin(theta);
      let camY = shoulderOffsetY + radius * 0.4 * Math.cos(phi);
      let camZ = playerPos.z + camZOffset;

      camX = Math.max(minX, Math.min(maxX, camX));
      camZ = Math.min(maxZ, Math.max(minZ, camZ));
      camY = Math.max(1.3, Math.min(2.4, camY));

      camera.position.set(camX, camY, camZ);
      camera.lookAt(bX, targetY, bZ);
    } else {
      if (!isInitializedRef.current) {
        prevPlayerPosRef.current = { x: playerPos.x, z: playerPos.z };
        if (angles.theta === 0 && playerRef.current.rotation.y === 0) {
          angles.theta = Math.PI;
        }
        isInitializedRef.current = true;
      }

      const distMoved = Math.hypot(
        playerPos.x - prevPlayerPosRef.current.x,
        playerPos.z - prevPlayerPosRef.current.z
      );
      const isMoving = Boolean(
        playerRef.current?.userData?.isMoving ||
        (delta > 0 && distMoved / delta > 0.15)
      );
      prevPlayerPosRef.current = { x: playerPos.x, z: playerPos.z };

      if (!isDraggingRef.current && isMoving) {
        const playerRotY = playerRef.current.rotation.y;
        const targetTheta = playerRotY + Math.PI;
        let diff = targetTheta - angles.theta;
        diff = Math.atan2(Math.sin(diff), Math.cos(diff));

        if (Math.abs(diff) < 2.4) {
          const followSpeed = 2.8;
          const followFactor = 1.0 - Math.exp(-followSpeed * delta);
          angles.theta += diff * followFactor;
          angles.theta = Math.atan2(Math.sin(angles.theta), Math.cos(angles.theta));
        }

        const pitchRestoreSpeed = 1.2;
        const pitchDiff = GTA_OUTDOOR_BASE_PHI - angles.phi;
        angles.phi += pitchDiff * (1.0 - Math.exp(-pitchRestoreSpeed * delta));
      }

      const targetRadius = angles.radius && angles.radius >= 2.5 && angles.radius <= 6.0
        ? angles.radius
        : GTA_OUTDOOR_RADIUS;

      const currentPhi = Math.max(
        GTA_MIN_PHI,
        Math.min(GTA_MAX_PHI, angles.phi || GTA_OUTDOOR_BASE_PHI)
      );
      angles.phi = currentPhi;

      const targetY = GTA_TARGET_Y;
      const hDist = targetRadius * Math.sin(currentPhi);
      const desiredCamX = playerPos.x + hDist * Math.sin(angles.theta);
      const desiredCamZ = playerPos.z + hDist * Math.cos(angles.theta);

      const allowedDist = checkCameraBuildingCollision(
        playerPos.x,
        playerPos.z,
        desiredCamX,
        desiredCamZ,
        targetRadius
      );
      const effectiveTargetRadius = Math.min(
        targetRadius,
        Math.max(GTA_MIN_FOLLOW_RADIUS, allowedDist - 0.2)
      );

      const rSpeed = effectiveTargetRadius < smoothRadiusRef.current ? 12.0 : 4.0;
      smoothRadiusRef.current +=
        (effectiveTargetRadius - smoothRadiusRef.current) * (1.0 - Math.exp(-rSpeed * delta));

      const finalHDist = smoothRadiusRef.current * Math.sin(currentPhi);
      const camX = playerPos.x + finalHDist * Math.sin(angles.theta);
      let camY = targetY + smoothRadiusRef.current * Math.cos(currentPhi);
      const camZ = playerPos.z + finalHDist * Math.cos(angles.theta);

      camY = Math.max(GTA_MIN_CAMERA_Y, camY);

      camera.position.set(camX, camY, camZ);
      camera.lookAt(playerPos.x, targetY, playerPos.z);
    }
  });

  return null;
}
