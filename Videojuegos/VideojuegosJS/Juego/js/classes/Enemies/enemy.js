/*

    Equipo BitGuardians
    Clase del objeto Enemigo 

*/

let stunDuration = 2000; // Atributo de duración del aturdimiento del enemigo 2 segundos

class Enemy extends AnimatedObject {
    constructor(color, width, height, x, y, type, hp, damage, speed, stunTime) {
        super("green", width, height, x, y, type);
        this.position = new Vec(x, y); // Initialize position
        this.velocity = new Vec(0.0, 0.0);
        this.hp = hp; // Atributo de vida del enemigo
        this.damage = damage; // Atributo de daño del enemigo  
        this.attackTimmer = 0; // Tiempo de ataque del enemigo</p>
        this.nextAttack = 0; // Siguiente ataque del enemigo
        this.state = "idle"; // Estado del enemigo
        this.speed = speed; // Velocidad del enemigo
        this.stunTime = 0; // Tiempo de aturdimiento del enemigo por defecto
        this.state = "idle"; // Estado del enemigo por defecto
        this.max_speed = speed; // Velocidad máxima del enemigo por defecto
        this.destroyed = false; // Estado de destrucción del enemigo por defecto
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
        this.hp -= damage; // Se le resta el daño a la vida del enemigo
        if (this.hp <= 0) { // Si la vida del enemigo es menor o igual a 0, se destruye el enemigo
            this.destroyed = true; // Atributo que inidca si el enemigo ha sido destruido
        }
    }
}
