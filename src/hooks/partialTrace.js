// From How to Write a Simulator for Quantum Circuits
// from Scratch: A Tutorial by Michael J. McGuffin,
// Jean-Marc Robert and Kazuki Ikeda

// Consider a 16×16 density matrix M defined for 4 qubits, numbered 0 to 3.
// The caller can invoke partialTrace( 4, M, [0,2] );
// to trace out qubits 0 and 2, keeping 1 and 3, and returning a 4×4 matrix.
// If T is the number of qubits to trace out, and K=n-T is the number of qubits to keep,
// the routine returns a matrix of size (2^K) × (2^K) and takes O( (2^T) (2^(2K)) K ) time.


function partialTrace(
    n, // number of qubits in the circuit
    inputMatrix, // a (2^n) × (2^n) matrix of complex numbers

    // An array of values in the range 0 to n-1, representing the qubits to trace out.
    // Assumed to be in ascending order and without duplicates.
    qubitsToTraceOut
) {
    // Compute an array of complementary indices called qubitsToKeep,
    // containing all the indices in [0,n-1] that are not in qubitsToTraceOut.
    isTracedOut = []; // this is a temporary array, initially empty
    for (i = 0; i < n; i++) // append n false values
        isTracedOut.push(false);
    for (i = 0; i < qubitsToTraceOut.length; i++)
        isTracedOut[qubitsToTraceOut[i]] = true;
    // Now, isTracedOut[i]==true means qubit i will be traced out
    qubitsToKeep = []; // the marginal qubits
    for (i = 0; i < n; i++)
        if (!isTracedOut[i])
            qubitsToKeep.push(i);

    numQubitsToTraceOut = qubitsToTraceOut.length;
    numQubitsToKeep = qubitsToKeep.length;
    assert(numQubitsToTraceOut + numQubitsToKeep == n); // sanity check
    // This is 2^numQubitsToTraceOut == the dimension of the space being traced out
    tracedDimension = 1 << numQubitsToTraceOut;
    // This is 2^numQubitsToKeep == the dimension of the resulting matrix
    resultDimension = 1 << numQubitsToKeep;
    outputMatrix = new Matrix(resultDimension, resultDimension); // initialized with zeros
    for (
        shared_bits = 0; // bits common to input_row and input_col
        shared_bits < tracedDimension;
        shared_bits++
    ) {
        shared_bits_rearranged = rearrangeBits(shared_bits, qubitsToTraceOut);
        for (output_row = 0; output_row < resultDimension; output_row++) {
            input_row = shared_bits_rearranged | rearrangeBits(output_row, qubitsToKeep);
            for (output_col = 0; output_col < resultDimension; output_col++) {
                input_col = shared_bits_rearranged | rearrangeBits(output_col, qubitsToKeep);
                outputMatrix[output_row, output_col] += inputMatrix[input_row, input_col];
            }
        }
    }
    return outputMatrix;
}
