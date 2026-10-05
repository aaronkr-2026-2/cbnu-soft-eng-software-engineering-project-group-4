import React from "react";
import { BuildingSign } from "./BuildingSign";

/**
 * VillageSigns: Exterior signage billboards for all functional village buildings.
 * Ensures instant visual readability from afar when walking down the main street.
 * Rendered conditionally outdoors only.
 */
export function VillageSigns() {
  return (
    <group>
      {/* 1. SHOP (South roadside, facing North towards road) */}
      <BuildingSign
        title="SHOP"
        subtitle="마을상점"
        position={[0.0, 4.1, 3.22]}
        rotation={[0, 0, 0]}
        width={3.8}
        height={0.95}
        accentColor="#15803d"
        textColor="#14532d"
        subtitleColor="#16a34a"
      />

      {/* 2. CAFE (West plaza roadside, facing North towards road) */}
      <BuildingSign
        title="CAFE"
        subtitle="마을카페"
        position={[-12.0, 4.0, 3.18]}
        rotation={[0, 0, 0]}
        width={3.8}
        height={0.95}
        accentColor="#854d0e"
        textColor="#451a03"
        subtitleColor="#92400e"
      />

      {/* 3. HOTEL (East front street, beside Shop, facing North towards road) */}
      <BuildingSign
        title="HOTEL"
        subtitle="마을호텔"
        position={[9.5, 3.9, 2.42]}
        rotation={[0, 0, 0]}
        width={3.8}
        height={0.95}
        accentColor="#1e3a8a"
        textColor="#0f172a"
        subtitleColor="#2563eb"
      />

      {/* 4. BANK (West lot beside Cafe, facing North towards road) */}
      <BuildingSign
        title="BANK"
        subtitle="마을은행"
        position={[-23.0, 4.3, 2.75]}
        rotation={[0, 0, 0]}
        width={4.0}
        height={0.95}
        accentColor="#0f294a"
        textColor="#091e3a"
        subtitleColor="#1d4ed8"
      />

      {/* 5. LIBRARY (East lot beside Hotel, facing North towards road) */}
      <BuildingSign
        title="LIBRARY"
        subtitle="마을도서관"
        position={[19.8, 3.9, 3.22]}
        rotation={[0, 0, 0]}
        width={4.0}
        height={0.95}
        accentColor="#831843"
        textColor="#500724"
        subtitleColor="#9d174d"
      />

      {/* 6. POLICE STATION (North roadside, facing South towards road) */}
      <BuildingSign
        title="POLICE STATION"
        subtitle="마을경찰서"
        position={[5.0, 3.9, 13.82]}
        rotation={[0, Math.PI, 0]}
        width={4.6}
        height={0.95}
        accentColor="#0a2240"
        textColor="#020617"
        subtitleColor="#1d4ed8"
      />

      {/* ============================================================ */}
      {/* EDUCATION & COMMUNITY DISTRICT SIGNS (North Buildings F - K) */}
      {/* ============================================================ */}

      {/* 7. LANGUAGE SCHOOL (Building F: West Campus roadside, facing South) */}
      <BuildingSign
        title="LANGUAGE SCHOOL"
        subtitle="어학원"
        position={[-14.4, 3.4, 33.00]}
        rotation={[0, Math.PI, 0]}
        width={3.5}
        height={0.85}
        accentColor="#0284c7"
        textColor="#0c4a6e"
        subtitleColor="#0369a1"
      />

      {/* 8. STUDY CENTER (Building G: West Campus plaza-side, facing South) */}
      <BuildingSign
        title="STUDY CENTER"
        subtitle="학습센터"
        position={[-7.5, 3.1, 33.36]}
        rotation={[0, Math.PI, 0]}
        width={3.4}
        height={0.85}
        accentColor="#7c3aed"
        textColor="#4c1d95"
        subtitleColor="#6d28d9"
      />

      {/* 9. COMMUNITY CENTER (Building H: East Campus plaza-side, facing South) */}
      <BuildingSign
        title="COMMUNITY CENTER"
        subtitle="주민센터"
        position={[7.2, 3.1, 33.84]}
        rotation={[0, Math.PI, 0]}
        width={3.5}
        height={0.85}
        accentColor="#059669"
        textColor="#064e3b"
        subtitleColor="#047857"
      />

      {/* 10. CAREER CENTER (Building I: East Campus roadside, facing South) */}
      <BuildingSign
        title="CAREER CENTER"
        subtitle="취업지원센터"
        position={[14.4, 3.1, 33.59]}
        rotation={[0, Math.PI, 0]}
        width={3.5}
        height={0.85}
        accentColor="#d97706"
        textColor="#78350f"
        subtitleColor="#b45309"
      />

      {/* 11. ACTIVITY CENTER (Building J: West Campus rear, facing South) */}
      <BuildingSign
        title="ACTIVITY CENTER"
        subtitle="활동센터"
        position={[-10.8, 3.5, 39.74]}
        rotation={[0, Math.PI, 0]}
        width={3.4}
        height={0.85}
        accentColor="#e11d48"
        textColor="#881337"
        subtitleColor="#be123c"
      />

      {/* 12. MULTI-PURPOSE HALL (Building K: East Campus rear, facing South) */}
      <BuildingSign
        title="MULTI-PURPOSE HALL"
        subtitle="다목적홀"
        position={[10.8, 3.6, 39.30]}
        rotation={[0, Math.PI, 0]}
        width={3.4}
        height={0.85}
        accentColor="#4f46e5"
        textColor="#312e81"
        subtitleColor="#4338ca"
      />
    </group>
  );
}
