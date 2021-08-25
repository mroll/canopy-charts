import React from "react";
import { ParentSize } from "@visx/responsive";

import ChartComponent from "./ChartComponent";
import { ChartOperationsProvider } from "./ChartOperations";
import { Chart, ChartComponent as ChartComponentT } from "./types";
import { useChartOps } from "./ChartOperations";

interface ViewBox {
  width: number;
  height: number;
}

const noop = () => {};

const viewBox = (chart: Chart, width: number, height: number): ViewBox => {
  const primaryGroup = Object.values(chart.componentsById).find(
    (component: any) => component.type === "Group"
  ) as ChartComponentT;

  const bb = {
    minX: primaryGroup.config.left as number,
    minY: primaryGroup.config.top as number,
    maxX:
      (primaryGroup.config.left as number) +
      (primaryGroup.config.width as number),
    maxY:
      (primaryGroup.config.top as number) +
      (primaryGroup.config.height as number),
  };

  const { minX, minY, maxX, maxY } = bb;
  // return { width: maxX - minX, height: maxY - minY };

  return { width, height };
};

function BaseChartForEditor(props: any) {
  const { chart, children } = props;
  const { setSelectedComponent } = useChartOps();

  const onChartClick = (e: any) => {
    const groupId = Object.keys(chart.componentsById).find((componentId) => {
      return chart.componentsById[componentId].type === "Group";
    });

    if (groupId) {
      setSelectedComponent(groupId);
    }
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      style={{ width: "100%", height: "100%" }}
      onClick={onChartClick}
    >
      {children}
    </svg>
  );
}

function BaseChartForRemoteApp(props: any) {
  const { children, chart, width, height } = props;

  const vb = viewBox(chart, width, height);

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${vb.width} ${vb.height}`}>
      {children}
    </svg>
  );
}

function CanopyBaseChart(props: any) {
  const { chart, setChart, renderForEditor, width, height } = props;

  const BaseChartComponent = renderForEditor
    ? BaseChartForEditor
    : BaseChartForRemoteApp;

  return (
    <ParentSize>
      {(parent) => (
        <ChartOperationsProvider
          chart={chart}
          setChart={setChart || noop}
          renderForEditor={renderForEditor}
          width={width || parent.width}
          height={height || parent.height}
        >
          <BaseChartComponent
            chart={chart}
            width={width || parent.width}
            height={height || parent.height}
          >
            {chart.componentsArray.map((componentId: string) => (
              <ChartComponent
                key={componentId}
                table={chart.table}
                componentsById={chart.componentsById}
                renderForEditor={renderForEditor}
                {...chart.componentsById[componentId]}
              />
            ))}
          </BaseChartComponent>
        </ChartOperationsProvider>
      )}
    </ParentSize>
  );
}

export default CanopyBaseChart;
