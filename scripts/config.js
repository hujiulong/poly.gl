const path = require( 'path' )
const babel = require( 'rollup-plugin-babel' )
const cjs = require( 'rollup-plugin-commonjs' )
const node = require( 'rollup-plugin-node-resolve' )
const pkg = require( '../package.json' )
const version = process.env.VERSION || pkg.version

const banner = `/* @preserve
 * poly.gl ${version}, ${pkg.description}
 * Copyright (c) 2018 ${pkg.author}
 */
`;

const aliases = require( './alias' )
const resolve = p => {
    const base = p.split( '/' )[ 0 ]
    if ( aliases[ base ] ) {
        return path.resolve( aliases[ base ], p.slice( base.length + 1 ) )
    } else {
        return path.resolve( __dirname, '../', p )
    }
}

const builds = {
    // ES Modules
    'esm': {
        entry: resolve( 'src/index.js' ),
        dest: resolve( 'dist/poly.esm.js' ),
        format: 'es',
        banner
    },
    // umd
    'umd': {
        entry: resolve( 'src/index.js' ),
        dest: resolve( 'dist/poly.js' ),
        format: 'umd',
        moduleName: 'Poly',
        banner
    },
    'umd-prod': {
        entry: resolve( 'src/index.js' ),
        dest: resolve( 'dist/poly.min.js' ),
        format: 'umd',
        moduleName: 'Poly',
        banner
    }
}

function genConfig( name ) {
    const opts = builds[ name ]
    const config = {
        input: opts.entry,
        external: opts.external,
        plugins: [
            cjs(),
            node(),
            babel()
        ].concat( opts.plugins || [] ),
        output: {
            file: opts.dest,
            format: opts.format,
            banner: opts.banner,
            name: opts.moduleName || 'Poly'
        }
    }

    Object.defineProperty( config, '_name', {
        enumerable: false,
        value: name
    } )

    return config
}

if ( process.env.TARGET ) {
    module.exports = genConfig( process.env.TARGET )
} else {
    exports.getBuild = genConfig
    exports.getAllBuilds = () => Object.keys( builds ).map( genConfig )
}
