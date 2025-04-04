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
                this.stunTimer = 0;
            }
            return;
        }

        this.time = deltaTime;
        let move = Math.sin(this.time*0.005)*0.002;
        let new_pos = new Vec(this.position.x, this.position.y + move)
        
        this.updateFrame(deltaTime);
    }


}