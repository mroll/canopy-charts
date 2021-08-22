import { ReactNode } from "react";

export const ComponentType = {
  Axis: "Axis",
  AreaClosed: "AreaClosed",
  Difference: "Difference",
  Bar: "Bar",
  Bars: "Bars",
  BarGroup: "BarGroup",
  Curve: "Curve",
  Gradient: "Gradient",
  Grid: "Grid",
  Group: "Group",
  Rect: "Rect",
};


type ComponentAttributeValue = string
    | number
    | {
        [key: string]: ComponentAttributeValue;
      }
    | (string | number)[]
    | (string | number)[][]
    | boolean
    | TableColumn
    | TableColumn[]
    | null

export interface ChartComponentConfig {
  [key: string]: ComponentAttributeValue
}

export interface ChartComponent {
  id: string;
  name: string;
  type: string;
  templateId: string;
  config: ChartComponentConfig;
  dataId?: string;
  members?: string[];
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
}

export type TableData = string | number | Date

export type TableColumn = {
    head: TableColumnHeader,
    body: Array<TableData>
};

export interface ChartTable {
  head: Array<TableColumnHeader>;
  body: Array<Array<TableData>>;
}

export interface Chart {
  id: string;
  name: string;
  color: string;
  userId: string;
  createdAt?: Date;
  componentsById: {
    [key: string]: ChartComponent;
  };
  componentsArray: string[];
  table: ChartTable;
  selectedComponentId: string | null;
}

export interface InteractionOptions {
  drag: {
    xField: string;
    yField: string;
  };
}

export interface ChartOperationsContextObject {
  setComponentFields: (componentId: string, ...setters: any[]) => void;
  setInteractions: (componentId: string, options: InteractionOptions) => string;
  setSelectedComponent: (componentId: string | null) => void;
  getChartTable: () => ChartTable;
  selectedComponentId: string;
}

type FunctionalSetter = (prevChart: Chart) => void;

export interface ChartOperationsProviderArgs {
  chart: Chart;
  setChart: ((newChart: Chart) => void) | ((setter: FunctionalSetter) => void);
  renderForEditor: boolean;
  children: JSX.Element | ReactNode;
}

export interface Group {
    width: number
    height: number
    margin: {
	t: number
	b: number
	l: number
	r: number
    }
}
