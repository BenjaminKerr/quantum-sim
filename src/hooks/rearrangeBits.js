// From How to Write a Simulator for Quantum Circuits
// from Scratch: A Tutorial by Michael J. McGuffin,
// Jean-Marc Robert and Kazuki Ikeda

// Returns the given number i with its bits rearranged
// so that the kth bit of i is returned in position a[k]. Examples:
//      rearrangeBits(i,[1,0]) returns the two least-significant bits of i,
//          swapped, and none of the other bits.
//      rearrangeBits(i,[0,1,2]) returns only the three least-significant bits of i,
//          with their positions unchanged.
//      rearrangeBits(i,[3,0,1,2]) returns only the four least-significant bits of i,
//          shifted left (to one position more significant) and wrapped around.


function rearrangeBits(i, a /* an array of new positions */) {
    returnValue = 0;
    for (position = 0; position < a.length; position++) {
        if (a[position] >= 0)
            returnValue |= ((i >> position) & 1) << a[position];
    }
    return returnValue;
}
