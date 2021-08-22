import React, { useMemo } from "react";
import * as allCurves from "@visx/curve";
import { Group } from "@visx/group";
import { LinePath } from "@visx/shape";

import { useChartOps } from "./ChartOperations";
import {
  boundaries,
  getTableColumn,
  getTableColumns,
  isBandScale,
  scale as canopyScale,
} from "./util";

type CurveType = keyof typeof allCurves;

function RenderCurve(props: any) {
  const { id, config, group } = props;
  const {
    curve,
    width,
    height,
    top,
    left,
    stroke,
    padding,
    X,
    Y,
    defaultX,
    defaultY,
    strokeWidth,
    strokeOpacity,
  } = config;
  const { setInteractions, getChartTable, getXColumns, getYColumns } =
    useChartOps();

  const chartTable = getChartTable();

  const xType = X
    ? chartTable?.head?.find((col) => col.name === X)?.type
    : null;
  const XX = X ? getTableColumn(chartTable, X) : defaultX;
  const YY = Y ? getTableColumn(chartTable, Y) : defaultY;
  const lineData = XX.body.map((x: string | number, idx: number) => ({
    label: x,
    value: idx < YY.body.length ? YY.body[idx] : 0,
  }));
  const getXVal = (d: any) =>
    xType === "Date" ? new Date(d.label).valueOf() : d.label;
  const getYVal = (d: any) => d.value;

  const { minX, maxX, minY, maxY } = boundaries(width, height, group);

  const xColumns = getTableColumns(chartTable, getXColumns());
  const yColumns = getTableColumns(chartTable, getYColumns());

  const xScale = useMemo(
    () => canopyScale(xColumns, [minX, maxX], padding),
    [XX, minX, maxX, padding]
  );

  const yScale = useMemo(
    () => canopyScale(yColumns, [maxY, minY]),
    [YY, minY, maxY]
  );

  const interactClass = group
    ? ""
    : setInteractions(id, {
        drag: {
          xField: "left",
          yField: "top",
        },
      });

  return (
    <Group className={interactClass} top={top} left={left}>
      <LinePath
        curve={allCurves[curve as CurveType]}
        data={lineData}
        x={(d) =>
          (xScale(getXVal(d)) ?? 0) +
          (isBandScale(xScale) ? xScale.bandwidth() / 2 : 0)
        }
        y={(d) => yScale(getYVal(d)) ?? 0}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeOpacity={strokeOpacity}
      />
    </Group>
  );
}

export default RenderCurve;
