import CircuitDiagram from "./CircuitDiagram.jsx";
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
        <textarea
          className="qasm-input"
          value={qasmText}
          onChange={handleTextChange}
          rows={16}
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