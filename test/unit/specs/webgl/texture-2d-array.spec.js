// import { createGLContext } from '../../utils/test-tools';
import { Texture2DArray } from 'poly.gl';

import { fixture } from '../../fixtures'

it( 'WebGL#Texture2DArray', done => {

    if ( !Texture2DArray.isSupported( fixture.gl ) ) {
        assert.ok( true, '- Texture2DArray not supported, skipping tests' );
        done();
        return;
    }

    it( 'WebGL#Texture2DArray construct/delete', done => {
        const { gl } = fixture;

        assert.throws(
            () => new Texture2DArray(),
            /.*WebGLRenderingContext.*/,
            'Texture2DArray throws on missing gl context' );

        const texture = new Texture2DArray( gl );
        assert.ok( texture instanceof Texture2DArray, 'Texture2DArray construction successful' );

        texture.delete();
        assert.ok( texture instanceof Texture2DArray, 'Texture2DArray delete successful' );

        texture.delete();
        assert.ok( texture instanceof Texture2DArray, 'Texture2DArray repeated delete successful' );

        done();
    } );

    it( 'WebGL#Texture2DArray parameters', done => {
        const { gl } = fixture;

        const texture = new Texture2DArray( gl );
        assert.ok( texture instanceof Texture2DArray, 'Texture2DArray construction successful' );

        const params = texture.getParameters( { keys: true } );
        assert.ok( true, JSON.stringify( params ) );

        done();
    } );

} );
