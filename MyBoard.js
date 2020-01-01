class MyBoard extends CGFobject {
    constructor(scene) {
        super(scene);
        this.scene = scene;

        this.playerBoard = new MyCuboid(this.scene);

    }

    display() {
        this.scene.pushMatrix();
        this.scene.scale(5, 0.2, 5);
        this.playerBoard.display();
        this.scene.popMatrix();
    }
}