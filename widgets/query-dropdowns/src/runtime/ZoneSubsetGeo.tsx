import React, { useState, useEffect } from "react";
import DrawTool from "./DrawTool";
import { Tooltip, Button } from "jimu-ui";

export default function ZoneSubsetGeo({ jmv, activeLayer, handleDraw, theme }) {
  const i = 1;
  return (
    <div style={{ display: "flex" }}>
      <Button>Group {i}</Button>
      <DrawTool
        jmv={jmv}
        activeLayer={activeLayer}
        handleDraw={handleDraw}
        theme={theme}
      ></DrawTool>
    </div>
  );
}
