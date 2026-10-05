import React, { useEffect, useRef, useMemo } from "react";
import { VILLAGE_BUILDINGS } from "../r3f/villageBuildingsConfig";

// World coordinate bounds corresponding to playable village exterior (including North residential expansion)
const WORLD_MIN_X = -28.0;
const WORLD_MAX_X = 28.0;
const WORLD_MIN_Z = -7.0;
const WORLD_MAX_Z = 42.0;

/**
 * Real-time Fixed Top-Down Minimap HUD component.
 * Displays:
 * - Real-time player marker (X, Z position + yaw orientation)
 * - All 7 functional village buildings with distinctive colored markers and labels
 * - Complete village road network:
 *     * Central East-West Main Road (Z = 8.0)
 *     * North Connector Avenue (X = 12.0)
 *     * North Residential Street & Sidewalk (Z = 28.0)
 *     * Pedestrian Alleyway between Hospital & Police Station
 *     * Crosswalks and sidewalks
 * - New North Residential Area zone indicator
 * - Current location status badge (Outdoors or active indoor venue)
 * - 100% lightweight HTML/CSS (0 Canvas overhead, smooth requestAnimationFrame sync)
 */
export function MiniMap({ playerRef, currentLocation = "outside" }) {
  const markerRef = useRef(null);
  const pointerRef = useRef(null);

  // Derive building markers directly from official config + Shop/Cafe
  const buildings = useMemo(() => {
    const list = [
      { id: "shop", name: "SHOP", x: 0.0, z: -2.5, color: "#22c55e", labelPos: "top" },
      { id: "cafe", name: "CAFE", x: -12.0, z: 0.0, color: "#f97316", labelPos: "top" }
    ];

    VILLAGE_BUILDINGS.forEach((b) => {
      let name = "BUILDING";
      let color = "#3b82f6";
      let labelPos = "top";
      let isHouse = false;

      if (b.id === "building-type-a") {
        name = "HOTEL";
        color = "#a855f7";
        labelPos = "top";
      } else if (b.id === "building-type-b") {
        name = "HOSPITAL";
        color = "#00897b";
        labelPos = "top";
      } else if (b.id === "building-type-c") {
        name = "LIBRARY";
        color = "#ec4899";
        labelPos = "top";
      } else if (b.id === "building-type-d") {
        name = "BANK";
        color = "#eab308";
        labelPos = "top";
      } else if (b.id === "building-type-e") {
        name = "POLICE";
        color = "#3b82f6";
        labelPos = "top";
      }

      // Education & Community District building markers
      const districtLabels = {
        "language-school": { name: "LANG", color: "#38bdf8" },
        "study-center": { name: "STUDY", color: "#a78bfa" },
        "community-center": { name: "COMM", color: "#34d399" },
        "career-center": { name: "CAREER", color: "#fbbf24" },
        "activity-center": { name: "ACT", color: "#fb7185" },
        "multi-purpose-hall": { name: "HALL", color: "#818cf8" }
      };

      if (districtLabels[b.id]) {
        isHouse = true;
        name = districtLabels[b.id].name;
        color = districtLabels[b.id].color;
        labelPos = "top";
      }

      list.push({
        id: b.id,
        name,
        x: b.position[0],
        z: b.position[2],
        color,
        labelPos,
        isHouse
      });
    });

    return list;
  }, []);

  // Real-time 60fps player tracking loop without triggering React component re-renders
  useEffect(() => {
    let animId;

    const updatePosition = () => {
      if (playerRef?.current && markerRef.current) {
        const px = playerRef.current.position.x;
        const pz = playerRef.current.position.z;
        const rotY = playerRef.current.rotation.y || 0;

        // Map X: [-28, 28] -> [2%, 98%]
        const leftPercent = Math.max(
          2,
          Math.min(98, ((px - WORLD_MIN_X) / (WORLD_MAX_X - WORLD_MIN_X)) * 100)
        );

        // Map Z: Invert Z because screen Y=0 is North (+Z) and Y=100% is South (-Z)
        const topPercent = Math.max(
          2,
          Math.min(98, ((WORLD_MAX_Z - pz) / (WORLD_MAX_Z - WORLD_MIN_Z)) * 100)
        );

        markerRef.current.style.left = `${leftPercent}%`;
        markerRef.current.style.top = `${topPercent}%`;

        // Rotate arrow to match player's heading
        if (pointerRef.current) {
          const deg = 180 - (rotY * 180) / Math.PI;
          pointerRef.current.style.transform = `rotate(${deg}deg)`;
        }
      }
      animId = requestAnimationFrame(updatePosition);
    };

    animId = requestAnimationFrame(updatePosition);
    return () => cancelAnimationFrame(animId);
  }, [playerRef]);

  const isIndoor = currentLocation !== "outside";

  return (
    <div
      style={{
        position: "absolute",
        top: "16px",
        right: "16px",
        width: "220px",
        height: "185px",
        background: "rgba(15, 23, 42, 0.88)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        border: "1px solid rgba(255, 255, 255, 0.18)",
        borderRadius: "12px",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.5)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        zIndex: 15,
        pointerEvents: "none",
        fontFamily: "system-ui, -apple-system, sans-serif",
        userSelect: "none"
      }}
    >
      <style>{`
        @keyframes minimap-pulse {
          0% { transform: scale(0.8); opacity: 0.8; }
          50% { transform: scale(1.5); opacity: 0.2; }
          100% { transform: scale(0.8); opacity: 0.8; }
        }
      `}</style>

      {/* Header Bar */}
      <div
        style={{
          height: "24px",
          background: "rgba(30, 41, 59, 0.75)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          padding: "0 8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <span
          style={{
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.8px",
            color: "#e2e8f0"
          }}
        >
          🗺️ VILLAGE MAP
        </span>
        <span
          style={{
            fontSize: "9px",
            fontWeight: 700,
            padding: "1px 6px",
            borderRadius: "4px",
            background: isIndoor ? "rgba(59, 130, 246, 0.3)" : "rgba(255, 255, 255, 0.1)",
            color: isIndoor ? "#60a5fa" : "#94a3b8",
            border: isIndoor ? "1px solid rgba(59, 130, 246, 0.4)" : "none",
            letterSpacing: "0.4px"
          }}
        >
          {isIndoor
            ? currentLocation === "LanguageSchool"
              ? "LANGUAGE SCHOOL"
              : currentLocation === "StudyCenter"
                ? "STUDY CENTER"
                : currentLocation === "CommunityCenter"
                  ? "COMMUNITY CENTER"
                  : currentLocation === "CareerCenter"
                    ? "CAREER CENTER"
                    : currentLocation === "ActivityCenter"
                      ? "ACTIVITY CENTER"
                      : currentLocation === "MultiPurposeHall"
                        ? "MULTI-PURPOSE HALL"
                        : currentLocation === "PoliceStation"
                        ? "POLICE STATION"
                        : currentLocation.toUpperCase()
            : "OUTDOORS"}
        </span>
      </div>

      {/* Map Graphics Canvas (CSS Vector Area) */}
      <div
        style={{
          flex: 1,
          position: "relative",
          overflow: "hidden",
          background: "radial-gradient(circle at 50% 50%, rgba(30, 41, 59, 0.45) 0%, rgba(15, 23, 42, 0.8) 100%)"
        }}
      >
        {/* Subtle Map Grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "20px 20px"
          }}
        />

        {/* ============================================================ */}
        {/* 1. NEW NORTH RESIDENTIAL ZONE (Z: 25 to 42)                 */}
        {/* ============================================================ */}

        {/* Shaded Residential Area Boundary */}
        <div
          style={{
            position: "absolute",
            top: "4%",
            left: "14%",
            width: "72%",
            height: "23%",
            background: "rgba(34, 197, 94, 0.05)",
            border: "1px dashed rgba(34, 197, 94, 0.22)",
            borderRadius: "6px"
          }}
        />

        {/* Community Park Square in North Zone */}
        <div
          style={{
            position: "absolute",
            top: "8%",
            left: "40%",
            width: "18%",
            height: "12%",
            background: "rgba(75, 85, 99, 0.5)",
            borderRadius: "4px",
            border: "1px solid rgba(156, 163, 175, 0.3)"
          }}
        />

        {/* Zone Label */}
        <div
          style={{
            position: "absolute",
            top: "5%",
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: "7px",
            fontWeight: 800,
            letterSpacing: "0.6px",
            color: "rgba(186, 230, 253, 0.75)",
            whiteSpace: "nowrap"
          }}
        >
          EDUCATION & COMMUNITY DISTRICT
        </div>

        {/* North Residential Street (Z = 28.0) */}
        <div
          style={{
            position: "absolute",
            top: "22.5%",
            left: "21.4%",
            width: "54.5%",
            height: "12.2%",
            background: "rgba(51, 65, 85, 0.8)",
            borderTop: "1px solid rgba(148, 163, 184, 0.35)",
            borderBottom: "1px solid rgba(148, 163, 184, 0.35)",
            borderRadius: "2px"
          }}
        />
        {/* North Street Center Dashed Line */}
        <div
          style={{
            position: "absolute",
            top: "28.6%",
            left: "21.4%",
            width: "54.5%",
            height: "1px",
            borderTop: "1px dashed rgba(203, 213, 225, 0.45)",
            transform: "translateY(-50%)"
          }}
        />

        {/* North Connector Avenue (X = 12.0, connecting Main Road to North Street) */}
        <div
          style={{
            position: "absolute",
            top: "28.6%",
            left: "67.0%",
            width: "8.9%",
            height: "36.2%",
            background: "rgba(51, 65, 85, 0.8)",
            borderLeft: "1px solid rgba(148, 163, 184, 0.35)",
            borderRight: "1px solid rgba(148, 163, 184, 0.35)"
          }}
        />
        {/* North Avenue Center Line */}
        <div
          style={{
            position: "absolute",
            top: "28.6%",
            left: "71.4%",
            width: "1px",
            height: "36.2%",
            borderLeft: "1px dashed rgba(203, 213, 225, 0.45)",
            transform: "translateX(-50%)"
          }}
        />

        {/* Pedestrian Alley between Hospital & Police Station */}
        <div
          style={{
            position: "absolute",
            top: "34.7%",
            left: "47.5%",
            width: "3.2%",
            height: "25.0%",
            background: "rgba(82, 90, 97, 0.7)",
            borderLeft: "1px dotted rgba(203, 213, 225, 0.3)",
            borderRight: "1px dotted rgba(203, 213, 225, 0.3)"
          }}
        />

        {/* ============================================================ */}
        {/* 2. MAIN ROAD & SIDEWALKS (Z = 8.0)                          */}
        {/* ============================================================ */}

        {/* North Sidewalk of Main Road (Z ~ 12) */}
        <div
          style={{
            position: "absolute",
            top: "59.0%",
            left: "0%",
            width: "100%",
            height: "3%",
            background: "rgba(71, 85, 105, 0.35)"
          }}
        />

        {/* Main Road Surface (Z = 8.0, height ~13.3%) */}
        <div
          style={{
            position: "absolute",
            top: "62.8%",
            left: "0%",
            width: "100%",
            height: "13.3%",
            background: "rgba(51, 65, 85, 0.75)",
            borderTop: "1px solid rgba(148, 163, 184, 0.3)",
            borderBottom: "1px solid rgba(148, 163, 184, 0.3)"
          }}
        />

        {/* Dashed Center Road Line */}
        <div
          style={{
            position: "absolute",
            top: "69.4%",
            left: "0%",
            width: "100%",
            height: "1px",
            borderTop: "1px dashed rgba(203, 213, 225, 0.4)",
            transform: "translateY(-50%)"
          }}
        />

        {/* South Sidewalk of Main Road (Z ~ 4) */}
        <div
          style={{
            position: "absolute",
            top: "76.1%",
            left: "0%",
            width: "100%",
            height: "3%",
            background: "rgba(71, 85, 105, 0.35)"
          }}
        />

        {/* Crosswalk 1: To Hospital (X = -6.0) */}
        <div
          style={{
            position: "absolute",
            top: "62.8%",
            left: "36.5%",
            width: "6%",
            height: "13.3%",
            background: "repeating-linear-gradient(to bottom, rgba(255,255,255,0.4) 0px, rgba(255,255,255,0.4) 2px, transparent 2px, transparent 4px)"
          }}
        />

        {/* Crosswalk 2: To Police Station (X = 4.5) */}
        <div
          style={{
            position: "absolute",
            top: "62.8%",
            left: "55.5%",
            width: "6%",
            height: "13.3%",
            background: "repeating-linear-gradient(to bottom, rgba(255,255,255,0.4) 0px, rgba(255,255,255,0.4) 2px, transparent 2px, transparent 4px)"
          }}
        />

        {/* Subtle MAIN ROAD Label */}
        <div
          style={{
            position: "absolute",
            top: "69.4%",
            left: "4px",
            transform: "translateY(-50%)",
            fontSize: "7px",
            fontWeight: 800,
            letterSpacing: "0.8px",
            color: "rgba(148, 163, 184, 0.55)"
          }}
        >
          MAIN ROAD
        </div>

        {/* ============================================================ */}
        {/* 3. 7 MAIN BUILDINGS + 6 RESIDENTIAL HOUSES MARKERS          */}
        {/* ============================================================ */}
        {buildings.map((b) => {
          const left = ((b.x - WORLD_MIN_X) / (WORLD_MAX_X - WORLD_MIN_X)) * 100;
          const top = b.isHouse
            ? Math.max(5.5, ((WORLD_MAX_Z - b.z) / (WORLD_MAX_Z - WORLD_MIN_Z)) * 100)
            : ((WORLD_MAX_Z - b.z) / (WORLD_MAX_Z - WORLD_MIN_Z)) * 100;
          const isCurrentActive = isIndoor && currentLocation.toLowerCase().includes(b.name.toLowerCase());

          if (b.isHouse) {
            return (
              <div
                key={b.id}
                style={{
                  position: "absolute",
                  left: `${left}%`,
                  top: `${top}%`,
                  transform: "translate(-50%, -50%)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  zIndex: 3
                }}
              >
                {/* Small Subtle District Building Label */}
                <span
                  style={{
                    position: "absolute",
                    top: "-8px",
                    whiteSpace: "nowrap",
                    fontSize: "6.5px",
                    fontWeight: 700,
                    color: "#f1f5f9",
                    textShadow: "0 1px 2px rgba(0,0,0,0.9)",
                    letterSpacing: "0.2px"
                  }}
                >
                  {b.name}
                </span>

                {/* Small Institutional District Marker Dot */}
                <div
                  style={{
                    width: "5px",
                    height: "5px",
                    borderRadius: "50%",
                    background: b.color,
                    border: "1px solid rgba(255, 255, 255, 0.9)",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.6)"
                  }}
                />
              </div>
            );
          }

          return (
            <div
              key={b.id}
              style={{
                position: "absolute",
                left: `${left}%`,
                top: `${top}%`,
                transform: "translate(-50%, -50%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                zIndex: 5
              }}
            >
              {/* Building Label */}
              <span
                style={{
                  position: "absolute",
                  top: "-11px",
                  whiteSpace: "nowrap",
                  fontSize: "8px",
                  fontWeight: 700,
                  color: isCurrentActive ? "#60a5fa" : "#f1f5f9",
                  textShadow: "0 1px 3px rgba(0,0,0,0.9)",
                  letterSpacing: "0.3px"
                }}
              >
                {b.name}
              </span>

              {/* Marker icon dot */}
              <div
                style={{
                  width: isCurrentActive ? "10px" : "8px",
                  height: isCurrentActive ? "10px" : "8px",
                  borderRadius: "50%",
                  background: b.color,
                  border: isCurrentActive ? "2px solid #ffffff" : "1.5px solid #ffffff",
                  boxShadow: isCurrentActive ? `0 0 8px ${b.color}` : "0 1px 4px rgba(0,0,0,0.6)",
                  transition: "transform 0.2s ease"
                }}
              />
            </div>
          );
        })}

        {/* ============================================================ */}
        {/* 4. REAL-TIME PLAYER MARKER                                  */}
        {/* ============================================================ */}
        <div
          ref={markerRef}
          style={{
            position: "absolute",
            left: "50%",
            top: "69.4%",
            transform: "translate(-50%, -50%)",
            width: "16px",
            height: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
            pointerEvents: "none"
          }}
        >
          {/* Radar Ping Pulse */}
          <div
            style={{
              position: "absolute",
              width: "18px",
              height: "18px",
              borderRadius: "50%",
              background: "rgba(56, 189, 248, 0.25)",
              border: "1px solid rgba(56, 189, 248, 0.7)",
              animation: "minimap-pulse 2s infinite ease-out"
            }}
          />

          {/* Directional Arrow / Pointer Dot */}
          <div
            ref={pointerRef}
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: "#38bdf8",
              border: "1.5px solid #ffffff",
              boxShadow: "0 0 6px #0284c7",
              position: "relative"
            }}
          >
            {/* Direction Beak Triangle */}
            <div
              style={{
                position: "absolute",
                top: "-4px",
                left: "2px",
                width: 0,
                height: 0,
                borderLeft: "2px solid transparent",
                borderRight: "2px solid transparent",
                borderBottom: "4px solid #ffffff"
              }}
            />
          </div>

          {/* "YOU" text indicator */}
          <span
            style={{
              position: "absolute",
              bottom: "-10px",
              fontSize: "7.5px",
              fontWeight: 800,
              color: "#38bdf8",
              textShadow: "0 1px 3px rgba(0,0,0,0.9)",
              letterSpacing: "0.4px"
            }}
          >
            YOU
          </span>
        </div>
      </div>
    </div>
  );
}
