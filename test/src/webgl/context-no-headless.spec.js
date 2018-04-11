// NOTE: `headless.js` must **NOT** be included in this file
import { createGLContext, Program, webGLTypesAvailable } from 'poly.gl';

import test from 'tape-catch';

test( 'PolyGL#imports are defined', t => {
    t.ok( typeof Program === 'function', 'Program is defined' );
    t.ok( typeof createGLContext === 'function', 'createGLContext is defined' );
    t.end();
} );

if ( !webGLTypesAvailable ) {
    test( 'PolyGL#createGLContext throws without headless', t => {
        t.throws(
            () => createGLContext(),
            /WebGL API is missing/,
            'createGLContext throws when headless is not included' );
        t.end();
    } );
}
