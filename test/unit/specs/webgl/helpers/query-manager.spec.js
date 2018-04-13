
import queryManager from 'poly.gl/webgl/helpers/query-manager';

it( 'WebGL helpers#queryManager', done => {
    assert.ok( queryManager, 'Imported correctly' );
    done();
} );
