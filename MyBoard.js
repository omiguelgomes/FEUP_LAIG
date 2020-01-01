class MyBoard extends CGFobject {
    constructor(scene, dif) {
        super(scene);
        this.scene = scene;

        this.playerBoard = new MyCuboid(this.scene);
        this.tile = new MyRectangle(this.scene, 0, 0.5, 0, 0.5);

        this.dif = dif;
    }

    display() {
        this.scene.pushMatrix();
        this.scene.scale(5, 0.2, 5);
        this.playerBoard.display();
        this.scene.popMatrix();

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                this.scene.pushMatrix();
                this.scene.rotate(-Math.PI / 2, 1, 0, 0);
                this.scene.translate(0.4 + 0.525 * row, -1 - 0.515 * col, 0.25);
                this.scene.registerForPick((row * 10 + col) + this.dif, this.tile);
                this.tile.display();
                this.scene.popMatrix();
            }
        }
    }
}