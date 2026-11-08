import test from "node:test";
import assert from "node:assert/strict";
import {
  computeJoystickAxes,
  combineMovementInputs,
  applyCameraRelativeVectors,
  DEFAULT_JOYSTICK_CONFIG
} from "./joystickLogic.js";

test("joystickLogic - computeJoystickAxes neutral and invalid inputs", () => {
  assert.equal(DEFAULT_JOYSTICK_CONFIG.maxRadius, 42);
  assert.equal(DEFAULT_JOYSTICK_CONFIG.deadZone, 0.15);

  // Null inputs return safe neutral
  assert.deepEqual(computeJoystickAxes(null, null), {
    x: 0,
    y: 0,
    knobX: 0,
    knobY: 0,
    distance: 0,
    rawDistance: 0,
    isActive: false
  });

  // Touch exactly at base center returns zero movement
  const center = { x: 100, y: 100 };
  const res = computeJoystickAxes({ x: 100, y: 100 }, center, 42, 0.15);
  assert.equal(res.x, 0);
  assert.equal(res.y, 0);
  assert.equal(res.knobX, 0);
  assert.equal(res.knobY, 0);
  assert.equal(res.distance, 0);
  assert.equal(res.isActive, true);
});

test("joystickLogic - computeJoystickAxes directional axes", () => {
  const center = { x: 100, y: 100 };
  const maxR = 40;
  const deadZone = 0.1; // 4px deadzone

  // Pull fully UP (screen Y = 50 -> dy = -50, dist > 40)
  const up = computeJoystickAxes({ x: 100, y: 50 }, center, maxR, deadZone);
  assert.ok(Math.abs(up.x) < 0.001, "Up should have zero lateral movement");
  assert.equal(up.y, 1.0, "Up should have full forward (+Y) output");
  assert.equal(up.knobX, 0);
  assert.equal(up.knobY, -40); // Knob clamped to -maxR

  // Pull fully DOWN (screen Y = 160 -> dy = 60, dist > 40)
  const down = computeJoystickAxes({ x: 100, y: 160 }, center, maxR, deadZone);
  assert.ok(Math.abs(down.x) < 0.001);
  assert.equal(down.y, -1.0, "Down should have full backward (-Y) output");
  assert.equal(down.knobY, 40);

  // Pull fully RIGHT (screen X = 160 -> dx = 60)
  const right = computeJoystickAxes({ x: 160, y: 100 }, center, maxR, deadZone);
  assert.equal(right.x, 1.0, "Right should have full positive lateral (+X) output");
  assert.ok(Math.abs(right.y) < 0.001);
  assert.equal(right.knobX, 40);

  // Pull fully LEFT (screen X = 40 -> dx = -60)
  const left = computeJoystickAxes({ x: 40, y: 100 }, center, maxR, deadZone);
  assert.equal(left.x, -1.0, "Left should have full negative lateral (-X) output");
  assert.ok(Math.abs(left.y) < 0.001);
  assert.equal(left.knobX, -40);
});

test("joystickLogic - computeJoystickAxes dead zone handling", () => {
  const center = { x: 100, y: 100 };
  const maxR = 40;
  const deadZone = 0.2; // 8px deadzone

  // Touch at 4px distance (inside 8px dead zone)
  const inside = computeJoystickAxes({ x: 103, y: 100 }, center, maxR, deadZone);
  assert.equal(inside.x, 0, "Inside dead zone X must be 0");
  assert.equal(inside.y, 0, "Inside dead zone Y must be 0");
  assert.equal(inside.distance, 0);
  assert.ok(inside.rawDistance > 0, "Raw distance should still be recorded");

  // Touch at 24px distance (beyond dead zone)
  const outside = computeJoystickAxes({ x: 124, y: 100 }, center, maxR, deadZone);
  assert.ok(outside.x > 0, "Beyond dead zone X must be positive");
  assert.ok(outside.distance > 0);
});

test("joystickLogic - combineMovementInputs normalizes diagonal speed boost", () => {
  // Keyboard W + D gives raw (1, 1), hypot = 1.414
  const res = combineMovementInputs({
    keys: { w: true, d: true },
    joystick: { x: 0, y: 0 }
  });

  assert.equal(res.isMoving, true);
  assert.equal(res.magnitude, 1.0, "Combined magnitude must not exceed 1.0");
  assert.ok(Math.abs(Math.hypot(res.moveX, res.moveY) - 1.0) < 0.001, "Length of normalized vector must be 1.0");
  assert.ok(res.moveX > 0 && res.moveY > 0, "Both axes must be positive");
});

test("joystickLogic - combineMovementInputs integrates joystick with keyboard seamlessly", () => {
  // Joystick alone (analog half speed forward)
  const joyOnly = combineMovementInputs({
    keys: {},
    joystick: { x: 0, y: 0.5 }
  });
  assert.equal(joyOnly.isMoving, true);
  assert.equal(joyOnly.magnitude, 0.5);
  assert.equal(joyOnly.moveY, 0.5);
  assert.equal(joyOnly.moveX, 0);

  // Joystick full + keyboard in opposite direction cancels cleanly
  const canceled = combineMovementInputs({
    keys: { s: true }, // -1
    joystick: { x: 0, y: 1.0 } // +1
  });
  assert.equal(canceled.isMoving, false);
  assert.equal(canceled.magnitude, 0);

  // Both active simultaneously clamp safely to max speed 1.0
  const clamped = combineMovementInputs({
    keys: { w: true }, // +1
    joystick: { x: 0, y: 0.8 } // +0.8 -> sum 1.8
  });
  assert.equal(clamped.isMoving, true);
  assert.equal(clamped.magnitude, 1.0);
  assert.equal(clamped.moveY, 1.0);
});

test("joystickLogic - combineMovementInputs enforces zero movement when dialogue or modals are open", () => {
  // Dialogue open stops all movement even if user presses keys or drags joystick
  const dialogBlocked = combineMovementInputs({
    keys: { w: true, d: true },
    joystick: { x: 1, y: 1 },
    isDialogOpen: true,
    hasModalOpen: false
  });
  assert.equal(dialogBlocked.isMoving, false);
  assert.equal(dialogBlocked.moveX, 0);
  assert.equal(dialogBlocked.moveY, 0);

  // Modal open stops all movement
  const modalBlocked = combineMovementInputs({
    keys: { w: true },
    joystick: { x: 0, y: 1 },
    isDialogOpen: false,
    hasModalOpen: true
  });
  assert.equal(modalBlocked.isMoving, false);
  assert.equal(modalBlocked.moveX, 0);
  assert.equal(modalBlocked.moveY, 0);
});

test("joystickLogic - applyCameraRelativeVectors maps inputs to world coords", () => {
  // When camera theta is 0 (looking towards -Z):
  // Forward (inputY = 1) -> worldMoveZ = -1, worldMoveX = 0
  const facingNorth = applyCameraRelativeVectors(0, 1, 0);
  assert.ok(Math.abs(facingNorth.worldMoveX) < 0.001);
  assert.ok(Math.abs(facingNorth.worldMoveZ - -1) < 0.001);

  // Right (inputX = 1) -> worldMoveX = 1, worldMoveZ = 0
  const strafeRight = applyCameraRelativeVectors(1, 0, 0);
  assert.ok(Math.abs(strafeRight.worldMoveX - 1) < 0.001);
  assert.ok(Math.abs(strafeRight.worldMoveZ) < 0.001);

  // When camera theta is PI / 2 (looking towards -X):
  // Forward (inputY = 1) -> worldMoveX = -1, worldMoveZ = 0
  const rotated = applyCameraRelativeVectors(0, 1, Math.PI / 2);
  assert.ok(Math.abs(rotated.worldMoveX - -1) < 0.001);
  assert.ok(Math.abs(rotated.worldMoveZ) < 0.001);
});
