import { React, type AllWidgetProps } from "jimu-core";
import { type IMConfig } from "../config";
import PlotlyChart from "./PlotlyChart";
import "./style.css";
import PlotlyChartRefactor from "./PlotlyChartRefactor";
import { DataItem } from "./utils/dataProcessing";
import { PlotType } from "./constants";
//import { MutableStoreManager } from "jimu-core";

import { ReactRedux } from "jimu-core";

//const { useEffect } = React;
const { useSelector } = ReactRedux;

interface WidgetCommsState {
  dataTable?: DataItem[][][];
  plotType?: PlotType;
  ancillary?: boolean;
  multGroups?: boolean;
}

interface AppState {
  widgetsState: {
    widget_comms: WidgetCommsState;
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
        dataTable={widgetState?.dataTable}
        plotType={widgetState?.plotType}
        ancillary={widgetState?.ancillary}
        multGroups={widgetState?.multGroups}
      ></PlotlyChartRefactor>
      {/* <PlotlyChartRefactor dataTable={widgetState && widgetState.dataTable} /> */}
    </div>
  );
};

export default Widget;
