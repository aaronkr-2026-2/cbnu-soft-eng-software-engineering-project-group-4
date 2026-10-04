import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment } from "./Environment";
import { Traffic } from "./Traffic";
import { Shop } from "./Shop";
import { Cafe } from "./Cafe";
import { Player } from "./Player";
import { CameraController } from "./CameraController";

export function VillageCanvas({
  playerRef,
  cameraAnglesRef,
  currentLocation,
  isDialogOpen,
  hasModalOpen,
  isTalking,
  onPromptChange,
  onInteractDoor,
  onInteractNPC
}) {
  return (
    <Canvas
      shadows
      camera={{ fov: 70, position: [0, 5, 10], near: 0.1, far: 1000 }}
      style={{
        width: "100vw",
        height: "100vh",
        position: "absolute",
        top: 0,
        left: 0,
        outline: "none"
      }}
    >
      {/* Osmon foni */}
      <color attach="background" args={["#87ceeb"]} />

      {/* Yorug'lik va toza soya (Shadow acne-siz) */}
      <ambientLight intensity={0.95} />
      <directionalLight
        position={[10, 25, 10]}
        intensity={1.25}
        castShadow
        shadow-bias={-0.0005}
        shadow-normalBias={0.04}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={60}
        shadow-camera-left={-25}
        shadow-camera-right={25}
        shadow-camera-top={25}
        shadow-camera-bottom={-25}
      />

      {/* Suspense: barcha GLTF modellarni xavfsiz yuklash */}
      <Suspense fallback={null}>
        <Environment />
        <Traffic isOutside={currentLocation === "outside"} />
        <Shop isTalking={isTalking} currentLocation={currentLocation} />
        <Cafe isTalking={isTalking} currentLocation={currentLocation} />

        <Player
          playerRef={playerRef}
          cameraAnglesRef={cameraAnglesRef}
          currentLocation={currentLocation}
          isDialogOpen={isDialogOpen}
          hasModalOpen={hasModalOpen}
          onPromptChange={onPromptChange}
          onInteractDoor={onInteractDoor}
          onInteractNPC={onInteractNPC}
        />
        <CameraController
          playerRef={playerRef}
          cameraAnglesRef={cameraAnglesRef}
          currentLocation={currentLocation}
          isDialogOpen={isDialogOpen}
        />
      </Suspense>
    </Canvas>
  );
}
