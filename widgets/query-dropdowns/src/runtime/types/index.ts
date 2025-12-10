import { JimuMapView } from "jimu-arcgis";

export enum PlotType {
  TIME_SERIES = 0,
  SCATTER = 1,
}

export interface Polygon {
  label: string;
  value: string;
  objectid: number;
}

export interface Zone {
  dataset: any | null;
  title: string;
  tables: any[];
  polygons: Polygon[];
}

export interface ZoneSubset {
  groupId: number;
  polygons: Polygon[];
}

export interface GraphicsLayerMap {
  [groupId: string]: any;
}

export interface GeometryItem {
  oid: number;
  geom: any;
}

export interface ZoneOidsMap {
  [groupId: string]: number[];
}

export interface HighlightZonesParams {
  zone: Zone;
  zoneOids: ZoneOidsMap;
  graphicsLayers: GraphicsLayerMap;
  jmv: JimuMapView;
  onGraphicsLayersUpdate: (layers: GraphicsLayerMap) => void;
  isMultiGroup?: boolean;
}
