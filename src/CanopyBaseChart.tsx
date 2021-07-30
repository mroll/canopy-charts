import React from "react";
import ChartComponent from "./ChartComponent";
import { ChartOperationsProvider } from "./ChartOperations";
import { Chart, ChartComponent as ChartComponentT } from "./types";

interface ViewBox {
  width: number;
  height: number;
}

const viewBox = (chart: Chart): ViewBox => {
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
  return { width: maxX - minX, height: maxY - minY };
};

function BaseChartForEditor(props: any) {
  const { children } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      style={{ width: "100%", height: "100%" }}
    >
      {children}
    </svg>
  );
}

function BaseChartForRemoteApp(props: any) {
  const { children, chart } = props;

  const vb = viewBox(chart);

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${vb.width} ${vb.height}`}>
      {children}
    </svg>
  );
}

function CanopyBaseChart(props: any) {
  const { chart, setChart, renderForEditor } = props;

  const BaseChartComponent = renderForEditor
    ? BaseChartForEditor
    : BaseChartForRemoteApp;

  return (
    <ChartOperationsProvider
      chart={chart}
      setChart={setChart}
      renderForEditor={renderForEditor}
    >
      <BaseChartComponent chart={chart}>
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
  );
}

export default CanopyBaseChart;
