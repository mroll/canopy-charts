import React, { useMemo } from "react";
import { Bar } from "@visx/shape";
import { Group } from "@visx/group";
import { scaleBand, scaleLinear } from "@visx/scale";

import { useChartOps } from "./ChartOperations";
import { getTableColumn, useLinearScale } from "./util";

function RenderBars(props: any) {
  const { id, config } = props;
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
  const { setInteractions, getChartTable } = useChartOps();

  const chartTable = getChartTable();

  const XX = X ? getTableColumn(chartTable, X) : defaultX;
  const YY = Y ? getTableColumn(chartTable, Y) : defaultY;

  // bounds
  const xMax = width;
  const yMax = height;

  // scales, memoize for performance
  const xScale = useMemo(
    () =>
      scaleBand<string>({
        range: [0, xMax],
        domain: XX,
        padding: padding,
      }),
    [xMax, XX]
  );
  const yScale = useMemo(() => {
    if (useLinearScale(YY)) {
      const dMax = Math.max(...YY.map((d: string) => parseInt(d, 10)));

      return scaleLinear<number>({
        range: [height, 0],
        round: true,
        domain: [0, dMax],
      });
    }

    return scaleBand<string>({
      range: [height, 0],
      round: true,
      domain: YY,
      padding: 0.4,
    });
  }, [height, YY]);

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
