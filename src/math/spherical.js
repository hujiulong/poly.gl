import { clamp } from './math'

export default class Spherical {

    constructor( radius = 1, phi = 0, theta = 0 ) {

        this.radius = radius;
        this.phi = phi; // up / down towards top and bottom pole
        this.theta = theta; // around the equator of the sphere

    }

    set( radius, phi, theta ) {

        this.radius = radius;
        this.phi = phi;
        this.theta = theta

    }

    clone() {

        return new this.constructor().copy( this );

    }

    copy( other ) {

        this.radius = other.radius;
        this.phi = other.phi;
        this.theta = other.theta;

        return this;

    }

    makeSafe() {

        const EPS = 0.000001;
        this.phi = Math.max( EPS, Math.min( Math.PI - EPS, this.phi ) );

        return this;

    }

    setFromVector3( vector ) {

        this.radius = vector.length();

        if ( this.radius === 0 ) {

            this.theta = 0;
            this.phi = 0;

        } else {

            this.theta = Math.atan2( vector.x, vector.z ); // equator angle around y-up axis
            this.phi = Math.acos( clamp( vector.y / this.radius, -1, 1 ) ); // polar angle

        }

        return this;

    }

}
