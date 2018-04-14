// This file contains webpack configuration settings that allow
// examples to be built against the source code in this repo instead
// of building against their installed version.
//
// This enables using the examples to debug the main library source
// without publishing or npm linking, with conveniences such hot reloading etc.

const { resolve } = require( 'path' );

const LIB_DIR = resolve( __dirname, '../src/index.js' );

// Support for hot reloading changes to the library:
const LOCAL_DEVELOPMENT_CONFIG = {

    devtool: 'source-map',

    // suppress warnings about bundle size
    devServer: {
        stats: {
            warnings: false
        }
    },

    resolve: {
        alias: {
            // Imports the poly.gl library from the src directory in this repo
            'poly.gl': LIB_DIR
        }
    },
    module: {
        rules: [
            {
                // Unfortunately, webpack doesn't import library sourcemaps on its own...
                test: /\.js$/,
                use: [ 'source-map-loader' ],
                enforce: 'pre'
            }
        ]
    }
};

function addLocalDevSettings( config, { libAlias } ) {
    config = Object.assign( {}, LOCAL_DEVELOPMENT_CONFIG, config );
    config.resolve = config.resolve || {};
    config.resolve.alias = config.resolve.alias || {};
    Object.assign( config.resolve.alias, LOCAL_DEVELOPMENT_CONFIG.resolve.alias );
    if ( libAlias ) {
        config.resolve.alias[ 'poly.gl' ] = libAlias;
    }

    config.module = config.module || {};
    config.module.rules = config.module.rules || [];
    config.module.rules = config.module.rules.concat( LOCAL_DEVELOPMENT_CONFIG.module.rules );
    return config;
}

module.exports = ( baseConfig, opts = {} ) => env => {
    let config = baseConfig;

    if ( env && env.local ) {
        config = addLocalDevSettings( baseConfig, opts );
    }
    console.warn( JSON.stringify( config, null, 2 ) );
    return config;
};
