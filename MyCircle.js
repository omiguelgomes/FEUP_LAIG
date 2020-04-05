class MyCircle extends CGFobject {
    constructor(scene, slices)
    {
        super(scene);
        this.slices = slices;
        this.initBuffers();
    }

    initBuffers()
    {
        var a_rad = 2 * Math.PI / this.slices;

     	this.vertices = [];
 		for (let i = 0; i < this.slices; i++)
 			this.vertices.push(Math.cos(i * a_rad), Math.sin(i * a_rad), 0);
         
        this.normals = [];
 		for (let i = 0; i < this.slices; i++)
            this.normals.push(0, 0, 1);
             
        this.indices = [];
        for (let i = 0; i < this.slices - 2; i++)
            this.indices.push(0, i + 1, i + 2);
        
        this.texCoords = [];
        for (var i = 0; i < this.slices; i++)
            this.texCoords.push(0.5 + Math.cos(i * a_rad)/2, 0.5 - Math.sin(i * a_rad)/2);
            
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

}