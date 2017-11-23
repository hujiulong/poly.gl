import pkg from './package.json'
import shader from 'rollup-plugin-shader'
import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify'

const production = process.env.BUILD === 'production';

const banner = `/* @preserve
 * poly.gl ${pkg.version}, ${pkg.description}
 * Copyright (c) 2018 ${pkg.author}
 */
`;

const plugins = [
    shader(),
    commonjs(),
    resolve(),
    babel( {
        exclude: 'node_modules/**'
    } )
];

const output = [
    {
        file: pkg.module,
        format: 'es',
        banner,
        exports: 'named',
        sourcemap: production ? true : 'inline',
        treeshake: production,
    }
];

if ( production ) {
    plugins.push( uglify() );
    output.push( {
        file: pkg.main,
        format: 'umd',
        name: pkg.name,
        banner,
        exports: 'named',
        sourcemap: true
    } );
}

export default {
    input: 'src/index.js',
    output,
    plugins
};
