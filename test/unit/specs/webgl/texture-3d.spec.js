
import { createGLContext, Texture3D, isWebGL2 } from 'poly.gl';

import { fixture } from '../../fixtures'

it( 'WebGL#Texture3D construct/delete', done => {
    const { gl2 } = fixture;

    assert.throws(
        () => new Texture3D(),
        /.*WebGL.*/,
        'Texture3D throws on missing gl context' );

    const texture = new Texture3D( gl2 );
    assert.ok( texture instanceof Texture3D, 'Texture3D construction successful' );

    assert.ok( true, JSON.stringify( texture.getParameters( { keys: true } ) ) );

    texture.delete();
    assert.ok( texture instanceof Texture3D, 'Texture3D delete successful' );

    texture.delete();
    assert.ok( texture instanceof Texture3D, 'Texture3D repeated delete successful' );

    done();
} );

it( 'WebGL#Texture3D buffer update', done => {
    const { gl2 } = fixture;

    let texture = new Texture3D( gl2 );
    assert.ok( texture instanceof Texture3D, 'Texture3D construction successful' );

    texture = texture.delete();
    assert.ok( texture instanceof Texture3D, 'Texture3D delete successful' );

    done();
} );
