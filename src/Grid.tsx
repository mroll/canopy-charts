import React, { useMemo } from "react";
import { Grid as VXGrid } from "@visx/grid";

import { useChartOps } from "./ChartOperations";
import {
  boundaries,
  scale as canopyScale,
  getTableColumnsFromSelectors,
} from "./util";

function Grid(props: any) {
  const { id, config, group } = props;
  const {
    width,
    height,
    fill,
    numTickRows,
    numTickColumns,
    stroke,
    strokeWidth,
    defaultX,
    defaultY,
  } = config;
  const {
    setInteractions,
    dataTable,
    getChartTable,
    getXColumnSelectors,
    getYColumnSelectors,
  } = useChartOps();

  const chartTable = dataTable || getChartTable();

  const interactClass = setInteractions(id, {
    drag: {
      xField: "left",
      yField: "top",
    },
  });

  const xColumns = getXColumnSelectors();
  const yColumns = getYColumnSelectors();
  const XX =
    xColumns.length > 0
      ? getTableColumnsFromSelectors(chartTable, xColumns)
      : defaultX;
  const YY =
    yColumns.length > 0
      ? getTableColumnsFromSelectors(chartTable, yColumns)
      : defaultY;

  const { minX, minY, maxY } = boundaries(width, height, group);

  const xRange: [number, number] = [
    0,
    group.width - group.margin.l - group.margin.r,
  ];
  const yRange: [number, number] =
    YY[0].head.type === "Number"
      ? [group.height - group.margin.t - group.margin.b, 0]
      : [maxY, minY];
  const xScale = useMemo(() => canopyScale(XX, xRange), [XX, xRange]);
  const yScale = useMemo(() => canopyScale(YY, yRange), [YY, yRange]);

  return (
    <VXGrid
      className={interactClass}
      xScale={xScale}
      yScale={yScale}
      width={group ? group.width - group.margin.r - group.margin.l : width}
      height={group ? group.height - group.margin.t - group.margin.b : height}
      numTicksRows={numTickRows}
      numTicksColumns={numTickColumns}
      fill={fill}
      left={minX}
      top={minY}
      stroke={stroke}
      strokeWidth={strokeWidth}
    />
  );
}

export default Grid;
