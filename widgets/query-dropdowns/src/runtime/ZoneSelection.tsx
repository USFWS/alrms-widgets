/** @jsx jsx */
/** @jsxFrag React.Fragment */
import React from "react";
import { jsx } from "jimu-core";
import { Dropdown, DropdownButton, Button, Label, Checkbox } from "jimu-ui";
import { JimuMapView } from "jimu-arcgis";
import { IMThemeVariables } from "jimu-core";
import ZoneSubsetSelect from "./ZoneSubsetSelect";
import ZoneSubsetGeo from "./ZoneSubsetGeo";
import type { Zone, ZoneSubset } from "./types";
import { getZoneSelectionStyle } from "./style";

interface ZoneSelectionProps {
  zone: Zone;
  zoneSubsets: ZoneSubset[];
  handleZoneSubsetClick: (allItems: any, group_id: any) => void;
  jmv: JimuMapView;
  theme: IMThemeVariables;
  setZoneSubsets: React.Dispatch<React.SetStateAction<ZoneSubset[]>>;
  multGroups: boolean;
  setMultGroups: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ZoneSelection({
  zone,
  zoneSubsets,
  handleZoneSubsetClick,
  jmv,
  theme,
  setZoneSubsets,
  multGroups,
  setMultGroups,
}: ZoneSelectionProps) {

  const handleAddGroup = () => {
    setZoneSubsets((prevGroups) => [
      ...prevGroups,
      { groupId: prevGroups.length + 1, polygons: [] },
    ]);
  };

  const handleDeleteGroup = () => {
    const newGroup = zoneSubsets.length;
    setZoneSubsets((prevGroups) =>
      prevGroups.filter((group) => group.groupId !== newGroup)
    );
  };

  const GroupButtons = () => (
    <div className="group-buttons">
      <Button className="btn" onClick={handleAddGroup}>
        Add Group
      </Button>
      <Button
        className="btn"
        disabled={zoneSubsets.length < 2}
        onClick={handleDeleteGroup}
      >
        Delete Group
      </Button>
    </div>
  );

  const handleCheckbox = (event) => {
    setMultGroups(event.target.checked);
    setZoneSubsets((prevGroups) =>
      prevGroups.filter((group) => group.groupId === 1)
    );
  };

  // Determine if we're using the geo selector (drawing tool)
  const isGeoSelector = zone.dataset && zone.polygons.length === 0;

  // Force multGroups to true when using geo selector
  React.useEffect(() => {
    if (isGeoSelector && !multGroups) {
      setMultGroups(true);
    }
  }, [isGeoSelector, multGroups, setMultGroups]);

  return (
    <div css={getZoneSelectionStyle(theme)}>
      <Label>
        <Checkbox 
          checked={multGroups} 
          onChange={handleCheckbox}
          disabled={isGeoSelector}
        /> Group Zones
      </Label>
      <br></br>

      {!zone.dataset ? (
        <Dropdown className="dropdown" style={{ paddingBottom: "16px" }}>
          <DropdownButton disabled={true}>Select Zone Dataset</DropdownButton>
        </Dropdown>
      ) : zone.polygons.length > 0 ? (
        <>
          {zoneSubsets.map((group) => (
            <div key={group.groupId}>
              {multGroups && (
                <span>
                  <strong>Group {group.groupId}</strong>
                </span>
              )}
              <ZoneSubsetSelect
                group={group.groupId}
                polygons={zone.polygons}
                selectedZones={group.polygons}
                handleZoneSubsetClick={handleZoneSubsetClick}
                jmv={jmv}
                activeLayer={zone.dataset}
                theme={theme}
              />
            </div>
          ))}
          {multGroups && <GroupButtons />}
        </>
      ) : (
        <>
          {zoneSubsets.map((group) => (
            <div key={group.groupId}>
              {multGroups && <p>Group {group.groupId}</p>}
              <ZoneSubsetGeo
                jmv={jmv}
                activeLayer={zone.dataset}
                handleDraw={handleZoneSubsetClick}
                theme={theme}
                group_id={group.groupId}
                selectedZones={group.polygons}
              />
            </div>
          ))}
          {multGroups && <GroupButtons />}
        </>
      )}
    </div>
  );
}
