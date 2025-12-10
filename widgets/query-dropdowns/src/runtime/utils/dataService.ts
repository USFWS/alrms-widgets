/**
 * Data service module for querying feature tables
 * Handles data fetching and processing for time series and scatter plot modes
 */

import type { Zone } from "../types";
import { PlotType } from "../types";

export interface DataServiceParams {
  zone: Zone;
  dataSource: { source: string; variables: string[] };
  zoneSubsets: Array<{ groupId: number; polygons: any[] }>;
  var1: string;
  var2?: string;
  plotType: PlotType;
  tableQuery: string[] | string[][];
  onWarning: (message: string) => void;
  onError: (message: string) => void;
  onAncillaryChange: (isAncillary: boolean) => void;
}

/**
 * Loads table structure and queries features based on provided query string
 */
async function loadTableStructure(
  table: any,
  queryString: string,
  index: number,
  onWarning: (message: string) => void
): Promise<any[] | undefined> {
  try {
    if (table.type === "feature") {
      await table.load();
      const query = table.createQuery();
      query.returnDistinctValues = true;
      query.maxRecordCountFactor = 5;
      query.where = queryString;
      const queryResults = await table.queryFeatures(query);
      
      if (queryResults.features.length === 2000 * query.maxRecordCountFactor) {
        onWarning(
          `Results for Group ${index + 1} may have exceeded query limits (${
            2000 * query.maxRecordCountFactor
          } table rows) and data may be truncated. Consider limiting time range or geographic area.`
        );
      }
      
      return queryResults.features.map((feature) => feature.attributes);
    }
  } catch (error) {
    console.error("Error loading table:", error);
    throw error;
  }
}

/**
 * Dispatches table queries for time series mode (plotType === 0)
 */
async function dispatchTimeSeriesData(
  params: DataServiceParams
): Promise<any[][] | null> {
  const { zone, dataSource, zoneSubsets, var1, tableQuery, onWarning, onError } = params;

  const hasSelections = zoneSubsets.some(group => group.polygons && group.polygons.length > 0);

  if (!zone.dataset || !dataSource.source || !hasSelections || !var1) {
    onError("Please select a zone, data source, and variable before querying.");
    return null;
  }

  const table = zone.tables.find((table) =>
    table.title.includes(dataSource.source.split(" ")[1])
  );

  if (!table) {
    console.error("No matching table found.");
    return null;
  }

  const dataTableResults = await Promise.all(
    (tableQuery as string[]).map(async (query, index) => {
      const dataTableResult = await loadTableStructure(table, query, index, onWarning);
      return dataTableResult;
    })
  );

  return [dataTableResults];
}

/**
 * Dispatches table queries for scatter plot mode
 */
async function dispatchScatterData(
  params: DataServiceParams
): Promise<any[][] | null> {
  const {
    zone,
    dataSource,
    zoneSubsets,
    var1,
    var2,
    tableQuery,
    onWarning,
    onError,
    onAncillaryChange,
  } = params;

  const hasSelections = zoneSubsets.some(group => group.polygons && group.polygons.length > 0);

  if (
    !zone.dataset ||
    !dataSource.source ||
    !hasSelections ||
    !var1 ||
    !var2
  ) {
    onError("Please select zone, data source, both variables before querying.");
    return null;
  }

  const table1 = zone.tables.find((table) =>
    table.title.includes(dataSource.source.split(" ")[1])
  );

  let table2;
  if (var2.toLowerCase().includes("ancillary")) {
    table2 = zone.tables.find((table) => table.title.toLowerCase().includes("ancillary"));
    onAncillaryChange(true);
  } else {
    table2 = zone.tables.find((table) =>
      table.title.includes(var2.split(":")[0].split(" ")[1])
    );
    onAncillaryChange(false);
  }

  if (!table1 || !table2) {
    console.error("Error fetching table(s).");
    return null;
  }

  const dataTable1Results = await Promise.all(
    (tableQuery as string[][]).map(async (query, index) => {
      const dataTable1Result = await loadTableStructure(table1, query[0], index, onWarning);
      return dataTable1Result;
    })
  );

  const dataTable2Results = await Promise.all(
    (tableQuery as string[][]).map(async (query, index) => {
      const dataTable2Result = await loadTableStructure(table2, query[1], index, onWarning);
      return dataTable2Result;
    })
  );

  return [dataTable1Results, dataTable2Results];
}

/**
 * Main dispatcher function that routes to appropriate data fetching based on plot type
 */
export async function dispatchTableData(
  params: DataServiceParams
): Promise<any[][] | null> {
  if (params.plotType === PlotType.TIME_SERIES) {
    return await dispatchTimeSeriesData(params);
  } else if (params.plotType === PlotType.SCATTER) {
    return dispatchScatterData(params);
  }
  
  return null;
}
