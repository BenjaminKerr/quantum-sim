// lib/examples.js
//
// Ready-made circuits for the "examples" dropdown. Each one only uses
// features the parser supports today (h, x, cx and the qreg declaration).

export const EXAMPLES = [
  {
    name: "Bell state",
    qasm: `OPENQASM 2.0;
include "qelib1.inc";
qreg q[2];

// Entangle two qubits: the result is (|00> + |11>) / sqrt(2)
h q[0];
cx q[0],q[1];
`,
  },
  {
    name: "GHZ state",
    qasm: `OPENQASM 2.0;
include "qelib1.inc";
qreg q[3];

// Entangle three qubits: the result is (|000> + |111>) / sqrt(2)
h q[0];
cx q[0],q[1];
cx q[1],q[2];
`,
  },
  {
    name: "Grover's search",
    qasm: `OPENQASM 2.0;
include "qelib1.inc";
qreg q[2];

// Grover's algorithm on 2 qubits, searching for the state |11>.
// One iteration finds it with certainty.

// Start in an equal superposition of all four states
h q[0];
h q[1];

// Oracle: flip the sign of |11> (a controlled-Z, built from h, cx, h)
h q[1];
cx q[0],q[1];
h q[1];

// Diffusion: amplify the marked state
h q[0];
h q[1];
x q[0];
x q[1];
h q[1];
cx q[0],q[1];
h q[1];
x q[0];
x q[1];
h q[0];
h q[1];
`,
  },
];