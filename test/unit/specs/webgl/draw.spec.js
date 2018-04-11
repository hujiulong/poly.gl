
import { createGLContext, Program } from 'poly.gl';

const vs = `
attribute vec3 positions;
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
void main(void) {
  gl_Position = uPMatrix * uMVMatrix * vec4(positions, 1.0);
}
`;

const fs = `
void main(void) {
  gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
}
`;

it( 'WebGL#draw', done => {
    const gl = createGLContext();
    assert.ok( gl, 'Created gl context' );

    const program = new Program( gl, { vs, fs } );
    assert.ok( program instanceof Program, 'Program construction successful' );
    done();

    // draw(gl, {
    // instanced: true,
    // });
} );
