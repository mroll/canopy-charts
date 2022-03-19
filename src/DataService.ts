import { TableColumn } from "./types";

class DataService {
  token: string | undefined;

  constructor() {}

  setToken(token: string) {
    this.token = token;
  }

  async remoteTable(chartId: string, remoteColumns: TableColumn[]) {
    return await fetch(
      `http://${process.env.REACT_APP_API_HOSTNAME}/remote-table?chart=${chartId}`,
      {
        method: "post",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify({ columnSelectors: remoteColumns }),
      }
    ).then((res) => res.json());
  }

  async dataTable(chartId: string, apiKey?: string) {
    const apiKeyParam = apiKey ? `&apiKey=${apiKey}` : "";
    return await fetch(
      `http://${process.env.REACT_APP_API_HOSTNAME}/data-table?id=${chartId}${apiKeyParam}`,
      {
        method: "get",
        headers: {
          authorization: `Bearer ${this.token}`,
        },
      }
    ).then((res) => res.json());
  }
}

const dataService = new DataService();

const initCanopy = (authToken: string) => {
  dataService.setToken(authToken);
};

export { dataService, initCanopy };
