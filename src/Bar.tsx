import React from "react";
import { Bar } from "@visx/shape";

import { useChartOps } from "./ChartOperations";

function RenderBar(props: any) {
  const { id, config } = props;
  const { x, y, width, height, fill } = config;
  const { setInteractions } = useChartOps();

  const interactClass = setInteractions(id, {
    drag: {
      xField: "x",
      yField: "y",
    },
  });

  return (
    <Bar
      className={interactClass}
      x={x}
      y={y}
      width={width}
      height={height}
      fill={fill}
    />
  );
}

export default RenderBar;
