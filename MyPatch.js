class MyPatch extends CGFobject {

    constructor(scene, uPoints, vPoints, uDivs, vDivs, controlPoints)
    {
        super(scene);

        this.uPoints = uPoints;
        this.vPoints = vPoints;
        this.uDivs = uDivs;
        this.vDivs = vDivs;
        this.controlPoints = controlPoints;

        this.makesurface();
    }

    makesurface()
    {
        //para o patch o raciocinio é o mesmo que para o cilindro 2, so que com nr de pontos de controlo
        //criados dinamicamente, dai ter dois 'for' nested um no outro para criar para cada ponto 'u'
        //é mais facil para perceber isto tudo simplesmente ler o pdf que o prof deu
        this.auxControlPoints = [];

        for(var i = 0; i < this.uPoints; i ++)
        {
            var aux = [];
        
            for(let j = 0; j < this.uPoints; j ++)
            {
                aux.push([this.controlPoints[i*this.vPoints+j][0], 
                    this.controlPoints[i*this.vPoints+j][1],
                    this.controlPoints[i*this.vPoints+j][2], 
                    this.controlPoints[i*this.vPoints+j][3]]);
            }

            this.auxControlPoints.push(aux);
        }

        this.surface = new CGFnurbsSurface(this.uPoints - 1, this.vPoints - 1, this.auxControlPoints);

        this.obj = new CGFnurbsObject(this.scene, this.uDivs, this.vDivs, this.surface);
    }

    display()
    {
    this.obj.display();
    }
}