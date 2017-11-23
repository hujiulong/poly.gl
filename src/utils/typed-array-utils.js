// GL Constants
const GL_BYTE = 0x1400;
const GL_UNSIGNED_BYTE = 0x1401;
const GL_SHORT = 0x1402;
const GL_UNSIGNED_SHORT = 0x1403;
const GL_INT = 0x1404;
const GL_UNSIGNED_INT = 0x1405;
const GL_FLOAT = 0x1406;
const GL_UNSIGNED_SHORT_4_4_4_4 = 0x8033;
const GL_UNSIGNED_SHORT_5_5_5_1 = 0x8034;
const GL_UNSIGNED_SHORT_5_6_5 = 0x8363;

const ERR_TYPE_DEDUCTION = 'Failed to deduce GL constant from typed array';

// Converts TYPED ARRAYS to corresponding GL constant
// Used to auto deduce gl parameter types
export function getGLTypeFromTypedArray( arrayOrType ) {
    // If typed array, look up constructor
    const type = ArrayBuffer.isView( arrayOrType ) ? arrayOrType.constructor : arrayOrType;
    switch ( type ) {
        case Float32Array: return GL_FLOAT;
        case Uint16Array: return GL_UNSIGNED_SHORT;
        case Uint32Array: return GL_UNSIGNED_INT;
        case Uint8Array: return GL_UNSIGNED_BYTE;
        case Uint8ClampedArray: return GL_UNSIGNED_BYTE;
        case Int8Array: return GL_BYTE;
        case Int16Array: return GL_SHORT;
        case Int32Array: return GL_INT;
        default:
            throw new Error( ERR_TYPE_DEDUCTION );
    }
}

// Converts GL constant to corresponding TYPED ARRAY
// Used to auto deduce gl parameter types

/* eslint-disable complexity */
export function getTypedArrayFromGLType( glType, { clamped = true } = {} ) {
    // Sorted in some order of likelihood to reduce amount of comparisons
    switch ( glType ) {
        case GL_FLOAT:
            return Float32Array;
        case GL_UNSIGNED_SHORT:
        case GL_UNSIGNED_SHORT_5_6_5:
        case GL_UNSIGNED_SHORT_4_4_4_4:
        case GL_UNSIGNED_SHORT_5_5_5_1:
            return Uint16Array;
        case GL_UNSIGNED_INT:
            return Uint32Array;
        case GL_UNSIGNED_BYTE:
            return clamped ? Uint8ClampedArray : Uint8Array;
        case GL_BYTE:
            return Int8Array;
        case GL_SHORT:
            return Int16Array;
        case GL_INT:
            return Int32Array;
        default:
            throw new Error( 'Failed to deduce typed array type from GL constant' );
    }
}
/* eslint-enable complexity */

// Flip rows (can be used on arrays returned from `Framebuffer.readPixels`)
// https://stackoverflow.com/questions/41969562/
// how-can-i-flip-the-result-of-webglrenderingcontext-readpixels
export function flipRows( { data, width, height, bytesPerPixel = 4, temp } ) {
    const bytesPerRow = width * bytesPerPixel;

    // make a temp buffer to hold one row
    temp = temp || new Uint8Array( bytesPerRow );
    for ( let y = 0; y < height / 2; ++y ) {
        const topOffset = y * bytesPerRow;
        const bottomOffset = ( height - y - 1 ) * bytesPerRow;
        // make copy of a row on the top half
        temp.set( data.subarray( topOffset, topOffset + bytesPerRow ) );
        // copy a row from the bottom half to the top
        data.copyWithin( topOffset, bottomOffset, bottomOffset + bytesPerRow );
        // copy the copy of the top half row to the bottom half
        data.set( temp, bottomOffset );
    }
}

export function scalePixels( { data, width, height } ) {
    const newWidth = Math.round( width / 2 );
    const newHeight = Math.round( height / 2 );
    const newData = new Uint8Array( newWidth * newHeight * 4 );
    for ( let y = 0; y < newHeight; y++ ) {
        for ( let x = 0; x < newWidth; x++ ) {
            for ( let c = 0; c < 4; c++ ) {
                newData[ ( y * newWidth + x ) * 4 + c ] = data[ ( y * 2 * width + x * 2 ) * 4 + c ];
            }
        }
    }
    return { data: newData, width: newWidth, height: newHeight };
}
