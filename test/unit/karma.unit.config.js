var base = require( './karma.base.config.js' )

module.exports = function ( config ) {
    config.set( Object.assign( base, {
        browsers: [ 'Chrome' ],
        reporters: [ 'mocha' ],
        singleRun: true,
        plugins: base.plugins.concat( [
            'karma-chrome-launcher',
            // 'karma-firefox-launcher',
            // 'karma-safari-launcher'
        ] )
    } ) )
}
