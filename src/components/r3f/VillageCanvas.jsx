import React, { Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
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
import { resolveActiveQualityConfig } from "../../services/renderingQualityEngine";

/**
 * PerformanceMonitor: Hooks into R3F frame loop to drive dynamic FPS adaptation
 * and expose real-time WebGL metrics (draw calls, triangles) for diagnosis.
 */
function PerformanceMonitor({ fpsAdapter }) {
  const { gl } = useThree();

  useFrame((_, delta) => {
    if (fpsAdapter) {
      fpsAdapter.update(delta);
    }

    if (typeof window !== "undefined") {
      window.__THREE_PERF__ = {
        calls: gl.info?.render?.calls ?? 0,
        triangles: gl.info?.render?.triangles ?? 0,
        geometries: gl.info?.memory?.geometries ?? 0,
        textures: gl.info?.memory?.textures ?? 0,
        programs: gl.info?.programs?.length ?? 0
      };
    }
  });

  return null;
}

export function VillageCanvas({
  playerRef,
  cameraAnglesRef,
  currentLocation,
  isDialogOpen,
  hasModalOpen,
  isTalking,
  shopItems,
  collectedItemIds,
  onPickupItem,
  onPromptChange,
  onInteractDoor,
  onInteractNPC,
  joystickVecRef,
  recenterSignalRef,
  qualityConfig = null,
  fpsAdapter = null
}) {
  const quality = qualityConfig || resolveActiveQualityConfig();
  const enableShadows = Boolean(quality.shadows);

  return (
    <Canvas
      dpr={quality.dpr}
      shadows={enableShadows}
      camera={{ fov: 70, position: [0, 5, 10], near: 0.1, far: 1000 }}
      gl={{
        antialias: quality.activeTier !== "low",
        powerPreference: quality.activeTier === "low" ? "low-power" : "high-performance",
        stencil: false,
        depth: true
      }}
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        outline: "none"
      }}
    >
      {/* Dynamic FPS Adapter & Diagnostics */}
      <PerformanceMonitor fpsAdapter={fpsAdapter} />

      {/* Osmon foni va adaptiv masofaviy atmosfera tuman */}
      <color attach="background" args={["#87ceeb"]} />
      <fog attach="fog" args={["#87ceeb", quality.fogNear, quality.fogFar]} />

      {/* Yorug'lik va adaptiv toza soya */}
      <ambientLight intensity={0.95} />
      <directionalLight
        position={[10, 25, 10]}
        intensity={quality.directionalLightIntensity}
        castShadow={enableShadows}
        shadow-bias={quality.enableShadowAcneFilter ? -0.0005 : -0.001}
        shadow-normalBias={quality.enableShadowAcneFilter ? 0.04 : 0.0}
        shadow-mapSize-width={quality.shadowMapSize}
        shadow-mapSize-height={quality.shadowMapSize}
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
          <Environment enableShadows={enableShadows} />
          <VillageBuildings enableShadows={enableShadows} />
          <Traffic isOutside={currentLocation === "outside"} />
        </group>
        <Shop
          isTalking={isTalking}
          currentLocation={currentLocation}
          shopItems={shopItems}
          collectedItemIds={collectedItemIds}
        />
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
          shopItems={shopItems}
          collectedItemIds={collectedItemIds}
          onPromptChange={onPromptChange}
          onInteractDoor={onInteractDoor}
          onInteractNPC={onInteractNPC}
          onPickupItem={onPickupItem}
          joystickVecRef={joystickVecRef}
        />
        <CameraController
          playerRef={playerRef}
          cameraAnglesRef={cameraAnglesRef}
          currentLocation={currentLocation}
          isDialogOpen={isDialogOpen}
          hasModalOpen={hasModalOpen}
          recenterSignalRef={recenterSignalRef}
        />
      </Suspense>
    </Canvas>
  );
}
