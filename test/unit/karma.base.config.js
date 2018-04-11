var alias = require( '../../scripts/alias' )
var webpack = require( 'webpack' )

var webpackConfig = {
    resolve: {
        alias: alias
    },
    module: {
        rules: [ {
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/
        } ]
    },
    plugins: [
        new webpack.DefinePlugin( {
            'process.env': {
                NODE_ENV: '"development"'
            }
        } )
    ],
    devtool: '#inline-source-map'
}

// shared config for all unit tests
module.exports = {
    frameworks: [ 'mocha', 'power-assert' ],
    files: [
        './index.js'
    ],
    preprocessors: {
        './index.js': [
            'webpack',
            'sourcemap',
            // 'espower'
        ],
    },
    client: {
        assert: {
            output: {
                maxDepth: 2
            }
        }
    },
    webpack: webpackConfig,
    webpackMiddleware: {
        noInfo: true
    },
    plugins: [
        // 'karma-jasmine',
        'karma-espower-preprocessor',
        'karma-power-assert',
        'karma-mocha',
        'karma-mocha-reporter',
        'karma-sourcemap-loader',
        'karma-webpack'
    ]
}
