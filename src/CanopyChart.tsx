import React, { useCallback, useEffect, useState } from "react";

import { ChartOperationsProvider } from "./ChartOperations";
import CanopyBaseChart from "./CanopyBaseChart";
import { Chart } from "./types";

function CanopyChart(props: any) {
  const { id } = props;
  const [chart, setChart] = useState<Chart>({
    id: "-1",
    name: "",
    userId: "-1",
    componentsById: {},
    componentsArray: [],
    table: [],
  });

  const getChart = useCallback(async () => {
    const chart = await fetch(`http://localhost:3001/chart?id=${id}`).then(
      (res) => res.json()
    );
    console.log("chart", chart);

    setChart(chart);
  }, [id]);

  useEffect(() => {
    getChart();
  });

  return (
    <ChartOperationsProvider chart={chart} setChart={setChart}>
      <CanopyBaseChart
        componentsById={chart.componentsById}
        componentsArray={chart.componentsArray}
        table={chart.table}
      />
    </ChartOperationsProvider>
  );
}

export default CanopyChart;
