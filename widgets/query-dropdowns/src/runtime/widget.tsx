import { React, type AllWidgetProps } from "jimu-core";
import { type IMConfig } from "../config";
import "./style.scss";
import { JimuMapViewComponent, JimuMapView } from "jimu-arcgis";
import {
  Dropdown,
  DropdownMenu,
  DropdownButton,
  Radio,
  Label,
  Button,
} from "jimu-ui";
import { appActions } from "jimu-core";
import Var1Dropdown from "./Var1Dropdown";
import Var2Dropdown from "./Var2Dropdown";
import ZoneDropdown from "./ZoneDropdown";
import ZoneSubsetSelect from "./ZoneSubsetSelect";
import DataSourceDropdown from "./DataSourceDropdown";
import YearSlider from "./YearSlider";
//import DrawTool from "./DrawTool";
import { loadArcGISJSAPIModules } from "jimu-arcgis";

export default function Widget(props: AllWidgetProps<IMConfig>) {
  console.log(props);

  const [jmv, setJmv] = React.useState<JimuMapView | null>(null);
  const [zone, setZone] = React.useState({
    dataset: null,
    title: "",
    tables: [],
    polygons: [
      {
        label: "",
        value: "",
        objectid: 0,
      },
    ],
  });
  const [zoneSubset, setZoneSubset] = React.useState([]);
  const [var1, setVar1] = React.useState("");
  const [var2Options, setvar2Options] = React.useState([]);
  const [var2, setVar2] = React.useState("");
  const [dataSource, setDataSource] = React.useState({
    source: "",
    variables: [],
  });
  console.log(dataSource);
  const [dataTable, setDataTable] = React.useState([]);
  const [plotType, setPlotType] = React.useState(0);
  const [yearRange, setYearRange] = React.useState([2000, 2025]);
  const [yearValues, setYearValues] = React.useState({
    min: Math.min(...yearRange),
    max: Math.max(...yearRange),
  });
  const [tableQuery, setTableQuery] = React.useState([]);
  //Set up widget with map and map layers
  const activeViewChangeHandler = (jmv: JimuMapView) => {
    if (jmv && jmv.view.map) {
      jmv.view.highlightOptions = {
        color: "#8af542",
        haloOpacity: 0.7,
        fillOpacity: 0.2,
      };
      setJmv(jmv);
    }
  };

  React.useEffect(() => {
    props.dispatch(
      appActions.widgetStatePropChange("widget_comms", "dataTable", dataTable)
    );
  }, [dataTable]);

  //const [activeLayer, setActiveLayer] = React.useState(null);
  //console.log(zoneSubset);
  const zoneSubsetRef = React.useRef(zoneSubset);

  React.useEffect(() => {
    if (jmv && zone) {
      zoneSubsetRef.current = zoneSubset;
      console.log("zoneSubset changed", zoneSubset);
      highlightZones(zoneSubset.map((zone) => zone.value));
    }
  }, [zoneSubset]);
  function handleMapZoneClick(attributes) {
    const newZone = {
      label: attributes.name,
      value: attributes.zone_name,
      objectid: attributes.objectid,
    };
    console.log(newZone);
    console.log(zoneSubsetRef.current);
    console.log(zoneSubsetRef.current.includes(newZone));
    const isInArray = zoneSubsetRef.current.some(
      (zone) =>
        zone.label === newZone.label &&
        zone.value === newZone.value &&
        zone.objectid === newZone.objectid
    );

    console.log(isInArray);

    if (isInArray) {
      // Remove the object from the array
      const updatedZoneSubset = zoneSubsetRef.current.filter(
        (zone) =>
          !(
            zone.label === newZone.label &&
            zone.value === newZone.value &&
            zone.objectid === newZone.objectid
          )
      );
      handleZoneSubsetClick(updatedZoneSubset);
    } else {
      // Add the object to the array
      const updatedZoneSubset = [...zoneSubsetRef.current, newZone];
      handleZoneSubsetClick(updatedZoneSubset);
    }
    //console.log(activeLayer);
  }

  React.useEffect(() => {
    console.log("click handler triggered");
    let clickHandler;
    let onClick;
    async function setupLayerView(jmv, activeLayer) {
      if (jmv && activeLayer) {
        const layerView = await jmv.view.whenLayerView(activeLayer);

        // Define the click event handler
        clickHandler = async (evt) => {
          const opts = {
            include: activeLayer,
          };

          console.log(activeLayer);
          console.log(layerView.highlightOptions);

          const response = await jmv.view.hitTest(evt, opts);
          console.log(response);

          if (response.results.length > 0) {
            const graphic = response.results[0].graphic;
            console.log(graphic.attributes);
            console.log(activeLayer.declaredClass);
            handleMapZoneClick(graphic.attributes);
            //layerView.highlight(graphic.attributes["objectid"]);
          }
        };

        // Add click event listener to the view
        onClick = jmv.view.on("click", clickHandler);
        console.log(onClick);
      }
    }

    setupLayerView(jmv, zone.dataset);
    console.log(onClick);
    // Cleanup function to remove the event listener
    return () => {
      if (clickHandler) {
        onClick.remove();
      }
    };
  }, [jmv, zone]);

  function convertToUTC(timeEpoch) {
    var d = new Date(timeEpoch);
    return d.getUTCFullYear();
  }

  React.useEffect(() => {
    if (zone.dataset && dataSource.source) {
      const table = zone.tables.filter((table) =>
        table.title.includes(dataSource.source.split(" ")[1])
      )[0];
      const table2 = var2
        ? zone.tables.filter((table) =>
            table.title.includes(var2.split(":")[0].split(" ")[1])
          )[0]
        : undefined;
      async function loadTableStructure(table) {
        try {
          if (table.type === "feature") {
            await table.load();
            console.log(table);
            const query = table.createQuery();
            query.returnDistinctValues = true;
            query.outFields = ["stdtime"];

            const uniqueValuesResults = await table.queryFeatures(query);
            const uniqueYears = uniqueValuesResults.features.map((feature) =>
              convertToUTC(feature.attributes.stdtime)
            );
            console.log("Unique values in 'variable' field:", uniqueYears);
            return uniqueYears;
          }
        } catch (error) {
          console.error("Error loading table:", error);
        }
      }
      (async () => {
        const uniqueYears1 = await loadTableStructure(table);
        const uniqueYears2 =
          table2 && plotType === 1
            ? await loadTableStructure(table2)
            : undefined;
        const uniqueYears = uniqueYears2
          ? uniqueYears1.filter((year) => uniqueYears2.includes(year))
          : uniqueYears1;
        const minYear = Math.min(...uniqueYears);
        const maxYear = Math.max(...uniqueYears);
        setYearRange(uniqueYears);
        if (
          !uniqueYears.includes(yearValues.min) ||
          !uniqueYears.includes(yearValues.max) ||
          yearValues.min == Math.min(...yearRange) ||
          yearValues.max == Math.max(...yearRange)
        ) {
          const newYearValues = {
            ...yearValues,
            min:
              !uniqueYears.includes(yearValues.min) ||
              yearValues.min == Math.min(...yearRange)
                ? minYear
                : yearValues.min,
            max:
              !uniqueYears.includes(yearValues.max) ||
              yearValues.max == Math.max(...yearRange)
                ? maxYear
                : yearValues.max,
          };
          console.log(newYearValues);
          setYearValues(newYearValues);
        }
      })();
    }
  }, [zone.dataset, dataSource.source, var2, plotType]);

  React.useEffect(() => {
    if (zone.dataset && dataSource.source && var1) {
      console.log(zoneSubset);
      //const zoneSubsetString = zoneSubset.map((zone) => zone.name);
      const zoneSubsetString = zoneSubset
        .map((id) => `'${id.value}'`)
        .join(", ");
      if (plotType == 0) {
        //const query = `zone_name IN ('inn', 'ykf') AND variable = 'first_snow_day' AND stdtime >= date '2001-01-01' AND stdtime <= date '2020-01-01'`;
        //zone_name IN "'Innoko, Kanuti, Yukon Flats'" AND
        //const query = `zone_name IN (${zoneSubsetString}) AND variable = '${var1}' AND stdtime >= date '${yearValues.min}-01-01' AND stdtime <= date '${yearValues.max}-01-01'`;
        const query = `zone_name IN (${zoneSubsetString}) AND variable = '${var1}' AND stdtime >= date '${yearValues.min}-01-01' AND stdtime <= date '${yearValues.max}-01-01'`;
        console.log("setting query");
        setTableQuery([query]);
      } else if (plotType == 1) {
        const query1 = `zone_name IN (${zoneSubsetString}) AND variable = '${var1}' AND stdtime >= date '${yearValues.min}-01-01' AND stdtime <= date '${yearValues.max}-01-01'`;
        const query2 = `zone_name IN (${zoneSubsetString}) AND variable = '${
          var2.split(": ")[1]
        }' AND stdtime >= date '${yearValues.min}-01-01' AND stdtime <= date '${
          yearValues.max
        }-01-01'`;
        setTableQuery([query1, query2]);
      }
    }
  }, [zone, dataSource, zoneSubset, plotType, var1, var2, yearValues]);

  async function dispatchTable() {
    async function loadTableStructure(table, queryString) {
      try {
        if (table.type === "feature") {
          await table.load();
          console.log(table.fields.map((field) => field.name));
          const query = table.createQuery();
          query.returnDistinctValues = true;
          query.where = queryString;
          console.log(queryString);
          const queryResults = await table.queryFeatures(query);
          //const csvString = convertFeaturesToCSV(queryResults.features);
          return queryResults.features.map((feature) => feature.attributes);
        }
      } catch (error) {
        console.error("Error loading table:", error);
      }
    }

    if (plotType === 0) {
      if (zone.dataset && dataSource.source && var1) {
        const table = zone.tables.filter((table) =>
          table.title.includes(dataSource.source.split(" ")[1])
        )[0];
        if (table) {
          const dataTableResult = await loadTableStructure(
            table,
            tableQuery[0]
          );
          setDataTable([dataTableResult]);
        } else {
          console.error("No matching table found.");
        }
      } else {
        console.error("Required conditions are not met.");
      }
    }
    if (plotType === 1) {
      if (zone.dataset && dataSource.source && var1 && var2) {
        const table1 = zone.tables.filter((table) =>
          table.title.includes(dataSource.source.split(" ")[1])
        )[0];
        console.log(var2.split(":")[0]);
        const table2 = zone.tables.filter((table) =>
          table.title.includes(var2.split(":")[0].split(" ")[1])
        )[0];
        if (table1 && table2) {
          const dataTable1Result = await loadTableStructure(
            table1,
            tableQuery[0]
          );
          const dataTable2Result = await loadTableStructure(
            table2,
            tableQuery[1]
          );
          setDataTable([dataTable1Result, dataTable2Result]);
        } else {
          console.error("Error fetching table(s).");
        }
      } else {
        console.error("Required conditions are not met.");
      }
    }
  }

  function handleZoneClick(layerItem) {
    if (zone.dataset?.title === layerItem.title) {
      console.log("already selected");
      return;
    }
    let polygonItems: { label: string; value: string; objectid: number }[];
    console.log("querying zone tables");
    const query = layerItem.createQuery();
    query.outFields = ["name, zone_name, objectid"];
    query.returnGeometry = false;
    layerItem.queryFeatures(query).then(function (results) {
      console.log(results);
      polygonItems = Array.isArray(results.features)
        ? [
            { label: "Select All", value: "select_all", objectid: null },
            ...results.features.map((feature) => ({
              label: feature.attributes.name || "Unnamed Polygon",
              value: feature.attributes.zone_name || "No Code",
              objectid: feature.attributes.objectid || 0,
            })),
          ]
        : [];
      if (zone.dataset) {
        zone.dataset.visible = false;
      }
      setZone({
        dataset: layerItem,
        title: layerItem.title.split(" - ")[1],
        tables: jmv.view.map.tables.items.filter(
          (item) => item.url === layerItem.url
        ),
        polygons: polygonItems,
      });

      console.log(polygonItems);
      setZoneSubset(polygonItems.filter((poly) => poly.value !== "select_all"));
    });
    layerItem.visible = true;
    layerItem.outFields = ["*"];
    // loadArcGISJSAPIModules(["esri/layers/FeatureLayer"]).then(
    //   ([FeatureLayer]) => {
    //     const featureLayer = new FeatureLayer({
    //       layerItem,
    //     });
    //     console.log(featureLayer.declaredClass);
    //     setActiveLayer(layerItem);
    //   }
    // );
    // console.log(polygonItems);
    // highlightZones(polygonItems.map((poly) => poly.value));
  }
  const highlightedRef = React.useRef(null);
  const highlightZones = async (zone_name) => {
    const layerView = await jmv.view.whenLayerView(zone.dataset);
    console.log(zone_name);
    console.log(zone.polygons);
    const objectIds = zone.polygons
      .filter(
        (poly) => zone_name.includes(poly.value) && poly.value !== "select_all"
      )
      .map((poly) => poly.objectid);

    console.log(highlightedRef);
    console.log(objectIds);
    console.log(zoneSubset);
    if (highlightedRef.current) {
      highlightedRef.current.remove();
    }
    highlightedRef.current = layerView.highlight(objectIds);
  };
  function handleZoneSubsetClick(allItems) {
    console.log(allItems);
    console.log([...allItems.filter((poly) => poly.value !== "select_all")]);
    setZoneSubset([...allItems.filter((poly) => poly.value !== "select_all")]);
    //highlightZones(allItems.map((item) => item.value));
  }

  // function handleZoneSubsetClick(item, allItems) {
  //   if (item && item.value === "select_all") {
  //     const allValues = allItems
  //       .filter((i) => i.value !== "select_all")
  //       .map((i) => i.value);
  //     setZoneSubset([...allValues]);
  //   } else if (!item) {
  //     // Handle the case where all items are unselected
  //     setZoneSubset([]);
  //   } else {
  //     setZoneSubset([...allItems]);
  //   }
  // }
  function handleVar1Click(variable) {
    console.log(variable);
    const formattedVariable = variable.replace(/\s+/g, "_");
    //console.log(formattedVariable);
    console.log(props.config.AllowedCombinations);
    setVar1(variable);
    loadArcGISJSAPIModules(["esri/layers/ImageryLayer"]).then(
      ([ImageryLayer]) => {
        const imageryLayer = new ImageryLayer({
          //url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/NLCDLandCover2001/ImageServer",
          url: "https://gis.fws.gov/image/rest/services/NDVI_Value_of_Onset_of_Greenness/ImageServer",
          //portalItem: "de283b79dfc84d7388a72af64ecd5bdc",
        });
        console.log(imageryLayer);
        console.log(imageryLayer.declaredClass);
        imageryLayer.visible = true;
        jmv.view.map.add(imageryLayer);
      }
    );
    setvar2Options(props.config.AllowedCombinations[variable].asMutable());
    //var2 && setVar2("");
    //var2 && console.log(var2);
  }

  React.useEffect(() => {
    if (dataSource.source) {
      setVar2("");
    }
  }, [dataSource.source, var1]);
  function handleVar2Click(variable) {
    console.log(variable);
    setVar2(variable);
  }

  React.useEffect(() => {
    if (dataSource.source && props.config.DataSources) {
      const dataSourceConfig = props.config.DataSources[dataSource.source];
      if (dataSourceConfig.variables.includes(var1)) {
      } else {
        setVar1(null);
      }
    }
  }, [dataSource.source]);

  function handleDataSourceClick(dataSource) {
    setDataSource({
      source: dataSource,
      variables: Array.from(props.config.DataSources[dataSource].variables),
    });
    console.log(props.config.DataSources);
  }

  const handlePlotTypeChange = (
    evt: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
    index: number
  ) => {
    console.log(index);
    setPlotType(index);
  };

  const zoneDatasetRef = React.useRef(zone.dataset);

  React.useEffect(() => {
    zoneDatasetRef.current = zone.dataset;
  }, [zone.dataset]);

  // const setCSSVariables = (theme) => {
  //   const colors = theme.colors;
  //   const variables = {};

  //   for (const [key, value] of Object.entries(colors)) {
  //     variables[`--${key}`] = value;
  //   }

  //   return variables;
  // };

  // const colorStyle = setCSSVariables(props.theme);

  return (
    <div className="render-container">
      {props.useMapWidgetIds && props.useMapWidgetIds.length === 1 && (
        <JimuMapViewComponent
          useMapWidgetId={props.useMapWidgetIds?.[0]}
          onActiveViewChange={activeViewChangeHandler}
        />
      )}
      <h3>Area of Interest</h3>

      <Dropdown className="dropdown">
        <DropdownButton>
          {zone?.dataset ? zone.title : `Feature Layers`}
        </DropdownButton>
        <DropdownMenu>
          <ZoneDropdown
            zones={jmv?.view.map.layers.items}
            handleZoneClick={handleZoneClick}
          />
        </DropdownMenu>
      </Dropdown>

      {/* <DrawTool
        jmv={jmv}
        activeLayer={zone.dataset}
        handleDraw={handleZoneSubsetClick}
        theme={props.theme}
      ></DrawTool> */}

      <h4>Zone Selection</h4>
      {!zone.dataset ? (
        <Dropdown className="dropdown">
          <DropdownButton disabled={true}>Select Zone Dataset</DropdownButton>
        </Dropdown>
      ) : (
        <ZoneSubsetSelect
          polygons={zone.polygons}
          selectedZones={zoneSubset}
          handleZoneSubsetClick={handleZoneSubsetClick}
        />
      )}

      <h3>Primary Data Source</h3>
      <Dropdown className="dropdown">
        <DropdownButton>
          {dataSource.source ? dataSource.source : `Select Data Source`}
        </DropdownButton>
        <DropdownMenu>
          <DataSourceDropdown
            dataSources={props.config.DataSources}
            handleDataSourceClick={handleDataSourceClick}
          />
        </DropdownMenu>
      </Dropdown>

      <h4>Primary Variable</h4>

      <Dropdown className="dropdown">
        <DropdownButton disabled={!dataSource.source}>
          {dataSource.source && var1 ? var1 : "Please Select"}
        </DropdownButton>
        <DropdownMenu>
          <Var1Dropdown
            dataSource={dataSource.source}
            variables={dataSource.variables}
            handleVarClick={handleVar1Click}
          />
        </DropdownMenu>
      </Dropdown>

      <h4>Secondary Variable </h4>

      <Dropdown className="dropdown">
        <DropdownButton disabled={plotType != 1 || !dataSource.source || !var1}>
          {dataSource.source && var2 ? var2 : "Please Select"}
        </DropdownButton>
        <DropdownMenu>
          <Var2Dropdown
            sourceVariables={var2Options}
            handleVarClick={handleVar2Click}
          />
        </DropdownMenu>
      </Dropdown>

      <h4>Type of Plot</h4>
      <Label>
        <Radio
          name="timeseries"
          checked={plotType === 0}
          onChange={(evt, checked) => {
            handlePlotTypeChange(evt, checked, 0);
          }}
        />
        Time Series
      </Label>
      <br />
      <Label>
        <Radio
          name="scatterplot"
          checked={plotType === 1}
          onChange={(evt, checked) => {
            handlePlotTypeChange(evt, checked, 1);
          }}
        />
        Scatter Plot
      </Label>

      <h4>Time Range</h4>

      {yearRange && (
        <div>
          <YearSlider
            min={Math.min(...yearRange)}
            max={Math.max(...yearRange)}
            step={1}
            value={yearValues}
            onChange={setYearValues}
            theme={props.theme}
          />
        </div>
      )}

      <Button
        onClick={dispatchTable}
        disabled={!Object.keys(tableQuery).length}
        size="default"
      >
        Generate Table
      </Button>
    </div>
  );
}
