import React, { useMemo } from "react";
import { Pie } from "@visx/shape";
import { Group as VXGroup } from "@visx/group";
import { Group } from "@visx/group";
import { scaleBand } from "@visx/scale";

import { useChartOps } from "./ChartOperations";
import { boundaries, scale as canopyScale, getTableColumn } from "./util";

function RenderPie(props: any) {
  const { id, config, group } = props;
  const {
    width,
    height,
    thickness,
    x,
    y,
    radius,
    rx,
    padding,
    X,
    Y,
    defaultX,
    defaultY,
  } = config;
  const { getChartTable } = useChartOps();

  const chartTable = getChartTable();

  const XX = X ? getTableColumn(chartTable, X) : defaultX;
  const YY = Y ? getTableColumn(chartTable, Y) : defaultY;

  const lineData = XX.body.map((x: string | number, idx: number) => ({
    label: x,
    value: idx < YY.body.length ? YY.body[idx] : 0,
  }));
  const getXVal = (d: any) => d.label;
  const getYVal = (d: any) => d.value;

  // const { minX, maxX, minY, maxY } = boundaries(width, height, group);
  // const radius = Math.min(innerWidth, innerHeight) / 2;
  const centerY = (group ? group.height : height) / 2;
  const centerX = (group ? group.width : width) / 2;

  return (
    <Pie
      data={lineData}
      pieValue={getYVal}
      outerRadius={radius}
      innerRadius={radius - thickness}
      cornerRadius={rx}
      padAngle={padding}
      fill="lightblue"
      top={centerY + y}
      left={centerX + x}
    ></Pie>
  );
}

export default RenderPie;
