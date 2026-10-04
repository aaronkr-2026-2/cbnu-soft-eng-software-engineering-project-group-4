/**
 * Modular configuration for Kenney village buildings (Types A through E).
 * Defines 3D model paths, transforms, and rectangular AABB collision boundaries.
 */
export const VILLAGE_BUILDINGS = [
  {
    id: "building-type-a",
    name: "Village House A",
    modelPath: "/models/village/building-type-a.glb",
    // East front street, beside Shop
    position: [9.5, 0, -0.5],
    rotation: [0, 0, 0],
    scale: [7.0, 7.0, 7.0],
    // Model base: 1.30m (W) x 1.028m (D). At 7x: halfW = 4.55, halfD = 3.60
    collision: {
      halfW: 4.55,
      halfD: 3.60
    }
  },
  {
    id: "building-type-b",
    name: "Village House B",
    modelPath: "/models/village/building-type-b.glb",
    // North side across the road, facing south towards the village plaza
    position: [-8.0, 0, 18.0],
    rotation: [0, Math.PI, 0],
    scale: [7.0, 7.0, 7.0],
    // Model base: 1.828m (W) x 1.140m (D). At 7x: halfW = 6.40, halfD = 4.00
    collision: {
      halfW: 6.40,
      halfD: 4.00
    }
  },
  {
    id: "building-type-c",
    name: "Village House C",
    modelPath: "/models/village/building-type-c.glb",
    // East residential lane behind House A
    position: [9.5, 0, -9.5],
    rotation: [0, 0, 0],
    scale: [7.0, 7.0, 7.0],
    // Model base: 1.286m (W) x 1.028m (D). At 7x: halfW = 4.50, halfD = 3.60
    collision: {
      halfW: 4.50,
      halfD: 3.60
    }
  },
  {
    id: "building-type-d",
    name: "Village House D",
    modelPath: "/models/village/building-type-d.glb",
    // North-West residential court behind the Shop
    position: [-2.5, 0, -15.0],
    rotation: [0, 0, 0],
    scale: [7.0, 7.0, 7.0],
    // Model base: 1.756m (W) x 1.028m (D). At 7x: halfW = 6.15, halfD = 3.60
    collision: {
      halfW: 6.15,
      halfD: 3.60
    }
  },
  {
    id: "building-type-e",
    name: "Village House E",
    modelPath: "/models/village/building-type-e.glb",
    // North side across the road, facing south towards the village street
    position: [4.5, 0, 18.0],
    rotation: [0, Math.PI, 0],
    scale: [7.0, 7.0, 7.0],
    // Model base: 1.300m (W) x 1.028m (D). At 7x: halfW = 4.55, halfD = 3.60
    collision: {
      halfW: 4.55,
      halfD: 3.60
    }
  }
];
