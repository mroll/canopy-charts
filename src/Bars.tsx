import React, { useMemo } from "react";
import { Bar } from "@visx/shape";
import { Group } from "@visx/group";
import { scaleBand, scaleLinear } from "@visx/scale";

import { useChartOps } from "./ChartOperations";

function RenderBars(props: any) {
  const { id, config } = props;
  const { width, height, top, left, fill, rx, X, Y } = config;
  const { setInteractions, getChartTable } = useChartOps();

  const chartTable = getChartTable();

  const XX = X
    ? chartTable.map((r: string[]) => r[X])
    : ["a", "b", "c", "d", "e"];
  const YY = Y ? chartTable.map((r: number[]) => r[Y]) : [1, 2, 3, 4, 5];

  // bounds
  const xMax = width;
  const yMax = height;

  // scales, memoize for performance
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
  const yScale = useMemo(
    () =>
      scaleLinear<number>({
        range: [yMax, 0],
        round: true,
        domain: [0, Math.max(...YY)],
      }),
    [yMax, YY]
  );

  const interactClass = setInteractions(id, {
    drag: {
      xField: "left",
      yField: "top",
    },
  });

  return (
    <Group className={interactClass} top={top} left={left}>
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
