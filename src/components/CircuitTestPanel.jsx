// File overhauled 9/18/2026 by Claude

import { useState } from "react";
import { useCircuit } from "../hooks/useCircuit";

const DEFAULT_QASM = `OPENQASM 2.0;
qreg q[2];
h q[0];
cx q[0],q[1];
`;

function CircuitTestPanel() {
  const [qasmText, setQasmText] = useState(DEFAULT_QASM);
  const { result, error, runSimulation } = useCircuit();

  return (
    <div>
      <textarea
        value={qasmText}
        onChange={e => setQasmText(e.target.value)}
        rows={10}
        cols={50}
      />
      <div>
        <button onClick={() => runSimulation(qasmText)}>Run</button>
      </div>

      { error && (
        <div>
          <p>Error: {error}</p>
        </div>
      )}

      { !error && result && (
        <div>
          <pre>{result.toString()}</pre>
        </div>
      )}
    </div>
  );
}

export default CircuitTestPanel;