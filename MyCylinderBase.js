class MyCylinderBase extends CGFobject {
    /**
     * MyCylinderBase
     * @constructor
     * @param scene - Reference to MyScene object
     */
    constructor(scene, slices) {
        super(scene);
        this.slices = slices;
        this.initBuffers();
    };

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        this.angle = 360 / this.slices * Math.PI / 180;
        this.angle2 = 360;
        this.vertices.push(0, 0, 0);
        this.normals.push(0, 0, 1);
        this.texCoords.push(0.5, 0.5);

        for (var i = 0; i < this.slices; i++) {
            this.vertices.push(Math.cos(this.angle * i), Math.sin(this.angle * i), 0);
            this.normals.push(0, 0, 1);
            this.texCoords.push(1 - (Math.cos(this.angle * i) + 1) / 2, (Math.sin(this.angle * i) + 1) / 2);
        }

        for (var j = 0; j < this.slices; j++) {
            if (j + 1 == this.slices)
                this.indices.push(0, j + 1, 1);
            else
                this.indices.push(0, j + 1, j + 2);
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    };
};