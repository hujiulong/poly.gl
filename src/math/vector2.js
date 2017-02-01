export default class Vector2 {

    constructor( x = 0, y = 0 ) {
        this.x = x;
        this.y = y;
    }

    get width() {

        return this.x;

    }

    set width( value ) {

        this.x = value;

    }

    get height() {

        return this.y;

    }

    set height( value ) {

        this.y = value;

    }

    set( x, y ) {
        this.x = x;
        this.y = y;

        return this;
    }

    clone() {
        return new this.constructor( this.x, this.y );
    }

    copy( vector ) {
        this.x = vector.x;
        this.y = vector.y;

        return this;
    }

    add( ...vectors ) {
        for ( const vector of vectors ) {
            this.x += vector.x;
            this.y += vector.y;
        }

        return this;
    }

    subtract( ...vectors ) {
        for ( const vector of vectors ) {
            this.x -= vector.x;
            this.y -= vector.y;
        }

        return this;
    }

    multiply( ...vectors ) {
        for ( const vector of vectors ) {
            this.x *= vector.x;
            this.y *= vector.y;
        }

        return this;
    }

    divide( ...vectors ) {
        for ( const vector of vectors ) {
            this.x /= vector.x;
            this.y /= vector.y;
        }

        return this;
    }

    scale( scale ) {
        this.x *= scale;
        this.y *= scale;

        return this;
    }

    dot( vector ) {

        return this.x * vector.x + this.y * vector.y;

    }

    equals( vector ) {

        return ( ( vector.x === this.x ) && ( vector.y === this.y ) );

    }

    negate() {
        this.x = -this.x;
        this.y = -this.y;

        return this;
    }

    length() {

        return Math.sqrt( this.x * this.x + this.y * this.y );

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

        return this;

    }

    toArray( array = [], offset = 0 ) {

        array[ offset ] = this.x;
        array[ offset + 1 ] = this.y;

        return array;

    }

}
