import React from "react";
import * as allGradients from "@visx/gradient";

import { useChartOps } from "./ChartOperations";

type GradientType = keyof typeof allGradients;

function RenderGradient(props: any) {
  const { id, config, group } = props;
  const { width, height, fill, rx, gradient } = config;
  const { setInteractions } = useChartOps();

  const { minX, minY } = {
    minX: group ? group.margin.l : 0,
    minY: group ? group.margin.t : 0,
  };

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
        x={minX}
        y={minY}
        width={group ? group.width - group.margin.l - group.margin.r : width}
        height={group ? group.height - group.margin.t - group.margin.b : height}
        fill={fill}
        rx={rx}
      />
    </>
  );
}

export default RenderGradient;
