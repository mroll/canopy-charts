import React from "react";
import { Group as VXGroup } from "@visx/group";
import { LinearGradient } from "@visx/gradient";

import ChartComponent from "./ChartComponent";
import { useChartOps } from "./ChartOperations";

function Group(props: any) {
  const { id, config, members, componentsById, renderForEditor } = props;
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
    gradientX1,
    gradientX2,
    gradientY1,
    gradientY2,
  } = config;
  const { setInteractions, selectedComponentId, setSelectedComponent } =
    useChartOps();

  const group = {
    left,
    top,
    width,
    height,
    margin,
  };

  const interactClass = setInteractions(id, {
    drag: {
      xField: "left",
      yField: "top",
    },
  });

  const classIfSelected = renderForEditor
    ? selectedComponentId === id
      ? "stroke-current text-blue-300 stroke-2"
      : ""
    : "";

  const gradientId = `component-${id}-gradient`;
  return (
    <VXGroup
      className={interactClass}
      style={{ pointerEvents: "all" }}
      top={renderForEditor ? top : 0}
      left={renderForEditor ? left : 0}
    >
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
        width={width}
        height={height}
        fill={useGradient ? `url(#${gradientId})` : fill}
        fillOpacity={opacity}
        rx={4}
        className={`hover:stroke-current hover:text-blue-300 hover:stroke-2 ${classIfSelected}`}
        onClick={() => setSelectedComponent(id)}
      />
      {members &&
        members.map((memberId: string) => (
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
