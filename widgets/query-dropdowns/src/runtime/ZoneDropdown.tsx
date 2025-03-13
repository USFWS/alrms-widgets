import { React } from "jimu-core";
import { DropdownItem } from "jimu-ui";

export default function ZoneDropDown({ zones, handleZoneClick }) {
  if (!zones) {
    return null;
  } else {
    return zones.map((layer, index) => (
      <>
        <DropdownItem
          key={index}
          value={layer.title}
          onClick={() => handleZoneClick(layer)}
        >
          {layer.title?.split(" - ")[1]
            ? layer.title?.split(" - ")[1]
            : layer.title}
        </DropdownItem>
      </>
    ));
  }
}
