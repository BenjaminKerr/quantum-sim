import { useState, useEffect } from "react"
import Button from "./components/Button";
import Alert from "./components/Alert";
import { runCircuit } from "./lib/Circuit.js"
import CircuitTestPanel from "./components/CircuitTestPanel.jsx";

function App() {
  const [alertVisible, setAlertVisibility] = useState(false)

  return (
    <div>
        <CircuitTestPanel/>
    </div>
  );
}

export default App;