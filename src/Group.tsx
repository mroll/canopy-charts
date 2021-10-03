import React from "react";
import { Group as VXGroup } from "@visx/group";
import { LinearGradient } from "@visx/gradient";

import ChartComponent from "./ChartComponent";
import { useChartOps } from "./ChartOperations";

function Group(props: any) {
  const { id, config, children, componentsById, renderForEditor } = props;
  const {
    left,
    top,
    width,
    height,
    margin,
    fill,
    opacity,
    useGradient,
    gradientFrom,
    gradientTo,
    gradientVertical,
    // gradientX1,
    // gradientX2,
    // gradientY1,
    // gradientY2,
  } = config;
  const { selectedComponentId, setSelectedComponent, getChartDimensions } =
    useChartOps();

  const { width: chartWidth, height: chartHeight } = getChartDimensions();

  const group = {
    left,
    top,
    width: renderForEditor ? width : chartWidth || width,
    height: renderForEditor ? height : chartHeight || height,
    margin,
  };

  const classIfSelected = renderForEditor
    ? selectedComponentId === id
      ? "stroke-current text-blue-300 stroke-2"
      : ""
    : "";

  const gradientId = `component-${id}-gradient`;
  return (
    <VXGroup style={{ pointerEvents: "all" }}>
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
      <rect
        width={group.width}
        height={group.height}
        fill={useGradient ? `url(#${gradientId})` : fill}
        fillOpacity={opacity}
        rx={4}
      />
      {children &&
        children.map((memberId: string) => (
          <ChartComponent
            key={memberId}
            id={memberId}
            {...componentsById[memberId]}
            group={group}
          />
        ))}
    </VXGroup>
  );
}

export default Group;
