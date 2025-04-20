/*
 * General classes that can be useful for a game
 *
 * Gilberto Echeverria
 * 2025-01-22
 */

"use strict";

class Vec {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    plus(other) { // Método para sumar dos vectores.
        return new Vec(this.x + other.x, this.y + other.y);
    }

    minus(other) { // Método para restar dos vectores.
        return new Vec(this.x - other.x, this.y - other.y);
    }

    times(factor) { // Método para multiplicar un vector por un escalar.
        return new Vec(this.x * factor, this.y * factor);
    }

    get_length() { // Método para obtener la magnitud de un vector.
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    unit_V(){ // Método para obtener el vector unitario de un vector.
        return new Vec(this.x / this.get_length(), this.y / this.get_length());
    }

    distanceTo(other) { // Método para obtener la distancia entre dos vectores.
        return Math.sqrt((this.x - other.x) ** 2 + (this.y - other.y) ** 2);
    }
}


class Rect {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}


class GameObject {
    constructor(color, width, height, x, y, type) {
        this.position = new Vec(x, y);
        this.size = new Vec(width, height);
        this.color = color;
        this.type = type;

        // Sprite properties
        this.spriteImage = undefined;
        this.spriteRect = undefined;
    }

    setSprite(imagePath, rect) {
        this.spriteImage = new Image();
        this.spriteImage.src = imagePath;
        if (rect) {
            this.spriteRect = rect;
        }
    }

    draw(ctx, scale) {
        if (this.spriteImage) {
            // Draw a sprite if the object has one defined
            if (this.spriteRect) {
                ctx.drawImage(this.spriteImage,
                              this.spriteRect.x * this.spriteRect.width,
                              this.spriteRect.y * this.spriteRect.height,
                              this.spriteRect.width, this.spriteRect.height,
                              this.position.x * scale, this.position.y * scale,
                              this.size.x * scale, this.size.y * scale);
            } else {
                ctx.drawImage(this.spriteImage,
                              this.position.x * scale, this.position.y * scale,
                              this.size.x * scale, this.size.y * scale);
            }
        } else {
            // If there is no sprite asociated, just draw a color square
            ctx.fillStyle = this.color;
            ctx.fillRect(this.position.x * scale, this.position.y * scale,
                         this.size.x * scale, this.size.y * scale);
        }
    }

    update() {

    }
}

class Button extends GameObject { // Clase para crear botones en el juego
    constructor(x, y, width, height, text) {
      super(null, width, height, x, y, "button");
      this.textString = text; // Texto del botón
      this.textLabel = new TextLabel(x, y, "24px Arial", "#fff"); // Texto del botón
      this.isOver = false; // Variable para saber si el mouse está sobre el botón
      this.bg = null; // Color de fondo del botón
    }
  
    draw(ctx, scale, overBg) {
        let defaultBg = this.bg; // Color de fondo por defecto
        if (this.isOver) {
            this.bg = overBg;
        } 
        else {
            this.bg = defaultBg;
        }
        ctx.fillStyle = this.bg;
        ctx.fillRect(this.position.x * scale, this.position.y * scale, this.size.x * scale, this.size.y * scale);
        // Dibujar el texto en el botón
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        this.textLabel.x = (this.position.x + this.size.x / 2) * scale;
        this.textLabel.y = (this.position.y + this.size.y / 2) * scale;
        this.textLabel.draw(ctx, this.textString);
    }

    isOnButton(x, y) { // Método para saber si el mouse está sobre el botón
        if (x >= this.position.x && x <= this.position.x + this.size.x && y >= this.position.y && y <= this.position.y + this.size.y){
            this.isOver = true; // Si el punto está dentro del botón, devuelve true
        }
        else{
            this.isOver = false; // Si el punto no está dentro del botón, devuelve false
        }
    }

    click(mx, my) { // Método para saber si el mouse está dentro del botón y si se hace click
        return mx >= this.position.x && 
        mx <= this.position.x + this.size.x && 
        my >= this.position.y && 
        my <= this.position.y + this.size.y; // Si el mouse está dentro del botón, devuelve true
    }
}
  

class HitBox extends GameObject { // Clase para crear las hitbox de cada ojeto
    constructor(x, y, width, height) {
        super(null , width, height, x, y, "hitbox"); // Indicamos que el color que posea el objeto sea nulo por defecto
    }
    
    drawHitBox(ctx, scale) { // Método para dibujar el hitbox del objeto
        ctx.strokeStyle = "red";
        ctx.strokeRect(this.position.x * scale, this.position.y * scale, this.size.x * scale, this.size.y * scale); // Usamos las propiedades del objeto para formar el marco de la hitbox 
    }

    update(){ // Método para poder actualizar el hitbox del objeto

    }
}


class AnimatedObject extends GameObject {
    constructor(color, width, height, x, y, type) {
        super(color, width, height, x, y, type);
        // Animation properties
        this.frame = 0;
        this.minFrame = 0;
        this.maxFrame = 0;
        this.sheetCols = 0;

        this.repeat = true;

        // Delay between frames (in milliseconds)
        this.frameDuration = 100;
        this.totalTime = 0;
    }

    setAnimation(minFrame, maxFrame, repeat, duration) {
        this.minFrame = minFrame;
        this.maxFrame = maxFrame;
        this.frame = minFrame;
        this.repeat = repeat;
        this.totalTime = 0;
        this.frameDuration = duration;
    }

    updateFrame(deltaTime) {
        this.totalTime += deltaTime;
        if (this.totalTime > this.frameDuration) {
            // Loop around the animation frames if the animation is set to repeat
            // Otherwise stay on the last frame
            let restartFrame = (this.repeat ? this.minFrame : this.frame);
            this.frame = this.frame < this.maxFrame ? this.frame + 1 : restartFrame;
            this.spriteRect.x = this.frame % this.sheetCols;
            this.spriteRect.y = Math.floor(this.frame / this.sheetCols);
            this.totalTime = 0;
        }
    }
}


class TextLabel {
    constructor(x, y, font, color) {
        this.x = x;
        this.y = y;
        this.font = font;
        this.color = color;
    }

    draw(ctx, text) {
        ctx.font = this.font;
        ctx.fillStyle = this.color;
        ctx.fillText(text, this.x, this.y);
    }
}

// Simple collision detection between rectangles
function overlapRectangles(actor1, actor2) {
    return actor1.position.x + actor1.size.x > actor2.position.x &&
           actor1.position.x < actor2.position.x + actor2.size.x &&
           actor1.position.y + actor1.size.y > actor2.position.y &&
           actor1.position.y < actor2.position.y + actor2.size.y;
}
