/*

    Equipo BitGuardians
    Clase PowerUp para los objetos del juego

*/

"use strict";

class PowerUp extends GameObject {
    constructor(color, width, height, x, y, type, effectN, rarity) {
        super(color, 1.8, 2, x, y, type); // Width y height fijos para todos los powerups por el tamaño de los sprites
        this.effectN = effectN; // Nombre del efecto que tendrá cada powerup.
        this.isCollected = false; // Variable para saber si el powerup fue recogido tras completar la sala.
        this.rarity = rarity; // Variable para saber la rareza de cada powerup.
    }

    effect(player)
    {
        // Método usado como plantilla para aplicar el efecto de cada powerup al jugador.
    }
}

// Todos los power ups de nuestro juego al tener habilidades diferentes, se crean como clases que extienden de la clase PowerUp.

class Heal extends PowerUp {
    constructor(color, width, height, x, y, type, effectN, rarity) {
        super("red", x, y, type, "heal", "Uncommon"); 
        this.type = "heal"; // Tipo de powerup que será la cura.
        this.setSprite("../assets/sprites/powerUps/heal_asset.png", new Rect(0, 0, 26, 32));
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
        super("blue", x, y, type, "shield", "Uncommon"); 
        this.type = "shield"; // Tipo de powerup que será el escudo.
        this.setSprite("../assets/sprites/powerUps/shield_asset.png", new Rect(0, 0, 26, 32));
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
        super("green", x, y, type, "hpIncrease", "Rare");
        this.type = "hpIncrease"; // Tipo de powerup que será el aumento de vida. 
        this.setSprite("../assets/sprites/powerUps/hpIncrease_asset.png", new Rect(0, 0, 26, 32));
    }

    effect(player) {
        player.max_hp = player.max_hp + 20; // La vida máxima del jugador aumenta en 20 puntos.
        player.hp = player.max_hp; // La vida del jugador se iguala a su vida máxima y lo cura por completo.
        player.max_shield = player.max_hp* 0.1; // El escudo máximo del jugador aumenta en un 10% de su vida máxima.
    }
}

class EMPBomb extends PowerUp {
    constructor(color, width, height, x, y, type, effectN, rarity) {
        super("yellow", x, y, type, "empBomb", "Legendary");
        this.type = "empBomb";
        this.setSprite("../assets/sprites/powerUps/empBomb_asset.png", new Rect(0, 0, 26, 32)); 
    }
}

class Weapon extends PowerUp {
    constructor(color, width, height, x, y, type, wtype, damage, rarity, animations) {
        super("purple", x, y, type, wtype, damage, "Epic"); 
        this.type = "weapon"; // Tipo de powerup que será el arma.
        this.wtype = wtype; // Tipo de arma que tendrá el jugador.
        this.damage = damage;
        this.animations = animations; // Animaciones que tenga el jugador dependiendo del arma
        switch(wtype) {
            case "sword":
                this.setSprite("../assets/sprites/powerUps/sword_asset.png", new Rect(0, 0, 26, 32));
                break;
            case "gun":
                this.setSprite("../assets/sprites/powerUps/gun_asset.png", new Rect(0, 0, 26, 32));
                break;
            case "taser":
                this.setSprite("../assets/sprites/powerUps/taser_asset.png", new Rect(0, 0, 26, 32));
                break;
        }
    }
}

class LevelPass extends PowerUp {
    constructor(color, width, height, x, y, type, effectN, rarity) {
        super("orange", x, y, type, "levelPass", "  NONE"); // Tipo de powerup que será el pase de nivel.
        this.type = "levelPass"; // Tipo de powerup que será el pase de nivel.
    }
}

function getRandomInitWeapon(){ // Método para obtener un arma aleatoria de la lista de armas al comenzar una partida.
    const weapons = [ 
        new Weapon("purple", 30, 30, 0, 0, "weapon", "sword", 20, "Epic", attackAnimations.sword),
        new Weapon("purple", 30, 30, 0, 0, "weapon", "gun", 100, "Epic", attackAnimations.gun),
        new Weapon("purple", 30, 30, 0, 0, "weapon", "taser", 15, "Epic", attackAnimations.taser),
    ];
    let randomIndex = Math.floor(Math.random() * weapons.length);
    return weapons[randomIndex]; // Devuelve un arma aleatoria de la lista de armas.
}

function getRandomPowerUp() { // Método para obtener un powerup aleatorio de la lista de powerups, incluidas armas.
    const all_powerups = [
        new Heal("red", 30, 30, 0, 0, "heal", "Uncommon"),
        new Shield("blue", 30, 30, 0, 0, "shield", "Uncommon"),
        new HealthIncrease("green", 30, 30, 0, 0, "healthIncrease", "Rare"),
        new Weapon("purple", 30, 30, 0, 0, "weapon", "sword", 20, "Epic", attackAnimations.sword),
        new Weapon("purple", 30, 30, 0, 0, "weapon", "gun", 10, "Epic", attackAnimations.gun),
        new Weapon("purple", 30, 30, 0, 0, "weapon", "taser", 15, "Epic", attackAnimations.taser),
        new EMPBomb("yellow", 30, 30, 0, 0, "empBomb", "Legendary"),
    ];

    let currentWeaponType = game.player.weapon.wtype; // Obtiene el tipo de arma actual del jugador.
    const powerups = all_powerups.filter(powerup => !(powerup.type == "weapon" && powerup.wtype === currentWeaponType)); // Filtra los powerups para que no se repita el tipo de arma actual del jugador.

    let randPower = Math.floor(Math.random() * powerups.length); // Usado la longitud del arreglo en caso de que se añadan más tipos en el futuro.
    return powerups[randPower]; // Devuelve un powerup aleatorio
}