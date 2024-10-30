import { React } from "jimu-core";
import { DropdownItem } from "jimu-ui";

export default function Var({ dataSource, variables, handleVarClick }) {
  if (!dataSource) {
    return null;
  } else {
    return variables.map((variable, index) => (
      <>
        <DropdownItem
          key={index}
          value={variable}
          onClick={() => handleVarClick(variable)}
        >
          {variable}
        </DropdownItem>
      </>
    ));
  }
}
