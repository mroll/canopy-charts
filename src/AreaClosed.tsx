import React, { useMemo } from "react";
import * as allCurves from "@visx/curve";
import { Group } from "@visx/group";
import { AreaClosed } from "@visx/shape";
import { LinearGradient } from "@visx/gradient";

import { useChartOps } from "./ChartOperations";
import {
  isBandScale,
  boundaries,
  scale as canopyScale,
  getTableColumn,
} from "./util";

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
    fillOpacity,
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
  const { setInteractions, dataTable } = useChartOps();

  const chartTable = dataTable;

  const XX = X ? getTableColumn(chartTable, X) : defaultX;
  const YY = Y ? getTableColumn(chartTable, Y) : defaultY;
  const lineData = XX.body.map((x: string | number, idx: number) => ({
    label: x,
    value: idx < YY.body.length ? YY.body[idx] : 0,
  }));
  const getXVal = (d: any) => {
    switch (XX.head.type) {
      case "Date":
        return new Date(d.label);
      case "Number":
        return parseInt(d.label, 10);
      default:
        return d.label;
    }
  };
  const getYVal = (d: any) => d.value;

  const { minX, maxX, minY, maxY } = boundaries(width, height, group);

  const xScale = useMemo(
    () => canopyScale([XX], [minX, maxX], padding),
    [XX, minX, maxX, padding]
  );

  const yScale = useMemo(
    () => canopyScale([YY], [maxY, minY]),
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
        x={(d) =>
          (xScale(getXVal(d)) ?? 0) +
          (isBandScale(xScale) ? xScale.bandwidth() / 2 : 0)
        }
        y={(d) => yScale(getYVal(d)) ?? 0}
        yScale={yScale}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeOpacity={strokeOpacity}
        fill={useGradient ? `url(#${gradientId})` : fill}
        fillOpacity={fillOpacity}
        opacity={1}
      />
    </Group>
  );
}

export default RenderAreaClosed;
