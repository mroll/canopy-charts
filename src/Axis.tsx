import React, { useMemo } from "react";
import { Axis as VXAxis } from "@visx/axis";

import { useChartOps } from "./ChartOperations";
import { boundaries, scale as canopyScale, getTableColumns } from "./util";

function Axis(props: any) {
  const { id, config, group } = props;
  const {
    label,
    orientation,
    width,
    left,
    top,
    padding,
    stroke,
    strokeWidth,
    showTicks,
    ticks,
    tickTransform,
    showAxis,
    domain,
  } = config;
  const { setInteractions, getChartTable } = useChartOps();

  const chartTable = getChartTable();

  const isHorizontal = ["bottom", "top"].includes(orientation);
  const columns = domain
    ? getTableColumns(chartTable, domain)
    : [
        {
          head: { name: "A", type: "Text" },
          body: ["a", "b", "c"],
        },
      ];
  const { minX, maxX, minY, maxY } = boundaries(width, width, group);
  const range: [number, number] = isHorizontal ? [minX, maxX] : [maxY, minY];

  const axisScale = useMemo(
    () => canopyScale(columns, range, padding),
    [columns, range, padding]
  );

  const interactClass = setInteractions(id, {
    drag: {
      xField: "left",
      yField: "top",
    },
  });

  const axisTop = isHorizontal
    ? group
      ? group.height - group.margin.b + top
      : top
    : group
    ? 0
    : 0;
  const axisLeft = isHorizontal
    ? group
      ? 0
      : left
    : group
    ? group.margin.l + left
    : 0;

  return (
    <VXAxis
      axisClassName={interactClass}
      label={label.label}
      labelOffset={label.offset}
      labelProps={{
        fontSize: label.fontSize,
        stroke: label.stroke,
        strokeWidth: label.strokeWidth,
        fontFamily: label.fontFamily,
      }}
      orientation={orientation}
      top={axisTop}
      left={axisLeft}
      scale={axisScale}
      numTicks={ticks.number}
      tickLength={ticks.length}
      tickStroke={ticks.stroke}
      hideTicks={!showTicks}
      stroke={stroke}
      strokeWidth={strokeWidth}
      hideAxisLine={!showAxis}
      tickLabelProps={() => {
        const transform = `translate(${tickTransform.x}, ${tickTransform.y})`;

        return {
          fill: ticks.labelColor,
          fontSize: ticks.fontSize,
          textAnchor: ticks.anchor,
          transform,
        };
      }}
    />
  );
}

export default Axis;
