/*

    Equipo BitGuardians
    Clase PowerUp para los objetos del juego

*/

"use strict";

class PowerUp extends GameObject {
    constructor(color, width, height, x, y, type, effectN, rarity) {
        super(color, 1, 1, x, y, "powerup"); // Width y height fijos para todos los powerups por el tamaño de los sprites.
        this.effectN = effectN; // Nombre del efecto que tendrá cada powerup.
        this.isCollected = false; // Variable para saber si el powerup fue recogido tras completar la sala.
        this.rarity = rarity; // Variable para saber la rareza de cada powerup.
        //this.setSprite('../assets/sprites/powerUps/assets_powerUps2.png', powerUpSprites.effectN);
    }

    update() {
        // Método incluido para poder actualizar el estado de cada powerup en las salas tras ser completadas.
    }

    effect(player)
    {
        // Método usado como plantilla para aplicar el efecto de cada powerup al jugador.
    }
}

// Todos los power ups de nuestro juego al tener habilidades diferentes, se crean como clases que extienden de la clase PowerUp.

class Heal extends PowerUp {
    constructor(color, width, height, x, y, type, effectN, rarity) {
        super("red", x, y, "powerup", "heal", "Uncommon"); 
    }

    effect(player) {
        player.hp += player.max_hp * 0.2; // El jugador se cura en un 20% de su vida máxima.
        if (player.hp > player.max_hp) // Si la vida del jugador supera su vida máxima, se iguala a esta.
        {
            player.hp = player.max_hp;
        }
      }
}

class Shield extends PowerUp {
    constructor(color, width, height, x, y, type, effectN, rarity) {
        super("blue", x, y, "powerup", "shield", "Uncommon"); 
    }

    effect(player) {
        player.shield += player.max_hp * 0.1; // El jugador se cura en un 10% de su escudo máximo.
        if (player.shield > player.max_shield) // Si el escudo del jugador supera su escudo máximo, se iguala a este.
        {
            player.shield = player.max_shield;
        }
    }
}

class HealthIncrease extends PowerUp {
    constructor(color, width, height, x, y, type, effectN, rarity) {
        super("green", x, y, "powerup", "hpIncrease", "Rare"); 
    }

    effect(player) {
        player.max_hp = player.max_hp + 20; // La vida máxima del jugador aumenta en 20 puntos.
        player.hp = player.max_hp; // La vida del jugador se iguala a su vida máxima y lo cura por completo.
        player.max_shield = player.max_hp* 0.1; // El escudo máximo del jugador aumenta en un 10% de su vida máxima.
    }
}

class EMPBomb extends PowerUp {
    constructor(color, width, height, x, y, type, effectN, rarity) {
        super("yellow", x, y, "empBomb", "empBomb", "Legendary");
    }
    
    effect(player) {
        game.player.hasEMP = true; // El jugador obtiene una bomba EMP.
    }
}

class Weapon extends PowerUp {
    constructor(color, width, height, x, y, wtype, damage, rarity, animations) {
        super("purple", x, y, wtype, damage, "Epic"); 
        this.type = wtype; // Tipo de arma que tendrá el jugador.
        this.damage = damage;
        this.animations = animations; // Animaciones que tenga el jugador dependiendo del arma
    }
}

function getRandomWeapon(){ // Método para obtener un arma aleatoria de la lista de armas.
    const weapons = [ 
        new Weapon("purple", 30, 30, 0, 0, "sword", 20, "Epic", attackAnimations.sword),
        new Weapon("purple", 30, 30, 0, 0, "gun", 10, "Epic", attackAnimations.gun),
        new Weapon("purple", 30, 30, 0, 0, "taser", 15, "Epic", attackAnimations.taser),
    ];
    let randomIndex = Math.floor(Math.random() * weapons.length);
    return weapons[randomIndex]; // Devuelve un arma aleatoria de la lista de armas.
}

function getRandomPowerUp() { // Método para obtener un powerup aleatorio de la lista de powerups, incluidas armas.
    const powerups = [
        new Heal("red", 30, 30, 0, 0, "heal", "Uncommon"),
        new Shield("blue", 30, 30, 0, 0, "shield", "Uncommon"),
        new HealthIncrease("green", 30, 30, 0, 0, "healthIncrease", "Rare"),
        getRandomWeapon(),
        new EMPBomb("yellow", 30, 30, 0, 0, "empBomb", "Legendary"),
    ];
    let randPower = Math.floor(Math.random() * powerups.length); // Usado la longitud del arreglo en caso de que se añadan más tipos en el futuro.
    return powerups[randPower]; // Devuelve un powerup aleatorio
}

const powerUpSprites = {
    heal:       new Rect(0, 0, 26, 32), // primer ícono
    shield:     new Rect(27, 0, 26, 32), // segundo ícono
    hpIncrease: new Rect(53, 0, 26, 32), // tercer ícono
    empBomb:    new Rect(79, 0, 26, 32), // cuarto ícono
    sword:      new Rect(105, 0, 26, 32), // quinto ícono (si lo usaras)
    gun:        new Rect(131, 0, 26, 32), // sexto ícono
    taser:      new Rect(157, 0, 26, 32)  // séptimo ícono
  };