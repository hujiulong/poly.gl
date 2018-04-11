
// import { createTestContext } from 'poly.gl/test/setup';

import { ENUM_STYLE_SETTINGS_SET1_PRIMITIVE } from './data/sample-enum-settings';
import { GL_PARAMETER_DEFAULTS } from 'poly.gl/webgl-utils/set-parameters';

import GL from 'poly.gl/webgl-utils/constants';
import { getKey } from 'poly.gl/webgl-utils/constants-to-keys';

import { setParameters, getParameter, getParameters, resetParameters }
    from 'poly.gl/webgl-utils/set-parameters';
import { Framebuffer } from 'poly.gl';

// Settings test, don't reuse a context
import { fixture } from '../../fixtures';

function stringifyTypedArray( v ) {
    v = ArrayBuffer.isView( v ) ? Array.apply( [], v ) : v;
    return JSON.stringify( v );
}

it( 'WebGL#set and get', done => {
    const { gl } = fixture;
    const values = {
        [ GL.CULL_FACE ]: true
    };
    resetParameters( gl );

    let value = getParameter( gl, GL.CULL_FACE );
    assert.deepEqual( value, false,
        `got expected value ${stringifyTypedArray( value )}` );
    setParameters( gl, values, {} );
    value = getParameter( gl, GL.CULL_FACE );
    assert.deepEqual( value, true,
        `got expected value ${stringifyTypedArray( value )}` );

    done();
} );

it( 'WebGL#composite setter', done => {
    const { gl } = fixture;
    const compositeStateKeys = [
        GL.STENCIL_FUNC,
        GL.STENCIL_REF,
        GL.STENCIL_VALUE_MASK
    ];
    const partialCompositeStateValues = {
        [ GL.STENCIL_FUNC ]: GL.NEVER,
        [ GL.STENCIL_REF ]: 0.5
    };

    resetParameters( gl );

    // Verify default values.
    for ( const key of compositeStateKeys ) {
        const value = getParameter( gl, key );
        assert.deepEqual( value, GL_PARAMETER_DEFAULTS[ key ],
            `got expected default value ${stringifyTypedArray( value )}` );
    }

    // Update only two states out of three.
    setParameters( gl, partialCompositeStateValues, GL_PARAMETER_DEFAULTS );

    let value = getParameter( gl, GL.STENCIL_FUNC );
    assert.deepEqual( value, partialCompositeStateValues[ GL.STENCIL_FUNC ],
        `got expected updated value ${stringifyTypedArray( value )}` );
    value = getParameter( gl, GL.STENCIL_REF );
    assert.deepEqual( value, partialCompositeStateValues[ GL.STENCIL_REF ],
        `got expected updated value ${stringifyTypedArray( value )}` );
    value = getParameter( gl, GL.STENCIL_VALUE_MASK );
    assert.deepEqual( value, GL_PARAMETER_DEFAULTS[ GL.STENCIL_VALUE_MASK ],
        `got expected updated defuault value ${stringifyTypedArray( value )}` );

    done();
} );

it( 'WebGLState#get all parameters', done => {
    const { gl } = fixture;

    resetParameters( gl );

    // Set custom values.
    setParameters( gl, ENUM_STYLE_SETTINGS_SET1_PRIMITIVE, {} );
    for ( const key in ENUM_STYLE_SETTINGS_SET1_PRIMITIVE ) {
        const value = getParameter( gl, key );
        assert.deepEqual( value, ENUM_STYLE_SETTINGS_SET1_PRIMITIVE[ key ],
            `got expected value ${stringifyTypedArray( value )} after setParameters for ${getKey( GL, key )}` );
    }

    const copy = getParameters( gl );
    for ( const key in ENUM_STYLE_SETTINGS_SET1_PRIMITIVE ) {
        const value = copy[ key ];
        assert.deepEqual( value, ENUM_STYLE_SETTINGS_SET1_PRIMITIVE[ key ],
            `got expected value ${stringifyTypedArray( value )} after getParameters for ${getKey( GL, key )}` );
    }

    done();
} );

it( 'WebGL#reset', done => {
    const { gl } = fixture;

    // Set custom values and verify.
    setParameters( gl, ENUM_STYLE_SETTINGS_SET1_PRIMITIVE );
    for ( const key in ENUM_STYLE_SETTINGS_SET1_PRIMITIVE ) {
        const value = getParameter( gl, key );
        assert.deepEqual( value, ENUM_STYLE_SETTINGS_SET1_PRIMITIVE[ key ],
            `got expected value ${stringifyTypedArray( value )} after setParameters for ${getKey( GL, key )}` );
    }

    // reset
    resetParameters( gl );

    // Verify default values.
    for ( const key in ENUM_STYLE_SETTINGS_SET1_PRIMITIVE ) {
        const value = getParameter( gl, key );
        assert.deepEqual( value, GL_PARAMETER_DEFAULTS[ key ],
            `got expected value ${stringifyTypedArray( value )} after resetParameters for ${getKey( GL, key )}` );
    }

    done();
} );

it( 'WebGLState#setParameters framebuffer', done => {
    const { gl } = fixture;

    resetParameters( gl );

    let fbHandle = getParameter( gl, gl.FRAMEBUFFER_BINDING );
    // assert.equal(fbHandle, null, 'Initial frambuffer binding should be null');
    const framebuffer = new Framebuffer( gl );

    setParameters( gl, {
        [ GL.FRAMEBUFFER_BINDING ]: framebuffer.handle
    } );
    fbHandle = getParameter( gl, gl.FRAMEBUFFER_BINDING );
    assert.equal( fbHandle, framebuffer.handle, 'setParameters should set framebuffer binding' );

    // verify setting null value
    setParameters( gl, {
        [ GL.FRAMEBUFFER_BINDING ]: null
    } );
    fbHandle = getParameter( gl, gl.FRAMEBUFFER_BINDING );
    assert.equal( fbHandle, null, 'setParameters should set framebuffer binding' );

    done();
} );

it( 'WebGLState#setParameters read-framebuffer (WebGL2 only)', done => {
    const { gl2 } = fixture;
    // const gl2 = createTestContext({webgl2: true, webgl1: false});
    if ( gl2 ) {
        resetParameters( gl2 );

        let fbHandle = getParameter( gl2, gl2.READ_FRAMEBUFFER_BINDING );
        // assert.equal(fbHandle, null, 'Initial read-frambuffer binding should be null');
        const framebuffer = new Framebuffer( gl2 );

        setParameters( gl2, {
            [ GL.READ_FRAMEBUFFER_BINDING ]: framebuffer.handle
        } );
        fbHandle = getParameter( gl2, gl2.READ_FRAMEBUFFER_BINDING );
        assert.equal( fbHandle, framebuffer.handle, 'setParameters should set read-framebuffer binding' );

        // verify setting null value
        setParameters( gl2, {
            [ GL.READ_FRAMEBUFFER_BINDING ]: null
        } );
        fbHandle = getParameter( gl2, gl2.READ_FRAMEBUFFER_BINDING );
        assert.equal( fbHandle, null, 'setParameters should set read-framebuffer binding' );
    } else {
        assert.ok( true, 'WebGL2 not available, skipping tests' );
    }
    done();
} );
