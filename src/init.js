import isBrowser from './utils/is-browser';
import { global } from './utils/globals';
import log from './utils/log';
import pkg from '../package.json';

const VERSION = pkg.version;

if ( global.poly && global.poly.VERSION !== VERSION ) {
    throw new Error( `poly.gl - multiple VERSIONs detected: ${global.poly.VERSION} vs ${VERSION}` );
}

if ( !global.poly ) {
    if ( isBrowser ) {
        log.log( 0, `poly.gl ${VERSION}` );
    }

    global.poly = global.poly || {
        VERSION,
        version: VERSION,
        log,

        // A global stats object that various components can add information to
        // E.g. see webgl/resource.js
        stats: {},

        // Keep some poly globals in a sub-object
        // This allows us to dynamically detect if certain modules have been
        // included (such as IO and headless) and enable related functionality,
        // without unconditionally requiring and thus bundling big dependencies
        // into the app.
        globals: {
            modules: {},
            nodeIO: {}
        }
    };
}

export { global };
export default global.poly;
