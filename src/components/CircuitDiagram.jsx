import { computeGateColumns, computeDiagramDimensions } from "../lib/CircuitLayout.js";

const SLOT_WIDTH = 64;  // px per column
const WIRE_HEIGHT = 56; // px per wire (row)

// Text shown inside a gate box, e.g. "H" or "RX(90°)"
function gateLabel(gate) {
  return gate.angle === null ? gate.gate : `${gate.gate}(${gate.angle}°)`;
}

function CircuitDiagram({ circuit }) {
  const columns = computeGateColumns(circuit);
  const { numWires, numSlots } = computeDiagramDimensions(circuit, columns);

  // Build every cell of the grid, row by row (wire 0 first, slot 0 first).
  const cells = [];
  for (let r = 0; r < numWires; r++) {
    for (let c = 0; c < numSlots; c++) {
      // The gate whose target box sits in this cell, or undefined if none.
      const gateHere = circuit.gates.find((gate, i) => gate.wire === r && columns[i] === c);

      // True if some gate in this column has a control on this wire.
      const hasControlHere = circuit.gates.some((gate, i) =>
        columns[i] === c && gate.controls.some(control => control[0] === r)
      );

      // Connector lines. A gate's connector spans from its topmost to its
      // bottommost touched wire (wire 0 is the top row). In each cell we draw
      // a half-line going up if connector exists above this row, and a
      // half-line going down if connector exists below it. Top end: only down.
      // Bottom end: only up. Middle rows: both. A single-wire gate: neither.
      const drawsUp = circuit.gates.some((gate, i) => {
        const touchedWires = [gate.wire, ...gate.controls.map(control => control[0])];
        return columns[i] === c && r > Math.min(...touchedWires) && r <= Math.max(...touchedWires);
      });
      const drawsDown = circuit.gates.some((gate, i) => {
        const touchedWires = [gate.wire, ...gate.controls.map(control => control[0])];
        return columns[i] === c && r >= Math.min(...touchedWires) && r < Math.max(...touchedWires);
      });

      // Wires past the real qubits are the spare, display-only wire.
      const isSpareWire = r >= circuit.numQubits;

      cells.push(
        <div
          key={`${r}-${c}`}
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* The wire: a thin line through the middle of the cell */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: "50%",
              height: 2,
              background: "CanvasText",
              opacity: isSpareWire ? 0.5 : 1,
            }}
          />

          {/* Connector half-lines: up from the cell's center to its top edge,
              and/or down from the center to its bottom edge */}
          {drawsUp && (
            <div
              style={{
                position: "absolute",
                top: 0,
                height: "50%",
                left: "calc(50% - 1px)",
                width: 2,
                background: "CanvasText",
              }}
            />
          )}
          {drawsDown && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                bottom: 0,
                left: "calc(50% - 1px)",
                width: 2,
                background: "CanvasText",
              }}
            />
          )}

          {/* The gate box, drawn on top of the wire */}
          {gateHere && (
            <div
              style={{
                position: "relative",
                padding: "6px 8px",
                border: "2px solid CanvasText",
                background: "Canvas",
                color: "CanvasText",
                fontSize: 14,
                whiteSpace: "nowrap",
              }}
            >
              {gateLabel(gateHere)}
            </div>
          )}

          {/* A filled dot marks a control on this wire */}
          {hasControlHere && (
            <div
              style={{
                position: "relative",
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: "CanvasText",
              }}
            />
          )}
        </div>
      );
    }
  }

  return (
    // overflow-x lets wide circuits scroll sideways instead of squashing
    <div style={{ overflowX: "auto" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${numSlots}, ${SLOT_WIDTH}px)`,
          gridTemplateRows: `repeat(${numWires}, ${WIRE_HEIGHT}px)`,
          width: "max-content",
        }}
      >
        {cells}
      </div>
    </div>
  );
}

export default CircuitDiagram;