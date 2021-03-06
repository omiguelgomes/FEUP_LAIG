var DEGREE_TO_RAD = Math.PI / 180;

/**
 * XMLscene class, representing the scene that is to be rendered.
 */
class XMLscene extends CGFscene {
    /**
     * @constructor
     * @param {MyInterface} myinterface 
     */
    constructor(myinterface) {
        super();
        this.secondLight = false;
        this.cameraAnimation = false;
        this.interface = myinterface;
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        this.sceneInitiated = false;

        this.initCameras();

        this.enableTextures(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.axis = new CGFaxis(this);
        this.setUpdatePeriod(100);

        this.matCounter = 0;

        //Game
        this.setPickEnabled(true);
        //this.game = new MyGameOrchestrator(this);
    }

    /**
     * Initializes the scene cameras.
     */
    initCameras() {
        this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(0, 12, -15), vec3.fromValues(0, 10, 0));
        this.interface.setActiveCamera(this.camera);
    }

    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {
        var i = 0;
        // Lights index.

        // Reads the lights from the scene graph.
        for (var key in this.graph.lights) {
            if (i >= 8)
                break; // Only eight lights allowed by WebGL.

            if (this.graph.lights.hasOwnProperty(key)) {
                var light = this.graph.lights[key];

                this.lights[i].setPosition(light[2][0], light[2][1], light[2][2], light[2][3]);
                this.lights[i].setAmbient(light[3][0], light[3][1], light[3][2], light[3][3]);
                this.lights[i].setDiffuse(light[4][0], light[4][1], light[4][2], light[4][3]);
                this.lights[i].setSpecular(light[5][0], light[5][1], light[5][2], light[5][3]);

                if (light[1] == "spot") {
                    this.lights[iGameO].enable();
                } else
                    this.lights[i].disable();

                this.lights[i].update();

                i++;
            }
        }
    }

    checkKeys() {
        if (this.gui.isKeyPressed("KeyM")) {
            this.matCounter++;
        }
    }

    setDefaultAppearance() {
        this.setAmbient(0.2, 0.4, 0.8, 1.0);
        this.setDiffuse(0.2, 0.4, 0.8, 1.0);
        this.setSpecular(0.2, 0.4, 0.8, 1.0);
        this.setShininess(10.0);
    }

    onGraphLoaded() {
        this.axis = new CGFaxis(this, this.graph.referenceLength);

        this.gl.clearColor(this.graph.background[0], this.graph.background[1], this.graph.background[2], this.graph.background[3]);

        this.setGlobalAmbientLight(this.graph.ambient[0], this.graph.ambient[1], this.graph.ambient[2], this.graph.ambient[3]);

        this.initLights();

        this.sceneInitiated = true;
    }

    update(t) {
        this.checkKeys();
        if (this.sceneInitiated) {
            //this.updateCameras();
            this.updateLights();
            //this.game.update(t);

            if (this.cameraAnimation) {
                this.cameraAngle += 5;
                this.camera.orbit(vec3.fromValues(0, 1, 0), this.cameraAngle * DEGREE_TO_RAD);
                if (this.cameraAngle == 30) {
                    this.cameraAnimation = false;
                    if (this.game.player == 1) {
                        this.camera.setPosition(vec3.fromValues(0, 12, -15));
                        this.camera.setTarget(vec3.fromValues(0, 0, 8));
                    } else {
                        this.camera.setPosition(vec3.fromValues(0, 12, 15));
                        this.camera.setTarget(vec3.fromValues(0, 0, -8));
                    }
                }
            }
        }
    }

    // updateCameras() {
    //     if (this.sunCamera) {
    //         this.graph.scene.camera = this.graph.cameras["sunCamera"];
    //         this.graph.scene.interface.setActiveCamera(this.graph.scene.camera);
    //     } else if (this.earthCamera) {
    //         this.graph.scene.camera = this.graph.cameras["earthCamera"];
    //         this.graph.scene.interface.setActiveCamera(this.graph.scene.camera);
    //     } else {
    //         this.graph.scene.camera = this.graph.cameras["defaultCamera"];
    //         this.graph.scene.interface.setActiveCamera(this.graph.scene.camera);
    //     }
    // }

    changeCamera() {
        this.camera._up = vec3.fromValues(0, 1, 0);
        if (this.game.currPlayer == this.game.player.white_player) {
            this.camera.setPosition(vec3.fromValues(-11, 12, 2));
        } else {
            this.camera.setPosition(vec3.fromValues(11, 12, 2));
        }
        this.cameraAnimation = true;
        this.cameraAngle = 0;
    }

    updateLights() {
        if (this.secondLight) {
            this.lights[0].disable();
            this.lights[1].enable();
        } else {
            this.lights[1].disable();
            this.lights[0].enable();
        }
        for (var i = 0; i < this.lights.length; i++) {
            this.lights[i].update();
        }
    }

    logPicking() {
        if (this.pickMode == false) {
            if (this.pickResults != null && this.pickResults.length > 0) {
                for (var i = 0; i < this.pickResults.length; i++) {
                    var obj = this.pickResults[i][0];
                    if (obj) {
                        //sets the new customId dependant on what we are picking
                        this.customId = this.pickResults[i][1];
                        console.log("Picked object: " + obj + ", with pick id " + this.customId);
                    }
                }
                this.pickResults.splice(0, this.pickResults.length);
            }
        }
    }

    display() {

        //picking
        this.logPicking();
        this.clearPickRegistration();

        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        this.updateProjectionMatrix();
        this.loadIdentity();

        this.applyViewMatrix();

        this.pushMatrix();
        this.axis.display();

        for (var i = 0; i < this.lights.length; i++) {
            this.lights[i].setVisible(true);
            this.lights[i].enable();
        }

        if (this.sceneInitiated) {
            this.setDefaultAppearance();
            this.graph.displayScene();
        }

        this.popMatrix();

        this.gl.disable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.DEPTH_TEST);

        this.pushMatrix();
        this.translate(0, -1, 3);
        this.scale(0.8, 0.8, 0.8);
        //this.game.display(this.customId);
        this.popMatrix();
    }

    makeMove(index, from, to) {
        var tileSize = 0.5;
        var deltaX = (to % 8 - from % 8) * tileSize;
        var deltaZ = (Math.floor(to / 8) - Math.floor(from / 8)) * tileSize;
        if (index < 12) {
            deltaX *= -1;
            deltaZ *= -1;
        }
        var keyFrame0 = ["0.1", [
            [0.0, 0.0, 0.0],
            [0.0, 0.0, 0.0],
            [2.1, 1, 2.1]
        ]];
        var keyFrame1 = ["1.0", [
            [0.0, 0.5, 0.0],
            [0.0, 0.0, 0.0],
            [2.1, 1, 2.1]
        ]];
        var keyFrame2 = ["2.0", [
            [deltaX, 0.5, deltaZ],
            [0.0, 0.0, 0.0],
            [2.1, 1.0, 2.1]
        ]];
        var keyFrame3 = ["3.0", [
            [deltaX, 0.0, deltaZ],
            [0.0, 0.0, 0.0],
            [2.1, 1.0, 2.1]
        ]];


        let move = new MyKeyFrameAnimation(this, 100, [keyFrame0, keyFrame1, keyFrame2, keyFrame3]);
        let moveName = 'move' + String(Object.keys(this.graph.animations).length);

        this.graph.animations[moveName] = move;

        this.graph.nodes['piece' + String(index)].animations.push(moveName);

        move.changePos(index, deltaX, deltaZ);
    }

    leaveBoard(index) {
        this.graph.nodes['piece' + String(index)].transformMatrix[13] -= 1;
    }
    returnToBoard(index) {
        this.graph.nodes['piece' + String(index)].transformMatrix[13] += 1;
    }
}