// Overhauled 9/18/2026, implementation by Claude
// OpenQASM text is kept local, result of parsing is what's shared

import { runCircuit } from "../lib/Circuit.js";
import { parseCircuit } from "../lib/QasmParser.js";
import { useState } from "react";

export function useCircuit() {
    const [result, setResult] = useState(false);
    const [error, setError] = useState(null);

    function runSimulation(qasmText) {
        try {
            const circuit = parseCircuit(qasmText);
            setResult(runCircuit(circuit));
            setError(null);
        } catch (e) {
            setResult(false);
            setError(e.message);
        }
    }

    return { result, error, runSimulation };
}