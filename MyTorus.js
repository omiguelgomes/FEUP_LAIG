/**
 * MyTorus
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyTorus extends CGFobject {//TODO - it's still a cylinder
    constructor(scene, id, inner, outer, slices, loops)
    {
        super(scene);

        //slices = nr faces
        if (slices < 5)
            this.slices = 5;
        else if (slices > 10)
            this.slices = 10;

        this.slices = slices;
        /*stacks = nr de objetos na vertical
        this.stacks = stacks; - Editar  */ 
        this.inner = inner;
        this.outer = outer;
        this.loops = loops;
		this.initBuffers();
	}
    initBuffers()
     {
         //-----declaracao-----
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];
        
        var ang = 0;
        var alphaAng = 2*Math.PI / this.slices; //angulo entre as faces do prisma

        for (var i = 0; i < this.slices; i++) //para transformar em torus -> a cada iteracao rodar em torno de y, de forma a fazer x loops
        {
            var senAng = Math.sin(ang);
            var senAng_Alpha = Math.sin(ang+alphaAng);
            var cosAng = Math.cos(ang);
            var cosAng_Alpha = Math.cos(ang+alphaAng);

            this.vertices.push(cosAng * this.inner, 0, -senAng * this.inner);
            this.texCoords.push(0,1);
            this.vertices.push(cosAng_Alpha * this.inner, 0, -senAng_Alpha * this.inner); //pontos base c/ y=0
            this.texCoords.push(1,1);

            this.vertices.push(cosAng * this.inner, this.stacks, -senAng * this.inner);
            this.texCoords.push(0,0);
            this.vertices.push(cosAng_Alpha * this.inner, this.stacks, -senAng_Alpha * this.inner); //pontos topo c/ y=1
            this.texCoords.push(1,0);

            // square normal computation
            var normal= [
                cosAng,
                0,                        
                -senAng
            ];

            // normalization
            var nsize=Math.sqrt(
                normal[0]*normal[0]+
                normal[1]*normal[1]+
                normal[2]*normal[2]
                );

            normal[0] /= nsize;
            normal[1] /= nsize;
            normal[2] /= nsize;

            //normal values for next face(avoid using previous angle)
            var normalNext = [
                Math.cos(ang + alphaAng),
                0,
                -Math.sin(ang + alphaAng)];

            // push normal once for each vertex of this square
            this.normals.push(...normal);
            this.normals.push(...normalNext);
            this.normals.push(...normal);
            this.normals.push(...normalNext);

            this.indices.push(4*i, (4*i+1) , (4*i + 3) );
            this.indices.push(4*i, (4*i + 3) , (4*i + 2));


            ang += alphaAng;  
        }
        
		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
    }

    display()
    {
        super.display();
        this.scene.pushMatrix();
        this.scene.scale(this.inner, 1, this.inner);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.popMatrix();
    }
    
    updateBuffers(complexity)
    {
        this.slices = 5 + Math.round(5 * complexity); //complexity varies 0-1, so slices varies 0-10

        // reinitialize buffers
        this.initBuffers();
        this.initNormalVizBuffers();
    }
}

