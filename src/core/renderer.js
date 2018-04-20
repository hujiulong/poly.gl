import { resizeDrawingBuffer } from '../webgl-utils';
import { createGLContext, clear } from '../webgl';

export default class Renderer {
    constructor( {
        canvas,
        gl,
        alpha = false,
        depth = true,
        stencil = true,
        antialias = true,
        preserveDrawingBuffer = false,
        useDevicePixels = true,
    } = {} ) {

        this.gl = null;
        this.canvas = null;

        this.alpha = alpha;
        this.depth = depth;
        this.stencil = stencil;
        this.antialias = antialias;
        this.preserveDrawingBuffer = preserveDrawingBuffer;

        if ( gl ) {
            assertWebGLContext( gl );
            this.gl = gl;
            this.canvas = gl.canvas;
        } else if ( canvas ) {

            assert( canvas instanceof HTMLCanvasElement, `canvas must be a HTMLCanvasElement` )

            this.canvas = canvas;
            this.gl = createGLContext( { canvas } );

        }

    }

    setSize( width, height ) {

        resizeDrawingBuffer( this.canvas, { useDevicePixels: this.useDevicePixels } );

    }

    getSize() {

        return {
            width: this.canvas.width,
            height: this.canvas.height
        }

    }

    setViewport( x, y, width, height ) {
        // TODO
    }

    getViewport() {
        // TODO
    }

    setScissor() {
        // TODO
    }

    clear( color, depth, stencil ) {

        clear( this.gl, { color, depth, stencil } );

    }

    clearColor() {

        this.clear( true, false, false );

    }

    clearDepth() {

        this.clear( false, true, false );

    }

    clearStencli() {

        this.clear( false, false, true );

    }

    render() {
        // TODO
    }
}
