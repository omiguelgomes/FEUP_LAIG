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