import React from "react";
import Plot from "react-plotly.js";

export default function DataTableComponent({ values }) {
  console.log(values);
  if (!values) {
    return <div>No data available</div>;
  }
  return (
    <Plot
      style={{ width: "100%", height: "100%" }}
      data={values}
      layout={{ title: "Table" }}
    />
  );
}
