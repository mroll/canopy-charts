import React, { useMemo } from "react";
import { Group } from "@visx/group";
import { LinePath } from "@visx/shape";
import { curveBasis } from "@visx/curve";
import { Threshold } from "@visx/threshold";
import { scaleBand, scaleTime, scaleLinear } from "@visx/scale";

import cityTemperature, {
  CityTemperature,
} from "@visx/mock-data/lib/mocks/cityTemperature";

import { useChartOps } from "./ChartOperations";
import { getTableColumn, getTableColumns, useLinearScale } from "./util";

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
  const [YY0, YY1] = Y ? getTableColumns(chartTable, Y) : defaultY;
  const lineData = XX.map((x: string | number, idx: number) => ({
    label: x,
    y0Value: YY0 && idx < YY0.length ? YY0[idx] : 0,
    y1Value: YY1 && idx < YY1.length ? YY1[idx] : 0,
  }));
  const getXVal = (d: any) =>
    xType === "Date" ? new Date(d.label).valueOf() : d.label;
  const getY0Val = (d: any) => d.y0Value;
  const getY1Val = (d: any) => d.y1Value;

  const { minX, maxX, minY, maxY } = {
    minX: group ? group.margin.l : 0,
    maxX: group ? group.width - group.margin.r : width,
    minY: group ? group.margin.t : 0,
    maxY: group ? group.height - group.margin.b : height,
  };

  // scales, memoize for performance
  const xScale = useMemo(() => {
    if (xType === "Date") {
      return scaleTime<number>({
        domain: [
          Math.min(...lineData.map(getXVal)),
          Math.max(...lineData.map(getXVal)),
        ],
        range: [minX, maxX],
      });
    }

    return scaleBand<string>({
      range: [minX, maxX],
      domain: XX,
      padding: padding,
    });
  }, [minX, maxX, XX, padding]);
  const yScale = useMemo(() => {
    const dMax = YY0
      ? Math.max(...YY0.concat(YY1).map((d: string) => parseInt(d, 10)))
      : 0;

    return scaleLinear<number>({
      range: [maxY, minY],
      domain: [0, dMax],
    });
  }, [YY0, YY1, minY, maxY]);

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
          fill: "violet",
          fillOpacity: 0.4,
        }}
        aboveAreaProps={{
          fill: "green",
          fillOpacity: 0.4,
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
