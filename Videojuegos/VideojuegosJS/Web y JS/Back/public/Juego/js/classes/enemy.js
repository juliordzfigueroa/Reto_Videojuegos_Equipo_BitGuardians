/*

    Equipo BitGuardians
    Clase del objeto Enemigo 

*/

class Enemy extends AnimatedObject{
    constructor(color, width, height, x, y, hp, weapon){
        super("green", width*2, height*2, x, y, "enemy");
        this.velocity = new Vec(0.0, 0.0);
        this.speed = 0.004; 
        this.hp = hp; 
        this.wapon = weapon; 
        this.stun = false; 
        this.stunTime = 0;
    }

    stun(duration){
        this.stun = true;
        this.stunTime = duration;
    } 

    update(level, deltaTime){

        if (this.stun){
            this.stunTime -= deltaTime;
            if (this.stunTime <= 0){
                this.stun = false;
                this.stunTimer = 0;
            }
            return;
        }

        let dx = game.player.position.x - this.position.x;
        let dy = game.player.position.y - this.position.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance == 0) return;

        let dirX = dx / distance;
        let dirY = dy / distance;

        this.velocity = new Vec(dirX, dirY).times(this.speed * deltaTime);
        let newPosition = this.position.plus(this.velocity);

        if (!level.contact(newPosition, this.size, 'wall')){
            this.position = newPosition;
        }

        this.updateFrame(deltaTime);
    }

    takeDamage(amount) {
        this.hp -= amount;
        if (this.hp <= 0){
            this.hp = 0;
            console.log("Enemy defeated");
            //Agregar sonido o animación o algo
        }
    }

}