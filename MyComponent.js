/**
 * MyComponent
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyComponent {
    constructor(graph, nodeID) {
        this.graph = graph;

        this.nodeID = nodeID;

        this.children = [];

        this.animations = [];

        this.materials = [];

        this.textureID = null;

        this.transformMatrix = mat4.create();
        mat4.identity(this.transformMatrix);
    }

    pushChild(nodeID) {
        this.children.push(nodeID);
    }
}