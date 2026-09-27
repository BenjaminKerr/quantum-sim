// lib/CircuitLayout.js

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
    // 1. Figure out every wire this gate touches (gate.wire, plus every
    //    control's wire index from gate.controls).
    
    // 2. This gate's column = the MAX of nextAvailableColumn[w] over
    //    every wire w it touches.
    // 3. Record that column in `columns`.
    // 4. Update nextAvailableColumn[w] for every touched wire w, so
    //    future gates know this column (and everything before it) is
    //    now occupied on that wire.
  }

  return columns;
}