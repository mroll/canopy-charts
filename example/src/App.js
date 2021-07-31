import { CanopyChart } from "canopy-charts";

import "./App.css";

const table = [
  { A: "a", B: 4, C: 4, D: 3 },
  { A: "b", B: 6, C: 5, D: 5 },
  { A: "c", B: 5, C: 3, D: 4 },
  { A: "d", B: 3, C: 6, D: 7 },
  { A: "e", B: 6, C: 5, D: 5 },
  { A: "f", B: 4, C: 7, D: 8 },
  { A: "g", B: 7, C: 3, D: 3 },
  { A: "h", B: 8, C: 5, D: 6 },
  { A: "i", B: 5, C: 4, D: 1 },
  { A: "j", B: 6, C: 6, D: 3 },
  { A: "k", B: 3, C: 2, D: 9 },
];

function App() {
  const chart1 = "61054ad4d10462adc71f7ede";

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
          width: "60%",
          height: 450,
          margin: 10,
          padding: 5,
          borderRadius: 6,
        }}
      >
        <CanopyChart id={chart1} table={table} />
      </div>
    </div>
  );
}

export default App;
