class Robot extends Enemy {
    constructor(color, width, height, x, y, type) {
        super("red", width*2, height*2, x, y, "robot", 100, 10, 1.5, 0.002, 2000);
        // Movimientos del enemigo
        this.movement = {
            right: {
                status: false,
                axis: "x",
                sign: 1,
                repeat: true,
                duration: 100,
                moveFrames: [20, 26],
                idleFrames: [20, 20]
            },
            left: {
                status: false,
                axis: "x",
                sign: -1,
                repeat: true,
                duration: 100,
                moveFrames: [30, 36],
                idleFrames: [30, 30]
            },
            up: {
                status: false,
                axis: "y",
                sign: -1,
                repeat: true,
                duration: 100,
                moveFrames: [40, 45],
                idleFrames: [40, 40]
            },
            down: {
                status: false,
                axis: "y",
                sign: 1,
                repeat: true,
                duration: 100,
                moveFrames: [40, 45],
                idleFrames: [40, 40]
            }
        };
    }

    update(level, deltaTime) {
        const distance = this.position.distanceTo(game.player.position);
        //Verificar el estado del enemigo
        if (distance > 10) {
            this.state = "idle";
        }
        else if (overlapRectangles(this.hitBox, game.player.hitBox)) {
            this.state = "attack";
        }
        else if (this.state == "stunned") {
            // Aturdimiento del enemigo (Faltante)
        }
        else {
            this.state = "chase";
        }

        if (this.state === "chase") {
            let dir = game.player.position.minus(this.position).unit_V(); // Normalizar la dirección hacia el jugador
            // Calcular la velocidad del enemigo
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



        if (this.state === "attack") {
            this.velocity = new Vec(0, 0);
            console.log(game.player.hp)
            // Atacar al jugador
            this.attackTimmer += deltaTime; // Aumentar el temporizador de ataque
            if (this.attackTimmer >= this.nextAttack) {
                game.player.takeDamage(this.damage); // Restar el daño al jugador
                this.attackTimmer = 0; // Reiniciar el temporizador de ataque
            }
        }

        if (this.state == "idle") {
            this.velocity = new Vec(0.0, 0.0);
        }

        this.hitBox.position = this.position; // Actualizar la posición del hitbox del enemigo
        this.hitBox.update(); // Actualizar el hitbox del enemigo
        this.updateFrame(deltaTime);
    }
}