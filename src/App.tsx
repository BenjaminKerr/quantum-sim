import { useState } from "react"
import Button from "./components/Button";
import Alert from "./components/Alert"

function App() {
  const [alertVisible, setAlertVisibility] = useState(false)

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