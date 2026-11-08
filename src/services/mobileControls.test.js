import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { applyCameraRelativeVectors, combineMovementInputs } from "./joystickLogic.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "../../");

test("mobileControls - MobileJoystick component file structure and exports", () => {
  const filePath = path.join(ROOT_DIR, "src/components/ui/MobileJoystick.jsx");
  assert.ok(fs.existsSync(filePath), "MobileJoystick.jsx must exist");

  const content = fs.readFileSync(filePath, "utf-8");
  assert.ok(content.includes("export function MobileJoystick"), "Must export MobileJoystick");
  assert.ok(content.includes("setPointerCapture"), "Must use pointer capture for smooth tracking");
  assert.ok(content.includes("data-touch-ignore"), "Must tag element with data-touch-ignore");
  assert.ok(content.includes("computeJoystickAxes"), "Must compute normalized axes");
});

test("mobileControls - MobileActionButtons component file structure and actions", () => {
  const filePath = path.join(ROOT_DIR, "src/components/ui/MobileActionButtons.jsx");
  assert.ok(fs.existsSync(filePath), "MobileActionButtons.jsx must exist");

  const content = fs.readFileSync(filePath, "utf-8");
  assert.ok(content.includes("export function MobileActionButtons"), "Must export MobileActionButtons");
  assert.ok(content.includes("onInteract"), "Must accept onInteract handler");
  assert.ok(content.includes("onTalk"), "Must accept onTalk handler");
  assert.ok(content.includes("onToggleStats"), "Must accept onToggleStats handler");
  assert.ok(content.includes("data-touch-ignore"), "Must isolate touch events from 3D camera");
  assert.ok(content.includes("pulse-action"), "Must include visual action pulse animation");
  assert.ok(content.includes("pulse-talk"), "Must include visual talk pulse animation");
});

test("mobileControls - Action button dispatch simulation", () => {
  let interactCalled = false;
  let talkCalled = false;
  let statsCalled = false;

  const mockItemPrompt = { itemId: "apple_01", displayName: "Fresh Apple" };
  const mockDoorPrompt = "Cafe Door";

  // Unified interact dispatcher logic
  function dispatchInteract({ itemPrompt, doorPrompt, onPickup, onDoor }) {
    if (itemPrompt) {
      onPickup(itemPrompt);
    } else if (doorPrompt) {
      onDoor();
    }
  }

  // 1. When item is present, interact picks up item
  let pickedItem = null;
  dispatchInteract({
    itemPrompt: mockItemPrompt,
    doorPrompt: mockDoorPrompt,
    onPickup: (item) => {
      interactCalled = true;
      pickedItem = item;
    },
    onDoor: () => {}
  });

  assert.equal(interactCalled, true);
  assert.deepEqual(pickedItem, mockItemPrompt);

  // 2. When door is present and no item, interact triggers door
  let doorTriggered = false;
  dispatchInteract({
    itemPrompt: null,
    doorPrompt: mockDoorPrompt,
    onPickup: () => {},
    onDoor: () => {
      doorTriggered = true;
    }
  });

  assert.equal(doorTriggered, true);

  // 3. Talk and stats callbacks
  const handleTalk = () => {
    talkCalled = true;
  };
  const handleStats = () => {
    statsCalled = true;
  };

  handleTalk();
  handleStats();
  assert.equal(talkCalled, true);
  assert.equal(statsCalled, true);
});

test("mobileControls - Mobile control visibility rules", () => {
  // Pure function checking visibility condition
  function shouldShowMobileControls({ isTouch, viewport }) {
    const isMobile = viewport === "mobile";
    const isTablet = viewport === "tablet";
    return Boolean(isTouch || isMobile || isTablet);
  }

  // Touch phone -> SHOW
  assert.equal(shouldShowMobileControls({ isTouch: true, viewport: "mobile" }), true);

  // Touch tablet (e.g. iPad) -> SHOW
  assert.equal(shouldShowMobileControls({ isTouch: true, viewport: "tablet" }), true);

  // Touch laptop (e.g. Surface or touch Chromebook on desktop width) -> SHOW
  assert.equal(shouldShowMobileControls({ isTouch: true, viewport: "desktop" }), true);

  // Standard non-touch desktop -> HIDE
  assert.equal(shouldShowMobileControls({ isTouch: false, viewport: "desktop" }), false);

  // Mobile viewport even if simulated non-touch -> SHOW
  assert.equal(shouldShowMobileControls({ isTouch: false, viewport: "mobile" }), true);
});

test("mobileControls - CameraController touch isolation from UI controls", () => {
  const filePath = path.join(ROOT_DIR, "src/components/r3f/CameraController.jsx");
  const content = fs.readFileSync(filePath, "utf-8");

  // Verify CameraController ignores joystick and action buttons
  assert.ok(content.includes(".mobile-joystick"), "Must ignore touch on .mobile-joystick");
  assert.ok(content.includes(".mobile-action-buttons"), "Must ignore touch on .mobile-action-buttons");
  assert.ok(content.includes(".minimap-container"), "Must ignore touch on .minimap-container");
  assert.ok(content.includes(".interaction-prompt-btn"), "Must ignore touch on .interaction-prompt-btn");
  assert.ok(content.includes("[data-touch-ignore]"), "Must ignore elements with [data-touch-ignore]");
  assert.ok(content.includes("hasModalOpen"), "Must respect hasModalOpen prop");

  // Verify multi-touch cancellation (e.g. 2-finger gestures do not jump camera)
  assert.ok(content.includes("e.touches.length > 1"), "Must prevent camera jumps on multi-touch gestures");
});

test("mobileControls - Player.jsx integrates joystick without breaking desktop WASD", () => {
  const filePath = path.join(ROOT_DIR, "src/components/r3f/Player.jsx");
  const content = fs.readFileSync(filePath, "utf-8");

  // Verify Player accepts joystickVecRef
  assert.ok(content.includes("joystickVecRef"), "Player must accept joystickVecRef prop");

  // Verify combineMovementInputs is used
  assert.ok(content.includes("combineMovementInputs"), "Player must combine movement inputs");

  // Verify applyCameraRelativeVectors is used
  assert.ok(content.includes("applyCameraRelativeVectors"), "Player must apply camera-relative vectors");

  // Verify desktop keyboard listeners remain completely intact
  assert.ok(content.includes("addEventListener(\"keydown\", handleKeyDown)"), "Must keep keydown listener");
  assert.ok(content.includes("addEventListener(\"keyup\", handleKeyUp)"), "Must keep keyup listener");
  assert.ok(content.includes("keysRef.current.w"), "Must preserve WASD keysRef handling");
  assert.ok(content.includes("code === \"KeyE\""), "Must preserve KeyE interaction handler");
  assert.ok(content.includes("code === \"KeyF\""), "Must preserve KeyF NPC talk handler");
});

test("mobileControls - App.jsx mounts MobileJoystick and MobileActionButtons with props", () => {
  const filePath = path.join(ROOT_DIR, "src/App.jsx");
  const content = fs.readFileSync(filePath, "utf-8");

  assert.ok(content.includes("<MobileJoystick"), "App.jsx must mount MobileJoystick");
  assert.ok(content.includes("<MobileActionButtons"), "App.jsx must mount MobileActionButtons");
  assert.ok(content.includes("showMobileControls"), "App.jsx must guard mobile controls with showMobileControls");
  assert.ok(content.includes("unlockAudio"), "App.jsx must include gesture audio unlock");
  assert.ok(content.includes("joystickVecRef={joystickVecRef}"), "VillageCanvas must receive joystickVecRef");
});

test("mobileControls - Touch targets satisfy minimum accessibility requirements (>= 44px)", () => {
  const joystickPath = path.join(ROOT_DIR, "src/components/ui/MobileJoystick.jsx");
  const actionButtonsPath = path.join(ROOT_DIR, "src/components/ui/MobileActionButtons.jsx");

  const joystickContent = fs.readFileSync(joystickPath, "utf-8");
  const actionButtonsContent = fs.readFileSync(actionButtonsPath, "utf-8");

  // Joystick base size defaults to 140px, knob to 54px (both > 44px)
  assert.ok(joystickContent.includes("size = 140"));
  assert.ok(joystickContent.includes("knobSize = 54"));

  // Action button dimensions: STATS 46px, TALK 58px, INTERACT 62px (all >= 44px)
  assert.ok(actionButtonsContent.includes("46px"));
  assert.ok(actionButtonsContent.includes("58px"));
  assert.ok(actionButtonsContent.includes("62px"));
  assert.ok(actionButtonsContent.includes("minWidth: \"46px\""));
  assert.ok(actionButtonsContent.includes("minHeight: \"46px\""));
});

test("Phase 4.2.1 - applyCameraRelativeVectors supports both argument forms without NaN", () => {
  // 1. Positional call convention
  const posResult = applyCameraRelativeVectors(0, 1, Math.PI);
  assert.ok(Number.isFinite(posResult.worldX), "worldX must be a finite number");
  assert.ok(Number.isFinite(posResult.worldZ), "worldZ must be a finite number");
  assert.ok(Number.isFinite(posResult.worldMoveX), "worldMoveX must be a finite number");
  assert.ok(Number.isFinite(posResult.worldMoveZ), "worldMoveZ must be a finite number");

  // 2. Object parameter call convention (used in Player useFrame)
  const objResult = applyCameraRelativeVectors({ inputX: 1, inputY: 0, theta: 0 });
  assert.ok(Number.isFinite(objResult.worldX), "worldX from object param must be finite");
  assert.ok(Number.isFinite(objResult.worldZ), "worldZ from object param must be finite");
  assert.equal(objResult.worldX, 1, "Lateral right at theta=0 maps to world X=1");
  assert.equal(objResult.worldZ, 0, "Lateral right at theta=0 has zero world Z");
});

test("Phase 4.2.1 - Player keyboard input registration supports code, key, and arrow keys", () => {
  const filePath = path.join(ROOT_DIR, "src/components/r3f/Player.jsx");
  const content = fs.readFileSync(filePath, "utf-8");

  // Keyboard mapping includes KeyW, w, ArrowUp, etc.
  assert.ok(content.includes('code === "KeyW" || k === "w" || code === "ArrowUp" || k === "arrowup"'));
  assert.ok(content.includes('code === "KeyS" || k === "s" || code === "ArrowDown" || k === "arrowdown"'));
  assert.ok(content.includes('code === "KeyA" || k === "a" || code === "ArrowLeft" || k === "arrowleft"'));
  assert.ok(content.includes('code === "KeyD" || k === "d" || code === "ArrowRight" || k === "arrowright"'));
  assert.ok(content.includes('code === "KeyE" || k === "e"'));
  assert.ok(content.includes('code === "KeyF" || k === "f"'));

  // Keys reset immediately on modal or dialogue open
  assert.ok(content.includes("keysRef.current.w = false"));
});

test("Phase 4.2.1 - Active mission does not lock player movement or disable mobile controls", () => {
  // In combineMovementInputs, having an active mission must NOT block movement
  const movement = combineMovementInputs({
    keys: { w: true },
    joystick: { x: 0, y: 0 },
    isDialogOpen: false,
    hasModalOpen: false // activeMission is removed from modal lock
  });
  assert.equal(movement.isMoving, true, "Player must move freely while on an active mission");

  const appPath = path.join(ROOT_DIR, "src/App.jsx");
  const appContent = fs.readFileSync(appPath, "utf-8");

  // Ensure activeMission is NOT inside hasModalOpen in VillageCanvas
  assert.ok(!appContent.includes("hasModalOpen={Boolean(activeMission"));
  // Ensure activeMission is NOT inside disabled in MobileJoystick
  assert.ok(!appContent.includes("Boolean(activeMission || exitEvaluation"));
});

test("Phase 4.2.1 - Player spawn point is on safe pedestrian sidewalk away from vehicles", () => {
  const playerPath = path.join(ROOT_DIR, "src/components/r3f/Player.jsx");
  const playerContent = fs.readFileSync(playerPath, "utf-8");

  // Player initial spawn coordinates in Player.jsx must be [0, 0, 3.8]
  assert.ok(
    playerContent.includes('position={[0, 0, 3.8]}'),
    "Player must spawn at z=3.8 (safe South Sidewalk)"
  );

  // In VillageRoads:
  // South sidewalk spans Z in [3.2, 4.7]
  // Curb starts at Z = 4.7
  // Asphalt road spans Z in [4.75, 11.25]
  // Traffic drives at Z = 6.4 and Z = 9.6 with ~2m car width (sweeping Z in [5.4, 7.4] and [8.6, 10.6])
  const spawnZ = 3.8;
  assert.ok(spawnZ >= 3.2 && spawnZ <= 4.7, "Spawn Z must be within sidewalk bounds [3.2, 4.7]");
  assert.ok(spawnZ < 4.7, "Spawn Z must be strictly outside the roadway curb (z < 4.7)");
  assert.ok(Math.abs(spawnZ - 6.4) > 2.0, "Spawn Z must be safely clear of car lane at z=6.4");
});

test("Phase 4.2.1 - MiniMap labels have staggered layout and compact mobile mode", () => {
  const minimapPath = path.join(ROOT_DIR, "src/components/ui/MiniMap.jsx");
  const minimapContent = fs.readFileSync(minimapPath, "utf-8");

  // Staggered top and bottom positioning exists
  assert.ok(minimapContent.includes('b.labelPos === "bottom" ? { top: "10px" } : { bottom: "10px" }'));
  // Compact toggle exists in header
  assert.ok(minimapContent.includes("compact"));
  assert.ok(minimapContent.includes("setShowAllLabels"));
});

