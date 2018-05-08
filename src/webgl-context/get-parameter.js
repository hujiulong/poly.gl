// A major polyfill of "gl.getParameter"
// Attempts to return sane values for all known WebGL2 and extension constants
/* eslint-disable camelcase */
import GL from '../constants';

// Return true if WebGL2 context
function isWebGL2( gl ) {
    const GL_TEXTURE_BINDING_3D = 0x806A;
    return gl && gl.TEXTURE_BINDING_3D === GL_TEXTURE_BINDING_3D;
}

const WEBGL_debug_renderer_info = 'WEBGL_debug_renderer_info';
const EXT_disjoint_timer_query = 'EXT_disjoint_timer_query';
const EXT_disjoint_timer_query_webgl2 = 'EXT_disjoint_timer_query_webgl2';
const EXT_texture_filter_anisotropic = 'EXT_texture_filter_anisotropic';

export function getParameter( gl, originalFunc, pname ) {
    const GL_UNMASKED_VENDOR_WEBGL = 0x9245; // vendor string of the graphics driver.
    const GL_UNMASKED_RENDERER_WEBGL = 0x9246; // renderer string of the graphics driver.

    const GL_MAX_TEXTURE_MAX_ANISOTROPY_EXT = 0x84FF;

    const GL_FRAGMENT_SHADER_DERIVATIVE_HINT = 0x8B8B;
    const GL_DONT_CARE = 0x1100;
    const GL_GPU_DISJOINT_EXT = 0x8FBB;

    const { extensions } = gl.poly;

    const info = gl.getExtension( WEBGL_debug_renderer_info );

    switch ( pname ) {
        // EXTENSIONS SOMETIMES DO NOT USE THE OFFICIAL CONSTANTS.
        case GL_UNMASKED_VENDOR_WEBGL:
            return originalFunc( ( info && info.UNMASKED_VENDOR_WEBGL ) || GL.VENDOR );
        case GL_UNMASKED_RENDERER_WEBGL:
            return originalFunc( ( info && info.UNMASKED_RENDERER_WEBGL ) || GL.RENDERER );

        case GL_FRAGMENT_SHADER_DERIVATIVE_HINT:
            return !isWebGL2( gl ) ? GL_DONT_CARE : undefined;

        case GL_GPU_DISJOINT_EXT:
            const hasTimerQueries =
      !extensions[ EXT_disjoint_timer_query ] && !extensions[ EXT_disjoint_timer_query_webgl2 ];
            return hasTimerQueries ? 0 : undefined;

        case GL_MAX_TEXTURE_MAX_ANISOTROPY_EXT:
            const ext = gl.poly.extensions[ EXT_texture_filter_anisotropic ];
            pname = ext && ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT;
            return !pname ? 1.0 : undefined;

        default:
            return undefined;
    }
}
