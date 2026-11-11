import { useEffect, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import {
  GTA_OUTDOOR_RADIUS,
  GTA_OUTDOOR_BASE_PHI,
  GTA_MIN_PHI,
  GTA_MAX_PHI,
  GTA_TARGET_Y,
  GTA_MIN_CAMERA_Y,
  GTA_MIN_FOLLOW_RADIUS,
  checkCameraBuildingCollision,
  findSafeCameraAngle,
  resolveCameraBuildingPenetration
} from "../../services/cameraCollisionLogic.js";


export function CameraController({
  playerRef,
  cameraAnglesRef,
  currentLocation,
  isDialogOpen,
  hasModalOpen = false
}) {
  const { camera } = useThree();
  const isDraggingRef = useRef(false);
  const prevMousePosRef = useRef({ x: 0, y: 0 });
  const isTouchDraggingRef = useRef(false);
  const activeTouchIdRef = useRef(null);
  const prevTouchPosRef = useRef({ x: 0, y: 0 });
  const currentLocationRef = useRef(currentLocation);
  const lastLocationRef = useRef(currentLocation);
  const prevPlayerPosRef = useRef({ x: 0, z: 0 });
  const smoothRadiusRef = useRef(GTA_OUTDOOR_RADIUS);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    currentLocationRef.current = currentLocation;
  }, [currentLocation]);

  useEffect(() => {
    const handleMouseDown = (e) => {
      if (isDialogOpen || hasModalOpen) return;
      if (e.button !== 0) return;
      if (
        e.target &&
        (e.target.tagName === "BUTTON" ||
          e.target.tagName === "INPUT" ||
          e.target.closest("button") ||
          e.target.closest("input") ||
          e.target.closest("[role='dialog']") ||
          e.target.closest("[role='toolbar']") ||
          e.target.closest("[data-touch-ignore]"))
      ) {
        return;
      }
      isDraggingRef.current = true;
      prevMousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
      if (!isDraggingRef.current || isDialogOpen || hasModalOpen) return;
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

    const handleTouchStart = (e) => {
      if (isDialogOpen || hasModalOpen) return;
      if (e.touches && e.touches.length > 1) {
        // Multi-touch gesture (e.g. pinch) - do not rotate camera
        activeTouchIdRef.current = null;
        isTouchDraggingRef.current = false;
        return;
      }
      if (activeTouchIdRef.current !== null) return;
      const touch = e.changedTouches[0];
      if (!touch) return;

      const target = e.target;
      if (
        target &&
        (target.tagName === "BUTTON" ||
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.closest("button") ||
          target.closest("input") ||
          target.closest("textarea") ||
          target.closest("[role='dialog']") ||
          target.closest("[role='toolbar']") ||
          target.closest(".hud-container") ||
          target.closest(".minimap-container") ||
          target.closest(".mobile-joystick") ||
          target.closest(".mobile-action-buttons") ||
          target.closest(".interaction-prompt-btn") ||
          target.closest("[data-touch-ignore]"))
      ) {
        return;
      }

      activeTouchIdRef.current = touch.identifier;
      isTouchDraggingRef.current = true;
      prevTouchPosRef.current = { x: touch.clientX, y: touch.clientY };
    };

    const handleTouchMove = (e) => {
      if (!isTouchDraggingRef.current || isDialogOpen || hasModalOpen || activeTouchIdRef.current === null) return;
      if (e.touches && e.touches.length > 1) {
        // Interrupted by second finger - cancel camera drag to prevent sudden jumps
        activeTouchIdRef.current = null;
        isTouchDraggingRef.current = false;
        return;
      }
      let matchedTouch = null;
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === activeTouchIdRef.current) {
          matchedTouch = e.changedTouches[i];
          break;
        }
      }
      if (!matchedTouch) return;

      const deltaX = matchedTouch.clientX - prevTouchPosRef.current.x;
      const deltaY = matchedTouch.clientY - prevTouchPosRef.current.y;
      prevTouchPosRef.current = { x: matchedTouch.clientX, y: matchedTouch.clientY };

      const angles = cameraAnglesRef.current;
      if (currentLocationRef.current === "outside") {
        angles.theta -= deltaX * 0.005;
        angles.theta = Math.atan2(Math.sin(angles.theta), Math.cos(angles.theta));

        angles.phi += deltaY * 0.005;
        angles.phi = Math.max(GTA_MIN_PHI, Math.min(GTA_MAX_PHI, angles.phi));
      } else {
        angles.theta -= deltaX * 0.006;
        angles.phi -= deltaY * 0.006;
        angles.phi = Math.max(0.2, Math.min(Math.PI / 2 - 0.05, angles.phi));
      }
    };

    const handleTouchEnd = (e) => {
      if (activeTouchIdRef.current === null) return;
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === activeTouchIdRef.current) {
          activeTouchIdRef.current = null;
          isTouchDraggingRef.current = false;
          break;
        }
      }
    };

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("blur", handleMouseUp);
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("touchcancel", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("blur", handleMouseUp);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, [isDialogOpen, hasModalOpen, cameraAnglesRef]);

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
        // Language School classroom interior: X in [-24.1, -19.9], Z in [36.4, 39.6]
        // Teacher Olivia is at X = -22.0, Z = 37.0
        // Clamping camZ to [37.6, 39.6] keeps the camera securely inside the classroom
        bX = -22.0;
        bZ = 37.0;
        targetY = 1.32;
        minZ = 37.6;
        maxZ = 39.6;
        minX = -23.8;
        maxX = -20.2;
        camZOffset = 1.15;
        shoulderOffsetX = 0.55;
        shoulderOffsetY = 1.45;
      } else if (currentLocation === "StudyCenter") {
        // Study Center interior: X in [-11.6, -7.4], Z in [36.4, 39.6]
        // Tutor Daniel is at X = -9.5, Z = 37.2
        // Clamping camZ to [37.6, 39.6] keeps the camera securely inside the room
        bX = -9.5;
        bZ = 37.2;
        targetY = 1.32;
        minZ = 37.6;
        maxZ = 39.6;
        minX = -11.3;
        maxX = -7.7;
        camZOffset = 1.15;
        shoulderOffsetX = 0.55;
        shoulderOffsetY = 1.45;
      } else if (currentLocation === "CommunityCenter") {
        // Community Center interior: X in [7.2, 11.8], Z in [36.4, 39.8]
        // Staff Mina is at X = 9.5, Z = 37.2
        // Clamping camZ to [37.6, 39.5] keeps the camera inside the civic hall
        bX = 9.5;
        bZ = 37.2;
        targetY = 1.32;
        minZ = 37.6;
        maxZ = 39.5;
        minX = 7.7;
        maxX = 11.3;
        camZOffset = 1.15;
        shoulderOffsetX = 0.55;
        shoulderOffsetY = 1.45;
      } else if (currentLocation === "CareerCenter") {
        // Career Center interior: X in [19.7, 24.3], Z in [36.2, 39.9]
        // Career Counselor James is at X = 22.0, Z = 37.2
        // Clamping camZ to [37.6, 39.5] keeps the camera inside the counseling office
        bX = 22.0;
        bZ = 37.2;
        targetY = 1.32;
        minZ = 37.6;
        maxZ = 39.5;
        minX = 20.2;
        maxX = 23.8;
        camZOffset = 1.15;
        shoulderOffsetX = 0.55;
        shoulderOffsetY = 1.45;
      } else if (currentLocation === "ActivityCenter") {
        // Activity Center interior: X in [-18.4, -13.6], Z in [46.8, 50.2]
        // Coordinator Hana is at X = -16.0, Z = 47.7
        // Clamping camZ to [48.1, 49.8] keeps camera inside the activity hall
        bX = -16.0;
        bZ = 47.7;
        targetY = 1.32;
        minZ = 48.1;
        maxZ = 49.8;
        minX = -17.9;
        maxX = -14.1;
        camZOffset = 1.15;
        shoulderOffsetX = 0.55;
        shoulderOffsetY = 1.45;
      } else if (currentLocation === "MultiPurposeHall") {
        // Multi-Purpose Hall interior: X in [13.9, 18.1], Z in [46.3, 50.7]
        // Coordinator Yuri is at X = 16.0, Z = 48.7
        // Clamping camZ to [48.0, 50.0], camX to [14.4, 17.6] keeps camera safely inside the hall
        bX = 16.0;
        bZ = 48.7;
        targetY = 1.32;
        minZ = 48.0;
        maxZ = 50.0;
        minX = 14.4;
        maxX = 17.6;
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

      if (!isDraggingRef.current && !isTouchDraggingRef.current && isMoving) {
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

      // When transitioning to outside from an interior, immediately resolve safe angle and distance
      if (currentLocation !== lastLocationRef.current) {
        if (currentLocation === "outside") {
          const initHDist = targetRadius * Math.sin(currentPhi);
          const initCamX = playerPos.x + initHDist * Math.sin(angles.theta);
          const initCamZ = playerPos.z + initHDist * Math.cos(angles.theta);
          const initAllowed = checkCameraBuildingCollision(
            playerPos.x,
            playerPos.z,
            initCamX,
            initCamZ,
            targetRadius
          );
          if (initAllowed < 1.6) {
            angles.theta = findSafeCameraAngle(
              playerPos.x,
              playerPos.z,
              angles.theta,
              currentPhi,
              targetRadius
            );
          }
          const safeHDist = targetRadius * Math.sin(currentPhi);
          const safeCamX = playerPos.x + safeHDist * Math.sin(angles.theta);
          const safeCamZ = playerPos.z + safeHDist * Math.cos(angles.theta);
          const safeAllowed = checkCameraBuildingCollision(
            playerPos.x,
            playerPos.z,
            safeCamX,
            safeCamZ,
            targetRadius
          );
          smoothRadiusRef.current = Math.min(
            targetRadius,
            Math.max(GTA_MIN_FOLLOW_RADIUS, safeAllowed - 0.25)
          );
        }
        lastLocationRef.current = currentLocation;
      }

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

      // If camera line-of-sight is blocked by a building and user is not manually rotating,
      // search for a clear azimuth angle to keep player and surrounding area unobstructed
      if (allowedDist < 1.4 && !isDraggingRef.current && !isTouchDraggingRef.current) {
        const safeTheta = findSafeCameraAngle(
          playerPos.x,
          playerPos.z,
          angles.theta,
          currentPhi,
          targetRadius
        );
        if (safeTheta !== angles.theta) {
          let angleDiff = safeTheta - angles.theta;
          angleDiff = Math.atan2(Math.sin(angleDiff), Math.cos(angleDiff));
          const blendSpeed = 4.0;
          angles.theta += angleDiff * (1.0 - Math.exp(-blendSpeed * delta));
          angles.theta = Math.atan2(Math.sin(angles.theta), Math.cos(angles.theta));
        }
      }

      const effectiveTargetRadius = Math.min(
        targetRadius,
        Math.max(GTA_MIN_FOLLOW_RADIUS, allowedDist - 0.25)
      );

      // Pull in immediately upon hitting an obstruction so camera never penetrates walls.
      // Push back out smoothly when obstruction disappears.
      if (effectiveTargetRadius < smoothRadiusRef.current) {
        smoothRadiusRef.current = effectiveTargetRadius;
      } else {
        const restoreSpeed = 4.0;
        smoothRadiusRef.current +=
          (effectiveTargetRadius - smoothRadiusRef.current) * (1.0 - Math.exp(-restoreSpeed * delta));
      }

      const finalHDist = smoothRadiusRef.current * Math.sin(currentPhi);
      let camX = playerPos.x + finalHDist * Math.sin(angles.theta);
      let camY = targetY + smoothRadiusRef.current * Math.cos(currentPhi);
      let camZ = playerPos.z + finalHDist * Math.cos(angles.theta);

      // Slightly elevate camera when pulled in close to wall for clear view over shoulder
      const closeFactor = Math.max(0, (1.8 - smoothRadiusRef.current) / 1.4);
      camY += closeFactor * 0.45;
      camY = Math.max(GTA_MIN_CAMERA_Y, camY);

      // Failsafe: guarantee camera position is never inside any building geometry
      const resolved = resolveCameraBuildingPenetration(camX, camZ, 0.2);
      camX = resolved.camX;
      camZ = resolved.camZ;

      camera.position.set(camX, camY, camZ);
      camera.lookAt(playerPos.x, targetY, playerPos.z);
    }
  });

  return null;
}
