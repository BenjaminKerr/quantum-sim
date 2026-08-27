// From How to Write a Simulator for Quantum Circuits
// from Scratch: A Tutorial by Michael J. McGuffin,
// Jean-Marc Robert and Kazuki Ikeda

// Returns the product of (I⊗...⊗I⊗U⊗I⊗...⊗I) and |a>,
// where I is the 2×2 identity matrix, U is a given 2×2 matrix,
// |a> is a (2^n)×1 column vector, and the return value is
// another column vector of the same size as |a>.
// The tensor product in parentheses has n factors, and would
// result in a matrix of size (2^n)×(2^n) if evaluated explicitly.
// U is at a position in the tensor product given by i_w,
// with i_w=0 or i_w=n-1 indicating that U
// is the right-most or left-most factor, respectively.
// The algorithm avoids explicitly computing the tensor product
// in parentheses, and takes O(2^n) time.

// Control bits and anti control bits limit the effect of U
// to a subset of the amplitudes in |a>.

function qubitWiseMultiply(
    n, // number of qubits in the circuit, 1 <= n
    U, // a 2×2 matrix of complex numbers
    i_w, // index of wire on which to apply U, 0 <= i_w <= n-1

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
        bit = 1 << wireIndex // 2^wireIndex
        inclusionMask |= bit; // turn on the bit
        if (flag)
            desiredValueMask |= bit; // turn on the bit
    }

    sizeOfStateVector = 1 << n; // 2^n; could be 2, 4, 8...
    sizeOfHalfBlock = 1 << i_w; // could be 1, 2, 4...
    sizeofBlock = sizeOfHalfBlock << 1; // could be 2, 4, 8...
    b = a.copy(); // copies all amplitudes from a to b
    // b0 is the index of the start of the block;
    // offset is an offset within the block
    for (b0 = 0; b0 < sizeOfStateVector; b0 += sizeOfBlock) {
        for (offset = 0; offset < sizeOfHalfBlock; offset++) {
            i1 = b0 | offset; // faster than, but equivalent to, b0+offset
            if ((i1 & inclusionMask) != desiredValueMask)
                continue; // skip
            i2 = i1 | sizeOfHalfBlock; // equivalent to i1+sizeOfHalfBlock
            b[i1] = U[0, 0] * a[i1] + U[0, 1] * a[i2];
            b[i2] = U[1, 0] * a[i1] + U[1, 1] * a[i2];
        }
    }
    return b;
}
