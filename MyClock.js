class MyClock extends CGFobject
{
    constructor(scene, clockspeed)
    {
        super(scene);

        this.time = 0;
        this.clockspeed = clockspeed;

        //defining necessary primitives
        this.circle = new MyCircle(this.scene, 12);
        this.sec = new MyHandle(this.scene, 0);
        this.sec.setAngle(0);

        //Materials
        this.clockAppearance = new CGFappearance(this.scene);
        this.clockAppearance.loadTexture("img/clock.png");
        
        this.pointerAppearance = new CGFappearance(this.scene);
        this.pointerAppearance.setDiffuse(0, 0, 0, 0);
        this.pointerAppearance.setSpecular(0, 0, 0, 0);
        this.pointerAppearance.setShininess(5);
    }

    display()
    {
        this.scene.pushMatrix();
 		this.scene.translate(0, 0, 1);
 		this.clockAppearance.apply();
 		this.circle.display();
 	    this.scene.popMatrix();

 	    var rad = Math.PI/180;

 	    this.scene.pushMatrix();
 		this.scene.rotate(this.sec.angle* rad, 0, 0, -1);
 		this.scene.translate(0,0.2,1);
 		this.scene.scale(0.03, 0.9, 0.1);
 		this.pointerAppearance.apply();
 		this.sec.display();
 	    this.scene.popMatrix();
    }

    update(t)
    {
        if (this.time == 0) {
            this.time = t;
            var seconds = 0.6;
        }
        else {
            var diff = t - this.time;
            this.time = t;
            var seconds = this.clockspeed * diff * (360 / (60 * 1000));
        }
    
        this.sec.setAngle(this.sec.angle + seconds);
    }
}