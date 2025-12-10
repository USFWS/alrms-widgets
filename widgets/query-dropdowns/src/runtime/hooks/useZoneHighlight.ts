import { useEffect, useRef } from "react";
import { JimuMapView } from "jimu-arcgis";
import { highlightZones } from "../utils/graphicsHelpers";
import type { Zone, ZoneSubset, GraphicsLayerMap } from "../types";

/**
 * Custom hook to manage zone highlighting on the map
 * Automatically highlights zones when zoneSubsets change
 */
export function useZoneHighlight(
  jmv: JimuMapView | null,
  zone: Zone,
  zoneSubsets: ZoneSubset[],
  graphicsLayers: GraphicsLayerMap,
  setGraphicsLayers: (layers: GraphicsLayerMap) => void,
  isMultiGroup: boolean = true
) {
  const zoneSubsetRef = useRef(zoneSubsets);
  const graphicsLayersRef = useRef(graphicsLayers);
  const previousZoneRef = useRef(zone.dataset);

  // Keep refs updated
  useEffect(() => {
    zoneSubsetRef.current = zoneSubsets;
    graphicsLayersRef.current = graphicsLayers;
  });

  // Clean up graphics when zone changes
  useEffect(() => {
    if (previousZoneRef.current && zone.dataset !== previousZoneRef.current) {
      // Zone changed, clear all graphics layers
      const currentLayers = graphicsLayersRef.current;
      Object.keys(currentLayers).forEach((groupId) => {
        const layer = currentLayers[groupId];
        if (layer && jmv) {
          jmv.view.map.remove(layer);
        }
      });
      setGraphicsLayers({});
    }
    previousZoneRef.current = zone.dataset;
  }, [zone.dataset, jmv, setGraphicsLayers]);

  useEffect(() => {
    if (!jmv || !zone.dataset) return;

    // Filter out groups with no polygons to prevent errors
    const validZoneSubsets = zoneSubsets.filter(
      (group) => group.polygons && group.polygons.length > 0
    );

    // Transform zoneSubsets into zone OIDs map
    const zoneOids = validZoneSubsets.reduce((acc, group) => {
      if (!acc[group.groupId]) {
        acc[group.groupId] = [];
      }
      const oids = group.polygons.map((polygon) => polygon.objectid);
      acc[group.groupId].push(...oids);
      return acc;
    }, {} as { [groupId: string]: number[] });

    // Highlight the zones using the ref to avoid dependency loop
    highlightZones({
      zone,
      zoneOids,
      graphicsLayers: graphicsLayersRef.current,
      jmv,
      onGraphicsLayersUpdate: setGraphicsLayers,
      isMultiGroup,
    });

    // Clean up layers for empty groups
    const currentLayers = graphicsLayersRef.current;
    Object.keys(currentLayers).forEach((groupId) => {
      if (!validZoneSubsets.find((g) => String(g.groupId) === groupId)) {
        const layer = currentLayers[groupId];
        if (layer) {
          jmv.view.map.remove(layer);
        }
      }
    });
  }, [jmv, zone, zoneSubsets, setGraphicsLayers, isMultiGroup]);
  // Note: graphicsLayers removed from deps, using ref instead
}
