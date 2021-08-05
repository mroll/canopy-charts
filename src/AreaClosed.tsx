import React, { useMemo } from "react";
import * as allCurves from "@visx/curve";
import { scaleTime, scaleBand, scaleLinear } from "@visx/scale";
import { Group } from "@visx/group";
import { AreaClosed } from "@visx/shape";
import { LinearGradient } from "@visx/gradient";
import { extent } from "d3-array";

import { useChartOps } from "./ChartOperations";
import { getTableColumn, useLinearScale } from "./util";

const areaClosedCurves = {
  curveBasis: allCurves.curveBasis,
  curveBasisClosed: allCurves.curveBasisClosed,
  curveBasisOpen: allCurves.curveBasisOpen,
  curveMonotoneX: allCurves.curveMonotoneX,
  curveMonotoneY: allCurves.curveMonotoneY,
  curveStep: allCurves.curveStep,
  curveStepBefore: allCurves.curveStepBefore,
  curveStepAfter: allCurves.curveStepAfter,
  curveLinearClosed: allCurves.curveLinearClosed,
  curveNatural: allCurves.curveNatural,
};
type CurveType =
  | "curveBasis"
  | "curveBasisClosed"
  | "curveBasisOpen"
  | "curveMonotoneX"
  | "curveMonotoneY"
  | "curveStep"
  | "curveStepBefore"
  | "curveStepAfter"
  | "curveLinearClosed"
  | "curveNatural";

function RenderAreaClosed(props: any) {
  const { id, config, group } = props;
  const {
    curve,
    width,
    height,
    stroke,
    fill,
    padding,
    X,
    Y,
    defaultX,
    defaultY,
    strokeWidth,
    strokeOpacity,
    useGradient,
    gradientFrom,
    gradientTo,
    gradientVertical,
    // gradientX1,
    // gradientX2,
    // gradientY1,
    // gradientY2,
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
  const getDate = (d: any) => new Date(getXVal(d));

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

  const dateScale = useMemo(
    () =>
      scaleTime({
        range: [minX, maxX],
        domain: extent(lineData, getDate) as [Date, Date],
      }),
    [minX, maxX, XX]
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

  const gradientId = `component-${id}-gradient`;
  return (
    <Group className={interactClass} top={0} left={0}>
      {useGradient && (
        <LinearGradient
          id={gradientId}
          from={gradientFrom.color}
          fromOffset={`${gradientFrom.offset}%`}
          fromOpacity={gradientFrom.opacity}
          to={gradientTo.color}
          toOffset={`${gradientTo.offset}%`}
          toOpacity={gradientTo.opacity}
          vertical={gradientVertical}
          /* x1={gradientX1} */
          /* x2={gradientX2} */
          /* y1={gradientY1} */
          /* y2={gradientY2} */
        />
      )}
      <AreaClosed
        curve={areaClosedCurves[curve as CurveType]}
        data={lineData}
        x={(d) => dateScale(getDate(d)) ?? 0}
        y={(d) => yScale(getYVal(d)) ?? 0}
        yScale={yScale}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeOpacity={strokeOpacity}
        fill={useGradient ? `url(#${gradientId})` : fill}
        opacity={1}
      />
    </Group>
  );
}

export default RenderAreaClosed;
