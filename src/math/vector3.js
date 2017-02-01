export default class Vector3 {

    constructor( x = 0, y = 0, z = 0 ) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    set( x, y, z ) {
        this.x = x;
        this.y = y;
        this.z = z;

        return this;
    }

    clone() {
        return new this.constructor( this.x, this.y, this.z );
    }

    copy( vector ) {
        this.x = vector.x;
        this.y = vector.y;
        this.z = vector.z;

        return this;
    }

    add( ...vectors ) {
        for ( const vector of vectors ) {
            this.x += vector.x;
            this.y += vector.y;
            this.z += vector.z;
        }

        return this;
    }

    subtract( ...vectors ) {
        for ( const vector of vectors ) {
            this.x -= vector.x;
            this.y -= vector.y;
            this.z -= vector.z;
        }

        return this;
    }

    multiply( ...vectors ) {
        for ( const vector of vectors ) {
            this.x *= vector.x;
            this.y *= vector.y;
            this.z *= vector.z;
        }

        return this;
    }

    divide( ...vectors ) {
        for ( const vector of vectors ) {
            this.x /= vector.x;
            this.y /= vector.y;
            this.z /= vector.z;
        }

        return this;
    }

    scale( scale ) {
        this.x *= scale;
        this.y *= scale;
        this.z *= scale;

        return this;
    }

    cross( vector ) {

        const [ x, y, z ] = [ this.x, this.y, this.z ];

        this.x = y * vector.z - z * vector.y;
        this.y = z * vector.x - x * vector.z;
        this.z = x * vector.y - y * vector.x;

        return this;
    }

    dot( vector ) {

        return this.x * vector.x + this.y * vector.y + this.z * vector.z;

    }

    equals( vector ) {

        return ( ( vector.x === this.x ) && ( vector.y === this.y ) && ( vector.z === this.z ) );

    }

    negate() {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;

        return this;
    }

    length() {

        return Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z );

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

        return this;

    }

    toArray( array = [], offset = 0 ) {

        array[ offset ] = this.x;
        array[ offset + 1 ] = this.y;
        array[ offset + 2 ] = this.z;

        return array;

    }

}
