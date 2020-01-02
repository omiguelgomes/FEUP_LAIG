class MyPiece extends CGFobject {
    constructor(scene, base, top, height, slices, stacks) {
        super(scene);
        this.scene = scene;
        this.piece = new MyCylinder(this.scene, base, top, height, slices, stacks);
    }
    display() {
        this.piece.display();
    }
}