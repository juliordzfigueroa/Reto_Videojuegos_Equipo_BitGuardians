/*


*/

class Boss extends Enemy{
    constructor(color, width, height, x, y, type) {
        super("blue", width * 2, height * 2, x, y, "boss", 50, 5, 0.025, 1500);
        this.hitBox = new HitBox(this.position.x, this.position.y, this.size.x*0.6, this.size.y*0.8); // Hitbox del enemigo robot
        this.state = state;
        this.shootCooldown = 0; // Tiempo de recarga del disparo del enemigo
        this.type= Math.random();
    }
}