/**
 * MyTorus
 * @constructor
 */
class MyTorus extends CGFobject {
	constructor(scene, id, inner, outer, slices, loops) {
		super(scene);

		this.r = inner
		this.R = outer
		this.slices = slices;
		this.stacks = loops;

		this.initBuffers();
	};

	initBuffers() {
		this.vertices = [];
		this.indices = [];
		this.normals = [];
		this.texCoords = [];

		for (var stack = 0; stack <= this.stacks; stack++) {
			var alpha = stack * 2 * Math.PI / this.stacks;
			var sinAlpha = Math.sin(alpha);
			var cosAlpha = Math.cos(alpha);

			for (var slice = 0; slice <= this.slices; slice++) {
				var beta = slice * 2 * Math.PI / this.slices;
				var sinBeta = Math.sin(beta);
				var cosBeta = Math.cos(beta);

				var x = (this.R + (this.r * cosAlpha)) * cosBeta;
				var y = (this.R + (this.r * cosAlpha)) * sinBeta
				var z = this.r * sinAlpha;
				var s = 1 - (stack / this.stacks);
				var t = 1 - (slice / this.slices);

				this.vertices.push(x, y, z);
				this.normals.push(x, y, z);
				this.texCoords.push(t, s);
			}
		}

		for (var stack = 0; stack < this.stacks; stack++) {
			for (var slice = 0; slice < this.slices; slice++) {
				var first = (stack * (this.slices + 1)) + slice;
				var second = first + this.slices + 1;

				this.indices.push(first, second + 1, second);
				this.indices.push(first, first + 1, second + 1);
			}
		}
		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};

};