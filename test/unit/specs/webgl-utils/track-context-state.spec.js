
// import { createTestContext } from 'poly.gl/test/setup';

import trackContextState, { pushContextState, popContextState, deepEqual } // clone,
    from 'poly.gl/webgl-utils/track-context-state';

import { getParameter, setParameters, resetParameters, GL_PARAMETER_DEFAULTS, GL_PARAMETER_SETTERS }
    from 'poly.gl/webgl-utils/set-parameters';

import { ENUM_STYLE_SETTINGS_SET1, ENUM_STYLE_SETTINGS_SET2 } from './data/sample-enum-settings';

// utils
function stringifyTypedArray( v ) {
    v = ArrayBuffer.isView( v ) ? Array.apply( [], v ) : v;
    return JSON.stringify( v );
}

// Settings test, don't reuse a context
// const fixture = {
//     gl: createTestContext( { debug: true } )
// };

import { fixture } from '../../fixtures';

it( 'WebGLState#imports', done => {
    assert.ok( typeof trackContextState === 'function', 'trackContextState imported OK' );
    assert.ok( typeof pushContextState === 'function', 'trackContextState imported OK' );
    assert.ok( typeof popContextState === 'function', 'trackContextState imported OK' );
    done();
} );

it( 'WebGLState#deepEqual', done => {
    const TEST_CASES = [
        { title: 'null', x: null, y: null, result: true },
        { title: 'number', x: null, y: null, result: true },
        { title: 'shallow-equal array 1', x: null, y: null, result: true },
        { title: 'deep-equal array', x: null, y: null, result: true },
        { title: 'deep-equal array/typed array', x: null, y: null, result: true },
        { title: 'different arrays', x: null, y: null, result: true }
    ];

    for ( const tc of TEST_CASES ) {
        assert.equal( deepEqual( tc.x, tc.y ), tc.result, tc.title );
    }
    done();
} );

// test('WebGLState#clone', done => {
//   const TEST_CASES = [
//     {title: 'null', x: null, y: null, result: true}
//     {title: 'number', x: null, y: null, result: true}
//     {title: 'shallow-equal array 1', x: null, y: null, result: true}
//     {title: 'deep-equal array', x: null, y: null, result: true}
//     {title: 'deep-equal array/typed array', x: null, y: null, result: true}
//     {title: 'different arrays', x: null, y: null, result: true}
//   ];

//   for (const tc of TEST_CASES) {
//     assert.equal(deepEqual(tc.x, tc.y) tc.result, tc.title);
//   }
//   done();
// });

it( 'WebGLState#trackContextState', done => {
    const { gl } = fixture;
    assert.doesNotThrow(
        () => trackContextState( gl, { copyState: false } ),
        'trackContextState call succeeded'
    );
    done();
} );

it( 'WebGLState#push & pop', done => {
    const { gl } = fixture;

    resetParameters( gl );

    // Verify default values.
    for ( const key in GL_PARAMETER_DEFAULTS ) {
        const value = getParameter( gl, key );
        assert.deepEqual( value, GL_PARAMETER_DEFAULTS[ key ],
            `default: got expected value ${stringifyTypedArray( value )} for key: ${key}` );
    }

    pushContextState( gl );

    // Set custom values and verify.
    setParameters( gl, ENUM_STYLE_SETTINGS_SET1 );
    for ( const key in ENUM_STYLE_SETTINGS_SET1 ) {
        const value = getParameter( gl, key );
        assert.deepEqual( value, ENUM_STYLE_SETTINGS_SET1[ key ],
            `first set: got expected set value ${stringifyTypedArray( value )} for key: ${key}` );
    }

    pushContextState( gl );

    // Set custom values and verify
    setParameters( gl, ENUM_STYLE_SETTINGS_SET2 );
    for ( const key in ENUM_STYLE_SETTINGS_SET2 ) {
        const value = getParameter( gl, key );
        assert.deepEqual( value, ENUM_STYLE_SETTINGS_SET2[ key ],
            `second set: got expected value ${stringifyTypedArray( value )} for key: ${key}` );
    }

    // Pop and verify values restore to previous state
    popContextState( gl );

    for ( const key in ENUM_STYLE_SETTINGS_SET1 ) {
        const value = getParameter( gl, key );
        assert.deepEqual( value, ENUM_STYLE_SETTINGS_SET1[ key ],
            `first pop: got expected value ${stringifyTypedArray( value )} for key: ${key}` );
    }

    popContextState( gl );

    for ( const key in GL_PARAMETER_DEFAULTS ) {
        const value = getParameter( gl, key );
        assert.deepEqual( value, GL_PARAMETER_DEFAULTS[ key ],
            `second pop: got expected value ${stringifyTypedArray( value )} for key: ${key}` );
    }

    done();
} );

it( 'WebGLState#gl API', done => {
    const { gl } = fixture;

    resetParameters( gl );

    // Verify default values.
    for ( const key in GL_PARAMETER_DEFAULTS ) {
        const value = getParameter( gl, key );
        assert.deepEqual( value, GL_PARAMETER_DEFAULTS[ key ],
            `got expected value ${stringifyTypedArray( value )}` );
    }

    pushContextState( gl );

    // TODO: test gl calls for compsite setters too (may be just call all gl calls).
    for ( const key in ENUM_STYLE_SETTINGS_SET1 ) {
        const value = ENUM_STYLE_SETTINGS_SET1[ key ];
        const glSetter = GL_PARAMETER_SETTERS[ key ];
        // Skipping composite setters
        if ( typeof glSetter !== 'string' ) {
            glSetter( gl, value, key );
        }
    }

    for ( const key in ENUM_STYLE_SETTINGS_SET1 ) {
    // Skipping composite setters
        if ( typeof GL_PARAMETER_SETTERS[ key ] !== 'string' ) {
            const value = getParameter( gl, key );
            assert.deepEqual( value, ENUM_STYLE_SETTINGS_SET1[ key ],
                `got expected value ${stringifyTypedArray( value )}` );
        }
    }

    popContextState( gl );

    for ( const key in GL_PARAMETER_DEFAULTS ) {
        const value = getParameter( gl, key );
        assert.deepEqual( value, GL_PARAMETER_DEFAULTS[ key ],
            `got expected value ${stringifyTypedArray( value )}` );
    }

    done();
} );
