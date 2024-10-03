import React, { useEffect, useRef } from "react";
import { loadArcGISJSAPIModules } from "jimu-arcgis";

const SketchWidget = ({ jmv, activeLayer, handleDraw, theme }) => {
  const sketchRef = useRef(null);
  const sketchViewModelRef = useRef(null);
  const graphicsLayerRef = useRef(null);
  console.log(theme);

  useEffect(() => {
    if (jmv && activeLayer) {
      loadArcGISJSAPIModules([
        "esri/widgets/Sketch/SketchViewModel",
        "esri/layers/GraphicsLayer",
      ]).then(([SketchViewModel, GraphicsLayer]) => {
        const graphicsLayer = new GraphicsLayer();
        jmv.view.map.add(graphicsLayer);
        graphicsLayerRef.current = graphicsLayer;

        const sketchViewModel = new SketchViewModel({
          layer: graphicsLayer,
          view: jmv.view,
          activeFillSymbol: {
            type: "simple-fill",
            color: "red",
            style: "solid",
            outline: {
              color: "red",
              width: "10px",
            },
          },
          polygonSymbol: {
            type: "simple-fill",
            color: "red",
            symbolLayers: [
              {
                type: "fill",
                material: {
                  color: "red",
                  //color: theme.colors.primary,
                  //color: [255, 255, 255, 0.8],
                },
                outline: {
                  color: "red",
                  size: "10px",
                },
              },
            ],
          },
          pointSymbol: {
            type: "simple-marker",
            style: "circle",
            size: 10,
            color: "red", //[255, 255, 255, 0.8],
            outline: {
              color: [211, 132, 80, 0.7],
              size: 10,
            },
          },
        });

        sketchViewModel.on(["create"], async (event) => {
          if (event.state === "complete") {
            console.log(event.graphic.geometry);
            const opts = {
              include: [activeLayer],
            };

            async function queryFeaturelayer(geometry) {
              const parcelQuery = {
                spatialRelationship: "intersects",
                geometry: geometry,
                outFields: ["name, zone_name, objectid"],
                returnGeometry: false,
              };

              const results = await activeLayer.queryFeatures(parcelQuery);

              const newZones = results.features.map((result) => ({
                label: result.attributes.name,
                value: result.attributes.zone_name,
                objectid: result.attributes.objectid,
              }));

              console.log(newZones);
              handleDraw(newZones);
            }

            await queryFeaturelayer(event.graphic.geometry);
            //jmv.view.map.remove(graphicsLayer);
          }
        });

        sketchViewModelRef.current = sketchViewModel;
      });
    }

    return () => {
      if (sketchViewModelRef.current) {
        sketchViewModelRef.current.destroy();
        sketchViewModelRef.current = null;
      }
      if (graphicsLayerRef.current) {
        jmv.view.map.remove(graphicsLayerRef.current);
        graphicsLayerRef.current = null;
      }
    };
  }, [jmv, activeLayer]);

  const handleDrawPolygon = () => {
    if (sketchViewModelRef.current) {
      sketchViewModelRef.current.create("polygon");
    }
  };
  //   function handleMapZoneClick(attributes) {
  //     const newZone = {
  //       label: attributes.name,
  //       value: attributes.zone_name,
  //       objectid: attributes.objectid,
  //     };
  //     console.log(newZone);
  //     console.log(zoneSubsetRef.current);
  //     console.log(zoneSubsetRef.current.includes(newZone));
  //     const isInArray = zoneSubsetRef.current.some(
  //       (zone) =>
  //         zone.label === newZone.label &&
  //         zone.value === newZone.value &&
  //         zone.objectid === newZone.objectid
  //     );

  //     console.log(isInArray);

  //     if (isInArray) {
  //       // Remove the object from the array
  //       const updatedZoneSubset = zoneSubsetRef.current.filter(
  //         (zone) =>
  //           !(
  //             zone.label === newZone.label &&
  //             zone.value === newZone.value &&
  //             zone.objectid === newZone.objectid
  //           )
  //       );
  //       handleZoneSubsetClick(updatedZoneSubset);
  //     } else {
  //       // Add the object to the array
  //       const updatedZoneSubset = [...zoneSubsetRef.current, newZone];
  //       handleZoneSubsetClick(updatedZoneSubset);
  //     }
  //     //console.log(activeLayer);
  //   }
  const handleDrawPoint = () => {
    if (sketchViewModelRef.current) {
      sketchViewModelRef.current.create("point");
    }
  };

  return (
    <div ref={sketchRef}>
      <button
        className="esri-widget--button esri-icon-polygon"
        onClick={handleDrawPolygon}
      ></button>
      <button
        className="esri-widget--button esri-icon-map-pin"
        onClick={handleDrawPoint}
      ></button>
    </div>
  );
};

export default SketchWidget;
