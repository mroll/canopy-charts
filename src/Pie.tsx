import React from "react";
import { Pie } from "@visx/shape";

import { useChartOps } from "./ChartOperations";
import { getTableColumn } from "./util";

function RenderPie(props: any) {
  const { config, group } = props;
  const {
    width,
    height,
    thickness,
    fill,
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
      fill={fill}
      top={centerY + y}
      left={centerX + x}
    ></Pie>
  );
}

export default RenderPie;
