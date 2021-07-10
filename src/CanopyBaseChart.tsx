import React from "react";
import ChartComponent from "./ChartComponent";
import { ChartOperationsProvider } from "./ChartOperations";
import { Chart, ChartComponent as ChartComponentT } from "./types";

interface BoundingBox {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

interface ViewBox {
  width: number;
  height: number;
}

const viewBox = (chart: Chart): ViewBox => {
  const bb = Object.values(chart.componentsById).reduce<BoundingBox>(
    (dims: BoundingBox, component: ChartComponentT) => {
      const x = typeof component.config.x === "number" ? "x" : "left";
      const y = typeof component.config.y === "number" ? "y" : "top";
      const width = component.config.width as number;
      const height = component.config.height as number;

      return {
        minX: Math.min(dims.minX, component.config[x] as number),
        maxX: Math.max(dims.maxX, (component.config[x] as number) + width),
        minY: Math.min(dims.minY, component.config[y] as number),
        maxY: Math.max(dims.maxY, (component.config[x] as number) + height),
      };
    },
    {
      minX: 99999,
      maxX: 0,
      minY: 99999,
      maxY: 0,
    }
  );

  const { maxX, maxY } = bb;
  return { width: maxX, height: maxY };
};

function BaseChartForEditor(props: any) {
  const { children } = props;

  return <svg style={{ width: "100%", height: "100%" }}>{children}</svg>;
}

function BaseChartForRemoteApp(props: any) {
  const { children, chart } = props;

  const vb = viewBox(chart);

  return (
    <svg
      width="100%"
      viewBox={`0 0 ${vb.width} ${vb.height}`}
      preserveAspectRatio="xMinYMin"
    >
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
    <ChartOperationsProvider chart={chart} setChart={setChart}>
      <BaseChartComponent chart={chart}>
        {chart.componentsArray.map((componentId: string) => (
          <ChartComponent
            key={componentId}
            table={chart.table}
            componentsById={chart.componentsById}
            {...chart.componentsById[componentId]}
          />
        ))}
      </BaseChartComponent>
    </ChartOperationsProvider>
  );
}

export default CanopyBaseChart;
