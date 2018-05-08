/* eslint-disable quotes, no-console */
/* global console */
import isBrowser from '../utils/is-browser';

const ERR_HEADLESSGL_LOAD = `\
WebGL not available in Node.js, install using "npm install gl".`;

const ERR_HEADLESSGL_NOT_AVAILABLE =
'Failed to create WebGL context in Node.js, headless gl not available';

const ERR_HEADLESSGL_FAILED =
'Failed to create WebGL context in Node.js, headless gl returned null';

export let headlessGL = null;

if ( !isBrowser ) {
    try {
        headlessGL = module.require( 'gl' );
    } catch ( error ) {
        console.error();
        console.error( `${ERR_HEADLESSGL_LOAD}\n${error.message}` );
    }
}

export const isWebglAvailable = isBrowser || headlessGL;

// Create headless gl context (for running under Node.js)
export function createHeadlessContext( { width, height, opts, onError } ) {
    const { webgl1, webgl2 } = opts;
    if ( webgl2 && !webgl1 ) {
        return onError( 'headless-gl does not support WebGL2' );
    }
    if ( !headlessGL ) {
        return onError( ERR_HEADLESSGL_NOT_AVAILABLE );
    }
    const gl = headlessGL( width, height, opts );
    if ( !gl ) {
        return onError( ERR_HEADLESSGL_FAILED );
    }
    return gl;
}
