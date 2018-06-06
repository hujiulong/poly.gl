import getParameterPolyfill from 'poly.gl/webgl-context/polyfill-get-parameter';
import GL from 'poly.gl/constants';

import { fixture } from '../../fixtures';

const WEBGL_PARAMETER_KEYS = [
    // WebGL2 context parameters
    GL.FRAGMENT_SHADER_DERIVATIVE_HINT,
    GL.RASTERIZER_DISCARD,
    GL.SAMPLES,
    // WebGL2 extension context parameters
    GL.GPU_DISJOINT_EXT,
    // Extension fixed values
    GL.UNMASKED_VENDOR_WEBGL,

    GL.UNMASKED_RENDERER_WEBGL,

    // Extension LIMITS
    GL.MAX_TEXTURE_MAX_ANISOTROPY_EXT,

    // WebGL2 Limits
    GL.MAX_3D_TEXTURE_SIZE,
    GL.MAX_ARRAY_TEXTURE_LAYERS,
    GL.MAX_CLIENT_WAIT_TIMEOUT_WEBGL,
    GL.MAX_COLOR_ATTACHMENTS,
    GL.MAX_COMBINED_FRAGMENT_UNIFORM_COMPONENTS,
    GL.MAX_COMBINED_UNIFORM_BLOCKS,
    GL.MAX_COMBINED_VERTEX_UNIFORM_COMPONENTS,
    GL.MAX_DRAW_BUFFERS,
    GL.MAX_ELEMENT_INDEX,
    GL.MAX_ELEMENTS_INDICES,
    GL.MAX_ELEMENTS_VERTICES,
    GL.MAX_FRAGMENT_INPUT_COMPONENTS,
    GL.MAX_FRAGMENT_UNIFORM_BLOCKS,
    GL.MAX_FRAGMENT_UNIFORM_COMPONENTS,
    GL.MAX_SAMPLES,
    GL.MAX_SERVER_WAIT_TIMEOUT,
    GL.MAX_TEXTURE_LOD_BIAS,
    GL.MAX_TRANSFORM_FEEDBACK_INTERLEAVED_COMPONENTS,
    GL.MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS,
    GL.MAX_TRANSFORM_FEEDBACK_SEPARATE_COMPONENTS,
    GL.MAX_UNIFORM_BLOCK_SIZE,
    GL.MAX_UNIFORM_BUFFER_BINDINGS,
    GL.MAX_VARYING_COMPONENTS,
    GL.MAX_VERTEX_OUTPUT_COMPONENTS,
    GL.MAX_VERTEX_UNIFORM_BLOCKS,
    GL.MAX_VERTEX_UNIFORM_COMPONENTS,
    GL.MIN_PROGRAM_TEXEL_OFFSET,
    GL.MAX_PROGRAM_TEXEL_OFFSET,
    GL.UNIFORM_BUFFER_OFFSET_ALIGNMENT
];

it( 'getParameterPolyfill#import', done => {
    assert.ok( typeof getParameterPolyfill === 'function', 'getParameterPolyfill imported OK' );
    done();
} );

it( 'getParameterPolyfill#WebGL1', done => {
    const { gl } = fixture;
    const originalGetParameterFunc = gl.getParameter.bind( gl );
    for ( const pname of WEBGL_PARAMETER_KEYS ) {
        const value = getParameterPolyfill( gl, originalGetParameterFunc, pname );
        assert.ok( typeof value !== undefined, 'Returns valid value' );
    }
    done();
} );

it( 'getParameterPolyfill#WebGL2', done => {
    const { gl2 } = fixture;
    if ( !gl2 ) {
        assert.ok( true, 'WebGL2 not available, skipping tests' );
        done();
        return;
    }
    const originalGetParameterFunc = gl2.getParameter.bind( gl2 );
    for ( const pname of WEBGL_PARAMETER_KEYS ) {
        const value = getParameterPolyfill( gl2, originalGetParameterFunc, pname );
        assert.ok( typeof value !== undefined, 'Returns valid value' );
    }
    done();
} );
