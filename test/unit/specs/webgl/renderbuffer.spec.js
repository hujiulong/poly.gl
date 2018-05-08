
import { GL, Renderbuffer, getKey } from 'poly.gl';

import { RENDERBUFFER_FORMATS } from 'poly.gl/webgl/renderbuffer';

import { fixture } from '../../fixtures';

// const WEBGL1_FORMATS = [GL.RGB, GL.RGBA, GL.LUMINANCE_ALPHA, GL.LUMINANCE, GL.ALPHA];

it( 'WebGL#Renderbuffer construct/delete', done => {
    const { gl } = fixture;

    assert.throws(
        () => new Renderbuffer(),
        /.*WebGLRenderingContext.*/,
        'Renderbuffer throws on missing gl context' );

    const renderbuffer = new Renderbuffer( gl, { format: GL.DEPTH_COMPONENT16, width: 1, height: 1 } );
    assert.ok( renderbuffer instanceof Renderbuffer,
        'Renderbuffer construction successful' );

    renderbuffer.delete();
    assert.ok( renderbuffer instanceof Renderbuffer,
        'Renderbuffer delete successful' );

    renderbuffer.delete();
    assert.ok( renderbuffer instanceof Renderbuffer,
        'Renderbuffer repeated delete successful' );

    done();
} );

it( 'WebGL#Renderbuffer format creation', done => {
    const { gl } = fixture;

    for ( let format in RENDERBUFFER_FORMATS ) {
        format = Number( format );
        if ( Renderbuffer.isSupported( gl, { format } ) ) {
            const renderbuffer = new Renderbuffer( gl, { format } );
            assert.equal( renderbuffer.format, format,
                `Renderbuffer(${getKey( format )}) created with correct format` );
            renderbuffer.delete();
        }
    }

    done();
} );

it( 'WebGL2#Renderbuffer format creation', done => {
    const { gl2 } = fixture;

    if ( !gl2 ) {
        assert.ok( true, 'WebGL2 not available, skipping tests' );
        done();
        return;
    }

    for ( const format_ in RENDERBUFFER_FORMATS ) {
        const format = Number( format_ );
        if ( Renderbuffer.isSupported( gl2, { format } ) ) {
            const renderbuffer = new Renderbuffer( gl2, { format } );
            assert.equal( renderbuffer.format, format,
                `Renderbuffer(${getKey( format )}) created with correct format` );
            renderbuffer.delete();
        }
    }

    done();
} );
