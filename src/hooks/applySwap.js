// From How to Write a Simulator for Quantum Circuits
// from Scratch: A Tutorial by Michael J. McGuffin,
// Jean-Marc Robert and Kazuki Ikeda

// Returns the given state vector |a> after swapping wires i and j.
// In other words, implements a SWAP gate on qubits i and j.
// Takes O(2^n) time.

// Control bits and anti-control bits limit the effect of the SWAP
// to a subset of the amplitudes in |a>.


function applySwap(
    n, // number of qubits in the circuit 1 <= n
    i_w, j_w, // indices of wires to swap, 0 <= i_w <= n-1, 0 <= j_w <= n-1

    // This is the state vector to transform;
    // a (2^n)×1 column vector of complex amplitudes
    a,

    // A list of pairs of the form [wire_index, flag] where 0<=wire_index<n
    // and flag is true for a control bit and false for an anti-control bit
    listOfControlBits = [] // empty by default
) {
    inclusionMask = 0;
    desiredValueMask = 0;
    for (iterator in listOfControlBits) {
        [wireIndex, flag] = iterator;
        bit = 1 << wireIndex; // 2^wireIndex
        inclusionMask |= bit; // turn on the bit
        if (flag)
            desiredValueMask |= bit; // turn on the bit
    }

    sizeOfStateVector = 1 << n; // 2^n
    b = a.copy(); // copies all amplitudes from a to b
    if (i_w == j_w) return b; // there's no work to do
    for (k = 0; k < sizeOfStateVector; k++) {
        if ((k & inclusionMask) != desiredValueMask)
            continue; // skip
        k2 = swapBits(k, i_w, j_w);
        if (k2 > k) { // this check ensures we don't swap each pair twice
            // swap the (k)th and (k2)th amplitudes
            b[k2] = a[k];
            b[k] = a[k2];
        }
    }
    return b;
}
