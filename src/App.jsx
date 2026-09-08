import { useState, useEffect } from "react"
import Button from "./components/Button";
import Alert from "./components/Alert";
import { performRegressionTest } from "./lib/performRegressionTest.js"
import RegressionTestPanel from "./components/RegressionTestPanel.jsx";

function App() {
  const [alertVisible, setAlertVisibility] = useState(false)

  return (
    <div>
        <RegressionTestPanel/>
    </div>
  );
}

export default App;