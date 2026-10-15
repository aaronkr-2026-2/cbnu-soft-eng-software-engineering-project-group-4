import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment } from "./Environment";
import { VillageBuildings } from "./VillageBuildings";
import { Traffic } from "./Traffic";
import { Shop } from "./Shop";
import { Cafe } from "./Cafe";
import { Hotel } from "./Hotel";
import { Hospital } from "./Hospital";
import { Bank } from "./Bank";
import { Library } from "./Library";
import { PoliceStation } from "./PoliceStation";
import { LanguageSchool } from "./LanguageSchool";
import { StudyCenter } from "./StudyCenter";
import { CommunityCenter } from "./CommunityCenter";
import { CareerCenter } from "./CareerCenter";
import { ActivityCenter } from "./ActivityCenter";
import { MultiPurposeHall } from "./MultiPurposeHall";
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
      dpr={[1, 1.5]}
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
      {/* Osmon foni va masofaviy atmosfera tuman */}
      <color attach="background" args={["#87ceeb"]} />
      <fog attach="fog" args={["#87ceeb", 90, 320]} />

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
        {/* Outdoor scene stays mounted and is only hidden indoors, so exiting a
            building no longer re-clones models, re-creates sign textures, or
            re-uploads everything to the GPU in a single frame. */}
        <group visible={currentLocation === "outside"}>
          <Environment />
          <VillageBuildings />
          <Traffic isOutside={currentLocation === "outside"} />
        </group>
        <Shop isTalking={isTalking} currentLocation={currentLocation} />
        <Cafe isTalking={isTalking} currentLocation={currentLocation} />
        <Hotel isTalking={isTalking} currentLocation={currentLocation} />
        <Hospital isTalking={isTalking} currentLocation={currentLocation} />
        <Bank isTalking={isTalking} currentLocation={currentLocation} />
        <Library isTalking={isTalking} currentLocation={currentLocation} />
        <PoliceStation isTalking={isTalking} currentLocation={currentLocation} />
        <LanguageSchool isTalking={isTalking} currentLocation={currentLocation} />
        <StudyCenter isTalking={isTalking} currentLocation={currentLocation} />
        <CommunityCenter isTalking={isTalking} currentLocation={currentLocation} />
        <CareerCenter isTalking={isTalking} currentLocation={currentLocation} />
        <ActivityCenter isTalking={isTalking} currentLocation={currentLocation} />
        <MultiPurposeHall isTalking={isTalking} currentLocation={currentLocation} />

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
