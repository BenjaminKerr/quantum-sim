import { useState, useEffect } from "react"
import Button from "./components/Button";
import Alert from "./components/Alert";
import { performRegressionTest } from "./lib/performRegressionTest.js"

function App() {
  const [alertVisible, setAlertVisibility] = useState(false)
  useEffect(() => { console.log(performRegressionTest(true)) }, [])

  return (
    <div>
        { alertVisible && <Alert onClose={() => setAlertVisibility(false)}>My alert</Alert> }
        <Button color="primary" onClick={() => setAlertVisibility(true)}>
          Hello <span>World</span>
        </Button>
    </div>
  );
}

export default App;