/*

    Equipo BitGuardians
    Clase del objeto Enemigo 

*/

let stunDuration = 2000; // Atributo de duración del aturdimiento del enemigo 2 segundos

class Enemy extends AnimatedObject {
    constructor(color, width, height, x, y, type, hp, damage, range, speed, stunTime) {
        super("green", width * 2, height * 3, x, y, "enemy");
        this.velocity = new Vec(0.0, 0.0);
        this.attackTimmer = 0; // Tiempo de ataque del enemigo</p>
        this.nextAttack = 0; // Siguiente ataque del enemigo
        this.state = "idle"; // Estado del enemigo
        this.stunTime = 0; // Tiempo de aturdimiento del enemigo por defecto

        // Movimientos del enemigo
        this.movement = {
            right: {
                status: false,
                axis: "x",
                sign: 1,
                repeat: true,
                duration: 100,
                moveFrames: [30, 36],
                idleFrames: [30, 30]
            },
            left: {
                status: false,
                axis: "x",
                sign: -1,
                repeat: true,
                duration: 100,
                moveFrames: [40, 46],
                idleFrames: [40, 40]
            },
            up: {
                status: false,
                axis: "y",
                sign: -1,
                repeat: true,
                duration: 100,
                moveFrames: [20, 26],
                idleFrames: [20, 20]
            },
            down: {
                status: false,
                axis: "y",
                sign: 1,
                repeat: true,
                duration: 100,
                moveFrames: [10, 16],
                idleFrames: [10, 10]
            },
            leftattack: {
                status: false,
                repeat: false,
                duration: 100,
                moveFrames: [50, 56],
                idleFrames: [50, 50]
            },
            rightattack: {
                status: false,
                repeat: false,
                duration: 100,
                moveFrames: [40, 46],
                idleFrames: [40, 40]
            },
            upattack: {
                status: false,
                repeat: false,
                duration: 100,
                moveFrames: [60, 65],
                idleFrames: [60, 60]
            },
            downattack: {
                status: false,
                repeat: false,
                duration: 100,
                moveFrames: [60, 65],
                idleFrames: [60, 60]
            }
        };

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

        let newPosition = this.position.plus(this.velocity.times(deltaTime));

        if (this.state == "chase") {
            // Moverse hacia el jugador
            let direction = game.player.position.minus(this.position).unit_V();
            this.velocity = direction.times(this.speed * deltaTime);

            // Moverse si el enemigo no toca una pared
            if (!level.contact(newPosition, this.size, 'wall')) {
                this.position = newPosition;
            }
        }

        if (this.state == "attack") {
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
        if (!dirData.status) {
            dirData.status = true;
            this.velocity[dirData.axis] = dirData.sign * playerSpeed;
            this.setAnimation(...dirData.moveFrames, dirData.repeat, dirData.duration);
        }
    }

    stopMovement(direction) {
        const dirData = this.movement[direction];
        dirData.status = false;
        this.velocity[dirData.axis] = 0;
        this.setAnimation(...dirData.idleFrames, dirData.repeat, dirData.duration);
    }

    // Para ataque
    startAttack(direction) {
        const dirData = this.movement[direction + "attack"];
        if (!dirData || dirData.status) return;
        dirData.status = true;
        this.setAnimation(...dirData.moveFrames, dirData.repeat, dirData.duration);
    }

    stopAttack(direction) {
        const dirData = this.movement[direction + "attack"];
        if (!dirData || !dirData.status) return;
        dirData.status = false;
        const idleData = this.movement[direction];
        this.setAnimation(...idleData.idleFrames, true, idleData.duration);
    }

    takeDamage(damage) { // pendiente por revisar
        this.hp -= damage;
        if (this.hp <= 0) {
            this.hp = 0;
            this.die();
        }
    }

    die() { // Pendiente por revisar
        // Eliminar el enemigo
        game.enemies.splice(game.enemies.indexOf(this), 1);
    }
}