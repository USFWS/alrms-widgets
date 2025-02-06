import { React, type AllWidgetProps } from "jimu-core";
import { type IMConfig } from "../config";
import PlotlyChart from "./PlotlyChart";
import "./style.css";
import PlotlyChartRefactor from "./PlotlyChartRefactor";
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
      <PlotlyChartRefactor
        dataTable={widgetState && widgetState.dataTable}
        plotType={widgetState && widgetState.plotType}
        ancillary={widgetState && widgetState.ancillary}
      ></PlotlyChartRefactor>
      {/* <PlotlyChartRefactor dataTable={widgetState && widgetState.dataTable} /> */}
    </div>
  );
};

export default Widget;
