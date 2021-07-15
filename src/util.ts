export const getTableColumn = (t: any[], columnId: string): string[] =>
    t.map((r: any) => r[columnId]).filter(cell => cell !== "");

export const getTableColumns = (t: any[], columnIds: string[]): string[][] =>
  columnIds.map((columnId: string) => getTableColumn(t, columnId));

export const useLinearScale = (DD: string[]) => {
    return DD.map((d) => parseInt(d, 10)).find(isNaN) === undefined
};
