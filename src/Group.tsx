import React, { useMemo } from "react";
import { Group as VXGroup } from "@visx/group";
import { LinearGradient } from "@visx/gradient";

import ChartComponent from "./ChartComponent";
import { useChartOps } from "./ChartOperations";
import { ChartComponent as ChartComponentT } from "./types";

const groupDimensions = (
  configWidth: number,
  configHeight: number,
  textHeight: number,
  container: ChartComponentT | undefined
) => {
  const computedGroupWidth = container
    ? (container.config.width as number) -
      ((container.config.margin as { [key: string]: number }).l as number) -
      ((container.config.margin as { [key: string]: number }).r as number)
    : configWidth;
  const computedGroupHeight = container
    ? (container.config.height as number) -
      ((container.config.margin as { [key: string]: number }).t as number) -
      ((container.config.margin as { [key: string]: number }).b as number) -
      (textHeight ? textHeight : 0)
    : configHeight;

  return [computedGroupWidth, computedGroupHeight];
};

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
  const {
    computedChartHeight,
    getChartDimensions,
    getContainer,
    getTextHeight,
  } = useChartOps();

  const chartTextHeight = getTextHeight();

  const { width: chartWidth, height: chartHeight } = getChartDimensions();

  const _computedChartHeight = useMemo(() => {
    return computedChartHeight();
  }, [chartTextHeight, chartHeight]);

  const container = getContainer();
  const [groupWidth, groupHeight] = groupDimensions(
    width,
    height,
    chartTextHeight,
    container
  );

  const group = {
    left,
    top,
    width: renderForEditor ? groupWidth : chartWidth || width,
    height: renderForEditor ? groupHeight : _computedChartHeight,
    margin,
  };

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
