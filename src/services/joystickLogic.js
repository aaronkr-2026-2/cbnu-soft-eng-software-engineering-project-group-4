/**
 * joystickLogic.js
 * Pure functions for virtual joystick vector calculation, dead zone filtering,
 * diagonal speed normalization, and camera-relative vector mapping.
 */

export const DEFAULT_JOYSTICK_CONFIG = {
  maxRadius: 42,      // Maximum travel distance of joystick thumb in pixels
  deadZone: 0.15      // Fractional dead zone (15% of maxRadius)
};

/**
 * Computes normalized joystick axes and knob pixel coordinates from touch/pointer position.
 *
 * Coordinate system:
 * - Output X: [-1, 1] (left is negative, right is positive)
 * - Output Y: [-1, 1] (backward/down is negative, forward/up is positive)
 *
 * @param {{ x: number, y: number }} touchPos - Current pointer client position
 * @param {{ x: number, y: number }} baseCenter - Center of the joystick base in client coordinates
 * @param {number} [maxRadius] - Maximum travel radius in pixels
 * @param {number} [deadZone] - Fraction of maxRadius below which movement is zero
 * @returns {{
 *   x: number,
 *   y: number,
 *   knobX: number,
 *   knobY: number,
 *   distance: number,
 *   rawDistance: number,
 *   isActive: boolean
 * }}
 */
export function computeJoystickAxes(
  touchPos,
  baseCenter,
  maxRadius = DEFAULT_JOYSTICK_CONFIG.maxRadius,
  deadZone = DEFAULT_JOYSTICK_CONFIG.deadZone
) {
  if (!touchPos || !baseCenter || typeof maxRadius !== "number" || maxRadius <= 0) {
    return { x: 0, y: 0, knobX: 0, knobY: 0, distance: 0, rawDistance: 0, isActive: false };
  }

  const dx = touchPos.x - baseCenter.x;
  const dy = touchPos.y - baseCenter.y;
  const rawDist = Math.hypot(dx, dy);

  if (rawDist < 0.001) {
    return { x: 0, y: 0, knobX: 0, knobY: 0, distance: 0, rawDistance: 0, isActive: true };
  }

  const deadZonePixels = maxRadius * Math.max(0, Math.min(0.9, deadZone));

  // Clamped pixel travel
  const clampedDist = Math.min(rawDist, maxRadius);
  const dirX = dx / rawDist;
  const dirY = dy / rawDist;

  // Knob renders along the clamped vector
  const knobX = dirX * clampedDist;
  const knobY = dirY * clampedDist;

  // Inside dead zone -> zero movement output
  if (rawDist <= deadZonePixels) {
    return {
      x: 0,
      y: 0,
      knobX,
      knobY,
      distance: 0,
      rawDistance: rawDist,
      isActive: true
    };
  }

  // Linear remapping from [deadZonePixels, maxRadius] to [0, 1]
  const effectiveRange = maxRadius - deadZonePixels;
  const normalizedMag = Math.min(1.0, (clampedDist - deadZonePixels) / effectiveRange);

  // Invert screen Y (screen down is +Y, but game forward is +Y)
  const normX = dirX * normalizedMag;
  const normY = -dirY * normalizedMag;

  return {
    x: Math.max(-1, Math.min(1, normX)),
    y: Math.max(-1, Math.min(1, normY)),
    knobX,
    knobY,
    distance: normalizedMag,
    rawDistance: rawDist,
    isActive: true
  };
}

/**
 * Combines keyboard WASD inputs with virtual joystick inputs.
 * Ensures diagonal movement is normalized so players cannot get an unfair diagonal speed boost.
 *
 * @param {Object} params
 * @param {{ w?: boolean, a?: boolean, s?: boolean, d?: boolean }} [params.keys]
 * @param {{ x?: number, y?: number }} [params.joystick]
 * @param {boolean} [params.isDialogOpen]
 * @param {boolean} [params.hasModalOpen]
 * @returns {{
 *   moveX: number,
 *   moveY: number,
 *   normX: number,
 *   normY: number,
 *   magnitude: number,
 *   isMoving: boolean
 * }}
 */
export function combineMovementInputs({
  keys = {},
  joystick = { x: 0, y: 0 },
  isDialogOpen = false,
  hasModalOpen = false
} = {}) {
  // Movement is completely disabled during dialogues or modal windows
  if (isDialogOpen || hasModalOpen) {
    return {
      moveX: 0,
      moveY: 0,
      normX: 0,
      normY: 0,
      magnitude: 0,
      isMoving: false
    };
  }

  // Keyboard discrete inputs
  const keyY = (keys.w ? 1 : 0) - (keys.s ? 1 : 0);
  const keyX = (keys.d ? 1 : 0) - (keys.a ? 1 : 0);

  // Joystick analog inputs
  const joyX = typeof joystick?.x === "number" && Number.isFinite(joystick.x) ? joystick.x : 0;
  const joyY = typeof joystick?.y === "number" && Number.isFinite(joystick.y) ? joystick.y : 0;

  // Sum both input sources
  const combinedX = keyX + joyX;
  const combinedY = keyY + joyY;

  const rawMag = Math.hypot(combinedX, combinedY);

  if (rawMag < 0.05) {
    return {
      moveX: 0,
      moveY: 0,
      normX: 0,
      normY: 0,
      magnitude: 0,
      isMoving: false
    };
  }

  // Normalize direction vector
  const normX = combinedX / rawMag;
  const normY = combinedY / rawMag;

  // Clamp combined magnitude to maximum 1.0 (prevents diagonal speed boost)
  const clampedMag = Math.min(1.0, rawMag);

  return {
    moveX: normX * clampedMag,
    moveY: normY * clampedMag,
    normX,
    normY,
    magnitude: clampedMag,
    isMoving: true
  };
}

/**
 * Translates character-relative movement inputs (X=lateral, Y=forward/back)
 * into world coordinates based on the current camera azimuthal angle (theta).
 *
 * Supports both call conventions:
 * 1. applyCameraRelativeVectors(inputX, inputY, cameraTheta)
 * 2. applyCameraRelativeVectors({ inputX, inputY, theta })
 *
 * @param {number|Object} inputX - Lateral input [-1, 1] OR parameter object
 * @param {number} [inputY] - Forward/backward input [-1, 1]
 * @param {number} [cameraTheta] - Azimuthal angle of the camera in radians
 * @returns {{ worldMoveX: number, worldMoveZ: number, worldX: number, worldZ: number }}
 */
export function applyCameraRelativeVectors(inputX, inputY, cameraTheta) {
  let x = inputX;
  let y = inputY;
  let theta = cameraTheta;

  // Support single parameter object: { inputX, inputY, theta } or { x, y, theta }
  if (typeof inputX === "object" && inputX !== null) {
    x = inputX.inputX ?? inputX.x ?? 0;
    y = inputX.inputY ?? inputX.y ?? 0;
    theta = inputX.theta ?? inputX.cameraTheta ?? 0;
  }

  const numX = typeof x === "number" && Number.isFinite(x) ? x : 0;
  const numY = typeof y === "number" && Number.isFinite(y) ? y : 0;
  const numTheta = typeof theta === "number" && Number.isFinite(theta) ? theta : 0;

  // Standard forward vector aligned with camera view
  const forwardX = -Math.sin(numTheta);
  const forwardZ = -Math.cos(numTheta);

  // Standard right vector orthogonal to camera view
  const rightX = Math.cos(numTheta);
  const rightZ = -Math.sin(numTheta);

  const rawX = forwardX * numY + rightX * numX;
  const rawZ = forwardZ * numY + rightZ * numX;
  const worldMoveX = Math.abs(rawX) < 1e-12 ? 0 : rawX;
  const worldMoveZ = Math.abs(rawZ) < 1e-12 ? 0 : rawZ;

  return {
    worldMoveX,
    worldMoveZ,
    worldX: worldMoveX,
    worldZ: worldMoveZ
  };
}
