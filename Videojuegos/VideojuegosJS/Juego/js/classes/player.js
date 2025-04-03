/*

    Equipo BitGuardians
    Clase del objeto Jugador 

*/

"use strict";

let playerspeed = 0.005; // Atributo de velocidad del jugador

class Player extends AnimatedObject {
    constructor(color, width, height, x, y, type, hp, weapon, max_hp, shield, max_shield) {
        super("green", width*2, height*2.4, x, y, "player");
        this.velocity = new Vec(0.0, 0.0);
        this.max_hp = 100; // Atributo de vida máxima del jugador, la cual podrá ser incrementada con powerups.
        this.hp = this.max_hp; // Atributo de vida del jugador
        this.shield = 0; // Atributo de escudo del jugador
        this.max_shield = this.max_hp*0.1; // Atributo de escudo máximo del jugador, el cual podrá ser incrementado con powerups, el escudo será del 10% de la vida del jugador
        this.hitBox = new HitBox(this.position.x, this.position.y, this.size.x*0.7, this.size.y*0.9); // Hitbox del jugador
        this.state = "idle"; 
        this.totalHP = this.hp + this.shield; // Atributo de vida total del jugador, el cual será la suma de la vida y el escudo del jugador
        this.hasEMP = false; // Atributo de si el jugador tiene un EMP o no
        // Variables de la entrada de y salida al entrar a una puerta.
        this.exitPosition = undefined;
        this.enterPosition = undefined;
        this.shootCooldown = 0; // Tiempo de recarga del disparo

        this.currentAttackHitbox = null; // Hitbox del ataque del jugador definida nulla para que no inicie el ataque al principio
        this.attackHitboxTimer = 0; // Timer de la hitbox de ataque del jugador
        this.attackTimer = 0;

        this.weapon = {
            damage: 20
        };

        // Movimientos del jugador
        this.movement = {
            down: {
                status: false,
                axis: "y",
                sign: 1,
                repeat: true,
                duration: 100,
                moveFrames: [10, 16],
                idleFrames: [10, 10]
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
                duration: 50,
                moveFrames: [40, 46], 
                idleFrames: [40, 40]
            },
            downattack: {
                status: false,
                repeat: false,
                duration: 50,
                moveFrames: [61, 63],
                idleFrames: [60, 60]
            },
            leftattack: {
                status: false,
                repeat: false,
                duration: 50,
                moveFrames: [71, 74],
                idleFrames: [70, 70]
            },
            rightattack: {
                status: false,
                repeat: false,
                duration: 50,
                moveFrames: [81, 84],
                idleFrames: [80, 80]
            },
            upattack: {
                status: false,
                repeat: false,
                duration: 50,
                moveFrames: [91, 94],
                idleFrames: [90, 90]
            }
        };
    }


    update(level, deltaTime) {
        // Determinar donde termina el jugador después de que se mueve
        let newPosition = this.position.plus(this.velocity.times(deltaTime));

        // Moverse si el jugador no toca una pared
        if (!level.contact(newPosition, this.size, 'wall')) {
            this.position = newPosition;
        }

        this.hitBox.position.x = this.position.x+0.3; // Actualizar la posición del hitbox del jugador en x
        this.hitBox.position.y = this.position.y+0.1; // Actualizar la posición del hitbox del jugador en y
        this.hitBox.update(); // Actualizar el hitbox del jugador

        if (this.hp > this.max_hp){ // Si la vida del jugador supera la vida máxima, se le asigna la vida máxima.
            this.hp = this.max_hp;
        }
        if (this.shield > this.max_shield){ // Si el escudo del jugador supera el escudo máximo, se le asigna el escudo máximo.
            this.shield = this.max_shield;
        }
        this.totalHP = this.hp + this.shield; // Actualizar la vida total del jugador

        this.updateFrame(deltaTime);
        
        
        // Actualiza el timer de la hitbox de ataque si está activa
        if (this.attackHitboxTimer > 0) {
            this.attackHitboxTimer -= deltaTime;
            if (this.attackHitboxTimer <= 0) {
                this.currentAttackHitbox = null; // Se borra la hitbox de ataque al terminar el tiempo
            }
        }

        if (this.currentAttackHitbox) {
            this.currentAttackHitbox.drawHitBox(ctx, scale);
        }
    }

    startMovement(direction) {
        const dirData = this.movement[direction];
        if (!dirData.status) {
            dirData.status = true;
            this.velocity[dirData.axis] = dirData.sign * playerspeed;
            this.setAnimation(...dirData.moveFrames, dirData.repeat, dirData.duration);
        }
    }

    stopMovement(direction) {
        const dirData = this.movement[direction];
        dirData.status = false;
        this.velocity[dirData.axis] = 0;
        this.setAnimation(...dirData.idleFrames, dirData.repeat, dirData.duration);
    }

    // Métodos de ataque hechos para cada arma

    // Método para realizar el ataque de la espada, creando una hitbox temporal para cuando ataque el jugador
    swordAttack(direction) {
        let attackWidth, attackHeight, attackX, attackY; // Variables para la hitbox del ataque
        // Según la dirección, posiciona la hitbox en frente del jugador
        switch (direction) {
        case "up":
            attackWidth = this.size.x * 1;
            attackHeight = this.size.y * 0.4;
            attackX = this.position.x; 
            attackY = this.position.y - attackHeight;
            break;
        case "down":
            attackWidth = this.size.x * 1;
            attackHeight = this.size.y * 0.4;
            attackX = this.position.x; 
            attackY = this.position.y + this.size.y;
            break;
        case "left":
            attackWidth = this.size.x * 0.4;
            attackHeight = this.size.y * 1;
            attackY = this.position.y;
            attackX = this.position.x - attackWidth;
            break;
        case "right":
            attackWidth = this.size.x * 0.4;
            attackHeight = this.size.y * 1;
            attackY = this.position.y;
            attackX = this.position.x + this.size.x;
            break;
        }
        
        // Crea la hitbox del ataque
        this.currentAttackHitbox = new HitBox(attackX, attackY, attackWidth, attackHeight);

        this.attackHitboxTimer = 300; // Duración de la hitbox de ataque
        
        for (let enemy of game.enemies) {
            if (overlapRectangles(this.currentAttackHitbox, enemy)) {
                enemy.takeDamage(this.weapon.damage);
            }
        }

        this.attackTimer = 1000;
    }

    // Método para iniciar el ataque del jugador con la pistola
    shoot(deltaTime, direction) {
        let bdirection; // Variable para la dirección de la bala
        switch (direction) {
            case "up":
                bdirection = new Vec(0, -1); // Dirección hacia arriba
                break;
            case "down":
                bdirection = new Vec(0, 1); // Dirección hacia abajo
                break;
            case "left":
                bdirection = new Vec(-1, 0); // Dirección hacia la izquierda
                break;
            case "right":
                bdirection = new Vec(1, 0); // Dirección hacia la derecha
                break;
        }
        this.shootCooldown = 1800; // Reiniciar el tiempo de recarga del disparo
        let bullet = new Bullet(this.position.x, this.position.y, 1, 0.5, "blue", bdirection.x, bdirection.y, this.damage); // Crear la bala
        game.playerBullets.push(bullet); // Añadir la bala al array de balas del enemigo
    }

    startAttack(direction) {
        const dirData = this.movement[direction + "attack"];
        if (!dirData || dirData.status) return;
        dirData.status = true;        
        this.setAnimation(...dirData.moveFrames, dirData.repeat, dirData.duration);
        this.swordAttack(direction); // Llama a la función de ataque
        //this.shoot(this.deltaTime, direction); // Llama a la función de disparo
    }

    stopAttack(direction) {
        const dirData = this.movement[direction + "attack"];
        if (!dirData || !dirData.status) return;
        dirData.status = false;
        const idleData = this.movement[direction];
        this.setAnimation(...idleData.idleFrames, true, idleData.duration);

    }

    // Método para que el jugador reciba daño
    takeDamage(damage){
        if (this.shield > 0) // Si el jugador tiene escudo, este recibe el daño.
            {
                this.shield -= damage;
                if (this.shield < 0) // Si el daño supera la cantidad de escudo, el daño restante se le aplica a la vida del jugador.
                {
                    this.hp += this.shield;
                    this.shield = 0;
                }
            }
        else // Si el jugador no tiene escudo, el daño se le aplica directamente a la vida.
        {
            this.hp -= damage;
        }
    }

    // Método para que el jugador pueda hacer daño (temporal aquí hasta definir la clase donde corresponde)
    doDamage(enemy){
        enemy.takeDamage(this.weapon.damage);
    }

    stunEnemy(enemy){
        if (this.hasEMP == true)
        enemy.stunTime = stunDuration; // Aturdir al enemigo por 2 segundos
        enemy.state = "stunned"; // Cambiar el estado del enemigo a aturdido
    }
}

