import React, { useCallback, useEffect, useState } from "react";

import CanopyBaseChart from "./CanopyBaseChart";
import { Chart } from "./types";

function CanopyChart(props: any) {
  const { id, table } = props;
  const [chart, setChart] = useState<Chart | null>(null);

  const getChart = useCallback(async () => {
    const _chart = await fetch(
      `https://api.canopycharts.com:3000/chart?id=${id}`
    ).then((res) => res.json());

    setChart({
      ..._chart,
      table,
    });
  }, [id, setChart]);

  useEffect(() => {
    getChart();
  }, [getChart]);

  return (
    chart && (
      <CanopyBaseChart
        chart={chart}
        setChart={setChart}
        renderForEditor={false}
        showTitle={true}
      />
    )
  );
}

export default CanopyChart;
