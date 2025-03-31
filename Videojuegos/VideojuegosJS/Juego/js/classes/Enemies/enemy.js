/*

    Equipo BitGuardians
    Clase del objeto Enemigo 

*/

let stunDuration = 2000; // Atributo de duración del aturdimiento del enemigo 2 segundos

class Enemy extends AnimatedObject {
    constructor(color, width, height, x, y, type, hp, damage, range, speed, stunTime) {
        super("green", width, height, x, y, type);
        this.position = new Vec(x, y); // Initialize position
        this.velocity = new Vec(0.0, 0.0);
        this.hp = hp; // Atributo de vida del enemigo
        this.attackTimmer = 0; // Tiempo de ataque del enemigo</p>
        this.nextAttack = 0; // Siguiente ataque del enemigo
        this.state = "idle"; // Estado del enemigo
        this.speed = speed; // Velocidad del enemigo
        this.stunTime = 0; // Tiempo de aturdimiento del enemigo por defecto
        this.state = "idle"; // Estado del enemigo por defecto
        this.attackTimmer = 0; // Tiempo de ataque del enemigo por defecto
        this.nextAttack = 2000; // Siguiente ataque del enemigo por defecto
    }

    update(level, deltaTime) {
        const distance = this.position.distanceTo(game.player.position);
        //Verificar el estado del enemigo
        if (distance > 10) {
            this.state = "idle";
        }
        else if (distance < 1) {
            this.state = "attack";
        }
        else if (this.state == "stunned") {
            // Aturdimiento del enemigo (Faltante)
        }
        else {
            this.state = "chase";
        }

        if (this.state === "chase") {
            let dir = game.player.position.minus(this.position).unit_V();
            this.velocity = dir.times(this.speed);

            // Calcular la nueva posición
            let newPosition = this.position.plus(this.velocity.times(deltaTime));

            // Detectar dirección principal y activar animación correspondiente
            if (Math.abs(dir.x) > Math.abs(dir.y)) {
                // Movimiento horizontal
                if (dir.x > 0) {
                    this.startMovement("right");
                } else {
                    this.startMovement("left");
                }
            } else {
                // Movimiento vertical
                if (dir.y > 0) {
                    this.startMovement("down");
                } else {
                    this.startMovement("up");
                }
            }

            // Aplicar movimiento si no hay pared
            if (!level.contact(newPosition, this.size, 'wall')) {
                this.position = newPosition;
            }
        }



        if (this.state == "attack") {
            this.velocity = new Vec(0, 0);
            // Atacar al jugador
            if (this.attackTimmer < this.nextAttack) {
                this.attackTimmer = 0;
                game.player.takeDamage(this.damage);
            }
            else {
                this.attackTimmer += deltaTime;
            }
        }

        if (this.state == "idle") {
            this.velocity = new Vec(0.0, 0.0);
        }

        this.updateFrame(deltaTime);
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
}
