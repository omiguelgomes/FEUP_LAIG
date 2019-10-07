/**
 * MyComponent
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyComponent extends CGFobject 
{
    constructor(scene, id, tranfMatrix, materials, tInfo, primitivesRef, componentsRef)
    {
        super(scene);
        this.visited = false;

        this.id = id;
        this.matrix = tranfMatrix;
        this.materials = materials; //varios materiais

        this.texture = tInfo[0];
        this.ls = tInfo[1];
        this.lt = tInfo[2];

        this.primitives = primitivesRef;
        this.components = componentsRef;
        
        // for (var i = 0; i < materials.length; i++)
        // {
        //     materials[i].loadTexture(texture)
        //     materials[i].setTextureWrap(ls, lt);
        // }


    }

    display()
    {
        
    }
}