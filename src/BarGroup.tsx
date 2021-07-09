import React, { useMemo } from "react";
import { Group } from "@visx/group";
import { scaleBand, scaleLinear, scaleOrdinal } from "@visx/scale";
import { BarGroup as VXBarGroup } from "@visx/shape";

import { useChartOps } from "./ChartOperations";

const blue = "#aeeef8";
export const green = "#e5fd3d";

const getTableColumn = (t: any[], columnId: string) =>
  t.map((r: any) => r[columnId]);

const getTableColumns = (t: any[], columnIds: string[]) =>
  columnIds.map((columnId: string) => getTableColumn(t, columnId));

function BarGroup(props: any) {
  const { id, config } = props;
  const { width, height, left, top, rx, fill, X, Y } = config;
  const { setInteractions, getChartTable } = useChartOps();

  const chartTable = getChartTable();

  const interactClass = setInteractions(id, {
    drag: {
      xField: "left",
      yField: "top",
    },
  });

  const XX = X ? getTableColumn(chartTable, X) : ["a", "b", "c", "d", "e"];
  const YY = Y ? getTableColumns(chartTable, Y) : [[1, 2, 3, 4, 5]];

  const barGroupData = Y
    ? XX.map((x0: string, xIdx: number) => ({
        x0,
        ...Y.reduce(
          (acc: any, columnId: string, yIdx: number) => ({
            ...acc,
            [columnId]: YY[yIdx][xIdx],
          }),
          {}
        ),
      }))
    : [];

  const keys = Y || [];

  const getX0 = (d: any) => d.x0;

  // bounds
  const xMax = width;
  const yMax = height;

  // scales, memoize for performance
  const x0Scale = useMemo(
    () =>
      scaleBand<string>({
        domain: XX,
        padding: 0.2,
      }),
    [XX]
  );
  const x1Scale = scaleBand<string>({
    domain: keys,
    padding: 0.2,
  });
  const yScale = scaleLinear<number>({
    domain: [
      0,
      Math.max(
        ...barGroupData.map((d: any) =>
          Math.max(...keys.map((key: any) => Number(d[key])))
        )
      ),
    ],
  });
  const colorScale = scaleOrdinal<string, string>({
    domain: keys,
    range: [blue, green],
  });

  x0Scale.rangeRound([0, xMax]);
  x1Scale.rangeRound([0, x0Scale.bandwidth()]);
  yScale.range([yMax, 0]);

  return (
    <Group className={interactClass} top={top} left={left}>
      <VXBarGroup
        data={barGroupData}
        keys={keys}
        height={yMax}
        x0={getX0}
        x0Scale={x0Scale}
        x1Scale={x1Scale}
        yScale={yScale}
        color={colorScale}
      >
        {(barGroups) =>
          barGroups.map((barGroup) => (
            <Group
              key={`bar-group-${barGroup.index}-${barGroup.x0}`}
              left={barGroup.x0}
            >
              {barGroup.bars.map((bar) => (
                <rect
                  key={`bar-group-bar-${barGroup.index}-${bar.index}-${bar.value}-${bar.key}`}
                  x={bar.x}
                  y={bar.y}
                  width={bar.width}
                  height={bar.height}
                  fill={fill[bar.index]}
                  rx={rx}
                />
              ))}
            </Group>
          ))
        }
      </VXBarGroup>
    </Group>
  );
}

export default BarGroup;
