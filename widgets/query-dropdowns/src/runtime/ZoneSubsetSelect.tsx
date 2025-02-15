import React, { useState, useEffect } from "react";
import { MultiSelect, AdvancedSelect } from "jimu-ui";
import DrawTool from "./DrawTool";

/**
 * ZoneSubsetSelect component renders a dropdown list to select zones and
 * triggers a callback function when the selection changes.
 *
 * @param {Array} selectedZones - The currently selected zones.
 * @param {Array} [polygons=[]] - The available zones.
 * @param {Function} handleZoneSubsetClick - The callback function to trigger
 * when the selection changes.
 */
export default function ZoneSubsetSelect({
  group,
  selectedZones,
  polygons = [],
  handleZoneSubsetClick,
  jmv,
  activeLayer,
  theme,
}) {
  // The key is used to force a re-render when the polygons change.
  const [key, setKey] = useState(Date.now());

  console.log(polygons);
  console.log(selectedZones);

  // When the polygons change, the key is updated to trigger a re-render.
  useEffect(() => {
    setKey(Date.now());
  }, [polygons]);

  /**
   * Handles the selection change event.
   *
   * @param {Array} selections - The selected items.
   */
  function handleClick(selections) {
    console.log(selections);
    if (selections) {
      selections = selections.map((item) => {
        const match = polygons.find((refItem) => refItem.value == item.value);
        const updatedItem = match
          ? { ...item, objectid: match.objectid }
          : item;
        const { render, ...itemWithoutRender } = updatedItem;
        return itemWithoutRender;
      });
    }

    // If no items are selected, an empty array is passed to the callback.
    if (!selections) {
      handleZoneSubsetClick([], group);
    }
    // If "select_all" is selected, all polygons are passed to the callback.
    else if (selections.some((items) => items.value == "select_all")) {
      console.log("selecting all");
      handleZoneSubsetClick(polygons, group);
    }
    // If other items are selected, they are passed to the callback.
    else if (selections.length) {
      handleZoneSubsetClick(selections, group);
    }
  }

  /**
   * Renders the content of the dropdown button.
   *
   * @param {Array} selectedItems - The currently selected items.
   * @returns {string} The content to display in the dropdown button.
   */
  const customDropdownButtonContent = (selectedItems) => {
    // If no items are selected, "Select Zones" is displayed.
    if (selectedZones.length === 0) {
      return "Select Zones";
    }
    // If one item is selected, its label is displayed.
    else if (selectedZones.length === 1) {
      return selectedZones[0].label;
    }
    // If all items except "select_all" are selected, "All Zones Selected" is
    // displayed.
    else if (selectedZones.length === polygons.length - 1) {
      return "All Zones Selected";
    }
    // If other items are selected, the number of items is displayed.
    return `${selectedZones.length} Zones Selected`;
  };

  // The AdvancedSelect component is rendered with the provided props.
  return (
    <div style={{ display: "flex", width: "90%", paddingBottom: "16px" }}>
      <AdvancedSelect
        key={key}
        staticValues={polygons}
        selectedValues={selectedZones}
        placeholder="please select"
        onChange={handleClick}
        isMultiple={true}
        hideBottomTools={false}
        hideSearchInput={false}
        sortValuesByLabel={false}
        customDropdownButtonContent={customDropdownButtonContent}
      />
      <DrawTool
        jmv={jmv}
        activeLayer={activeLayer}
        handleDraw={handleZoneSubsetClick}
        theme={theme}
        group_id={group}
      ></DrawTool>
    </div>
  );
}
