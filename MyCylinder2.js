class MyCylinder2 extends CGFobject
{
    constructor(scene, baseRadius, topRadius, height, slices, stacks)
	{
        super(scene);

        //estas variáveis são as mesmas que as do cilindro normal
        this.slices = slices;
        this.stacks = stacks;
        this.height = height;

        this.topRadius = topRadius;
        if(this.topRadius == 0)
            this.topRadius = 0.0001;

        this.baseRadius = baseRadius;
        if(this.baseRadius == 0)
            this.baseRadius = 0.0001

        this.makeSurface();
    }

    makeSurface()
    {
        //os pontos de controlo "definem" os vértices da figura
        //para cada ponto, os 3 primeiros valores são coords(x,y,z), sendo o 4o valor o peso
        //o peso (w) pode ser qualquer valor positivo, quanto mais perto de 0, mais recta será a linha
        //quanto mais perto de 1, mais circular será, acima de 1, formará um vertice "arredondado" perto do ponto de controlo
        //ver: https://moodle.up.pt/pluginfile.php/61237/mod_resource/content/4/Non-uniform%20rational%20B-spline.LAIG.20181107.pdf
        this.controlPoints =    [[[-this.topRadius, 0.0, this.height, 1],             //u = 0 , v = 0
                                [-this.baseRadius, 0.0, 0.0, 1]],                     //u = 0 , v = 1
                                
                                [[-this.topRadius, (4/3)*this.topRadius, this.height, 1],   //u = 1 , v = 0
                                [-this.base, (4/3)*this.base, 0.0, 1]],         //u = 1 , v = 1

                                [[this.topRadius, (4/3)*this.topRadius, this.height, 1],    //u = 2 , v = 0
                                [this.baseRadius, (4/3)*this.baseRadius, 0.0, 1]],          //u = 2 , v = 1

                                [[this.topRadius, 0.0, this.height, 1],               //u = 3 , v = 0
                                [this.baseRadius, 0.0, 0.0, 1]]];                     //u 0 3 , v = 1

        //cria a superficie
        //1o arg: grau em 'u'
        //2o arg: grau em 'v'
        //3o arg: lista de pontos de controlo
        this.surface = new CGFnurbsSurface(3, 1, this.controlPoints);

        //cria o objeto usando a superficie acima
        //o 2o e 3o args são o nr de divs em 'u' e 'v' respetivamente, que neste caso, sao iguais 
        //às slices e stacks
        this.obj = new CGFnurbsObject(this.scene, this.slices/2, this.stacks/2, this.surface);
                            
    }

    display()
    {
        this.obj.display();
    }
}  