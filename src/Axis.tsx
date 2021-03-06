import React, { useMemo } from "react";
import { Axis as VXAxis } from "@visx/axis";

import { useChartOps } from "./ChartOperations";
import {
  boundaries,
  scale as canopyScale,
  getTableColumnsFromSelectors,
} from "./util";

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
  } = config;
  const {
    setInteractions,
    dataTable,
    getChartTable,
    getXColumnSelectors,
    getYColumnSelectors,
  } = useChartOps();
  const chartTable = dataTable || getChartTable();
  const isHorizontal = ["bottom", "top"].includes(orientation);
  const domain = isHorizontal ? getXColumnSelectors() : getYColumnSelectors();

  const columns = domain
    ? getTableColumnsFromSelectors(chartTable, domain)
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

  const tickTransformX = isHorizontal ? tickTransform.x : tickTransform.x - 6;
  const tickTransformY = isHorizontal ? tickTransform.y : tickTransform.y + 4;

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
        textAnchor: label.anchor,
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
        const transform = `translate(${tickTransformX}, ${tickTransformY})`;

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
