/*

    Equipo BitGuardians
    Clase del objeto Jugador 

*/

"use strict";

let playerspeed = 0.005; // Atributo de velocidad del jugador

class Player extends AnimatedObject {
    constructor(color, width, height, x, y, type, hp, weapon, max_hp, shield, max_shield) {
        super("green", width * 2, height * 2.4, x, y, "player");
        this.velocity = new Vec(0.0, 0.0);
        this.max_hp = 100; // Atributo de vida máxima del jugador, la cual podrá ser incrementada con powerups.
        this.hp = this.max_hp; // Atributo de vida del jugador
        this.shield = 0; // Atributo de escudo del jugador
        this.max_shield = this.max_hp * 0.1; // Atributo de escudo máximo del jugador, el cual podrá ser incrementado con powerups, el escudo será del 10% de la vida del jugador
        this.hitBox = new HitBox(this.position.x, this.position.y, this.size.x * 0.7, this.size.y * 0.9); // Hitbox del jugador
        this.footHB = new HitBox(this.position.x, this.position.y, this.size.x * 0.4, this.size.y * 0.2); // Hitbox de los pies del jugador
        this.totalHP = this.hp + this.shield; // Atributo de vida total del jugador, el cual será la suma de la vida y el escudo del jugador
        this.hasEMP = false; // Atributo de si el jugador tiene un EMP o no
        this.emp = null; // Atributo del powerup EMP del jugador, el será solo usado para imagen del hub
        this.isDefeated = false; // Atributo de si el jugador fue derrotado o no
        this.currentDirection = "down"; // Atributo de la dirección actual del jugador, usado para ajustar la hitbox
        // Variables de la entrada de y salida al entrar a una puerta.
        this.exitPosition = undefined;
        this.enterPosition = undefined;
        this.shootCooldown = 0; // Tiempo de recarga del disparo

        this.currentAttackHitbox = null; // Hitbox del ataque del jugador definida nulla para que no inicie el ataque al principio
        this.attackHitboxTimer = 0; // Timer de la hitbox de ataque del jugador
        this.attackCooldownTimer = 0;

        this.cableDamageTimer = 0; // Timer del daño del cable
        this.touchedCable = false;

        this.weapon = getRandomInitWeapon(); // Arma inicial del jugador, aleatoria al inicio

        this.sfx = { // Sonidos del jugador
            damage: new Audio("../assets/sfx/Sound_Effects/cipher_impact.mp3"),
            shoot: new Audio("../assets/sfx/Sound_Effects/laser_gun.mp3"),
            defeated: new Audio("../assets/sfx/Sound_Effects/Player_defeated.wav"),
            powerup: new Audio("../assets/sfx/Sound_Effects/power_up_grab.wav"),
            blade: new Audio("../assets/sfx/Sound_Effects/Blade.mp3"),
            taser: new Audio("../assets/sfx/Sound_Effects/taser_gun.mp3"),
        };

        switch (this.weapon.wtype) { // Duración del cooldown de ataque del jugador depende del arma
            case "sword":
                this.attackCooldownDuration = 450; 
                break
            case "taser":
                this.attackCooldownDuration = 400; 
                break
            case "gun":
                this.attackCooldownDuration = 150; 
                break
        }

        this.currentWeaponSFX = null; // Variable para guardar el sonido del arma actual

        // Variable para guardar en las estadisticas
        this.danoTotalRecibido = 0; // Atributo de daño total recibido por el jugador\
        this.powerUpsUtilizados = 0;
        this.enemigosDerrotados = 0; // Atributo de enemigos derrotados por el jugador
        this.salasCompletadas = 0; // Atributo de salas completadas por el jugador
        this.puzzlesResueltos = 0; // Atributo de puzzles resueltos por el jugador
        this.jefesDerrotados = 0; // Atributo de jefes derrotados por el jugador
        this.partidasJugadas = 0; // Atributo de partidas jugadas por el jugador
        this.partidasGanadas = 0; // Atributo de partidas ganadas por el jugador

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
            }
        };
    }


    update(level, deltaTime) {
        // Determinar donde termina el jugador después de que se mueve
        if (this.isDefeated) { // Si el jugador fue derrotado, no se mueve
            if (this.currentWeaponSFX) this.currentWeaponSFX.pause(); // Detener el sonido del ataque
            this.velocity = new Vec(0, 0);
            this.updateFrame(deltaTime);
            return;
        }

        let newPosition = this.position.plus(this.velocity.times(deltaTime));

        // Moverse si el jugador no toca una pared
        if (!level.contact(newPosition, this.size, 'wall')) {
            this.position = newPosition;
        }

        this.hitBox.update(); // Actualizar el hitbox del jugador

        this.footHB.position.x = this.position.x + 0.6; // Actualizar la posición del hitbox de los pies del jugador en x
        this.footHB.position.y = this.position.y + 1.7; // Actualizar la posición del hitbox de los pies del jugador en y
        this.footHB.update(); // Actualizar el hitbox de los pies del jugador

        if (this.hp > this.max_hp) { // Si la vida del jugador supera la vida máxima, se le asigna la vida máxima.
            this.hp = this.max_hp;
        }
        if (this.shield > this.max_shield) { // Si el escudo del jugador supera el escudo máximo, se le asigna el escudo máximo.
            this.shield = this.max_shield;
        }
        this.totalHP = this.hp + this.shield; // Actualizar la vida total del jugador

        if (this.attackCooldownTimer > 0) {
            this.attackCooldownTimer -= deltaTime;
            if (this.attackCooldownTimer < 0) this.attackCooldownTimer = 0;
        }

        if (this.attackHitboxTimer > 0) {
            this.attackHitboxTimer -= deltaTime;
            if (this.attackHitboxTimer <= 0) {
                this.stopAttack(this.currentDirection); // Detener el ataque del jugador
                this.currentAttackHitbox = null;
            }
        }

        if (this.currentAttackHitbox && debugHitBoxes) {
            this.currentAttackHitbox.drawHitBox(ctx, scale);
        }

        switch (this.currentDirection){
            case "up":
                this.hitBox.size.y = this.size.y * 0.9; // Cambia el tamaño del hitbox del jugador al moverse hacia arriba
                this.hitBox.size.x = this.size.x * 0.7; // Cambia el tamaño del hitbox del jugador al moverse hacia arriba
                this.hitBox.position.x = this.position.x + 0.3; // Actualizar la posición del hitbox del jugador en x
                this.hitBox.position.y = this.position.y + 0.1; // Actualizar la posición del hitbox del jugador en y
                break;
            case "down":
                this.hitBox.size.y = this.size.y * 0.9; // Cambia el tamaño del hitbox del jugador al moverse hacia arriba
                this.hitBox.size.x = this.size.x * 0.7; // Cambia el tamaño del hitbox del jugador al moverse hacia arriba
                this.hitBox.position.x = this.position.x + 0.3; // Actualizar la posición del hitbox del jugador en x
                this.hitBox.position.y = this.position.y + 0.1; // Actualizar la posición del hitbox del jugador en y
                break;
            case "left":
                this.hitBox.size.y = this.size.y * 0.9; // Cambia el tamaño del hitbox del jugador al moverse hacia arriba
                this.hitBox.size.x = this.size.x * 0.4; // Cambia el tamaño del hitbox del jugador al moverse hacia arriba
                this.hitBox.position.x = this.position.x + 0.6; // Cambia la posición del hitbox del jugador al moverse hacia arriba 
                this.hitBox.position.y = this.position.y + 0.1; // Actualizar la posición del hitbox del jugador en y
                break;
            case "right":
                this.hitBox.size.y = this.size.y * 0.9; // Cambia el tamaño del hitbox del jugador al moverse hacia arriba
                this.hitBox.size.x = this.size.x * 0.4; // Cambia el tamaño del hitbox del jugador al moverse hacia arriba
                this.hitBox.position.x = this.position.x + 0.5; // Cambia la posición del hitbox del jugador al moverse hacia arriba 
                this.hitBox.position.y = this.position.y + 0.1; // Actualizar la posición del hitbox del jugador en y
                break;
        }

        this.hitBox.update(); // Actualizar el hitbox del jugador
        this.updateFrame(deltaTime);
        

        this.cableDamageTimer += deltaTime; // Aumentar el timer del daño del cable
    }

    startMovement(direction) {
        if (this.isDefeated) return; // Si el jugador fue derrotado, no puede moverse
        const dirData = this.movement[direction];
        if (!dirData.status) {
            dirData.status = true;
            this.velocity[dirData.axis] = dirData.sign * playerspeed;
            this.setAnimation(...dirData.moveFrames, dirData.repeat, dirData.duration);
            switch (direction) {
                case "up":
                    this.currentDirection = "up"; // Cambia la dirección actual del jugador a arriba
                    break;
                case "down":
                    this.currentDirection = "down"; // Cambia la dirección actual del jugador a abajo
                    break;
                case "left":
                    this.currentDirection = "left"; // Cambia la dirección actual del jugador a izquierda
                    break;
                case "right":
                    this.currentDirection = "right"; // Cambia la dirección actual del jugador a derecha
                    break;
            }
        }
    }

    stopMovement(direction) {
        if (this.isDefeated) return; // Si el jugador fue derrotado, no puede moverse
        const dirData = this.movement[direction];
        dirData.status = false;
        this.velocity[dirData.axis] = 0;
        this.setAnimation(...dirData.idleFrames, dirData.repeat, dirData.duration);
    }

    // Métodos de ataque hechos para cada tipo de arma, en este caso espada/taser y pistola.

    // Método para realizar el ataque de la espada
    meleeAttack(direction) {
        let attackWidth, attackHeight, attackX, attackY; // Variables para la hitbox del ataque
        // Según la dirección, posiciona la hitbox en frente del jugador
        switch (direction) {
            case "up":
                if (this.weapon.wtype === "taser") {
                    attackWidth = this.size.x * 0.6;
                    attackHeight = this.size.y * 0.5;
                    attackX = this.position.x + this.size.x * 0.19;
                    attackY = this.position.y - attackHeight;
                }
                else if (this.weapon.wtype === "sword") {
                    attackWidth = this.size.x * 1;
                    attackHeight = this.size.y * 0.4;
                    attackX = this.position.x;
                    attackY = this.position.y - attackHeight;
                }
                this.currentDirection = "up"; // Cambia la dirección actual del jugador a arriba
                break;
            case "down":
                if (this.weapon.wtype === "taser") {
                    attackWidth = this.size.x * 0.6;
                    attackHeight = this.size.y * 0.5;
                    attackX = this.position.x + this.size.x * 0.19;
                    attackY = this.position.y + this.size.y;
                }
                else if (this.weapon.wtype === "sword") {
                    attackWidth = this.size.x * 1;
                    attackHeight = this.size.y * 0.4;
                    attackX = this.position.x;
                    attackY = this.position.y + this.size.y;
                }
                this.currentDirection = "down"; // Cambia la dirección actual del jugador a abajo
                break;
            case "left":
                if (this.weapon.wtype === "taser") {
                    attackWidth = this.size.x * 0.5;
                    attackHeight = this.size.y * 0.6;
                    attackY = this.position.y + this.size.y * 0.2;
                    attackX = this.position.x - attackWidth;
                }
                else if (this.weapon.wtype === "sword") {
                    attackWidth = this.size.x * 0.4;
                    attackHeight = this.size.y * 1;
                    attackY = this.position.y;
                    attackX = this.position.x - attackWidth;
                }
                this.currentDirection = "left"; // Cambia la dirección actual del jugador a izquierda
                break;
            case "right":
                if (this.weapon.wtype === "taser") {
                    attackWidth = this.size.x * 0.5;
                    attackHeight = this.size.y * 0.6;
                    attackY = this.position.y + this.size.y * 0.2;
                    attackX = this.position.x + this.size.x;
                }
                else if (this.weapon.wtype === "sword") {
                    attackWidth = this.size.x * 0.4;
                    attackHeight = this.size.y * 1;
                    attackY = this.position.y;
                    attackX = this.position.x + this.size.x;
                }
                this.currentDirection = "right"; // Cambia la dirección actual del jugador a derecha
                break;
        }

        
        if (this.weapon.wtype === "sword") {
            this.currentWeaponSFX = this.sfx.blade; // Se asigna el sonido de la espada a la variable de sonido del arma actual
            this.currentWeaponSFX.currentTime = 0; // reinicia si ya estaba sonando
            this.currentWeaponSFX.play(); // Sonido de ataque con espada
        }
        else if (this.weapon.wtype === "taser") {
            this.currentWeaponSFX = this.sfx.taser; // Se asigna el sonido de la taser a la variable de sonido del arma actual
            this.currentWeaponSFX.currentTime = 0; // reinicia si ya estaba sonando
            this.currentWeaponSFX.play(); // Sonido de ataque con taser
        }

        // Se define la hitbox temporal del ataque del jugador
        this.currentAttackHitbox = new HitBox(attackX, attackY, attackWidth, attackHeight);

        this.attackTimer = 0;
        this.attackHitboxTimer = 300; // Duración de la hitbox de ataque

        for (let enemy of game.enemies) {
            if (overlapRectangles(this.currentAttackHitbox, enemy)) {
                enemy.takeDamage(this.weapon.damage);
                if (this.weapon.wtype === "taser") {
                    let stunchance = Math.random(); 
                    if (stunchance < 0.5) { // Si el número es menor a 0.5, se aturde al enemigo
                        enemy.stunTime = 1000;
                        enemy.state = "stunned"; // Cambia el estado del enemigo a aturdido
                    }
                }
            }
        }
    }


    // Método para iniciar el ataque del jugador con la pistola
    shoot(direction) {
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
        this.sfx.shoot; // Se asigna el sonido de la pistola a la variable de sonido del arma actual
        this.sfx.shoot.currentTime = 0; // reinicia si ya estaba sonando
        this.sfx.shoot.play(); // Sonido de disparo
        let bullet = new Bullet(this.position.x + 0.6, this.position.y + 0.8, 0.7, 0.25, "blue", bdirection.x, bdirection.y, this.weapon.damage); // Crear la bala
        game.playerBullets.push(bullet); // Añadir la bala al array de balas del enemigo
    }

    // Método para iniciar un ataque en una dirección específica
    startAttack(direction) {
        // Si el temporizador de enfriamiento de ataque está activo, evitar atacar
        if (this.attackCooldownTimer > 0) return;
        // Si el jugador está derrotado, evitar atacar
        if (this.isDefeated) return;

        // Obtener los datos de animación de ataque para el arma actual y la dirección
        const dirData = attackAnimations[this.weapon.wtype][direction + "attack"];
        if (!dirData || dirData.status) return;

        // Marcar el ataque como activo y establecer la animación de ataque
        dirData.status = true;
        this.setAnimation(...dirData.moveFrames, dirData.repeat, dirData.duration);

        // Realizar el ataque correspondiente según el tipo de arma
        if (this.weapon.wtype === "sword" || this.weapon.wtype === "taser") {
            this.meleeAttack(direction);
        } else if (this.weapon.wtype === "gun") {
            this.shoot(direction); 
        }

        // Se establece el temporizador de enfriamiento de ataque para evitar ataques inmediatos consecutivos
        this.attackCooldownTimer = this.attackCooldownDuration; 

        // Restablecer el estado del ataque y detener la animación de ataque después de su duración
        setTimeout(() => { 
            dirData.status = false;
            this.stopAttack(direction);
        }, dirData.duration);
    }



    stopAttack(direction) {
        if (this.isDefeated) return; // Si el jugador fue derrotado, no se puede atacar
        if (this.currentWeaponSFX) this.currentWeaponSFX.pause(); // Detener el sonido del ataque
        const dirData = attackAnimations[this.weapon.wtype][direction + "attack"];
        if (!dirData || !dirData.status) return;
        dirData.status = false;
        const idleData = this.movement[direction];
        this.setAnimation(...idleData.idleFrames, false, idleData.duration);
    }

    // Método para que el jugador reciba daño
    takeDamage(damage) {
        this.sfx.damage.currentTime = 0; // reinicia si ya estaba sonando
        this.sfx.damage.play();

        this.danoTotalRecibido += damage; // Aumentar el daño total recibido por el jugador

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

        this.setAnimation(stateAnimations.damged.moveFrames[0], stateAnimations.damged.moveFrames[1], false, stateAnimations.damged.duration); // Se cambia a la animación de daño

        if (this.hp <= 0) {
            this.isDefeated = true; // Cambia el estado del jugador a derrotado
            this.sfx.defeated.currentTime = 0; // reinicia si ya estaba sonando
            this.sfx.defeated.play(); // Sonido de derrota
            this.setAnimation(stateAnimations.defeated.moveFrames[0], stateAnimations.defeated.moveFrames[1], false, stateAnimations.defeated.duration);

            this.partidasJugadas += 1; // Aumentar el contador de partidas jugadas
            console.log("Partidas jugadas: " + this.partidasJugadas);
        }
    }

    powerupEffect(powerup) { // Método para aplicar el efecto del powerup al jugador
        this.sfx.powerup.currentTime = 0; // reinicia si ya estaba sonando
        this.sfx.powerup.play(); // Sonido de recogida de powerup
        if (powerup.type === "weapon") {
            this.setAnimation(stateAnimations.powerup.moveFrames[0], stateAnimations.powerup.moveFrames[1], false, stateAnimations.powerup.duration);
            let revertWeapon = this.weapon;
            this.weapon = powerup;
            powerup.isCollected = true;
            let droppedWeapon = new Weapon("purple", 30, 30, revertWeapon.position.x, revertWeapon.position.y, "weapon", revertWeapon.wtype, revertWeapon.damage, "Epic", revertWeapon.animations);
            droppedWeapon.position = new Vec(powerup.position.x + 5, powerup.position.y);
            game.level.levelPowerUps.push(droppedWeapon);
            GAME_LEVELS[currentRoom].roomPowerUp = droppedWeapon;
        }
        else if (powerup.type === "empBomb") {
            this.hasEMP = true; // El jugador obtiene una bomba EMP.
            this.emp = powerup; // Se guarda para ser usado como imagen
            this.setAnimation(stateAnimations.powerup.moveFrames[0], stateAnimations.powerup.moveFrames[1], false, stateAnimations.powerup.duration);
            powerup.isCollected = true; // Marca el powerup como recogido
        }
        else if (powerup.type === "levelPass"){
            game.moveToLevel("main");
            game.cLevel++;
            console.log("Niveles completados: " + game.cLevel);
            resetRoomStats();
            activarMusica(); // Reinicia la musica
            game.level.setupDoors(); // Actualiza la puerta
            game.enteredBossRoom = false; // Cambia el estado de la sala del jefe a falso
            game.bossCleared = false; // Cambia el estado del jefe a 
        }
        else {
            this.setAnimation(stateAnimations.powerup.moveFrames[0], stateAnimations.powerup.moveFrames[1], false, stateAnimations.powerup.duration);
            powerup.effect(this);
            powerup.isCollected = true; // Marca el powerup como recogido
        }
    }
}

// Variable que contiene los diferentes frames de ataque del jugador según el arma que use
const attackAnimations = {
    sword: {
        upattack: {
            status: false,
            repeat: false,
            duration: 100,
            moveFrames: [91, 95],
            idleFrames: [90, 90]
        },
        downattack: {
            status: false,
            repeat: false,
            duration: 100,
            moveFrames: [61, 64],
            idleFrames: [60, 60]
        },
        leftattack: {
            status: false,
            repeat: false,
            duration: 100,
            moveFrames: [71, 75],
            idleFrames: [70, 70]
        },
        rightattack: {
            status: false,
            repeat: false,
            duration: 100,
            moveFrames: [81, 85],
            idleFrames: [80, 80]
        }
    },
    taser: {
        upattack: {
            status: false,
            repeat: false,
            duration: 100,
            moveFrames: [103, 105],
            idleFrames: [20, 20]
        },
        downattack: {
            status: false,
            repeat: false,
            duration: 100,
            moveFrames: [100, 102],
            idleFrames: [10, 10]
        },
        leftattack: {
            status: false,
            repeat: false,
            duration: 100,
            moveFrames: [110, 113],
            idleFrames: [40, 40]
        },
        rightattack: {
            status: false,
            repeat: false,
            duration: 100,
            moveFrames: [120, 123],
            idleFrames: [30, 30]
        }
    },
    gun: {
        upattack: {
            status: false,
            repeat: false,
            duration: 50,
            moveFrames: [134, 137],
            idleFrames: [134, 134]
        },
        downattack: {
            status: false,
            repeat: false,
            duration: 50,
            moveFrames: [130, 133],
            idleFrames: [130, 130]
        },
        leftattack: {
            status: false,
            repeat: false,
            duration: 50,
            moveFrames: [140, 143],
            idleFrames: [140, 140]
        },
        rightattack: {
            status: false,
            repeat: false,
            duration: 50,
            moveFrames: [150, 153],
            idleFrames: [150, 150]
        }
    }
};

// Variable que contiene los frames de estado del jugador, si este es derrotado, si obtiene un power up o si recibe daño.
const stateAnimations = {
    damged: {
        status: false,
        repeat: false,
        duration: 50,
        moveFrames: [55, 58],
        idleFrames: [0, 4]
    },
    powerup: {
        status: false,
        repeat: false,
        duration: 50,
        moveFrames: [51, 54],
        idleFrames: [0, 4]
    },
    defeated: {
        status: false,
        repeat: false,
        duration: 800,
        moveFrames: [163, 167],
        idleFrames: [0, 4]
    }
};