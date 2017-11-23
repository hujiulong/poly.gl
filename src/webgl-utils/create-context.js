// Create a WebGL context
import assert from '../utils/assert';
/* global HTMLCanvasElement, WebGLRenderingContext */

/**
 * Create a WebGL context for a canvas
 * Note calling this multiple time on the same canvas does return the same context
 */
export function createContext( {
    canvas,
    opts = {}, // WebGLRenderingContext options
    onError = message => null
} ) {
    // See if we can extract any extra information about why context creation failed
    function onContextCreationError( error ) {
        onError( `WebGL context: ${error.statusMessage || 'Unknown error'}` );
    }
    canvas.addEventListener( 'webglcontextcreationerror', onContextCreationError, false );

    const { webgl1 = true, webgl2 = true } = opts;
    let gl = null;
    // Prefer webgl2 over webgl1, prefer conformant over experimental
    if ( webgl2 ) {
        gl = gl || canvas.getContext( 'webgl2', opts );
        gl = gl || canvas.getContext( 'experimental-webgl2', opts );
    }
    if ( webgl1 ) {
        gl = gl || canvas.getContext( 'webgl', opts );
        gl = gl || canvas.getContext( 'experimental-webgl', opts );
    }

    canvas.removeEventListener( 'webglcontextcreationerror', onContextCreationError, false );

    if ( !gl ) {
        return onError( `Failed to create ${webgl2 && !webgl1 ? 'WebGL2' : 'WebGL'} context` );
    }

    return gl;
}

/**
 * Installs a spy on Canvas.getContext
 * calls the provided callback with the {context}
 */
export function trackContextCreation( {
    onContextCreate = () => null,
    onContextCreated = () => {}
} ) {
    assert( onContextCreate || onContextCreated );
    if ( typeof HTMLCanvasElement !== 'undefined' ) {
        const getContext = HTMLCanvasElement.prototype.getContext;
        HTMLCanvasElement.prototype.getContext = function getContextSpy( type, opts ) {
            // Let intercepter create context
            let context;
            if ( type === 'webgl' ) {
                context = onContextCreate( { canvas: this, type, opts, getContext: getContext.bind( this ) } );
            }
            // If not, create context
            context = context || getContext.call( this, type, opts );
            // Report it created
            if ( context instanceof WebGLRenderingContext ) {
                onContextCreated( { canvas: this, context, type, opts } );
            }
            return context;
        };
    }
}
