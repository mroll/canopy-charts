import React, { useMemo } from "react";
import { Bar } from "@visx/shape";
import { Group } from "@visx/group";
import { scaleBand, scaleLinear } from "@visx/scale";

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
  const {
    setInteractions,
    selectedComponentId,
    setSelectedComponent,
    getChartTable,
  } = useChartOps();

  const chartTable = getChartTable();

  const XX = X ? getTableColumn(chartTable, X) : defaultX;
  const YY = Y ? getTableColumn(chartTable, Y) : defaultY;

  // bounds
  const xMax = group ? group.width - group.margin.r : width;
  const yMax = group ? group.height - group.margin.b : height;

  const { minX, maxX, minY, maxY } = boundaries(width, height, group);

  const xScale = useMemo(
    () =>
      scaleBand<string>({
        range: [minX, maxX],
        domain: XX,
        padding: padding,
      }),
    [XX, minX, maxX, padding]
  );
  const yScale = useMemo(
    () => canopyScale([YY], [maxY, minY]),
    [YY, minY, maxY]
  );

  const interactClass = group
    ? ""
    : setInteractions(id, {
        drag: {
          xField: "left",
          yField: "top",
        },
      });

  const classIfSelected =
    selectedComponentId === id ? "stroke-current text-blue-300 stroke-2" : "";

  return (
    <Group
      className={`${interactClass} hover:stroke-current hover:text-blue-300 hover:stroke-2 ${classIfSelected}`}
      top={top}
      left={left}
      onClick={() => setSelectedComponent(id)}
    >
      {XX.map((xVal: string, idx: number) => {
        const barWidth = xScale.bandwidth();
        const barHeight = yMax - (yScale(YY[idx]) ?? 0);
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
