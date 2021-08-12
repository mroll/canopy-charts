import { scaleBand, scaleLinear, scaleTime } from "@visx/scale";
import { extent } from "d3-array";
import { ScaleBand, ScaleLinear, ScaleTime } from "d3-scale";

import { ChartTable, Group, TableColumn, TableData } from "./types";

export const getTableColumn = (
  t: ChartTable,
  columnName: string
): TableColumn => {
  const head = t.head.find((col) => col.name === columnName);
  const colIndex = t.head.findIndex((col) => col.name === columnName);

  if (head === undefined) {
    return {
      head: {
        name: columnName,
        type: "Text",
      },
      body: [],
    };
  }

  return {
    head,
    body: t.body
      .map((row) => row[colIndex])
      .filter((cell) => cell && cell !== ""),
  };
};

export const getTableColumns = (
  t: ChartTable,
  columnNames: string[]
): TableColumn[] =>
  columnNames.map((columnId: string) => getTableColumn(t, columnId));

export const boundaries = (width: number, height: number, group: Group) => {
  return {
    minX: group ? group.margin.l : 0,
    maxX: group ? group.width - group.margin.r : width,
    minY: group ? group.margin.t : 0,
    maxY: group ? group.height - group.margin.b : height,
  };
};

const date = (d: TableData) => new Date(d).valueOf();

export const scale = (
  columns: TableColumn[],
  range: [number, number],
  padding?: number
) => {
  const data = columns.flatMap((col: TableColumn) =>
    col.body.map((x: TableData) => x)
  );

  const colTypes = new Set<string>(columns.map((col) => col.head.type));

  if (colTypes.size > 1) {
    // return band scale
    return scaleBand<string>({
      range,
      padding,
      domain: data as string[],
    });
  }

  const colType = colTypes.values().next().value;

  switch (colType) {
    case "Date":
      return scaleTime<number>({
        range,
        domain: [Math.min(...data.map(date)), Math.max(...data.map(date))],
      });
    case "Number":
      const domain = extent(data.map((d) => parseInt(d as string, 10)));

      if (domain[0] === undefined) {
        throw new Error("Cannot create a scale for empty data set");
      }

      return scaleLinear<number>({
        range,
        domain: [0, domain[1]],
      });
    default:
      return scaleBand<string>({
        range,
        padding,
        domain: data as string[],
      });
  }
};

export const isBandScale = (
  scale:
    | ScaleBand<string>
    | ScaleTime<number, number, never>
    | ScaleLinear<number, number, never>
): scale is ScaleBand<string> => {
  return scale.hasOwnProperty("bandwidth");
};
