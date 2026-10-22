// lib/CircuitLayout.js

import { MAX_QUBITS } from './limits.js';

const MIN_SLOTS = 5;

/**
 * Given a circuit ({ numQubits, gates }), computes a column index for
 * each gate (same order as circuit.gates), suitable for laying out a
 * left-to-right circuit diagram. Gates that don't share any wire (directly
 * or via a control) may share a column; any gate touching a wire another
 * gate already occupies is pushed to a later column.
 *
 * Returns an array of column numbers, parallel to circuit.gates
 * (columns[i] is the column for circuit.gates[i]).
 */
export function computeGateColumns(circuit) {
  const nextAvailableColumn = new Array(circuit.numQubits).fill(0);
  const columns = [];

  for (const gate of circuit.gates) {
    // 1. Every wire this gate touches: its target plus all control wires.
    const controlWires = gate.controls.map(c => c[0]);
    const touchedWires = [gate.wire, ...controlWires];

    // The connector line spans from the topmost to the bottommost touched
    // wire, so every wire in that range is occupied in this column, even
    // wires the gate itself doesn't touch (e.g. wire 1 for a CX from 0 to 2).
    const topWire = Math.min(...touchedWires);
    const bottomWire = Math.max(...touchedWires);
    const occupiedWires = Array.from(
      { length: bottomWire - topWire + 1 },
      (_, k) => topWire + k
    );

    // 2. The gate goes in the latest "next free" column among occupied wires.
    const maxColumn = Math.max(...occupiedWires.map(w => nextAvailableColumn[w]));

    // 3. Record the column (columns stays parallel to circuit.gates).
    columns.push(maxColumn);

    // 4. Every occupied wire is now taken through this column.
    for (const w of occupiedWires) {
      nextAvailableColumn[w] = maxColumn + 1;
    }
  }

  return columns;
}

/**
 * Computes how big the diagram grid should be for a circuit.
 *
 * Wires: one per qubit, plus one spare (drawn faintly, display-only) as
 *   long as that doesn't exceed MAX_QUBITS wires in total.
 * Slots: enough for every occupied column, plus one spare empty slot at
 *   the end, and never fewer than MIN_SLOTS.
 *
 * `columns` is the array returned by computeGateColumns(circuit).
 */
export function computeDiagramDimensions(circuit, columns) {
  const maxCol = columns.length === 0 ? -1 : Math.max(...columns);
  const numSlots = Math.max(maxCol + 2, MIN_SLOTS);
  const numWires = Math.min(circuit.numQubits + 1, MAX_QUBITS);
  const hasSpareWire = numWires > circuit.numQubits;
  return { numWires, numSlots, hasSpareWire };
}