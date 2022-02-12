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
          authorization:
            "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6ImYyNGYzMTQ4MTk3ZWNlYTUyOTE3YzNmMTgzOGFiNWQ0ODg3ZWEwNzYiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiTWF0dCBSb2xsIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hLS9BT2gxNEdqd3ZYdEhfaW5fU2dnRjh5SzA4SloycEZMMXRBVkdDd3J2dGFnZzF3PXM5Ni1jIiwiaXNzIjoiaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tL2Nhbm9weS1jaGFydHMiLCJhdWQiOiJjYW5vcHktY2hhcnRzIiwiYXV0aF90aW1lIjoxNjQzNDkwMjQxLCJ1c2VyX2lkIjoiSFZzMlFQeGgyWVp1U2c0aFNRRVB0eHczOURYMiIsInN1YiI6IkhWczJRUHhoMlladVNnNGhTUUVQdHh3MzlEWDIiLCJpYXQiOjE2NDQ2Mjg5NzYsImV4cCI6MTY0NDYzMjU3NiwiZW1haWwiOiJtcHJvbGxAcG0ubWUiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJnb29nbGUuY29tIjpbIjExMTk5OTM1NTYwNDEyMzUzOTM4MyJdLCJlbWFpbCI6WyJtcHJvbGxAcG0ubWUiXX0sInNpZ25faW5fcHJvdmlkZXIiOiJnb29nbGUuY29tIn19.RGeJipmEzltsRb_Sy_TIHbp-S32PXSg7i59GL-0SC9bjXD5c1tArzYZN0-WUG36XZDxhAhA8X9fYZyGLV4jcAxxwm88y366AFxyCK9b0vwtbwPw28YLKMwsB9N_LYcn98eagiRqyOmVnguJKlN0YvW4oP6H4l9LVoDVKh3fEbEKO09WkOMchH1gCW0RrJTV2-ys7cBK0eaFtnvV05lgH7W08jsedJoSOMU-YiZ382ZWRXbOBHIC5EWx32ZN-0BXBtongqiaxRuQ3UhLUQzjUufaRePjUv43FlQbhStOHxztn-4yYRmsd1Cb3kZSM8mgo2RwriP_ignTPsXrGEKoQ0g",
        },
        body: JSON.stringify({ columnSelectors: remoteColumns }),
      }
    ).then((res) => res.json());
  }
}

const dataService = new DataService();

export { dataService };
