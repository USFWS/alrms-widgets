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
//import ZoneSubsetSelect from "./ZoneSubsetSelect";
import DataSourceDropdown from "./DataSourceDropdown";
import YearSlider from "./YearSlider";
//import DrawTool from "./DrawTool";
//import ZoneSubsetGeo from "./ZoneSubsetGeo";
import { loadArcGISJSAPIModules } from "jimu-arcgis";
import ZoneSelection from "./ZoneSelection";

export default function Widget(props: AllWidgetProps<IMConfig>) {
  //console.log("Props:", props);

  const [jmv, setJmv] = React.useState<JimuMapView | null>(null);
  const [initialZones, setInitialZones] = React.useState([]);
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
  console.log(zone);
  const [zoneSubsets, setZoneSubsets] = React.useState([
    {
      groupId: 1,
      polygons: [],
    },
  ]);
  const [graphicsLayers, setGraphicsLayers] = React.useState({});
  const [var1, setVar1] = React.useState("");
  const [var2Options, setVar2Options] = React.useState([]);
  const [var2, setVar2] = React.useState("");
  const [ancillary, setAncillary] = React.useState(false);
  const [dataSource, setDataSource] = React.useState({
    source: "",
    variables: [],
  });
  const [dataTable, setDataTable] = React.useState([]);
  const [plotType, setPlotType] = React.useState(0);
  const [yearRange, setYearRange] = React.useState([2000, 2025]);
  const [yearValues, setYearValues] = React.useState({
    min: Math.min(...yearRange),
    max: Math.max(...yearRange),
  });
  const [tableQuery, setTableQuery] = React.useState([]);

  const activeViewChangeHandler = (jmv: JimuMapView) => {
    if (jmv && jmv.view.map) {
      setJmv(jmv);
      setInitialZones(
        jmv?.view.map.layers.items.filter((item) => item.type == "feature")
      );
    }
  };
  //console.log(zoneSubsets);
  //console.log(tableQuery);
  //console.log(dataTable);

  React.useEffect(() => {
    props.dispatch(
      appActions.widgetStatePropChange("widget_comms", "dataTable", dataTable)
    );
    props.dispatch(
      appActions.widgetStatePropChange("widget_comms", "plotType", plotType)
    );
    props.dispatch(
      appActions.widgetStatePropChange("widget_comms", "ancillary", ancillary)
    );
  }, [dataTable]);

  const zoneSubsetRef = React.useRef(zoneSubsets);

  React.useEffect(() => {
    if (jmv && zone) {
      zoneSubsetRef.current = zoneSubsets;
      console.log("zoneSubsets changed", zoneSubsets);
      highlightZones(
        zoneSubsets.reduce((acc, group) => {
          acc[group.groupId] = acc[group.groupId] || [];
          const oids = group.polygons.map((polygon) => polygon.objectid);
          acc[group.groupId].push(...oids);
          console.log(acc);
          return acc;
        }, {})
      );
    }
  }, [zoneSubsets]);

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
      console.log(zoneSubsets);
      const tableQueries = [];
      for (let i = 0; i < zoneSubsets.length; i++) {
        console.log(zoneSubsets[i].polygons);
        const zoneSubsetString = zoneSubsets[i].polygons
          .map((id) => `'${id.value}'`)
          .join(", ");
        if (plotType == 0) {
          const query = `zone_name IN (${zoneSubsetString}) AND variable = '${var1}' AND stdtime >= date '${yearValues.min}-01-01' AND stdtime <= date '${yearValues.max}-01-01'`;
          console.log("setting query");
          tableQueries.push(query);
        } else if (plotType == 1) {
          const query1 = `zone_name IN (${zoneSubsetString}) AND variable = '${var1}' AND stdtime >= date '${yearValues.min}-01-01' AND stdtime <= date '${yearValues.max}-01-01'`;
          const query2 = `zone_name IN (${zoneSubsetString}) AND variable = '${
            var2.split(": ")[1]
          }' AND stdtime >= date '${
            yearValues.min
          }-01-01' AND stdtime <= date '${yearValues.max}-01-01'`;
          tableQueries.push([query1, query2]);
        }
      }
      console.log("Table Queries Set:", tableQueries);
      setTableQuery(tableQueries);
    }
  }, [zone, dataSource, zoneSubsets, plotType, var1, var2, yearValues]);

  async function dispatchTable() {
    async function loadTableStructure(table, queryString, index) {
      try {
        if (table.type === "feature") {
          await table.load();
          const query = table.createQuery();
          query.returnDistinctValues = true;
          query.maxRecordCountFactor = 5;
          query.where = queryString;
          console.log(queryString);
          const queryResults = await table.queryFeatures(query);
          console.log(queryResults);
          if (
            queryResults.features.length ==
            2000 * query.maxRecordCountFactor
          ) {
            alert(
              `Results for Group ${index + 1} may have exceeded query limits (${
                2000 * query.maxRecordCountFactor
              } table rows) and truncated data.\n Suggest limiting time range or geographic area of group.`
            );
          }
          return queryResults.features.map((feature) => feature.attributes);
        }
      } catch (error) {
        console.error("Error loading table:", error);
      }
    }
    if (plotType === 0) {
      if (
        zone.dataset &&
        dataSource.source &&
        zoneSubsets[0].polygons.length &&
        var1
      ) {
        const table = zone.tables.filter((table) =>
          table.title.includes(dataSource.source.split(" ")[1])
        )[0];
        if (table) {
          const dataTableResults = await Promise.all(
            tableQuery.map(async (query, index) => {
              const dataTableResult = await loadTableStructure(
                table,
                query,
                index
              );
              return dataTableResult;
            })
          );
          setDataTable([dataTableResults]);
        } else {
          console.error("No matching table found.");
        }
      } else {
        alert("Required conditions are not met.");
      }
    }
    if (plotType === 1) {
      if (
        zone.dataset &&
        dataSource.source &&
        zoneSubsets[0].polygons.length &&
        var1 &&
        var2
      ) {
        const table1 = zone.tables.filter((table) =>
          table.title.includes(dataSource.source.split(" ")[1])
        )[0];
        let table2;
        if (var2.toLowerCase().includes("ancillary")) {
          table2 = zone.tables.filter((table) =>
            table.title.toLowerCase().includes("ancillary")
          )[0];
          setAncillary(true);
        } else {
          table2 = zone.tables.filter((table) =>
            table.title.includes(var2.split(":")[0].split(" ")[1])
          )[0];
          setAncillary(false);
        }
        if (table1 && table2) {
          const dataTable1Results = await Promise.all(
            tableQuery.map(async (query, index) => {
              const dataTable1Result = await loadTableStructure(
                table1,
                query[0],
                index
              );
              return dataTable1Result;
            })
          );
          const dataTable2Results = await Promise.all(
            tableQuery.map(async (query, index) => {
              const dataTable2Result = await loadTableStructure(
                table2,
                query[1],
                index
              );
              return dataTable2Result;
            })
          );
          setDataTable([dataTable1Results, dataTable2Results]);
        } else {
          console.error("Error fetching table(s).");
        }
      } else {
        alert("Required conditions are not met.");
      }
    }
  }

  function handleZoneClick(layerItem) {
    if (zone.dataset?.title === layerItem.title) {
      console.log("already selected");
      return;
    }
    if (zone.dataset) {
      zone.dataset.visible = false;
      setZoneSubsets([
        {
          groupId: 1,
          polygons: [],
        },
      ]);
    }
    console.log(layerItem);

    let polygonItems: { label: string; value: string; objectid: number }[];
    console.log("querying zone tables");
    const query = layerItem.createQuery();
    query.returnGeometry = false;

    const tryQuery = (query) => {
      query.outFields = ["name, zone_name, objectid"];
      return layerItem
        .queryFeatures(query)
        .then(function (results) {
          console.log(results);
          return results;
        })
        .catch((e) => {
          console.log(e);
          query.outFields = ["zone_name, objectid"];
          return layerItem
            .queryFeatures(query)
            .then(function (results) {
              console.log(results);
              return results;
            })
            .catch((e) => {
              console.log(e);
              throw e;
            });
        });
    };

    tryQuery(query)
      .then((results) => {
        console.log(results);
        console.log(results.features.length);
        if (results.features.length < 2000) {
          polygonItems = Array.isArray(results.features)
            ? [
                { label: "Select All", value: "select_all", objectid: null },
                ...results.features.map((feature) => ({
                  label:
                    feature.attributes.name ||
                    feature.attributes.zone_name ||
                    "Unnamed Polygon",
                  value: feature.attributes.zone_name || "No Code",
                  objectid: feature.attributes.objectid || 0,
                })),
              ]
            : [];

          setZone({
            dataset: layerItem,
            title: layerItem.title.split(" - ")[1],
            tables: jmv.view.map.tables.items.filter(
              (item) => item.url === layerItem.url
            ),
            polygons: polygonItems,
          });
          console.log(polygonItems);
        } else {
          setZone({
            dataset: layerItem,
            title: layerItem.title.split(" - ")[1],
            tables: jmv.view.map.tables.items.filter(
              (item) => item.url === layerItem.url
            ),
            polygons: [],
          });
        }
      })
      .catch((error) => {
        console.log("Query Error:", error);
      });
    layerItem.visible = true;
    layerItem.outFields = ["*"];
  }

  const highlightZones = async (zone_oids) => {
    console.log("Highlight function triggered");
    const updateGroupLayer = async (groupId, polygons) => {
      loadArcGISJSAPIModules([
        "esri/layers/GraphicsLayer",
        "esri/Graphic",
      ]).then(async ([GraphicsLayer, Graphic]) => {
        let newGraphicsLayers = { ...graphicsLayers };
        let groupLayer = newGraphicsLayers[groupId];
        if (!groupLayer) {
          console.log(`Adding group layer: ${groupId}`);
          groupLayer = new GraphicsLayer({
            title: `New Group ${groupId}`,
            id: `groupLayer-${groupId}`,
          });
          jmv.view.map.add(groupLayer);
          newGraphicsLayers[groupId] = groupLayer;
        }
        graphicsLayers[groupId.toString()] = groupLayer;

        const color = getColorByGroupId(parseInt(groupId, 10));
        const graphics = await Promise.all(
          polygons.map((polygon) => {
            return new Graphic({
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
            });
          })
        );

        groupLayer.removeAll();
        groupLayer.addMany(graphics);
        console.log("setting:", newGraphicsLayers);
        setGraphicsLayers(newGraphicsLayers);
      });
    };

    const removeGroupLayer = (groupId) => {
      const groupLayer = graphicsLayers[groupId];
      if (groupLayer) {
        jmv.view.map.remove(groupLayer);
        delete graphicsLayers[groupId];
      }
    };

    function getColorByGroupId(groupId) {
      switch (groupId) {
        case 1:
          return [255, 0, 0, 0.4];
        case 2:
          return [0, 255, 0, 0.4];
        case 3:
          return [0, 0, 255, 0.4];
        default:
          return [255, 255, 0, 0.4];
      }
    }

    console.log(zone_oids);
    let OIDSubsetString;

    async function fetchGeometries(layer, oidString) {
      console.log(oidString);
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
    const fetchGeometriesForGroups = async () => {
      const geometriesByGroupId = {};

      await Promise.all(
        Object.keys(zone_oids).map(async (group) => {
          OIDSubsetString = zone_oids[group].map((id) => `${id}`).join(", ");
          console.log(OIDSubsetString);
          let geometries;
          if (!OIDSubsetString) {
            geometries = {};
          } else {
            geometries = await fetchGeometries(zone.dataset, OIDSubsetString);
          }
          console.log(geometries);
          const groupId = parseInt(group, 10);
          if (!geometriesByGroupId[groupId]) {
            geometriesByGroupId[groupId] = [];
          }
          console.log(geometries.length);
          geometries.length && geometriesByGroupId[groupId].push(...geometries);
        })
      );

      return geometriesByGroupId;
    };

    const geoms = await fetchGeometriesForGroups();
    console.log(geoms);
    console.log(graphicsLayers);
    for (const groupId of Object.keys(geoms)) {
      console.log(groupId);
      console.log(geoms[groupId]);
      console.log(graphicsLayers);
      if (geoms[groupId].length > 0) {
        await updateGroupLayer(groupId, geoms[groupId]);
      } else {
        removeGroupLayer(groupId);
      }
    }
    for (const groupId of Object.keys(graphicsLayers)) {
      if (!Object.keys(geoms).includes(groupId)) {
        removeGroupLayer(groupId);
      }
    }
  };
  function handleZoneSubsetClick(allItems, group_id) {
    console.log(allItems);
    console.log(group_id);
    const newPolys = [
      ...allItems.filter((poly) => poly.value !== "select_all"),
    ];
    console.log(newPolys);
    console.log(zoneSubsets);
    setZoneSubsets((prevGroups) =>
      prevGroups.map((group) =>
        group.groupId === group_id ? { ...group, polygons: newPolys } : group
      )
    );
  }

  function handleVar1Click(variable) {
    console.log(variable);
    const formattedVariable = variable.replace(/\s+/g, "_");
    //console.log(formattedVariable);
    console.log(props.config.AllowedCombinations);
    setVar1(variable);
    //loadArcGISJSAPIModules(["esri/layers/ImageryLayer"]).then(
    //  ([ImageryLayer]) => {
    //    const imageryLayer = new ImageryLayer({
    //url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/NLCDLandCover2001/ImageServer",
    //      url: "https://gis.fws.gov/image/rest/services/ALRMS/MODIS_Snow/ImageServer",
    //portalItem: "de283b79dfc84d7388a72af64ecd5bdc",
    //    });
    //    console.log(imageryLayer);
    //    console.log(imageryLayer.declaredClass);
    //    imageryLayer.visible = true;
    //    jmv.view.map.add(imageryLayer);
    //  }
    //);
    setVar2Options(props.config.AllowedCombinations[variable].asMutable());
    //var2 && setVar2("");
    //var2 && console.log(var2);
  }

  React.useEffect(() => {
    if (zone && var1) {
      const allowedCombs = props.config.AllowedCombinations[var1].asMutable();
      const ancillaryTable = zone.tables.filter((table) =>
        table.title.includes("Ancillary")
      );
      if (ancillaryTable.length === 1) {
        const query = ancillaryTable[0].createQuery();
        query.returnGeometry = false;

        const tryQuery = (query) => {
          query.outFields = ["variable"];
          return ancillaryTable[0]
            .queryFeatures(query)
            .then(function (results) {
              return results;
            });
        };
        tryQuery(query).then((results) => {
          const uniqueValues = [
            ...new Set(
              results.features.map((feature) => feature.attributes.variable)
            ),
          ];
          setVar2Options({
            ...allowedCombs,
            ...{ "Ancillary Data": uniqueValues },
          });
        });
      }
    }
  }, [zone, var1]);

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
            zones={initialZones}
            handleZoneClick={handleZoneClick}
          />
        </DropdownMenu>
      </Dropdown>

      <h4>Zone Selection</h4>
      <ZoneSelection
        zone={zone}
        zoneSubsets={zoneSubsets}
        handleZoneSubsetClick={handleZoneSubsetClick}
        jmv={jmv}
        theme={props.theme}
        setZoneSubsets={setZoneSubsets}
      ></ZoneSelection>

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
            disabled={!dataSource.source}
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
