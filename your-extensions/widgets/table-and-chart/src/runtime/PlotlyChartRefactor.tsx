import React from "react";
//import Plot from "react-plotly.js";
import PlotComponent from "./PlotComponent";
import TableComponent from "./TableComponent";
import { Button } from "jimu-ui";
//import { ResultsFieldSetting } from "dist/widgets/arcgis/query/src/setting/results-field";

export default function PlotlyChartRefactor({ dataTable, plotType }) {
  console.log("Data Table", dataTable);
  console.log("Plot Type", plotType);
  const [mode, setMode] = React.useState("markers");
  const [tableMode, setTableMode] = React.useState("scatter");
  const [labels, setLabels] = React.useState({
    title: "",
    xAxisTitle: "",
    yAxisTitle: "",
  });
  const [traces, setTraces] = React.useState([
    {
      x: [1, 2, 3],
      y: [2, 6, 3],
      type: "scatter",
      mode: mode,
      marker: { color: "red" },
      name: "Group 0",
    },
  ]);

  function getColorByGroupId(groupId) {
    switch (groupId) {
      case 1:
        return "rgba(255, 0, 0, 1)";
      case 2:
        return "rgba(0, 255, 0, 1)";
      case 3:
        return "rgba(0, 0, 255, 1)";
      default:
        return "rgba(255, 255, 0, 1)";
    }
  }

  const toggleMode = () => {
    setMode((prevMode) =>
      prevMode === "markers" ? "lines+markers" : "markers"
    );
  };
  React.useEffect(() => {
    if (plotType === 1) {
      setMode("markers");
    }
  }, [plotType]);

  const toggleTable = () => {
    setTableMode((prevTableMode) =>
      prevTableMode === "scatter" ? "table" : "scatter"
    );
  };

  const computeWeightedStats = (items, fieldToAverage, countField) => {
    return items.reduce(
      (acc, item) => {
        acc.weightedSum += item[fieldToAverage] * item[countField];
        acc.totalCount += item[countField];
        acc.names += item.zone_name;
        return acc;
      },
      { weightedSum: 0, totalCount: 0, names: [] }
    );
  };

  const averageGroups = (rawDataTable, fieldsToAverage) => {
    const groupedData = [];
    rawDataTable.map((group, index) => {
      let averagedData;
      if (group) {
        const uniqueStdTime = [...new Set(group.map((item) => item.stdtime))];
        averagedData = uniqueStdTime.map((stdTime) => {
          const time = group.filter((item) => item.stdtime === stdTime);
          const weightedFields = fieldsToAverage.map((field) => {
            const { weightedSum, totalCount, names } = Array.isArray(field)
              ? computeWeightedStats(time, field[0], field[1])
              : computeWeightedStats(time, field, "count");
            const weightedMean = weightedSum / totalCount || 0;
            return {
              count: totalCount,
              name: names,
              field: Array.isArray(field) ? field[0] : field,
              weighted: weightedMean,
            };
          });
          const weightedFieldsObject = weightedFields.reduce((acc, item) => {
            acc[item.field] = item.weighted;
            return acc;
          }, {});
          return {
            stdtime: stdTime,
            ...weightedFieldsObject,
          };
        });
      }
      averagedData && groupedData.push(averagedData);
    });
    return groupedData;
  };

  const createTrace = (data, x_var, y_var, name_field, index) => {
    const groupId = index + 1;
    let x;
    if (plotType === 0) {
      x = data.map((item) => new Date(parseInt(item[x_var])).getUTCFullYear());
    } else {
      x = data.map((item) => item[x_var]);
    }
    const newTrace = {
      x: x,
      y: data.map((item) => item[y_var]),
      text: data.map((item) => item[name_field]),
      mode: mode,
      type: "scatter",
      marker: {
        size: 10,
        color: name_field === "names" ? getColorByGroupId(groupId) : undefined,
      },
      name: name_field === "names" ? `Group ${groupId}` : data[0][name_field],
    };
    return newTrace;
  };

  const createTraces = (
    processedDataTable,
    x_var,
    y_var,
    name_field,
    grouped = false
  ) => {
    if (processedDataTable?.length) {
      const newTraces = [];
      if (!grouped) {
        let unique = [
          ...new Set(processedDataTable[0].map((item) => item[name_field])),
        ];
        let splitArrays = unique.map((value) => {
          return processedDataTable.flatMap((data) =>
            data.filter((item) => item[name_field] === value)
          );
        });
        splitArrays.map((data, index) => {
          newTraces.push(createTrace(data, x_var, y_var, name_field, index));
        });
      } else {
        processedDataTable.map((data, index) => {
          newTraces.push(createTrace(data, x_var, y_var, name_field, index));
        });
      }
      return newTraces;
    }
  };

  const combineXYdata = (xArrays, yArrays) => {
    const combinedArrays = xArrays.map((xVals, index) => {
      const yVals = yArrays[index] || [];

      return xVals.map((item0) => {
        const matchingItem = yVals.find(
          (item1) =>
            item1.zone_name === item0.zone_name &&
            item1.stdtime === item0.stdtime
        );

        return {
          count_1: item0.count,
          count_2: matchingItem ? matchingItem.count : null,
          zone_name: item0.zone_name,
          stdtime: item0.stdtime,
          var_1: item0.variable,
          var_1_mean: item0.mean,
          var_1_median: item0.median,
          var_1_min: item0.min,
          var_1_max: item0.max,
          var_1_std: item0.std,
          var_1_unit: item0.unit,
          var_2: matchingItem ? matchingItem.variable : null,
          var_2_mean: matchingItem ? matchingItem.mean : null,
          var_2_median: matchingItem ? matchingItem.median : null,
          var_2_min: matchingItem ? matchingItem.min : null,
          var_2_max: matchingItem ? matchingItem.max : null,
          var_2_std: matchingItem ? matchingItem.std : null,
          var_2_unit: matchingItem ? matchingItem.unit : null,
        };
      });
    });
    return combinedArrays;
  };

  React.useEffect(() => {
    if (dataTable?.length) {
      if (plotType === 0) {
        if (dataTable[0][0] && dataTable[0].length == 1) {
          setTraces(createTraces(dataTable[0], "stdtime", "mean", "zone_name"));
        } else if (dataTable[0].length > 1) {
          console.log(dataTable);
          setTraces(
            createTraces(
              averageGroups(dataTable[0], ["mean", "median", "std"]),
              "stdtime",
              "mean",
              "names",
              true
            )
          );
        }
      } else {
        if (dataTable[0][0] && dataTable[0].length == 1) {
          const combinedArrays = combineXYdata(dataTable[0], dataTable[1]);
          console.log(combinedArrays);
          setTraces(
            createTraces(
              combinedArrays,
              "var_1_mean",
              "var_2_mean",
              "zone_name"
            )
          );
        } else if (dataTable[0].length > 1) {
          const combinedArrays = combineXYdata(dataTable[0], dataTable[1]);
          console.log(combinedArrays);
          setTraces(
            createTraces(
              averageGroups(combinedArrays, [
                ["var_1_mean", "count_1"],
                ["var_2_mean", "count_2"],
                ["var_1_median", "count_1"],
                ["var_2_median", "count_2"],
                ["var_1_std", "count_1"],
                ["var_2_std", "count_2"],
              ]),
              "var_1_mean",
              "var_2_mean",
              "names",
              true
            )
          );
        }
      }
    } else {
      setTraces([
        {
          x: [1, 2, 3],
          y: [2, 6, 3],
          type: "scatter",
          mode: mode,
          marker: { color: "red" },
          name: "Group 0",
        },
      ]);
    }
  }, [dataTable, mode, plotType]);

  console.log(traces);
  //<Plot data={traces} layout={{ title: { text: "A Fancy Plot" } }} />
  return (
    <div className="plot-container" style={{ width: "100%", height: "100%" }}>
      <Button
        onClick={toggleMode}
        disabled={traces?.length === 0 || plotType === 1}
      >
        {mode === "markers" ? "Add Lines" : "Remove Lines"}
      </Button>
      {/*       <Button onClick={toggleTable} disabled={traces?.length === 0}>
        {tableMode === "scatter" ? "Show Table" : "Show Plot"}
      </Button> */}
      {/*      {tableMode === "scatter" ? ( */}
      <PlotComponent
        traces={traces}
        title={labels.title}
        xAxisTitle={labels.xAxisTitle}
        yAxisTitle={labels.yAxisTitle}
      />
      {/*       ) : (
        <TableComponent values={traces} />
      )} */}
    </div>
  );
}
