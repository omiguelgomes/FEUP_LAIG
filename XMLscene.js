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
        this.earthCamera = false;
        this.sunCamera = false;
        this.secondLight = false;
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

        //secCam
        //o objeto cameraObject é basicamente um retangulo com um shader por cima
        this.cameraObject = new MySecurityCamera(this);

        //aqui faz-se o render to texture com o tamanho da scene de modo a se poder colocar a secCam no sitio
        //certo. esta é a textura que se vai fazer 'bind' à cena mais tarde
        this.cameraTexture = new CGFtextureRTT(this, this.gl.canvas.width, this.gl.canvas.height);
    }

    /**
     * Initializes the scene cameras.
     */
    initCameras() {
            this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
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
                    this.lights[i].setSpotCutOff(light[6]);
                    this.lights[i].setSpotExponent(light[7]);
                    this.lights[i].setSpotDirection(light[8][0], light[8][1], light[8][2]);
                }

                this.lights[i].setVisible(true);
                if (light[0]) {
                    this.lights[i].enable();
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
        /** Handler called when the graph is finally loaded. 
         * As loading is asynchronous, this may be called already after the application has started the run loop
         */
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
            this.updateCameras();
            this.updateLights();
        }

        //lines in secCam
        let time = t;
        //time = time / 100 % 1000;
        //this.cameraObject.updateLines(time);

        //this.updateAnimation(t);
    }



    updateCameras() {
        if (this.sunCamera) {
            this.graph.scene.camera = this.graph.cameras["sunCamera"];
            this.graph.scene.interface.setActiveCamera(this.graph.scene.camera);
        } else if (this.earthCamera) {
            this.graph.scene.camera = this.graph.cameras["earthCamera"];
            this.graph.scene.interface.setActiveCamera(this.graph.scene.camera);
        } else {
            this.graph.scene.camera = this.graph.cameras["defaultCamera"];
            this.graph.scene.interface.setActiveCamera(this.graph.scene.camera);
        }
    }

    updateLights() { //only works for 2 lights atm
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

    render() {
        // ---- BEGIN Background, camera and axis setup

        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();

        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        this.pushMatrix();
        this.axis.display();

        for (var i = 0; i < this.lights.length; i++) {
            this.lights[i].setVisible(true);
            this.lights[i].enable();
        }

        if (this.sceneInitiated) {
            // Draw axis
            this.setDefaultAppearance();

            // Displays the scene (MySceneGraph function).
            this.graph.displayScene();
        }

        this.popMatrix();
    }

    display() {

        this.render();

        //o frameBuffer tem a informacao de core, pixeis e distancias da cena
        //aqui dizemos que queremos que a cameratexture seja justaposta a este buffer
        // criando assim a camara dentro da cena que replica a cena em si
        this.cameraTexture.attachToFrameBuffer();
        this.render();
        this.cameraTexture.detachFromFrameBuffer();

        //para perceber esta parte o melhor é mesmo ver os slides que eles deram que nem eu percebo 
        //mto bem esta parte...
        this.gl.disable(this.gl.DEPTH_TEST);
        //this.cameraObject.display();
        this.gl.enable(this.gl.DEPTH_TEST);

        this.setActiveShader(this.defaultShader);

        // ---- END Background, camera and axis setup
    }
}