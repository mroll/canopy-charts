import { TableColumn } from "./types";

class DataService {
  constructor() {}

  async remoteTable(chartId: string, remoteColumns: TableColumn[]) {
    return await fetch(
      `http://${process.env.REACT_APP_API_HOSTNAME}/remote-table?chart=${chartId}`,
      {
        method: "post",
        headers: {
          "content-type": "application/json",
          authorization: "",
        },
        body: JSON.stringify({ columnSelectors: remoteColumns }),
      }
    ).then((res) => res.json());
  }
}

const dataService = new DataService();

export { dataService };
