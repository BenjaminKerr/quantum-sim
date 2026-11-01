import CircuitDiagram from "./CircuitDiagram.jsx";
import CodeMirror from "@uiw/react-codemirror";
import { qasmLanguage } from "../lib/qasmLanguage.js";
import "./CircuitTestPanel.css";

// The panel no longer owns any state: App passes in the text, the results,
// and the functions to call.
function CircuitTestPanel({ qasmText, onTextChange, onRun, result, circuit, error }) {
  function handleTextChange(e) {
    onTextChange(e.target.value);
  }

  return (
    <div className="workspace">
      <section className="panel qasm">
        <h2>OpenQASM</h2>
        <CodeMirror
          className="qasm-input"
          value={qasmText}
          onChange={(value) => onTextChange(value)}
          extensions={[qasmLanguage]}
          height="200px"
          basicSetup={{ lineNumbers: true }}
        />
        <div>
          <button onClick={onRun}>Run</button>
        </div>
      </section>

      <section className="panel toolbox">
        <h2>Toolbox</h2>
        <p>Coming soon...</p>
      </section>

      <section className="panel results">
        <h2>Results</h2>
        {error && <p>Error: {error}</p>}
        {!error && result && <pre>{result.toString()}</pre>}
        {!error && !result && (
          <p className="results-placeholder">Run the circuit to see results.</p>
        )}
      </section>

      <section className="panel diagram">
        <h2>Circuit Diagram</h2>
        {circuit && <CircuitDiagram circuit={circuit} />}
      </section>
    </div>
  );
}

export default CircuitTestPanel;