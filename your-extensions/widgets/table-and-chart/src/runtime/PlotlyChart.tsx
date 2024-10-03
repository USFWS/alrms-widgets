import React, { useState, useEffect, useRef, useMemo } from "react";
import Plot from "react-plotly.js";
import { Button } from "jimu-ui";
import PlotComponent from "./PlotComponent";
import TableComponent from "./TableComponent";

export default function PlotlyChart({ dataTable }) {
  const [mode, setMode] = useState("markers");
  const [tableMode, setTableMode] = useState("scatter");

  const { traces, title, unit1, unit2 } = useMemo(() => {
    if (!dataTable || dataTable.length === 0) {
      return {
        traces: [],
        title: "Please Select from Dropdowns",
        unit1: "",
        unit2: "",
      };
    } else if (!dataTable[0]?.length) {
      return { traces: [], title: "", unit1: "", unit2: "" };
    }

    let traces = [];
    let title = "";
    let unit1 = "";
    let unit2 = "";

    interface TableItem {
      [key: string]: any;
    }

    function formatString(input) {
      return input
        .split("_")
        .map((word, index) =>
          index === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word
        )
        .join(" ");
    }

    if (dataTable.length === 1) {
      const table1: TableItem[] = dataTable[0];
      title = formatString(table1[0].variable);
      unit1 = `${formatString(table1[0].variable)} (${formatString(
        table1[0].unit
      )})`;
      unit2 = "Year";

      const names = [...new Set(table1.map((item) => item.name))];
      console.log(table1);
      const keys = ["name", "mean", "stdtime"];
      /*       const names = Array.from(table1.map((item) => item.name));
      const stdtime = Array.from(table1.map((item) => item.stdtime));
      const means = Array.from(table1.map((item) => item.mean)); */

      // Create an object to hold arrays for each column
      const columns = {}; // name: [], mean: [], stdtime: [] };

      // Initialize arrays for each column
      keys.forEach((key) => {
        columns[key] = [];
      });

      // Populate the arrays with values from each row
      table1.forEach((row) => {
        keys.forEach((key) => {
          columns[key].push(row[key]);
        });
      });

      console.log(columns);
      console.log(names);
      console.log(table1.filter((item) => item.name === name));
      if (tableMode === "scatter" || dataTable.length > 1) {
        traces = names.map((name) => {
          const filteredData = table1.filter((item) => item.name === name);
          const xData = filteredData.map((item) =>
            new Date(parseInt(item.stdtime)).getUTCFullYear()
          );
          const yData = filteredData.map((item) => parseFloat(item.mean));
          return {
            x: xData,
            y: yData,
            mode: mode,
            type: tableMode, //"scatter",
            name: name,
            text: filteredData.map((item) => `${item.name} - ${item.mean}`),
            hoverinfo: "text",
          };
        });
      } else {
        const headers = Object.keys(columns).map((key) => `<b>${key}</b>`);
        //headers.push("<b>year</b>");

        // Extract the values
        const values = Object.keys(columns).map((key) => columns[key]);
        console.log(values);

        values[2] = values[2].map((item) =>
          new Date(parseInt(item)).getUTCFullYear()
        );
        console.log(values);
        traces = [
          {
            type: "table",
            header: {
              values: headers /* [
                ["<b>Name</b>"],
                ["<b>Standard Time</b>"],
                ["<b>Mean</b>"],
              ] */,
              align: "center",
              fill: { color: "grey" },
              font: { family: "Arial", size: 12, color: "white" },
            },
            cells: {
              values: values, //[names, stdtime, means],
              align: "center",
              fill: { color: "white" },
              font: { family: "Arial", size: 11, color: ["black"] },
            },
          },
        ];
      }
    } else if (
      dataTable.length === 2 &&
      dataTable[0]?.length === dataTable[1]?.length
    ) {
      const table1: TableItem[] = dataTable[0];
      const table2: TableItem[] = dataTable[1];
      title = `${formatString(table1[0].variable)} vs. ${formatString(
        table2[0].variable
      )}`;
      unit1 = `${formatString(table1[0].variable)} (${formatString(
        table1[0].unit
      )})`;
      unit2 = `${formatString(table2[0].variable)} (${formatString(
        table2[0].unit
      )})`;

      const names1 = [...new Set(table1.map((item) => item.name))];
      const names2 = [...new Set(table2.map((item) => item.name))];
      const areArraysEqual = (arr1: string[], arr2: string[]): boolean => {
        if (arr1.length !== arr2.length) return false;
        return arr1.every((value, index) => value === arr2[index]);
      };

      if (areArraysEqual(names1, names2)) {
        traces = names1.map((name) => {
          const filteredData1 = table1.filter((item) => item.name === name);
          const filteredData2 = table2.filter((item) => item.name === name);
          const xData = filteredData1.map((item) => parseFloat(item.mean));
          const yData = filteredData2.map((item) => parseFloat(item.mean));
          return {
            x: xData,
            y: yData,
            mode: mode,
            type: tableMode, //"scatter",
            name: name,
            text: filteredData1.map(
              (item) =>
                `${item.name} - ${new Date(
                  parseInt(item.stdtime)
                ).getUTCFullYear()} \n ${item.mean}`
            ),
            hoverinfo: "text",
          };
        });
      }
    }

    return { traces, title, unit1, unit2 };
  }, [dataTable, mode, tableMode]);

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
  console.log(traces);
  console.log(tableMode);
  return (
    <div className="plot-container" style={{ width: "100%", height: "100%" }}>
      <Button onClick={toggleMode} disabled={traces.length === 0}>
        {mode === "markers" ? "Add Lines" : "Remove Lines"}
      </Button>
      <Button onClick={toggleTable} disabled={traces.length === 0}>
        {tableMode === "scatter" ? "Show Table" : "Show Plot"}
      </Button>
      {tableMode === "scatter" ? (
        <PlotComponent
          traces={traces}
          title={title}
          xAxisTitle={unit2}
          yAxisTitle={unit1}
        />
      ) : (
        <TableComponent values={traces} />
      )}
      {/*       <PlotComponent
        traces={traces}
        title={title}
        xAxisTitle={unit2}
        yAxisTitle={unit1}
      /> */}
    </div>
  );
}
