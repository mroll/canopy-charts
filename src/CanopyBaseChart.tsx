import React from "react";
import ChartComponent from "./ChartComponent";
import { ChartOperationsProvider } from "./ChartOperations";

function CanopyBaseChart(props: any) {
  const { chart, setChart } = props;

  return (
    <ChartOperationsProvider chart={chart} setChart={setChart}>
      <svg version="1.1" className="chart-svg">
        {chart.componentsArray.map((componentId: string) => (
          <ChartComponent
            key={componentId}
            table={chart.table}
            componentsById={chart.componentsById}
            {...chart.componentsById[componentId]}
          />
        ))}
      </svg>
    </ChartOperationsProvider>
  );
}

export default CanopyBaseChart;
