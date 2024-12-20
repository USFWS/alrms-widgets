import React from "react";
import { Dropdown, DropdownButton, Button, Label, Checkbox } from "jimu-ui";
import ZoneSubsetSelect from "./ZoneSubsetSelect";
import ZoneSubsetGeo from "./ZoneSubsetGeo";
import "./style.scss";

export default function ZoneSelection({
  zone,
  zoneSubsets,
  handleZoneSubsetClick,
  jmv,
  theme,
  setZoneSubsets,
}) {
  const [multGroups, setMultGroups] = React.useState(false);

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
    console.log("clicked checkbox", event.target.checked);
    setMultGroups(event.target.checked);
    setZoneSubsets((prevGroups) =>
      prevGroups.filter((group) => group.groupId === 1)
    );
  };

  return (
    <>
      <Label>
        <Checkbox checked={multGroups} onChange={handleCheckbox} /> Compare
        Groups
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
    </>
  );
}
