import React, { useMemo } from "react";

/**
 * Reusable flat road/path plane segment.
 * Sits just above the grass layer (Y > 0) with no collision so player walks freely.
 */
function SurfaceSegment({ position, args, color, y = 0.024, roughness = 0.82 }) {
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[position[0], y, position[1]]}
      receiveShadow
    >
      <planeGeometry args={args} />
      <meshStandardMaterial color={color} roughness={roughness} />
    </mesh>
  );
}

/**
 * Reusable curb segment along the road.
 */
function CurbSegment({ position, length, axis = "x" }) {
  const isX = axis === "x";
  return (
    <mesh
      position={[position[0], 0.07, position[1]]}
      castShadow
      receiveShadow
    >
      <boxGeometry args={isX ? [length, 0.12, 0.22] : [0.22, 0.12, length]} />
      <meshStandardMaterial color="#888f96" roughness={0.7} />
    </mesh>
  );
}

/**
 * VillageRoads: Complete neighborhood road & pedestrian path network.
 * Connects Main Road (Z=8) to Shop, Cafe, and Houses A through E.
 */
export function VillageRoads() {
  // Dashed center road lines along Z = 8.0, skipping zebra crosswalks (X: -7.5 to -4.5 and 3.0 to 6.0)
  const centerDashes = useMemo(() => {
    const dashes = [];
    for (let x = -26; x <= 26; x += 4.0) {
      // Skip crosswalk zones at x around -6 and x around 4.5
      if ((x >= -8.5 && x <= -3.5) || (x >= 2.5 && x <= 6.5)) continue;
      dashes.push(x);
    }
    return dashes;
  }, []);

  // Zebra crosswalk stripes (Z from 4.9 to 11.1 in 6 stripes)
  const crosswalkZs = [4.9, 6.1, 7.3, 8.5, 9.7, 10.9];

  return (
    <group>
      {/* ============================================================ */}
      {/* 1. MAIN ASPHALT ROAD (Z = 8.0, width 60m, depth 6.5m)       */}
      {/* ============================================================ */}
      <SurfaceSegment
        position={[0, 8.0]}
        args={[60, 6.5]}
        color="#26282a"
        y={0.02}
        roughness={0.9}
      />

      {/* Dashed center line */}
      {centerDashes.map((xVal, idx) => (
        <SurfaceSegment
          key={`dash-${idx}`}
          position={[xVal, 8.0]}
          args={[2.0, 0.22]}
          color="#f8fafc"
          y={0.026}
          roughness={0.6}
        />
      ))}

      {/* ============================================================ */}
      {/* 2. ZEBRA CROSSWALKS (Connecting South & North neighborhoods)  */}
      {/* ============================================================ */}
      {/* Crosswalk 1: Connecting Cafe/Shop Plaza to House B (X = -6.0) */}
      {crosswalkZs.map((zVal, idx) => (
        <SurfaceSegment
          key={`cw1-${idx}`}
          position={[-6.0, zVal]}
          args={[3.0, 0.6]}
          color="#f1f5f9"
          y={0.028}
          roughness={0.6}
        />
      ))}

      {/* Crosswalk 2: Connecting Shop/House A to House E (X = 4.5) */}
      {crosswalkZs.map((zVal, idx) => (
        <SurfaceSegment
          key={`cw2-${idx}`}
          position={[4.5, zVal]}
          args={[3.0, 0.6]}
          color="#f1f5f9"
          y={0.028}
          roughness={0.6}
        />
      ))}

      {/* ============================================================ */}
      {/* 3. SEGMENTED CURBS (with openings at crosswalks)              */}
      {/* ============================================================ */}
      {/* South Curbs at Z = 4.7 (openings at X: -7.5..-4.5 and 3.0..6.0) */}
      <CurbSegment position={[-18.75, 4.7]} length={22.5} />
      <CurbSegment position={[-0.75, 4.7]} length={7.5} />
      <CurbSegment position={[17.0, 4.7]} length={22.0} />

      {/* North Curbs at Z = 11.3 (openings at X: -7.5..-4.5, 3.0..6.0, and 9.5..14.5 for North Road) */}
      <CurbSegment position={[-18.75, 11.3]} length={22.5} />
      <CurbSegment position={[-0.75, 11.3]} length={7.5} />
      <CurbSegment position={[7.75, 11.3]} length={3.5} />
      <CurbSegment position={[21.25, 11.3]} length={13.5} />

      {/* ============================================================ */}
      {/* 4. MAIN SIDEWALKS (Paved pedestrian walkways)                */}
      {/* ============================================================ */}
      {/* South Sidewalk (Z in [3.2, 4.7], connecting House D, Cafe, Shop, Hotel, House C) */}
      <SurfaceSegment
        position={[0.0, 3.95]}
        args={[54.0, 1.5]}
        color="#5c646b"
        y={0.023}
      />

      {/* North Sidewalk (Z in [11.3, 13.0], under the street trees) */}
      <SurfaceSegment
        position={[-1.0, 12.15]}
        args={[34.0, 1.7]}
        color="#5c646b"
        y={0.023}
      />

      {/* ============================================================ */}
      {/* 5. SECONDARY VILLAGE ROADS, LANES & FRONT APPROACHES         */}
      {/* ============================================================ */}
      {/* Cafe & Shop Central Plaza (between Cafe X: -8 and Shop X: -3.8) */}
      <SurfaceSegment
        position={[-5.9, 0.5]}
        args={[4.2, 5.2]}
        color="#525a61"
        y={0.024}
      />

      {/* House D (future Bank) entrance approach from South Sidewalk */}
      <SurfaceSegment
        position={[-23.0, 3.15]}
        args={[3.6, 0.4]}
        color="#525a61"
        y={0.023}
      />

      {/* House C (future Library) entrance approach from South Sidewalk */}
      <SurfaceSegment
        position={[19.8, 3.15]}
        args={[3.6, 0.4]}
        color="#525a61"
        y={0.023}
      />

      {/* West Residential Lane (Connecting Plaza along Shop to rear) */}
      <SurfaceSegment
        position={[-5.5, -4.0]}
        args={[1.6, 4.0]}
        color="#525a61"
        y={0.023}
      />

      {/* East Residential Lane (Between Shop and Hotel) */}
      <SurfaceSegment
        position={[4.4, -1.0]}
        args={[1.2, 8.5]}
        color="#525a61"
        y={0.023}
      />

      {/* Walkways to North Buildings across the road */}
      {/* Approach to Hospital (House B) from North Sidewalk & Crosswalk 1 */}
      <SurfaceSegment
        position={[-8.0, 13.25]}
        args={[3.2, 0.9]}
        color="#525a61"
        y={0.023}
      />

      {/* Approach to Police Station (House E) from North Sidewalk & Crosswalk 2 */}
      <SurfaceSegment
        position={[5.0, 13.45]}
        args={[4.0, 1.1]}
        color="#525a61"
        y={0.023}
      />

      {/* Police Station vehicle parking / service court */}
      <SurfaceSegment
        position={[10.5, 15.0]}
        args={[2.2, 4.0]}
        color="#525a61"
        y={0.023}
      />

      {/* ============================================================ */}
      {/* 6. NEW NORTH RESIDENTIAL ROAD & OPEN COMMUNITY AREA          */}
      {/* ============================================================ */}

      {/* 6.1 North Connector Avenue (Starting at main road, continuing north past Police Station) */}
      <SurfaceSegment
        position={[12.0, 19.5]}
        args={[5.0, 17.0]}
        color="#26282a"
        y={0.02}
        roughness={0.9}
      />

      {/* North Avenue East Sidewalk */}
      <SurfaceSegment
        position={[15.25, 19.5]}
        args={[1.5, 17.0]}
        color="#5c646b"
        y={0.023}
      />

      {/* North Avenue Curbs */}
      <CurbSegment position={[14.5, 19.5]} length={17.0} axis="z" />
      <CurbSegment position={[9.5, 16.0]} length={10.0} axis="z" />

      {/* North Avenue Center Lane Dashes */}
      {[13.5, 17.5, 21.5, 25.5].map((zVal, idx) => (
        <SurfaceSegment
          key={`na-dash-${idx}`}
          position={[12.0, zVal]}
          args={[0.22, 2.0]}
          color="#f8fafc"
          y={0.026}
          roughness={0.6}
        />
      ))}

      {/* 6.2 North Residential Street (Running East-West behind Police Station and Hospital) */}
      <SurfaceSegment
        position={[-0.75, 28.0]}
        args={[30.5, 6.0]}
        color="#26282a"
        y={0.02}
        roughness={0.9}
      />

      {/* North Residential Street Center Dashes */}
      {[-14.0, -10.0, -6.0, -2.0, 2.0, 6.0, 10.0].map((xVal, idx) => (
        <SurfaceSegment
          key={`nrs-dash-${idx}`}
          position={[xVal, 28.0]}
          args={[2.0, 0.22]}
          color="#f8fafc"
          y={0.026}
          roughness={0.6}
        />
      ))}

      {/* North Residential Sidewalk (Paved pedestrian frontage for future houses) */}
      <SurfaceSegment
        position={[-0.75, 31.75]}
        args={[30.5, 1.5]}
        color="#5c646b"
        y={0.023}
      />

      {/* North Street Curbs */}
      <CurbSegment position={[-0.75, 31.0]} length={30.5} axis="x" />
      {/* South Curbs behind Hospital (leaving alley gap at X in [-1.6, 0.45]) */}
      <CurbSegment position={[-8.8, 25.0]} length={14.4} axis="x" />
      {/* South Curbs behind Police Station */}
      <CurbSegment position={[5.0, 25.0]} length={9.1} axis="x" />

      {/* 6.3 Pedestrian Alley between Hospital & Police Station (connecting front sidewalk to rear street) */}
      <SurfaceSegment
        position={[-0.575, 19.0]}
        args={[1.8, 12.0]}
        color="#525a61"
        y={0.024}
      />

      {/* 6.4 Community Green Park Plaza in the new residential area */}
      <SurfaceSegment
        position={[-0.75, 36.5]}
        args={[8.8, 7.0]}
        color="#4b5563"
        y={0.024}
      />
      <SurfaceSegment
        position={[-0.75, 32.75]}
        args={[2.4, 1.0]}
        color="#5c646b"
        y={0.025}
      />

      {/* 6.5 Pedestrian paths connecting the 6 district buildings to the sidewalk */}
      {/* Front approach paths: Language School (F) & Study Center (G) [West Campus] */}
      <SurfaceSegment
        position={[-14.4, 33.25]}
        args={[1.6, 1.5]}
        color="#5c646b"
        y={0.024}
      />
      <SurfaceSegment
        position={[-7.5, 33.25]}
        args={[1.6, 1.5]}
        color="#5c646b"
        y={0.024}
      />

      {/* Front approach paths: Community Center (H) & Career Center (I) [East Campus] */}
      <SurfaceSegment
        position={[7.2, 33.4]}
        args={[1.6, 1.8]}
        color="#5c646b"
        y={0.024}
      />
      <SurfaceSegment
        position={[14.4, 33.25]}
        args={[1.6, 1.5]}
        color="#5c646b"
        y={0.024}
      />

      {/* West Cul-de-Sac Lane (Connecting North Sidewalk to Activity Center J) */}
      <SurfaceSegment
        position={[-10.8, 36.5]}
        args={[1.6, 8.0]}
        color="#525a61"
        y={0.024}
      />
      {/* Activity Center (J) front walk/porch */}
      <SurfaceSegment
        position={[-10.8, 39.8]}
        args={[2.4, 1.4]}
        color="#5c646b"
        y={0.025}
      />

      {/* East Cul-de-Sac Lane (Connecting North Sidewalk to Multi-Purpose Hall K) */}
      <SurfaceSegment
        position={[10.8, 36.5]}
        args={[1.6, 8.0]}
        color="#525a61"
        y={0.024}
      />
      {/* Multi-Purpose Hall (K) front walk/porch */}
      <SurfaceSegment
        position={[10.8, 39.4]}
        args={[2.4, 1.4]}
        color="#5c646b"
        y={0.025}
      />

      {/* 6.6 Cross-Plaza Pedestrian Connectors (Unifying the 6 District Buildings) */}
      {/* West Plaza Connector: Links Community Plaza to Study Center & West Lane */}
      <SurfaceSegment
        position={[-8.0, 36.8]}
        args={[4.2, 1.4]}
        color="#525a61"
        y={0.024}
      />
      {/* East Plaza Connector: Links Community Plaza to Career Center & East Lane */}
      <SurfaceSegment
        position={[6.5, 36.8]}
        args={[4.2, 1.4]}
        color="#525a61"
        y={0.024}
      />
    </group>
  );
}
