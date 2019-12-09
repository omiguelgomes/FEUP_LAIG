class MyPlane extends CGFobject{
    
    constructor(scene)
    {
        super(scene);
        this.scene = scene;

        this.obj = new MyTile(this.scene, 0, 1, 0, 1);
    }

    display()
    {
        this.obj.display();
    }
}