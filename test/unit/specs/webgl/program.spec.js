
import { GL, Program, Buffer } from 'poly.gl';

import { fixture } from '../../fixtures';

const vs = `
attribute vec3 positions;
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
varying vec3 vPosition;

void main(void) {
  gl_Position = uPMatrix * uMVMatrix * vec4(positions, 1.0);
  vPosition = positions;
}
`;

const fs = `
void main(void) {
  gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
}
`;

const BUFFER_DATA = new Float32Array( [ 0, 1, 0, -1, -1, 0, 1, -1, 0 ] );

it( 'WebGL#Program construct/delete', done => {
    const { gl } = fixture;

    assert.throws(
        () => new Program(),
        /.*WebGLRenderingContext.*/,
        'Program throws on missing gl context' );

    assert.throws(
        () => new Program( gl ),
        /.*shader*/,
        'Program throws on missing shader' );

    const program = new Program( gl, { vs, fs } );
    assert.ok( program instanceof Program, 'Program construction successful' );

    program.delete();
    assert.ok( program instanceof Program, 'Program delete successful' );

    program.delete();
    assert.ok( program instanceof Program, 'Program repeated delete successful' );

    done();
} );

it( 'WebGL#Program buffer update', done => {
    const { gl } = fixture;

    let program = new Program( gl, { fs, vs } );
    assert.ok( program instanceof Program, 'Program construction successful' );

    program = program.setBuffers( {
        positions: new Buffer( gl, { target: GL.ARRAY_BUFFER, data: BUFFER_DATA, size: 3 } ),
        unusedAttributeName: new Buffer( gl, { target: GL.ARRAY_BUFFER, data: BUFFER_DATA, size: 3 } )
    } );
    assert.ok( program instanceof Program, 'Program set buffers successful' );

    program = program.delete();
    assert.ok( program instanceof Program, 'Program delete successful' );

    done();
} );

it( 'WebGL#Program draw', done => {
    const { gl } = fixture;

    let program = new Program( gl, { fs, vs } );

    program = program.setBuffers( {
        positions: new Buffer( gl, { target: GL.ARRAY_BUFFER, data: BUFFER_DATA, size: 3 } ),
        unusedAttributeName: new Buffer( gl, { target: GL.ARRAY_BUFFER, data: BUFFER_DATA, size: 3 } )
    } );

    program.draw( { vertexCount: 3 } );
    assert.ok( program instanceof Program, 'Program draw successful' );

    program.draw( { vertexCount: 3, parameters: { blend: true } } );
    assert.ok( program instanceof Program, 'Program draw with parameters is successful' );

    done();
} );

it( 'WebGL#Program varyingMap', done => {
    const { gl2 } = fixture;

    if ( !gl2 ) {
        assert.ok( true, 'WebGL2 not available, skipping tests' );
        done();
        return;
    }

    let program = new Program( gl2, { fs, vs, varyings: [ 'vPosition', 'gl_Position' ] } );
    assert.deepEqual( program.varyingMap.vPosition, 0 );
    assert.deepEqual( program.varyingMap.gl_Position, 1 );

    program = new Program( gl2, { fs, vs, varyings: [ 'vPosition', 'gl_Position' ], bufferMode: GL.INTERLEAVED_ATTRIBS } );
    assert.deepEqual( program.varyingMap.vPosition, 0 );
    assert.deepEqual( program.varyingMap.gl_Position, 0 );
    done();
} );

it( 'WebGL#Program caching', done => {
    const { gl } = fixture;

    const program = new Program( gl, { fs, vs } );

    program._isCached = true;
    program.delete();
    assert.ok( program._handle, 'Program should not be deleted' );

    program._isCached = false;
    program.delete();
    assert.ok( !program._handle, 'Program should be deleted' );

    done();
} );
