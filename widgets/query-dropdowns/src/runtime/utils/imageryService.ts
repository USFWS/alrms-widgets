/**
 * Imagery Service Module
 * 
 * Provides functionality for loading and managing multidimensional imagery layers.
 * Used by useImageryLayer hook to display time-aware raster data overlays.
 * Supports configuration-driven imagery URLs with variable-specific filtering.
 */

import { loadArcGISJSAPIModules } from "jimu-arcgis";
import type { JimuMapView } from "jimu-arcgis";

export interface ImageryLayerConfig {
  url?: string;
  portalItem?: string;
  title?: string;
  visible?: boolean;
  useViewTime?: boolean; // Enable layer to respond to view's timeExtent
  mosaicRule?: any; // MosaicRule object containing multidimensionalDefinition
}

/**
 * Loads an imagery layer to the map view
 * 
 * Example usage:
 * ```typescript
 * await loadImageryLayer(jmv, {
 *   url: "https://gis.fws.gov/image/rest/services/ALRMS/MODIS_Snow/ImageServer",
 *   portalItem: "de283b79dfc84d7388a72af64ecd5bdc",
 *   title: "MODIS Snow Cover",
 *   visible: true
 * });
 * ```
 * 
 * Alternative URL examples:
 * - NLCD Land Cover: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/NLCDLandCover2001/ImageServer"
 * - MODIS Snow: "https://gis.fws.gov/image/rest/services/ALRMS/MODIS_Snow/ImageServer"
 */
export async function loadImageryLayer(
  jmv: JimuMapView,
  config: ImageryLayerConfig
): Promise<any> {
  const [ImageryLayer] = await loadArcGISJSAPIModules(["esri/layers/ImageryLayer"]);
  
  const imageryLayer = new ImageryLayer({
    url: config.url,
    portalItem: config.portalItem,
    title: config.title || "Imagery Layer",
    visible: config.visible !== undefined ? config.visible : true,
    useViewTime: config.useViewTime !== undefined ? config.useViewTime : false,
    mosaicRule: config.mosaicRule,
  });
  
  // Calculate insertion index to position imagery below feature layers (zones/polygons)
  const layers = jmv.view.map.layers;
  let insertIndex = 0;
  
  // Locate the topmost non-feature layer (basemap, reference layers, etc.)
  for (let i = 0; i < layers.length; i++) {
    if (layers.getItemAt(i).type !== "feature") {
      insertIndex = i + 1;
    }
  }
  
  // Insert imagery layer at calculated position
  jmv.view.map.add(imageryLayer, insertIndex);
  
  return imageryLayer;
}

/**
 * Removes an imagery layer from the map view
 * 
 * @param jmv - The JimuMapView instance
 * @param imageryLayer - The imagery layer to remove
 */
export function removeImageryLayer(jmv: JimuMapView, imageryLayer: any): void {
  if (imageryLayer) {
    jmv.view.map.remove(imageryLayer);
  }
}

/**
 * Toggles the visibility of an imagery layer
 * 
 * @param imageryLayer - The imagery layer to toggle
 */
export function toggleImageryLayerVisibility(imageryLayer: any): void {
  if (imageryLayer) {
    imageryLayer.visible = !imageryLayer.visible;
  }
}
