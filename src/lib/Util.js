import { usingTextbookConvention, defaultDecimalPrecision, precisionForApproximateComparison } from "./constants.js"

export class Util {
    static assert( condition, message ) {
        if ( ! condition ) {
            console.log( "ASSERTION ERROR: " + message );
            console.trace(); // causes line numbers to be printed
        }
    }
    // Let n be a power of 2. This returns the reverse of i in binary, with respect to n.
    // For example, if n===16, the reverse of 1 is 8, the reverse of 2 is 4, the reverse of 3 is 12,
    // and the reverse of 0, 6, 9, and 15 leaves each of those numbers unchanged.
    static reverseEndianness(i,n) {
        Util.assert( 0<=i && i<n && 1<=n, `Util.reverseEndianness(): unexpected condition, i===${i}, n===${n}`);
        let result = 0;
        let bit = 1;
        let reversed_bit = n >> 1;
        while ( bit < n ) {
            if ( i & bit )
                result |= reversed_bit;
            bit <<= 1;
            reversed_bit >>= 1;
        }
        Util.assert( bit === n/*this should happen because n should be a power of 2*/, `Util.reverseEndianness(): unexpected condition, n===${n}`);
        return result;
    }
    // Returns angle in [0,2 pi] of the given point in the cartesian plane measured counterclockwise+ with respect to x+
    static angleIn2D(x,y) {
        let hypotenuse = Math.sqrt(x*x+y*y);
        let angle = 0;
        if ( hypotenuse > 0 ) {
            let sine = y / hypotenuse;
            if ( sine>= 1 ) angle = Math.PI/2;
            else if ( sine<=-1) angle = -Math.PI/2;
            else angle = Math.asin(sine);

            if ( x < 0 ) angle = Math.PI - angle;
            if ( angle < 0 ) angle += 2*Math.PI; // ensures angle is in [0,2*M_PI]
        }
        return angle;
    }
    // returns true if the given numbers are approximately equal, within the given tolerance
    static approximatelyEqual(a,b,tolerance=precisionForApproximateComparison,printMessage=true) {
        Util.assert(typeof(a)==="number" && typeof(b)==="number", "Util.approximatelyEqual(): unknown type");
        let delta = Math.abs( a - b );
        if ( delta > tolerance ) {
            if ( printMessage ) {
                console.log(`Util.approximatelyEqual(): difference of ${delta} found`);
            }
            return false;
        }
        return true;
    }
}