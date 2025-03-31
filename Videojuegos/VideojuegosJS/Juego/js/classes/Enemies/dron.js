class Dron extends Enemy {
    constructor(color, width, height, x, y, type) {
        super("blue", width * 2, height * 2, x, y, "dron", 50, 5, 3, 0.004, 1500);
        // Movimientos del enemigo
        this.movement = {
            right: {
                status: false,
                axis: "x",
                sign: 1,
                repeat: true,
                duration: 100,
                moveFrames: [20, 25],
                idleFrames: [20, 20]
            },
            left: {
                status: false,
                axis: "x",
                sign: -1,
                repeat: true,
                duration: 100,
                moveFrames: [30, 35],
                idleFrames: [30, 30]
            }
        };
    }
}
