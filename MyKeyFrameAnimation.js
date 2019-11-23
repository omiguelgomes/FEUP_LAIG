/**
 * MyKeyFrameAnimation
 * @constructor
 */
class MyKeyFrameAnimation extends MyAnimation {
    constructor(scene, id, keyFrames) {
        super(scene);
        this.scene = scene;
        this.keyFrames = keyFrames;
        this.deltaTime = 0;
        this.startTime = 0;
        this.complete = false;
        this.started = false;
        this.timePassedRatio;
    };

    update() {
        var d = new Date();
        if (!this.started) {

            this.startTime = d.getTime();
            this.started = true;
        }

        if (!this.complete) {
            this.deltaTime = (d.getTime() - this.startTime);
        }


        for (var i = 0; i < this.keyFrames.length; i++) {
            if (i == 0) {
                if (this.keyFrames[i][0] * 1000 > this.deltaTime) {
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
    };

    updateMatrix(keyFrameIndex, isFirst) {
        var ratio;
        var prevTransf, transf;

        transf = this.keyFrames[keyFrameIndex][1];
        //transf[2][1] //scale for y

        if (isFirst) {
            ratio = this.deltaTime / (this.keyFrames[keyFrameIndex][0] * 1000);
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


            this.scene.translate(prevTransf[0][0] + (transf[0][0] - prevTransf[0][0]) * ratio,
                prevTransf[0][1] + (transf[0][1] - prevTransf[0][1]) * ratio,
                prevTransf[0][2] + (transf[0][2] - prevTransf[0][2]) * ratio);


            this.scene.rotate(prevTransf[1][0] + (transf[1][0] - prevTransf[1][0]) * ratio, 1, 0, 0);
            this.scene.rotate(prevTransf[1][1] + (transf[1][1] - prevTransf[1][1]) * ratio, 0, 1, 0);
            this.scene.rotate(prevTransf[1][2] + (transf[1][2] - prevTransf[1][2]) * ratio, 0, 0, 1);


            this.scene.scale(prevTransf[2][0] + ((transf[2][0] - prevTransf[2][0]) * ratio),
                prevTransf[2][1] + ((transf[2][1] - prevTransf[2][1]) * ratio),
                prevTransf[2][2] + ((transf[2][2] - prevTransf[2][2]) * ratio));
        }
    };

    apply() {};
};