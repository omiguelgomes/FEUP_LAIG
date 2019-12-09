class MyCylinder2 extends CGFobject {
    constructor(scene, baseRadius, topRadius, height, slices, stacks) {
        super(scene);

        this.slices = slices;
        this.stacks = stacks;
        this.height = height;

        this.topRadius = topRadius;
        if (this.topRadius == 0)
            this.topRadius = 0.0001;

        this.baseRadius = baseRadius;
        if (this.baseRadius == 0)
            this.baseRadius = 0.0001

        this.makeSurface();
    }

    makeSurface() {
        this.controlPoints = [
            [
                [-this.topRadius, 0.0, this.height, 1], //u = 0 , v = 0
                [-this.baseRadius, 0.0, 0.0, 1]
            ], //u = 0 , v = 1

            [
                [-this.topRadius, (4 / 3) * this.topRadius, this.height, 1], //u = 1 , v = 0
                [-this.base, (4 / 3) * this.base, 0.0, 1]
            ], //u = 1 , v = 1

            [
                [this.topRadius, (4 / 3) * this.topRadius, this.height, 1], //u = 2 , v = 0
                [this.baseRadius, (4 / 3) * this.baseRadius, 0.0, 1]
            ], //u = 2 , v = 1

            [
                [this.topRadius, 0.0, this.height, 1], //u = 3 , v = 0
                [this.baseRadius, 0.0, 0.0, 1]
            ]
        ]; //u = 3 , v = 1


        this.surface = new CGFnurbsSurface(3, 1, this.controlPoints);
        //3,1 sao graus da superficie 
        //lines-1
        //circles-2
        //free-form -> 3 ou 5

        this.obj = new CGFnurbsObject(this.scene, this.slices / 2, this.stacks / 2, this.surface);

    }

    display() {
        this.obj.display();
    }
}