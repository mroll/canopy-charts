import React, { useMemo } from "react";
import { Group } from "@visx/group";
import { scaleBand, scaleLinear, scaleOrdinal } from "@visx/scale";
import { Grid as VXGrid } from "@visx/grid";
import { extent } from "d3-array";

import { useChartOps } from "./ChartOperations";
import { getTableColumn, getTableColumns, useLinearScale } from "./util";

const blue = "#aeeef8";
export const green = "#e5fd3d";

function Grid(props: any) {
  const { id, config } = props;
  const {
    width,
    height,
    left,
    top,
    fill,
    numTickRows,
    numTickColumns,
    stroke,
    strokeWidth,
    X,
    Y,
    defaultX,
    defaultY,
  } = config;
  const { setInteractions, getChartTable } = useChartOps();

  const chartTable = getChartTable();

  const interactClass = setInteractions(id, {
    drag: {
      xField: "left",
      yField: "top",
    },
  });

  const XX = X ? getTableColumn(chartTable, X) : defaultX;
  const YY = (Y ? getTableColumns(chartTable, Y) : defaultY).flatMap(
    (col: string[]) => col.map((x: string) => x)
  );

  // bounds
  const xMax = width;
  const yMax = height;

  const xScale = useMemo(
    () =>
      scaleBand<string>({
        range: [0, xMax],
        round: true,
        domain: XX,
        padding: 0.4,
      }),
    [xMax, XX]
  );

  const yScale = useMemo(() => {
    if (useLinearScale(YY)) {
      const dMax = Math.max(...YY.map((d: string) => parseInt(d, 10)));

      return scaleLinear<number>({
        range: [0, width],
        round: true,
        domain: [0, dMax],
      });
    }

    return scaleBand<string>({
      range: [0, width],
      round: true,
      domain: YY,
      padding: 0.4,
    });
  }, [width, YY]);

  return (
    <VXGrid
      className={interactClass}
      xScale={xScale}
      yScale={yScale}
      width={xMax}
      height={yMax}
      numTicksRows={numTickRows}
      numTicksColumns={numTickColumns}
      fill={fill}
      left={left}
      top={top}
      stroke={stroke}
      strokeWidth={strokeWidth}
    />
  );
}

export default Grid;
