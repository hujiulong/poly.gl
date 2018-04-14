import { hasFeature, hasFeatures, getFeatures, FEATURES } from 'poly.gl';
import test from 'tape-catch';
// import sinon from 'sinon';

import { fixture } from 'poly.gl/test/setup';

// true: always supported in WebGL2, false: never supported in WebGL1
const WEBGL_FEATURES = {
    // API SUPPORT
    VERTEX_ARRAY_OBJECT: true,
    INSTANCED_RENDERING: true,
    MULTIPLE_RENDER_TARGETS: true,

    // FEATURES
    ELEMENT_INDEX_UINT32: true,
    BLEND_EQUATION_MINMAX: true,
    COLOR_ENCODING_SRGB: true,

    TEXTURE_DEPTH: true,
    TEXTURE_FLOAT: true,
    TEXTURE_HALF_FLOAT: true,

    COLOR_ATTACHMENT_FLOAT: false,
    COLOR_ATTACHMENT_HALF_FLOAT: false,

    // GLSL extensions
    GLSL_FRAG_DATA: true,
    GLSL_FRAG_DEPTH: true,
    GLSL_DERIVATIVES: true,
    GLSL_TEXTURE_LOD: true
};

test( 'webgl#caps#imports', t => {
    t.ok( typeof hasFeature === 'function', 'hasFeature defined' );
    t.ok( typeof hasFeatures === 'function', 'hasFeatures defined' );
    t.ok( typeof getFeatures === 'function', 'getFeatures defined' );
    t.end();
} );

test( 'webgl#caps#getFeatures', t => {
    const { gl } = fixture;

    const info = getFeatures( gl );

    for ( const cap in FEATURES ) {
        const value = info[ cap ];
        t.ok( value === false || value === true,
            `${cap}: is an allowed (boolean) value` );
    }

    t.end();
} );

test( 'webgl#caps#hasFeatures(WebGL1)', t => {
    const { gl } = fixture;
    t.ok( typeof hasFeatures === 'function', 'hasFeatures defined' );

    for ( const feature in WEBGL_FEATURES ) {
        if ( !WEBGL_FEATURES[ feature ] ) {
            t.equal( hasFeature( gl, feature ), false, `${feature} is never supported under WebGL1` );
        }
    }

    t.end();
} );

test( 'webgl#caps#hasFeatures(WebGL2)', t => {
    const { gl2 } = fixture;

    if ( gl2 ) {
        for ( const feature in WEBGL_FEATURES ) {
            if ( WEBGL_FEATURES[ feature ] ) {
                t.equals( hasFeature( gl2, feature ), true, `${feature} is always supported under WebGL2` );
            }
        }
    }

    t.end();
} );

/*
NOTE: Disabling the test as it crashes when tested by 'npm run test-brwoser'
 when it crashes it also leave global state modified, causing failure in other unit tests
test('webgl#caps#canCompileGLGSExtension', t => {
  const {gl} = fixture;
  const oldNavigator = window.navigator;

  t.ok(typeof canCompileGLGSExtension === 'function', 'canCompileGLGSExtension defined');

  // Non-IE version.
  const getShaderParameterStub = sinon.stub(gl, 'getShaderParameter');
  window.navigator = {
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.162 Safari/537.36'
  };
  t.equals(
    canCompileGLGSExtension(gl, FEATURES.GLSL_DERIVATIVES),
    true,
    'returns true when feature can be compiled'
  );
  t.notOk(getShaderParameterStub.called, 'should not call getShaderParameterStub');

  // Old-IE version.
  window.navigator = {
    userAgent: 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko'
  };

  getShaderParameterStub.returns(true);
  t.equals(
    canCompileGLGSExtension(gl, FEATURES.GLSL_DERIVATIVES),
    true,
    'returns true when feature can be compiled'
  );
  t.ok(getShaderParameterStub.called, 'should call getShaderParameterStub');

  getShaderParameterStub.returns(false);
  t.equals(
    canCompileGLGSExtension(gl, FEATURES.GLSL_DERIVATIVES),
    true,
    'memoizes previous call'
  );

  t.equals(
    canCompileGLGSExtension(gl, FEATURES.GLSL_TEXTURE_LOD),
    false,
    'returns false when feature can not be compiled'
  );

  t.throws(
    () => canCompileGLGSExtension(gl, 'feature.dne'),
    'should throw exception if feature does not exist'
  );

  // Restore the navigator to pre-test version.
  window.navigator = oldNavigator;
  getShaderParameterStub.restore();
  t.end();
});
*/
