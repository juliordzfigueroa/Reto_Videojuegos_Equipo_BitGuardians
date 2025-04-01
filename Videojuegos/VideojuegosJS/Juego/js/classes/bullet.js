/*

    Equipo BitGuardians
    Object Class for the object Bullet

*/

class Bullet extends GameObject{
    constructor(x,y,w,h, color, dx, dy){
        super(color, w, h, x, y, "enemyBullet");
        this.vx = dx * 0.01;
        this.vy = dy * 0.01;
        this.damage = 1;
        this.destroy = false;
    }

    update(level, deltaTime){
        let newposX = this.position.x + this.vx * deltaTime;
        let newposY = this.position.y + this.vy * deltaTime;

        if (level.contact(new Vec(newposX, newposY), this.size, "wall")){
            this.destroy = true;
            return;
        }
        this.position = new Vec(newposX, newposY);

        if (overlapRectangles(this, game.player)){
            game.player.hp -= this.damage;
            this.destroy = true;
        }
    }
}