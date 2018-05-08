// NOTE: `headless.js` must **NOT** be included in this file
import { createGLContext, Program, webGLTypesAvailable } from 'poly.gl';

it( 'PolyGL#imports are defined', done => {
    assert.ok( typeof Program === 'function', 'Program is defined' );
    assert.ok( typeof createGLContext === 'function', 'createGLContext is defined' );
    done();
} );

// if ( !webGLTypesAvailable ) {
//     it( 'PolyGL#createGLContext throws without headless', done => {
//         assert.throws(
//             () => createGLContext(),
//             /WebGL API is missing/,
//             'createGLContext throws when headless is not included' );
//         done();
//     } );
// }
