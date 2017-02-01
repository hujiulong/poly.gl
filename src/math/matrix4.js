import Vector3 from './vector3'

/**
 * Matrix4是列主序的，和GLSL的矩阵类型保持一致
 */
export default class Matrix4 {

    constructor(
        n11 = 1, n12 = 0, n13 = 0, n14 = 0,
        n21 = 0, n22 = 1, n23 = 0, n24 = 0,
        n31 = 0, n32 = 0, n33 = 1, n34 = 0,
        n41 = 0, n42 = 0, n43 = 0, n44 = 1
    ) {

        this.elements = [];

        this.set( n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44 );

    }

    set( n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44 ) {
        const te = this.elements;

        [
            te[ 0 ], te[ 4 ], te[ 8 ], te[ 12 ],
            te[ 1 ], te[ 5 ], te[ 9 ], te[ 13 ],
            te[ 2 ], te[ 6 ], te[ 10 ], te[ 14 ],
            te[ 3 ], te[ 7 ], te[ 11 ], te[ 15 ]
        ] = [
            n11, n12, n13, n14,
            n21, n22, n23, n24,
            n31, n32, n33, n34,
            n41, n42, n43, n44
        ];

        return this;
    }

    clone() {
        return new this.constructor().fromArray( this.elements );
    }

    copy( matrix ) {

        const te = this.elements;
        const me = matrix.elements;

        for ( let i = 0; i < te.length; i++ ) {
            te[ i ] = me[ i ];
        }

        return this;
    }

    identity() {

        this.set(

            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1

        );

        return this;

    }

    multiply( matrix ) {

        const te = this.elements;
        const me = matrix.elements;

        /* eslint-disable one-var */
        const n11 = te[ 0 ], n12 = te[ 4 ], n13 = te[ 8 ], n14 = te[ 12 ];
        const n21 = te[ 1 ], n22 = te[ 5 ], n23 = te[ 9 ], n24 = te[ 13 ];
        const n31 = te[ 2 ], n32 = te[ 6 ], n33 = te[ 10 ], n34 = te[ 14 ];
        const n41 = te[ 3 ], n42 = te[ 7 ], n43 = te[ 11 ], n44 = te[ 15 ];

        const m11 = me[ 0 ], m12 = me[ 4 ], m13 = me[ 8 ], m14 = me[ 12 ];
        const m21 = me[ 1 ], m22 = me[ 5 ], m23 = me[ 9 ], m24 = me[ 13 ];
        const m31 = me[ 2 ], m32 = me[ 6 ], m33 = me[ 10 ], m34 = me[ 14 ];
        const m41 = me[ 3 ], m42 = me[ 7 ], m43 = me[ 11 ], m44 = me[ 15 ];
        /* eslint-disable one-var */

        te[ 0 ] = n11 * m11 + n12 * m21 + n13 * m31 + n14 * m41;
        te[ 4 ] = n11 * m12 + n12 * m22 + n13 * m32 + n14 * m42;
        te[ 8 ] = n11 * m13 + n12 * m23 + n13 * m33 + n14 * m43;
        te[ 12 ] = n11 * m14 + n12 * m24 + n13 * m34 + n14 * m44;

        te[ 1 ] = n21 * m11 + n22 * m21 + n23 * m31 + n24 * m41;
        te[ 5 ] = n21 * m12 + n22 * m22 + n23 * m32 + n24 * m42;
        te[ 9 ] = n21 * m13 + n22 * m23 + n23 * m33 + n24 * m43;
        te[ 13 ] = n21 * m14 + n22 * m24 + n23 * m34 + n24 * m44;

        te[ 2 ] = n31 * m11 + n32 * m21 + n33 * m31 + n34 * m41;
        te[ 6 ] = n31 * m12 + n32 * m22 + n33 * m32 + n34 * m42;
        te[ 10 ] = n31 * m13 + n32 * m23 + n33 * m33 + n34 * m43;
        te[ 14 ] = n31 * m14 + n32 * m24 + n33 * m34 + n34 * m44;

        te[ 3 ] = n41 * m11 + n42 * m21 + n43 * m31 + n44 * m41;
        te[ 7 ] = n41 * m12 + n42 * m22 + n43 * m32 + n44 * m42;
        te[ 11 ] = n41 * m13 + n42 * m23 + n43 * m33 + n44 * m43;
        te[ 15 ] = n41 * m14 + n42 * m24 + n43 * m34 + n44 * m44;

        return this;

    }

    determinant() {

        const te = this.elements;

        const [
            n11, n12, n13, n14,
            n21, n22, n23, n24,
            n31, n32, n33, n34,
            n41, n42, n43, n44
        ] = te;

        const t11 = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44;
        const t12 = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44;
        const t13 = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44;
        const t14 = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;

        return n11 * t11 + n21 * t12 + n31 * t13 + n41 * t14;
    }

    transpose() {

        const te = this.elements;

        // exchange a and b: [ a, b ] = [ b, a ]

        [ te[ 1 ], te[ 4 ] ] = [ te[ 4 ], te[ 1 ] ];
        [ te[ 2 ], te[ 8 ] ] = [ te[ 8 ], te[ 2 ] ];
        [ te[ 6 ], te[ 9 ] ] = [ te[ 9 ], te[ 6 ] ];

        [ te[ 3 ], te[ 12 ] ] = [ te[ 12 ], te[ 3 ] ];
        [ te[ 7 ], te[ 13 ] ] = [ te[ 13 ], te[ 7 ] ];
        [ te[ 11 ], te[ 14 ] ] = [ te[ 14 ], te[ 11 ] ];

        return this;

    }

    invert() {

        const te = this.elements;

        const [
            n11, n12, n13, n14,
            n21, n22, n23, n24,
            n31, n32, n33, n34,
            n41, n42, n43, n44
        ] = te;

        const t11 = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44;
        const t12 = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44;
        const t13 = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44;
        const t14 = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;

        const det = n11 * t11 + n21 * t12 + n31 * t13 + n41 * t14;

        if ( det === 0 ) {

            return null;

        }

        const detInv = 1 / det;

        te[ 0 ] = t11 * detInv;
        te[ 1 ] = ( n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44 ) * detInv;
        te[ 2 ] = ( n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44 ) * detInv;
        te[ 3 ] = ( n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43 ) * detInv;

        te[ 4 ] = t12 * detInv;
        te[ 5 ] = ( n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44 ) * detInv;
        te[ 6 ] = ( n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44 ) * detInv;
        te[ 7 ] = ( n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43 ) * detInv;

        te[ 8 ] = t13 * detInv;
        te[ 9 ] = ( n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44 ) * detInv;
        te[ 10 ] = ( n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44 ) * detInv;
        te[ 11 ] = ( n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43 ) * detInv;

        te[ 12 ] = t14 * detInv;
        te[ 13 ] = ( n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34 ) * detInv;
        te[ 14 ] = ( n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34 ) * detInv;
        te[ 15 ] = ( n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33 ) * detInv;

        return this;

    }

    translate( x, y, z ) {
        const te = this.elements;

        [
            te[ 12 ],
            te[ 13 ],
            te[ 14 ],
            te[ 15 ]
        ] = [
            te[ 0 ] * x + te[ 4 ] * y + te[ 8 ] * z + te[ 12 ],
            te[ 1 ] * x + te[ 5 ] * y + te[ 9 ] * z + te[ 13 ],
            te[ 2 ] * x + te[ 6 ] * y + te[ 10 ] * z + te[ 14 ],
            te[ 3 ] * x + te[ 7 ] * y + te[ 11 ] * z + te[ 15 ]
        ]

        return this;
    }

    rotateX( radians ) {
        const te = this.elements;

        const c = Math.cos( radians );
        const s = Math.sin( radians );

        const [
            n12, n13,
            n22, n23,
            n32, n33,
            n42, n43
        ] = [
            te[ 4 ], te[ 8 ],
            te[ 5 ], te[ 9 ],
            te[ 6 ], te[ 10 ],
            te[ 7 ], te[ 11 ],
        ];

        [
            te[ 4 ], te[ 8 ],
            te[ 5 ], te[ 9 ],
            te[ 6 ], te[ 10 ],
            te[ 7 ], te[ 11 ],
        ] = [
            n12 * c + n13 * s, n13 * c - n12 * s,
            n22 * c + n23 * s, n23 * c - n22 * s,
            n32 * c + n33 * s, n33 * c - n32 * s,
            n42 * c + n43 * s, n43 * c - n42 * s
        ];

        return this;
    }

    rotateY( radians ) {
        const te = this.elements;

        const c = Math.cos( radians );
        const s = Math.sin( radians );

        const [
            n11, n13,
            n21, n23,
            n31, n33,
            n41, n43
        ] = [
            te[ 0 ], te[ 8 ],
            te[ 1 ], te[ 9 ],
            te[ 2 ], te[ 10 ],
            te[ 3 ], te[ 11 ],
        ];

        [
            te[ 0 ], te[ 8 ],
            te[ 1 ], te[ 9 ],
            te[ 2 ], te[ 10 ],
            te[ 3 ], te[ 11 ],
        ] = [
            n11 * c - n13 * s, n11 * s + n13 * c,
            n21 * c - n23 * s, n21 * s + n23 * c,
            n31 * c - n33 * s, n33 * s + n33 * c,
            n41 * c - n43 * s, n41 * s + n43 * c
        ];

        return this;
    }

    rotateZ( radians ) {
        const te = this.elements;

        const c = Math.cos( radians );
        const s = Math.sin( radians );

        const [
            n11, n12,
            n21, n22,
            n31, n32,
            n41, n42
        ] = [
            te[ 0 ], te[ 4 ],
            te[ 1 ], te[ 5 ],
            te[ 2 ], te[ 6 ],
            te[ 3 ], te[ 7 ]
        ];

        [
            te[ 0 ], te[ 4 ],
            te[ 1 ], te[ 5 ],
            te[ 2 ], te[ 6 ],
            te[ 3 ], te[ 7 ]
        ] = [
            n11 * c + n12 * s, n12 * c - n11 * s,
            n21 * c + n22 * s, n22 * c - n21 * s,
            n31 * c + n32 * s, n32 * c - n31 * s,
            n41 * c + n42 * s, n42 * c - n41 * s
        ];

        return this;
    }

    rotateXYZ( rx, ry, rz ) {

        return this.rotateX( rx ).rotateY( ry ).rotateZ( rz );

    }

    rotateAxis( axis, radians ) {
        // TODO
        return this;
    }

    orthographic( left, right, top, bottom, near = 0.1, far = 1000 ) {

        const te = this.elements;
        const w = right - left;
        const h = top - bottom;
        const p = far - near;

        const x = ( right + left ) / w;
        const y = ( top + bottom ) / h;
        const z = ( far + near ) / p;

        [
            te[ 0 ], te[ 4 ], te[ 8 ], te[ 12 ],
            te[ 1 ], te[ 5 ], te[ 9 ], te[ 13 ],
            te[ 2 ], te[ 6 ], te[ 10 ], te[ 14 ],
            te[ 3 ], te[ 7 ], te[ 11 ], te[ 15 ]
        ] = [
            2 / w, 0, 0, -x,
            0, 2 / h, 0, -y,
            0, 0, -2 / p, -z,
            0, 0, 0, 1
        ];

        return this;
    }

    perspective( { fov = Math.PI / 4, aspect = 1, near = 0.1, far = 1000 } = {} ) {

        const te = this.elements;

        const top = near * Math.tan( fov * 0.5 );
        const bottom = -top;
        const left = bottom * aspect;
        const right = top * aspect;

        const x = 2 * near / ( right - left );
        const y = 2 * near / ( top - bottom );

        const a = ( right + left ) / ( right - left );
        const b = ( top + bottom ) / ( top - bottom );
        const c = -( far + near ) / ( far - near );
        const d = -2 * far * near / ( far - near );

        [
            te[ 0 ], te[ 4 ], te[ 8 ], te[ 12 ],
            te[ 1 ], te[ 5 ], te[ 9 ], te[ 13 ],
            te[ 2 ], te[ 6 ], te[ 10 ], te[ 14 ],
            te[ 3 ], te[ 7 ], te[ 11 ], te[ 15 ]
        ] = [
            x, 0, a, 0,
            0, y, b, 0,
            0, 0, c, d,
            0, 0, -1, 0
        ];

        return this;

    }

    lookAt( { eye, target = new Vector3( 0, 0, 0 ), up = new Vector3( 0, 1, 0 ) } = {} ) {
        const te = this.elements;

        const x = new Vector3();
        const y = new Vector3();
        const z = new Vector3();

        z.copy( eye ).subtract( target );

        if ( z.length() === 0 ) {
            z.z = 1;
        }

        z.normalize();

        x.copy( up ).cross( z );

        if ( x.length() === 0 ) {

            // up and z are parallel
            if ( Math.abs( up.z ) === 1 ) {
                z.x += 0.0001;
            } else {
                z.z += 0.0001;
            }

            z.normalize();
            x.copy( up ).cross( z );
        }

        x.normalize();

        y.copy( z ).cross( x );

        [
            te[ 0 ], te[ 4 ], te[ 8 ], te[ 12 ],
            te[ 1 ], te[ 5 ], te[ 9 ], te[ 13 ],
            te[ 2 ], te[ 6 ], te[ 10 ], te[ 14 ],
            te[ 3 ], te[ 7 ], te[ 11 ], te[ 15 ]
        ] = [
            x.x, x.y, x.z, -x.dot( eye ),
            y.x, y.y, y.z, -y.dot( eye ),
            z.x, z.y, z.z, -z.dot( eye ),
            0, 0, 0, 1
        ];

        return this;

    }

    fromArray( array, offset = 0 ) {

        const te = this.elements;

        for ( let i = 0; i < te.length; i++ ) {

            te[ i ] = array[ i + offset ];

        }

        return this;

    }

    toArray( array = [], offset = 0 ) {

        const te = this.elements;

        for ( let i = 0; i < te.length; i++ ) {

            array[ i + offset ] = te[ i ];

        }

        return array;

    }

}
