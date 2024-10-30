import React, { useEffect, useRef, useState } from "react";
import Plot from "react-plotly.js";

export default function PlotComponent({
  traces,
  title,
  xAxisTitle,
  yAxisTitle,
}) {
  const plotRef = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const handleResize = (entries) => {
      for (let entry of entries) {
        if (entry.contentRect) {
          const { width, height } = entry.contentRect;
          setSize({ width, height });
        }
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    if (plotRef.current) {
      resizeObserver.observe(plotRef.current);
    }

    // Cleanup function to unobserve the container
    return () => {
      if (plotRef.current) {
        resizeObserver.unobserve(plotRef.current);
      }
    };
  }, []);

  return (
    <div ref={plotRef} style={{ width: "100%", height: "100%" }}>
      <Plot
        className="plotly-chart"
        data={traces}
        layout={{
          title,
          xaxis: { title: xAxisTitle },
          yaxis: { title: yAxisTitle },
          autosize: true,
        }}
        style={{ width: "100%", height: "100%" }}
        useResizeHandler={true}
        config={{ responsive: true, editable: true }}
      />
    </div>
  );
}
