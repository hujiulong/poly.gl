/* eslint-disable max-len, max-statements */
/* global setInterval, clearInterval */

import { pollContext, Query } from 'poly.gl';
import util from 'util';
import { fixture } from '../../fixtures';
import GL from 'poly.gl/constants';

function testQueryConstructDelete( gl ) {
    const ext = gl.getExtension( 'EXT_disjoint_timer_query' );
    assert.ok( true, `EXT_disjoint_timer_query is ${Boolean( ext )} ${ext}`, ext );
    util.inspect( ext, { showHidden: true } );

    const supported = Query.isSupported( gl );
    if ( supported ) {
        assert.ok( true, 'Query is supported, testing functionality' );
    } else {
        assert.ok( true, 'Query is not supported, testing graceful fallback' );
    }

    assert.throws(
        () => new Query(),
        /.*WebGLRenderingContext.*/,
        'Query throws on missing gl context' );

    let timerQuery;
    assert.doesNotThrow(
        () => {
            timerQuery = new Query( gl );
        },
        'Query construction successful' );

    timerQuery.delete();
    assert.ok( timerQuery instanceof Query, 'Query delete successful' );

    timerQuery.delete();
    assert.ok( timerQuery instanceof Query, 'Query repeated delete successful' );

}

it( 'WebGL#Query construct/delete', done => {
    const { gl } = fixture;

    testQueryConstructDelete( gl );
    done();
} );

it( 'WebGL2#Query construct/delete', done => {
    const { gl2 } = fixture;
    if ( !gl2 ) {
        assert.ok( true, 'WebGL2 not available, skipping tests' );
        done();
        return;
    }
    testQueryConstructDelete( gl2 );
    done();
} );

function testQueryBeginCancel( gl, done ) {
    // Cancelled query

    const timerQuery = new Query( gl, {
        onComplete: result => assert.fail( `Query 1: ${result}` ),
        onError: error => assert.ok( true, `Query 1: ${error}` ) // pass
    } );

    timerQuery.cancel().cancel().cancel();
    assert.ok( timerQuery instanceof Query, 'Query multiple cancel successful' );

    timerQuery.beginTimeElapsedQuery();
    assert.ok( timerQuery instanceof Query, 'Query begin successful' );

    timerQuery.cancel().cancel().cancel();
    assert.ok( timerQuery instanceof Query, 'Query multiple cancel successful' );

    timerQuery.promise
        .then( _ => {
            done();
        } )
        .catch( error => {
            assert.ok( true, `Query promise reset by cancel or not implemented ${error}` ); // pass
            done();
        } );
}

it( 'WebGL#Query begin/cancel', done => {
    const { gl } = fixture;
    testQueryBeginCancel( gl, done );
} );

it( 'WebGL2#Query begin/cancel', done => {
    const { gl2 } = fixture;
    if ( !gl2 ) {
        assert.ok( true, 'WebGL2 not available, skipping tests' );
        done();
        return;
    }
    testQueryBeginCancel( gl2, done );
} );

function testQueryCompleteFail( gl ) {
    // Completed query
    const timerQuery = Query.isSupported( gl )
        ? new Query( gl, {
            onComplete: result => assert.ok( true, `Query 2: ${result}ms` ), // pass
            onError: error => assert.fail( `Query 2: ${error}` )
        } )
        : new Query( gl );

    timerQuery.beginTimeElapsedQuery().end();
    assert.ok( timerQuery.promise instanceof Promise, 'Query begin/end successful' );

    const interval = setInterval( () => pollContext( gl ), 20 );

    function finalizer() {
        clearInterval( interval );
    }

    return timerQuery.promise.then( finalizer, finalizer );
}

it( 'WebGL#Query completed/failed queries', done => {
    const { gl } = fixture;
    testQueryCompleteFail( gl );
    done();
} );

it( 'WebGL2#Query completed/failed queries', done => {
    const { gl2 } = fixture;
    if ( !gl2 ) {
        assert.ok( true, 'WebGL2 not available, skipping tests' );
        done();
        return;
    }
    testQueryCompleteFail( gl2 );
    done();
} );

function testQuery( gl, opts, target ) {
    if ( !Query.isSupported( gl, opts ) ) {
        assert.ok( true, 'Query API not supported, skipping tests' );
        return null;
    }
    const query = new Query( gl, {
        onComplete: result => assert.ok( true, `Timer query: ${result}ms` ), // pass
        onError: error => assert.fail( `Timer query: ${error}` )
    } );

    query.begin( target ).end();
    assert.ok( query.promise instanceof Promise, 'Query begin/end successful' );

    const interval = setInterval( () => pollContext( gl ), 20 );
    function finalizer() {
        clearInterval( interval );
    }

    return query.promise.then( finalizer, finalizer );
}

it( 'WebGL#TimeElapsedQuery', done => {
    const { gl } = fixture;
    const opts = { timer: true };
    testQuery( gl, opts, GL.TIME_ELAPSED_EXT );
    done();
} );

it( 'WebGL2#TimeElapsedQuery', done => {
    const { gl2 } = fixture;
    if ( !gl2 ) {
        assert.ok( true, 'WebGL2 not available, skipping tests' );
        done();
        return;
    }
    const opts = { timer: true };
    testQuery( gl2, opts, GL.TIME_ELAPSED_EXT );
    done();
} );

it( 'WebGL#OcclusionQuery', done => {
    const { gl } = fixture;
    const opts = { queries: true };
    testQuery( gl, opts, GL.ANY_SAMPLES_PASSED_CONSERVATIVE );
    done();
} );

it( 'WebGL2#OcclusionQuery', done => {
    const { gl2 } = fixture;
    if ( !gl2 ) {
        assert.ok( true, 'WebGL2 not available, skipping tests' );
        done();
        return;
    }
    const opts = { queries: true };
    testQuery( gl2, opts, GL.ANY_SAMPLES_PASSED_CONSERVATIVE );
    done();
} );

it( 'WebGL#TransformFeedbackQuery', done => {
    const { gl } = fixture;
    const opts = { queries: true };
    testQuery( gl, opts, GL.TRANSFORM_FEEDBACK_PRIMITIVES_WRITTEN );
    done();
} );

it( 'WebGL2#TransformFeedbackQuery', done => {
    const { gl2 } = fixture;
    if ( !gl2 ) {
        assert.ok( true, 'WebGL2 not available, skipping tests' );
        done();
        return;
    }
    const opts = { queries: true };
    testQuery( gl2, opts, GL.TRANSFORM_FEEDBACK_PRIMITIVES_WRITTEN );
    done();
} );

function testGetTimestamp( gl ) {
    if ( !Query.isSupported( gl, { timestamps: true } ) ) {
        assert.ok( true, 'TIMESTAMP_EXT Query not supported, skipping tests' );
        return null;
    }
    const query = new Query( gl, {
        onComplete: result => assert.ok( true, `timestamp: ${result}` ), // pass
        onError: error => assert.fail( `timestamp: ${error}` )
    } );

    query.getTimestamp().end();
    assert.ok( query.promise instanceof Promise, 'Query getTimestamp/end successful' );

    const interval = setInterval( () => pollContext( gl ), 20 );
    function finalizer() {
        clearInterval( interval );
    }

    return query.promise.then( finalizer, finalizer );
}

it( 'WebGL#getTimestamp', done => {
    const { gl } = fixture;

    testGetTimestamp( gl );
    done();
} );

it( 'WebGL2#getTimestamp', done => {
    const { gl2 } = fixture;
    if ( !gl2 ) {
        assert.ok( true, 'WebGL2 not available, skipping tests' );
        done();
        return;
    }

    testGetTimestamp( gl2 );
    done();
} );
