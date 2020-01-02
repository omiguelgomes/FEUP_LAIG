class MyPiece extends CGFobject {
    constructor(scene, id, base, top, height, slices, stacks) {
        super(scene);
        this.scene = scene;
        this.piece = new MyCylinder(this.scene, id, base, top, height, slices, stacks);
    }
    display() {
        this.piece.display();
    }
}