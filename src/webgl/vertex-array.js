// WebGL2 VertexArray Objects Helper
import { glKey } from './gl-constants';
import { isWebGL2 } from './context';
import Resource from './resource';
import assert from '../utils/assert';
import { log } from '../utils';

/* eslint-disable camelcase */
const OES_vertex_array_object = 'OES_vertex_array_object';

const GL_ELEMENT_ARRAY_BUFFER = 0x8893;

// const GL_CURRENT_VERTEX_ATTRIB = 0x8626;

const GL_VERTEX_ATTRIB_ARRAY_ENABLED = 0x8622;
const GL_VERTEX_ATTRIB_ARRAY_SIZE = 0x8623;
const GL_VERTEX_ATTRIB_ARRAY_STRIDE = 0x8624;
const GL_VERTEX_ATTRIB_ARRAY_TYPE = 0x8625;
const GL_VERTEX_ATTRIB_ARRAY_NORMALIZED = 0x886A;
const GL_VERTEX_ATTRIB_ARRAY_POINTER = 0x8645;
const GL_VERTEX_ATTRIB_ARRAY_BUFFER_BINDING = 0x889F;

const GL_VERTEX_ATTRIB_ARRAY_INTEGER = 0x88FD;
const GL_VERTEX_ATTRIB_ARRAY_DIVISOR = 0x88FE;

const PARAMETERS = [
    GL_VERTEX_ATTRIB_ARRAY_ENABLED,
    GL_VERTEX_ATTRIB_ARRAY_SIZE,
    GL_VERTEX_ATTRIB_ARRAY_STRIDE,
    GL_VERTEX_ATTRIB_ARRAY_TYPE,
    GL_VERTEX_ATTRIB_ARRAY_NORMALIZED,
    GL_VERTEX_ATTRIB_ARRAY_POINTER,
    GL_VERTEX_ATTRIB_ARRAY_BUFFER_BINDING,

    GL_VERTEX_ATTRIB_ARRAY_INTEGER,
    GL_VERTEX_ATTRIB_ARRAY_DIVISOR
];

const ERR_ELEMENTS = 'elements must be GL.ELEMENT_ARRAY_BUFFER';

export default class VertexArray extends Resource {

    static isSupported( gl ) {
        return isWebGL2( gl ) || gl.getExtension( OES_vertex_array_object );
    }

    static getDefaultArray( gl ) {
        gl.poly = gl.poly || {};
        if ( !gl.poly.defaultVertexArray ) {
            gl.poly.defaultVertexArray = new VertexArray( gl, { handle: null } );
        }
        return gl.poly.defaultVertexArray;
    }

    static getMaxAttributes( gl ) {
        return gl.getParameter( gl.MAX_VERTEX_ATTRIBS );
    }

    get MAX_ATTRIBUTES() {
        return this.gl.getParameter( this.gl.MAX_VERTEX_ATTRIBS );
    }

    // Create a VertexArray
    constructor( gl, opts = {} ) {
        super( gl, opts );

        this.elements = null;
        this.buffers = {}; // new Array(this.MAX_VERTEX_ATTRIBS).fill(null);
        this.locations = {};
        this.names = {};
        this.drawParameters = {};

        this._bound = false;
        this._filledLocations = {};
        Object.seal( this );

        this.initialize( opts );
    }

    initialize( {
        buffers = {},
        elements = null,
        locations = {}
    } = {} ) {
        this.setLocations( locations );
        this.setBuffers( buffers, { clear: true } );
        this.setElements( elements );
    }

    get filledLocations() {
        return this._filledLocations;
    }

    // Register an optional buffer name to location mapping
    setLocations( locations ) {
        this.locations = locations;
        this.names = {};
    }

    // Set (bind) an elements buffer, for indexed rendering. Must be GL.ELEMENT_ARRAY_BUFFER
    setElements( elements ) {
        assert( !elements || elements.target === GL_ELEMENT_ARRAY_BUFFER, ERR_ELEMENTS );

        this.ext.bindVertexArray( this.handle );
        this.gl.bindBuffer( GL_ELEMENT_ARRAY_BUFFER, elements && elements.handle );
        this.ext.bindVertexArray( null );

        this.elements = elements;
        return this;
    }

    // Set (bind) an array or map of vertex array buffers, either in numbered or
    // named locations. (named locations requires `locations` to have been provided).
    // For names that are not present in `location`, the supplied buffers will be ignored.
    // if a single buffer of type GL.ELEMENT_ARRAY_BUFFER is present, it will be set as elements
    // @param {Object} buffers - An object map with attribute names being keys
    //   and values are expected to be instances of Buffer.

    _getBufferAndLayout( bufferData ) {
    // Check if buffer was supplied
        let buffer;
        let layout;
        if ( bufferData.handle ) {
            buffer = bufferData;
            layout = bufferData.layout;
        } else {
            buffer = bufferData.buffer;
            layout = Object.assign( {}, buffer.layout, bufferData.layout || {}, bufferData );
        }
        return { buffer, layout };
    }

    setBuffers( buffers, { clear = true } = {} ) {
        if ( clear ) {
            this.clearBindings();
        }
        const { locations, elements } = this._getLocations( buffers );

        this.ext.bindVertexArray( this.handle );

        // Process locations in order
        for ( const location in locations ) {
            const bufferData = locations[ location ];
            if ( bufferData ) {
                const { buffer, layout } = this._getBufferAndLayout( bufferData );
                this.setBuffer( { location, buffer, layout } );
                this.setDivisor( location, layout.instanced ? 1 : 0 );
                this.enable( location );
            } else {
                // DISABLE MISSING ATTRIBUTE
                this.disable( location );
            }
        }
        this.buffers = buffers;

        this.ext.bindVertexArray( null );

        if ( elements ) {
            this.setElements( elements );
        }
    }

    // Enable an attribute
    enable( location ) {
        this.bind( () => {
            this.gl.enableVertexAttribArray( location );
        } );
    }

    clearBindings( { disableZero = false } = {} ) {
        this.bind( () => {
            for ( const location in this._filledLocations ) {
                if ( this._filledLocations[ location ] && ( location > 0 || disableZero ) ) {
                    this.gl.disableVertexAttribArray( location );
                }
            }
            this._filledLocations = {};
        } );
    }

    // Disable an attribute
    // Perf penalty when disabling attribute 0:
    // https://stackoverflow.com/questions/20305231/webgl-warning-attribute-0-is-disabled-
    // this-has-significant-performance-penalt
    disable( location, disableZero = false ) {
        if ( location > 0 || disableZero ) {
            this.bind( () => {
                this.gl.disableVertexAttribArray( location );
            } );
        }
    }

    // Set the frequency divisor used for instanced rendering.
    setDivisor( location, divisor ) {
        this.bind( () => {
            this.ext.vertexAttribDivisor( location, divisor );
        } );
    }

    // Set a location in vertex attributes array to a buffer
    setBuffer( {
        location,
        buffer,
        target,
        layout
    } = {} ) {
        const { gl } = this;

        // Copy main data characteristics from buffer
        target = target !== undefined ? target : buffer.target;
        layout = layout !== undefined ? layout : buffer.layout;
        assert( target, 'setBuffer needs target' );
        assert( layout, 'setBuffer called on uninitialized buffer' );
        this._filledLocations[ location ] = true;

        this.bind( () => {
            // a non-zero named buffer object must be bound to the GL_ARRAY_BUFFER target
            buffer.bind( { target: gl.ARRAY_BUFFER } );

            const { size, type, normalized, stride, offset } = layout;
            // Attach _bound ARRAY_BUFFER with specified buffer format to location
            if ( !layout.integer ) {
                gl.vertexAttribPointer( location, size, type, normalized, stride, offset );
            } else {
                // specifies *integer* data formats and locations of vertex attributes
                assert( isWebGL2( gl ) );
                gl.vertexAttribIPointer( location, size, type, stride, offset );
            }
        } );

    }

    // Specify values for generic vertex attributes
    setGeneric( { location, array } ) {
        this._filledLocations[ location ] = true;
        switch ( array.constructor ) {
            case Float32Array:
                this._setGenericFloatArray( location, array );
                break;
            case Int32Array:
                this._setGenericIntArray( location, array );
                break;
            case Uint32Array:
                this._setGenericUintArray( location, array );
                break;
            default:
                this.setGenericValues( location, ...array );
        }
    }

    _setGenericFloatArray( location, array ) {
        const { gl } = this;
        switch ( array.length ) {
            case 1: gl.vertexAttrib1fv( location, array ); break;
            case 2: gl.vertexAttrib2fv( location, array ); break;
            case 3: gl.vertexAttrib3fv( location, array ); break;
            case 4: gl.vertexAttrib4fv( location, array ); break;
            default: assert( false );
        }
    }

    _setGenericIntArray( location, array ) {
        const { gl } = this;
        assert( isWebGL2( gl ) );
        switch ( array.length ) {
            case 1: gl.vertexAttribI1iv( location, array ); break;
            case 2: gl.vertexAttribI2iv( location, array ); break;
            case 3: gl.vertexAttribI3iv( location, array ); break;
            case 4: gl.vertexAttribI4iv( location, array ); break;
            default: assert( false );
        }
    }

    _setGenericUintArray( location, array ) {
        const { gl } = this;
        assert( isWebGL2( gl ) );
        switch ( array.length ) {
            case 1: gl.vertexAttribI1uiv( location, array ); break;
            case 2: gl.vertexAttribI2uiv( location, array ); break;
            case 3: gl.vertexAttribI3uiv( location, array ); break;
            case 4: gl.vertexAttribI4uiv( location, array ); break;
            default: assert( false );
        }
    }

    // Specify values for generic vertex attributes
    setGenericValues( location, v0, v1, v2, v3 ) {
        const { gl } = this;
        switch ( arguments.length - 1 ) {
            case 1: gl.vertexAttrib1f( location, v0 ); break;
            case 2: gl.vertexAttrib2f( location, v0, v1 ); break;
            case 3: gl.vertexAttrib3f( location, v0, v1, v2 ); break;
            case 4: gl.vertexAttrib4f( location, v0, v1, v2, v3 ); break;
            default: assert( false );
        }

    // assert(gl instanceof WebGL2RenderingContext, 'WebGL2 required');
    // Looks like these will check how many arguments were supplied?
    // gl.vertexAttribI4i(location, v0, v1, v2, v3);
    // gl.vertexAttribI4ui(location, v0, v1, v2, v3);
    }

    bind( funcOrHandle = this.handle ) {
        if ( typeof funcOrHandle !== 'function' ) {
            this.bindVertexArray( funcOrHandle );
            return this;
        }

        let value;

        if ( !this._bound ) {
            this.ext.bindVertexArray( this.handle );
            this._bound = true;

            value = funcOrHandle();

            this.ext.bindVertexArray( null );
            this._bound = false;
        } else {
            value = funcOrHandle();
        }

        return value;
    }

    // PRIVATE

    // Auto detect draw parameters from the complement of buffers provided
    _deduceDrawParameters() {
    // indexing is autodetected - buffer with target gl.ELEMENT_ARRAY_BUFFER
    // index type is saved for drawElement calls
        let isInstanced = false;
        let isIndexed = false;
        let indexType = null;

        // Check if we have an elements array buffer
        if ( this.elements ) {
            isIndexed = true;
            indexType = this.elements.layout.type;
        }

        // Check if any instanced buffers
        this.buffers.forEach( buffer => {
            if ( buffer.layout.instanced > 0 ) {
                isInstanced = true;
            }
        } );

        return { isInstanced, isIndexed, indexType };
    }
    //         this._filledLocations[bufferName] = true;

    _getLocations( buffers ) {
    // Try to extract elements and locations
        let elements = null;
        const locations = {};

        for ( const bufferName in buffers ) {
            const buffer = buffers[ bufferName ];

            // Check if this is an elements array
            if ( buffer && buffer.target === GL_ELEMENT_ARRAY_BUFFER ) {
                assert( !elements, 'Duplicate GL.ELEMENT_ARRAY_BUFFER' );
                // assert(location === undefined, 'GL.ELEMENT_ARRAY_BUFFER assigned to location');
                elements = buffer;
            }

            let location = Number( bufferName );
            // if key is a number, interpret as the location
            // if key is not a location number, assume it is a named buffer, look it up in supplied map
            if ( !Number.isFinite( location ) ) {
                location = this.locations[ bufferName ];
            }
            assert( Number.isFinite( location ) );

            assert( !locations[ location ], `Duplicate attribute for binding point ${location}` );
            locations[ location ] = buffer;
        }

        return { locations, elements };
    }

    _sortBuffersByLocation( buffers ) {
    // Try to extract elements and locations
        let elements = null;
        const locations = new Array( this._attributeCount ).fill( null );

        for ( const bufferName in buffers ) {
            const buffer = buffers[ bufferName ];

            // Check if this is an elements arrau
            if ( buffer.target === GL_ELEMENT_ARRAY_BUFFER ) {
                assert( !elements, 'Duplicate GL.ELEMENT_ARRAY_BUFFER' );
                // assert(location === undefined, 'GL.ELEMENT_ARRAY_BUFFER assigned to location');
                elements = buffer;
            } else if ( !this._warn[ bufferName ] ) {
                log.warn( 2, `${this._print( bufferName )} not used` );
                this._warn[ bufferName ] = true;
            }

            let location = Number( bufferName );
            // if key is a number, interpret as the location
            // if key is not a location number, assume it is a named buffer, look it up in supplied map
            if ( !Number.isFinite( location ) ) {
                location = this.locations[ bufferName ];
            }
            locations[ location ] = bufferName;
            assert( locations[ location ] === null, `Duplicate attribute for binding point ${location}` );
            locations[ location ] = location;
        }

        return { locations, elements };
    }

    // RESOURCE IMPLEMENTATION

    _createHandle() {
        return this.ext.createVertexArray();
    }

    _deleteHandle( handle ) {
        this.ext.deleteVertexArray( handle );
        return [ this.elements ];
    // return [this.elements, ...this.buffers];
    }

    // Generic getter for information about a vertex attribute at a given position
    // @param {GLuint} location - index of the vertex attribute.
    // @param {GLenum} pname - specifies the information to query.
    // @returns {*} - requested vertex attribute information (specified by pname)
    _getParameter( pname, { location } ) {
        assert( Number.isFinite( location ) );

        this.ext.bindVertexArray( this.handle );

        // Let the polyfill intercept the query
        let result;
        switch ( pname ) {
            case GL_VERTEX_ATTRIB_ARRAY_POINTER:
                result = this.gl.getVertexAttribOffset( location, pname );
                break;
            default:
                result = this.ext.getVertexAttrib( location, pname );
        }

        this.ext.bindVertexArray( null );
        return result;
    }

    _getData() {
        return new Array( this.MAX_ATTRIBUTES ).fill( 0 ).map( ( _, location ) => {
            const result = {};
            PARAMETERS.forEach( parameter => {
                result[ glKey( parameter ) ] = this.getParameter( parameter, { location } );
            } );
            return result;
        } );
    }

    _bind( handle ) {
        this.ext.bindVertexArray( handle );
    }
}
