class MyBoard extends CGFobject{
    constructor(scene, dif)
    {
        super(scene);
        this.scene = scene;

        this.playerBoard = new MyCuboid(this.scene);
        this.enemyBoard = new MyCuboid(this.scene);
        this.tile = new MyRectangle(this.scene, 0, 0.25, 0, 0.25);

        this.dif = dif;
    }

    display()
    {
        this.scene.pushMatrix();
        this.scene.scale(5, 0.2, 5);
        this.playerBoard.display();
        this.scene.popMatrix();

        for (let row = 0; row < 10; row ++)
        {
            for (let col = 0; col < 10; col++)
            {
                this.scene.pushMatrix();
                this.scene.rotate(-Math.PI / 2, 1, 0, 0);
                this.scene.translate(0.7 + 0.415 * row, -1 - 0.415 * col, 0.25);
                this.scene.registerForPick( (row * 10 + col) + this.dif,  this.tile);
                this.tile.display();
                this.scene.popMatrix();
            }
        }


        this.scene.pushMatrix();
        this.scene.translate(0, 3.5, -3.5);
        this.scene.rotate(Math.PI / 4, 1, 0, 0); 
        this.scene.scale(5, 0.2, 5);
        this.enemyBoard.display();
        this.scene.popMatrix();

        for (let row = 0; row < 10; row ++)
        {
            for (let col = 0; col < 10; col++)
            {
                this.scene.pushMatrix();
                this.scene.rotate(-Math.PI / 4, 1, 0, 0);
                this.scene.translate(0.7 + 0.415 * row, 4 - 0.415 * col, 0.25);
                this.scene.registerForPick( (row * 10 + col) + this.dif + 100,  this.tile);
                this.tile.display();
                this.scene.popMatrix();
            }
        }

    }
}