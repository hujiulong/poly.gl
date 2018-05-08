import { WebGLRenderingContext, WebGL2RenderingContext } from '../webgl-utils';
import assert from '../utils/assert';

// Heuristic testing of contexts (to indentify debug wrappers around gl contexts)
const GL_ARRAY_BUFFER = 0x8892;
const GL_TEXTURE_BINDING_3D = 0x806A;

export const ERR_CONTEXT = 'Invalid WebGLRenderingContext';
export const ERR_WEBGL = ERR_CONTEXT;
export const ERR_WEBGL2 = 'Requires WebGL2';

export function isWebGL( gl ) {
    return Boolean( gl && (
        gl instanceof WebGLRenderingContext ||
    gl.ARRAY_BUFFER === GL_ARRAY_BUFFER
    ) );
}

export function isWebGL2( gl ) {
    return Boolean( gl && (
        gl instanceof WebGL2RenderingContext ||
    gl.TEXTURE_BINDING_3D === GL_TEXTURE_BINDING_3D
    ) );
}

export function assertWebGLContext( gl ) {
    // Need to handle debug context
    assert( isWebGL( gl ), ERR_CONTEXT );
}

export function assertWebGL2Context( gl ) {
    // Need to handle debug context
    assert( isWebGL2( gl ), ERR_WEBGL2 );
}

