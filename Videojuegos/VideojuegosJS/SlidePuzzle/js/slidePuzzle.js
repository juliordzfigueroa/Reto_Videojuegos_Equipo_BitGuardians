/* 
Se utilizo la siguiente referencia para la creación del rompecabezas:
LabEx. (s.f.). Build a sliding puzzle game with JavaScript. LabEx. 
https://labex.io/tutorials/css-build-a-sliding-puzzle-game-with-javascript-298926
Se uso como tutorial para la creacion. Posteriormente se modificaron funciones para hacer el juego adaptado a The Final Hack.
*/

//Movimientos posibles en el tablero de 3x3 
/*
0 1 2
3 4 5
6 7 8
*/
const movementRules = {
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

//Coordenadas en píxeles de cada casilla en el tablero de 3x3
const positionMap = {
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

//Estado por defecto del tablero: fichas del 1 al 8, y 0 representa el espacio vacío
const board = [1, 2, 3, 4, 5, 6, 7, 8, 0];

//Poner tiempo límite para resolver el rompecabezas
let timeLimit = 300; //5 minutos
let set_timer;
function timer() {
  if (timeLimit <= 0) { //Si el tiempo se agota
    clearInterval(set_timer);
    document.getElementById("timer").innerHTML = "00:00";
    alert("¡Tiempo agotado! ¡Inténtalo de nuevo!");
    return;
  }

  let minutes = Math.floor(timeLimit / 60); //Obtener los minutos restantes
  let seconds = timeLimit % 60; //Obtener los segundos restantes

  //Actualizar el temporizador cada segundo
  let minString;
  let secString;

  if (minutes < 10) {
    minString = "0" + minutes;
  } else {
    minString = minutes.toString();
  }

  if (seconds < 10) {
    secString = "0" + seconds;
  } else {
    secString = seconds.toString();
  }
  document.getElementById("timer").innerHTML = minString + ":" + secString;
  timeLimit--; //Decrementar el tiempo restante
}

//Función para iniciar el temporizador
function start() {
  clearInterval(set_timer); // Por si ya había uno corriendo
  set_timer = setInterval(timer, 1000); // Llama a `timer()` cada segundo
}

//Reiniciar el juego
function restart() {
  timeLimit = 300; //5 minutos
  clearInterval(set_timer); //Detener el temporizador actual
  start(); //Iniciar un nuevo temporizador
}

//Función que mueve una ficha si es posible
function move(id) {
  const currentPosition = board.indexOf(id); //Buscamos la posición actual de la ficha
  const targetPosition = whereCanTo(currentPosition); //Verificamos si la ficha puede moverse al hueco usando whereCanTo

  //Si se encontró una posición vecina vacía válida (se puede mover)
  if (targetPosition !== -1) {
    const targetIndex = targetPosition; //Índice de la posición vacía

    //Intercambiamos la ficha con el hueco en el array
    board[targetIndex] = id;
    board[currentPosition] = 0;

    //Movemos visualmente la ficha
    const tile = document.getElementById("d" + id);
    tile.style.left = positionMap[targetIndex].left + "px";
    tile.style.top = positionMap[targetIndex].top + "px";

    //Verificamos si el puzzle está resuelto
    if (checkWinCondition()) {
      clearInterval(set_timer); //Detener el temporizador
      alert("¡Felicidades! ¡Has completado el rompecabezas!");
    }
  }
}

//Función que determina si una ficha puede moverse y retorna la posición vacía vecina
function whereCanTo(position) {
  const possibleMoves = movementRules[position]; //Vecinos posibles

  for (let i = 0; i < possibleMoves.length; i++) {
    const neighbor = possibleMoves[i]; //Índice de casilla vecina
    if (board[neighbor] === 0) { //Si esa casilla está vacía
      return neighbor; //Se puede mover ahí
    }
  }
  return -1; //Si no se puede mover, regresa -1
}

//Función que verifica si el rompecabezas está completo
function checkWinCondition() {
  for (let i = 0; i < 9; i++) {
    if (i === 8) {
      //Última posición debe ser 0 (espacio vacío)
      if (board[i] !== 0) {
        return false;
      }
    } else {
      //Las demás posiciones deben estar en orden ascendente
      if (board[i] !== i + 1) {
        return false;
      }
    }
  }
  return true; //Si todo está en orden, el puzzle está resuelto
}

//Función para revolver las fichas del puzzle
function shuffle() {
  let newBoard;
  //Usaremos el do-while para asegurarnos de que el tablero siempre tenga solución
  do {
    //Creamos una copia del arreglo [1..8, 0] y lo mezclamos aleatoriamente
    newBoard = [1, 2, 3, 4, 5, 6, 7, 8, 0];
    for (let i = newBoard.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [newBoard[i], newBoard[j]] = [newBoard[j], newBoard[i]];
    }
  } while (!isSolvable(newBoard)); //Repetimos si no es resoluble

  //Actualizamos tablero original
  for (let i = 0; i < 9; i++) {
    board[i] = newBoard[i];

    //Si no es el hueco, mover la ficha visualmente. Esto siendo de que el 0 no tiene div, entonces simplemente cuando sea 0, nos lo saltamos. 
    if (board[i] !== 0) {
      const tile = document.getElementById("d" + board[i]);
      tile.style.left = positionMap[i].left + "px";
      tile.style.top = positionMap[i].top + "px";
    }
  }
}

//Función para verificar si un tablero es resoluble
/*
Para verificar si un tablero es resoluble, necesitamos contar el número de inversiones. 
Una inversión ocurre cuando un número mayor está antes que un número menor en la secuencia.
Un puzzle 3X3 es resoluble si el número de inversiones es par.
Para calcular las inversiones, no consideramos el numero 0.
*/
function isSolvable(puzzle) {
  let inversions = 0;
  //Comparamos cada elemento con el que viene después
  for (let i = 0; i < 8; i++) {
    for (let j = i + 1; j < 9; j++) {
      if ((puzzle[i] != 0 && puzzle[j] != 0) && puzzle[i] > puzzle[j]) {
        inversions++;
      }
    }
  }

  return inversions % 2 === 0; //Es resoluble si el número de inversiones es par
}

//Iniciar el juego automáticamente al cargar
window.onload = function () {
  shuffle();
  restart();
};

