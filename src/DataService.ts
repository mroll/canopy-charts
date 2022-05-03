import axios from "axios";

import { TableColumn } from "./types";

class DataService {
  token: string | undefined;

  constructor() {}

  setToken(token: string) {
    this.token = token;
  }

  async remoteTable(chartId: string, remoteColumns: TableColumn[]) {
    return await axios.post(
      `${process.env.REACT_APP_API_URL}/remote-table?chart=${chartId}`,
      {
        method: "post",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${this.token}`,
        },
        data: JSON.stringify({ columnSelectors: remoteColumns }),
      }
    );
  }

  async dataTable(chartId: string, apiKey?: string) {
    const apiKeyParam = apiKey ? `&apiKey=${apiKey}` : "";
    return (
      await axios.get(
        `${process.env.REACT_APP_API_URL}/data-table?id=${chartId}${apiKeyParam}`,
        {
          method: "get",
          headers: {
            authorization: `Bearer ${this.token}`,
          },
        }
      )
    ).data;
  }
}

const dataService = new DataService();

const initCanopy = (authToken: string) => {
  dataService.setToken(authToken);
};

export { dataService, initCanopy };
