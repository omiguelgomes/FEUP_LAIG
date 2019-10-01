/**
 * MyTorus
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyTorus extends CGFobject {
    constructor(scene, id, inner, outer, slices, loops) {
        super(scene);

        this.inner = inner;
        this.outer = outer;
        this.slices = slices;

        //slices = nr faces
        if (slices < 5)
            this.slices = 5;
        else if (slices > 10)
            this.slices = 10;

        this.loops = loops;
        this.initBuffers();
    }
    initBuffers() {
        //-----declaracao-----
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        var ang = 2 * Math.PI / this.slices;
        var alphaAng = 2 * Math.PI / this.slices; //angulo entre as faces do prisma

        var sides = 10; //nr of cylinders
        var angRot = 2 * Math.PI / sides;
        var alphaAngRot = 2 * Math.PI / sides;

        for (var j = 0; j <= sides; j++) {

            angRot += alphaAngRot;//implement creation of several circles to create torus(see sketch)

            for (var i = 0; i <= this.slices; i++) {
                var senAng = Math.sin(ang);
                var senAng_Alpha = Math.sin(ang + alphaAng);
                var cosAng = Math.cos(ang);
                var cosAng_Alpha = Math.cos(ang + alphaAng);

                var senAngRot = Math.sin(angRot);
                var cosAngRot = Math.cos(angRot);

                this.vertices.push((this.outer + this.inner * cosAng) * senAngRot, (this.outer + this.inner * cosAng) * cosAngRot, this.inner * senAng);
                this.texCoords.push(0, 1);

                // square normal computation
                var normal = [
                    cosAng,
                    0,
                    -senAng
                ];

                // normalization
                var nsize = Math.sqrt(
                    normal[0] * normal[0] +
                    normal[1] * normal[1] +
                    normal[2] * normal[2]
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

                if (j != sides) {
                    this.indices.push(this.slices * j + i, this.slices * j + 1 + i, this.slices * (j + 1) + i);//baixo, baixo, cima
                    this.indices.push(this.slices * (j + 1) + i, this.slices * j + 1 + i, this.slices * (j + 1) + i + 1);//cima, baixo, cima
                }
                else {
                    if (i == this.slices - 1) {
                        this.indices.push(this.slices * j + i, this.slices * j + 1 + i, i);//baixo, baixo, cima
                        this.indices.push(i, this.slices * j + 1 + i, 0);//cima, baixo, cima
                    }
                    else {
                        this.indices.push(this.slices * j + i, this.slices * j + 1 + i, i);//baixo, baixo, cima
                        this.indices.push(i, this.slices * j + 1 + i, i + 1);//cima, baixo, cima
                    }

                }

                ang += alphaAng;
            }
            console.log(j + " : " + sides);

        }
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    updateBuffers(complexity) {
        this.slices = 5 + Math.round(5 * complexity); //complexity varies 0-1, so slices varies 0-10

        // reinitialize buffers
        this.initBuffers();
        this.initNormalVizBuffers();
    }
}