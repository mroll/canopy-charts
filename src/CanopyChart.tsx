import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";

import CanopyBaseChart from "./CanopyBaseChart";
import { Chart, ChartTable } from "./types";
import { dataService } from "./DataService";

function CanopyChart(props: any) {
  const { id, table, apiKey } = props;
  const [chart, setChart] = useState<Chart | null>(null);
  const [dataTable, setDataTable] = useState<ChartTable>({
    head: [],
    body: [],
  });

  const getChart = useCallback(async () => {
    const _chart = (
      await axios.get(`${process.env.REACT_APP_API_URL}/chart?id=${id}`)
    ).data;

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
      const table = await dataService.dataTable(id, apiKey);
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
