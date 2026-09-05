import { usingTextbookConvention, defaultDecimalPrecision, precisionForApproximateComparison } from "./constants.js"
import {CMatrix} from "./CMatrix.js"
import {Util} from "./Util.js"
import {StringUtil} from "./StringUtil.js"
import {Complex} from "./Complex.js"

import Sim from "./Sim.js"

export function performRegressionTest( verbose=true ) {
    console.log("Matrices are ordered according to " + (usingTextbookConvention?"textbook":"common software") + " convention.");

    let logLines = [];
    let input, step1, step2, step3, step4, step5, computedOutput, expectedOutput, success, output_method2;
    let allSuccessful = true;


    // Simulate a circuit on two qubits that entangles them,
    // equivalent to
    //     https://algassert.com/quirk#circuit={%22cols%22:[[%22H%22],[%22%E2%80%A2%22,%22X%22]]}
    //
    // qubit q0 |0>----Hadamard-----o-----
    //                              |
    // qubit q1 |0>----------------(+)----
    //
    input = CMatrix.kron( Sim.ketZero /*q1*/, Sim.ketZero /*q0*/, usingTextbookConvention );
    step1 = CMatrix.kron( Sim.I /*q1*/, Sim.H /*q0*/, usingTextbookConvention );
    step2 = Sim.CX;
    computedOutput = CMatrix.naryMult([ step2, step1, input ]);
    if ( verbose ) logLines.push(StringUtil.concatMultiline(
        step2.toString(),
        " * ",
        step1.toString(),
        " * ",
        input.toString(),
        " = ",
        computedOutput.toString({binaryPrefixes:true})
    ));
    expectedOutput = CMatrix.createColVector([ 0.707, 0, 0, 0.707 ]);
    success = CMatrix.approximatelyEqual(computedOutput,expectedOutput.reverseEndianness( usingTextbookConvention ));
    Util.assert( success, "Regression test failed "+'872ec24acc' );
    allSuccessful &&= success;


    // Simulate another circuit on two qubits
    // equivalent to
    //     https://algassert.com/quirk#circuit={%22cols%22:[[%22%E2%80%A2%22,%22X%22],[%22X%22]]}
    //
    // qubit q0 |0>----o----(+)-
    //                 |
    // qubit q1 |0>---(+)-------
    //
    input = CMatrix.kron( Sim.ketZero /*q1*/, Sim.ketZero /*q0*/, usingTextbookConvention );
    step1 = Sim.CX;
    step2 = CMatrix.kron( Sim.I /*q1*/, Sim.X /*q0*/, usingTextbookConvention );
    computedOutput = CMatrix.naryMult([ step2, step1, input ]);
    if ( verbose ) logLines.push(StringUtil.concatMultiline(
        step2.toString(),
        " * ",
        step1.toString(),
        " * ",
        input.toString(),
        " = ",
        computedOutput.toString({binaryPrefixes:true})
    ));
    expectedOutput = CMatrix.createColVector([ 0,1,0,0 ]);
    success = CMatrix.approximatelyEqual(computedOutput,expectedOutput.reverseEndianness( usingTextbookConvention ));
    Util.assert( success, "Regression test failed "+'ec53d19216' );
    allSuccessful &&= success;


    // Simulate another circuit on two qubits
    // equivalent to
    //     https://algassert.com/quirk#circuit={%22cols%22:[[%22%E2%80%A2%22,%22X%22],[%22X%22]],%22init%22:[1]}
    //
    // qubit q0 |1>----o----(+)-
    //                 |
    // qubit q1 |0>---(+)-------
    //
    input = CMatrix.kron( Sim.ketZero /*q1*/, Sim.ketOne /*q0*/, usingTextbookConvention  );
    step1 = Sim.CX;
    step2 = CMatrix.kron( Sim.I /*q1*/, Sim.X /*q0*/, usingTextbookConvention );
    computedOutput = CMatrix.naryMult([ step2, step1, input ]);
    if ( verbose ) logLines.push(StringUtil.concatMultiline(
        step2.toString(),
        " * ",
        step1.toString(),
        " * ",
        input.toString(),
        " = ",
        computedOutput.toString({binaryPrefixes:true})
    ));
    expectedOutput = CMatrix.createColVector([ 0,0,1,0 ]);
    success = CMatrix.approximatelyEqual(computedOutput,expectedOutput.reverseEndianness( usingTextbookConvention ));
    Util.assert( success, "Regression test failed "+'2bbcc438a1' );
    allSuccessful &&= success;


    // Simulate another circuit on two qubits
    // equivalent to
    //     https://algassert.com/quirk#circuit={%22cols%22:[[%22%E2%80%A2%22,%22X%22],[%22X%22]],%22init%22:[%22+%22,%22i%22]}
    //
    // qubit q0 |+>----o----(+)-
    //                 |
    // qubit q1 |i>---(+)-------
    //
    input = CMatrix.kron( Sim.ketPlusI /*q1*/, Sim.ketPlus /*q0*/, usingTextbookConvention );
    step1 = Sim.CX;
    step2 = CMatrix.kron( Sim.I /*q1*/, Sim.X /*q0*/, usingTextbookConvention );
    computedOutput = CMatrix.naryMult([ step2, step1, input ]);
    if ( verbose ) logLines.push(StringUtil.concatMultiline(
        step2.toString(),
        " * ",
        step1.toString(),
        " * ",
        input.toString(),
        " = ",
        computedOutput.toString({binaryPrefixes:true})
    ));
    expectedOutput = CMatrix.createColVector([ new Complex(0,0.5),0.5,0.5,new Complex(0,0.5) ]);
    success = CMatrix.approximatelyEqual(computedOutput,expectedOutput.reverseEndianness( usingTextbookConvention ));
    Util.assert( success, "Regression test failed "+'7e132563e4' );
    allSuccessful &&= success;


    // Simulate another circuit on two qubits
    // equivalent to
    //     https://algassert.com/quirk#circuit={%22cols%22:[[{%22id%22:%22Rxft%22,%22arg%22:%22pi/2%22},{%22id%22:%22Rxft%22,%22arg%22:%22pi/2%22}],[%22%E2%80%A2%22,{%22id%22:%22Rzft%22,%22arg%22:%22pi/2%22}]]}
    //
    // qubit q0 |0>----RX(pi/2)--------o--------
    //                                 |
    // qubit q1 |0>----RX(pi/2)----(RZ(pi/2))---
    //
    input = CMatrix.kron( Sim.ketZero /*q1*/, Sim.ketZero /*q0*/, usingTextbookConvention );
    step1 = CMatrix.kron( Sim.RX_90deg /*q1*/, Sim.RX_90deg /*q0*/, usingTextbookConvention );
    computedOutput = CMatrix.mult( step1, input );
    computedOutput = Sim.qubitWiseMultiply( Sim.RZ_90deg,1,2,computedOutput,[[0,true]]);
    if ( verbose ) logLines.push(StringUtil.concatMultiline(
        "... = ",
        computedOutput.toString({binaryPrefixes:true})
    ));
    expectedOutput = CMatrix.createColVector([ new Complex(0.5,0),new Complex(-0.35355,-0.35355),new Complex(0,-0.5),new Complex(-0.35355,-0.35355) ]);
    success = CMatrix.approximatelyEqual(computedOutput,expectedOutput.reverseEndianness( usingTextbookConvention ));
    Util.assert( success, "Regression test failed "+'be0c19df98' );
    allSuccessful &&= success;


    // Simulate another circuit on two qubits
    // equivalent to
    //     https://algassert.com/quirk#circuit={%22cols%22:[[%22X^%C2%BC%22,%22Y^%C2%BC%22],[1,%22X^%C2%BC%22]]}
    //
    // qubit q0 |0>----(x^0.25)-----------------
    //
    // qubit q1 |0>----(y^0.25)-----(x^0.25)----
    //
    input = CMatrix.kron( Sim.ketZero /*q1*/, Sim.ketZero /*q0*/, usingTextbookConvention );
    step1 = CMatrix.kron( Sim.SSY /*q1*/, Sim.SSX /*q0*/, usingTextbookConvention );
    step2 = CMatrix.kron( Sim.SSX /*q1*/, Sim.I /*q0*/, usingTextbookConvention );
    computedOutput = CMatrix.naryMult([ step2, step1, input ]);
    if ( verbose ) logLines.push(StringUtil.concatMultiline(
        step2.toString(),
        " * ",
        step1.toString(),
        " * ",
        input.toString(),
        " = ",
        computedOutput.toString({binaryPrefixes:true})
    ));
    expectedOutput = CMatrix.createColVector([ new Complex(0.42678, 0.67678),new Complex(0.28033, -0.17678),new Complex(0.42678, 0.17678),new Complex(0.07322, -0.17678) ]);
    success = CMatrix.approximatelyEqual(computedOutput,expectedOutput.reverseEndianness( usingTextbookConvention ));
    Util.assert( success, "Regression test failed "+'21e10d99d6' );
    allSuccessful &&= success;


    // Simulate a circuit on three qubits
    // equivalent to
    //     https://algassert.com/quirk#circuit={%22cols%22:[[%22X^%C2%BC%22,%22Y^%C2%BC%22,%22H%22],[1,%22X^%C2%BC%22],[1,%22Swap%22,%22Swap%22]]}
    //
    // qubit q0 |0>----(x^0.25)----------------------
    //
    // qubit q1 |0>----(y^0.25)-----(x^0.25)----X-----
    //                                          |
    // qubit q2 |0>-------H---------------------X-----
    //
    input = CMatrix.naryKron( [ Sim.ketZero /*q2*/, Sim.ketZero /*q1*/, Sim.ketZero /*q0*/ ], usingTextbookConvention );
    step1 = CMatrix.naryKron( [ Sim.H /*q2*/, Sim.SSY /*q1*/, Sim.SSX /*q0*/ ], usingTextbookConvention );
    step2 = CMatrix.naryKron( [ Sim.I /*q2*/, Sim.SSX /*q1*/, Sim.I /*q0*/ ], usingTextbookConvention );
    step3 = Sim.SWAP(1,2,3);
    computedOutput = CMatrix.naryMult([ step3, step2, step1, input ]);
    if ( verbose ) logLines.push(StringUtil.concatMultiline(
        step3.toString(),
        " * ",
        step2.toString({decimalPrecision:1}),
        " * ",
        "...", // step1.toString({decimalPrecision:1}),
        " * ",
        input.toString(),
        " = ",
        computedOutput.toString({binaryPrefixes:true})
    ));
    expectedOutput = CMatrix.createColVector([
        new Complex(0.30178,0.47855),
        new Complex(0.19822,-0.12500),
        new Complex(0.30178,0.47855),
        new Complex(0.19822,-0.12500),
        new Complex(0.30178,0.12500),
        new Complex(0.05178,-0.12500),
        new Complex(0.30178,0.12500),
        new Complex(0.05178,-0.12500)
    ]);
    success = CMatrix.approximatelyEqual(computedOutput,expectedOutput.reverseEndianness( usingTextbookConvention ));
    Util.assert( success, "Regression test failed "+'1c4fee293c' );
    allSuccessful &&= success;




    // Simulate a circuit on three qubits
    // equivalent to
    //     https://algassert.com/quirk#circuit={%22cols%22:[[%22X^%C2%BC%22,%22Y^%C2%BC%22,%22H%22],[1,%22X^%C2%BC%22],[1,%22X%22,%22%E2%80%A2%22]]}
    //
    // qubit q0 |0>----(x^0.25)-------------------------
    //
    // qubit q1 |0>----(y^0.25)-----(x^0.25)----(+)-----
    //                                           |
    // qubit q2 |0>-------H----------------------o------
    //
    input = CMatrix.naryKron( [ Sim.ketZero /*q2*/, Sim.ketZero /*q1*/, Sim.ketZero /*q0*/ ], usingTextbookConvention );
    step1 = CMatrix.naryKron( [ Sim.H /*q2*/, Sim.SSY /*q1*/, Sim.SSX /*q0*/ ], usingTextbookConvention );
    step2 = CMatrix.naryKron( [ Sim.I /*q2*/, Sim.SSX /*q1*/, Sim.I /*q0*/ ], usingTextbookConvention );
    step3 = Sim.expand4x4ForNWires( Sim.CX, 2, 1, 3 );
    computedOutput = CMatrix.naryMult([ step3, step2, step1, input ]);
    if ( verbose ) logLines.push(StringUtil.concatMultiline(
        step3.toString(),
        " * ",
        step2.toString({decimalPrecision:1}),
        " * ",
        "...", // step1.toString({decimalPrecision:1}),
        " * ",
        input.toString(),
        " = ",
        computedOutput.toString({binaryPrefixes:true})
    ));
    expectedOutput = CMatrix.createColVector([
        new Complex(0.30178,0.47855),
        new Complex(0.19822,-0.12500),
        new Complex(0.30178,0.12500),
        new Complex(0.05178,-0.12500),
        new Complex(0.30178,0.12500),
        new Complex(0.05178,-0.12500),
        new Complex(0.30178,0.47855),
        new Complex(0.19822,-0.12500)
    ]);
    success = CMatrix.approximatelyEqual(computedOutput,expectedOutput.reverseEndianness( usingTextbookConvention ));
    Util.assert( success, "Regression test failed "+'1c4dab5619' );
    allSuccessful &&= success;




    // Simulate the same circuit, but this time without using explicit large matrices.
    //
    // qubit q0 |0>----(x^0.25)-------------------------
    //
    // qubit q1 |0>----(y^0.25)-----(x^0.25)----(+)-----
    //                                           |
    // qubit q2 |0>-------H----------------------o------
    //
    input = CMatrix.naryKron( [ Sim.ketZero /*q2*/, Sim.ketZero /*q1*/, Sim.ketZero /*q0*/ ], usingTextbookConvention  );
    step1 = Sim.qubitWiseMultiply(Sim.H,2,3,input,[]);
    step1 = Sim.qubitWiseMultiply(Sim.SSY,1,3,step1,[]);
    step1 = Sim.qubitWiseMultiply(Sim.SSX,0,3,step1,[]);
    step2 = Sim.qubitWiseMultiply(Sim.SSX,1,3,step1,[]);
    computedOutput = Sim.qubitWiseMultiply(Sim.X,1,3,step2,[[2,true]]);
    if ( verbose ) logLines.push(StringUtil.concatMultiline(
        input.toString(),
        " -> ",
        step1.toString(),
        " -> ",
        step2.toString(),
        " -> ",
        computedOutput.toString({binaryPrefixes:true})
    ));
    success = CMatrix.approximatelyEqual(computedOutput,expectedOutput.reverseEndianness( usingTextbookConvention ));
    Util.assert( success, "Regression test failed "+'23abd31026' );
    allSuccessful &&= success;





    // Simulate another circuit on two qubits
    // equivalent to
    //     https://algassert.com/quirk#circuit={%22cols%22:[[%22X^%C2%BD%22,%22X^%C2%BD%22],[%22%E2%80%A2%22,%22X%22]],%22init%22:[0,%22-%22]}
    //
    // qubit q0 |0>---(x^0.5)----o-----
    //                           |
    // qubit q1 |->---(x^0.5)---(+)----
    //
    input = CMatrix.kron( Sim.ketMinus /*q1*/, Sim.ketZero /*q0*/, usingTextbookConvention );
    step1 = CMatrix.kron( Sim.SX /*q1*/, Sim.SX /*q0*/, usingTextbookConvention );
    step2 = Sim.CX;
    computedOutput = CMatrix.naryMult([ step2, step1, input ]);
    if ( verbose ) logLines.push(StringUtil.concatMultiline(
        step2.toString(),
        " * ",
        step1.toString(),
        " * ",
        input.toString(),
        " = ",
        computedOutput.toString({binaryPrefixes:true})
    ));
    expectedOutput = CMatrix.createColVector([
        new Complex(-0.35355, 0.35355),
        new Complex(-0.35355,-0.35355),
        new Complex( 0.35355,-0.35355),
        new Complex( 0.35355, 0.35355)
    ]);
    success = CMatrix.approximatelyEqual(computedOutput,expectedOutput.reverseEndianness( usingTextbookConvention ));
    Util.assert( success, "Regression test failed "+'1c58b99eac' );
    allSuccessful &&= success;


    // Simulate another circuit on two qubits
    // equivalent to
    //     https://algassert.com/quirk#circuit={%22cols%22:[[%22X^%C2%BD%22,%22X%22],[%22H%22,%22X^%C2%BD%22],[%22%E2%80%A2%22,%22X%22]]}
    //
    // qubit q0 |0>---(x^0.5)--hadamard----o-----
    //                                     |
    // qubit q1 |0>-----(+)-----(x^0.5)---(+)----
    //
    input = CMatrix.kron( Sim.ketZero /*q1*/, Sim.ketZero /*q0*/, usingTextbookConvention );
    step1 = CMatrix.kron( Sim.X /*q1*/, Sim.SX /*q0*/, usingTextbookConvention );
    step2 = CMatrix.kron( Sim.SX /*q1*/, Sim.H /*q0*/, usingTextbookConvention );
    step3 = Sim.CX;
    computedOutput = CMatrix.naryMult([ step3, step2, step1, input ]);
    if ( verbose ) logLines.push(StringUtil.concatMultiline(
        step3.toString(),
        " * ",
        step2.toString(),
        " * ",
        step1.toString(),
        " * ",
        input.toString(),
        " = ",
        computedOutput.toString({binaryPrefixes:true})
    ));
    expectedOutput = CMatrix.createColVector([
        new Complex( 0.35355,-0.35355),
        new Complex(-0.35355, 0.35355),
        new Complex( 0.35355, 0.35355),
        new Complex( 0.35355, 0.35355)
    ]);
    success = CMatrix.approximatelyEqual(computedOutput,expectedOutput.reverseEndianness( usingTextbookConvention ));
    Util.assert( success, "Regression test failed "+'723049b630' );
    allSuccessful &&= success;


    // Simulate another circuit on three qubits
    // equivalent to
    //     https://algassert.com/quirk#circuit={%22cols%22:[[%22X^%C2%BD%22,%22X^%C2%BD%22,%22X^%C2%BD%22],[1,%22X%22,%22%E2%80%A2%22]]}
    //
    // qubit q0 |0>---(x^0.5)--------
    //
    // qubit q1 |0>---(x^0.5)--(+)---
    //                          |
    // qubit q2 |0>---(x^0.5)---o----
    //
    input = CMatrix.naryKron( [ Sim.ketZero /*q2*/, Sim.ketZero /*q1*/, Sim.ketZero /*q0*/ ], usingTextbookConvention  );
    step1 = CMatrix.naryKron( [ Sim.SX /*q2*/, Sim.SX /*q1*/, Sim.SX /*q0*/ ], usingTextbookConvention  );
    step2 = Sim.expand4x4ForNWires( Sim.CX, 2, 1, 3 );
    computedOutput = CMatrix.naryMult([ step2, step1, input ]);
    if ( verbose ) logLines.push(StringUtil.concatMultiline(
        step2.toString(),
        " * ",
        step1.toString(),
        " * ",
        input.toString(),
        " = ",
        computedOutput.toString({binaryPrefixes:true})
    ));
    expectedOutput = CMatrix.createColVector([
        new Complex(-0.25, 0.25),
        new Complex( 0.25, 0.25),
        new Complex( 0.25, 0.25),
        new Complex( 0.25,-0.25),
        new Complex( 0.25,-0.25),
        new Complex(-0.25,-0.25),
        new Complex( 0.25, 0.25),
        new Complex( 0.25,-0.25)
    ]);
    success = CMatrix.approximatelyEqual(computedOutput,expectedOutput.reverseEndianness( usingTextbookConvention ));
    Util.assert( success, "Regression test failed "+'c7cdcdc026' );
    allSuccessful &&= success;


    // Simulate the same circuit, but this time without using explicit large matrices.
    //
    // qubit q0 |0>---(x^0.5)--------
    //
    // qubit q1 |0>---(x^0.5)--(+)---
    //                          |
    // qubit q2 |0>---(x^0.5)---o----
    //
    input = CMatrix.naryKron( [ Sim.ketZero /*q2*/, Sim.ketZero /*q1*/, Sim.ketZero /*q0*/ ], usingTextbookConvention  );
    step1 = Sim.qubitWiseMultiply(Sim.SX,0,3,input,[]);
    step1 = Sim.qubitWiseMultiply(Sim.SX,1,3,step1,[]);
    step1 = Sim.qubitWiseMultiply(Sim.SX,2,3,step1,[]);
    computedOutput = Sim.qubitWiseMultiply(Sim.X,1,3,step1,[[2,true]]);
    if ( verbose ) logLines.push(StringUtil.concatMultiline(
        input.toString(),
        " -> ",
        step1.toString(),
        " -> ",
        computedOutput.toString({binaryPrefixes:true})
    ));
    success = CMatrix.approximatelyEqual(computedOutput,expectedOutput.reverseEndianness( usingTextbookConvention ));
    Util.assert( success, "Regression test failed "+'45cacd1026' );
    allSuccessful &&= success;



    // Simulate a circuit on four qubits
    // equivalent to
    //     https://algassert.com/quirk#circuit={%22cols%22:[[%22H%22,%22X^%C2%BD%22,1,%22X^%C2%BD%22],[%22%E2%80%A2%22,1,%22X%22],[1,%22X%22,%22%E2%80%A2%22],[1,%22%E2%80%A2%22,1,%22X%22],[1,%22H%22]]}
    //
    // qubit q0 |0>---hadamard---o--------------------------
    //                           |
    // qubit q1 |0>---(x^0.5)----|---(+)----o----hadamard---
    //                           |    |     |
    // qubit q2 |0>-------------(+)---o-----|---------------
    //                                      |
    // qubit q3 |0>---(x^0.5)--------------(+)--------------
    //
    input = CMatrix.naryKron( [ Sim.ketZero /*q3*/, Sim.ketZero /*q2*/, Sim.ketZero /*q1*/, Sim.ketZero /*q0*/ ], usingTextbookConvention );
    step1 = CMatrix.naryKron( [ Sim.SX /*q3*/, Sim.I /*q2*/, Sim.SX /*q1*/, Sim.H /*q0*/ ], usingTextbookConvention );
    step2 = Sim.expand4x4ForNWires( Sim.CX, 0, 2, 4 );
    step3 = Sim.expand4x4ForNWires( Sim.CX, 2, 1, 4 );
    step4 = Sim.expand4x4ForNWires( Sim.CX, 1, 3, 4 );
    step5 = CMatrix.naryKron( [ Sim.I /*q3*/, Sim.I /*q2*/, Sim.H /*q1*/, Sim.I /*q0*/ ], usingTextbookConvention );

    computedOutput = CMatrix.naryMult([ step5, step4, step3, step2, step1, input ]);
    if ( verbose ) logLines.push(StringUtil.concatMultiline(
        "... = ",
        computedOutput.toString({binaryPrefixes:true})
    ));
    expectedOutput = CMatrix.createColVector([
        new Complex( 0  , 0  ),
        new Complex( 0  , 0  ),
        new Complex( 0  , 0.5),
        new Complex( 0  , 0  ),
        new Complex( 0  , 0  ),
        new Complex( 0.5, 0  ),
        new Complex( 0  , 0  ),
        new Complex( 0  , 0  ),
        new Complex( 0.5, 0  ),
        new Complex( 0  , 0  ),
        new Complex( 0  , 0  ),
        new Complex( 0  , 0  ),
        new Complex( 0  , 0  ),
        new Complex( 0  , 0  ),
        new Complex( 0  , 0  ),
        new Complex( 0  ,-0.5)
    ]);
    success = CMatrix.approximatelyEqual(computedOutput,expectedOutput.reverseEndianness( usingTextbookConvention ));
    Util.assert( success, "Regression test failed "+'95b90f1b5d' );
    allSuccessful &&= success;

    // Try simulating the same circuit, but this time without using explicit large matrices.
    output_method2 = Sim.qubitWiseMultiply(Sim.H,0,4,input,[]);
    output_method2 = Sim.qubitWiseMultiply(Sim.SX,1,4,output_method2,[]);
    output_method2 = Sim.qubitWiseMultiply(Sim.SX,3,4,output_method2,[]);
    output_method2 = Sim.qubitWiseMultiply(Sim.X,2,4,output_method2,[[0,true]]);
    output_method2 = Sim.qubitWiseMultiply(Sim.X,1,4,output_method2,[[2,true]]);
    output_method2 = Sim.qubitWiseMultiply(Sim.X,3,4,output_method2,[[1,true]]);
    output_method2 = Sim.qubitWiseMultiply(Sim.H,1,4,output_method2,[]);
    if ( verbose ) logLines.push(StringUtil.concatMultiline(
        "Difference found using a better method: ",
        CMatrix.diff(computedOutput,output_method2).transpose().toString()
    ));
    success = CMatrix.approximatelyEqual(computedOutput,output_method2);
    Util.assert( success, "Regression test failed "+'95b90f1b5d_B' );
    allSuccessful &&= success;



    console.log( allSuccessful ? "All regression tests passed." : "At least one regression test failed." );
    return { logLines, allSuccessful };
}
