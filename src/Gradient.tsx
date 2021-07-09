import React from "react";
import * as allGradients from "@visx/gradient";

import { useChartOps } from "./ChartOperations";

type GradientType = keyof typeof allGradients;

function RenderGradient(props: any) {
  const { id, config, group } = props;
  const { x, y, width, height, fill, rx, gradient } = config;
  const { setInteractions } = useChartOps();

  const interactClass = setInteractions(id, {
    drag: {
      xField: "x",
      yField: "y",
    },
  });

  const Gradient = allGradients[gradient as GradientType];

  return (
    <>
      <Gradient id={id} />
      <rect
        className={interactClass}
        x={x}
        y={y}
        width={group ? group.width : width}
        height={group ? group.height : height}
        fill={fill}
        rx={rx}
      />
    </>
  );
}

export default RenderGradient;
