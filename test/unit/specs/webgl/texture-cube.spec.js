
import { TextureCube } from 'poly.gl';

import { fixture } from '../../fixtures';

// it( 'WebGL#TextureCube construct/delete', done => {
//     const { gl } = fixture;
//
//     assert.throws(
//         () => new TextureCube(),
//         /.*WebGLRenderingContext.*/,
//         'TextureCube throws on missing gl context' );
//
//     const texture = new TextureCube( gl );
//     assert.ok( texture instanceof TextureCube, 'TextureCube construction successful' );
//
//     assert.ok( true, JSON.stringify( texture.getParameters( { keys: true } ) ) );
//
//     texture.delete();
//     assert.ok( texture instanceof TextureCube, 'TextureCube delete successful' );
//
//     texture.delete();
//     assert.ok( texture instanceof TextureCube, 'TextureCube repeated delete successful' );
//
//     done();
// } );
//
// it( 'WebGL#TextureCube buffer update', done => {
//     const { gl } = fixture;
//
//     let texture = new TextureCube( gl );
//     assert.ok( texture instanceof TextureCube, 'TextureCube construction successful' );
//
//     texture = texture.delete();
//     assert.ok( texture instanceof TextureCube, 'TextureCube delete successful' );
//
//     done();
// } );
