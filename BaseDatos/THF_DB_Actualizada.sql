-- Base de datos de videojuego final hack versión actualizada
-- CREATE DATABASE FinalHack_Actualizada;
USE FinalHack_Actualizada;

-- Armas
CREATE TABLE Arma(
    id_arma INT PRIMARY KEY,
    tipo VARCHAR(50) NOT NULL,
	prob_aparicion FLOAT NOT NULL,
    dano INT NOT NULL,
    alcance INT NOT NULL
);

-- Jugadores
CREATE TABLE Jugador(
    id_jugador INT PRIMARY KEY,
	id_arma_actual INT NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    edad INT NOT NULL,
    email VARCHAR(100) NOT NULL,
	pos_x INT NOT NULL,
    pos_y INT NOT NULL,
    velocidad FLOAT NOT NULL,
    vida INT NOT NULL,
	FOREIGN KEY (id_arma_actual) REFERENCES Arma(id_arma)
);

-- stadísticas por Jugador
CREATE TABLE Estadisticas(
    id_estadisticas INT PRIMARY KEY,
    id_jugador INT UNIQUE NOT NULL,
    enemigos_derrotados INT DEFAULT 0,
    muertes INT DEFAULT 0,
    dano_total_recibido INT DEFAULT 0,
    power_ups_utilizados INT DEFAULT 0,
    salas_completadas INT DEFAULT 0,
    jefes_derrotados INT DEFAULT 0,
    puzzles_resueltos INT DEFAULT 0,
    arma_favorita VARCHAR(20) NOT NULL,
    FOREIGN KEY (id_jugador) REFERENCES Jugador(id_jugador)
);

-- Enemigos
CREATE TABLE Enemigo(
    id_enemigo INT PRIMARY KEY,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('Robot', 'Dron', 'Jefe')),
    vida INT NOT NULL,
    dano_ataque INT NOT NULL,
    alcance INT NOT NULL,
    velocidad FLOAT NOT NULL,
    pos_x INT NOT NULL,
    pos_y INT NOT NULL
);

-- Puzzle, se modifico la tabla para especificar en que consiste. El puzzle se encuentra en una computadora,
-- por lo que las variables de posición hacen referencia a la posición de la computadora en la sala. Se agregó
-- una descripción para que se de a entender mejor.
CREATE TABLE Puzzle(
    id_puzzle INT PRIMARY KEY,
    tiempo_limite TIME NOT NULL,
    tiempo_resuelto TIME,
	pos_computadora_puzzle_x_sala INT NOT NULL,  
    pos_computadora_puzzle_y_sala INT NOT NULL,
    descripcion TEXT NOT NULL 
);

-- Power-Ups, solo se permite obtener un powerUp por sala
CREATE TABLE PowerUp(
    id_powerup INT PRIMARY KEY,
    tipo VARCHAR(50) NOT NULL,
    rareza VARCHAR(20) NOT NULL,
    probabilidad FLOAT NOT NULL
);

-- Tabla de Salas, se especifíca para que son los tipos y el estatus de la sala
CREATE TABLE Sala(
    id_sala INT PRIMARY KEY,
    id_enemigo INT NOT NULL,
    id_puzzle INT NOT NULL,
    id_power_up_recompensa INT NOT NULL,
    tipo1 VARCHAR(20) NOT NULL CHECK (tipo1 IN ('inicio', 'subsala', 'jefe')),
	tipo2 VARCHAR(20) NOT NULL CHECK (tipo2 IN ('puzzle', 'dron', 'robot')),
    estatus VARCHAR(20) NOT NULL CHECK (estatus IN ('completa', 'incompleta')),
    FOREIGN KEY (id_enemigo) REFERENCES Enemigo(id_enemigo),
    FOREIGN KEY (id_puzzle) REFERENCES Puzzle(id_puzzle),
    FOREIGN KEY (id_power_up_recompensa) REFERENCES PowerUp(id_powerup)
);

-- Partidas
CREATE TABLE Partida(
    id_partida INT PRIMARY KEY,
    tiempo_total TIME NOT NULL,
    fecha_creacion DATETIME NOT NULL DEFAULT NOW(),
    estatus VARCHAR(20) NOT NULL CHECK (estatus IN ('En progreso', 'Finalizado'))
);

-- NiveL
CREATE TABLE Nivel(
    id_nivel INT PRIMARY KEY,
    id_sala_actual INT NOT NULL,
	FOREIGN KEY (id_sala_actual) REFERENCES Sala(id_sala)
);

-- Progreso de Partida
CREATE TABLE Partida_Progreso(
	id_partida INT NOT NULL,
    id_progreso INT PRIMARY KEY,
    id_nivel_actual INT NOT NULL,
    -- nombre_partida VARCHAR(50) NOT NULL,
    ultima_actualizacion DATETIME NOT NULL,
    tiempo_en_partida TIME NOT NULL,
    estatus_jugador VARCHAR(20) NOT NULL DEFAULT 'activo' CHECK (estatus_jugador IN ('activo', 'muerto', 'pausa')),
    FOREIGN KEY (id_partida) REFERENCES Partida(id_partida),
    FOREIGN KEY (id_nivel_actual) REFERENCES Nivel(id_nivel)
);

-- Estadísticas del juego, se creó esta tabla para que no solo existan estadísticas a nivel de jugador
-- si no también a nivel de juego
CREATE TABLE Estadisticas_Juego(
    id_estadisticas_juego INT PRIMARY KEY,
    id_jugador INT UNIQUE NOT NULL,
    tiempo_jugado TIME DEFAULT '00:00:00',
    partidas_jugadas INT DEFAULT 0,
    partidas_ganadas INT DEFAULT 0,
    partidas_perdidas INT DEFAULT 0,
    FOREIGN KEY (id_jugador) REFERENCES Jugador(id_jugador)
);

select * from finalhack_actualizada.jugador;
