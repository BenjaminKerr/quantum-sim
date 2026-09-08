import { useRegressionTest } from "../hooks/useRegressionTest";

function RegressionTestPanel() {
  const { result, runTest } = useRegressionTest();

  return (
    <div>
      <button onClick={runTest}>Run Regression Tests</button>

      { result && (
        <div>
          { <p>{result.allSuccessful ? "All tests passed" : "Some tests failed"}</p> }
          <pre>{result.logLines.join('\n')}</pre>
        </div>
      )}
    </div>
  );
}

export default RegressionTestPanel;