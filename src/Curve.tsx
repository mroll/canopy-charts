import React, { useMemo } from "react";
import * as allCurves from "@visx/curve";
import { Group } from "@visx/group";
import { scaleBand, scaleLinear } from "@visx/scale";
import { LinePath } from "@visx/shape";

import { useChartOps } from "./ChartOperations";

type CurveType = keyof typeof allCurves;

function RenderCurve(props: any) {
  const { id, config, dataIdx, chartData } = props;
  const {
    curve,
    width,
    height,
    top,
    left,
    stroke,
    X,
    Y,
    strokeWidth,
    strokeOpacity,
  } = config;
  const { setInteractions, getChartTable } = useChartOps();

  const chartTable = getChartTable();

  const XX = X
    ? chartTable.map((r: (string | number)[]) => r[X])
    : ["a", "b", "c", "d", "e", "f"];
  const YY = Y
    ? chartTable.map((r: (string | number)[]) => r[Y])
    : [1, 3, 2, 5, 4, 6];
  const lineData = XX.map((x: string | number, idx: number) => ({
    label: x,
    value: idx < YY.length ? YY[idx] : 0,
  }));
  const getXVal = (d: any) => d.label;
  const getYVal = (d: any) => d.value;

  // bounds
  const xMax = width;
  const yMax = height;

  // scales, memoize for performance
  const xScale = useMemo(
    () =>
      scaleBand<string>({
        range: [0, xMax],
        round: true,
        domain: lineData.map(getXVal),
        padding: 0.4,
      }),
    [xMax, lineData]
  );
  const yScale = useMemo(
    () =>
      scaleLinear<number>({
        range: [yMax, 0],
        round: true,
        domain: [0, Math.max(...lineData.map(getYVal))],
      }),
    [yMax, lineData]
  );

  const interactClass = setInteractions(id, {
    drag: {
      xField: "left",
      yField: "top",
    },
  });

  return (
    <Group className={interactClass} top={top} left={left}>
      <LinePath
        className={interactClass}
        curve={allCurves[curve as CurveType]}
        data={lineData}
        x={(d) => xScale(getXVal(d)) ?? 0}
        y={(d) => yScale(getYVal(d)) ?? 0}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeOpacity={strokeOpacity}
        shapeRendering="geometricPrecision"
      />
    </Group>
  );
}

export default RenderCurve;
