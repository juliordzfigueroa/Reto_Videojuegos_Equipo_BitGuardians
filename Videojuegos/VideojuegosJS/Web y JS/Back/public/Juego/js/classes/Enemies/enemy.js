/*

    Equipo BitGuardians
    Clase del objeto Enemigo 

*/

const stunDuration = 2000; // Atributo de duración del aturdimiento del enemigo 2 segundos

class Enemy extends AnimatedObject {
    constructor(color, width, height, x, y, type, hp , damage, speed, stunTime) {
        super("green", width, height, x, y, type);
        this.position = new Vec(x, y); // Initialize position
        this.velocity = new Vec(0.0, 0.0);
        this.hp = hp * adjustDifficulty(); // Atributo de vida del enemigo
        this.damage = damage * adjustDifficulty(); // Atributo de daño del enemigo  
        this.attackTimmer = 0; // Tiempo de ataque del enemigo
        this.nextAttack = 0; // Siguiente ataque del enemigo
        this.state = "idle"; // Estado del enemigo
        this.speed = speed; // Velocidad del enemigo
        this.stunTime = 0; // Tiempo de aturdimiento del enemigo por defecto
        this.speed = speed; // Velocidad máxima del enemigo por defecto
        this.baseSpeed = speed; // Velocidad base del enemigo por defecto
        this.destroyed = false; // Estado de destrucción del enemigo por defecto
        this.sfx ={
            shoot: new Audio("../assets/sfx/Sound_Effects/laser_gun.mp3"), // Sonido de disparo del enemigo
            hit: new Audio("../assets/sfx/Sound_Effects/Enemy_hit.wav"), // Sonido de golpe del enemigo
            death: new Audio("../assets/sfx/Sound_Effects/Enemy_defeated.wav") // Sonido de muerte del enemigo
        }
    }

    update() {
        // Método de actualización del enemigo vacío por defecto, variable por cada tipo de enemigo
    }

    startMovement(direction) {
        const dirData = this.movement[direction];
        if (!dirData) return; // Si no hay datos para esa dirección, salimos
        if (dirData.status) return;
        for (let dir in this.movement) {
            this.movement[dir].status = false;
        }
        dirData.status = true;
        this.currentDirection = direction;
        this.velocity[dirData.axis] = dirData.sign * this.speed;
        this.setAnimation(...dirData.moveFrames, dirData.repeat, dirData.duration);
    }


    stopMovement(direction) {
        const dirData = this.movement[direction];
        dirData.status = false;
        this.velocity[dirData.axis] = 0;
        this.setAnimation(...dirData.idleFrames, dirData.repeat, dirData.duration);
    }

    // Métodos temporales para hacer pruebas
    takeDamage(damage) { // Método para aplicar daño al enemigo
        this.sfx.hit.currentTime = 0; // reinicia si ya estaba sonando
        this.sfx.hit.play(); // Sonido de golpe del enemigo
        this.hp -= damage; // Se le resta el daño a la vida del enemigo
        if (this.hp <= 0) { // Si la vida del enemigo es menor o igual a 0, se destruye el enemigo
            this.sfx.death.currentTime = 0; // reinicia si ya estaba sonando
            this.sfx.death.play(); // Sonido de muerte del enemigo
            this.destroyed = true; // Atributo que inidca si el enemigo ha sido destruido
            // Se le suma 1 al contador de enemigos derrotados del jugador
            game.player.enemigosDerrotados += 1;
            console.log("Enemigo derrotado. Total:", game.player.enemigosDerrotados);
        }
    }
}
    
function adjustDifficulty() {
    return factor = 1 + (game.cLevel / 10); // Factor de dificultad basado en el nivel del juego
}