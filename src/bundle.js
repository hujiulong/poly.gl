/* Generate pre-bundled script that can be used in browser without browserify */
/* global window */
import 'babel-polyfill';
import './index';
import * as addons from './addons';
import poly from './globals';
poly.addons = addons;

// Export all PolyGL objects as members of global polygl variable
if ( typeof window !== 'undefined' ) {
    window.PolyGL = poly;
}
