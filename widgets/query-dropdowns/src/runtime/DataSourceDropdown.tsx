import { React } from "jimu-core";
import { DropdownItem } from "jimu-ui";

/**
 * Renders a dropdown list of data sources.
 *
 * @param {object} props - The properties of the component.
 * @param {object} props.dataSources - The data sources to be rendered.
 * @param {function} props.handleDataSourceClick - The function to be called when a data source is clicked.
 * @returns {JSX.Element} - The rendered dropdown list.
 */
export default function DataSourceDropdown({
  dataSources,
  handleDataSourceClick,
}) {
  // Render a dropdown list of data sources
  return (
    <>
      {/* Map over the data sources and render a dropdown item for each */}
      {Object.keys(dataSources).map((variable, index) => (
        <DropdownItem
          key={index}
          value={variable}
          onClick={() => handleDataSourceClick(variable)}
        >
          {/* Display the name of the data source */}
          {variable}
        </DropdownItem>
      ))}
    </>
  );
}
