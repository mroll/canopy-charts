import React, { useMemo } from "react";
import * as allCurves from "@visx/curve";
import { Group } from "@visx/group";
import { scaleBand, scaleLinear } from "@visx/scale";
import { LinePath } from "@visx/shape";

import { useChartOps } from "./ChartOperations";
import { getTableColumn, useLinearScale } from "./util";

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
  const { setInteractions, getChartTable } = useChartOps();

  const chartTable = getChartTable();

  const XX = X ? getTableColumn(chartTable, X) : defaultX;
  const YY = Y ? getTableColumn(chartTable, Y) : defaultY;
  const lineData = XX.map((x: string | number, idx: number) => ({
    label: x,
    value: idx < YY.length ? YY[idx] : 0,
  }));
  const getXVal = (d: any) => d.label;
  const getYVal = (d: any) => d.value;

  const { minX, maxX, minY, maxY } = {
    minX: group ? group.margin.l : 0,
    maxX: group ? group.width - group.margin.r : width,
    minY: group ? group.margin.t : 0,
    maxY: group ? group.height - group.margin.b : height,
  };

  // scales, memoize for performance
  const xScale = useMemo(
    () =>
      scaleBand<string>({
        range: [minX, maxX],
        domain: XX,
        padding: padding,
      }),
    [XX, minX, maxX, XX, padding]
  );
  const yScale = useMemo(() => {
    if (useLinearScale(YY)) {
      const dMax = Math.max(...YY.map((d: string) => parseInt(d, 10)));

      return scaleLinear<number>({
        range: [maxY, minY],
        domain: [0, dMax],
      });
    }

    return scaleBand<string>({
      range: [maxY, minY],
      domain: YY,
      padding: 0.4,
    });
  }, [height, YY, minY, maxY]);

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
        x={(d) => (xScale(getXVal(d)) ?? 0) + xScale.bandwidth() / 2}
        y={(d) => yScale(getYVal(d)) ?? 0}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeOpacity={strokeOpacity}
      />
    </Group>
  );
}

export default RenderCurve;
