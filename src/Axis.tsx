import React, { useMemo } from "react";
import { scaleBand, scaleLinear } from "@visx/scale";
import { Axis as VXAxis } from "@visx/axis";
import { extent } from "d3-array";

import { useChartOps } from "./ChartOperations";
import { getTableColumns, useLinearScale } from "./util";

function Axis(props: any) {
  const { id, config } = props;
  const {
    label,
    orientation,
    width,
    left,
    top,
    padding,
    stroke,
    strokeWidth,
    numTicks,
    tickLength,
    tickStroke,
    hideTicks,
    hideAxisLine,
    domain,
  } = config;
  const { setInteractions, getChartTable } = useChartOps();

  const chartTable = getChartTable();

  const DD = (
    domain ? getTableColumns(chartTable, domain) : [["a", "b", "c"]]
  ).flatMap((col: string[]) => col.map((x: string) => x));

  const scale = useMemo(() => {
    if (useLinearScale(DD)) {
      const [dMin, dMax] = extent(DD.map((d) => parseInt(d, 10)));

      return scaleLinear<number>({
        range: [0, width],
        round: true,
        domain: [dMin || 0, dMax || 0],
      });
    }

    return scaleBand<string>({
      range: [0, width],
      domain: DD,
      padding: padding,
    });
  }, [width, DD]);

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
      tickLength={tickLength}
      tickStroke={tickStroke}
      hideTicks={hideTicks}
      stroke={stroke}
      strokeWidth={strokeWidth}
      hideAxisLine={hideAxisLine}
    />
  );
}

export default Axis;
