import React from "react";
import type { JimuMapView } from "jimu-arcgis";
import { loadArcGISJSAPIModules } from "jimu-arcgis";

// Constants
const TIME_SLIDER_POSITION = "bottom-left";
const LOADING_INDICATOR_ID = "timeslider-loading";
const TEMPORAL_DIMENSION = "StdTime";

/**
 * Custom hook to manage TimeSlider widget for imagery layer temporal navigation
 * 
 * Creates and manages an ArcGIS TimeSlider widget that allows users to navigate
 * through temporal imagery data year by year. The TimeSlider automatically updates
 * the map view's timeExtent, which filters time-aware layers like ImageryLayer.
 * 
 * @param jmv - The JimuMapView instance
 * @param imageryLayer - The imagery layer to control (must be time-aware)
 * @param enabled - Whether the TimeSlider should be active
 * 
 * @returns The TimeSlider widget instance (or null)
 * 
 * @example
 * ```tsx
 * const timeSlider = useImageryTimeSlider(jmv, imageryLayer, !!imageryLayer);
 * ```
 */
export function useImageryTimeSlider(
  jmv: JimuMapView | null,
  imageryLayer: any | null,
  enabled: boolean
): any | null {
  const [timeSlider, setTimeSlider] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (!jmv || !enabled || !imageryLayer) {
      // Clean up widget if prerequisites not met
      if (timeSlider) {
        jmv?.view?.ui?.remove(timeSlider);
        timeSlider.destroy();
        setTimeSlider(null);
      }
      setIsLoading(false);
      return;
    }

    async function createTimeSlider() {
      // Remove existing widget before creating new one
      if (timeSlider) {
        jmv.view.ui.remove(timeSlider);
        timeSlider.destroy();
        setTimeSlider(null);
      }

      setIsLoading(true);
      try {
        const [TimeSlider, esriRequest] = await loadArcGISJSAPIModules([
          "esri/widgets/TimeSlider",
          "esri/request",
        ]);

        await imageryLayer.load();

        // Fetch multidimensional metadata to retrieve temporal dimension values
        const response = await esriRequest(imageryLayer.url + "/multidimensionalInfo", {
          query: {
            f: "json",
          },
        });

        // Extract StdTime dimension values for the selected variable
        const stdTimeDimension = response.data.multidimensionalInfo?.variables
          ?.find((v: any) => v.name === imageryLayer.mosaicRule.multidimensionalDefinition[0].variableName)
          ?.dimensions?.find((d: any) => d.name === TEMPORAL_DIMENSION);

        if (!stdTimeDimension || !stdTimeDimension.values) {
          setIsLoading(false);
          return;
        }

        // Convert epoch milliseconds to Date objects for TimeSlider stops
        const timeStops = stdTimeDimension.values.map((timestamp: number) => new Date(timestamp));

        // Initialize TimeSlider with discrete time stops from service metadata
        const slider = new TimeSlider({
          container: document.createElement("div"),
          view: jmv.view,
          mode: "instant",
          layout: "compact",
          fullTimeExtent: {
            start: timeStops[0],
            end: timeStops[timeStops.length - 1],
          },
          stops: {
            dates: timeStops, // Use the exact dates from the service
          },
          timeVisible: true,
          timeZone: "UTC",
          loop: true,
          labelFormatFunction: (value: any, type: string, element: HTMLElement) => {
            if (Array.isArray(value) && value[0] instanceof Date) {
              element.innerHTML = value[0].getUTCFullYear().toString();
            } else if (value instanceof Date) {
              element.innerHTML = value.getUTCFullYear().toString();
            } else {
              element.innerHTML = "loading...";
            }
          },
        });

        // Initialize map view to display first available time period
        jmv.view.timeExtent = {
          start: timeStops[0],
          end: timeStops[0],
        };

        // Add widget to map UI
        jmv.view.ui.add(slider, TIME_SLIDER_POSITION);

        setTimeSlider(slider);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    }

    createTimeSlider();

    // Cleanup: destroy widget when dependencies change or component unmounts
    return () => {
      if (timeSlider) {
        jmv.view.ui.remove(timeSlider);
        timeSlider.destroy();
      }
    };
  }, [jmv, imageryLayer, enabled]);

  // Manage loading indicator display state independently
  React.useEffect(() => {
    if (!jmv) return;

    const existingLoading = document.getElementById(LOADING_INDICATOR_ID);

    if (isLoading && !existingLoading) {
      // Display loading indicator during TimeSlider initialization
      const loadingDiv = document.createElement("div");
      loadingDiv.id = LOADING_INDICATOR_ID;
      loadingDiv.innerHTML = '<div style="background: white; padding: 8px 12px; border-radius: 4px; font-size: 12px; box-shadow: 0 1px 2px rgba(0,0,0,0.3);">Loading Imagery...</div>';
      jmv.view.ui.add(loadingDiv, TIME_SLIDER_POSITION);
    } else if (!isLoading && existingLoading) {
      // Remove loading indicator once TimeSlider is ready
      jmv.view.ui.remove(existingLoading);
      existingLoading.remove();
    }

    return () => {
      const loadingEl = document.getElementById(LOADING_INDICATOR_ID);
      if (loadingEl) {
        jmv.view.ui.remove(loadingEl);
        loadingEl.remove();
      }
    };
  }, [isLoading, jmv]);

  return timeSlider;
}
