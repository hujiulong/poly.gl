// Avoid generating a lot of big context divs
import {
    setContextDefaults,
    createGLContext
} from 'poly.gl';
import {
    makeDebugContext
} from './debug-context'

setContextDefaults( {
    width: 1,
    height: 1,
    debug: true,
    throwOnFailure: false,
    throwOnError: false
} );

export function createTestContext( opts = {} ) {
    return createGLContext( opts );
    // return makeDebugContext( createGLContext( opts ) );
}

export const fixture = {
    gl: createTestContext( {
        webgl2: false,
        webgl1: true,
        throwOnFailure: true,
        throwOnError: true
    } ),
    gl2: createTestContext( {
        webgl2: true,
        webgl1: false
    } )
};
