import React from "react";
//import Plot from "react-plotly.js";
import PlotComponent from "./PlotComponent";
import TableComponent from "./TableComponent";
import { Button } from "jimu-ui";
import { ResultsFieldSetting } from "dist/widgets/arcgis/query/src/setting/results-field";

export default function PlotlyChartRefactor({ dataTable }) {
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
  const toggleTable = () => {
    setTableMode((prevTableMode) =>
      prevTableMode === "scatter" ? "table" : "scatter"
    );
  };

  console.log(dataTable);

  const computeWeightedStats = (items, fieldToAverage) => {
    return items.reduce(
      (acc, item) => {
        acc.weightedSum += item[fieldToAverage] * item.count;
        acc.totalCount += item.count;
        acc.names += item.zone_name;
        return acc;
      },
      { weightedSum: 0, totalCount: 0, names: [] }
    );
  };

  const averageGroups = (rawDataTable, fieldToAverage) => {
    const groupedData = [];
    rawDataTable.map((group, index) => {
      console.log(group);
      let averagedData;
      if (group) {
        const uniqueStdTime = [...new Set(group.map((item) => item.stdtime))];
        averagedData = uniqueStdTime.map((stdTime) => {
          const results = group.filter((item) => item.stdtime === stdTime);
          const { weightedSum, totalCount, names } = computeWeightedStats(
            results,
            fieldToAverage
          );
          const weightedMean = weightedSum / totalCount || 0;
          return {
            count: totalCount,
            mean: weightedMean,
            names: names,
            stdtime: stdTime,
          };
        });
      }
      console.log(averagedData);
      averagedData && groupedData.push(averagedData);
    });
    return groupedData;
  };

  const createTrace = (data, x_var, y_var, name_field, index) => {
    console.log(data);
    const groupId = index + 1;
    const newTrace = {
      x: data.map((item) => new Date(parseInt(item[x_var])).getUTCFullYear()),
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
        console.log(unique);
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

  React.useEffect(() => {
    if (dataTable?.length) {
      if (dataTable[0][0] && dataTable[0].length == 1) {
        setTraces(createTraces(dataTable[0], "stdtime", "mean", "zone_name"));
      } else if (dataTable[0].length > 1) {
        setTraces(
          createTraces(
            averageGroups(dataTable[0], "mean"),
            "stdtime",
            "mean",
            "names",
            true
          )
        );
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
  }, [dataTable, mode]);

  console.log(traces);
  //<Plot data={traces} layout={{ title: { text: "A Fancy Plot" } }} />
  return (
    <div className="plot-container" style={{ width: "100%", height: "100%" }}>
      <Button onClick={toggleMode} disabled={traces?.length === 0}>
        {mode === "markers" ? "Add Lines" : "Remove Lines"}
      </Button>
      <Button onClick={toggleTable} disabled={traces?.length === 0}>
        {tableMode === "scatter" ? "Show Table" : "Show Plot"}
      </Button>
      {tableMode === "scatter" ? (
        <PlotComponent
          traces={traces}
          title={labels.title}
          xAxisTitle={labels.xAxisTitle}
          yAxisTitle={labels.yAxisTitle}
        />
      ) : (
        <TableComponent values={traces} />
      )}
    </div>
  );
}
