import React, { useMemo } from "react";
import { scaleBand, scaleLinear, scaleOrdinal } from "@visx/scale";
import { Grid as VXGrid } from "@visx/grid";

import { useChartOps } from "./ChartOperations";
import { getTableColumn, getTableColumns, useLinearScale } from "./util";

function Grid(props: any) {
  const { id, config, group } = props;
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
    rowPadding,
    colPadding,
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

  const { minX, maxX, minY, maxY } = {
    minX: group ? group.margin.l : 0,
    maxX: group ? group.width - group.margin.r : width,
    minY: group ? group.margin.t : 0,
    maxY: group ? group.height - group.margin.b - group.margin.t : height,
  };

  const xScale = useMemo(
    () =>
      scaleBand<string>({
        range: [0, maxX],
        domain: XX,
        padding: colPadding,
      }),
    [XX, minX, maxX, colPadding]
  );

  const yScale = useMemo(() => {
    if (useLinearScale(YY)) {
      const dMax = Math.max(...YY.map((d: string) => parseInt(d, 10)));

      // Not sure why we have to subtract group.margin.b here, or
      // why we have to set the second param to zero - but apparently
      // we do.
      return scaleLinear<number>({
        range: [group.height - group.margin.t - group.margin.b, 0],
        domain: [0, dMax],
      });
    }

    return scaleBand<string>({
      range: [maxY, minY],
      domain: YY,
      padding: rowPadding,
    });
  }, [YY, minY, maxY, rowPadding]);

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
