/*

    Equipo BitGuardians
    Object Class forthe object Weapon

*/

class PowerUp extends GameObject {
    constructor(color, width, height, x, y, type) {
        super(color, width, height, x, y, type, id, spawrate, rarity);
    }

    update(deltaTime) {
        this.position = this.position.plus(this.velocity.times(deltaTime)); // Para el movimiento de caida.
    }
}

class Weapon extends PowerUp {
    constructor(color, width, height, x, y, type, id, damage, range, spawrate, rarity) {
        super("black", width, height, x, y, "weapon", id, damage, range, spawrate, "Epic"); 
    }

    update(deltaTime) {
        this.position = this.position.plus(this.velocity.times(deltaTime)); // Para el movimiento de caida.
    }
}