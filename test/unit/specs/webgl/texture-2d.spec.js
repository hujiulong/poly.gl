
import { createGLContext, Texture2D } from 'poly.gl';

const fixture = {
    gl: createGLContext()
};

it( 'WebGL#Texture2D construct/delete', done => {
    const { gl } = fixture;

    assert.throws(
        () => new Texture2D(),
        /.*WebGLRenderingContext.*/,
        'Texture2D throws on missing gl context' );

    const texture = new Texture2D( gl );
    assert.ok( texture instanceof Texture2D, 'Texture2D construction successful' );

    assert.ok( true, JSON.stringify( texture.getParameters( { keys: true } ) ) );

    texture.delete();
    assert.ok( texture instanceof Texture2D, 'Texture2D delete successful' );

    texture.delete();
    assert.ok( texture instanceof Texture2D, 'Texture2D repeated delete successful' );

    done();
} );

it( 'WebGL#Texture2D buffer update', done => {
    const { gl } = fixture;

    let texture = new Texture2D( gl );
    assert.ok( texture instanceof Texture2D, 'Texture2D construction successful' );

    texture = texture.delete();
    assert.ok( texture instanceof Texture2D, 'Texture2D delete successful' );

    done();
} );
