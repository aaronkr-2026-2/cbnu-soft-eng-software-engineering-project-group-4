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
      const bX = currentLocation === "Shop" ? 0 : -12;
      const shoulderOffsetX = 0.7;
      const shoulderOffsetY = 1.45;

      let camX = playerPos.x + shoulderOffsetX + radius * 0.8 * Math.sin(theta);
      let camY = shoulderOffsetY + radius * 0.4 * Math.cos(phi);
      let camZ = playerPos.z + 1.25;

      camX = Math.max(bX - 3.4, Math.min(bX + 3.4, camX));
      camZ = Math.min(2.5, Math.max(-0.5, camZ));
      camY = Math.max(1.3, Math.min(2.5, camY));

      camera.position.set(camX, camY, camZ);
      camera.lookAt(bX, 1.35, -1.8);
    } else {
      let camX = playerPos.x + radius * Math.sin(phi) * Math.sin(theta);
      let camY = playerPos.y + radius * Math.cos(phi);
      let camZ = playerPos.z + radius * Math.sin(phi) * Math.cos(theta);

      camera.position.set(camX, camY, camZ);
      camera.lookAt(playerPos.x, playerPos.y + 0.9, playerPos.z);
    }
  });

  return null;
}
