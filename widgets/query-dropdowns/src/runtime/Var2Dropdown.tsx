import { React } from "jimu-core";
import { DropdownItem } from "jimu-ui";

export default function Var({ sourceVariables, handleVarClick }) {
  if (!sourceVariables) {
    throw new Error("sourceVariables is null or undefined");
  }

  const stringVariables = Object.entries(sourceVariables).flatMap(
    ([dataSource, variables]: [string, string[]]) =>
      variables?.map((variable) => `${dataSource}: ${variable}`) || []
  );

  return (
    <>
      {stringVariables.map((variable, index) => (
        <DropdownItem
          key={index}
          value={variable}
          onClick={() => handleVarClick(variable)}
        >
          {variable}
        </DropdownItem>
      ))}
    </>
  );
}
