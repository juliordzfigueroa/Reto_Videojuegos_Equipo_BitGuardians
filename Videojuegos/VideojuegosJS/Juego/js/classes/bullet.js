/*

    Equipo BitGuardians
    Clase del objeto Balas del jugador y enemigos
    Físicas de disparo recuperadas de: https://www.youtube.com/watch?v=JORxRP9hR3s&ab_channel=codigofacilito
*/

"use strict";

class Bullet extends GameObject{
    constructor(x, y, w, h, color, dx, dy, damage){
        super(color, w, h, x, y, "bullet");
        this.vx = dx * 0.01;
        this.vy = dy * 0.01;
        this.damage = damage;
        this.destroy = false; // Variable para saber si la bala debe ser destruida o no
    }

    update(level, deltaTime){
        let newposX = this.position.x + this.vx * deltaTime;
        let newposY = this.position.y + this.vy * deltaTime;

        if (level.contact(new Vec(newposX, newposY), this.size, "wall")){
            this.destroy = true; // Destruir la bala al impactar con una pared
            return;
        }
        this.position = new Vec(newposX, newposY);

        if (overlapRectangles(this, game.player)){
            game.player.takeDamage(this.damage); // Aplica daño al jugador
            this.destroy = true; // Destruir la bala al impactar con el jugador
        }
    }

    destroyBullet(){
        if (this.destroy){
            game.enemyBullets = game.enemyBullets.filter(bullet => !bullet.destroy);
        }
    }

}
