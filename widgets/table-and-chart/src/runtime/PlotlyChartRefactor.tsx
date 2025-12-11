import React from "react";
import PlotComponent from "./PlotComponent";
import { Button } from "jimu-ui";
import { PlotType, PlotMode } from "./constants";
import {
  averageGroups,
  combineXYdata,
  DataItem,
} from "./utils/dataProcessing";
import {
  formatText,
  getColorByGroupId,
  getYearFromTime,
} from "./utils/formatting";

interface PlotlyChartRefactorProps {
  dataTable: DataItem[][][];
  plotType: PlotType;
  ancillary?: boolean;
  multGroups?: boolean;
}

type StatisticType = "mean" | "median";

interface ChartLabels {
  title: string;
  xAxisTitle: string;
  yAxisTitle: string;
}

interface TraceData {
  x: (number | string)[];
  y: number[];
  text?: (number | string)[];
  mode: string;
  type: string;
  marker: {
    size: number;
    color?: string;
  };
  name: string;
  error_y?: {
    type: string;
    array: number[];
    visible: boolean;
  };
}



export default function PlotlyChartRefactor({
  dataTable,
  plotType,
  ancillary = false,
  multGroups = false,
}: PlotlyChartRefactorProps) {
  const [mode, setMode] = React.useState<PlotMode>(PlotMode.MARKERS);
  const [error, setError] = React.useState<string | null>(null);
  const [statistic, setStatistic] = React.useState<StatisticType>("mean");
  const [showErrorBars, setShowErrorBars] = React.useState<boolean>(false);
  const [hasData, setHasData] = React.useState<boolean>(false);
  const [labels, setLabels] = React.useState<ChartLabels>({
    title: "Chart",
    xAxisTitle: "X Axis",
    yAxisTitle: "Y Axis",
  });
  const [traces, setTraces] = React.useState<TraceData[]>([]);

  const toggleMode = () => {
    setMode((prevMode) =>
      prevMode === PlotMode.MARKERS
        ? PlotMode.LINES_AND_MARKERS
        : PlotMode.MARKERS
    );
  };

  React.useEffect(() => {
    if (plotType === PlotType.SCATTER) {
      setMode(PlotMode.MARKERS);
    }
  }, [plotType]);

  const createTrace = (
    data: any[],
    x_var: string,
    y_var: string,
    name_field: string,
    index: number,
    std_var?: string
  ): TraceData => {
    const groupId = index + 1;
    let x: (number | string)[];
    let itemText: (number | string)[];

    if (plotType === PlotType.TIME_SERIES) {
      x = data.map((item) => getYearFromTime(item[x_var]));
      itemText = data.map((item) => item[name_field] || "");
    } else {
      x = data.map((item) => item[x_var] || 0);
      itemText = data.map((item) => getYearFromTime(item.stdtime));
    }

    const newTrace: TraceData = {
      x,
      y: data.map((item) => item[y_var] || 0),
      text: itemText,
      mode,
      type: "scatter",
      marker: {
        size: 10,
        color: name_field === "names" ? getColorByGroupId(groupId) : undefined,
      },
      name:
        name_field === "names"
          ? `Group ${groupId}`
          : data[0]?.[name_field] || "Unknown",
    };

    // Add error bars if enabled and std data is available
    if (showErrorBars && std_var) {
      newTrace.error_y = {
        type: "data",
        array: data.map((item) => item[std_var] || 0),
        visible: true,
      };
    }

    return newTrace;
  };

  const createTraces = (
    processedDataTable: any[][],
    x_var: string,
    y_var: string,
    name_field: string,
    grouped = false,
    std_var?: string
  ): TraceData[] | undefined => {
    if (!processedDataTable?.length || !processedDataTable[0]?.length) {
      return undefined;
    }

    const newTraces: TraceData[] = [];
    if (!grouped) {
      const unique = [
        ...new Set(processedDataTable[0].map((item) => item[name_field])),
      ];
      const splitArrays = unique.map((value) => {
        return processedDataTable.flatMap((data) =>
          data.filter((item) => item[name_field] === value)
        );
      });
      splitArrays.forEach((data, index) => {
        if (data.length > 0) {
          newTraces.push(createTrace(data, x_var, y_var, name_field, index, std_var));
        }
      });
    } else {
      processedDataTable.forEach((data, index) => {
        if (data.length > 0) {
          newTraces.push(createTrace(data, x_var, y_var, name_field, index, std_var));
        }
      });
    }
    return newTraces.length > 0 ? newTraces : undefined;
  };

  React.useEffect(() => {
    if (dataTable?.length && dataTable[0]?.[0]?.[0]) {
      try {
        const statLabel = statistic.charAt(0).toUpperCase() + statistic.slice(1);
        if (plotType === PlotType.TIME_SERIES) {
          const dict1 = dataTable[0][0][0];
          setLabels({
            title: `${statLabel} ${formatText(dict1.variable)} by Year`,
            xAxisTitle: "Year",
            yAxisTitle: `${formatText(dict1.variable)} (${formatText(
              dict1.unit
            )})`,
          });
        } else if (dataTable[1]?.[0]?.[0]) {
          const dict1 = dataTable[0][0][0];
          const dict2 = dataTable[1][0][0];
          setLabels({
            title: `${statLabel} ${formatText(dict1.variable)} by ${formatText(
              dict2.variable
            )}`,
            xAxisTitle: `${formatText(dict1.variable)}${
              dict1.unit ? ` (${formatText(dict1.unit)})` : ""
            }`,
            yAxisTitle: `${formatText(dict2.variable)}${
              dict2.unit ? ` (${formatText(dict2.unit)})` : ""
            }`,
          });
        }
      } catch (err) {
        console.error("Error setting labels:", err);
      }
    }
  }, [dataTable, plotType, statistic]);

  React.useEffect(() => {
    setError(null);

    if (!dataTable?.length) {
      setTraces([]);
      setHasData(false);
      return;
    }

    try {
      if (plotType === PlotType.TIME_SERIES) {
        if (dataTable[0]?.[0] && !multGroups) {
          const newTraces = createTraces(
            dataTable[0],
            "stdtime",
            statistic,
            "name",
            false,
            "std"
          );
          if (newTraces) {
            setTraces(newTraces);
            setHasData(true);
          } else {
            setError(
              "Unable to create time series chart from the provided data."
            );
            setTraces([]);
            setHasData(false);
          }
        } else if (multGroups) {
          const newTraces = createTraces(
            averageGroups(dataTable[0], ["mean", "median", "std"]),
            "stdtime",
            statistic,
            "names",
            true,
            "std"
          );
          if (newTraces) {
            setTraces(newTraces);
            setHasData(true);
          } else {
            setError("Unable to create grouped time series chart.");
            setTraces([]);
            setHasData(false);
          }
        }
      } else if (dataTable[0]?.[0]?.length && dataTable[1]?.[0]?.length) {
        const combinedArrays = combineXYdata(dataTable[0], dataTable[1]);

        if (!multGroups) {
          const xVar = `var_1_${statistic}`;
          const yVar = ancillary ? "var_2_value" : `var_2_${statistic}`;
          const newTraces = createTraces(
            combinedArrays,
            xVar,
            yVar,
            "name",
            false,
            "var_1_std"
          );
          if (newTraces) {
            setTraces(newTraces);
            setHasData(true);
          } else {
            setError("Unable to create scatter plot from the provided data.");
            setTraces([]);
            setHasData(false);
          }
        } else if (multGroups) {
          const fieldsToAverage: (string | [string, string | number])[] = ancillary
            ? [
                ["var_1_mean", "count_1"],
                ["var_1_median", "count_1"],
                ["var_1_std", "count_1"],
                ["var_2_value", 1],
              ]
            : [
                ["var_1_mean", "count_1"],
                ["var_2_mean", "count_2"],
                ["var_1_median", "count_1"],
                ["var_2_median", "count_2"],
                ["var_1_std", "count_1"],
                ["var_2_std", "count_2"],
              ];

          const xVar = `var_1_${statistic}`;
          const yVar = ancillary ? "var_2_value" : `var_2_${statistic}`;
          const newTraces = createTraces(
            averageGroups(combinedArrays, fieldsToAverage),
            xVar,
            yVar,
            "names",
            true,
            "var_1_std"
          );
          if (newTraces) {
            setTraces(newTraces);
            setHasData(true);
          } else {
            setError("Unable to create grouped scatter plot.");
            setTraces([]);
            setHasData(false);
          }
        }
      } else {
        setError("Insufficient valid data for these parameters.");
        setTraces([]);
        setHasData(false);
      }
    } catch (err) {
      console.error("Error creating traces:", err);
      setError("An error occurred while processing the data.");
      setTraces([]);
      setHasData(false);
    }
  }, [dataTable, mode, plotType, ancillary, statistic, showErrorBars]);

  return (
    <div className="plot-container" style={{ width: "100%", height: "100%" }}>
      <div style={{ marginBottom: "10px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <Button
          onClick={toggleMode}
          disabled={!hasData || plotType === PlotType.SCATTER}
        >
          {mode === PlotMode.MARKERS ? "Add Lines" : "Remove Lines"}
        </Button>
        <Button
          onClick={() => setStatistic(statistic === "mean" ? "median" : "mean")}
          disabled={!hasData}
        >
          {statistic === "mean" ? "Median" : "Mean"}
        </Button>
        <Button
          onClick={() => setShowErrorBars(!showErrorBars)}
          disabled={!hasData}
        >
          {showErrorBars ? "Hide" : "Show"} Error Bars
        </Button>
      </div>
      {!hasData && !error && (
        <div
          style={{
            padding: "20px",
            marginBottom: "10px",
            backgroundColor: "#e7f3ff",
            border: "1px solid #2196F3",
            borderRadius: "4px",
            color: "#0d47a1",
            textAlign: "center",
            fontSize: "16px",
          }}
        >
          Please use the dropdown menu to select variables and view data
        </div>
      )}
      {error && (
        <div
          style={{
            padding: "10px",
            marginBottom: "10px",
            backgroundColor: "#fff3cd",
            border: "1px solid #ffc107",
            borderRadius: "4px",
            color: "#856404",
          }}
        >
          {error}
        </div>
      )}
      {hasData && (
        <PlotComponent
          traces={traces}
          title={labels.title}
          xAxisTitle={labels.xAxisTitle}
          yAxisTitle={labels.yAxisTitle}
        />
      )}
    </div>
  );
}
