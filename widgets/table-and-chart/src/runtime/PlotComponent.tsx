import React, { useEffect, useRef, useState } from "react";
import Plot from "react-plotly.js";

interface PlotComponentProps {
  traces: any[];
  title: string;
  xAxisTitle: string;
  yAxisTitle: string;
}

export default function PlotComponent({
  traces,
  title,
  xAxisTitle,
  yAxisTitle,
}: PlotComponentProps) {
  const plotRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const handleResize = (entries: ResizeObserverEntry[]) => {
      for (let entry of entries) {
        if (entry.contentRect) {
          const { width, height } = entry.contentRect;
          setSize({ width, height });
        }
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    const currentRef = plotRef.current;
    if (currentRef) {
      resizeObserver.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        resizeObserver.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <div ref={plotRef} style={{ width: "100%", height: "100%" }}>
      <Plot
        className="plotly-chart"
        data={traces}
        layout={{
          title: {
            text: title || "Chart",
            font: { size: 16 },
          },
          xaxis: {
            title: {
              text: xAxisTitle || "X Axis",
              font: { size: 14 },
            },
          },
          yaxis: {
            title: {
              text: yAxisTitle || "Y Axis",
              font: { size: 14 },
            },
          },
          autosize: true,
          margin: { l: 60, r: 40, t: 50, b: 50 },
          showlegend: true,
        }}
        style={{ width: "100%", height: "100%" }}
        useResizeHandler={true}
        config={{ responsive: true, editable: true }}
      />
    </div>
  );
}
