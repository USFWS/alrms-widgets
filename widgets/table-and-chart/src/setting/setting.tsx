import {
  React,
  Immutable,
  type IMFieldSchema,
  type UseDataSource,
  AllDataSourceTypes,
} from "jimu-core";
import { type AllWidgetSettingProps } from "jimu-for-builder";
import {
  DataSourceSelector,
  FieldSelector,
} from "jimu-ui/advanced/data-source-selector";

export default function Setting(props: AllWidgetSettingProps<unknown>) {
  /*   const onFieldChange = (allSelectedFields: IMFieldSchema[]) => {
    props.onSettingChange({
      id: props.id,
      useDataSources: [{ ...props.useDataSources[0], ...{ fields: allSelectedFields.map(f => f.jimuName) } }]
    })
  }

  const onToggleUseDataEnabled = (useDataSourcesEnabled: boolean) => {
    props.onSettingChange({
      id: props.id,
      useDataSourcesEnabled
    })
  }

  const onDataSourceChange = (useDataSources: UseDataSource[]) => {
    props.onSettingChange({
      id: props.id,
      useDataSources: useDataSources
    })
  } */

  return (
    <div className="use-feature-layer-setting p-2">
      {/*     <DataSourceSelector
      types={Immutable([AllDataSourceTypes.FeatureLayer])}
      useDataSources={props.useDataSources}
      useDataSourcesEnabled={props.useDataSourcesEnabled}
      onToggleUseDataEnabled={onToggleUseDataEnabled}
      onChange={onDataSourceChange}
      widgetId={props.id}
    />
    {
      props.useDataSources && props.useDataSources.length > 0 &&
      <FieldSelector
        useDataSources={props.useDataSources}
        onChange={onFieldChange}
        selectedFields={props.useDataSources[0].fields || Immutable([])}
      />
    } */}
    </div>
  );
}
