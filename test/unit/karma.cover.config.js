var base = require( './karma.base.config.js' )

module.exports = function ( config ) {
    var options = Object.assign( base, {
        browsers: [ 'Chrome' ],
        reporters: [ 'mocha', 'coverage' ],
        coverageReporter: {
            reporters: [ {
                type: 'lcov',
                dir: '../../coverage',
                subdir: '.'
            },
            {
                type: 'text-summary',
                dir: '../../coverage',
                subdir: '.'
            }
            ]
        },
        singleRun: true,
        plugins: base.plugins.concat( [
            'karma-coverage',
            'karma-chrome-launcher'
        ] )
    } )

    // add babel-plugin-istanbul for code instrumentation
    options.webpack.module.rules[ 0 ].options = {
        plugins: [
            [ 'istanbul', {
                exclude: [
                    'test/'
                ]
            } ]
        ]
    }

    config.set( options )
}
