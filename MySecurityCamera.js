class MySecurityCamera extends CGFobject 
{
    constructor(scene)
    {
        super(scene);
        this.scene = scene;

        this.view = new MyRectangle(this.scene, 1, 0, 1, 0);

        //shader stuff
        //as variaveis de tipo 'uniform' têm que ser dados valores usando o setUniformValues
        this.shader = new CGFshader(this.scene.gl, 'shader/camera.vert', 'shader/camera.frag');
        this.shader.setUniformsValues({ uSampler: 0 });
    }

    updateLines(t){
        this.shader.setUniformsValues({ time: t / 100 % 1000});
    }

    display()
    {
        this.scene.setActiveShader(this.shader);

        this.scene.pushMatrix();
        this.scene.cameraTexture.bind(0);
        this.view.display();
        this.scene.popMatrix();
    }
}