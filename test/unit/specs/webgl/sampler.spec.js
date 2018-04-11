
import { createGLContext, Sampler } from 'poly.gl';

import {
    testSamplerParameters, SAMPLER_PARAMETERS, SAMPLER_PARAMETERS_WEBGL2
} from './sampler.utils';

const fixture = {
    gl: createGLContext( { webgl2: true } )
};

it( 'WebGL2#Sampler setParameters', done => {
    const { gl } = fixture;

    if ( !Sampler.isSupported( gl ) ) {
        assert.ok( true, 'Sampler not available, skipping tests' );
        done();
        return;
    }

    let sampler = new Sampler( gl, {} );
    assert.ok( sampler instanceof Sampler, 'Sampler construction successful' );

    testSamplerParameters( { texture: sampler, parameters: SAMPLER_PARAMETERS } );
    testSamplerParameters( { texture: sampler, parameters: SAMPLER_PARAMETERS_WEBGL2 } );

    sampler = sampler.delete();
    assert.ok( sampler instanceof Sampler, 'Sampler delete successful' );

    done();
} );
