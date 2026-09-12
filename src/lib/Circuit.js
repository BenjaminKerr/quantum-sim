import Sim from "./Sim.js";
import { CMatrix } from "./CMatrix.js";

export function runCircuit(circuit) {
    let psi_0 = CMatrix.kronPower(Sim.ketZero, circuit.numQubits);
    for (let gate of circuit.gates) {
        let gateMatrix = gate.angle === null ? Sim[gate.gate] : Sim[gate.gate](gate.angle);
        psi_0 = Sim.qubitWiseMultiply(gateMatrix, gate.wire, circuit.numQubits, psi_0, gate.controls);
    }
    return psi_0;
}