import { runCircuit } from "../lib/Circuit.js";
import { useState } from "react";

export function useCircuit() {
    const [result, setResult] = useState(false);

    const gatePlacement1 = {
        gate: "RX",
        wire: 0,
        angle: 90,
        controls: []
    }
    const gatePlacement2 = {
        gate: "RX",
        wire: 1,
        angle: 90,
        controls: []
    }
    const gatePlacement3 = {
        gate: "RZ",
        wire: 1,
        angle: 90,
        controls: [[0, true]]
    }

    const circuit = { numQubits: 2, gates: [gatePlacement1, gatePlacement2, gatePlacement3] };

    function runSimulation() {
        setResult(runCircuit(circuit));
    }

    return { result, runSimulation };
}