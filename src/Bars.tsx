import React, { useMemo } from "react";
import { Bar } from "@visx/shape";
import { Group } from "@visx/group";
import { scaleBand } from "@visx/scale";

import { useChartOps } from "./ChartOperations";
import { boundaries, scale as canopyScale, getTableColumn } from "./util";

function RenderBars(props: any) {
  const { id, config, group } = props;
  const {
    width,
    height,
    top,
    left,
    fill,
    rx,
    padding,
    X,
    Y,
    defaultX,
    defaultY,
  } = config;
  const { setSelectedComponent, dataTable } = useChartOps();

  const chartTable = dataTable;

  const XX = X ? getTableColumn(chartTable, X.name) : defaultX;
  const YY = Y ? getTableColumn(chartTable, Y.name) : defaultY;

  // bounds
  const yMax = group ? group.height - group.margin.b : height;

  const { minX, maxX, minY, maxY } = boundaries(width, height, group);

  const xScale = useMemo(
    () =>
      scaleBand<string>({
        range: [minX, maxX],
        domain: XX.body,
        padding: padding,
      }),
    [XX, minX, maxX, padding]
  );
  const yScale = useMemo(
    () => canopyScale([YY], [maxY, minY]),
    [YY, minY, maxY]
  );

  // const classIfSelected =
  //   selectedComponentId === id ? "stroke-current text-blue-300 stroke-2" : "";

  return (
    <Group
      className={
        "${interactClass} hover:stroke-current hover:text-blue-300 hover:stroke-2"
      }
      top={top}
      left={left}
      onClick={() => setSelectedComponent(id)}
    >
      {XX.body.map((xVal: string, idx: number) => {
        const barWidth = xScale.bandwidth();
        const barHeight = yMax - (yScale(YY.body[idx]) ?? 0);
        const barX = xScale(xVal);
        const barY = yMax - barHeight;

        return (
          <Bar
            key={`bar-${xVal}`}
            x={barX}
            y={barY}
            width={barWidth}
            height={barHeight}
            fill={fill}
            rx={rx}
          />
        );
      })}
    </Group>
  );
}

export default RenderBars;
