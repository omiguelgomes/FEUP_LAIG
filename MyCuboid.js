class MyCuboid extends CGFobject{
    constructor(scene)
    {
        super(scene);
        this.scene = scene;

        this.face = new MyRectangle(this.scene, 0, 1, 0, 1);
    }

    display(){
        //frente
        this.scene.pushMatrix();
        this.scene.translate(0, 0, 1); 
        this.face.display();
        this.scene.popMatrix();
    
        //tras
        this.scene.pushMatrix();
        this.scene.rotate(-Math.PI, 0, 1, 0);
        this.scene.translate(-1, 0, 0);
        this.face.display();
        this.scene.popMatrix();

        //esquerda
        this.scene.pushMatrix();
        this.scene.rotate(-Math.PI/2, 0, 1, 0);
        //this.scene.translate(0, 0, 0);
        this.face.display();
        this.scene.popMatrix();
        
        //direita
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI/2, 0, 1, 0);
        this.scene.translate(-1, 0, 1);
        this.face.display();
        this.scene.popMatrix();

        //cima
        this.scene.pushMatrix();
        this.scene.rotate(-Math.PI/2, 1, 0, 0);
        this.scene.translate(0, -1, 1);
        this.face.display();
        this.scene.popMatrix();

        //baixo
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        //this.scene.translate(0, 0, 0.1);
        this.face.display();
        this.scene.popMatrix();
    }
}