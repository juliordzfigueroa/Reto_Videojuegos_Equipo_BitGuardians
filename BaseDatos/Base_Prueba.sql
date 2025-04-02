-- Base de datos 
CREATE DATABASE FinalHack;
USE FinalHack;

-- Tabla de Jugadores
CREATE TABLE Jugador(
    id_jugador INT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    edad INT NOT NULL,
    email VARCHAR(100) NOT NULL,
    vida INT NOT NULL,
    velocidad FLOAT NOT NULL,
    pos_x INT NOT NULL,
    pos_y INT NOT NULL,
    id_arma_actual INT NOT NULL
);

-- Tabla de Armas
CREATE TABLE Arma(
    id_arma INT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    daño INT NOT NULL,
    alcance INT NOT NULL,
    prob_aparicion FLOAT NOT NULL
);

-- Tabla de Power-Ups
CREATE TABLE PowerUp(
    id_powerup INT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    rareza VARCHAR(20) NOT NULL,
    probabilidad FLOAT NOT NULL,
    pos_x_sala INT NOT NULL,  
    pos_y_sala INT NOT NULL   
);

-- Tabla de Estadísticas por Jugador
CREATE TABLE Estadisticas(
    id_estadisticas INT PRIMARY KEY,
    id_jugador INT UNIQUE NOT NULL,
    enemigos_derrotados INT DEFAULT 0,
    puzzles_resueltos INT DEFAULT 0,
    salas_completadas INT DEFAULT 0,
    tiempo_total TIME DEFAULT '00:00:00',
    total_partidas INT DEFAULT 0,
    partidas_finalizadas INT DEFAULT 0,
    FOREIGN KEY (id_jugador) REFERENCES Jugador(id_jugador)
);

-- Tabla de Partidas
CREATE TABLE Partida(
    id_partida INT PRIMARY KEY,
    id_jugador INT NOT NULL,
    tiempo_total TIME NOT NULL,
    fecha_creacion DATETIME NOT NULL DEFAULT NOW(),
    estatus VARCHAR(20) NOT NULL CHECK (estatus IN ('En progreso', 'Finalizado')),
    FOREIGN KEY (id_jugador) REFERENCES Jugador(id_jugador)
);

-- Tabla de Puzzle
CREATE TABLE Puzzle(
    id_puzzle INT PRIMARY KEY,
    pos_x_sala INT NOT NULL,  
    pos_y_sala INT NOT NULL,
    tiempo_limite TIME NOT NULL,
    tiempo_resuelto TIME,
	estatus VARCHAR(20) NOT NULL DEFAULT 'no_completado' CHECK (estatus IN ('completado', 'no_completado'))
);

-- Tabla de Niveles
CREATE TABLE Nivel(
    id_nivel INT PRIMARY KEY,
    dificultad INT NOT NULL,
	sala_actual INT NOT NULL
);

-- Tabla de Salas
CREATE TABLE Sala(
    id_sala INT PRIMARY KEY,
    id_nivel INT NOT NULL,
    tipo_sala VARCHAR(20) NOT NULL CHECK (tipo_sala IN ('inicio', 'jefe', 'subsala')),
    tipo_subsala VARCHAR(50),  
    estatus VARCHAR(20) NOT NULL CHECK (estatus IN ('completa', 'incompleta')),
    id_puzzle INT,
    id_powerup INT, 
    id_arma INT,    
    FOREIGN KEY (id_nivel) REFERENCES Nivel(id_nivel),
    FOREIGN KEY (id_puzzle) REFERENCES Puzzle(id_puzzle),
    FOREIGN KEY (id_powerup) REFERENCES PowerUp(id_powerup),
    FOREIGN KEY (id_arma) REFERENCES Arma(id_arma)
);

-- Tabla de Progreso de Partida (estado guardado)
CREATE TABLE Partida_Progreso(
    id_progreso INT PRIMARY KEY,
    id_partida INT NOT NULL,
    id_nivel_actual INT NOT NULL,
    tiempo_en_partida TIME NOT NULL,
    ultima_actualizacion DATETIME NOT NULL,
    estatus_jugador VARCHAR(20) NOT NULL DEFAULT 'activo' CHECK (estatus_jugador IN ('activo', 'muerto', 'pausa')),
    FOREIGN KEY (id_partida) REFERENCES Partida(id_partida),
    FOREIGN KEY (id_nivel_actual) REFERENCES Nivel(id_nivel)
);

-- Tabla de Enemigos
CREATE TABLE Enemigo(
    id_enemigo INT PRIMARY KEY,
    id_sala INT NOT NULL,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('Robot', 'Dron', 'Jefe')),
    vida INT NOT NULL,
    ataque INT NOT NULL,
    alcance INT NOT NULL,
    FOREIGN KEY (id_sala) REFERENCES Sala(id_sala)
);
