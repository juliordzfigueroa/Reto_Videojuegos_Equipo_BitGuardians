/*


*/

class Boss extends Robot {
    constructor(color, width, height, x, y, type) {
        super("blue", width+1, height+1, x, y, "boss", 200, 15, 0.003, 1500);
        this.hitBox = new HitBox(this.position.x, this.position.y, this.size.x * 0.6, this.size.y * 0.8);
        this.shootCooldown = 0;
        this.type = "boss";
        this.setAnimation(0, 0, true, 100);
    }
}