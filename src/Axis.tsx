import React, { useMemo } from "react";
import { scaleBand, scaleLinear } from "@visx/scale";
import { Axis as VXAxis, Orientation } from "@visx/axis";

import { useChartOps } from "./ChartOperations";

function Axis(props: any) {
  const { id, config } = props;
  const {
    label,
    orientation,
    width,
    height,
    left,
    top,
    stroke,
    strokeWidth,
    numTicks,
    dataId,
    chartData,
  } = config;
  const { setInteractions } = useChartOps();

  const axisData = useMemo(
    () => (dataId === undefined ? [] : chartData[dataId].value),
    [chartData, dataId]
  );
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
        domain: axisData.map(getXVal),
        padding: 0.4,
      }),
    [xMax, axisData]
  );
  const yScale = useMemo(
    () =>
      scaleLinear<number>({
        range: [yMax, 0],
        round: true,
        domain: [0, Math.max(...axisData.map(getYVal))],
      }),
    [yMax, axisData]
  );
  const scale =
    orientation === Orientation.top || orientation === Orientation.bottom
      ? xScale
      : yScale;

  const interactClass = setInteractions(id, {
    drag: {
      xField: "left",
      yField: "top",
    },
  });

  return (
    <VXAxis
      axisClassName={interactClass}
      label={label}
      orientation={orientation}
      top={top}
      left={left}
      scale={scale}
      numTicks={numTicks}
      stroke={stroke}
      strokeWidth={strokeWidth}
    />
  );
}

export default Axis;
