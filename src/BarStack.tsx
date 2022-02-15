import React, { useMemo } from "react";
import { Group } from "@visx/group";
import { scaleLinear, scaleOrdinal } from "@visx/scale";
import { BarStack as VXBarStack } from "@visx/shape";

import { useChartOps } from "./ChartOperations";
import {
  scale as canopyScale,
  getTableColumn,
  getTableColumnsFromSelectors,
} from "./util";
import { ColumnSelector } from "./types";

const blue = "#aeeef8";
export const green = "#e5fd3d";

function BarStack(props: any) {
  const { config, group } = props;
  const {
    width,
    height,
    left,
    top,
    rx,
    gap,
    padding,
    fill,
    defaultFill,
    X,
    Y,
    defaultX,
    defaultY,
  } = config;
  const { getChartTable, getYColumnSelectors } = useChartOps();

  const chartTable = getChartTable();

  const XX = X ? getTableColumn(chartTable, X.name) : defaultX;
  const YY = Y
    ? getTableColumnsFromSelectors(chartTable, getYColumnSelectors())
    : defaultY;
  const xType = X
    ? chartTable?.head?.find((col) => col.name === X.name)?.type
    : null;

  const barGroupData = Y
    ? XX.body.map((x0: string, xIdx: number) => ({
        x0,
        ...Y.reduce(
          (acc: any, colSelector: ColumnSelector, yIdx: number) => ({
            ...acc,
            [colSelector.name]: YY[yIdx].body[xIdx],
          }),
          {}
        ),
      }))
    : XX.body.map((x0: string, xIdx: number) => ({
        x0,
        ...defaultY.reduce(
          (acc: any, column: any, yIdx: number) => ({
            ...acc,
            [column.head.name]: YY[yIdx].body[xIdx],
          }),
          {}
        ),
      }));

  const keys =
    Y.map((colSelector: ColumnSelector) => colSelector.name) ||
    defaultY.map((col: any) => col.head.name);

  const getXVal = (d: any) =>
    xType === "Date" ? new Date(d.x0).valueOf() : d.x0;

  const { minX, maxX, minY, maxY } = {
    minX: group ? group.margin.l : 0,
    maxX: group ? group.width - group.margin.r : width,
    minY: group ? group.margin.t : 0,
    maxY: group ? group.height - group.margin.b : height,
  };

  const xScale = useMemo(
    () => canopyScale([XX], [minX, maxX], padding),
    [XX, minX, maxX, padding]
  );

  const totals = barGroupData.map((dp: Record<string, string>) => {
    return keys.reduce((total: number, k: string) => {
      return (total += Number(dp[k]));
    }, 0);
  });

  const yScale = useMemo(() => {
    return scaleLinear<number>({
      domain: [0, Math.max(...totals)],
      range: [maxY, minY],
      nice: true,
    });
  }, [YY, minY, maxY]);
  const colorScale = scaleOrdinal<string, string>({
    domain: keys,
    range: [blue, green],
  });

  return (
    <Group top={top} left={left}>
      <VXBarStack
        data={barGroupData}
        keys={keys}
        x={getXVal}
        xScale={xScale}
        yScale={yScale}
        color={colorScale}
      >
        {(barStacks) =>
          barStacks.map((barStack) => {
            return barStack.bars.map((bar) => {
              return (
                <rect
                  key={`bar-stack-${barStack.index}-${bar.index}`}
                  x={bar.x}
                  y={bar.y}
                  height={bar.height - gap}
                  width={bar.width}
                  fill={Y ? fill[barStack.index] : defaultFill[barStack.index]}
                  rx={rx}
                />
              );
            });
          })
        }
      </VXBarStack>
    </Group>
  );
}

export default BarStack;
