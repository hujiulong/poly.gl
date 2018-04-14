/* eslint-disable max-len */

import { GL, Framebuffer, Renderbuffer, Texture2D, Buffer } from 'poly.gl';
import { fixture } from '../../fixtures';
const EPSILON = 0.0000001;
const TEST_CASES = [
    {
        title: 'Default attachments',
        getOpts: ( gl ) => ( {} ),
        pass: true
    },
    {
        title: 'No attachments',
        getOpts: ( gl ) => ( { attachments: {} } ),
        pass: false
    },
    {
        title: 'Simple Depth Renderbuffer + Color Texture',
        getOpts: ( gl ) => ( {
            attachments: {
                [ GL.COLOR_ATTACHMENT0 ]: new Texture2D( gl ),
                [ GL.DEPTH_ATTACHMENT ]: new Renderbuffer( gl, { format: GL.DEPTH_COMPONENT16 } )
            }
        } ),
        pass: true
    },
    {
        title: 'Simple Stencil Renderbuffer + Color Texture',
        getOpts: ( gl ) => ( {
            attachments: {
                [ GL.COLOR_ATTACHMENT0 ]: new Texture2D( gl ),
                [ GL.STENCIL_ATTACHMENT ]: new Renderbuffer( gl, { format: GL.STENCIL_INDEX8 } )
            }
        } ),
        pass: true
    },
    {
        title: 'Combined Depth/Stencil Renderbuffer + Color Texture',
        getOpts: ( gl ) => ( {
            attachments: {
                [ GL.COLOR_ATTACHMENT0 ]: new Texture2D( gl ),
                [ GL.DEPTH_STENCIL_ATTACHMENT ]: new Renderbuffer( gl, { format: GL.DEPTH_STENCIL } )
            }
        } ),
        pass: true
    }
    // {
    //   title: 'Separate Depth/Stencil Renderbuffers',
    //   getOpts: (gl) => ({
    //     attachments: {
    //       [GL.COLOR_ATTACHMENT0]: new Texture2D(gl),
    //       [GL.DEPTH]: new Renderbuffer(gl, {format: GL.DEPTH_COMPONENT16}),
    //       [GL.STENCIL]: new Renderbuffer(gl, {format: GL.STENCIL_INDEX8})
    //     }
    //   }),
    //   pass: false
    // }
    // {
    //   features: FEATURES.MULTIPLE_RENDER_TARGETS,
    //   getOpts(gl) {
    //     attachments: {
    //       [GL.COLOR_ATTACHMENT0]: new Texture2D(gl),
    //       [GL.COLOR_ARTTACHMENT1]: new Texture2D(gl),
    //       [GL.DEPTH]: new Renderbuffer(gl)
    //     }
    //   },
    //   pass: true
    // }
];

it( 'WebGL#Framebuffer construct/delete', done => {
    const { gl } = fixture;

    assert.throws(
        () => new Framebuffer(),
        /.*WebGLRenderingContext.*/,
        'Framebuffer throws on missing gl context' );

    const framebuffer = new Framebuffer( gl );
    assert.ok( framebuffer instanceof Framebuffer,
        'Framebuffer construction successful' );

    framebuffer.delete();
    assert.ok( framebuffer instanceof Framebuffer,
        'Framebuffer delete successful' );

    framebuffer.delete();
    assert.ok( framebuffer instanceof Framebuffer,
        'Framebuffer repeated delete successful' );

    done();
} );

it( 'Framebuffer#getDefaultFramebuffer', done => {
    const { gl } = fixture;

    const framebuffer = Framebuffer.getDefaultFramebuffer( gl );
    assert.ok( framebuffer instanceof Framebuffer,
        'getDefaultFramebuffer successful' );

    assert.throws(
        () => framebuffer.resize( { width: 1000, height: 1000 } ),
        'defaultFramebuffer.resize({width, height}) throws'
    );

    assert.doesNotThrow(
        () => framebuffer.resize(),
        'defaultFramebuffer.resize() successful'
    );

    assert.doesNotThrow(
        () => framebuffer.checkStatus(),
        'defaultFramebuffer status ok'
    );

    done();
} );

function testFramebuffer( gl ) {
    for ( const tc of TEST_CASES ) {
        let opts;

        assert.doesNotThrow(
            () => {
                opts = tc.getOpts( gl );
            },
            `Framebuffer options constructed for "${tc.title}"`
        );

        const testFramebufferOpts = () => {
            const framebuffer = new Framebuffer( gl, opts );

            framebuffer.resize( { width: 1000, height: 1000 } );
            framebuffer.checkStatus();

            framebuffer.resize( { width: 100, height: 100 } );
            framebuffer.checkStatus();

            framebuffer.delete( { recursive: true } );
        };

        if ( tc.pass ) {
            assert.doesNotThrow( testFramebufferOpts, `Framebuffer checkStatus success as expected for "${tc.title}"` );
        } else {
            assert.throws( testFramebufferOpts, `Framebuffer checkStatus failure as expected for "${tc.title}"` );
        }
    }
}

it( 'WebGL1#Framebuffer attachments', done => {
    const { gl } = fixture;
    testFramebuffer( gl );
    done();
} );

it( 'WebGL2#Framebuffer attachments', done => {
    const { gl2 } = fixture;
    if ( gl2 ) {
        testFramebuffer( gl2 );
    } else {
        assert.ok( true, 'WebGL2 not available, skipping tests' );
    }
    done();
} );

function testFramebufferResize( gl ) {
    const frameBufferOptions = {
        attachments: {
            [ GL.COLOR_ATTACHMENT0 ]: new Texture2D( gl ),
            [ GL.DEPTH_STENCIL_ATTACHMENT ]: new Renderbuffer( gl, { format: GL.DEPTH_STENCIL } )
        }
    };

    const framebuffer = new Framebuffer( gl, frameBufferOptions );

    framebuffer.resize( { width: 1000, height: 1000 } );
    assert.equal( framebuffer.width, 1000, 'Framebuffer width updated correctly on resize' );
    assert.equal( framebuffer.height, 1000, 'Framebuffer height updated correctly on resize' );
    framebuffer.checkStatus();

    framebuffer.resize( { width: 100, height: 100 } );
    assert.equal( framebuffer.width, 100, 'Framebuffer width updated correctly on resize' );
    assert.equal( framebuffer.height, 100, 'Framebuffer height updated correctly on resize' );
    framebuffer.checkStatus();
}

it( 'WebGL1#Framebuffer resize', done => {
    const { gl } = fixture;
    testFramebufferResize( gl );
    done();
} );

function testFramebufferReadPixels( gl ) {
    const frameBufferOptions = {
        attachments: {
            [ GL.COLOR_ATTACHMENT0 ]: new Texture2D( gl ),
            [ GL.DEPTH_STENCIL_ATTACHMENT ]: new Renderbuffer( gl, { format: GL.DEPTH_STENCIL } )
        }
    };

    const framebuffer = new Framebuffer( gl, frameBufferOptions );

    framebuffer.resize( { width: 1000, height: 1000 } );
    framebuffer.checkStatus();

    const clearColor = [ 1, 0.4, 0.25, 0.125 ];
    const expectedColor = [ 255, 102, 64, 32 ];

    framebuffer.clear( { color: clearColor } );

    const color = framebuffer.readPixels( {
        x: 0,
        y: 0,
        width: 1,
        height: 1,
        format: gl.RGBA,
        type: gl.UNSIGNED_BYTE } );

    assert.equal( color[ 0 ], expectedColor[ 0 ], 'Readpixels returned expected value for Red channel' );
    assert.equal( color[ 1 ], expectedColor[ 1 ], 'Readpixels returned expected value for Green channel' );
    assert.equal( color[ 2 ], expectedColor[ 2 ], 'Readpixels returned expected value for Blue channel' );
    assert.equal( color[ 3 ], expectedColor[ 3 ], 'Readpixels returned expected value for Alpha channel' );
}

it( 'WebGL1#Framebuffer readPixels', done => {
    const { gl } = fixture;
    testFramebufferReadPixels( gl );
    done();
} );

it( 'WebGL2#Framebuffer readPixels', done => {
    const { gl2 } = fixture;
    if ( gl2 ) {
        testFramebufferReadPixels( gl2 );
    } else {
        assert.ok( true, 'WebGL2 not available, skipping tests' );
    }
    done();
} );

function testReadPixelsToBuffer( bufferCreation ) {
    const { gl2 } = fixture;
    if ( !gl2 ) {
        assert.ok( true, 'WebGL2 not available, skipping tests' );
        return;
    }

    const gl = gl2;
    const { abs } = Math;
    const dataBytes = 6 * 4; // 6 floats
    const colorTexture = new Texture2D( gl, {
        format: GL.RGBA32F,
        type: GL.FLOAT,
        dataFormat: GL.RGBA,
        mipmap: false
    } );
    const pbo = new Buffer( gl, {
        bytes: dataBytes,
        type: GL.FLOAT
    } );
    const framebuffer = new Framebuffer( gl, {
        attachments: {
            [ GL.COLOR_ATTACHMENT0 ]: colorTexture
        }
    } );

    framebuffer.checkStatus();

    const color = new Float32Array( 6 );
    const clearColor = [ 0.25, -0.35, 12340.25, 0.005 ];

    framebuffer.clear( { color: clearColor } );

    const buffer = framebuffer.readPixelsToBuffer( {
        width: 1,
        height: 1,
        type: GL.FLOAT,
        buffer: bufferCreation ? null : pbo,
        byteOffset: 2 * 4 // start from 3rd element
    } );
    buffer.getData( { dstData: color } );

    assert.ok( abs( clearColor[ 0 ] - color[ 2 ] ) < EPSILON, 'Readpixels returned expected value for Red channel' );
    assert.ok( abs( clearColor[ 1 ] - color[ 3 ] ) < EPSILON, 'Readpixels returned expected value for Green channel' );
    assert.ok( abs( clearColor[ 2 ] - color[ 4 ] ) < EPSILON, 'Readpixels returned expected value for Blue channel' );
    assert.ok( abs( clearColor[ 3 ] - color[ 5 ] ) < EPSILON, 'Readpixels returned expected value for Alpha channel' );

}

it( 'WebGL#Framebuffer readPixelsToBuffer', done => {
    testReadPixelsToBuffer( false );
    done();
} );

it( 'WebGL#Framebuffer readPixelsToBuffer (buffer creation)', done => {
    testReadPixelsToBuffer( true );
    done();
} );

/*

import {TEXTURE_FORMATS} from 'poly.gl/webgl/texture';

const RGB_TO = {
  [GL.UNSIGNED_BYTE]: (r, g, b) => [r * 256, g * 256, b * 256],
  [GL.UNSIGNED_SHORT_5_6_5]: (r, g, b) => r * 32 << 11 + g * 64 << 6 + b * 32
};
// const RGB_FROM = {
//   [GL.UNSIGNED_BYTE]: v => [v[0] / 256, v[1] / 256, v[2] / 256],
//   [GL.UNSIGNED_SHORT_5_6_5]: v => [v >> 11 / 32, v >> 6 % 64 / 64, v % 32 * 32]
// };

const DATA = [1, 0.5, 0.25, 0.125];
const TEXTURE_DATA = {
  [GL.UNSIGNED_BYTE]: new Uint8Array(RGB_TO[GL.UNSIGNED_BYTE](DATA)),
  [GL.UNSIGNED_SHORT_5_6_5]: new Uint16Array(RGB_TO[GL.UNSIGNED_SHORT_5_6_5](DATA))
};
const DEFAULT_TEXTURE_DATA = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

test('WebGL2#Framebuffer texture attach and read', done => {
  const {gl2} = fixture;

  if (!gl2) {
    t.comment('WebGL2 not available, skipping tests');
    done();
    return;
  }

  const framebuffer = new Framebuffer(gl2, {depth: true, width: 1, height: 1, check: false});

  for (let format in TEXTURE_FORMATS) {
    const textureFormat = TEXTURE_FORMATS[format];

    const {dataFormat, types, compressed} = textureFormat;
    format = Number(format);

    if (Texture2D.isSupported(gl2, {format}) && !compressed) {

      let texture;

      for (const type of types) {
        // texture = new Texture2D(gl2, Object.assign({format, dataFormat, type}));
        // assert.equal(texture.format, format,
        //   `Texture2D({format: ${glKey(format)}, type: ${glKey(type)}, dataFormat: ${glKey(dataFormat)}) created`);
        // texture.delete()
        const data = TEXTURE_DATA[type] || DEFAULT_TEXTURE_DATA;
        texture = new Texture2D(gl2, {format, dataFormat, type, data, width: 1, height: 1});
        assert.equal(texture.format, format,
          `Texture2D({format: ${glKey(format)}, type: ${glKey(type)}, dataFormat: ${glKey(dataFormat)}) created`);

        framebuffer.attach({
          [GL.COLOR_ATTACHMENT0]: texture
        });
        assert.doesNotThrow(
          () => framebuffer.checkStatus(),
          'Framebuffer is attachment complete'
        );

        let pixels;
        assert.doesNotThrow(
          () => {
            pixels = framebuffer.readPixels();
          },
          'Framebuffer.readPixels returned'
        );
        assert.ok(pixels, 'Received pixels');
        texture.delete();
      }
    }
  }

  done();
});
*/

it( 'WebGL2#Framebuffer blit', done => {
    const { gl2 } = fixture;
    if ( gl2 ) {

        assert.doesNotThrow(
            () => {
                const framebufferSrc = new Framebuffer( gl2 );
                const framebufferDst = new Framebuffer( gl2 );
                framebufferDst.blit( {
                    srcFramebuffer: framebufferSrc,
                    srcX0: 0,
                    srcY0: 0,
                    srcX1: 1,
                    srcY1: 1,
                    dstX0: 0,
                    dstY0: 0,
                    dstX1: 1,
                    dstY1: 1,
                    color: true,
                    depth: true,
                    stencil: true } );
            },
            'Framebuffer blit successful'
        );
    } else {
        assert.ok( true, 'WebGL2 not available, skipping tests' );
    }
    done();
} );
