import { loadArcGISJSAPIModules } from "jimu-arcgis";
import type {
  HighlightZonesParams,
  GeometryItem,
  GraphicsLayerMap,
} from "../types";

/**
 * Returns a color array [R, G, B, A] based on group ID
 * If not in multi-group mode, returns a neutral blue color
 */
export function getColorByGroupId(groupId: number, isMultiGroup: boolean = true): number[] {
  // Use neutral blue color for single group mode
  if (!isMultiGroup) {
    return [0, 122, 194, 0.4]; // ArcGIS blue
  }
  
  const colors: { [key: number]: number[] } = {
    1: [255, 0, 0, 0.4],
    2: [0, 255, 0, 0.4],
    3: [0, 0, 255, 0.4],
    4: [255, 165, 0, 0.4],
    5: [128, 0, 128, 0.4],
    6: [0, 255, 255, 0.4],
    7: [255, 192, 203, 0.4],
    8: [165, 42, 42, 0.4],
  };
  return colors[groupId] || [255, 255, 0, 0.4];
}

/**
 * Fetches geometries for a given layer and OID string
 */
async function fetchGeometries(
  jmv: any,
  layer: any,
  oidString: string
): Promise<GeometryItem[]> {
  if (!oidString) return [];

  const layerView = await jmv.view.whenLayerView(layer);
  const query = {
    where: `objectid IN (${oidString})`,
    outFields: ["objectid"],
    returnGeometry: true,
  };
  const results = await layerView.layer.queryFeatures(query);
  return results.features.map((feat) => ({
    oid: feat.attributes.objectid,
    geom: feat.geometry,
  }));
}

/**
 * Fetches geometries for all groups
 */
async function fetchGeometriesForGroups(
  jmv: any,
  zone: any,
  zoneOids: { [groupId: string]: number[] }
): Promise<{ [groupId: number]: GeometryItem[] }> {
  const geometriesByGroupId: { [groupId: number]: GeometryItem[] } = {};

  await Promise.all(
    Object.keys(zoneOids).map(async (group) => {
      const oidString = zoneOids[group].map((id) => `${id}`).join(", ");
      const geometries = await fetchGeometries(jmv, zone.dataset, oidString);
      const groupId = parseInt(group, 10);

      if (!geometriesByGroupId[groupId]) {
        geometriesByGroupId[groupId] = [];
      }
      if (geometries.length) {
        geometriesByGroupId[groupId].push(...geometries);
      }
    })
  );

  return geometriesByGroupId;
}

/**
 * Updates or creates a graphics layer for a specific group
 */
async function updateGroupLayer(
  jmv: any,
  graphicsLayers: GraphicsLayerMap,
  groupId: string,
  polygons: GeometryItem[],
  isMultiGroup: boolean = true
): Promise<any> {
  const [GraphicsLayer, Graphic] = await loadArcGISJSAPIModules([
    "esri/layers/GraphicsLayer",
    "esri/Graphic",
  ]);

  let groupLayer = graphicsLayers[groupId];

  if (!groupLayer) {
    groupLayer = new GraphicsLayer({
      title: `New Group ${groupId}`,
      id: `groupLayer-${groupId}`,
    });
    jmv.view.map.add(groupLayer);
  }

  const color = getColorByGroupId(parseInt(groupId, 10), isMultiGroup);
  const graphics = polygons.map(
    (polygon) =>
      new Graphic({
        geometry: polygon.geom,
        symbol: {
          type: "simple-fill",
          color: color,
          style: "solid",
          outline: {
            color: [255, 255, 255],
            width: 0,
          },
        },
        attributes: { oid: polygon.oid },
      })
  );

  groupLayer.removeAll();
  groupLayer.addMany(graphics);

  return groupLayer;
}

/**
 * Removes a graphics layer for a specific group
 */
function removeGroupLayer(
  jmv: any,
  graphicsLayers: GraphicsLayerMap,
  groupId: string
): void {
  const groupLayer = graphicsLayers[groupId];
  if (groupLayer) {
    jmv.view.map.remove(groupLayer);
    delete graphicsLayers[groupId];
  }
}

/**
 * Main function to highlight zones on the map
 * Manages graphics layers for multiple groups of selected zones
 */
export async function highlightZones({
  zone,
  zoneOids,
  graphicsLayers,
  jmv,
  onGraphicsLayersUpdate,
  isMultiGroup = true,
}: HighlightZonesParams): Promise<void> {
  // Fetch all geometries
  const geometriesByGroupId = await fetchGeometriesForGroups(
    jmv,
    zone,
    zoneOids
  );

  const newGraphicsLayers = { ...graphicsLayers };

  // Update or create layers for groups with geometries
  for (const groupId of Object.keys(geometriesByGroupId)) {
    if (geometriesByGroupId[groupId].length > 0) {
      const layer = await updateGroupLayer(
        jmv,
        newGraphicsLayers,
        groupId,
        geometriesByGroupId[groupId],
        isMultiGroup
      );
      newGraphicsLayers[groupId] = layer;
    } else {
      removeGroupLayer(jmv, newGraphicsLayers, groupId);
    }
  }

  // Remove layers for groups that no longer have geometries
  for (const groupId of Object.keys(newGraphicsLayers)) {
    if (!Object.keys(geometriesByGroupId).includes(groupId)) {
      removeGroupLayer(jmv, newGraphicsLayers, groupId);
    }
  }

  onGraphicsLayersUpdate(newGraphicsLayers);
}
