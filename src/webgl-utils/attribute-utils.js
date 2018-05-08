import assert from '../utils/assert';

const GL_POINTS = 0x0;
const GL_LINES = 0x1;
const GL_LINE_LOOP = 0x2;
const GL_LINE_STRIP = 0x3;
const GL_TRIANGLES = 0x4;
const GL_TRIANGLE_STRIP = 0x5;
const GL_TRIANGLE_FAN = 0x6;

// Counts the number of complete primitives given a number of vertices and a drawMode
export function getPrimitiveDrawMode( drawMode ) {
    switch ( drawMode ) {
        case GL_POINTS: return GL_POINTS;
        case GL_LINES: return GL_LINES;
        case GL_LINE_STRIP: return GL_LINES;
        case GL_LINE_LOOP: return GL_LINES;
        case GL_TRIANGLES: return GL_TRIANGLES;
        case GL_TRIANGLE_STRIP: return GL_TRIANGLES;
        case GL_TRIANGLE_FAN: return GL_TRIANGLES;
        default: assert( false ); return 0;
    }
}

// Counts the number of complete "primitives" given a number of vertices and a drawMode
export function getPrimitiveCount( { drawMode, vertexCount } ) {
    switch ( drawMode ) {
        case GL_POINTS:
        case GL_LINE_LOOP:
            return vertexCount;
        case GL_LINES: return vertexCount / 2;
        case GL_LINE_STRIP: return vertexCount - 1;
        case GL_TRIANGLES: return vertexCount / 3;
        case GL_TRIANGLE_STRIP:
        case GL_TRIANGLE_FAN:
            return vertexCount - 2;
        default: assert( false ); return 0;
    }
}

// Counts the number of vertices after splitting the vertex stream into separate "primitives"
export function getVertexCount( { drawMode, vertexCount } ) {
    const primitiveCount = getPrimitiveCount( { drawMode, vertexCount } );
    switch ( getPrimitiveDrawMode( drawMode ) ) {
        case GL_POINTS: return primitiveCount;
        case GL_LINES: return primitiveCount * 2;
        case GL_TRIANGLES: return primitiveCount * 3;
        default: assert( false ); return 0;
    }
}
