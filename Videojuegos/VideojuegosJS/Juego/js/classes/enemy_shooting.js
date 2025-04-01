/*

    Equipo BitGuardians
    Clase del objeto enemigo que dispara

*/

class shooter extends Enemy{
    constructor(color, width, height, x, y, hp, weapon){
        super("green", width*2, height*2, x, y, "enemy");
        this.cooldown = 0;
        this.time = 0;
    }

    update(level, deltaTime){

        if (this.stun){
            this.stunTime -= deltaTime;
            if (this.stunTime <= 0){
                this.stun = false;
                this.stunTime = 0;
            }
            return;
        }

        this.time += deltaTime;
        let move = Math.sin(this.time*0.005)*0.002;
        let new_pos = new Vec(this.position.x, this.position.y + move)
        if (!level.contact(new_pos, this.size, "wall")) {
            this.position = new_pos;
        }

        this.cooldown += deltaTime;
        if (this.cooldown >= 1500){
            this.cooldown = 0;

            let px = game.player.position.x;
            let py = game.player.position.y;
            let dx = px - this.position.x;
            let dy = py - this.position.y;
            let dist = Math.sqrt(dx * dx + dy * dy);

            if (dist > 0){
                dx = dx / dist;
                dy = dy / dist;

                let bullet = new Bullet(this.position.x, this.position.y, 0.3, 0.3, "red", dx, dy);
                level.actors.push(bullet);
            }
        }

        this.updateFrame(deltaTime);
    }
}