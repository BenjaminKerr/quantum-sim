import { runCircuit } from "../lib/Circuit.js";
import { parseCircuit } from "../lib/QasmParser.js";
import { useState } from "react";

export function useCircuit() {
    const [result, setResult] = useState(false);
    const [circuit, setCircuit] = useState(null);
    const [error, setError] = useState(null);

    function runSimulation(qasmText) {
        try {
            // Named parsedCircuit (not circuit) so it doesn't shadow the
            // state variable above, which would be confusing to read.
            const parsedCircuit = parseCircuit(qasmText);
            setResult(runCircuit(parsedCircuit));
            setCircuit(parsedCircuit);
            setError(null);
        } catch (e) {
            setResult(false);
            setError(e.message);
        }
    }

    return { result, circuit, error, runSimulation };
}