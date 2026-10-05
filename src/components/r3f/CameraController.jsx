import { useEffect, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";

export function CameraController({
  playerRef,
  cameraAnglesRef,
  currentLocation,
  isDialogOpen
}) {
  const { camera } = useThree();
  const isDraggingRef = useRef(false);
  const prevMousePosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseDown = (e) => {
      if (isDialogOpen) return;
      isDraggingRef.current = true;
      prevMousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
      if (!isDraggingRef.current || isDialogOpen) return;
      const deltaX = e.clientX - prevMousePosRef.current.x;
      const deltaY = e.clientY - prevMousePosRef.current.y;
      const angles = cameraAnglesRef.current;
      angles.theta -= deltaX * 0.005;
      angles.phi -= deltaY * 0.005;
      angles.phi = Math.max(0.2, Math.min(Math.PI / 2 - 0.05, angles.phi));
      prevMousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDialogOpen, cameraAnglesRef]);

  useFrame(() => {
    if (!playerRef.current) return;

    const playerPos = playerRef.current.position;
    const { theta, phi, radius } = cameraAnglesRef.current;

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
      camera.position.x = playerPos.x + 1;
      camera.position.z = playerPos.z + 1;
      camera.position.y = 2.8;

      camera.lookAt(
        playerPos.x,
        1.5,
        playerPos.z - 3
      );
    }
  });

  return null;
}
