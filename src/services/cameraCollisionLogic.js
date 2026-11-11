/**
 * cameraCollisionLogic.js
 * Pure math and collision avoidance algorithms for third-person camera:
 * - Ray-AABB intersection tests against village buildings
 * - Building exit and corner obstruction resolution
 * - Safe camera angle calculation
 * - Penetration push-out failsafes
 */

import { VILLAGE_BUILDINGS } from "../components/r3f/villageBuildingsConfig.js";

export const GTA_OUTDOOR_RADIUS = 3.55;
export const GTA_OUTDOOR_BASE_PHI = 1.415;
export const GTA_MIN_PHI = 0.65;
export const GTA_MAX_PHI = 1.70;
export const GTA_TARGET_Y = 1.35;
export const GTA_MIN_CAMERA_Y = 0.45;
export const GTA_MIN_FOLLOW_RADIUS = 0.4;

export const OUTDOOR_BUILDINGS_COLLISION = [
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

/**
 * Checks ray intersection from player (pX, pZ) towards camera (camX, camZ).
 * Returns the maximum allowed distance before penetrating any building obstacle.
 *
 * @param {number} pX - Player X
 * @param {number} pZ - Player Z
 * @param {number} camX - Camera X
 * @param {number} camZ - Camera Z
 * @param {number} maxDist - Maximum unobstructed distance (target radius)
 * @returns {number} Allowed unobstructed distance
 */
export function checkCameraBuildingCollision(pX, pZ, camX, camZ, maxDist) {
  const dx = camX - pX;
  const dz = camZ - pZ;
  const rayLen = Math.hypot(dx, dz);
  if (rayLen < 0.001) return maxDist;

  const ux = dx / rayLen;
  const uz = dz / rayLen;
  const margin = 0.25;

  let closestDist = maxDist;

  for (let i = 0; i < OUTDOOR_BUILDINGS_COLLISION.length; i++) {
    const b = OUTDOOR_BUILDINGS_COLLISION[i];
    const minX = b.x - b.halfW - margin;
    const maxX = b.x + b.halfW + margin;
    const minZ = b.z - b.halfD - margin;
    const maxZ = b.z + b.halfD + margin;

    const originInside = pX >= minX && pX <= maxX && pZ >= minZ && pZ <= maxZ;

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

    if (tFar > 0 && tNear < tFar) {
      if (originInside) {
        // Player/ray origin is already within this obstacle's bounding margin
        closestDist = 0;
      } else if (tNear > 0 && tNear < closestDist) {
        closestDist = tNear;
      }
    }
  }

  return closestDist;
}

/**
 * Searches candidate azimuth angles to find a safe, unobstructed line of sight.
 *
 * @param {number} pX - Player X
 * @param {number} pZ - Player Z
 * @param {number} baseTheta - Current azimuth angle
 * @param {number} phi - Current elevation angle
 * @param {number} targetRadius - Normal follow radius
 * @returns {number} Safe azimuth angle
 */
export function findSafeCameraAngle(pX, pZ, baseTheta, phi, targetRadius) {
  const currentClearance = checkCameraBuildingCollision(
    pX,
    pZ,
    pX + targetRadius * Math.sin(phi) * Math.sin(baseTheta),
    pZ + targetRadius * Math.sin(phi) * Math.cos(baseTheta),
    targetRadius
  );

  if (currentClearance >= 1.6) {
    return baseTheta;
  }

  const candidateOffsets = [
    0.35, -0.35,
    0.7, -0.7,
    1.1, -1.1,
    Math.PI / 2, -Math.PI / 2,
    2.1, -2.1,
    Math.PI
  ];

  let bestTheta = baseTheta;
  let maxClearance = currentClearance;

  for (let i = 0; i < candidateOffsets.length; i++) {
    const candTheta = baseTheta + candidateOffsets[i];
    const hDist = targetRadius * Math.sin(phi);
    const cX = pX + hDist * Math.sin(candTheta);
    const cZ = pZ + hDist * Math.cos(candTheta);
    const clearance = checkCameraBuildingCollision(pX, pZ, cX, cZ, targetRadius);

    if (clearance >= 2.5) {
      return candTheta;
    }
    if (clearance > maxClearance) {
      maxClearance = clearance;
      bestTheta = candTheta;
    }
  }

  return bestTheta;
}

/**
 * Penetration resolution failsafe: if camera is inside any building's AABB,
 * pushes it out to the nearest exterior surface.
 *
 * @param {number} camX - Camera X
 * @param {number} camZ - Camera Z
 * @param {number} [margin=0.2] - Safety clearance buffer
 * @returns {{ camX: number, camZ: number }} Resolved coordinates
 */
export function resolveCameraBuildingPenetration(camX, camZ, margin = 0.2) {
  let resX = camX;
  let resZ = camZ;

  for (let i = 0; i < OUTDOOR_BUILDINGS_COLLISION.length; i++) {
    const b = OUTDOOR_BUILDINGS_COLLISION[i];
    const minX = b.x - b.halfW - margin;
    const maxX = b.x + b.halfW + margin;
    const minZ = b.z - b.halfD - margin;
    const maxZ = b.z + b.halfD + margin;

    if (resX > minX && resX < maxX && resZ > minZ && resZ < maxZ) {
      const dLeft = resX - minX;
      const dRight = maxX - resX;
      const dBack = resZ - minZ;
      const dFront = maxZ - resZ;
      const minD = Math.min(dLeft, dRight, dBack, dFront);

      if (minD === dFront) resZ = maxZ + 0.15;
      else if (minD === dBack) resZ = minZ - 0.15;
      else if (minD === dLeft) resX = minX - 0.15;
      else if (minD === dRight) resX = maxX + 0.15;
    }
  }

  return { camX: resX, camZ: resZ };
}
