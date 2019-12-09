class MySecurityCamera extends CGFobject {
    constructor(scene) {
        super(scene);
        this.scene = scene;

        this.view = new MyRectangle(this.scene, 1, 0, 1, 0);

        //shader stuff
        //as variaveis de tipo 'uniform' têm que ser dados valores usando o setUniformValues
        this.shader = new CGFshader(this.scene.gl, 'shader/camera.vert', 'shader/camera.frag');
        this.shader.setUniformsValues({ uSampler: 0 });
    }

<<<<<<< HEAD
    updateLines(t) {
        //t indica velocidade das linhas, e chamada em update(t) da scene
        this.shader.setUniformsValues({ time: t / 100 % 1000 });
    }

    display() {
=======
    updateLines(t){
        //para criar o movimento das linhas, a funcao é chamada no update(t) da Scene
        this.shader.setUniformsValues({ time: t / 100 % 1000});
    }

    display()
    {
        //diz que shader deve ser usado
>>>>>>> 221164a53dd04a30de48e43c1685574506d5dc80
        this.scene.setActiveShader(this.shader);

        //codigo tirado do exemplo do ano passado de shader (have no idea what it does)
        this.scene.pushMatrix();
        this.scene.cameraTexture.bind(0);
        this.view.display();
        this.scene.popMatrix();
    }
}