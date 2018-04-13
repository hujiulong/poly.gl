import { TransformFeedback, Buffer } from 'poly.gl';

import { fixture } from '../../fixtures';

it( 'WebGL#TransformFeedback isSupported', done => {
    const { gl, gl2 } = fixture;
    assert( !TransformFeedback.isSupported( gl ), 'isSupported returns correct result' );
    assert.equal( TransformFeedback.isSupported( gl2 ), Boolean( gl2 ), 'isSupported returns correct result' );
    done();
} );

it( 'WebGL#TransformFeedback constructor/delete', done => {
    const { gl2 } = fixture;

    if ( !gl2 ) {
        assert.ok( true, 'WebGL2 not available, skipping tests' );
        done();
        return;
    }

    assert.throws(
        () => new TransformFeedback(),
        ( /.*Requires WebGL2.*/ ),
        'Buffer throws on missing gl context' );

    const tf = new TransformFeedback( gl2 );
    assert.ok( tf instanceof TransformFeedback, 'TransformFeedback construction successful' );

    tf.delete();
    assert.ok( tf instanceof TransformFeedback, 'TransformFeedback delete successful' );

    tf.delete();
    assert.ok( tf instanceof TransformFeedback, 'TransformFeedback repeated delete successful' );

    done();
} );

it( 'WebGL#TransformFeedback bindBuffers', done => {
    const { gl2 } = fixture;

    if ( !gl2 ) {
        assert.ok( true, 'WebGL2 not available, skipping tests' );
        done();
        return;
    }

    const tf = new TransformFeedback( gl2 );
    const buffer1 = new Buffer( gl2 );
    const buffer2 = new Buffer( gl2 );

    tf.bindBuffers( {
        0: buffer1,
        1: buffer2
    } );
    assert.ok( tf instanceof TransformFeedback, 'TransformFeedback bindBuffers successful' );

    tf.bindBuffers( {
        0: buffer1,
        1: buffer2
    }, { clear: true } );
    assert.ok( tf instanceof TransformFeedback, 'TransformFeedback bindBuffers with clear is successful' );

    const varyingMap = {
        varying1: 0,
        varying2: 1
    };
    tf.bindBuffers( {
        varying2: buffer2,
        varying1: buffer1
    }, { clear: true, varyingMap } );

    assert.ok( tf instanceof TransformFeedback, 'TransformFeedback bindBuffers with clear is successful' );

    done();
} );
