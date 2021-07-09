import React from "react";
import { Group as VXGroup } from "@visx/group";

import ChartComponent from "./ChartComponent";
import { useChartOps } from "./ChartOperations";

function Group(props: any) {
  const { id, config, componentsById } = props;
  const { left, top, members } = config;
  const { setInteractions } = useChartOps();

  const group = {
    left,
    top,
  };

  const interactClass = setInteractions(id, {
    drag: {
      xField: "left",
      yField: "top",
    },
  });

  return (
    <VXGroup className={interactClass} top={top} left={left}>
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
