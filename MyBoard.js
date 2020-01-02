class MyBoard extends CGFobject {
    constructor(scene) {
        super(scene);
        this.scene = scene;

        this.playerBoard = new MyCuboid(this.scene);

    }

    display() {
        this.scene.pushMatrix();
        this.playerBoard.display();
        this.scene.popMatrix();
    }
}