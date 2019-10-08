/**
 * MyComponent
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyComponent
{
    constructor(graph, nodeID) 
    {
            this.graph = graph;
        
            this.nodeID = nodeID;
        
            // IDs of child nodes.
            this.children = [];
        
        
            // The materials
            this.materials = [];
        
            // The texture ID.
            this.textureID = null;
        
            this.transformMatrix = mat4.create();
            mat4.identity(this.transformMatrix);
    }

    pushChild(nodeID) 
    {
        this.children.push(nodeID);
    }
}