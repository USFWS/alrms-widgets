import React, { useState, useEffect } from "react";
import DrawTool from "./DrawTool";
import { Tooltip, Button } from "jimu-ui";
import { group } from "console";

export default function ZoneSubsetGeo({
  jmv,
  activeLayer,
  handleDraw,
  theme,
  group_id,
}) {
  const i = group_id;
  return (
    <div
      style={{
        display: "flex",
        width: "90%",
        paddingBottom: "16px",
        gap: "16px",
      }}
    >
      <Button>Group {i}</Button>
      <DrawTool
        jmv={jmv}
        activeLayer={activeLayer}
        handleDraw={handleDraw}
        theme={theme}
        group_id={group_id}
      ></DrawTool>
    </div>
  );
}
