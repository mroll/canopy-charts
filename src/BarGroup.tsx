import React, { useMemo } from "react";
import { Group } from "@visx/group";
import { scaleBand, scaleLinear, scaleOrdinal } from "@visx/scale";
import { BarGroup as VXBarGroup } from "@visx/shape";

import { useChartOps } from "./ChartOperations";
import { getTableColumn, getTableColumns } from "./util";

const blue = "#aeeef8";
export const green = "#e5fd3d";

function BarGroup(props: any) {
  const { id, config, group } = props;
  const {
    width,
    height,
    left,
    top,
    rx,
    outerPadding,
    innerPadding,
    fill,
    defaultFill,
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
  const YY = Y ? getTableColumns(chartTable, Y) : defaultY;

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
    : XX.map((x0: string, xIdx: number) => ({
        x0,
        ...defaultY.reduce(
          (acc: any, columnId: string, yIdx: number) => ({
            ...acc,
            [columnId]: YY[yIdx][xIdx],
          }),
          {}
        ),
      }));

  const keys = Y || defaultY;

  const getX0 = (d: any) => d.x0;

  // bounds
  const xMax = group ? group.width - group.margin.r : width;
  const yMax = group ? group.height - group.margin.b : height;

  const { minX, maxX, minY, maxY } = {
    minX: group ? group.margin.l : 0,
    maxX: group ? group.width - group.margin.r : width,
    minY: group ? group.margin.t : 0,
    maxY: group ? group.height - group.margin.b : height,
  };

  // scales, memoize for performance
  const x0Scale = useMemo(
    () =>
      scaleBand<string>({
        range: [minX, maxX],
        domain: XX,
        padding: outerPadding,
      }),
    [XX, outerPadding]
  );

  const x1Scale = useMemo(
    () =>
      scaleBand<string>({
        domain: keys,
        padding: innerPadding,
      }),
    [keys, innerPadding]
  );
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

  x1Scale.rangeRound([0, x0Scale.bandwidth()]);
  yScale.range([maxY, minY]);

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
                  fill={Y ? fill[bar.index] : defaultFill[bar.index]}
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
