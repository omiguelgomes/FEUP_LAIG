/**
 * MyCylinder
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyCylinder extends CGFobject {
    constructor(scene, base, top, height, slices, stacks) {
        super(scene);

        this.base = base;
        this.top = top;
        this.height = height;
        this.slices = slices;

        //slices = nr faces
        if (slices < 5)
            this.slices = 5;
        else if (slices > 10)
            this.slices = 10;

        //stacks = nr de objetos na vertical
        this.stacks = stacks;
    }

    display() {
        this.baseCap = new MyCylinderBase(this.scene, this.slices);
        this.topCap = new MyCylinderBase(this.scene, this.slices);
        this.body = new MyCylinderBody(this.scene, this.base, this.top, this.height, this.slices, this.stacks);
        this.scene.pushMatrix();
        this.body.display();
        this.scene.scale(this.base, 1, this.base);
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.baseCap.display();
        this.scene.scale(this.top / this.base, 1, this.top / this.base);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.translate(0, 0, this.height);
        this.topCap.display();
        this.scene.popMatrix();
    }
}