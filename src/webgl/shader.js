import { parseGLSLCompilerError, getShaderName } from '../webgl-utils';
import { assertWebGLContext } from './context';
import Resource from './resource';
import { uid, log } from '../utils';
import assert from '../utils/assert';

const ERR_SOURCE = 'Shader: GLSL source code must be a JavaScript string';

const GL_FRAGMENT_SHADER = 0x8B30;
const GL_VERTEX_SHADER = 0x8B31;
const GL_COMPILE_STATUS = 0x8B81;
const GL_SHADER_TYPE = 0x8B4F;

// For now this is an internal class
export class Shader extends Resource {

    static getTypeName( shaderType ) {
        switch ( shaderType ) {
            case GL_VERTEX_SHADER: return 'vertex-shader';
            case GL_FRAGMENT_SHADER: return 'fragment-shader';
            default: assert( false ); return 'unknown';
        }
    }

    /* eslint-disable max-statements */
    constructor( gl, source, shaderType ) {
        assertWebGLContext( gl );
        assert( typeof source === 'string', ERR_SOURCE );

        super( gl, { id: getShaderName( source ) || uid( Shader.getTypeName( shaderType ) ) } );

        this.shaderType = shaderType;
        this.source = source;

        this.opts.source = source;
        this.initialize( this.opts );
    }

    initialize( { source } ) {
        const shaderName = getShaderName( source );
        if ( shaderName ) {
            this.id = uid( shaderName );
        }
        this._compile( source );
        this.opts.source = source;
    }

    // Accessors

    getParameter( pname ) {
        return this.gl.getShaderParameter( this.handle, pname );
    }

    toString() {
        return `${this.getTypeName( this.shaderType )}:${this.id}`;
    }

    getName() {
        return getShaderName( this.opts.source ) || 'unnamed-shader';
    }

    getSource() {
        return this.gl.getShaderSource( this.handle );
    }

    // Debug method - Returns translated source if available
    getTranslatedSource() {
        const extension = this.gl.getExtension( 'WEBGL_debug_shaders' );
        return extension
            ? extension.getTranslatedShaderSource( this.handle )
            : 'No translated source available. WEBGL_debug_shaders not implemented';
    }

    // PRIVATE METHODS
    _compile() {
        this.gl.shaderSource( this.handle, this.source );
        this.gl.compileShader( this.handle );

        // TODO - For performance reasons, avoid checking shader compilation errors on production?
        // TODO - Load log even when no error reported, to catch warnings?
        // https://gamedev.stackexchange.com/questions/30429/how-to-detect-glsl-warnings
        const compileStatus = this.getParameter( GL_COMPILE_STATUS );
        if ( !compileStatus ) {
            const infoLog = this.gl.getShaderInfoLog( this.handle );
            const { shaderName, errors, warnings } =
        parseGLSLCompilerError( infoLog, this.source, this.shaderType );
            log.error( `GLSL compilation errors in ${shaderName}\n${errors}` );
            log.warn( `GLSL compilation warnings in ${shaderName}\n${warnings}` );
            throw new Error( `GLSL compilation errors in ${shaderName}` );
        }
    }

    _deleteHandle() {
        this.gl.deleteShader( this.handle );
    }

    _getOptsFromHandle() {
        return {
            type: this.getParameter( GL_SHADER_TYPE ),
            source: this.getSource()
        };
    }
}

export class VertexShader extends Shader {
    constructor( gl, source ) {
        super( gl, source, GL_VERTEX_SHADER );
    }

    // PRIVATE METHODS
    _createHandle() {
        return this.gl.createShader( GL_VERTEX_SHADER );
    }
}

export class FragmentShader extends Shader {
    constructor( gl, source ) {
        super( gl, source, GL_FRAGMENT_SHADER );
    }

    // PRIVATE METHODS
    _createHandle() {
        return this.gl.createShader( GL_FRAGMENT_SHADER );
    }
}
