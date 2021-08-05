import React, { useMemo } from "react";
import { scaleBand, scaleLinear, scaleTime } from "@visx/scale";
import { Axis as VXAxis } from "@visx/axis";
import { extent } from "d3-array";

import { useChartOps } from "./ChartOperations";
import { getTableColumns } from "./util";
import { TableColumn, TableData } from "./types";

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
    numTicks,
    tickLength,
    tickStroke,
    tickLabelColor,
    tickLabelFontSize,
    hideTicks,
    hideAxisLine,
    domain,
  } = config;
  const { setInteractions, getChartTable } = useChartOps();

  const chartTable = getChartTable();

  const dType = domain
    ? chartTable?.head?.find((col) => col.name === domain)?.type
    : null;
  const DD = (
    domain ? getTableColumns(chartTable, domain) : [["a", "b", "c"]]
  ).flatMap((col: TableColumn) => col.map((x: TableData) => x));

  const isHorizontal = ["bottom", "top"].includes(orientation);

  const { minX, maxX, minY, maxY } = {
    minX: group ? group.margin.l : 0,
    maxX: group ? group.width - group.margin.r : width,
    minY: group ? group.margin.t : 0,
    maxY: group ? group.height - group.margin.b : width,
  };

  const date = (d: TableData) => new Date(d).valueOf();

  const range: [number, number] = isHorizontal ? [minX, maxX] : [maxY, minY];
  const scale = useMemo(() => {
    if (dType === "Date") {
      return scaleTime<number>({
        domain: [Math.min(...DD.map(date)), Math.max(...DD.map(date))],
        range: [minX, maxX],
        nice: true,
      });
    }

    if (dType === "Number") {
      const dMax = extent(DD.map((d) => parseInt(d as string, 10)))[1];

      return scaleLinear<number>({
        range,
        domain: [0, dMax || 0],
        nice: true,
      });
    }

    return scaleBand<string>({
      range: range,
      domain: DD as string[],
      padding: padding,
    });
  }, [dType, width, DD, range, padding]);

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
      orientation={orientation}
      top={axisTop}
      left={axisLeft}
      scale={scale}
      numTicks={numTicks}
      tickLength={tickLength}
      tickStroke={tickStroke}
      hideTicks={hideTicks}
      stroke={stroke}
      strokeWidth={strokeWidth}
      hideAxisLine={hideAxisLine}
      tickLabelProps={() => ({
        fill: tickLabelColor,
        fontSize: tickLabelFontSize,
        textAnchor: "middle",
      })}
    />
  );
}

export default Axis;
