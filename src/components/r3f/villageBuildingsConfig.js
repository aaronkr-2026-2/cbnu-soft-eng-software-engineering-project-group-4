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
    position: [-22.0, 0, 38.0],
    rotation: [0, Math.PI, 0],
    scale: [7.0, 7.0, 7.0],
    // Model F base: 1.428m (W) x 1.406m (D). At 7.0x: halfW = 4.55, halfD = 3.50
    collision: {
      halfW: 4.55,
      halfD: 3.50
    }
  },
  {
    id: "study-center",
    name: "Study Center",
    modelPath: "/models/village/building-type-g.glb",
    // West plaza-side lot, facing south towards North Sidewalk
    position: [-9.5, 0, 38.0],
    rotation: [0, Math.PI, 0],
    scale: [7.0, 7.0, 7.0],
    // Model G base: 1.450m (W) x 1.178m (D). At 7.0x: halfW = 4.55, halfD = 3.20
    collision: {
      halfW: 4.55,
      halfD: 3.20
    }
  },
  {
    id: "activity-center",
    name: "Activity Center",
    modelPath: "/models/village/building-type-j.glb",
    // West rear lot, facing south down the pedestrian avenue
    position: [-16.0, 0, 48.5],
    rotation: [0, Math.PI, 0],
    scale: [7.0, 7.0, 7.0],
    // Model J base: 1.370m (W) x 0.916m (D). At 7.0x: halfW = 4.55, halfD = 3.20
    collision: {
      halfW: 4.55,
      halfD: 3.20
    }
  },

  // --- EAST CAMPUS ---
  {
    id: "community-center",
    name: "Community Center",
    modelPath: "/models/village/building-type-h.glb",
    // East plaza-side lot, facing south towards North Sidewalk
    position: [9.5, 0, 38.0],
    rotation: [0, Math.PI, 0],
    scale: [7.0, 7.0, 7.0],
    // Model H base: 1.300m (W) x 0.916m (D). At 7.0x: halfW = 4.55, halfD = 3.20
    collision: {
      halfW: 4.55,
      halfD: 3.20
    }
  },
  {
    id: "career-center",
    name: "Career Center",
    modelPath: "/models/village/building-type-i.glb",
    // East roadside lot, facing south towards North Sidewalk
    position: [22.0, 0, 38.0],
    rotation: [0, Math.PI, 0],
    scale: [7.0, 7.0, 7.0],
    // Model I base: 1.286m (W) x 1.028m (D). At 7.0x: halfW = 4.50, halfD = 3.50
    collision: {
      halfW: 4.50,
      halfD: 3.50
    }
  },
  {
    id: "multi-purpose-hall",
    name: "Multi-Purpose Hall",
    modelPath: "/models/village/building-type-k.glb",
    // East rear lot, facing south down the pedestrian avenue
    position: [16.0, 0, 48.5],
    rotation: [0, Math.PI, 0],
    scale: [7.0, 7.0, 7.0],
    // Model K base: 0.921m (W) x 1.020m (D). At 7.0x: halfW = 3.20, halfD = 3.50
    collision: {
      halfW: 3.20,
      halfD: 3.50
    }
  }
];

/**
 * Exterior signage billboard configuration for all village buildings.
 * Shared between VillageSigns.jsx component and regression verification tests.
 */
export const VILLAGE_SIGN_CONFIG = {
  shop: {
    title: "SHOP",
    subtitle: "마을상점",
    position: [0.0, 4.1, 3.22],
    rotation: [0, 0, 0],
    width: 3.8,
    height: 0.95,
    accentColor: "#15803d",
    textColor: "#14532d",
    subtitleColor: "#16a34a"
  },
  cafe: {
    title: "CAFE",
    subtitle: "마을카페",
    position: [-12.0, 4.0, 3.18],
    rotation: [0, 0, 0],
    width: 3.8,
    height: 0.95,
    accentColor: "#854d0e",
    textColor: "#451a03",
    subtitleColor: "#92400e"
  },
  hotel: {
    title: "HOTEL",
    subtitle: "마을호텔",
    position: [9.5, 3.9, 2.42],
    rotation: [0, 0, 0],
    width: 3.8,
    height: 0.95,
    accentColor: "#1e3a8a",
    textColor: "#0f172a",
    subtitleColor: "#2563eb"
  },
  bank: {
    title: "BANK",
    subtitle: "마을은행",
    position: [-23.0, 4.3, 2.75],
    rotation: [0, 0, 0],
    width: 4.0,
    height: 0.95,
    accentColor: "#0f294a",
    textColor: "#091e3a",
    subtitleColor: "#1d4ed8"
  },
  library: {
    title: "LIBRARY",
    subtitle: "마을도서관",
    position: [19.8, 3.9, 3.22],
    rotation: [0, 0, 0],
    width: 4.0,
    height: 0.95,
    accentColor: "#831843",
    textColor: "#500724",
    subtitleColor: "#9d174d"
  },
  "police-station": {
    title: "POLICE STATION",
    subtitle: "마을경찰서",
    position: [5.0, 3.9, 13.82],
    rotation: [0, Math.PI, 0],
    width: 4.6,
    height: 0.95,
    accentColor: "#0a2240",
    textColor: "#020617",
    subtitleColor: "#1d4ed8"
  },
  "language-school": {
    title: "LANGUAGE SCHOOL",
    subtitle: "어학원",
    position: [-22.0, 3.9, 33.10],
    rotation: [0, Math.PI, 0],
    width: 4.0,
    height: 0.95,
    accentColor: "#0284c7",
    textColor: "#0c4a6e",
    subtitleColor: "#0369a1"
  },
  "study-center": {
    title: "STUDY CENTER",
    subtitle: "학습센터",
    position: [-9.5, 3.9, 33.86],
    rotation: [0, Math.PI, 0],
    width: 4.0,
    height: 0.95,
    accentColor: "#7c3aed",
    textColor: "#4c1d95",
    subtitleColor: "#6d28d9"
  },
  "community-center": {
    title: "COMMUNITY CENTER",
    subtitle: "주민센터",
    position: [9.5, 3.9, 34.74],
    rotation: [0, Math.PI, 0],
    width: 4.0,
    height: 0.95,
    accentColor: "#059669",
    textColor: "#064e3b",
    subtitleColor: "#047857"
  },
  "career-center": {
    title: "CAREER CENTER",
    subtitle: "취업지원센터",
    position: [22.0, 3.9, 34.39],
    rotation: [0, Math.PI, 0],
    width: 4.0,
    height: 0.95,
    accentColor: "#d97706",
    textColor: "#78350f",
    subtitleColor: "#b45309"
  },
  "activity-center": {
    title: "ACTIVITY CENTER",
    subtitle: "활동센터",
    position: [-16.0, 3.9, 45.24],
    rotation: [0, Math.PI, 0],
    width: 4.0,
    height: 0.95,
    accentColor: "#e11d48",
    textColor: "#881337",
    subtitleColor: "#be123c"
  },
  "multi-purpose-hall": {
    title: "MULTI-PURPOSE HALL",
    subtitle: "다목적홀",
    position: [16.0, 3.9, 44.90],
    rotation: [0, Math.PI, 0],
    width: 4.0,
    height: 0.95,
    accentColor: "#4f46e5",
    textColor: "#312e81",
    subtitleColor: "#4338ca"
  }
};

/**
 * Entrance step thresholds for the 6 Education & Community District buildings (F - K).
 * Single source of truth for step models and door interaction triggers.
 */
export const DISTRICT_STEPS = [
  { id: "step-lang", name: "Language School", position: [-22.0, 0.04, 33.20] },
  { id: "step-study", name: "Study Center", position: [-9.5, 0.04, 33.90] },
  { id: "step-comm", name: "Community Center", position: [9.5, 0.04, 34.80] },
  { id: "step-career", name: "Career Center", position: [22.0, 0.04, 34.40] },
  { id: "step-act", name: "Activity Center", position: [-16.0, 0.04, 45.30] },
  { id: "step-hall", name: "Multi-Purpose Hall", position: [16.0, 0.04, 45.00] }
];


