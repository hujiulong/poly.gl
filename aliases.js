const path = require( 'path' );

const ALIASES = {
    'poly.gl/test': path.resolve( __dirname, './test' ),
    'poly.gl': path.resolve( __dirname, './src' )
};

if ( module.require ) {
    // Enables ES2015 import/export in Node.js
    module.require( 'reify' );

    const moduleAlias = module.require( 'module-alias' );
    moduleAlias.addAliases( ALIASES );
}

module.exports = ALIASES;
