import { runCircuit } from "../lib/Circuit.js";
import { parseCircuit } from "../lib/QasmParser.js";
import { useState } from "react";

// Like parseCircuit, but returns null instead of throwing. Used where a
// parse error is expected and harmless (initial state, mid-typing updates).
function tryParse(qasmText) {
    try {
        return parseCircuit(qasmText);
    } catch {
        return null;
    }
}

export function useCircuit(initialQasm) {
    // The QASM text now lives here (it used to live in CircuitTestPanel), so
    // that anything in the app can change it, e.g. the examples menu.
    const [qasmText, setQasmTextState] = useState(initialQasm);
    const [result, setResult] = useState(false);
    // Passing a function to useState means React calls it only on the first
    // render, instead of re-parsing on every render.
    const [circuit, setCircuit] = useState(() => tryParse(initialQasm));
    const [error, setError] = useState(null);

    // Every change to the text goes through here, whether it was typed or
    // loaded from an example. If the new text parses, the diagram follows it;
    // if not (e.g. mid-typing), the diagram keeps the last text that parsed.
    function setQasmText(newText) {
        setQasmTextState(newText);
        const parsed = tryParse(newText);
        if (parsed !== null) {
            setCircuit(parsed);
        }
    }

    // Called by the Run button. Parsing is cheap, so it happens on every
    // change, but simulation can get expensive, so it only happens here.
    function runSimulation() {
        try {
            const parsedCircuit = parseCircuit(qasmText);
            setResult(runCircuit(parsedCircuit));
            setError(null);
        } catch (e) {
            setResult(false);
            setError(e.message);
        }
    }

    return { qasmText, setQasmText, result, circuit, error, runSimulation };
}