import React from "react";
import { Group as VXGroup } from "@visx/group";

import ChartComponent from "./ChartComponent";
import { useChartOps } from "./ChartOperations";

function Group(props: any) {
  const { id, config, members, componentsById } = props;
  const { left, top, width, height, margin, fill, opacity } = config;
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

  const classIfSelected =
    selectedComponentId === id ? "stroke-current text-blue-300 stroke-2" : "";

  return (
    <VXGroup
      className={interactClass}
      style={{ pointerEvents: "all" }}
      top={top}
      left={left}
    >
      <rect
        width={width}
        height={height}
        fill={fill}
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
