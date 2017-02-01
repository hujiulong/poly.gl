export default class Vector4 {

    constructor( x = 0, y = 0, z = 0, w = 1 ) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    set( x, y, z, w ) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;

        return this;
    }

    clone() {
        return new this.constructor( this.x, this.y, this.z, this.w );
    }

    copy( vector ) {
        this.x = vector.x;
        this.y = vector.y;
        this.z = vector.z;
        this.w = vector.w;

        return this;
    }

    add( ...vectors ) {
        for ( const vector of vectors ) {
            this.x += vector.x;
            this.y += vector.y;
            this.z += vector.z;
            this.w += vector.w;
        }

        return this;
    }

    subtract( ...vectors ) {
        for ( const vector of vectors ) {
            this.x -= vector.x;
            this.y -= vector.y;
            this.z -= vector.z;
            this.w -= vector.w;
        }

        return this;
    }

    multiply( ...vectors ) {
        for ( const vector of vectors ) {
            this.x *= vector.x;
            this.y *= vector.y;
            this.z *= vector.z;
            this.w *= vector.w;
        }

        return this;
    }

    divide( ...vectors ) {
        for ( const vector of vectors ) {
            this.x /= vector.x;
            this.y /= vector.y;
            this.z /= vector.z;
            this.w /= vector.w;
        }

        return this;
    }

    scale( scale ) {
        this.x *= scale;
        this.y *= scale;
        this.z *= scale;
        this.w *= scale;

        return this;
    }

    dot( vector ) {

        return this.x * vector.x + this.y * vector.y + this.z * vector.z + this.w * vector.w;

    }

    equals( vector ) {

        return ( ( vector.x === this.x ) && ( vector.y === this.y ) && ( vector.z === this.z ) && ( vector.w === this.w ) );

    }

    negate() {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;
        this.w = -this.w;

        return this;
    }

    length() {

        return Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w );

    }

    normalize() {

        return this.scale( 1 / ( this.length() || 1 ) );

    }

    setLength( length ) {

        return this.normalize().scale( length );

    }

    fromArray( array, offset = 0 ) {

        this.x = array[ offset ];
        this.y = array[ offset + 1 ];
        this.z = array[ offset + 2 ];
        this.w = array[ offset + 2 ];

        return this;

    }

    toArray( array = [], offset = 0 ) {

        array[ offset ] = this.x;
        array[ offset + 1 ] = this.y;
        array[ offset + 2 ] = this.z;
        array[ offset + 3 ] = this.w;

        return array;

    }

}
