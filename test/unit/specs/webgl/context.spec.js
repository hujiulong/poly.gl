import { createGLContext, glGetDebugInfo, isWebGL } from 'poly.gl';

it( 'WebGL#headless context creation', done => {
    const gl = createGLContext();
    assert.ok( isWebGL( gl ), 'Context creation ok' );
    done();
} );

it( 'WebGL#glGetDebugInfo', done => {
    const gl = createGLContext();
    const info = glGetDebugInfo( gl );
    assert.ok( typeof info.vendor === 'string', 'info.vendor ok' );
    assert.ok( typeof info.renderer === 'string', 'info.renderer ok' );
    done();
} );
