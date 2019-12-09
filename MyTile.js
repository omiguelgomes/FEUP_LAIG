class MyTile extends CGFobject{
constructor(scene, x1, x2, z1, z2) {
    super(scene);
    this.x1 = x1;
    this.x2 = x2;
    this.z1 = z1;
    this.z2 = z2;

    this.initBuffers();
}

initBuffers() {
    this.vertices = [
        this.x1, 0, this.z1,	//0
        this.x2, 0, this.z1,	//1
        this.x1, 0, this.z2,	//2
        this.x2, 0, this.z2		//3
    ];

    //Counter-clockwise reference of vertices
    this.indices = [
        2, 1, 0,
        2, 3, 1
    ];

    //Facing Z positive
    this.normals = [
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0
    ];
    
    this.texCoords = [
        0, 1,
        1, 1,
        0, 0,
        1, 0
    ]
    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
}

/**
 * @method updateTexCoords
 * Updates the list of texture coordinates of the rectangle
 * @param {Array} coords - Array of texture coordinates
 */
updateTexCoords(coords) {
    this.texCoords = [...coords];
    this.updateTexCoordsGLBuffers();
}
}