import { CanopyChart } from "canopy-charts";

import "./App.css";

const table = [
  { A: "a", B: 1, C: 4, D: 3 },
  { A: "b", B: 4, C: 5, D: 5 },
  { A: "c", B: 3, C: 3, D: 4 },
  { A: "d", B: 4, C: 6, D: 7 },
  { A: "e", B: 5, C: 5, D: 5 },
  { A: "f", B: 6, C: 7, D: 8 },
  { A: "g", B: 7, C: 8, D: 5 },
];

function App() {
  const chart1 = "60e9c93ad17ecf1abdbd97c8";
  const chart2 = "60e9cb52d17ecf1abdbd97c9";

  return (
    <div
      className="App"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
      }}
    >
      <div
        style={{
          width: "90%",
          height: "fit-content",
          boxShadow: "2px 2px 4px #bbb",
          margin: 10,
          padding: 5,
          borderRadius: 6,
        }}
      >
        <CanopyChart id={chart1} table={table} />
      </div>

      <div
        style={{
          width: "90%",
          height: "fit-content",
          boxShadow: "2px 2px 4px #bbb",
          margin: 10,
          padding: 5,
          borderRadius: 6,
        }}
      >
        <CanopyChart id={chart2} table={table} />
      </div>
    </div>
  );
}

export default App;
