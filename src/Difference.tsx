import React, { useMemo } from "react";
import { Group } from "@visx/group";
import { LinePath } from "@visx/shape";
import { curveBasis } from "@visx/curve";
import { Threshold } from "@visx/threshold";

import { useChartOps } from "./ChartOperations";
import {
  boundaries,
  scale as canopyScale,
  getTableColumn,
  getTableColumns,
} from "./util";

function Difference(props: any) {
  const { id, config, group } = props;
  const {
    clipAboveTo,
    clipBelowTo,
    curve,
    belowArea,
    aboveArea,
    padding,
    width,
    height,
    X,
    Y,
    defaultX,
    defaultY,
  } = config;
  const { getChartTable } = useChartOps();

  const chartTable = getChartTable();

  const xType = X
    ? chartTable?.head?.find((col) => col.name === X)?.type
    : null;
  const XX = X ? getTableColumn(chartTable, X) : defaultX;
  const [YY0, YY1] =
    Y && Y.length === 2 ? getTableColumns(chartTable, Y) : defaultY;
  const lineData = XX.body.map((x: string | number, idx: number) => ({
    label: x,
    y0Value: YY0 && idx < YY0.body.length ? YY0.body[idx] : 0,
    y1Value: YY1 && idx < YY1.body.length ? YY1.body[idx] : 0,
  }));
  const getXVal = (d: any) =>
    xType === "Date" ? new Date(d.label).valueOf() : d.label;
  const getY0Val = (d: any) => d.y0Value;
  const getY1Val = (d: any) => d.y1Value;

  const { minX, maxX, minY, maxY } = boundaries(width, height, group);

  const xScale = useMemo(
    () => canopyScale([XX], [minX, maxX]),
    [XX, minX, maxX]
  );
  const yScale = useMemo(
    () => canopyScale([YY0, YY1], [maxY, minY]),
    [YY0, YY1, minY, maxY]
  );

  return (
    <Group>
      <Threshold
        id={`${Math.random()}`}
        data={lineData}
        x={(d) => xScale(getXVal(d)) ?? 0}
        y0={(d) => yScale(getY0Val(d)) ?? 0}
        y1={(d) => yScale(getY1Val(d)) ?? 0}
        clipAboveTo={0}
        clipBelowTo={maxY}
        curve={curveBasis}
        belowAreaProps={{
          fill: belowArea.fill,
          fillOpacity: belowArea.opacity,
        }}
        aboveAreaProps={{
          fill: aboveArea.fill,
          fillOpacity: aboveArea.opacity,
        }}
      />
      <LinePath
        data={lineData}
        curve={curveBasis}
        x={(d) => xScale(getXVal(d)) ?? 0}
        y={(d) => yScale(getY0Val(d)) ?? 0}
        stroke="#222"
        strokeWidth={1.5}
        strokeOpacity={0.8}
        strokeDasharray="1,2"
      />
      <LinePath
        data={lineData}
        curve={curveBasis}
        x={(d) => xScale(getXVal(d)) ?? 0}
        y={(d) => yScale(getY1Val(d)) ?? 0}
        stroke="#222"
        strokeWidth={1.5}
      />
    </Group>
  );
}

export default Difference;
