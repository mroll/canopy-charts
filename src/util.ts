import { ChartTable, TableColumn } from "./types";


export const getTableColumn = (
  t: ChartTable,
  columnName: string
): TableColumn => t.body
    .map(row => row[t.head.findIndex((col) => col.name === columnName)])
    .filter(cell => cell && cell !== '')

export const getTableColumns = (
  t: ChartTable,
  columnNames: string[]
): TableColumn[] =>
  columnNames.map((columnId: string) => getTableColumn(t, columnId));

export const useLinearScale = (DD: TableColumn) => {
  return DD.map((d) => parseInt(d as string, 10)).find(isNaN) === undefined;
};
