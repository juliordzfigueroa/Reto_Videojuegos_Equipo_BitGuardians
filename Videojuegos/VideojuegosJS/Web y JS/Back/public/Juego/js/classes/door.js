class Door extends GameObject {
    constructor(color, x, y, width, height, type, spritePath) {
        super(color, x, y, width, height, "door", spritePath);
        this.isOpen = false; //Estado inicial cerrado
        this.spriteImage; 
    }

    close() {
        this.isOpen = false;
        this.spritePath = '../assets/sprites/escenarios/door_closed.png';
    }

    open() {
        this.isOpen = true;
        this.spritePath = '../assets/sprites/escenarios/door_open.png';
    }
}