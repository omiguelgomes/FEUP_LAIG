class MyPiece extends CGFobject {
    constructor(scene, base, top, height, slices, stacks) {
        super(scene);
        this.scene = scene;
        this.piece = new MyCylinder(this.scene, base, top, height, slices, stacks);
    }
    display() {
        this.scene.pushMatrix();
        this.scene.scale(1.5, 1.5, 1.5);
        this.piece.display();
        this.scene.popMatrix();
    }
}