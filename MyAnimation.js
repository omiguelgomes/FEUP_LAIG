/**
 * MyAnimation
 * @constructor
 */
class MyAnimation {
    constructor(scene) {
        this.scene = scene;
        //Fake abstract class
        if (this.constructor === MyAnimation) {
            throw new TypeError('Abstract class "Widget" cannot be instantiated directly.');
        }
    };
    update() {};
    apply() {};

};