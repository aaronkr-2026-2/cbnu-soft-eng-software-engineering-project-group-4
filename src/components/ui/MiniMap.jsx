import React, { useEffect, useRef, useState, useMemo } from "react";
import { VILLAGE_BUILDINGS } from "../r3f/villageBuildingsConfig";
import { t } from "../../services/i18n";

// World coordinate bounds corresponding to playable village exterior (including North residential expansion)
const WORLD_MIN_X = -28.0;
const WORLD_MAX_X = 28.0;
const WORLD_MIN_Z = -7.0;
const WORLD_MAX_Z = 52.0;

const MISSION_TARGET_MAP = {
  Shop: "shop",
  Cafe: "cafe",
  Hotel: "building-type-a",
  Hospital: "building-type-b",
  Library: "building-type-c",
  Bank: "building-type-d",
  PoliceStation: "building-type-e",
  LanguageSchool: "language-school",
  StudyCenter: "study-center",
  CommunityCenter: "community-center",
  CareerCenter: "career-center",
  ActivityCenter: "activity-center",
  MultiPurposeHall: "multi-purpose-hall"
};

export function MiniMap({
  playerRef,
  currentLocation = "outside",
  interfaceLanguage = "en",
  compact = false,
  activeMission = null
}) {
  const markerRef = useRef(null);
  const pointerRef = useRef(null);
  const expandedMarkerRef = useRef(null);
  const expandedPointerRef = useRef(null);
  const [showAllLabels, setShowAllLabels] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Derive building markers directly from official config + Shop/Cafe
  const buildings = useMemo(() => {
    const list = [
      { id: "shop", name: "SHOP", fullName: "Village Supermarket", icon: "🛒", x: 0.0, z: -2.5, color: "#22c55e", labelPos: "bottom" },
      { id: "cafe", name: "CAFE", fullName: "Cozy Village Cafe", icon: "☕", x: -12.0, z: 0.0, color: "#f97316", labelPos: "bottom" }
    ];

    VILLAGE_BUILDINGS.forEach((b) => {
      let name = "BUILDING";
      let fullName = "Village Building";
      let icon = "🏢";
      let color = "#3b82f6";
      let labelPos = "top";
      let isHouse = false;

      if (b.id === "building-type-a") {
        name = "HOTEL";
        fullName = "Grand Village Hotel";
        icon = "🏨";
        color = "#a855f7";
        labelPos = "bottom";
      } else if (b.id === "building-type-b") {
        name = "HOSP";
        fullName = "Medical Clinic";
        icon = "🏥";
        color = "#00897b";
        labelPos = "top";
      } else if (b.id === "building-type-c") {
        name = "LIB";
        fullName = "Public Library";
        icon = "📚";
        color = "#ec4899";
        labelPos = "bottom";
      } else if (b.id === "building-type-d") {
        name = "BANK";
        fullName = "Central Village Bank";
        icon = "🏦";
        color = "#eab308";
        labelPos = "bottom";
      } else if (b.id === "building-type-e") {
        name = "POLICE";
        fullName = "Police Station";
        icon = "🚔";
        color = "#3b82f6";
        labelPos = "top";
      }

      // Education & Community District building markers
      const districtLabels = {
        "language-school": { name: "LANG", fullName: "Language Academy", icon: "🎓", color: "#38bdf8", labelPos: "bottom" },
        "study-center": { name: "STUDY", fullName: "Self-Study Center", icon: "📖", color: "#a78bfa", labelPos: "top" },
        "community-center": { name: "COMM", fullName: "Civic Community Center", icon: "🏛️", color: "#34d399", labelPos: "bottom" },
        "career-center": { name: "CAREER", fullName: "Career Consultation", icon: "💼", color: "#fbbf24", labelPos: "top" },
        "activity-center": { name: "ACT", fullName: "Youth Activity Center", icon: "🎨", color: "#fb7185", labelPos: "top" },
        "multi-purpose-hall": { name: "HALL", fullName: "Cultural Village Hall", icon: "🎭", color: "#818cf8", labelPos: "top" }
      };

      if (districtLabels[b.id]) {
        isHouse = true;
        name = districtLabels[b.id].name;
        fullName = districtLabels[b.id].fullName;
        icon = districtLabels[b.id].icon;
        color = districtLabels[b.id].color;
        labelPos = districtLabels[b.id].labelPos;
      }

      list.push({
        id: b.id,
        name,
        fullName,
        icon,
        x: b.position[0],
        z: b.position[2],
        color,
        labelPos,
        isHouse
      });
    });

    return list;
  }, []);

  // Determine active mission destination target
  const objectiveBuildingId = useMemo(() => {
    if (!activeMission) return null;
    if (activeMission.doorType && MISSION_TARGET_MAP[activeMission.doorType]) {
      return MISSION_TARGET_MAP[activeMission.doorType];
    }
    if (activeMission.facility && MISSION_TARGET_MAP[activeMission.facility]) {
      return MISSION_TARGET_MAP[activeMission.facility];
    }
    return null;
  }, [activeMission]);

  // Real-time 60fps player tracking loop without triggering React component re-renders
  useEffect(() => {
    let animId;

    const updatePosition = () => {
      if (playerRef?.current) {
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

        const deg = 180 - (rotY * 180) / Math.PI;

        if (markerRef.current) {
          markerRef.current.style.left = `${leftPercent}%`;
          markerRef.current.style.top = `${topPercent}%`;
        }
        if (pointerRef.current) {
          pointerRef.current.style.transform = `rotate(${deg}deg)`;
        }

        if (expandedMarkerRef.current) {
          expandedMarkerRef.current.style.left = `${leftPercent}%`;
          expandedMarkerRef.current.style.top = `${topPercent}%`;
        }
        if (expandedPointerRef.current) {
          expandedPointerRef.current.style.transform = `rotate(${deg}deg)`;
        }
      }
      animId = requestAnimationFrame(updatePosition);
    };

    animId = requestAnimationFrame(updatePosition);
    return () => cancelAnimationFrame(animId);
  }, [playerRef]);

  const isIndoor = currentLocation !== "outside";

  // Reusable map graphics renderer
  const renderMapContent = (isExpandedView = false) => {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
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
            backgroundSize: isExpandedView ? "28px 28px" : "18px 18px"
          }}
        />

        {/* ============================================================ */}
        {/* 1. NORTH DISTRICT (Z: 25 to 50)                              */}
        {/* ============================================================ */}

        {/* Shaded District Area Boundary */}
        <div
          style={{
            position: "absolute",
            top: "4%",
            left: "14%",
            width: "72%",
            height: "23%",
            background: "rgba(34, 197, 94, 0.06)",
            border: "1px dashed rgba(34, 197, 94, 0.28)",
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
            background: "rgba(75, 85, 99, 0.55)",
            borderRadius: "4px",
            border: "1px solid rgba(156, 163, 175, 0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          {isExpandedView && (
            <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.5)", fontWeight: 700 }}>
              🌳 PARK
            </span>
          )}
        </div>

        {/* Zone Label */}
        <div
          style={{
            position: "absolute",
            top: "4.5%",
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: isExpandedView ? "10px" : "7px",
            fontWeight: 800,
            letterSpacing: "0.6px",
            color: "rgba(186, 230, 253, 0.8)",
            whiteSpace: "nowrap"
          }}
        >
          EDUCATION & CIVIC DISTRICT
        </div>

        {/* North Residential Street (Z = 28.0) */}
        <div
          style={{
            position: "absolute",
            top: "22.5%",
            left: "21.4%",
            width: "54.5%",
            height: "12.2%",
            background: "rgba(51, 65, 85, 0.85)",
            borderTop: "1px solid rgba(148, 163, 184, 0.4)",
            borderBottom: "1px solid rgba(148, 163, 184, 0.4)",
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
            borderTop: "1px dashed rgba(203, 213, 225, 0.5)",
            transform: "translateY(-50%)"
          }}
        />

        {/* North Connector Avenue (X = 12.0) */}
        <div
          style={{
            position: "absolute",
            top: "28.6%",
            left: "67.0%",
            width: "8.9%",
            height: "36.2%",
            background: "rgba(51, 65, 85, 0.85)",
            borderLeft: "1px solid rgba(148, 163, 184, 0.4)",
            borderRight: "1px solid rgba(148, 163, 184, 0.4)"
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
            borderLeft: "1px dashed rgba(203, 213, 225, 0.5)",
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
            background: "rgba(82, 90, 97, 0.75)",
            borderLeft: "1px dotted rgba(203, 213, 225, 0.35)",
            borderRight: "1px dotted rgba(203, 213, 225, 0.35)"
          }}
        />

        {/* ============================================================ */}
        {/* 2. MAIN ROAD & SIDEWALKS (Z = 8.0)                          */}
        {/* ============================================================ */}

        {/* North Sidewalk */}
        <div
          style={{
            position: "absolute",
            top: "59.0%",
            left: "0%",
            width: "100%",
            height: "3%",
            background: "rgba(71, 85, 105, 0.45)"
          }}
        />

        {/* Main Road Surface */}
        <div
          style={{
            position: "absolute",
            top: "62.8%",
            left: "0%",
            width: "100%",
            height: "13.3%",
            background: "rgba(45, 55, 72, 0.9)",
            borderTop: "1.5px solid rgba(148, 163, 184, 0.45)",
            borderBottom: "1.5px solid rgba(148, 163, 184, 0.45)"
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
            borderTop: "1px dashed rgba(251, 191, 36, 0.6)",
            transform: "translateY(-50%)"
          }}
        />

        {/* South Sidewalk */}
        <div
          style={{
            position: "absolute",
            top: "76.1%",
            left: "0%",
            width: "100%",
            height: "3%",
            background: "rgba(71, 85, 105, 0.45)"
          }}
        />

        {/* Crosswalk 1: Hospital */}
        <div
          style={{
            position: "absolute",
            top: "62.8%",
            left: "36.5%",
            width: "6%",
            height: "13.3%",
            background: "repeating-linear-gradient(to bottom, rgba(255,255,255,0.5) 0px, rgba(255,255,255,0.5) 2px, transparent 2px, transparent 4px)"
          }}
        />

        {/* Crosswalk 2: Police */}
        <div
          style={{
            position: "absolute",
            top: "62.8%",
            left: "55.5%",
            width: "6%",
            height: "13.3%",
            background: "repeating-linear-gradient(to bottom, rgba(255,255,255,0.5) 0px, rgba(255,255,255,0.5) 2px, transparent 2px, transparent 4px)"
          }}
        />

        {/* Main Road Street Name Banner */}
        <div
          style={{
            position: "absolute",
            top: "69.4%",
            left: "6px",
            transform: "translateY(-50%)",
            fontSize: isExpandedView ? "9px" : "7px",
            fontWeight: 800,
            letterSpacing: "0.8px",
            color: "rgba(226, 232, 240, 0.65)"
          }}
        >
          MAIN STREET
        </div>

        {/* ============================================================ */}
        {/* 3. BUILDING MARKERS & OBJECTIVE BEACONS                     */}
        {/* ============================================================ */}
        {buildings.map((b) => {
          const left = ((b.x - WORLD_MIN_X) / (WORLD_MAX_X - WORLD_MIN_X)) * 100;
          const top = b.isHouse
            ? Math.max(5.5, ((WORLD_MAX_Z - b.z) / (WORLD_MAX_Z - WORLD_MIN_Z)) * 100)
            : ((WORLD_MAX_Z - b.z) / (WORLD_MAX_Z - WORLD_MIN_Z)) * 100;
          const isCurrentActive = isIndoor && currentLocation.toLowerCase().includes(b.name.toLowerCase());
          const isObjective = !isIndoor && objectiveBuildingId === b.id;

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
                zIndex: isObjective ? 9 : isCurrentActive ? 8 : b.isHouse ? 4 : 5
              }}
            >
              {/* Mission Destination Waypoint Beacon Ring */}
              {isObjective && (
                <div
                  style={{
                    position: "absolute",
                    width: isExpandedView ? "28px" : "22px",
                    height: isExpandedView ? "28px" : "22px",
                    borderRadius: "50%",
                    background: "rgba(234, 179, 8, 0.3)",
                    border: "2px solid #facc15",
                    animation: "objective-pulse 1.6s infinite ease-out",
                    pointerEvents: "none"
                  }}
                />
              )}

              {/* Building Label */}
              {(isExpandedView || !compact || showAllLabels || isCurrentActive || isObjective || hoveredId === b.id) && (
                <span
                  style={{
                    position: "absolute",
                    ...(b.labelPos === "bottom" ? { top: "10px" } : { bottom: "10px" }),
                    whiteSpace: "nowrap",
                    fontSize: isExpandedView ? "9.5px" : compact ? "7px" : "8px",
                    fontWeight: 700,
                    color: isObjective ? "#fde047" : isCurrentActive ? "#60a5fa" : "#f1f5f9",
                    background: isObjective
                      ? "rgba(113, 63, 18, 0.95)"
                      : isCurrentActive
                        ? "rgba(15, 23, 42, 0.95)"
                        : "rgba(15, 23, 42, 0.8)",
                    padding: "1px 5px",
                    borderRadius: "4px",
                    border: isObjective
                      ? "1px solid #facc15"
                      : isCurrentActive
                        ? "1px solid rgba(96, 165, 250, 0.7)"
                        : "1px solid rgba(255, 255, 255, 0.15)",
                    textShadow: "0 1px 3px rgba(0,0,0,0.9)",
                    letterSpacing: "0.3px",
                    pointerEvents: "none",
                    boxShadow: isObjective ? "0 0 10px rgba(250, 204, 21, 0.6)" : "none"
                  }}
                >
                  {isObjective ? `🎯 ${isExpandedView ? b.fullName : b.name}` : (isExpandedView ? `${b.icon} ${b.fullName}` : b.name)}
                </span>
              )}

              {/* Marker icon dot */}
              <div
                onPointerEnter={() => setHoveredId(b.id)}
                onPointerLeave={() => setHoveredId(null)}
                onClick={() => setHoveredId((prev) => (prev === b.id ? null : b.id))}
                style={{
                  width: isObjective ? (isExpandedView ? "14px" : "11px") : isCurrentActive ? "10px" : isExpandedView ? "9px" : "8px",
                  height: isObjective ? (isExpandedView ? "14px" : "11px") : isCurrentActive ? "10px" : isExpandedView ? "9px" : "8px",
                  borderRadius: "50%",
                  background: isObjective ? "#eab308" : b.color,
                  border: isObjective ? "2px solid #ffffff" : isCurrentActive ? "2px solid #ffffff" : "1.5px solid #ffffff",
                  boxShadow: isObjective
                    ? "0 0 12px #eab308"
                    : isCurrentActive
                      ? `0 0 8px ${b.color}`
                      : "0 1px 4px rgba(0,0,0,0.6)",
                  cursor: "pointer",
                  pointerEvents: "auto",
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
          ref={isExpandedView ? expandedMarkerRef : markerRef}
          style={{
            position: "absolute",
            left: "50%",
            top: "69.4%",
            transform: "translate(-50%, -50%)",
            width: "18px",
            height: "18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 12,
            pointerEvents: "none"
          }}
        >
          {/* Radar Ping Pulse */}
          <div
            style={{
              position: "absolute",
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              background: "rgba(56, 189, 248, 0.25)",
              border: "1.5px solid rgba(56, 189, 248, 0.8)",
              animation: "minimap-pulse 2s infinite ease-out"
            }}
          />

          {/* Directional Heading Pointer */}
          <div
            ref={isExpandedView ? expandedPointerRef : pointerRef}
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              background: "#38bdf8",
              border: "2px solid #ffffff",
              boxShadow: "0 0 8px #0284c7",
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            {/* Direction Beak Triangle */}
            <div
              style={{
                position: "absolute",
                top: "-5px",
                left: "2.5px",
                width: 0,
                height: 0,
                borderLeft: "2.5px solid transparent",
                borderRight: "2.5px solid transparent",
                borderBottom: "5px solid #ffffff"
              }}
            />
          </div>

          {/* "YOU" text indicator */}
          <span
            style={{
              position: "absolute",
              bottom: "-11px",
              fontSize: "8px",
              fontWeight: 800,
              color: "#38bdf8",
              textShadow: "0 1px 3px rgba(0,0,0,0.9)",
              letterSpacing: "0.4px"
            }}
          >
            {t("hud.youMarker", {}, interfaceLanguage)}
          </span>
        </div>
      </div>
    );
  };

  return (
    <>
      <style>{`
        @keyframes minimap-pulse {
          0% { transform: scale(0.8); opacity: 0.8; }
          50% { transform: scale(1.6); opacity: 0.15; }
          100% { transform: scale(0.8); opacity: 0.8; }
        }
        @keyframes objective-pulse {
          0% { transform: scale(0.85); opacity: 0.9; }
          60% { transform: scale(1.8); opacity: 0; }
          100% { transform: scale(0.85); opacity: 0.9; }
        }
      `}</style>

      {/* Main HUD MiniMap Container */}
      <div
        className="minimap-container hud-container"
        style={{
          background: "rgba(15, 23, 42, 0.90)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: "1.5px solid rgba(255, 255, 255, 0.22)",
          borderRadius: "14px",
          boxShadow: "0 10px 28px rgba(0, 0, 0, 0.55)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          zIndex: 15,
          pointerEvents: "auto",
          fontFamily: "system-ui, -apple-system, sans-serif",
          userSelect: "none"
        }}
      >
        {/* Header Bar */}
        <div
          style={{
            height: "24px",
            background: "rgba(30, 41, 59, 0.85)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
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
              color: "#e2e8f0",
              display: "flex",
              alignItems: "center",
              gap: "4px"
            }}
          >
            🗺️ {t("hud.villageMap", {}, interfaceLanguage)}
          </span>

          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            {compact && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAllLabels((prev) => !prev);
                }}
                style={{
                  background: showAllLabels ? "rgba(59, 130, 246, 0.45)" : "rgba(255, 255, 255, 0.12)",
                  border: "none",
                  borderRadius: "3px",
                  color: "#e2e8f0",
                  fontSize: "8px",
                  fontWeight: 700,
                  padding: "2px 5px",
                  cursor: "pointer",
                  pointerEvents: "auto"
                }}
                title={showAllLabels ? "Hide Labels" : "Show All Labels"}
              >
                {showAllLabels ? "🏷️ ON" : "🏷️ OFF"}
              </button>
            )}

            {/* Expand Fullscreen Tactical Map Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(true);
              }}
              style={{
                background: "rgba(255, 255, 255, 0.12)",
                border: "none",
                borderRadius: "3px",
                color: "#e2e8f0",
                fontSize: "10px",
                fontWeight: 700,
                padding: "1px 5px",
                cursor: "pointer",
                pointerEvents: "auto"
              }}
              title="Expand Tactical Map (⛶)"
              aria-label="Expand Village Map"
            >
              ⛶
            </button>

            <span
              style={{
                fontSize: "8.5px",
                fontWeight: 700,
                padding: "1px 5px",
                borderRadius: "4px",
                background: isIndoor ? "rgba(59, 130, 246, 0.35)" : "rgba(255, 255, 255, 0.1)",
                color: isIndoor ? "#60a5fa" : "#94a3b8",
                border: isIndoor ? "1px solid rgba(59, 130, 246, 0.4)" : "none",
                letterSpacing: "0.3px",
                maxWidth: "70px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap"
              }}
            >
              {isIndoor
                ? currentLocation === "LanguageSchool"
                  ? "LANG"
                  : currentLocation === "StudyCenter"
                    ? "STUDY"
                    : currentLocation === "CommunityCenter"
                      ? "COMM"
                      : currentLocation === "CareerCenter"
                        ? "CAREER"
                        : currentLocation === "ActivityCenter"
                          ? "ACT"
                          : currentLocation === "MultiPurposeHall"
                            ? "HALL"
                            : currentLocation === "PoliceStation"
                            ? "POLICE"
                            : currentLocation.toUpperCase()
                : t("hud.outdoors", {}, interfaceLanguage)}
            </span>
          </div>
        </div>

        {/* Clickable Map Area */}
        <div
          onClick={() => setIsExpanded(true)}
          style={{ flex: 1, cursor: "pointer", position: "relative" }}
          title="Click to expand village navigation map"
        >
          {renderMapContent(false)}
        </div>
      </div>

      {/* Enlarged Tactical Map Modal */}
      {isExpanded && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setIsExpanded(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 70,
            background: "rgba(0, 0, 0, 0.72)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px"
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "min(520px, calc(100vw - 24px))",
              maxHeight: "min(620px, calc(100dvh - 32px))",
              background: "rgba(15, 23, 42, 0.96)",
              border: "1.5px solid rgba(59, 130, 246, 0.45)",
              borderRadius: "20px",
              boxShadow: "0 25px 60px rgba(0, 0, 0, 0.75)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              color: "#fff",
              fontFamily: "system-ui, -apple-system, sans-serif"
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: "12px 18px",
                background: "rgba(30, 41, 59, 0.8)",
                borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "18px" }}>🗺️</span>
                <span style={{ fontSize: "15px", fontWeight: 800, letterSpacing: "0.4px" }}>
                  {t("hud.villageMap", {}, interfaceLanguage)} — {interfaceLanguage === "ko" ? "마을 전체 지도" : "Full Village Map"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "none",
                  borderRadius: "8px",
                  color: "#fff",
                  fontSize: "16px",
                  width: "32px",
                  height: "32px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
                title="Close Map (✕)"
              >
                ✕
              </button>
            </div>

            {/* Active Mission Destination Banner */}
            {objectiveBuildingId && (
              <div
                style={{
                  background: "rgba(234, 179, 8, 0.18)",
                  borderBottom: "1px solid rgba(234, 179, 8, 0.35)",
                  padding: "8px 16px",
                  fontSize: "12px",
                  color: "#fef08a",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  fontWeight: 600
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span>🎯</span>
                  <span>{interfaceLanguage === "ko" ? "미션 목표 목적지:" : "Current Mission Objective:"} <strong>{buildings.find(b => b.id === objectiveBuildingId)?.fullName || "Facility"}</strong></span>
                </span>
                <span style={{ fontSize: "11px", color: "#fde047" }}>● WAYPOINT ACTIVE</span>
              </div>
            )}

            {/* Large Tactical Map Canvas */}
            <div style={{ height: "clamp(260px, 48vh, 400px)", position: "relative" }}>
              {renderMapContent(true)}
            </div>

            {/* Legend Footer */}
            <div
              style={{
                padding: "10px 16px",
                background: "rgba(15, 23, 42, 0.9)",
                borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                display: "flex",
                flexWrap: "wrap",
                gap: "8px 14px",
                fontSize: "10.5px",
                color: "#94a3b8"
              }}
            >
              <span>🛒 Shop</span>
              <span>☕ Cafe</span>
              <span>🏨 Hotel</span>
              <span>🏥 Hospital</span>
              <span>🏦 Bank</span>
              <span>🚔 Police</span>
              <span>🎓 Education</span>
              <span style={{ color: "#38bdf8" }}>🔵 YOU</span>
              {objectiveBuildingId && <span style={{ color: "#facc15" }}>🎯 Mission Target</span>}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
