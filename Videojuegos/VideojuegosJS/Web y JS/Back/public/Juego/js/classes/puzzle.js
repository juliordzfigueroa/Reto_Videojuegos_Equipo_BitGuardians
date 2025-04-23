/* 
Se utilizo la siguiente referencia para la creación del rompecabezas:
LabEx. (s.f.). Build a sliding puzzle game with JavaScript. LabEx. 
https://labex.io/tutorials/css-build-a-sliding-puzzle-game-with-javascript-298926
Se uso como tutorial para la creacion. Posteriormente se modificaron funciones para hacer el juego adaptado a The Final Hack.

    Equipo BitGuardians
    Clase del objeto Puzzle
*/

//Movimientos posibles en el tablero de 3x3 
/*
0 1 2
3 4 5
6 7 8
*/

"use strict";

class Puzzle {
  constructor(canvasWidth, canvasHeight) {
    this.tileSize = 150;
    this.boardSize = 3;
    this.board = [1, 2, 3, 4, 5, 6, 7, 8, 0]; //Estado por defecto del tablero: fichas del 1 al 8, y 0 representa el espacio vacío
    this.timeLimit; // Tiempo límite en segundos
    this.set_timer;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.puzzleCompleated = false;
    this.endSound = false;


    //Coordenadas en píxeles de cada casilla en el tablero de 3x3
    this.positionMap = {
      0: { left: 0, top: 0 },
      1: { left: 150, top: 0 },
      2: { left: 300, top: 0 },
      3: { left: 0, top: 150 },
      4: { left: 150, top: 150 },
      5: { left: 300, top: 150 },
      6: { left: 0, top: 300 },
      7: { left: 150, top: 300 },
      8: { left: 300, top: 300 }
    };

    this.movementRules = {
        0: [1, 3],        //Casilla 0 puede moverse a 1 (derecha) o 3 (abajo)
        1: [0, 2, 4],     //Casilla 1 puede moverse a 0 (izquierda), 2 (derecha), 4 (abajo)
        2: [1, 5],        //Casilla 2 puede moverse a 1 (izquierda), 5 (abajo)
        3: [0, 4, 6],     //Casilla 3 puede moverse a 0 (arriba), 4 (derecha), 6 (abajo)
        4: [1, 3, 5, 7],  //Casilla central puede moverse en todas direcciones
        5: [2, 4, 8],     //Casilla 5 puede moverse a 2 (arriba), 4 (izquierda), 8 (abajo)
        6: [3, 7],        //Casilla 6 puede moverse a 3 (arriba), 7 (derecha)
        7: [4, 6, 8],     //Casilla 7 puede moverse a 4 (arriba), 6 (izquierda), 8 (derecha)
        8: [5, 7]         //Casilla 8 puede moverse a 5 (arriba), 7 (izquierda)
    };
  }

  init() {
    if (this.puzzleCompleated == false) { // Si el puzzle no ha sido completado
      this.shuffle();
      this.restart(); // Reinicia el temporizador
    }
    else {
      this.draw(ctx); // Si el puzzle ya ha sido completado, se dibuja el puzzle
    }
  }

  shuffle() {
    let newBoard;
    //Usaremos el do-while para asegurarnos de que el tablero siempre tenga solución
    do {
        //Creamos una copia del arreglo [1..8, 0] y lo mezclamos aleatoriamente
        newBoard = [1, 2, 3, 4, 5, 6, 7, 8, 0];
        for (let i = newBoard.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [newBoard[i], newBoard[j]] = [newBoard[j], newBoard[i]];
        }
    } while (!this.isSolvable(newBoard)); //Repetimos si no es resoluble
    this.board = newBoard;
  }

  isSolvable(puzzle) {
    let inversions = 0;
    //Comparamos cada elemento con el que viene después
    for (let i = 0; i < 8; i++) {
      for (let j = i + 1; j < 9; j++) {
        if (puzzle[i] !== 0 && puzzle[j] !== 0 && puzzle[i] > puzzle[j])
          inversions++;
      }
    }
    if (inversions % 2 === 0){
      return true; //Es resoluble si el número de inversiones es par
    }
    else{
      return false
    }
  }

  startTimer() {
    if (this.set_timer) clearInterval(this.set_timer); // Si existe un tiempo, reiniciar para empezar con los 3 min iniciales
    this.set_timer = setInterval(() => this.timer(), 1000);
  }

  timer() {
    if (this.timeLimit <= 0) { //Si el tiempo se agota
      clearInterval(this.set_timer);
      // No llamamos reiniciar, forzando a que el jugador reinicie el puzzle
      this.puzzleCompleated = false; // Cambia el estado a no completado
      return;
    }
    this.timeLimit--;
  }

  restart() {
    this.timeLimit = 180; // 3 Minutos
    clearInterval(this.set_timer); // Detiene el temporizador actual
    this.startTimer(); // Inicia un nuevo temporizador
  }

  draw(ctx) { // Método usado para dibujar el puzzle en el canvas cuando este sea activado
    let puzzleWidth = this.boardSize * this.tileSize;
    let puzzleHeight = this.boardSize * this.tileSize;
    let puzzleX = (this.canvasWidth - puzzleWidth) / 2;
    let puzzleY = (this.canvasHeight - puzzleHeight) / 2;

    // Guardamos las coordenadas en el objeto para poder manipularlas con el mouse
    this.puzzleX = puzzleX;
    this.puzzleY = puzzleY;

    // Fondo de cada ficha
    ctx.fillRect(puzzleX, puzzleY, puzzleWidth, puzzleHeight); // Fondo del puzzle
    ctx.fillStyle = "#00ff88"; // Color de las líneas

    // Dibujar cada ficha
    ctx.font = "100px Courier New";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (let i = 0; i < this.board.length; i++) {
      let num = this.board[i];
      if (num !== 0) {
        let col = i % this.boardSize;
        let row = Math.floor(i / this.boardSize);
        let x = puzzleX + col * this.tileSize;
        let y = puzzleY + row * this.tileSize;
        ctx.fillStyle = "#00ff88";
        ctx.fillRect(x + 2, y + 2, this.tileSize - 4, this.tileSize - 4);
        ctx.fillStyle = "#1a1a1d";
        ctx.fillText(num, x + this.tileSize / 2, y + this.tileSize / 2);
      }
    }

    // Mostrar el temporizador
    let minutes = Math.floor(this.timeLimit / 60);
    let seconds = this.timeLimit % 60;
    let minString = minutes < 10 ? "0" + minutes : minutes;
    let secString = seconds < 10 ? "0" + seconds : seconds;
    ctx.fillStyle = "#fff";
    ctx.font = "20px Arial";
    ctx.fillText(minString + ":" + secString, puzzleX + puzzleWidth + 30, puzzleY + 70);

    // Si el puzzle está resuelto, muestra un mensaje
    if (this.checkWinCondition()) {
      clearInterval(this.set_timer);
      ctx.fillStyle = "#fff";
      ctx.font = "30px Arial";
      ctx.fillText("Felicidades! Puzzle resuelto, Use ESC para salir", this.canvasWidth / 2, puzzleY - 20);
      if (!this.puzzleCompleated) {
        this.puzzleCompleated = true; // Cambia el estado a completado
        game.gameEffects.puzzleSuccess.currentTime = 0; // Reinicia el sonido si ya estaba sonando
        game.gameEffects.puzzleSuccess.play(); // Sonido de Game Over
      }
    }
    else if (this.timeLimit <= 0) { // Si el tiempo se agota
      ctx.fillStyle = "#fff";
      ctx.font = "30px Arial";
      ctx.fillText("Puzzle fallido, Use 'r' para reintentar", this.canvasWidth / 2, puzzleY - 20);
      if (!this.endSound) {
        game.gameEffects.puzzleFail.play(); // Sonido para indicar que no se completo el puzzle.
        this.endSound = true; // Cambia el estado a completado
      }
    }
  }

  //Método que mueve una ficha si es posible 
  moveTile(id) {
    const currentPosition = this.board.indexOf(id);
    let targetPosition = this.ableToMove(this.board.indexOf(id));
    if (targetPosition !== -1) {
      // Intercambiar la ficha con el espacio vacío usando this.board
      this.board[targetPosition] = id;
      this.board[currentPosition] = 0;

      // Si existen elementos en el DOM para representar las fichas, actualizarlos
      const tile = document.getElementById("d" + id);
      if (tile && this.positionMap[targetPosition]) {
        tile.style.left = this.positionMap[targetPosition].left + "px";
        tile.style.top = this.positionMap[targetPosition].top + "px";
      }
    }
  }


  ableToMove(currentPosition) {
    let emptyIndex = this.board.indexOf(0); // Se busca el espació vació en el puzzle
    let possibleMoves = this.movementRules[currentPosition]; // Revisamos las reglas establecidas para ver el siguiente movimiento
    
    // Si el índice del espacio vacío está en los movimientos permitidos, se retorna ese índice
    if (possibleMoves && possibleMoves.includes(emptyIndex)) {
      return emptyIndex;
    }
    
    // Si no, se retorna -1 indicando que no es posible mover la ficha a ese espacio
    return -1;
   }

   mouseControl(event, canvas, mouseX, mouseY) {
    // Calcular la columna y fila en la que se hizo clic
    let col = Math.floor((mouseX - this.puzzleX) / this.tileSize);
    let row = Math.floor((mouseY - this.puzzleY) / this.tileSize);
    let index = row * this.boardSize + col;
    let tileNumber = this.board[index];

    // Si se hizo clic en una ficha (no en el espacio vacío)
    if (tileNumber !== 0) {
      this.moveTile(tileNumber);
    }
  }

  //Función que verifica si el rompecabezas está completo
  checkWinCondition() {
    for (let i = 0; i < 9; i++) {
      if (i === 8) {
        //Última posición debe ser 0 (espacio vacío)
        if (this.board[i] !== 0) {
          return false;
        }
      } else {
        //Las demás posiciones deben estar en orden ascendente
        if (this.board[i] !== i + 1) {
          return false;
        }
      }
    }
    return true; //Si todo está en orden, el puzzle está resuelto
    }
}
