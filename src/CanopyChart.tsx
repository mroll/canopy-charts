import React, { useCallback, useEffect, useState } from "react";

import { ChartOperationsProvider } from "./ChartOperations";
import CanopyBaseChart from "./CanopyBaseChart";
import { Chart } from "./types";

function CanopyChart(props: any) {
  const { id, table } = props;
  const [chart, setChart] = useState<Chart | null>(null);

  const getChart = useCallback(async () => {
    const _chart = await fetch(`http://localhost:3001/chart?id=${id}`).then(
      (res) => res.json()
    );

    setChart({
      ..._chart,
      table,
    });
  }, [id, setChart]);

  useEffect(() => {
    getChart();
  }, [getChart]);

  return chart && true && <CanopyBaseChart chart={chart} setChart={setChart} />;
}

export default CanopyChart;
