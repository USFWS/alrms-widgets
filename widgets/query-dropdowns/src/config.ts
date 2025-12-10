import { type ImmutableObject } from "seamless-immutable";

export interface DataSourceConfig {
  variables: string[];
  imageryUrl?: string;
}

export interface AllowedCombinationsConfig {
  [key: string]: string[];
}

export interface Config {
  exampleConfigProperty: string;
  DataSources: {
    [key: string]: DataSourceConfig;
  };
  AllowedCombinations: AllowedCombinationsConfig;
}

export type IMConfig = ImmutableObject<Config>;
