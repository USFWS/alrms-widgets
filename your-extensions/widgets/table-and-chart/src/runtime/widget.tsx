import { React, type AllWidgetProps } from "jimu-core";
import { type IMConfig } from "../config";
import PlotlyChart from "./PlotlyChart";
import "./style.css";
//import { MutableStoreManager } from "jimu-core";

import { ReactRedux } from "jimu-core";

//const { useEffect } = React;
const { useSelector } = ReactRedux;

interface AppState {
  widgetsState: {
    widget_comms: {
      [key: string]: any[];
    };
  };
}

const Widget = (props: AllWidgetProps<IMConfig>) => {
  // Access global state for this widget
  const widgetState = useSelector(
    (state: AppState) => state.widgetsState["widget_comms"]
  );
  console.log(widgetState);

  return (
    <div className="root-container">
      <PlotlyChart dataTable={widgetState && widgetState.dataTable} />
    </div>
  );
};

export default Widget;
