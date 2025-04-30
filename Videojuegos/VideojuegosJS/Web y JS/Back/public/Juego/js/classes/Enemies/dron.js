/*

    Equipo BitGuardians
    Clase del objeto enemigo que dispara
    Físicas de disparo recuperadas de: https://www.youtube.com/watch?v=JORxRP9hR3s&ab_channel=codigofacilito
*/

class Dron extends Enemy {
    constructor(color, width, height, x, y, type) {
        super("blue", width * 2, height * 2, x, y, "dron", 50, 5, 0.09, 1500);
        this.hitBox = new HitBox(this.position.x, this.position.y, this.size.x*0.6, this.size.y*0.6); // Hitbox del enemigo robot
        this.direction = 1; // Dirección del enemigo, 1 = abajo. derecha; -1 = arriba, izquierda
        this.state = "movementpattern"; // Estado del enemigo, puede ser "movementpattern" o "shooting"
        this.shootCooldown = 1300; // Tiempo de recarga del disparo del enemigo
        this.xOrY = Math.random()
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
        //Verificar el estado del enemigo
        if (this.state == "stunned") {
             // El enemigo se queda quieto mientras está aturdido
             this.velocity = new Vec(0, 0);
             this.stunTime -= deltaTime;
             if (this.stunTime <= 0) {
                 this.state = "movementpattern"; // Cambia el estado a "movementpattern" cuando se acaba el tiempo de aturdimiento
                 this.stunTime = this.stunDuration; // Reinicia el tiempo de aturdimiento
             }
        }
        else {
            this.state = "movementpattern";
        }

        if (this.state === "movementpattern") {
            let dir = game.player.position.minus(this.position).unit_V(); // Normalizar la dirección hacia el jugador
            if (this.xOrY < 0.5) {
                for (let actor of level.actors) {
                    if (actor.type === "wall" && overlapRectangles(this.hitBox, actor) || actor.type === "door" && overlapRectangles(this.hitBox, actor)) {
                        // Al detectar colisión, se invierte la dirección
                        this.direction *= -1;
                        break; // Rompe el bucle tras encontrar un muro o una puerta
                    }
                }
                this.position.x += this.speed * this.direction;
            } 
            else {
                for (let actor of level.actors) {
                    if (actor.type === "wall" && overlapRectangles(this.hitBox, actor) || actor.type === "door" && overlapRectangles(this.hitBox, actor)) {
                        // Al detectar colisión, se invierte la dirección
                        this.direction *= -1;
                        break; // Rompe el bucle tras encontrar un muro o una puerta
                    }
                }
                this.position.y += this.speed * this.direction;

            }

            if (dir.x >= 0) { // Para las animaciones de movimiento del enemigo
                this.startMovement("right");
            } else {
                this.startMovement("left");
            }
            this.shoot(deltaTime);
        }

        if (overlapRectangles(this.hitBox, game.player.hitBox)){
            if (this.attackTimmer >= this.nextAttack) { // Si el temporizador de ataque ha llegado al tiempo de ataque
                game.player.takeDamage(this.damage); // Aplica daño al jugador
                this.attackTimmer = 0; // Reinicia el contador tras el ataque
                this.nextAttack = 1500; // Reinicia el temporizador de ataque
            }
            this.attackTimmer += deltaTime;
        }

        if (this.speed > this.baseSpeed) { // Si la velocidad del enemigo supera la velocidad máxima, se iguala a esta.
            this.speed = this.base;
        }
        
        this.hitBox.position.x = this.position.x + 0.47; // Actualizar la posición del hitbox del enemigo
        this.hitBox.position.y = this.position.y + 0.4; // Actualizar la posición del hitbox del enemigo
        this.hitBox.update(); // Actualizar el hitbox del enemigo
        
        this.updateFrame(deltaTime);
    }

    shoot(deltaTime) {
        let dir = game.player.position.minus(this.position).unit_V(); // Normalizar la dirección hacia el jugador
        if (this.shootCooldown > 0){
            this.shootCooldown -= deltaTime; // Disminuir el tiempo de recarga del disparo
        }
        if (this.shootCooldown <= 0){
            this.shootCooldown = 1800; // Reiniciar el tiempo de recarga del disparo
            let bullet = new Bullet(this.position.x, this.position.y, 0.8, 0.5, "red", dir.x, dir.y, this.damage); // Crear la bala
            game.enemyBullets.push(bullet); // Añadir la bala al array de balas del enemigo
            this.shootCooldown = 1300; // Reiniciar el tiempo de recarga del disparo
        }
    }
}
