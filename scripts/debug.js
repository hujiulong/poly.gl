const glob = require( 'glob' )
const path = require( 'path' )
const webpack = require( 'webpack' )
const HtmlWebpackPlugin = require( 'html-webpack-plugin' )
const FriendlyErrorsPlugin = require( 'friendly-errors-webpack-plugin' )
const alias = require( './alias' )

const HOST = process.env.HOST || 'localhost'
const PORT = process.env.PORT && Number( process.env.PORT ) || 8080

const resolve = p => {
    const base = p.split( '/' )[ 0 ]
    if ( alias[ base ] ) {
        return path.resolve( alias[ base ], p.slice( base.length + 1 ) )
    } else {
        return path.resolve( __dirname, '../', p )
    }
}

const pages = glob.sync( './debug/*/' ).map( function ( entry ) {
    return entry.split( '/' )[ 2 ]
} )

const entries = {};
const plugins = [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    new FriendlyErrorsPlugin( {
        compilationSuccessInfo: {
            messages: [
                `Debug pages are running here:`
            ].concat( pages.map( name => `http://${HOST}:${PORT}/${name}/` ) ),
        }
    } )
]

pages.forEach( function ( name ) {
    entries[ name ] = resolve( `debug/${name}/app.js` );

    plugins.push( new HtmlWebpackPlugin( {
        filename: name + '/index.html',
        template: `debug/${name}/index.html`,
        inject: true,
        excludeChunks: pages.filter( item => item !== name )
    } ) );
} )

module.exports = {
    entry: entries,
    output: {
        filename: '[name]/app.js'
    },
    resolve: {
        extensions: [ '.js', '.json' ],
        modules: [
            resolve( 'src' ),
            resolve( 'node_modules' )
        ],
        alias: alias
    },
    module: {
        rules: [ {
            test: /\.js$/,
            loader: 'babel-loader',
            include: [ resolve( 'src' ), resolve( 'debug' ) ]
        } ]
    },
    devServer: {
        clientLogLevel: 'warning',
        hot: true,
        contentBase: false,
        host: HOST,
        port: PORT,
        compress: true,
        overlay: {
            warnings: false,
            errors: true
        },
        quiet: true,
        stats: {
            colors: true
        }
    },
    // cheap-module-eval-source-map is faster for development
    devtool: 'cheap-module-eval-source-map',
    plugins: plugins
}
