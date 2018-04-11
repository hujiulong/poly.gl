import test from 'tape-catch';
import queryManager from 'poly.gl/webgl/helpers/query-manager';

test( 'WebGL helpers#queryManager', t => {
    t.ok( queryManager, 'Imported correctly' );
    t.end();
} );
