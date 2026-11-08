import React from "react";
import { BuildingSign } from "./BuildingSign";
import { VILLAGE_SIGN_CONFIG } from "./villageBuildingsConfig";

/**
 * VillageSigns: Exterior signage billboards for all functional village buildings.
 * Ensures instant visual readability from afar when walking down the main street.
 * Rendered conditionally outdoors only.
 */
export function VillageSigns() {
  return (
    <group>
      {Object.entries(VILLAGE_SIGN_CONFIG).map(([key, config]) => (
        <BuildingSign key={key} {...config} />
      ))}
    </group>
  );
}

