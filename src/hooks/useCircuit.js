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
    const [result, setResult] = useState(false);
    // Passing a function to useState means React calls it only on the first
    // render. Without the () => wrapper, tryParse would re-run (and re-parse
    // the text) on every render, and its result would be thrown away.
    const [circuit, setCircuit] = useState(() => tryParse(initialQasm));
    const [error, setError] = useState(null);

    // Called on every keystroke. If the text parses, the diagram follows it.
    // If not (e.g. the user is halfway through typing a statement), we do
    // nothing, so the diagram keeps showing the last text that did parse.
    function updateCircuitFromText(qasmText) {
        const parsed = tryParse(qasmText);
        if (parsed !== null) {
            setCircuit(parsed);
        }
    }

    // Called by the Run button. Parsing is cheap, so it happens on every
    // keystroke, but simulation can get expensive, so it only happens here.
    function runSimulation(qasmText) {
        try {
            const parsedCircuit = parseCircuit(qasmText);
            setResult(runCircuit(parsedCircuit));
            setError(null);
        } catch (e) {
            setResult(false);
            setError(e.message);
        }
    }

    return { result, circuit, error, runSimulation, updateCircuitFromText };
}