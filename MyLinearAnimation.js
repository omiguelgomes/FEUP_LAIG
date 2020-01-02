class MyLinearAnimation extends MyAnimation
{
    constructor(scene, points, time)
    {
        super(scene);
        this.scene=scene;
	
        this.initime = 0;
        this.temptime = [];
        this.totaltime = time;
        
        this.points = points;
        this.pts = points;
        this.numpt = this.points.length/3;
        
        this.x_cord = this.points[0];
        this.y_cord = this.points[1];
        this.z_cord = this.points[2];
        this.tempdist = [];
        
        this.end = false;

        var sum = 0;
        var p1 = [];
        var p2 = [];
        
        //Calculate total distance and create scalar tempdist array
        for (var i = 0; i < this.numpt - 1; i++) {
            
            var j = i+1;
            p1 = [this.points[3*i], this.points[3*i + 1], this.points[3*i + 2]];
            p2 = [this.points[3*j], this.points[3*j + 1], this.points[3*j + 2]];
            this.tempdist.push (Math.sqrt (Math.pow(p2[0] - p1[0], 2) + Math.pow(p2[1] - p1[1], 2) + Math.pow(p2[2] - p1[2], 2)));
            sum = sum + this.tempdist[i];
        }

        //Calculate scalar speed
        var speed = sum/this.totaltime;
        //this.temp = sum;
        //Create scalar temptime array
        for (var i = 0; i < this.numpt - 1; i++)
            this.temptime.push(this.tempdist[i]/speed);
        
    }

    update(t)
    {
        var k;

        if (this.initime == 0) {
            this.initime = t;
            this.initangle = 0;
            k = 0;
        }
   
        if (k == this.numpt - 1){
            k=0;
            this.end = true;
        }
        
        var n = k+1;
        this.offsetX = this.points[3*(k+1)] - this.points[3*k];
        this.offsetY = this.points[3*(k+1)+1] - this.points[3*k+1];
        this.offsetZ = this.points[3*(k+1)+2] - this.points[3*k+2];
        this.offsetR =  Math.atan2(this.points[3*n] - this.points[3*k], this.points[3*n+1] - this.points[3*k+1], this.points[3*n+2] - this.points[3*k+2]);
        
        this.x_cord = this.points[3*k] + this.offsetX * ((t - this.initime) / (this.temptime[k] * 1000));
        this.y_cord = this.points[3*k+1] + this.offsetY * ((t - this.initime) / (this.temptime[k] * 1000));
        this.z_cord = this.points[3*k+2] + this.offsetZ * ((t - this.initime) / (this.temptime[k] * 1000));
        this.angle = this.initangle + this.offsetR * ((t - this.initime) / (this.temptime[k] * 1000));
        
        if ((t - this.initime) >= (this.temptime[k]*1000)) {
            this.initime = t;
            this.initangle += this.offsetR;
            k++;
        }
    }

    apply(player, left)
    {
        if (this.end == false) {
            this.scene.translate(this.x_cord*player*left, this.y_cord*player*left, this.z_cord*player);
            //this.scene.rotate(this.angle, 0, 1, 0);
        }
    }
}