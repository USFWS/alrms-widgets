import React from "react";
import type { JimuMapView } from "jimu-arcgis";
import { loadImageryLayer, removeImageryLayer } from "../utils/imageryService";
import type { IMConfig } from "../../config";

// Constants
const TEMPORAL_DIMENSION = "StdTime";
const MOSAIC_METHOD = "esriMosaicCenter";
const MOSAIC_OPERATION = "MT_FIRST";

/**
 * Custom hook to manage imagery layer loading/removal based on data source configuration
 * 
 * Automatically loads an imagery layer when:
 * 1. The selected data source has an imageryUrl configured
 * 2. A variable is selected
 * 
 * Applies a multidimensional filter to show only the selected variable's raster data.
 * Removes the layer when switching to a different data source, variable, or on unmount.
 * 
 * @param jmv - The JimuMapView instance
 * @param dataSourceName - The currently selected data source name
 * @param variableName - The currently selected variable name (e.g., "first_snow_day")
 * @param config - Widget configuration containing data source definitions
 * @param onError - Optional callback for error handling
 * 
 * @returns The current imagery layer instance (or null)
 * 
 * @example
 * ```tsx
 * const imageryLayer = useImageryLayer(jmv, dataSource.source, var1, props.config, (error) => {
 *   setWarning("Failed to load imagery layer");
 * });
 * ```
 */
export function useImageryLayer(
  jmv: JimuMapView | null,
  dataSourceName: string,
  variableName: string,
  config: IMConfig,
  onError?: (error: Error) => void
): any | null {
  const [imageryLayer, setImageryLayer] = React.useState<any>(null);
  const layerRef = React.useRef<any>(null);
  const onErrorRef = React.useRef(onError);

  // Keep error callback ref in sync with prop changes
  React.useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  React.useEffect(() => {
    // Validation: require map view, data source, and variable
    if (!jmv || !dataSourceName || !variableName) {
      return;
    }
    
    const sourceConfig = config.DataSources[dataSourceName];
    const hasImageryUrl = sourceConfig?.imageryUrl;
    const variableExistsInSource = sourceConfig?.variables?.includes(variableName);

    // Skip loading if variable doesn't belong to data source or no imagery URL configured
    if (!variableExistsInSource || !hasImageryUrl) {
      return;
    }

    async function loadImagery() {
      try {
        // Clean up existing layer before loading new one
        if (layerRef.current) {
          removeImageryLayer(jmv, layerRef.current);
          layerRef.current = null;
          setImageryLayer(null);
        }

        const layer = await loadImageryLayer(jmv, {
          url: sourceConfig.imageryUrl,
          title: `${dataSourceName} - ${variableName}`,
          visible: true,
          useViewTime: true,
          mosaicRule: {
            ascending: true,
            mosaicMethod: MOSAIC_METHOD,
            mosaicOperation: MOSAIC_OPERATION,
            multidimensionalDefinition: [
              {
                variableName: variableName,
                dimensionName: TEMPORAL_DIMENSION,
                isSlice: true,
              },
            ],
          },
        });
        
        layerRef.current = layer;
        setImageryLayer(layer);
      } catch (error) {
        if (onErrorRef.current) {
          onErrorRef.current(error as Error);
        }
      }
    }

    loadImagery();

    // Cleanup: remove layer when dependencies change or component unmounts
    return () => {
      if (layerRef.current) {
        removeImageryLayer(jmv, layerRef.current);
        layerRef.current = null;
      }
    };
  }, [jmv, dataSourceName, variableName, config]);

  return imageryLayer;
}
