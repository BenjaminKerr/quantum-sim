import { useCircuit } from "../hooks/useCircuit";

function CircuitTestPanel() {
  const { result, runSimulation } = useCircuit();

  return (
    <div>
      <button onClick={runSimulation}>Run Circuit Simulation</button>
      { result && (
        <div>
          <pre>{result.toString({binaryPrefixes: true})}</pre>
        </div>
      )}
    </div>
  );
}

export default CircuitTestPanel;