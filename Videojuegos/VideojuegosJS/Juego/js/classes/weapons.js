/*

    Equipo BitGuardians
    Clase PowerUp para los objetos del juego

*/

"use strict";

class PowerUp extends GameObject {
    constructor(color, width, height, x, y, type, effectN, spawrate, rarity) {
        super(color, 30, 30, x, y, "powerup"); // Width y height fijos para todos los powerups por el tamaño de los sprites.
        this.effectN = effectN; // Nombre del efecto que tendrá cada powerup.
        this.iscollected = false; // Variable para saber si el powerup fue recogido tras completar la sala.
        this.spawrate = spawrate; // Variable para saber la probabilidad de aparición de cada powerup.
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
    constructor(color, width, height, x, y, type, heal, spawrate, rarity) {
        super("red", x, y, heal, spawrate, "Uncommon"); 
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
    constructor(color, width, height, x, y, type, shield, spawrate, rarity) {
        super("blue", x, y, shield, spawrate, "Uncommon"); 
    }

    effect(player) {
        player.shield += player.max_shield * 0.1; // El jugador se cura en un 10% de su escudo máximo.
        if (player.shield > player.max_shield) // Si el escudo del jugador supera su escudo máximo, se iguala a este.
        {
            player.shield = player.max_shield;
        }
    }
}

class HealthIncrease extends PowerUp {
    constructor(color, width, height, x, y, type, hpIncrease, spawrate, rarity) {
        super("green", x, y, hpIncrease, spawrate, "Rare"); 
    }

    effect(player) {
        player.max_hp = player.max_hp + 20; // La vida máxima del jugador aumenta en 20 puntos.
        player.hp = player.max_hp; // La vida del jugador se iguala a su vida máxima y lo cura por completo.
    }
}

class EMPBomb extends PowerUp {
    constructor(color, width, height, x, y, type, empBomb, spawrate, rarity) {
        super("yelloy", x, y, empBomb, spawrate, "Legendary");
    }
    
    effect() {
        for (let enemy of game.enemies) {
            enemy.state = "stunned";
            enemy.stunTime = stunDuration;
        }
        console.log("EMPBomb activated: Enemies stunned");
    }
}

class Weapon extends PowerUp {
    constructor(color, width, height, x, y, wtype, spawrate, damage, rarity, animations) {
        super("purple", x, y, wtype, spawrate, damage, "Epic"); 
        this.type = wtype; // Tipo de arma que tendrá el jugador.
        this.spawrate = spawrate; // Probabilidad de aparición del arma.
        this.damage = damage;
        this.animations = animations; // Animaciones que tenga el jugador dependiendo del arma
    }
}

function getRandomWeapon(){ // Método para obtener un arma aleatoria de la lista de armas.
    const weapons = [ 
        new Weapon("purple", 30, 30, 0, 0, "sword", 0.1, 20, "Epic", attackAnimations.sword),
        new Weapon("purple", 30, 30, 0, 0, "gun", 0.1, 10, "Epic", attackAnimations.gun),
        new Weapon("purple", 30, 30, 0, 0, "taser", 0.1, 15, "Epic", attackAnimations.taser),
    ];
    let randomIndex = Math.floor(Math.random() * weapons.length);
    return weapons[randomIndex]; // Devuelve un arma aleatoria de la lista de armas.
}