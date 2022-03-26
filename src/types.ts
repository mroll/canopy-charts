import { ReactNode } from "react";

export const ComponentType = {
  Axis: "Axis",
  AreaClosed: "AreaClosed",
  Difference: "Difference",
  Bar: "Bar",
  Bars: "Bars",
  BarGroup: "BarGroup",
  BarStack: "BarStack",
  Curve: "Curve",
  Gradient: "Gradient",
  Grid: "Grid",
  Group: "Group",
  Pie: "Pie",
  Rect: "Rect",
  Title: "Title",
  Text: "Text",
  Container: "Container",
};

type ComponentAttributeValue =
  | string
  | number
  | {
      [key: string]: ComponentAttributeValue;
    }
  | (string | number)[]
  | (string | number)[][]
  | boolean
  | TableColumn
  | TableColumn[]
  | ColumnSelector
  | null;

export type ChartComponentConfig = {
  [key: string]: ComponentAttributeValue;
};

export interface ChartComponent {
  id: string;
  name: string;
  type: string;
  templateId: string;
  config: ChartComponentConfig;
  dataId?: string;
  children?: string[];
}

export interface ChartComponentProps extends ChartComponent {
  componentsById: {
    [key: string]: ChartComponent;
  };
  table: Array<any>;
  group?: any;
  dataId?: string;
  renderForEditor: boolean;
}

export interface Component2RenderMap {
  [key: string]: any;
}

export interface TableColumnHeader {
  type: string;
  name: string;
  remote?: boolean;
}

export type TableData = string | number | Date;

export type TableColumn = {
  head: TableColumnHeader;
  body: Array<TableData>;
};

export interface ChartTable {
  head: Array<TableColumnHeader>;
  body: Array<Array<TableData>>;
}

export type ColumnSelector = {
  type: string;
  collection: string;
  name: string;
};

export interface Chart {
  id: string;
  name: string;
  color: string;
  width: number;
  height: number;
  top: number;
  left: number;
  margin: {
    t: number;
    b: number;
    r: number;
    l: number;
  };
  textHeight: 0;
  userId: string;
  createdAt?: Date;
  componentsById: {
    [key: string]: ChartComponent;
  };
  componentsArray: string[];
  table: ChartTable;
  remoteTable: ChartTable;
  remoteColumns: {
    [componentId: string]: {
      [field: string]: ColumnSelector;
    };
  };
  selectedComponentId: string | null;
}

export interface InteractionOptions {
  drag: {
    xField: string;
    yField: string;
  };
}

export interface ChartOperationsContextObject {
  setChart: (chart: Chart) => void;
  setTextHeight: (ref: any) => void;
  getTextHeight: () => number;
  setComponentFields: (componentId: string, ...setters: any[]) => void;
  setInteractions: (componentId: string, options: InteractionOptions) => string;
  setSelectedComponent: (componentId: string | null) => void;
  getChartTable: () => ChartTable;
  getXColumns: () => ComponentAttributeValue[];
  getXColumnSelectors: () => ColumnSelector[];
  getYColumnSelectors: () => ColumnSelector[];
  getYColumns: () => ComponentAttributeValue[];
  getChartDimensions: () => {
    width: number;
    height: number;
  };
  getContainer: () => ChartComponent | undefined;
  selectedComponentId: string;
  getComponents: (ids: string[]) => ChartComponent[];
  computedChartHeight: () => number;
  dataTable: ChartTable;
}

type FunctionalSetter = (prevChart: Chart) => void;

export interface ChartOperationsProviderArgs {
  chart: Chart;
  setChart: ((newChart: Chart) => void) | ((setter: FunctionalSetter) => void);
  renderForEditor: boolean;
  width: number;
  height: number;
  children: JSX.Element | ReactNode;
}

export interface Group {
  width: number;
  height: number;
  margin: {
    t: number;
    b: number;
    l: number;
    r: number;
  };
}
