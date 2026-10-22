import { useState } from "react";
import { useCircuit } from "../hooks/useCircuit";
import CircuitDiagram from "./CircuitDiagram.jsx";
import "./CircuitTestPanel.css";

const DEFAULT_QASM = `OPENQASM 2.0;
qreg q[2];
h q[0];
cx q[0],q[1];
`;

function CircuitTestPanel() {
  const [qasmText, setQasmText] = useState(DEFAULT_QASM);
  const { result, circuit, error, runSimulation, updateCircuitFromText } = useCircuit(DEFAULT_QASM);

  // Runs on every keystroke in the textarea.
  function handleTextChange(e) {
    const newText = e.target.value;
    setQasmText(newText);
    updateCircuitFromText(newText);
  }

  return (
    <div className="workspace">
      <section className="panel">
        <h2>OpenQASM</h2>
        <textarea
          className="qasm-input"
          value={qasmText}
          onChange={handleTextChange}
          rows={16}
        />
        <div>
          <button onClick={() => runSimulation(qasmText)}>Run</button>
        </div>
      </section>

      <section className="panel">
        <h2>Circuit</h2>
        { circuit && <CircuitDiagram circuit={circuit} /> }
      </section>

      <section className="panel">
        <h2>Results</h2>
        { error && <p>Error: {error}</p> }
        { !error && result && <pre>{result.toString()}</pre> }
        { !error && !result && (
          <p className="results-placeholder">Run the circuit to see results.</p>
        )}
      </section>
    </div>
  );
}

export default CircuitTestPanel;