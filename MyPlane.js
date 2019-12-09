class MyPlane extends CGFobject {

    constructor(scene, uDivs, vDivs) {
        super(scene);

        this.scene = scene;

        if (uDivs == null || uDivs < 1)
            this.uDivs = 10;
        else this.uDivs = uDivs;

        if (vDivs == null || vDivs < 1)
            this.vDivs = 10;
        else this.vDivs = vDivs;



        // this.makeSurface(
        //     1,                          // degree on U
        //     1,                          // degree on V
        //     [[[-0.5, 0, 0.5, 1 ], 	    //U = 0 , V = 0
        //     [-0.5,  0, -0.5, 1 ]],		//U = 0 , V = 1 
        //     [[0.5, 0, 0.5, 1 ],		    //U = 1 , V = 0
        //     [0.5,  0, -0.5, 1 ]]],	    //U = 1 , V = 1
        // );



        this.makeSurface(1, // degree on U
            1, // degree on V
            [
                [
                    [0, 0, 1, 1], //U = 0 , V = 0
                    [0, 0, 0, 1], //U = 0 , V = 1 
                ],
                [
                    [1, 0, 1, 1], //U = 1 , V = 0
                    [1, 0, 0, 1] //U = 1 , V = 1
                ]
            ]);

        /*
        coords (u,v)

        ^  v (-z)
        |
        |
		|
		+----------> u (x)
        
        */

    }

    //aqui como o patch tem que ser sempre do mesmo tamanho, os valores são hardcoded, mas o raciocinio é o msm
    //que no cilindro e no patch
    makeSurface(degree1, degree2, controlvertexes) {

        this.nurbsSurface = new CGFnurbsSurface(degree1, degree2, controlvertexes);

        this.obj = new CGFnurbsObject(this.scene, this.uDivs, this.vDivs, this.nurbsSurface);

    }

    display() {
        this.obj.display();
    }

}