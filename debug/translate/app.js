import {
    AnimationLoop,
    Program,
    Buffer,
    Matrix4,
    resetParameters,
    setParameters
} from 'poly.gl';

const VERTEX_SHADER = `\
attribute vec3 positions;
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
void main(void) {
  gl_Position = uPMatrix * uMVMatrix * vec4(positions, 1.0);
}
`;

const FRAGMENT_SHADER = `\
#ifdef GL_ES
precision highp float;
#endif
void main(void) {
  gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
}
`;

const animationLoop = new AnimationLoop( {
    onInitialize( {
        gl,
        canvas,
        aspect
    } ) {

        setParameters( gl, {
            clearColor: [ 0, 0, 0, 1 ],
            clearDepth: [ 1 ],
            depthTest: true,
            depthFunc: gl.LEQUAL
        } );

        var program = new Program( gl, {
            vs: VERTEX_SHADER,
            fs: FRAGMENT_SHADER
        } );

        const TRIANGLE_VERTS = [ 0, 1, 0, -1, -1, 0, 1, -1, 0 ]; // eslint-disable-line
        const SQUARE_VERTS = [ 1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1, 0 ]; // eslint-disable-line

        const squarePositions = new Buffer( gl, {
            size: 3,
            data: new Float32Array( SQUARE_VERTS )
        } );

        const view = new Matrix4().translate( -1.5, 0, -7 );
        const projection = new Matrix4().perspective( {
            aspect
        } );

        program.use();

        gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

        // Draw Square
        view.translate( 3, 0, 0 );
        program
            .setBuffers( {
                positions: squarePositions
            } )
            .setUniforms( {
                uMVMatrix: view,
                uPMatrix: projection
            } );
        gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );

        return {
            view,
            program
        }
    },

    onRender( { gl, view, program, tick } ) {

        gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

        program.setUniforms( {
            uMVMatrix: view.translate( 0.1, 0.1, 0 )
        } );

        gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );
    }
} );

console.log( animationLoop )

// expose on Window for standalone example
window.animationLoop = animationLoop; // eslint-disable-lie

window.animationLoop.start( { canvas: 'polygl-canvas' } );
