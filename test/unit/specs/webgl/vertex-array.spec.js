
import { GL, createGLContext } from 'poly.gl';
import { VertexArray } from 'poly.gl';

const fixture = {
    gl: createGLContext()
};

it( 'WebGL#VertexArray construct/delete', done => {
    const { gl } = fixture;

    if ( !VertexArray.isSupported( gl ) ) {
        assert.ok( true, '- VertexArray not supported, skipping tests' );
        done();
        return;
    }

    assert.throws(
        () => new VertexArray(),
        'VertexArray throws on missing gl context' );

    const vao = new VertexArray( gl );
    assert.ok( vao instanceof VertexArray, 'VertexArray construction successful' );

    vao.delete();
    assert.ok( vao instanceof VertexArray, 'VertexArray delete successful' );

    vao.delete();
    assert.ok( vao instanceof VertexArray, 'VertexArray repeated delete successful' );

    done();
} );

it( 'WebGL#VertexAttributes#enable', done => {
    const gl = createGLContext();

    const vertexAttributes = VertexArray.getDefaultArray( gl );

    const MAX_ATTRIBUTES = VertexArray.getMaxAttributes( gl );
    assert.ok( MAX_ATTRIBUTES >= 8, 'vertexAttributes.getMaxAttributes() >= 8' );

    for ( let i = 0; i < MAX_ATTRIBUTES; i++ ) {
        assert.equal( vertexAttributes.getParameter( GL.VERTEX_ATTRIB_ARRAY_ENABLED, { location: i } ), false,
            `vertex attribute ${i} should initially be disabled` );
    }

    for ( let i = 0; i < MAX_ATTRIBUTES; i++ ) {
        vertexAttributes.enable( i );
    }

    for ( let i = 0; i < MAX_ATTRIBUTES; i++ ) {
        assert.equal( vertexAttributes.getParameter( GL.VERTEX_ATTRIB_ARRAY_ENABLED, { location: i } ), true,
            `vertex attribute ${i} should now be enabled` );
    }

    for ( let i = 0; i < MAX_ATTRIBUTES; i++ ) {
        vertexAttributes.disable( i );
    }

    assert.equal( vertexAttributes.getParameter( GL.VERTEX_ATTRIB_ARRAY_ENABLED, { location: 0 } ), true,
        'vertex attribute 0 should **NOT** be disabled' );
    for ( let i = 1; i < MAX_ATTRIBUTES; i++ ) {
        assert.equal( vertexAttributes.getParameter( GL.VERTEX_ATTRIB_ARRAY_ENABLED, { location: i } ), false,
            `vertex attribute ${i} should now be disabled` );
    }

    done();
} );

it( 'WebGL#vertexAttributes#WebGL2 support', done => {
    const gl = createGLContext( { webgl2: true } );

    if ( !VertexArray.isSupported( gl, { instancedArrays: true } ) ) {
        assert.ok( true, '- instanced arrays not enabled: skipping tests' );
        done();
        return;
    }

    const vertexAttributes = VertexArray.getDefaultArray( gl );

    const MAX_ATTRIBUTES = VertexArray.getMaxAttributes( gl );

    for ( let i = 0; i < MAX_ATTRIBUTES; i++ ) {
        assert.equal( vertexAttributes.getParameter( GL.VERTEX_ATTRIB_ARRAY_DIVISOR, { location: i } ), 0,
            `vertex attribute ${i} should have 0 divisor` );
    }

    done();
} );
