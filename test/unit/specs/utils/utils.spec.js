import { uid, isPowerOfTwo } from 'poly.gl/utils';

it( 'Utils#uid', done => {
    assert.ok( typeof uid() === 'string', 'Type of uid() is correct' );
    assert.equal( uid( 'prefix' ).indexOf( 'prefix' ), 0,
        'uid("prefix") starts with prefix' );
    done();
} );

it( 'Utils#isPowerOfTwo', done => {
    assert.ok( JSON.stringify( isPowerOfTwo( 1 ) ) === JSON.stringify( true ) );
    assert.ok( JSON.stringify( isPowerOfTwo( 2 ) ) === JSON.stringify( true ) );
    assert.ok( JSON.stringify( isPowerOfTwo( 3 ) ) === JSON.stringify( false ) );
    assert.ok( JSON.stringify( isPowerOfTwo( 500 ) ) === JSON.stringify( false ) );
    assert.ok( JSON.stringify( isPowerOfTwo( 512 ) ) === JSON.stringify( true ) );
    assert.ok( JSON.stringify( isPowerOfTwo( 514 ) ) === JSON.stringify( false ) );
    done();
} );
