// Stores a complex number, with real and imaginary components.

import { usingTextbookConvention, defaultDecimalPrecision, precisionForApproximateComparison } from "./constants.js"
import {StringUtil} from "./StringUtil.js"

export class Complex {
    constructor( re = 0, im = 0 ) {
        this._r = re;
        this._i = im;
    }
    toString( decimalPrecision = defaultDecimalPrecision ) {
        if ( this._r === 0 ) {
            if ( this._i === 0 ) {
               return "0";
            }
            else {
               return StringUtil.numToString(this._i,decimalPrecision) + "i";
            }
        }
        else {
            if ( this._i === 0 ) {
               return StringUtil.numToString(this._r,decimalPrecision);
            }
            else {
               let rs = StringUtil.numToString(this._r,decimalPrecision);
               let is = StringUtil.numToString(this._i,decimalPrecision) + "i";
               return is[0]==='-' ? ( rs+is ) : ( rs + "+" + is );
            }
        }
    }
    // returns a deep copy of the complex number
    copy() {
        return new Complex( this._r, this._i );
    }
    negate() {
        return new Complex( - this._r, - this._i );
    }
    conjugate() {
        return new Complex( this._r, - this._i );
    }
    mag() { // magnitude, also known as absolute value or modulus
        return Math.sqrt( this._r * this._r + this._i * this._i );
    }
    magSquared() { // magnitude squared
        return this._r * this._r + this._i * this._i;
    }
    arg() { // argument, also called phase, i.e. the angle of the complex number; always in [0,2 pi]
        return Util.angleIn2D( this._r, this._i );
    }


    // Returns the sum of the two given complex numbers.
    static sum(c1,c2) {
        return new Complex( c1._r+c2._r, c1._i+c2._i );
    }
    // Returns the difference of the two given complex numbers.
    static diff(c1,c2) {
        return new Complex( c1._r-c2._r, c1._i-c2._i );
    }
    // Returns the product of the two given numbers.
    static mult(c1,c2) {
        if ( c1 instanceof Complex ) {
            if ( c2 instanceof Complex ) {
                return new Complex( c1._r*c2._r - c1._i*c2._i, c1._r*c2._i + c1._i*c2._r );
            }
            return new Complex( c1._r * c2, c1._i * c2 );
        }
        else if ( c2 instanceof Complex ) {
            return new Complex( c1 * c2._r, c1 * c2._i );
        }
        return c1 * c2;
    }
    // returns true if the given numbers are approximately equal, within the given tolerance
    static approximatelyEqual(a,b,tolerance=precisionForApproximateComparison,printMessage=true) {
        Util.assert(a instanceof Complex && b instanceof Complex, "Complex.approximatelyEqual(): unknown type");
        let delta = Complex.diff(a,b).mag();
        if ( delta > tolerance ) {
            if ( printMessage ) {
                console.log(`Complex.approximatelyEqual(): difference of ${delta} found`);
            }
            return false;
        }
        return true;
    }
}