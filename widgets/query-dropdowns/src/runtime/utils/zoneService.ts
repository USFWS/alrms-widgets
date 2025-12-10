/**
 * Zone service module for handling zone layer queries and polygon fetching
 */

import type { JimuMapView } from "jimu-arcgis";
import type { Zone } from "../types";

export interface PolygonItem {
  label: string;
  value: string;
  objectid: number;
}

export interface ZoneClickParams {
  layerItem: any;
  jmv: JimuMapView;
  currentZone: Zone;
  onZoneUpdate: (zone: Zone) => void;
  onZoneSubsetsReset: () => void;
}

/**
 * Query zone layer with fallback for different field schemas
 * First tries to query with 'name' field, falls back to just 'zone_name' if that fails
 */
async function queryZoneFeatures(layerItem: any): Promise<any> {
  const query = layerItem.createQuery();
  query.returnGeometry = false;
  
  try {
    query.outFields = ["name, zone_name, objectid"];
    return await layerItem.queryFeatures(query);
  } catch (e) {
    // Fallback if 'name' field doesn't exist
    query.outFields = ["zone_name, objectid"];
    try {
      return await layerItem.queryFeatures(query);
    } catch (error) {
      console.error("Zone query failed:", error);
      throw error;
    }
  }
}

/**
 * Transform query results into polygon items for UI
 * Sorts alphabetically with "Select All" always at the top
 */
function transformToPolygonItems(results: any): PolygonItem[] {
  if (!Array.isArray(results.features)) {
    return [];
  }

  const polygonItems = results.features
    .map((feature) => ({
      label:
        feature.attributes.name ||
        feature.attributes.zone_name ||
        "Unnamed Polygon",
      value: feature.attributes.zone_name || "No Code",
      objectid: feature.attributes.objectid || 0,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  return [
    { label: "\u200B Select All", value: "select_all", objectid: null },
    ...polygonItems,
  ];
}

/**
 * Build zone object with associated tables and polygons
 */
function buildZoneObject(
  layerItem: any,
  jmv: JimuMapView,
  polygonItems: PolygonItem[]
): Zone {
  return {
    dataset: layerItem,
    title: layerItem.title.split(" - ")[1],
    tables: jmv.view.map.tables.toArray().filter(
      (item) => (item as any).url === (layerItem as any).url
    ),
    polygons: polygonItems,
  };
}

/**
 * Handles zone layer selection and data loading
 * Queries the layer for polygons and sets up the zone state
 */
export async function handleZoneSelection(
  params: ZoneClickParams
): Promise<void> {
  const { layerItem, jmv, currentZone, onZoneUpdate, onZoneSubsetsReset } = params;

  // Early return if same zone is already selected
  if (currentZone.dataset?.title === layerItem.title) {
    return;
  }

  // Reset previous zone if exists
  if (currentZone.dataset) {
    currentZone.dataset.visible = false;
    onZoneSubsetsReset();
  }

  try {
    // Query zone features
    const results = await queryZoneFeatures(layerItem);

    // Handle results based on feature count
    let polygonItems: PolygonItem[] = [];
    
    if (results.features.length < 2000) {
      polygonItems = transformToPolygonItems(results);
    }
    // If >= 2000 features, leave polygons empty (too many to display in dropdown)

    // Update zone state
    const newZone = buildZoneObject(layerItem, jmv, polygonItems);
    onZoneUpdate(newZone);

    // Configure layer visibility and fields
    layerItem.visible = true;
    layerItem.outFields = ["*"];
  } catch (error) {
    console.error("Zone query error:", error);
    throw error;
  }
}
