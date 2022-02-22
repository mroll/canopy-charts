import React, { useCallback, useEffect, useState } from "react";

import CanopyBaseChart from "./CanopyBaseChart";
import { Chart, ChartTable } from "./types";
import { dataService } from "./DataService";

function CanopyChart(props: any) {
  const { id, table } = props;
  const [chart, setChart] = useState<Chart | null>(null);
  const [dataTable, setDataTable] = useState<ChartTable>({
    head: [],
    body: [],
  });

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

  useEffect(() => {
    const localGetTable = async () => {
      const table = await dataService.dataTable(id);
      setDataTable(table);
    };

    localGetTable();
  }, [id]);

  return (
    chart && (
      <CanopyBaseChart
        chart={chart}
        setChart={setChart}
        dataTable={dataTable}
        setDataTable={setDataTable}
        renderForEditor={false}
        showTitle={true}
      />
    )
  );
}

export default CanopyChart;
