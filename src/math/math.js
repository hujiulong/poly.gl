export const DEG2RAD = Math.PI / 180;
export const RAD2DEG = 180 / Math.PI;

export function clamp( value, min, max ) {

    return Math.max( min, Math.min( max, value ) );

}

export function lerp( x, y, t ) {

    return ( 1 - t ) * x + t * y;

}

export function degToRad( degrees ) {

    return degrees * DEG2RAD;

}

export function radToDeg( radians ) {

    return radians * RAD2DEG;

}

export function isPowerOfTwo( value ) {

    return ( value & ( value - 1 ) ) === 0 && value !== 0;

}

export function ceilPowerOfTwo( value ) {

    return Math.pow( 2, Math.ceil( Math.log( value ) / Math.LN2 ) );

}

export function floorPowerOfTwo( value ) {

    return Math.pow( 2, Math.floor( Math.log( value ) / Math.LN2 ) );

}
