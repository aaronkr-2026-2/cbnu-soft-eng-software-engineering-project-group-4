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
    // Model base: 1.30m (W) x 1.028m (D). At 7x: halfW = 4.55, halfD = 2.80
    collision: {
      halfW: 4.55,
      halfD: 2.80
    }
  },
  {
    id: "building-type-b",
    name: "Village House B",
    modelPath: "/models/village/building-type-b.glb",
    // North roadside building (Hospital), facing south towards the main road and sidewalk
    position: [-8.0, 0, 17.5],
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
    name: "Library",
    modelPath: "/models/village/building-type-c.glb",
    // East roadside lot beside Hotel (Library exterior), facing south towards South Sidewalk
    position: [19.8, 0, -0.5],
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
    name: "Bank",
    modelPath: "/models/skyscraper.glb",
    // West roadside lot beside Cafe (Bank exterior), facing south towards South Sidewalk
    position: [-23.0, 0.0, -0.5],
    rotation: [0, 0, 0],
    scale: [0.0016, 0.0016, 0.0016],
    // Footprint: width 11.99m (halfW = 6.00m), depth 5.89m (halfD = 3.10m)
    collision: {
      halfW: 6.0,
      halfD: 3.1
    }
  },
  {
    id: "building-type-e",
    name: "Police Station",
    modelPath: "/models/village/building-type-e.glb",
    // North roadside building (Police Station), facing south towards North Sidewalk & Crosswalk 2
    position: [5.0, 0, 17.5],
    rotation: [0, Math.PI, 0],
    scale: [7.0, 7.0, 7.0],
    // Model base: 1.300m (W) x 1.028m (D). At 7x: halfW = 4.55, halfD = 3.60
    collision: {
      halfW: 4.55,
      halfD: 3.60
    }
  },

  // ============================================================
  // EDUCATION & COMMUNITY DISTRICT (North District Buildings F - K)
  // Dedicated educational, career, and community facilities
  // ============================================================

  // --- WEST CAMPUS ---
  {
    id: "language-school",
    name: "Language School",
    modelPath: "/models/village/building-type-f.glb",
    // West roadside lot, facing south towards North Sidewalk
    position: [-14.4, 0, 36.0],
    rotation: [0, Math.PI, 0],
    scale: [4.2, 4.2, 4.2],
    // Model F base: 1.428m (W) x 1.406m (D). At 4.2x: width 6.00m, depth 5.91m
    collision: {
      halfW: 2.60,
      halfD: 2.50
    }
  },
  {
    id: "study-center",
    name: "Study Center",
    modelPath: "/models/village/building-type-g.glb",
    // West plaza-side lot, facing south towards North Sidewalk
    position: [-7.5, 0, 36.0],
    rotation: [0, Math.PI, 0],
    scale: [4.4, 4.4, 4.4],
    // Model G base: 1.450m (W) x 1.178m (D). At 4.4x: width 6.38m, depth 5.18m
    collision: {
      halfW: 2.60,
      halfD: 2.30
    }
  },
  {
    id: "activity-center",
    name: "Activity Center",
    modelPath: "/models/village/building-type-j.glb",
    // West rear lot, facing south down the pedestrian lane
    position: [-10.8, 0, 41.8],
    rotation: [0, Math.PI, 0],
    scale: [4.4, 4.4, 4.4],
    // Model J base: 1.370m (W) x 0.916m (D). At 4.4x: width 6.03m, depth 4.03m
    collision: {
      halfW: 2.60,
      halfD: 1.90
    }
  },

  // --- EAST CAMPUS ---
  {
    id: "community-center",
    name: "Community Center",
    modelPath: "/models/village/building-type-h.glb",
    // East plaza-side lot, facing south towards North Sidewalk
    position: [7.2, 0, 36.0],
    rotation: [0, Math.PI, 0],
    scale: [4.6, 4.6, 4.6],
    // Model H base: 1.300m (W) x 0.916m (D). At 4.6x: width 5.98m, depth 4.21m
    collision: {
      halfW: 2.50,
      halfD: 2.00
    }
  },
  {
    id: "career-center",
    name: "Career Center",
    modelPath: "/models/village/building-type-i.glb",
    // East roadside lot, facing south towards North Sidewalk
    position: [14.4, 0, 36.0],
    rotation: [0, Math.PI, 0],
    scale: [4.6, 4.6, 4.6],
    // Model I base: 1.286m (W) x 1.028m (D). At 4.6x: width 5.92m, depth 4.73m
    collision: {
      halfW: 2.50,
      halfD: 2.20
    }
  },
  {
    id: "multi-purpose-hall",
    name: "Multi-Purpose Hall",
    modelPath: "/models/village/building-type-k.glb",
    // East rear lot, facing south down the pedestrian lane
    position: [10.8, 0, 41.8],
    rotation: [0, Math.PI, 0],
    scale: [4.8, 4.8, 4.8],
    // Model K base: 0.921m (W) x 1.020m (D). At 4.8x: width 4.42m, depth 4.90m
    collision: {
      halfW: 2.10,
      halfD: 2.20
    }
  }
];

