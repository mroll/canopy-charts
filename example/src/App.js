import { CanopyChart } from "canopy-charts";

import "./App.css";

const table = [
  { A: "a", B: 1, C: 2 },
  { A: "b", B: 4, C: 2 },
  { A: "c", B: 3, C: 2 },
  { A: "d", B: 4, C: 2 },
  { A: "e", B: 5, C: 2 },
  { A: "f", B: 6, C: 2 },
  { A: "g", B: 7, C: 2 },
];

function App() {
  return (
    <div
      className="App"
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
      }}
    >
      <div style={{ width: "60%" }}>
        <CanopyChart id={"60e9a89630101c1657529951"} table={table} />
      </div>

      <div style={{ width: "50%" }}>
        <CanopyChart id={"60e9a89630101c1657529951"} table={table} />
      </div>
    </div>
  );
}

export default App;
