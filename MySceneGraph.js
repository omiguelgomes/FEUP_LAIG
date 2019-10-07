var DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var SCENE_INDEX = 0;
var VIEWS_INDEX = 1;
var AMBIENT_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var TRANSFORMATIONS_INDEX = 6;
var PRIMITIVES_INDEX = 7;
var COMPONENTS_INDEX = 8;

/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {
    /**
     * @constructor
     */
    constructor(filename, scene) {
        this.loadedOk = null;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;

        this.nodes = [];

        this.idRoot = null;                    // The id of the root element.

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        // File reading 
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */
        this.reader.open('scenes/' + filename, this);
    }

    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.onGraphLoaded();
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "lxs")
            return "root tag <lxs> missing";

        var nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        for (var i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

        var error;

        // Processes each node, verifying errors.
        // <scene>
        var index;
        if ((index = nodeNames.indexOf("scene")) == -1)
            return "tag <scene> missing";
        else {
            if (index != SCENE_INDEX)
                this.onXMLMinorError("tag <scene> out of order " + index);

            //Parse scene block
            if ((error = this.parseScene(nodes[index])) != null)
                return error;
        }

        // <views>
        if ((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <views> out of order");

            //Parse views block
            if ((error = this.parseView(nodes[index])) != null)
            {
                console.log(error);
                return error;
            }
        }

        // <ambient>
        if ((index = nodeNames.indexOf("ambient")) == -1)
            return "tag <ambient> missing";
        else {
            if (index != AMBIENT_INDEX)
                this.onXMLMinorError("tag <ambient> out of order");

            //Parse ambient block
            if ((error = this.parseAmbient(nodes[index])) != null)
                return error;
        }

        // <lights>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "tag <lights> missing";
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("tag <lights> out of order");

            //Parse lights block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
        }
        // <textures>
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <textures> out of order");

            //Parse textures block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }

        // <materials>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <materials> out of order");

            //Parse materials block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }

        // <transformations>
        if ((index = nodeNames.indexOf("transformations")) == -1)
            return "tag <transformations> missing";
        else {
            if (index != TRANSFORMATIONS_INDEX)
                this.onXMLMinorError("tag <transformations> out of order");

            //Parse transformations block
            if ((error = this.parseTransformations(nodes[index])) != null)
                return error;
        }

        // <primitives>
        if ((index = nodeNames.indexOf("primitives")) == -1)
            return "tag <primitives> missing";
        else {
            if (index != PRIMITIVES_INDEX)
                this.onXMLMinorError("tag <primitives> out of order");

            //Parse primitives block
            if ((error = this.parsePrimitives(nodes[index])) != null)
                return error;
        }

        // <components>
        if ((index = nodeNames.indexOf("components")) == -1)
            return "tag <components> missing";
        else {
            if (index != COMPONENTS_INDEX)
                this.onXMLMinorError("tag <components> out of order");

            //Parse components block
            if ((error = this.parseComponents(nodes[index])) != null)
                return error;
        }
        this.log("all parsed");
    }

    /**
     * Parses the <scene> block. 
     * @param {scene block element} sceneNode
     */
    parseScene(sceneNode) {

        // Get root of the scene.
        var root = this.reader.getString(sceneNode, 'root')
        if (root == null)
            return "no root defined for scene";

        this.idRoot = root;

        // Get axis length        
        var axis_length = this.reader.getFloat(sceneNode, 'axis_length');
        if (axis_length == null)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        this.referenceLength = axis_length || 1;

        this.log("Parsed scene");

        return null;
    }

    /**
     * Parses the <views> block.
     * @param {view block element} viewsNode
     */
    parseView(viewsNode) 
    {
        var children = viewsNode.children;
        
        this.cameras = {};
        var numViews = 0;

        this.default = this.reader.getString(viewsNode, 'default');
        if (this.default == null)
        {
            this.onXMLError('unable to parse default view');
        }

        for (var i = 0; i < children.length; i++)
        {
            var id = this.reader.getString(children[i], 'id')
            if (id == null)
            {
                this.onXMLError("unable to parse id value for view");

                for (var j = 0; j < this.cameras.length; j++)
                {
                    if (this.cameras[j].id == id)
                    {
                        this.onXMLError("repeated id");
                    }
                }
            }

                var camera;

                //near default value = 0.1 , far default value = 30, angle default value = 45 dg
                if (children[i].nodeName == "perspective")
                {
                    let near = this.reader.getFloat(children[i], "near");
                    if (!(near != null && !isNaN(near)))
                    {
                        near = 0.1;
                        this.onXMLMinorError("unable to parse perspective near value, default set to 0.1");
                    }

                    let far = this.reader.getFloat(children[i], 'far');
                    if (!(far != null && !isNaN(far)))
                    {
                        far = 30;
                        this.onXMLMinorError("unable to parse perspective far value, default set to 30");
                    }

                    if ( far < near)
                    {
                        var temp = near;
                        near = far;
                        far = temp;
                        this.onXMLMinorError("far value lower than near, switched values");
                    }

                    if (near <= 0)
                    {
                        near = 0.1;
                        this.onXMLMinorError("near value lower than 0, set default 0.1");
                    }

                    if (far <= 0)
                    {
                        far = 30;
                        this.onXMLMinorError("far value lower than 0, set default 30");
                    }

                    if (near == far)
                    {
                        near = 0.1;
                        far = 30;
                    }

                    let angle = this.reader.getFloat(children[i], 'angle');
                    if (!(angle != null && !isNaN(angle)))
                    {
                        angle = Math.PI / 2;
                        this.onXMLMinorError("unable to parse perspective far value, default set to 30");
                    }

                    angle = angle * DEGREE_TO_RAD;

                    var grandChildren = children[i].children;
                    var nodeNames = [];

                    for (var k = 0; k < grandChildren.length; k++)
                    {
                        nodeNames.push(grandChildren[k].nodeName);
                    }

                    var fromIndex = nodeNames.indexOf('from');

                    let from = [20, 20, 20]; //default values of from
                    if (fromIndex == -1)
                    {
                        this.onXMLMinorError("unable to parse from values, assuming [20,20,20]");
                    }
                    else 
                    {
                        from[0] = this.reader.getFloat(grandChildren[fromIndex], 'x');
                        from[1] = this.reader.getFloat(grandChildren[fromIndex], 'y');
                        from[2] = this.reader.getFloat(grandChildren[fromIndex], 'z');

                        if (!(from[0] != null && !isNaN(from[0])))
                        {
                            this.onXMLMinorError("unable to parse from[0] value, default set to 20");
                        }

                        if (!(from[1] != null && !isNaN(from[1])))
                        {
                            this.onXMLMinorError("unable to parse from[1] value, default set to 20");
                        }

                        if (!(from[2] != null && !isNaN(from[2])))
                        {
                            this.onXMLMinorError("unable to parse from[2] value, default set to 20");
                        }
                    }

                    var toIndex = nodeNames.indexOf('to');
                    let to = [0,0, 0]; //default values of to
                    if (fromIndex == -1)
                    {
                        this.onXMLMinorError("unable to parse 'to' values, assuming [0,0,0]");
                    }
                    else 
                    {
                        to[0] = this.reader.getFloat(grandChildren[toIndex], 'x');
                        to[1] = this.reader.getFloat(grandChildren[toIndex], 'y');
                        to[2] = this.reader.getFloat(grandChildren[toIndex], 'z');

                        if (!(to[0] != null && !isNaN(to[0])))
                        {
                            this.onXMLMinorError("unable to parse to[0] (x) value, default set to 0");
                        }

                        if (!(to[1] != null && !isNaN(to[1])))
                        {
                            this.onXMLMinorError("unable to parse to[1] (y) value, default set to 0");
                        }

                        if (!(to[2] != null && !isNaN(to[2])))
                        {
                            this.onXMLMinorError("unable to parse to[2] (z) value, default set to 0");
                        }
                    }
                    
                    let fromV = vec3.fromValues(from[0], from[1], from[2]);
                    let toV = vec3.fromValues(to[0], to[1], to[2]);

                    camera = new CGFcamera(angle, near, far, fromV, toV);

                    this.log("Parsed perpective");
                }
                else if (children[i].nodeName == ortho)
                {
                    var near = this.reader.getFloat(children[i], 'near');
                    if (!(near != null && !isNaN(near)))
                    {
                        near = 0.1;
                        this.onXMLMinorError("unable to parse ortho near value, default set to 0.1");
                    }

                    var far = this.reader.getFloat(children[i], 'far');
                    if (!(far != null && !isNaN(far)))
                    {
                        far = 0.1;
                        this.onXMLMinorError("unable to parse ortho far value, default set to 0.1");
                    }
                }

                this.cameras[id] = camera;
                numViews++;

                if (id == this.default)
                {
                    this.scene.camera = camera;
                    this.scene.interface.setActiveCamera(camera);
                }
            }

        if (numViews <= 0)
            return "there must be at least one camera."

        this.log("Parsed Views");

        return null;
    }

    /**
     * Parses the <ambient> node.
     * @param {ambient block element} ambientsNode
     */
    parseAmbient(ambientsNode) {

        var children = ambientsNode.children;

        this.ambient = [];
        this.background = [];

        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var ambientIndex = nodeNames.indexOf("ambient");
        var backgroundIndex = nodeNames.indexOf("background");

        var color = this.parseColor(children[ambientIndex], "ambient");
        if (!Array.isArray(color))
            return color;
        else
            this.ambient = color;

        color = this.parseColor(children[backgroundIndex], "background");
        if (!Array.isArray(color))
            return color;
        else
            this.background = color;

        this.log("Parsed ambient");

        return null;
    }

    /**
     * Parses the <light> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {
        var children = lightsNode.children;

        this.lights = [];
        var numLights = 0;

        var grandChildren = [];
        var nodeNames = [];

        // Any number of lights.
        for (var i = 0; i < children.length; i++) {

            // Storing light information
            var global = [];
            var attributeNames = [];
            var attributeTypes = [];

            //Check type of light
            if (children[i].nodeName != "omni" && children[i].nodeName != "spot") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }
            else {
                attributeNames.push(...["location", "ambient", "diffuse", "specular"]);
                attributeTypes.push(...["position", "color", "color", "color"]);
            }

            // Get id of the current light.
            var lightId = this.reader.getString(children[i], 'id');
            if (lightId == null)
                return "no ID defined for light";

            // Checks for repeated IDs.
            if (this.lights[lightId] != null)
                return "ID must be unique for each light (conflict: ID = " + lightId + ")";

            // Light enable/disable
            var enableLight = true;
            var aux = this.reader.getBoolean(children[i], 'enabled');
            if (!(aux != null && !isNaN(aux) && (aux == true || aux == false)))
                this.onXMLMinorError("unable to parse value component of the 'enable light' field for ID = " + lightId + "; assuming 'value = 1'");

            enableLight = aux || 1;

            //Add enabled boolean and type name to light info
            global.push(enableLight);
            global.push(children[i].nodeName);

            grandChildren = children[i].children;
            // Specifications for the current light.

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            for (var j = 0; j < attributeNames.length; j++) {
                var attributeIndex = nodeNames.indexOf(attributeNames[j]);

                if (attributeIndex != -1) {
                    if (attributeTypes[j] == "position")
                        var aux = this.parseCoordinates4D(grandChildren[attributeIndex], "light position for ID" + lightId);
                    else
                        var aux = this.parseColor(grandChildren[attributeIndex], attributeNames[j] + " illumination for ID" + lightId);

                    if (!Array.isArray(aux))
                        return aux;

                    global.push(aux);
                }
                else
                    return "light " + attributeNames[i] + " undefined for ID = " + lightId;
            }

            // Gets the additional attributes of the spot light
            if (children[i].nodeName == "spot") {
                var angle = this.reader.getFloat(children[i], 'angle');
                if (!(angle != null && !isNaN(angle)))
                    return "unable to parse angle of the light for ID = " + lightId;

                var exponent = this.reader.getFloat(children[i], 'exponent');
                if (!(exponent != null && !isNaN(exponent)))
                    return "unable to parse exponent of the light for ID = " + lightId;

                var targetIndex = nodeNames.indexOf("target");

                // Retrieves the light target.
                var targetLight = [];
                if (targetIndex != -1) {
                    var aux = this.parseCoordinates3D(grandChildren[targetIndex], "target light for ID " + lightId);
                    if (!Array.isArray(aux))
                        return aux;

                    targetLight = aux;
                }
                else
                    return "light target undefined for ID = " + lightId;

                global.push(...[angle, exponent, targetLight])
            }

            this.lights[lightId] = global;
            numLights++;
        }

        if (numLights == 0)
            return "at least one light must be defined";
        else if (numLights > 8)
            this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

        this.log("Parsed lights");
        return null;
    }

    /**
     * Parses the <textures> block. 
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) 
    {
        var children = texturesNode.children;
        this.textures = [];
        var numTexts = 0;


        for (var i = 0; i < children.length; i++) 
        {

            if (children[i].nodeName != "texture") 
            {
                return "unknown tag <" + children[i].nodeName + ">";
                continue;
            }

            var textureId = this.reader.getString(children[i], 'id');
            if (textureId == null) 
            {
                return "no ID defined for texture";
            }

            if (this.textures[textureId] != null)
            {
                return "ID must be unique for each texture (conflict: ID = " + textureID + ")";
            }

            var textureFile = this.reader.getString(children[i], 'file');
            if (textureFile == null) 
            {
                return "no file defined for texture";
            }

            var texture = new CGFtexture(this.scene, textureFile);
            this.textures[textureId] = texture;

            numTexts++;
        }

        if (numTexts == 0) 
        {
             return "there must be at least one texture defined";
        }

        this.log("Parsed textures");
        return null;
    }

    /**
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) 
    {
        var children = materialsNode.children;
        this.materials = [];
        var numMats = 0;

        for (var i = 0; i < children.length; i++) 
        {
            if (children[i].nodeName != "material") 
            {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            var materialID = this.reader.getString(children[i], 'id');
            if (materialID == null)
                return "no ID defined for material";

            if (this.materials[materialID] != null)
                return "ID must be unique for each light (conflict: ID = " + materialID + ")";

            var materialShininess = this.reader.getString(children[i], 'shininess');
            if (materialShininess == null) 
                return "no shininess defined for material";

            var values = children[i].children;
            var appearance = new CGFappearance(this.scene);
            appearance.setShininess(materialShininess);

            for (var j = 0; j < values.length; j++)
            {
                switch(values[i].nodeName)
                {
                    case 'emission':
                        
                            var red = this.reader.getFloat(values[i], 'r');
                            if(!(red != null && !isNaN(red)))
                            {
                                return "unable to parse red value of emission of" + materialID;
                            }

                            var blue = this.reader.getFloat(values[i], 'b');
                            if(!(blue != null && !isNaN(blue)))
                            {
                                return "unable to parse red value of emission of" + materialID;
                            }

                            var green = this.reader.getFloat(values[i], 'g');
                            if(!(green != null && !isNaN(green)))
                            {
                                return "unable to parse red value of emission of" + materialID;
                            }

                            var alpha = this.reader.getFloat(values[i], 'a');
                            if(!(alpha != null && !isNaN(alpha)))
                            {
                                return "unable to parse red value of emission of" + materialID;
                            }

                            appearance.setEmission(red, blue, green, alpha);
                            break;
                        
                    case 'ambient':
                        
                            var red = this.reader.getFloat(values[i], 'r');
                            if(!(red != null && !isNaN(red)))
                            {
                                return "unable to parse red value of ambient of" + materialID;
                            }

                            var blue = this.reader.getFloat(values[i], 'b');
                            if(!(blue != null && !isNaN(blue)))
                            {
                                return "unable to parse red value of ambient of" + materialID;
                            }

                            var green = this.reader.getFloat(values[i], 'g');
                            if(!(green != null && !isNaN(green)))
                            {
                                return "unable to parse red value of ambient of" + materialID;
                            }

                            var alpha = this.reader.getFloat(values[i], 'a');
                            if(!(alpha != null && !isNaN(alpha)))
                            {
                                return "unable to parse red value of ambient of" + materialID;
                            }

                            appearance.setAmbient(red, blue, green, alpha);
                            break;
                        
                    case 'diffuse':
                        
                            var red = this.reader.getFloat(values[i], 'r');
                            if(!(red != null && !isNaN(red)))
                            {
                                return "unable to parse red value of diffuse of" + materialID;
                            }

                            var blue = this.reader.getFloat(values[i], 'b');
                            if(!(blue != null && !isNaN(blue)))
                            {
                                return "unable to parse red value of diffuse of" + materialID;
                            }

                            var green = this.reader.getFloat(values[i], 'g');
                            if(!(green != null && !isNaN(green)))
                            {
                                return "unable to parse red value of diffuse of" + materialID;
                            }

                            var alpha = this.reader.getFloat(values[i], 'a');
                            if(!(alpha != null && !isNaN(alpha)))
                            {
                                return "unable to parse red value of diffuse of" + materialID;
                            }

                            appearance.setDiffuse(red, blue, green, alpha);
                            break;
                        
                    case 'specular':
                        
                            var red = this.reader.getFloat(values[i], 'r');
                            if(!(red != null && !isNaN(red)))
                            {
                                return "unable to parse red value of specular of" + materialID;
                            }

                            var blue = this.reader.getFloat(values[i], 'b');
                            if(!(blue != null && !isNaN(blue)))
                            {
                                return "unable to parse red value of specular of" + materialID;
                            }

                            var green = this.reader.getFloat(values[i], 'g');
                            if(!(green != null && !isNaN(green)))
                            {
                                return "unable to parse red value of specular of" + materialID;
                            }

                            var alpha = this.reader.getFloat(values[i], 'a');
                            if(!(alpha != null && !isNaN(alpha)))
                            {
                                return "unable to parse red value of specular of" + materialID;
                            }

                            appearance.setDiffuse(red, blue, green, alpha);
                            break;
                        
                }
            }

            this.materials[materialID] = appearance;
            numMats++;

        }

        if(numMats <= 0)
        {
            return "there must be at least one defined material";
        }

        this.log("Parsed materials");
        return null;
    }

    /**
     * Creates the matrix for a single transformation
     * @param {list of transformation types} grandChildren 
     * @param {ID of transformation} transformationID 
     */
    parseTransformation(grandChildren, transformationID)
    {
        var transfMatrix = mat4.create();

        for (var j = 0; j < grandChildren.length; j++) 
        {
            switch (grandChildren[j].nodeName) 
            {
                case 'translate':
                    var coordinates = this.parseCoordinates3D(grandChildren[j], "translate transformation for ID " + transformationID);
                    if (!Array.isArray(coordinates))
                        return coordinates;

                    transfMatrix = mat4.translate(transfMatrix, transfMatrix, coordinates);
                    break;
                case 'scale':
                    var scalingAux = this.parseCoordinates3D(grandChildren[j], "translate transformation for ID " + transformationID);

                    if (!Array.isArray(scalingAux))
                        return scalingAux;

                    transfMatrix = mat4.scale(transfMatrix, transfMatrix, scalingAux);

                    break;
                case 'rotate':
                    var axis = this.reader.getString(grandChildren[j], 'axis');
                    if (axis == null || (axis != 'x' && axis != 'y' && axis != 'z')) {
                        this.onXMLError("unable to parse axis of rotation of" + transformationID);
                        break;
                    }

                    var angle = this.reader.getFloat(grandChildren[j], 'angle');
                    if (!(angle != null && !isNaN(angle))) {
                        this.onXMLError("unable to parse angle of rotation of" + transformationID);
                        break;
                    }

                    angle = angle * DEGREE_TO_RAD;

                    var axisV;
                    switch (axis) 
                    {
                        case 'x':
                            axisV = vec3.fromValues(1, 0, 0);
                            break;
                        case 'y':
                            axisV = vec3.fromValues(0, 1, 0);
                            break;
                        case 'z':
                            axisV = vec3.fromValues(0, 0, 1);
                            break;
                    }

                    transfMatrix = mat4.rotate(transfMatrix, transfMatrix, angle, axisV)
                    break;
            }
        }

        return transfMatrix;
    }

    /**
     * Parses the <transformations> block.
     * @param {transformations block element} transformationsNode
     */
    parseTransformations(transformationsNode)
    {
        var children = transformationsNode.children;

        this.transformations = [];

        var grandChildren = [];


        // Any number of transformations.
        for (var i = 0; i < children.length; i++) 
        {

            if (children[i].nodeName != "transformation")
            {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current transformation.
            var transformationID = this.reader.getString(children[i], 'id');
            if (transformationID == null)
                return "no ID defined for transformation";

            // Checks for repeated IDs.
            if (this.transformations[transformationID] != null)
                return "ID must be unique for each transformation (conflict: ID = " + transformationID + ")";

            grandChildren = children[i].children;

            this.transformations[transformationID] = this.parseTransformation(grandChildren, transformationID);
        }

        this.log("Parsed transformations");
        return null;
    }

    /**
     * Parses the <primitives> block.
     * @param {primitives block element} primitivesNode
     */
    parsePrimitives(primitivesNode) {
        var children = primitivesNode.children;

        this.primitives = [];

        var grandChildren = [];

        // Any number of primitives.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "primitive") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current primitive.
            var primitiveId = this.reader.getString(children[i], 'id');
            if (primitiveId == null)
                return "no ID defined for texture";

            // Checks for repeated IDs.
            if (this.primitives[primitiveId] != null)
                return "ID must be unique for each primitive (conflict: ID = " + primitiveId + ")";

            grandChildren = children[i].children;

            // Validate the primitive type
            if (grandChildren.length != 1 ||
                (grandChildren[0].nodeName != 'rectangle' && grandChildren[0].nodeName != 'triangle' &&
                    grandChildren[0].nodeName != 'cylinder' && grandChildren[0].nodeName != 'sphere' &&
                    grandChildren[0].nodeName != 'torus')) {
                console.log(children);
                return "There must be exactly 1 primitive type (rectangle, triangle, cylinder, sphere or torus)"
            }

            // Specifications for the current primitive.
            var primitiveType = grandChildren[0].nodeName;

            // Retrieves the primitive coordinates.
            if (primitiveType == 'rectangle') { //rectangle
                // x1
                var x1 = this.reader.getFloat(grandChildren[0], 'x1');
                if (!(x1 != null && !isNaN(x1)))
                    return "unable to parse x1 of the primitive coordinates for ID = " + primitiveId;

                // y1
                var y1 = this.reader.getFloat(grandChildren[0], 'y1');
                if (!(y1 != null && !isNaN(y1)))
                    return "unable to parse y1 of the primitive coordinates for ID = " + primitiveId;

                // x2
                var x2 = this.reader.getFloat(grandChildren[0], 'x2');
                if (!(x2 != null && !isNaN(x2) && x2 > x1))
                    return "unable to parse x2 of the primitive coordinates for ID = " + primitiveId;

                // y2
                var y2 = this.reader.getFloat(grandChildren[0], 'y2');
                if (!(y2 != null && !isNaN(y2) && y2 > y1))
                    return "unable to parse y2 of the primitive coordinates for ID = " + primitiveId;

                var rect = new MyRectangle(this.scene, primitiveId, x1, x2, y1, y2);

                this.primitives[primitiveId] = rect;
            }

            if (primitiveType == 'cylinder') { //cylinder
                // base
                var base = this.reader.getFloat(grandChildren[0], 'base');
                if (!(base != null && !isNaN(base)))
                    return "unable to parse base of the primitive coordinates for ID = " + primitiveId;

                // top
                var top = this.reader.getFloat(grandChildren[0], 'top');
                if (!(top != null && !isNaN(top)))
                    return "unable to parse top of the primitive coordinates for ID = " + primitiveId;

                // height
                var height = this.reader.getFloat(grandChildren[0], 'height');
                if (!(height != null && !isNaN(height)))
                    return "unable to parse height of the primitive coordinates for ID = " + primitiveId;

                // slices
                var slices = this.reader.getFloat(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices)))
                    return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;

                // stacks
                var stacks = this.reader.getFloat(grandChildren[0], 'stacks');
                if (!(stacks != null && !isNaN(stacks)))
                    return "unable to parse stacks of the primitive coordinates for ID = " + primitiveId;

                var cylinder = new MyCylinder(this.scene, primitiveId, base, top, height, slices, stacks);

                this.primitives[primitiveId] = cylinder;
            }
            if (primitiveType == 'sphere') { //sphere (gives tag missing error)
                radius
                var radius = this.reader.getFloat(grandChildren[0], 'radius');
                if (!(radius != null && !isNaN(radius)))
                    return "unable to parse radius of the primitive coordinates for ID = " + primitiveId;

                slices
                var slices = this.reader.getFloat(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices)))
                    return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;

                stacks
                var stacks = this.reader.getFloat(grandChildren[0], 'stacks');
                if (!(stacks != null && !isNaN(stacks)))
                    return "unable to parse stacks of the primitive coordinates for ID = " + primitiveId;

                var sphere = new MySphere(this.scene, primitiveId, radius, slices, stacks);

                this.primitives[primitiveId] = sphere;
            }
            if (primitiveType == 'torus') { //torus
                // inner
                var inner = this.reader.getFloat(grandChildren[0], 'inner');
                if (!(inner != null && !isNaN(inner)))
                    return "unable to parse inner of the primitive coordinates for ID = " + primitiveId;

                // outer
                var outer = this.reader.getFloat(grandChildren[0], 'outer');
                if (!(outer != null && !isNaN(outer)))
                    return "unable to parse outer of the primitive coordinates for ID = " + primitiveId;

                // slices
                var slices = this.reader.getFloat(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices)))
                    return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;

                // loops
                var loops = this.reader.getFloat(grandChildren[0], 'loops');
                if (!(loops != null && !isNaN(loops)))
                    return "unable to parse loops of the primitive coordinates for ID = " + primitiveId;

                var torus = new MyTorus(this.scene, primitiveId, inner, outer, slices, loops);

                this.primitives[primitiveId] = torus;
            }
            else {
                console.warn("To do: Parse other primitives.");
            }
        }

        this.log("Parsed primitives");
        return null;
    }

    /**
   * Parses the <components> block.
   * @param {components block element} componentsNode
   */
    parseComponents(componentsNode) {
        var children = componentsNode.children;

        this.components = [];
        var tMatrix;

        var grandChildren = [];
        var grandgrandChildren = [];
        var nodeNames = [];

        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "component") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            var componentID = this.reader.getString(children[i], 'id');
            if (componentID == null)
                return "no ID defined for componentID";

            if (this.components[componentID] != null)
                return "ID must be unique for each component (conflict: ID = " + componentID + ")";

            grandChildren = children[i].children;

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            var transformationIndex = nodeNames.indexOf("transformation");
            var materialsIndex = nodeNames.indexOf("materials");
            var textureIndex = nodeNames.indexOf("texture");
            var childrenIndex = nodeNames.indexOf("children");

            this.onXMLMinorError("To do: Parse components.");

            //Transformations
            if (transformationIndex == -1) {
                return "the '<transformation>' block should be defined for component " + componentId;
            }

            grandgrandChildren = grandChildren[transformationIndex].children;

            if (grandgrandChildren.length == 0) {
                tMatrix = mat4.create();
            }
            else if (grandgrandChildren[0].nodeName == "transformationref") {
                tMatrix = this.transformations[this.reader.getString(grandgrandChildren[0], 'id')];
            }
            else {
                tMatrix = this.parseTransformation(grandgrandChildren);
            }


            // Materials
            if (materialsIndex == -1) {
                return "the '<material>' block should be defined for component " + componentId;
            }

            var grandgrandChildren = grandChildren[materialsIndex].children;
            var mats = [];
            var matId;

            for (var k = 0; k < grandgrandChildren.length; k++) {
                matId = this.reader.getString(grandgrandChildren[k], 'id');
                mats.push(this.materials[matId]);
            }

            // Texture
            if (textureIndex == -1) {
                return "the '<texture>' block should be defined for component " + componentId;
            }

            //var texts = grandChildren[textureIndex].children;
            var tInfo = [];
            tInfo[0] = this.textures[this.reader.getString(grandChildren[textureIndex], 'id')];

            tInfo[1] = this.reader.getFloat(grandChildren[textureIndex], 'length_s', false);
            if (!(tInfo[1] != null && !isNaN(tInfo[1]))) {
                this.onXMLMinorError("unable to parse the 's' length of texture, assuming default value of 1");
                tInfo[1] = 1;
            }

            tInfo[2] = this.reader.getFloat(grandChildren[textureIndex], 'length_t', false);
            if (!(tInfo[2] != null && !isNaN(tInfo[2]))) {
                this.onXMLMinorError("unable to parse the 't' length of texture, assuming default value of 1");
                tInfo[2] = 1;
            }

            // Children
            if (childrenIndex == -1) {
                return "the '<children>' block should be defined for component " + componentId;
            }

            var primitives = [];
            var comps = [];

            grandgrandChildren = grandChildren[childrenIndex].children;
            for (var j = 0; j < grandgrandChildren.length; j++) {
                var ids = this.reader.getString(grandgrandChildren[j], 'id');

                if (grandgrandChildren[j].nodeName == "componentref") {
                    comps.push(ids);
                }
                else if (grandgrandChildren[j].nodeName == "primitiveref") {
                    primitives.push(ids);
                }
                else {
                    this.onXMLMinorError("unknown primitive/component tag of component" + componentID);
                }
            }
        }
    }

    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates3D(node, messageError) 
    {
        var position = [];

        // x
        var x = this.reader.getFloat(node, 'x');
        if (!(x != null && !isNaN(x)))
            return "unable to parse x-coordinate of the " + messageError;

        // y
        var y = this.reader.getFloat(node, 'y');
        if (!(y != null && !isNaN(y)))
            return "unable to parse y-coordinate of the " + messageError;

        // z
        var z = this.reader.getFloat(node, 'z');
        if (!(z != null && !isNaN(z)))
            return "unable to parse z-coordinate of the " + messageError;

        position.push(...[x, y, z]);

        return position;
    }

    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates4D(node, messageError) {
        var position = [];

        //Get x, y, z
        position = this.parseCoordinates3D(node, messageError);

        if (!Array.isArray(position))
            return position;


        // w
        var w = this.reader.getFloat(node, 'w');
        if (!(w != null && !isNaN(w)))
            return "unable to parse w-coordinate of the " + messageError;

        position.push(w);

        return position;
    }

    /**
     * Parse the color components from a node
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseColor(node, messageError) {
        var color = [];

        // R
        var r = this.reader.getFloat(node, 'r');
        if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
            return "unable to parse R component of the " + messageError;

        // G
        var g = this.reader.getFloat(node, 'g');
        if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
            return "unable to parse G component of the " + messageError;

        // B
        var b = this.reader.getFloat(node, 'b');
        if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
            return "unable to parse B component of the " + messageError;

        // A
        var a = this.reader.getFloat(node, 'a');
        if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
            return "unable to parse A component of the " + messageError;

        color.push(...[r, g, b, a]);

        return color;
    }

    /*
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) {
        console.warn("Warning: " + message);
    }

    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() 
    {
        //PLANETS
        this.primitives['sunSphere'].display();

        this.scene.pushMatrix();
        this.scene.translate(10, 0, 0);
        this.primitives['mercurySphere'].display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.rotate((Math.PI*3/4)*2, 0, 1, 0);
        this.scene.translate(20, 0, 0);
        this.primitives['venusSphere'].display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();
        this.scene.rotate((Math.PI*3/4)*3, 0, 1, 0);
        this.scene.translate(30, 0, 0);
        this.primitives['earthSphere'].display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();
        this.scene.rotate((Math.PI*3/4)*4, 0, 1, 0);
        this.scene.translate(40, 0, 0);
        this.primitives['marsSphere'].display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();
        this.scene.rotate((Math.PI*3/4)*5, 0, 1, 0);
        this.scene.translate(60, 0, 0);
        this.primitives['jupiterSphere'].display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();
        this.scene.rotate((Math.PI*3/4)*6, 0, 1, 0);
        this.scene.translate(70, 0, 0);
        this.primitives['saturnSphere'].display();
        this.scene.rotate(Math.PI/3, 1, 0, 0);
        this.scene.scale(1, 1, 0);
        this.primitives['saturnRingTorus'].display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();
        this.scene.rotate((Math.PI*3/4)*7, 0, 1, 0);
        this.scene.translate(80, 0, 0);
        this.primitives['uranusSphere'].display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();
        this.scene.rotate((Math.PI*3/4)*8, 0, 1, 0);
        this.scene.translate(90, 0, 0);
        this.primitives['neptuneSphere'].display();
        this.scene.rotate(Math.PI/10, 1, 0, 0);
        this.scene.scale(1, 1, 0);
        this.primitives['neptuneRingTorus'].display();
        this.scene.popMatrix();

        //ORBIT RINGS
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.primitives['mercuryOrbitTorus'].display();
        this.primitives['venusOrbitTorus'].display();
        this.primitives['earthOrbitTorus'].display();
        this.primitives['marsOrbitTorus'].display();
        this.primitives['jupiterOrbitTorus'].display();
        this.primitives['saturnOrbitTorus'].display();
        this.primitives['uranusOrbitTorus'].display();
        this.primitives['neptuneOrbitTorus'].display();
        this.scene.popMatrix();

        //BELTS
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.primitives['kuiperBeltTorus'].display();
        this.primitives['asteroidBeltTorus'].display();
        this.scene.popMatrix();

    }
}