/**
 * MyAnimation
 * @constructor
 */
class MyAnimation extends CGFobject {
    constructor(scene, id, inner, outer, slices, loops) {

        //Fake abstract class
        if (this.constructor === Widget) {
            throw new TypeError('Abstract class "Widget" cannot be instantiated directly.');
        }

        if (this.schema === undefined) {
            throw new TypeError('Classes extending the widget abstract class');
        }

        super(scene);
        this.initBuffers();
    };
    update() {};
    apply() {};

};