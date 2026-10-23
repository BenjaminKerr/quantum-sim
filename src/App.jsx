import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import CircuitTestPanel from "./components/CircuitTestPanel.jsx";
import { useCircuit } from "./hooks/useCircuit.js";
import { EXAMPLES } from "./lib/Examples.js";

// Start with the first example (the Bell state) loaded.
const DEFAULT_QASM = EXAMPLES[0].qasm;

function App() {
  // The hook is called here, in the common parent, so both the header
  // (examples menu) and the panel (editor, diagram, results) can use it.
  const { qasmText, setQasmText, result, circuit, error, runSimulation } = useCircuit(DEFAULT_QASM);

  return (
    <div style={{ width: "80%", margin: "0 auto" }}>
      <Header onSelectExample={setQasmText} />
      <CircuitTestPanel
        qasmText={qasmText}
        onTextChange={setQasmText}
        onRun={runSimulation}
        result={result}
        circuit={circuit}
        error={error}
      />

      <Footer />
    </div>
  );
}

export default App;