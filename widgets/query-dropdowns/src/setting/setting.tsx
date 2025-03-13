import { React } from "jimu-core";
import { AllWidgetSettingProps } from "jimu-for-builder";
import { MapWidgetSelector } from "jimu-ui/advanced/setting-components";

/**
 * Setting component for the Query Dropdowns widget.
 *
 * @param props - The props containing the widget's settings and callbacks.
 * @returns The rendered Setting component.
 */
const Setting = (props: AllWidgetSettingProps<any>) => {
  /**
   * Callback function called when the map widget is selected.
   *
   * @param useMapWidgetIds - The array of selected map widget IDs.
   */
  const onMapWidgetSelected = (useMapWidgetIds: string[]) => {
    // Call the onSettingChange callback with the updated settings.
    props.onSettingChange({
      id: props.id, // The ID of the widget.
      useMapWidgetIds: useMapWidgetIds, // The array of selected map widget IDs.
    });
  };

  return (
    <div className="widget-setting-demo">
      {/* Render the MapWidgetSelector component with the selected map widget IDs and the onMapWidgetSelected callback. */}
      <h4>Select Map</h4>
      <MapWidgetSelector
        useMapWidgetIds={props.useMapWidgetIds}
        onSelect={onMapWidgetSelected}
      />
    </div>
  );
};
export default Setting;
