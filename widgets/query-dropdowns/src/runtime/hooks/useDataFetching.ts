/**
 * Custom hooks for data fetching and query management
 */

import { useEffect } from "react";
import type { Zone, ZoneSubset } from "../types";
import { PlotType } from "../types";

/**
 * Convert epoch time to UTC year
 */
function convertToUTC(timeEpoch: number): number {
  const d = new Date(timeEpoch);
  return d.getUTCFullYear();
}

/**
 * Hook to manage year range based on selected tables
 * Fetches unique years from tables and updates year range/values
 */
export function useYearRange(
  zone: Zone,
  dataSource: { source: string; variables: string[] },
  var2: string,
  plotType: PlotType,
  yearRange: number[],
  yearValues: { min: number; max: number },
  setYearRange: (range: number[]) => void,
  setYearValues: (values: { min: number; max: number }) => void
) {
  useEffect(() => {
    if (!zone.dataset || !dataSource.source) return;

    const table = zone.tables.find((table) =>
      table.title.includes(dataSource.source.split(" ")[1])
    );
    
    const table2 = var2
      ? zone.tables.find((table) =>
          table.title.includes(var2.split(":")[0].split(" ")[1])
        )
      : undefined;

    async function loadTableYears(table: any): Promise<number[] | undefined> {
      try {
        if (table?.type === "feature") {
          await table.load();
          const query = table.createQuery();
          query.returnDistinctValues = true;
          query.outFields = ["stdtime"];

          const uniqueValuesResults = await table.queryFeatures(query);
          const uniqueYears = uniqueValuesResults.features.map((feature: any) =>
            convertToUTC(feature.attributes.stdtime)
          );
          return uniqueYears;
        }
      } catch (error) {
        console.error("Error loading table:", error);
      }
    }

    (async () => {
      const uniqueYears1 = await loadTableYears(table);
      if (!uniqueYears1) return;

      const uniqueYears2 =
        table2 && plotType === 1 ? await loadTableYears(table2) : undefined;

      const uniqueYears = uniqueYears2
        ? uniqueYears1.filter((year) => uniqueYears2.includes(year))
        : uniqueYears1;

      const minYear = Math.min(...uniqueYears);
      const maxYear = Math.max(...uniqueYears);
      setYearRange(uniqueYears);

      if (
        !uniqueYears.includes(yearValues.min) ||
        !uniqueYears.includes(yearValues.max) ||
        yearValues.min === Math.min(...yearRange) ||
        yearValues.max === Math.max(...yearRange)
      ) {
        const newYearValues = {
          ...yearValues,
          min:
            !uniqueYears.includes(yearValues.min) ||
            yearValues.min === Math.min(...yearRange)
              ? minYear
              : yearValues.min,
          max:
            !uniqueYears.includes(yearValues.max) ||
            yearValues.max === Math.max(...yearRange)
              ? maxYear
              : yearValues.max,
        };
        setYearValues(newYearValues);
      }
    })();
  }, [zone.dataset, dataSource.source, var2, plotType]);
}

/**
 * Hook to build table queries based on zone selections and variables
 * Generates SQL-like WHERE clauses for querying feature tables
 */
export function useTableQueries(
  zone: Zone,
  dataSource: { source: string; variables: string[] },
  var1: string,
  var2: string,
  plotType: PlotType,
  zoneSubsets: ZoneSubset[],
  yearValues: { min: number; max: number },
  setTableQuery: (queries: any[]) => void
) {
  useEffect(() => {
    if (!zone.dataset || !dataSource.source || !var1) return;

    const tableQueries: (string | string[])[] = [];

    // Only process groups that have polygon selections
    const validGroups = zoneSubsets.filter(
      (group) => group.polygons && group.polygons.length > 0
    );

    for (let i = 0; i < validGroups.length; i++) {
      const zoneSubsetString = validGroups[i].polygons
        .map((poly) => `'${poly.value}'`)
        .join(", ");

      if (plotType === PlotType.TIME_SERIES) {
        // Time series mode
        const query = `zone_name IN (${zoneSubsetString}) AND variable = '${var1}' AND stdtime >= date '${yearValues.min}-01-01' AND stdtime <= date '${yearValues.max}-01-01'`;
        tableQueries.push(query);
      } else if (plotType === PlotType.SCATTER) {
        // Scatter plot mode
        const query1 = `zone_name IN (${zoneSubsetString}) AND variable = '${var1}' AND stdtime >= date '${yearValues.min}-01-01' AND stdtime <= date '${yearValues.max}-01-01'`;
        const query2 = `zone_name IN (${zoneSubsetString}) AND variable = '${
          var2.split(": ")[1]
        }' AND stdtime >= date '${yearValues.min}-01-01' AND stdtime <= date '${yearValues.max}-01-01'`;
        tableQueries.push([query1, query2]);
      }
    }

    setTableQuery(tableQueries as any);
  }, [zone, dataSource, zoneSubsets, plotType, var1, var2, yearValues]);
}

/**
 * Hook to manage var2 options based on var1 selection
 * Fetches allowed combinations and ancillary data options
 */
export function useVar2Options(
  zone: Zone,
  var1: string,
  props: any,
  setVar2Options: (options: any) => void
) {
  useEffect(() => {
    if (!zone.dataset || !var1 || !props.config.AllowedCombinations) return;

    const allowedCombs = props.config.AllowedCombinations[var1]?.asMutable() || {};

    // Check for ancillary data table
    const ancillaryTable = zone.tables.find((table) =>
      table.title.toLowerCase().includes("ancillary")
    );

    if (ancillaryTable) {
      const query = ancillaryTable.createQuery();
      query.where = "1=1";
      query.returnDistinctValues = true;
      query.outFields = ["variable"];

      const tryQuery = async (query: any) => {
        try {
          return await ancillaryTable.queryFeatures(query);
        } catch (error) {
          console.error("Error querying ancillary data:", error);
          return null;
        }
      };

      tryQuery(query).then((results) => {
        if (results) {
          const uniqueValues = [
            ...new Set(
              results.features.map((feature: any) => feature.attributes.variable)
            ),
          ];
          setVar2Options({
            ...allowedCombs,
            "Ancillary Data": uniqueValues,
          });
        }
      });
    } else {
      setVar2Options(allowedCombs);
    }
  }, [zone, var1]);
}

/**
 * Hook to reset var2 when data source or var1 changes
 */
export function useVar2Reset(
  dataSource: { source: string; variables: string[] },
  var1: string,
  setVar2: (value: string) => void
) {
  useEffect(() => {
    if (dataSource.source) {
      setVar2("");
    }
  }, [dataSource.source, var1]);
}

/**
 * Hook to validate var1 against current data source
 * Resets var1 if it's not in the current data source's variables
 */
export function useVar1Validation(
  dataSource: { source: string; variables: string[] },
  var1: string,
  config: any,
  setVar1: (value: string | null) => void
) {
  useEffect(() => {
    if (!dataSource.source || !config.DataSources) return;

    const dataSourceConfig = config.DataSources[dataSource.source];
    if (dataSourceConfig && !dataSourceConfig.variables.includes(var1)) {
      setVar1(null);
    }
  }, [dataSource.source]);
}
