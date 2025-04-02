class Dron extends Enemy {
    constructor(color, width, height, x, y, type) {
        super("blue", width * 2, height * 2, x, y, "dron", 50, 5, 3, 0.004, 1500);
        this.hitBox = new HitBox(this.position.x, this.position.y, this.size.x*0.6, this.size.y*0.8); // Hitbox del enemigo robot
        // Movimientos del enemigo
        this.movement = {
            right: {
                status: false,
                axis: "x",
                sign: 1,
                repeat: true,
                duration: 100,
                moveFrames: [20, 25],
                idleFrames: [20, 20]
            },
            left: {
                status: false,
                axis: "x",
                sign: -1,
                repeat: true,
                duration: 100,
                moveFrames: [30, 35],
                idleFrames: [30, 30]
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



        if (this.state === "attack") {
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

        this.hitBox.position.x = this.position.x + 0.4; // Actualizar la posición del hitbox del enemigo
        this.hitBox.position.y = this.position.y + 0.2; // Actualizar la posición del hitbox del enemigo
        this.hitBox.update(); // Actualizar el hitbox del enemigo
        this.updateFrame(deltaTime);
    }
}
