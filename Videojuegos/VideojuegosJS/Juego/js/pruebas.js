class PowerUp extends GameObject{
    constructor(position, width, height, color, effectName){
        super(position, width, height, color, "powerup");
        this.effectName = effectName;
        this.collected = false;
    }
    applyEffect(player){
        console.log("PowerUp aplicado:", this.effectName);
    }
}

class Weapon extends PowerUp{
    constructor(position, color, weaponName){
        super(position, 20, 20, color, weaponName);
        this.weaponName = weaponName;
    }

    applyEffect(player) {
        player.weapon = this.weaponName;
        console.log("Arma equipada:", this.weaponName);
    }
}

//Ejemplo de nuestros power up 
class healing extends PowerUp{
    constructor(position){
        super(position, 20, 20, "green", "heal");
    }
    applyEffect(player){
        player.health += 1;
    }
}

class shield extends PowerUp{
    constructor(position){
        super(position, 20, 20, "green", "shield");
    }
    applyEffect(player){
        player.shield = true;
    }
}

class healthIncrease extends PowerUp{
    constructor(position){
        super(position, 20, 20, "blue", "HealthIncrease");
    }
    applyEffect(player){
        player.max_health += 1;
        player.health = player.max_health;
    }
}

class emp_bomb extends PowerUp{
    constructor(position){
        super(position, 20, 20, "yellow", "Bomb");
    }
    applyEffect(player){
        player.emp += true;
    }
}

class laser_sword extends Weapon {
    constructor(position){
        super(position, "purple", "laser_sword")
    }
}

class taser extends Weapon {
    constructor(position){
        super(position, "purple", "taser")
    }
}


class laser_gun extends Weapon {
    constructor(position){
        super(position, "purple", "laser_gun")
    }
}





