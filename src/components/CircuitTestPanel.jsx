import CircuitDiagram from "./CircuitDiagram.jsx";
import CodeMirror from "@uiw/react-codemirror";
import { useEffect, useRef } from "react";
import { lintGutter } from "@codemirror/lint";
import { qasmLanguage } from "../lib/qasmLanguage.js";
import { applyParseError } from "../lib/qasmLint.js";
import "./CircuitTestPanel.css";

const extensions = [qasmLanguage, lintGutter()]; // static, so defined outside the component

function CircuitTestPanel({ qasmText, onTextChange, onRun, result, circuit, error, parseError }) {
  const viewRef = useRef(null);

  useEffect(() => {
    applyParseError(viewRef.current, parseError);
  }, [parseError, qasmText]);

  return (
    <div className="workspace">
      <section className="panel qasm">
        <h2>OpenQASM</h2>
        <CodeMirror
          className="qasm-input"
          value={qasmText}
          onChange={(value) => onTextChange(value)}
          extensions={extensions}
          onCreateEditor={(view) => { viewRef.current = view; }}
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