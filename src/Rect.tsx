import React from "react";

import { useChartOps } from "./ChartOperations";

function RenderRect(props: any) {
  const { id, config } = props;
  const { width, height, x, y, rx, fill } = config;
  const { setInteractions } = useChartOps();

  const interactClass = setInteractions(id, {
    drag: {
      xField: "x",
      yField: "y",
    },
  });

  return (
    <rect
      className={interactClass}
      width={width}
      height={height}
      x={x}
      y={y}
      rx={rx}
      fill={fill}
    />
  );
}

export default RenderRect;
