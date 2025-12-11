import React from "react";
import Plot from "react-plotly.js";

interface TableComponentProps {
  values: any[];
}

export default function TableComponent({ values }: TableComponentProps) {
  if (!values || values.length === 0) {
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
