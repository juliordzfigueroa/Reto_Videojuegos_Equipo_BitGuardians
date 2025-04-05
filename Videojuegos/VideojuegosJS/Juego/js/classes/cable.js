class Cable extends AnimatedObject {
    constructor(_color, width, height, x, y, _type) {
        super("yellow", width, height, x, y, "cable");
    }

    update(_level, deltaTime) {
        this.updateFrame(deltaTime);
    }
}