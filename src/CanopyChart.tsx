import React, { useCallback, useEffect, useState } from "react";

import CanopyBaseChart from "./CanopyBaseChart";
import { Chart } from "./types";

function CanopyChart(props: any) {
  const { id, table } = props;
  const [chart, setChart] = useState<Chart | null>(null);

  const getChart = useCallback(async () => {
    const _chart = await fetch(
      `${process.env.REACT_APP_API_URL}/chart?id=${id}`
    ).then((res) => res.json());

    const _table = table || _chart.table;

    setChart({
      ..._chart,
      table: _table,
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
