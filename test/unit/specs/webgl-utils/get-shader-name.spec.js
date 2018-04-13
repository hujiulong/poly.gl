import getShaderName from 'poly.gl/webgl-utils/get-shader-name';

const SHADER_1 = `\
uniform float floaty;
#define SHADER_NAME name-of-shader
main() {}
`;

const SHADER_2 = `\
uniform float floaty;
#define SHADER name
main() {}
`;

it( 'WebGL#getShaderName', done => {
    assert.equal( getShaderName( SHADER_1 ), 'name-of-shader', 'getShaderName extracted correct name' );
    assert.equal( getShaderName( SHADER_2 ), 'unnamed', 'getShaderName extracted default name' );
    done();
} );
