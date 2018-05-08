import { getKey, getContextInfo } from 'poly.gl';
import { TEST_EXPORTS } from 'poly.gl/webgl-context/context-limits';

import { fixture } from '../../fixtures';

it( 'WebGL#getContextInfo', done => {
    const { gl } = fixture;

    assert.ok( getContextInfo, 'getContextInfo defined' );

    const info = getContextInfo( gl );

    assert.ok( 'limits' in info, 'info has limits' );
    assert.ok( 'info' in info, 'info has info' );

    done();
} );

it( 'WebGL1#getContextInfo#limits', done => {
    const { gl } = fixture;

    const info = getContextInfo( gl );

    for ( const limit in TEST_EXPORTS.WEBGL_LIMITS ) {
        const actual = info.limits[ limit ];
        const webgl1 = info.webgl1MinLimits[ limit ];
        const webgl2 = info.webgl2MinLimits[ limit ];

        if ( Number.isFinite( actual ) ) {
            assert.ok( Math.abs( actual ) >= Math.abs( webgl1 ),
                `${getKey( limit )}: actual limit ${actual} >= webgl1 limit ${webgl1}` );
            assert.ok( Math.abs( webgl2 ) >= Math.abs( webgl1 ),
                `${getKey( limit )}: webgl2 limit ${webgl2} >= webgl1 limit ${webgl1}` );
        } else {
            assert.ok( true, `${getKey( limit )}: actual limit ${actual} webgl2 limit ${webgl2}` ); // pass
        }
    }

    done();
} );

it( 'WebGL2#getContextInfo#limits', done => {
    const { gl2 } = fixture;

    if ( gl2 ) {
        const info = getContextInfo( gl2 );

        for ( const limit in TEST_EXPORTS.WEBGL_LIMITS ) {
            const actual = info.limits[ limit ];
            const webgl1 = info.webgl1MinLimits[ limit ];
            const webgl2 = info.webgl2MinLimits[ limit ];

            if ( Number.isFinite( actual ) ) {
                assert.ok( Math.abs( actual ) >= Math.abs( webgl1 ),
                    `${getKey( limit )}: actual limit ${actual} >= webgl1 limit ${webgl1}` );
                assert.ok( Math.abs( actual ) >= Math.abs( webgl2 ),
                    `${getKey( limit )}: actual limit ${actual} >= webgl2 limit ${webgl2}` );
            } else {
                assert.ok( true, `${getKey( limit )}: actual limit ${actual} webgl2 limit ${webgl2}` ); // pass
            }
        }
    }

    done();
} );
