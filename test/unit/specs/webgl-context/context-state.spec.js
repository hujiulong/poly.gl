/* eslint max-depth: ["error", 4] */

import { GL } from 'poly.gl';
import { getParameter, getParameters, setParameters, withParameters, resetParameters, Framebuffer } from 'poly.gl';
import { getKey } from 'poly.gl/webgl-utils/constants-to-keys';

import { GL_PARAMETER_DEFAULTS as GL_PARAMETERS } from 'poly.gl/webgl-context/set-parameters';
import { ENUM_STYLE_SETTINGS_SET1 } from './data/sample-enum-settings';
import { FUNCTION_STYLE_SETTINGS_SET1 } from './data/sample-function-settings';

function stringifyTypedArray( v ) {
    v = ArrayBuffer.isView( v ) ? Array.apply( [], v ) : v;
    return JSON.stringify( v );
}
//
// import { createTestContext } from 'poly.gl/test/setup';
// const fixture = {
//     gl: createTestContext(),
//     gl2: createTestContext( { webgl2: true, webgl1: false } )
// };

import { fixture } from '../../fixtures';

it( 'WebGL#state', done => {
    assert.ok( getParameter, 'getParameter imported ok' );
    assert.ok( getParameters, 'getParameters imported ok' );
    assert.ok( setParameters, 'setParameters imported ok' );
    assert.ok( withParameters, 'withParameters imported ok' );
    assert.ok( resetParameters, 'resetParameters imported ok' );
    assert.ok( GL_PARAMETERS, 'TEST_EXPORTS ok' );
    done();
} );

it( 'WebGLState#getParameter', done => {
    const { gl } = fixture;

    resetParameters( gl );

    for ( const setting in GL_PARAMETERS ) {
        const value = getParameter( gl, setting );
        assert.ok( value !== undefined,
            `${setting}: got a value ${stringifyTypedArray( value )}` );
    }
    done();
} );

it( 'WebGLState#getParameter (WebGL2)', done => {
    const { gl2 } = fixture;
    if ( gl2 ) {

        resetParameters( gl2 );

        for ( const setting in GL_PARAMETERS ) {
            const value = getParameter( gl2, setting );
            assert.ok( value !== undefined,
                `${getKey( GL, setting )}: got a value ${stringifyTypedArray( value )}` );
        }
    }
    done();
} );

it( 'WebGLState#setParameters (Mixing enum and function style keys)', done => {
    const { gl } = fixture;

    resetParameters( gl );

    setParameters( gl, FUNCTION_STYLE_SETTINGS_SET1 );

    for ( const key in ENUM_STYLE_SETTINGS_SET1 ) {
        const value = getParameter( gl, key );
        assert.deepEqual( value, ENUM_STYLE_SETTINGS_SET1[ key ],
            `got expected value ${stringifyTypedArray( value )} for key: ${getKey( GL, key )}` );
    }
    done();
} );

it( 'WebGLState#setParameters (Argument expansion for ***SeperateFunc setters))', done => {
    const { gl } = fixture;
    const parameters = {
        blendFunc: [ GL.SRC_ALPHA, GL.ONE ],
        stencilFunc: [ GL.LEQUAL, 0.5, 0xBBBBBBBB ],
        stencilOp: [ GL.REPLACE, GL.INCR, GL.DECR ]
    };
    const expectedValues = {
    // blendFunc
        [ GL.BLEND_SRC_RGB ]: GL.SRC_ALPHA,
        [ GL.BLEND_DST_RGB ]: GL.ONE,
        [ GL.BLEND_SRC_ALPHA ]: GL.SRC_ALPHA,
        [ GL.BLEND_DST_ALPHA ]: GL.ONE,
        // stencilFunc
        [ GL.STENCIL_FUNC ]: GL.LEQUAL,
        [ GL.STENCIL_REF ]: 0.5,
        [ GL.STENCIL_VALUE_MASK ]: 0xBBBBBBBB,
        [ GL.STENCIL_BACK_FUNC ]: GL.LEQUAL,
        [ GL.STENCIL_BACK_REF ]: 0.5,
        [ GL.STENCIL_BACK_VALUE_MASK ]: 0xBBBBBBBB,
        // stencilOp
        [ GL.STENCIL_FAIL ]: GL.REPLACE,
        [ GL.STENCIL_PASS_DEPTH_FAIL ]: GL.INCR,
        [ GL.STENCIL_PASS_DEPTH_PASS ]: GL.DECR,
        [ GL.STENCIL_BACK_FAIL ]: GL.REPLACE,
        [ GL.STENCIL_BACK_PASS_DEPTH_FAIL ]: GL.INCR,
        [ GL.STENCIL_BACK_PASS_DEPTH_PASS ]: GL.DECR
    };

    resetParameters( gl );

    setParameters( gl, parameters );

    for ( const key in expectedValues ) {
        const value = getParameter( gl, key );
        assert.deepEqual( value, expectedValues[ key ],
            `got expected value ${stringifyTypedArray( value )} for key: ${getKey( GL, key )}` );
    }
    done();
} );

it( 'WebGLState#withParameters', done => {
    const { gl } = fixture;

    resetParameters( gl );

    setParameters( gl, {
        clearColor: [ 0, 0, 0, 0 ],
        [ GL.BLEND ]: false
    } );

    let clearColor = getParameter( gl, GL.COLOR_CLEAR_VALUE );
    let blendState = getParameter( gl, GL.BLEND );
    assert.deepEqual( clearColor, [ 0, 0, 0, 0 ],
        `got expected value ${stringifyTypedArray( clearColor )}` );
    assert.deepEqual( blendState, false,
        `got expected value ${stringifyTypedArray( blendState )}` );

    withParameters( gl, {
        clearColor: [ 0, 1, 0, 1 ],
        [ GL.BLEND ]: true
    }, () => {
        clearColor = getParameter( gl, GL.COLOR_CLEAR_VALUE );
        blendState = getParameter( gl, GL.BLEND );
        assert.deepEqual( clearColor, [ 0, 1, 0, 1 ],
            `got expected value ${stringifyTypedArray( clearColor )}` );
        assert.deepEqual( blendState, true,
            `got expected value ${stringifyTypedArray( blendState )}` );
    } );

    clearColor = getParameter( gl, GL.COLOR_CLEAR_VALUE );
    blendState = getParameter( gl, GL.BLEND );
    assert.deepEqual( clearColor, [ 0, 0, 0, 0 ],
        `got expected value ${stringifyTypedArray( clearColor )}` );
    assert.deepEqual( blendState, false,
        `got expected value ${stringifyTypedArray( blendState )}` );

    done();
} );

it( 'WebGLState#withParameters: recursive', done => {
    const { gl } = fixture;

    resetParameters( gl );

    setParameters( gl, {
        clearColor: [ 0, 0, 0, 0 ],
        [ GL.BLEND ]: false,
        blendFunc: [ GL.ONE_MINUS_SRC_ALPHA, GL.ZERO, GL.CONSTANT_ALPHA, GL.ZERO ],
        blendEquation: GL.FUNC_ADD
    } );

    let clearColor = getParameter( gl, GL.COLOR_CLEAR_VALUE );
    let blendState = getParameter( gl, GL.BLEND );
    let blendFuncSrcRGB = getParameter( gl, GL.BLEND_SRC_RGB );
    let blendEquation = getParameter( gl, GL.BLEND_EQUATION_RGB );
    assert.deepEqual( clearColor, [ 0, 0, 0, 0 ],
        `got expected value ${stringifyTypedArray( clearColor )}` );
    assert.deepEqual( blendState, false,
        `got expected value ${stringifyTypedArray( blendState )}` );
    assert.deepEqual( blendFuncSrcRGB, GL.ONE_MINUS_SRC_ALPHA,
        `got expected value ${stringifyTypedArray( blendFuncSrcRGB )}` );
    assert.deepEqual( blendEquation, GL.FUNC_ADD,
        `got expected value ${stringifyTypedArray( blendEquation )}` );
    withParameters( gl, {
        clearColor: [ 0, 1, 0, 1 ],
        [ GL.BLEND ]: true
    }, () => {
        clearColor = getParameter( gl, GL.COLOR_CLEAR_VALUE );
        blendState = getParameter( gl, GL.BLEND );
        blendFuncSrcRGB = getParameter( gl, GL.BLEND_SRC_RGB );
        blendEquation = getParameter( gl, GL.BLEND_EQUATION_RGB );
        // Verify changed state
        assert.deepEqual( clearColor, [ 0, 1, 0, 1 ],
            `got expected value ${stringifyTypedArray( clearColor )}` );
        assert.deepEqual( blendState, true,
            `got expected value ${stringifyTypedArray( blendState )}` );
        // Verify un-changed state
        assert.deepEqual( blendFuncSrcRGB, GL.ONE_MINUS_SRC_ALPHA,
            `got expected un changed value ${stringifyTypedArray( blendFuncSrcRGB )}` );
        assert.deepEqual( blendEquation, GL.FUNC_ADD,
            `got expected un changed value ${stringifyTypedArray( blendEquation )}` );

        withParameters( gl, {
            blendFunc: [ GL.ZERO, GL.ZERO, GL.CONSTANT_ALPHA, GL.ZERO ],
            blendEquation: GL.FUNC_SUBTRACT
        }, () => {
            clearColor = getParameter( gl, GL.COLOR_CLEAR_VALUE );
            blendState = getParameter( gl, GL.BLEND );
            blendFuncSrcRGB = getParameter( gl, GL.BLEND_SRC_RGB );
            blendEquation = getParameter( gl, GL.BLEND_EQUATION_RGB );
            // Verify un-changed state
            assert.deepEqual( clearColor, [ 0, 1, 0, 1 ],
                `got expected value ${stringifyTypedArray( clearColor )}` );
            assert.deepEqual( blendState, true,
                `got expected value ${stringifyTypedArray( blendState )}` );
            // Verify changed state
            assert.deepEqual( blendFuncSrcRGB, GL.ZERO,
                `got expected changed value ${stringifyTypedArray( blendFuncSrcRGB )}` );
            assert.deepEqual( blendEquation, GL.FUNC_SUBTRACT,
                `got expected changed value ${stringifyTypedArray( blendEquation )}` );
        } );

        blendFuncSrcRGB = getParameter( gl, GL.BLEND_SRC_RGB );
        blendEquation = getParameter( gl, GL.BLEND_EQUATION_RGB );
        assert.deepEqual( blendFuncSrcRGB, GL.ONE_MINUS_SRC_ALPHA,
            `got expected value ${stringifyTypedArray( blendFuncSrcRGB )}` );
        assert.deepEqual( blendEquation, GL.FUNC_ADD,
            `got expected value ${stringifyTypedArray( blendEquation )}` );
    } );

    clearColor = getParameter( gl, GL.COLOR_CLEAR_VALUE );
    blendState = getParameter( gl, GL.BLEND );
    blendFuncSrcRGB = getParameter( gl, GL.BLEND_SRC_RGB );
    blendEquation = getParameter( gl, GL.BLEND_EQUATION_RGB );
    assert.deepEqual( clearColor, [ 0, 0, 0, 0 ],
        `got expected value ${stringifyTypedArray( clearColor )}` );
    assert.deepEqual( blendState, false,
        `got expected value ${stringifyTypedArray( blendState )}` );
    assert.deepEqual( blendFuncSrcRGB, GL.ONE_MINUS_SRC_ALPHA,
        `got expected initial value ${stringifyTypedArray( blendFuncSrcRGB )}` );
    assert.deepEqual( blendEquation, GL.FUNC_ADD,
        `got expected initial value ${stringifyTypedArray( blendEquation )}` );

    done();
} );

// EXT_blend_minmax
it( 'WebGLState#BlendEquationMinMax', done => {
    // TODO: For WebGL1 this test passing could be false positive.
    // Verify if state set is scuccessful, we could be just returning the value from cache.

    const { gl, gl2 } = fixture;
    const contexts = {
        'WebGL1 Context': gl,
        'WebGL2 Context': gl2
    };
    const parametersArray = [
        {
            [ GL.BLEND_EQUATION_RGB ]: GL.MAX,
            [ GL.BLEND_EQUATION_ALPHA ]: GL.MIN
        },
        {
            blendEquation: GL.MAX
        }
    ];
    const expectedArray = [
        {
            [ GL.BLEND_EQUATION_RGB ]: GL.MAX,
            [ GL.BLEND_EQUATION_ALPHA ]: GL.MIN
        },
        {
            [ GL.BLEND_EQUATION_RGB ]: GL.MAX,
            [ GL.BLEND_EQUATION_ALPHA ]: GL.MAX
        }
    ];

    for ( const contextName in contexts ) {
        const context = contexts[ contextName ];
        if ( context ) {
            resetParameters( context );

            for ( const index in parametersArray ) {
                const parameters = parametersArray[ index ];
                const expected = expectedArray[ index ];

                setParameters( context, parameters );

                for ( const state in expected ) {
                    const value = getParameter( context, state );
                    assert.equal( value, expected[ state ],
                        `${contextName} : expected value, ${getKey( GL, value )} received for ${getKey( GL, state )}` );
                }
            }
        } else {
            assert.ok( true, `${contextName} not available, skipping tests` );
        }
    }
    done();
} );

it( 'WebGLState#bindFramebuffer (WebGL1)', done => {
    const { gl } = fixture;
    const framebuffer = new Framebuffer( gl );
    let fbHandle;

    resetParameters( gl );

    fbHandle = getParameter( gl, gl.FRAMEBUFFER_BINDING );
    assert.equal( fbHandle, null, 'Initial draw frambuffer binding should be null' );

    setParameters( gl, {
        framebuffer
    } );

    fbHandle = getParameter( gl, gl.FRAMEBUFFER_BINDING );
    assert.equal( fbHandle, framebuffer.handle, 'setParameters should set framebuffer binding' );

    done();
} );

it( 'WebGLState#bindFramebuffer (WebGL2)', done => {
    const { gl2 } = fixture;
    if ( gl2 ) {
        const framebuffer = new Framebuffer( gl2 );
        const framebufferTwo = new Framebuffer( gl2 );
        const framebufferThree = new Framebuffer( gl2 );
        let fbHandle;

        resetParameters( gl2 );

        setParameters( gl2, {
            framebuffer: framebuffer.handle
        } );

        fbHandle = getParameter( gl2, gl2.DRAW_FRAMEBUFFER_BINDING );
        // NOTE: DRAW_FRAMEBUFFER_BINDING and FRAMEBUFFER_BINDING are same enums
        assert.equal( fbHandle, framebuffer.handle, 'FRAMEBUFFER binding should set DRAW_FRAMEBUFFER_BINDING' );
        fbHandle = getParameter( gl2, gl2.READ_FRAMEBUFFER_BINDING );
        assert.equal( fbHandle, framebuffer.handle, 'FRAMEBUFFER binding should also set READ_FRAMEBUFFER_BINDING' );

        gl2.bindFramebuffer( gl2.DRAW_FRAMEBUFFER, framebufferTwo.handle );
        fbHandle = getParameter( gl2, gl2.DRAW_FRAMEBUFFER_BINDING );
        assert.equal( fbHandle, framebufferTwo.handle, 'DRAW_FRAMEBUFFER binding should set DRAW_FRAMEBUFFER_BINDING' );
        fbHandle = getParameter( gl2, gl2.READ_FRAMEBUFFER_BINDING );
        assert.equal( fbHandle, framebuffer.handle, 'DRAW_FRAMEBUFFER binding should NOT set READ_FRAMEBUFFER_BINDING' );

        gl2.bindFramebuffer( gl2.READ_FRAMEBUFFER, framebufferThree.handle );
        fbHandle = getParameter( gl2, gl2.DRAW_FRAMEBUFFER_BINDING );
        assert.equal( fbHandle, framebufferTwo.handle, 'READ_FRAMEBUFFER binding should NOT set DRAW_FRAMEBUFFER_BINDING' );
        fbHandle = getParameter( gl2, gl2.READ_FRAMEBUFFER_BINDING );
        assert.equal( fbHandle, framebufferThree.handle, 'READ_FRAMEBUFFER binding should set READ_FRAMEBUFFER_BINDING' );

    } else {
        assert.ok( true, 'WebGL2 not available, skipping tests' );
    }
    done();
} );

it( 'WebGLState#withParameters framebuffer', done => {
    const { gl } = fixture;
    const framebufferOne = new Framebuffer( gl );
    const framebufferTwo = new Framebuffer( gl );

    resetParameters( gl );

    let fbHandle;
    fbHandle = getParameter( gl, gl.FRAMEBUFFER_BINDING );
    assert.equal( fbHandle, null, 'Initial draw frambuffer binding should be null' );

    withParameters( gl, { framebuffer: framebufferOne }, () => {
        fbHandle = getParameter( gl, gl.FRAMEBUFFER_BINDING );
        assert.deepEqual( fbHandle, framebufferOne.handle, 'withParameters should bind framebuffer' );

        withParameters( gl, { framebuffer: framebufferTwo }, () => {
            fbHandle = getParameter( gl, gl.FRAMEBUFFER_BINDING );
            assert.deepEqual( fbHandle, framebufferTwo.handle, 'Inner withParameters should bind framebuffer' );
        } );

        fbHandle = getParameter( gl, gl.FRAMEBUFFER_BINDING );
        assert.deepEqual( fbHandle, framebufferOne.handle, 'Inner withParameters should restore draw framebuffer binding' );
    } );
    fbHandle = getParameter( gl, gl.FRAMEBUFFER_BINDING );
    assert.deepEqual( fbHandle, null, 'withParameters should restore framebuffer bidning' );

    done();
} );

it( 'WebGLState#withParameters empty parameters object', done => {
    const { gl } = fixture;

    resetParameters( gl );

    setParameters( gl, {
        clearColor: [ 0, 0, 0, 0 ],
        [ GL.BLEND ]: false
    } );

    let clearColor = getParameter( gl, GL.COLOR_CLEAR_VALUE );
    let blendState = getParameter( gl, GL.BLEND );
    assert.deepEqual( clearColor, [ 0, 0, 0, 0 ],
        `got expected value ${stringifyTypedArray( clearColor )}` );
    assert.deepEqual( blendState, false,
        `got expected value ${stringifyTypedArray( blendState )}` );

    withParameters( gl, {}, () => {
        clearColor = getParameter( gl, GL.COLOR_CLEAR_VALUE );
        blendState = getParameter( gl, GL.BLEND );
        assert.deepEqual( clearColor, [ 0, 0, 0, 0 ],
            `got expected value ${stringifyTypedArray( clearColor )}` );
        assert.deepEqual( blendState, false,
            `got expected value ${stringifyTypedArray( blendState )}` );
    } );

    clearColor = getParameter( gl, GL.COLOR_CLEAR_VALUE );
    blendState = getParameter( gl, GL.BLEND );
    assert.deepEqual( clearColor, [ 0, 0, 0, 0 ],
        `got expected value ${stringifyTypedArray( clearColor )}` );
    assert.deepEqual( blendState, false,
        `got expected value ${stringifyTypedArray( blendState )}` );

    done();
} );
