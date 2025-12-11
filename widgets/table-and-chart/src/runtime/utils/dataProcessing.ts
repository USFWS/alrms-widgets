export interface DataItem {
  count?: number;
  stdtime: number | string;
  mean?: number;
  median?: number;
  min?: number;
  max?: number;
  std?: number;
  variable?: string;
  unit?: string;
  zone_name?: string;
  name?: string;
  value?: number;
}

export interface CombinedDataItem {
  count_1: number;
  count_2: number | null;
  zone_name: string;
  name: string;
  stdtime: number | string;
  var_1: string;
  var_1_mean: number;
  var_1_median: number;
  var_1_min: number;
  var_1_max: number;
  var_1_std: number;
  var_1_unit: string;
  var_2: string | null;
  var_2_value: number | null;
  var_2_mean: number | null;
  var_2_median: number | null;
  var_2_min: number | null;
  var_2_max: number | null;
  var_2_std: number | null;
  var_2_unit: string | null;
}

export interface WeightedStats {
  weightedSum: number;
  totalCount: number;
  names: string[];
}

export const computeWeightedStats = (
  items: DataItem[],
  fieldToAverage: string,
  countField: string | number
): WeightedStats => {
  return items.reduce(
    (acc, item) => {
      const count =
        typeof countField === "number" ? countField : item[countField];
      const fieldValue = item[fieldToAverage] || 0;
      acc.weightedSum += fieldValue * count;
      acc.totalCount += count;
      acc.names.push(item.name ? item.name : item.zone_name);
      return acc;
    },
    { weightedSum: 0, totalCount: 0, names: [] }
  );
};

export const averageGroups = (
  rawDataTable: DataItem[][],
  fieldsToAverage: (string | [string, string | number])[]
): any[] => {
  const groupedData = [];
  rawDataTable.forEach((group) => {
    if (!group || group.length === 0) return;

    const uniqueStdTime = [...new Set(group.map((item) => item.stdtime))];
    const averagedData = uniqueStdTime.map((stdTime) => {
      const time = group.filter((item) => item.stdtime === stdTime);
      const weightedFields = fieldsToAverage.map((field) => {
        const { weightedSum, totalCount, names } = Array.isArray(field)
          ? computeWeightedStats(time, field[0], field[1])
          : computeWeightedStats(time, field, "count");
        const weightedMean = totalCount > 0 ? weightedSum / totalCount : 0;
        return {
          count: totalCount,
          name: names,
          field: Array.isArray(field) ? field[0] : field,
          weighted: weightedMean,
        };
      });
      const weightedFieldsObject = weightedFields.reduce((acc, item) => {
        acc[item.field] = item.weighted;
        return acc;
      }, {});
      return {
        stdtime: stdTime,
        ...weightedFieldsObject,
      };
    });
    groupedData.push(averagedData);
  });
  return groupedData;
};

export const combineXYdata = (
  xArrays: DataItem[][],
  yArrays: DataItem[][]
): CombinedDataItem[][] => {
  const combinedArrays = xArrays.map((xVals, index) => {
    const yVals = yArrays[index] || [];

    return xVals.map((item0) => {
      const matchingItem = yVals.find(
        (item1) =>
          item1.zone_name === item0.zone_name &&
          item1.stdtime === item0.stdtime
      );

      return {
        count_1: item0.count || 0,
        count_2: matchingItem ? matchingItem.count || 0 : null,
        zone_name: item0.zone_name || "",
        name: item0.name || "",
        stdtime: item0.stdtime,
        var_1: item0.variable || "",
        var_1_mean: item0.mean || 0,
        var_1_median: item0.median || 0,
        var_1_min: item0.min || 0,
        var_1_max: item0.max || 0,
        var_1_std: item0.std || 0,
        var_1_unit: item0.unit || "",
        var_2: matchingItem ? matchingItem.variable || "" : null,
        var_2_value: matchingItem ? matchingItem.value || 0 : null,
        var_2_mean: matchingItem ? matchingItem.mean || 0 : null,
        var_2_median: matchingItem ? matchingItem.median || 0 : null,
        var_2_min: matchingItem ? matchingItem.min || 0 : null,
        var_2_max: matchingItem ? matchingItem.max || 0 : null,
        var_2_std: matchingItem ? matchingItem.std || 0 : null,
        var_2_unit: matchingItem ? matchingItem.unit || "" : null,
      };
    });
  });
  return combinedArrays;
};
