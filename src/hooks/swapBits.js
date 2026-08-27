// From How to Write a Simulator for Quantum Circuits
// from Scratch: A Tutorial by Michael J. McGuffin,
// Jean-Marc Robert and Kazuki Ikeda

// Returns the given number k with its ith and jth bits swapped.
// Bits are numbered from 0 for the lest significant bit.
// Examples swapping first and last of 4 bits:
//      swapBits(14,0,3) returns 7, because 14==1110_2, 7==0111_2
//      swapBits(10,0,3) returns 3, because 10==1010_2, 3==0011_2
// Examples swapping the middle two of 4 bits:
//      swapBits(13,1,2) returns 11, because 13==1101_2, 11==1011_2
//      swapBits(10,1,2) returns 12, because 10==1010_2, 12== 1100_2


function swapBits(k, i, j) {
    if (i == j) return k;
    bit_i = (k >> i) & 1;
    bit_j = (k >> j) & 1;
    if (bit_i != bit_j) {
        mask = (1 << i) | (1 << j);
        k ^= mask; // flip bits i and j
    }
    return k;
}
