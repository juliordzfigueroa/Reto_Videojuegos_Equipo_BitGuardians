class Robot extends Enemy {
    constructor(color, width, height, x, y, type) {
        super(color, width*2, height*2, x, y, type, 100, 10, 0.002, 1500);
        this.attackTimmer; // Tiempo de ataque del enemigo por defecto
        this.nextAttack = 1500; // Siguiente ataque del enemigo por defecto
        this.hitBox = new HitBox(this.position.x, this.position.y, this.size.x*0.6, this.size.y*0.8); // Hitbox del enemigo robot
        // Movimientos del enemigo
        this.movement = {
            right: {
                status: false,
                axis: "x",
                sign: 1,
                repeat: true,
                duration: 100,
                moveFrames: [20, 26],
                idleFrames: [0, 9]
            },
            left: {
                status: false,
                axis: "x",
                sign: -1,
                repeat: true,
                duration: 100,
                moveFrames: [30, 36],
                idleFrames: [0, 9]
            },
            up: {
                status: false,
                axis: "y",
                sign: -1,
                repeat: true,
                duration: 100,
                moveFrames: [40, 45],
                idleFrames: [0, 9]
            },
            down: {
                status: false,
                axis: "y",
                sign: 1,
                repeat: true,
                duration: 100,
                moveFrames: [40, 45],
                idleFrames: [0, 9]
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
            this.nextAttack = 0; // Reiniciar el temporizador de ataque al perseguir
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
            this.velocity = new Vec(0, 0); // Detener el movimiento al atacar
            if (this.attackTimmer >= this.nextAttack) { // Si el temporizador de ataque ha llegado al tiempo de ataque
                game.player.takeDamage(this.damage); // Aplica daño al jugador
                this.attackTimmer = 0; // Reinicia el contador tras el ataque
                this.nextAttack = 1500; // Reinicia el temporizador de ataque
            }
            this.attackTimmer += deltaTime;
        }

        if (this.state === "stunned") {
            // Se mantiene aturdido
            this.velocity = new Vec(0, 0);
            this.stunTime -= deltaTime;
            if (this.stunTime <= 0) {
                this.state = "idle";
            }
            if (this.currentDirection) {
                this.stopMovement(this.currentDirection);

            }
        }
    

        if (this.state == "idle") {
            this.velocity = new Vec(0.0, 0.0);
            if (this.currentDirection) {
                this.stopMovement(this.currentDirection);
            }
        }

        if (this.speed > this.max_speed) { // Si la velocidad del enemigo supera la velocidad máxima, se iguala a esta.
            this.speed = this.max_speed;
        }

        this.hitBox.position.x = this.position.x + 0.4; // Actualizar la posición del hitbox del enemigo
        this.hitBox.position.y = this.position.y + 0.2; // Actualizar la posición del hitbox del enemigo
        this.hitBox.update(); // Actualizar el hitbox del enemigo
        this.updateFrame(deltaTime);
    }
}