import React, { useMemo } from "react";
import { Axis as VXAxis } from "@visx/axis";

import { useChartOps } from "./ChartOperations";
import { boundaries, scale as canopyScale, getTableColumns } from "./util";

function Axis(props: any) {
  const { id, config, group } = props;
  const {
    label,
    labelOffset,
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
    tickLabelColor,
    tickLabelFontSize,
    tickTransform,
    hideTicks,
    hideAxisLine,
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
      label={label}
      labelOffset={labelOffset}
      orientation={orientation}
      top={axisTop}
      left={axisLeft}
      scale={axisScale}
      numTicks={numTicks}
      tickLength={tickLength}
      tickStroke={tickStroke}
      hideTicks={hideTicks}
      stroke={stroke}
      strokeWidth={strokeWidth}
      hideAxisLine={hideAxisLine}
      tickLabelProps={(value, index, values: any) => {
        const transform = `translate(${tickTransform.x}, ${tickTransform.y})`;

        return {
          fill: tickLabelColor,
          fontSize: tickLabelFontSize,
          textAnchor: "middle",
          transform,
        };
      }}
    />
  );
}

export default Axis;
