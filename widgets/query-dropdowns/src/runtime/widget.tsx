/** @jsx jsx */
import { React, type AllWidgetProps, jsx } from "jimu-core";
import { type IMConfig } from "../config";
import { getStyle } from "./style";
import { JimuMapViewComponent, JimuMapView } from "jimu-arcgis";
import {
  Dropdown,
  DropdownMenu,
  DropdownButton,
  Radio,
  Label,
  Button,
  Alert,
} from "jimu-ui";
import { appActions } from "jimu-core";
import Var1Dropdown from "./Var1Dropdown";
import Var2Dropdown from "./Var2Dropdown";
import ZoneDropdown from "./ZoneDropdown";
import DataSourceDropdown from "./DataSourceDropdown";
import YearSlider from "./YearSlider";
import ZoneSelection from "./ZoneSelection";
import { useZoneHighlight } from "./hooks/useZoneHighlight";
import {
  useYearRange,
  useTableQueries,
  useVar2Options,
  useVar2Reset,
  useVar1Validation,
} from "./hooks/useDataFetching";
// Imagery layer and time slider hooks for future addition
//import { useImageryLayer } from "./hooks/useImageryLayer";
//import { useImageryTimeSlider } from "./hooks/useImageryTimeSlider";
import { dispatchTableData } from "./utils/dataService";
import { handleZoneSelection } from "./utils/zoneService";
import type { Zone, ZoneSubset, GraphicsLayerMap } from "./types";
import { PlotType } from "./types";

export default function Widget(props: AllWidgetProps<IMConfig>) {

  const [jmv, setJmv] = React.useState<JimuMapView | null>(null);
  const [initialZones, setInitialZones] = React.useState([]);
  const [zone, setZone] = React.useState<Zone>({
    dataset: null,
    title: "",
    tables: [],
    polygons: [],
  });
  const [zoneSubsets, setZoneSubsets] = React.useState<ZoneSubset[]>([
    {
      groupId: 1,
      polygons: [],
    },
  ]);
  const [graphicsLayers, setGraphicsLayers] = React.useState<GraphicsLayerMap>({});
  const [multGroups, setMultGroups] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [warning, setWarning] = React.useState<string | null>(null);
  const [var1, setVar1] = React.useState("");
  const [var2Options, setVar2Options] = React.useState([]);
  const [var2, setVar2] = React.useState("");
  const [ancillary, setAncillary] = React.useState(false);
  const [dataSource, setDataSource] = React.useState({
    source: "",
    variables: [],
  });
  const [dataTable, setDataTable] = React.useState([]);
  const [plotType, setPlotType] = React.useState<PlotType>(PlotType.TIME_SERIES);
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
        jmv?.view.map.layers.toArray().filter((item) => item.type === "feature")
      );
    }
  };

  React.useEffect(() => {
    props.dispatch(
      appActions.widgetStatePropChange("widget_comms", "dataTable", dataTable)
    );
  }, [dataTable]);

  // Use custom hooks for data fetching
  useZoneHighlight(jmv, zone, zoneSubsets, graphicsLayers, setGraphicsLayers, multGroups);
  useYearRange(zone, dataSource, var2, plotType, yearRange, yearValues, setYearRange, setYearValues);
  useTableQueries(zone, dataSource, var1, var2, plotType, zoneSubsets, yearValues, setTableQuery);
  useVar2Options(zone, var1, props, setVar2Options);
  useVar2Reset(dataSource, var1, setVar2);
  useVar1Validation(dataSource, var1, props.config, setVar1);

  // Imagery implementation placeholder
  //const imageryLayer = useImageryLayer(jmv, dataSource.source, var1, props.config, (error) => {
  //  setWarning("Failed to load imagery layer. The service may be unavailable.");
  //});
  //useImageryTimeSlider(jmv, imageryLayer, !!imageryLayer);

  async function dispatchTable() {
    const result = await dispatchTableData({
      zone,
      dataSource,
      zoneSubsets,
      var1,
      var2,
      plotType,
      tableQuery,
      onWarning: setWarning,
      onError: setError,
      onAncillaryChange: setAncillary,
    });
    
    if (result) {
      setDataTable(result);
      props.dispatch(
        appActions.widgetStatePropChange("widget_comms", "plotType", plotType)
      );
      props.dispatch(
        appActions.widgetStatePropChange("widget_comms", "ancillary", ancillary)
      );
      props.dispatch(
        appActions.widgetStatePropChange("widget_comms", "multGroups", multGroups)
      );
    }
  }

  function handleZoneClick(layerItem) {
    handleZoneSelection({
      layerItem,
      jmv,
      currentZone: zone,
      onZoneUpdate: setZone,
      onZoneSubsetsReset: () => setZoneSubsets([{ groupId: 1, polygons: [] }]),
    });
  }


  function handleZoneSubsetClick(allItems, group_id) {
    const newPolys = [
      ...allItems.filter((poly) => poly.value !== "select_all"),
    ];
    setZoneSubsets((prevGroups) =>
      prevGroups.map((group) =>
        group.groupId === group_id ? { ...group, polygons: newPolys } : group
      )
    );
  }

  function handleVar1Click(variable) {
    setVar1(variable);
  }

  function handleVar2Click(variable) {
    setVar2(variable);
  }

  function handleDataSourceClick(dataSource) {
    setDataSource({
      source: dataSource,
      variables: Array.from(props.config.DataSources[dataSource].variables),
    });
  }

  const handlePlotTypeChange = (
    evt: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
    index: number
  ) => {
    setPlotType(index);
  };

  // Validate required props
  if (!props.useMapWidgetIds || props.useMapWidgetIds.length === 0) {
    return (
      <div css={getStyle(props.theme)}>
        <Alert
          type="info"
          form="basic"
          size="small"
          text="Please configure a map widget in the widget settings."
          withIcon
          open
        />
      </div>
    );
  }

  return (
    <div css={getStyle(props.theme)}>
      {props.useMapWidgetIds.length === 1 && (
        <JimuMapViewComponent
          useMapWidgetId={props.useMapWidgetIds?.[0]}
          onActiveViewChange={activeViewChangeHandler}
        />
      )}
      
      {error && (
        <Alert
          type="error"
          form="basic"
          size="small"
          text={error}
          onClose={() => setError(null)}
          closable
          withIcon
          open
        />
      )}
      
      {warning && (
        <Alert
          type="warning"
          form="basic"
          size="small"
          text={warning}
          onClose={() => setWarning(null)}
          closable
          withIcon
          open
        />
      )}
      
      <h3>Polygon Dataset</h3>

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
        multGroups={multGroups}
        setMultGroups={setMultGroups}
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

      <h4>Secondary Variable</h4>

      <Dropdown className="dropdown">
        <DropdownButton disabled={plotType !== PlotType.SCATTER || !dataSource.source || !var1}>
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
          checked={plotType === PlotType.TIME_SERIES}
          onChange={(evt, checked) => {
            handlePlotTypeChange(evt, checked, PlotType.TIME_SERIES);
          }}
        />
        Time Series
      </Label>
      <br />
      <Label>
        <Radio
          name="scatterplot"
          checked={plotType === PlotType.SCATTER}
          onChange={(evt, checked) => {
            handlePlotTypeChange(evt, checked, PlotType.SCATTER);
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
        disabled={tableQuery.length === 0}
        size="default"
      >
        Generate Table
      </Button>
    </div>
  );
}
