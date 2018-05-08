import polyfillContext from 'poly.gl/webgl-context/polyfill-context';
// import {polyfillContext, TEST_EXPORTS} from 'poly.gl/webgl';

import { fixture } from '../../fixtures';

it( 'WebGL#polyfillContext', done => {
    const { gl, gl2 } = fixture;

    assert.ok( typeof polyfillContext === 'function', 'polyfillContext defined' );

    const extensions = polyfillContext( gl );
    assert.ok( extensions, 'extensions were returned' );

    if ( gl2 ) {
        const extensions2 = polyfillContext( gl2 );
        assert.ok( extensions2, 'extensions were returned' );
    }

    done();
} );
