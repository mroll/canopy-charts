import React from "react";

import RenderCurve from "./Curve";
import RenderAxis from "./Axis";
import RenderRect from "./Rect";
import RenderGradient from "./Gradient";
import RenderBar from "./Bar";
import RenderBarGroup from "./BarGroup";
import RenderBars from "./Bars";
import RenderGroup from "./Group";

import {
  ChartComponentProps,
  Component2RenderMap,
  ComponentType,
} from "./types";

const Component2Render: Component2RenderMap = {
  [ComponentType.Gradient]: RenderGradient,
  [ComponentType.Bar]: RenderBar,
  [ComponentType.Bars]: RenderBars,
  [ComponentType.BarGroup]: RenderBarGroup,
  [ComponentType.Curve]: RenderCurve,
  [ComponentType.Axis]: RenderAxis,
  [ComponentType.Rect]: RenderRect,
  [ComponentType.Group]: RenderGroup,
};

function ChartComponentDisplay(props: ChartComponentProps) {
  const { id, type, config, members, group, componentsById, table } = props;
  const Component = Component2Render[type];

  return (
    <Component
      id={id}
      config={config}
      group={group}
      members={members}
      table={table}
      componentsById={componentsById}
    />
  );
}

ChartComponentDisplay.defaultProps = {
  dataId: undefined,
  members: undefined,
  group: undefined,
};

export default ChartComponentDisplay;
