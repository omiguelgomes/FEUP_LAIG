/**
 * MyKeyFrameAnimation
 * @constructor
 */
class MyKeyFrameAnimation extends MyAnimation {
    constructor(scene, id, keyFrames) {
        super(scene);
        this.scene = scene;
        this.keyFrames = keyFrames; //keyFrames[i][time][3 matrix with transf values]
        this.deltaTime = 0;
        this.startTime = 0;
        this.complete = false;
        this.started = false;
        this.timePassedRatio;
        this.trans = { x: 0.0, y: 0.0, z: 0.0 };
        this.rot = { x: 0.0, y: 0.0, z: 0.0 };
        this.scale = { x: 1.0, y: 1.0, z: 1.0 };
    }

    apply() {
        //this.scene.translate(this.trans.x, this.trans.y, this.trans.z);
        // this.scene.rotate(this.rot.x, 1, 0, 0);
        // this.scene.rotate(this.rot.y, 0, 1, 0);
        // this.scene.rotate(this.rot.z, 0, 0, 1);
        // this.scene.scale(this.scale.x, this.scale.y, this.scale.z);
    }

    update() {
        var d = new Date();
        if (!this.started) { //only runs in the first time
            this.startTime = d.getTime();
            this.started = true;
        }

        this.deltaTime = (d.getTime() - this.startTime);

        for (var i = 0; i < this.keyFrames.length; i++) //for every time interval in the animation
        {
            if (i == 0) //different condition for first keyFrame, because we can't access keyFrames[i-1]
            {
                if (this.keyFrames[i][0] * 1000 > this.deltaTime) { //keyFrame time tells us when the keyFrame should end, not how long it takes
                    //process keyFrame0
                    this.updateMatrix(i, true);
                }
            } else {
                if ((this.keyFrames[i - 1][0] * 1000 < this.deltaTime) && (this.deltaTime < this.keyFrames[i][0] * 1000)) {
                    //process keyFrame[i]
                    this.updateMatrix(i, false);
                }
            }
        }
        if ((this.deltaTime > this.keyFrames[this.keyFrames.length - 1][0] * 1000)) {
            this.complete = true;
        }
    };

    updateMatrix(keyFrameIndex, isFirst) {
        var ratio; //ranges 0 to 1, equals to time passed since the beggining of the keyFrame
        //divided by the total time of the keyFrame
        var prevTransf, transf;

        transf = this.keyFrames[keyFrameIndex][1];
        /*transf[0][0] is translate in x
        transf[0][1] is translate in y
        transf[0][2] is translate in z

        transf[1][0] is rotate in x
        transf[1][1] is rotate in y
        transf[1][2] is rotate in z

        transf[2][0] is scale for x
        transf[2][1] is scale for y
        transf[2][2] is scale for z*/

        if (isFirst) { //again, different confition for first keyFrame, cant access keyFrameIndex-1
            ratio = this.deltaTime / (this.keyFrames[keyFrameIndex][0] * 1000);
            this.trans.x = transf[0][0] * ratio;
            this.trans.y = transf[0][1] * ratio;
            this.trans.z = transf[0][2] * ratio;

            this.rot.x = transf[1][0] * ratio;
            this.rot.y = transf[1][1] * ratio;
            this.rot.z = transf[1][2] * ratio;

            this.scale.x = 1 + ((transf[2][0] - 1) * ratio);
            this.scale.y = 1 + ((transf[2][1] - 1) * ratio);
            this.scale.z = 1 + ((transf[2][2] - 1) * ratio);

            this.scene.translate(transf[0][0] * ratio, transf[0][1] * ratio, transf[0][2] * ratio);

            this.scene.rotate(transf[1][0] * ratio, 1, 0, 0);
            this.scene.rotate(transf[1][1] * ratio, 0, 1, 0);
            this.scene.rotate(transf[1][2] * ratio, 0, 0, 1);

            this.scene.scale(1 + ((transf[2][0] - 1) * ratio),
                1 + ((transf[2][1] - 1) * ratio),
                1 + ((transf[2][2] - 1) * ratio));

        } else {
            ratio = (this.deltaTime - this.keyFrames[keyFrameIndex - 1][0] * 1000) / (this.keyFrames[keyFrameIndex][0] * 1000 - this.keyFrames[keyFrameIndex - 1][0] * 1000);
            prevTransf = this.keyFrames[keyFrameIndex - 1][1];

            this.trans.x = prevTransf[0][0] + (transf[0][0] - prevTransf[0][0]) * ratio;
            this.trans.x = prevTransf[0][1] + (transf[0][1] - prevTransf[0][1]) * ratio;
            this.trans.x = prevTransf[0][2] + (transf[0][2] - prevTransf[0][2]) * ratio;

            this.rot.x = prevTransf[1][0] + (transf[1][0] - prevTransf[1][0]) * ratio;
            this.rot.x = prevTransf[1][1] + (transf[1][1] - prevTransf[1][1]) * ratio;
            this.rot.x = prevTransf[1][2] + (transf[1][2] - prevTransf[1][2]) * ratio;

            this.scale.x = prevTransf[2][0] + ((transf[2][0] - prevTransf[2][0]) * ratio);
            this.scale.x = prevTransf[2][1] + ((transf[2][1] - prevTransf[2][1]) * ratio);
            this.scale.x = prevTransf[2][2] + ((transf[2][2] - prevTransf[2][2]) * ratio);

            this.scene.translate(prevTransf[0][0] + (transf[0][0] - prevTransf[0][0]) * ratio,
                prevTransf[0][1] + (transf[0][1] - prevTransf[0][1]) * ratio,
                prevTransf[0][2] + (transf[0][2] - prevTransf[0][2]) * ratio);

            //every time this.scene.rotate/scale/translate is called, the transformation is
            //relative to the original position. so we transform by previous + (current - previous)*ratio
            this.scene.rotate(prevTransf[1][0] + (transf[1][0] - prevTransf[1][0]) * ratio, 1, 0, 0);
            this.scene.rotate(prevTransf[1][1] + (transf[1][1] - prevTransf[1][1]) * ratio, 0, 1, 0);
            this.scene.rotate(prevTransf[1][2] + (transf[1][2] - prevTransf[1][2]) * ratio, 0, 0, 1);


            this.scene.scale(prevTransf[2][0] + ((transf[2][0] - prevTransf[2][0]) * ratio),
                prevTransf[2][1] + ((transf[2][1] - prevTransf[2][1]) * ratio),
                prevTransf[2][2] + ((transf[2][2] - prevTransf[2][2]) * ratio));
        }
    };
};