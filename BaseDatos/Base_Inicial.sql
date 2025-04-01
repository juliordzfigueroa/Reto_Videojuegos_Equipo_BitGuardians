-- Base de datos de videojuego final hack
-- CREATE DATABASE FinalHack_Inicial;
USE FinalHack_Inicial;

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

-- Puzzle
CREATE TABLE Puzzle(
    id_puzzle INT PRIMARY KEY,
    tiempo_limite TIME NOT NULL,
    tiempo_resuelto TIME,
	pos_x_sala INT NOT NULL,  
    pos_y_sala INT NOT NULL
);

-- Power-Ups
CREATE TABLE PowerUp(
    id_powerup INT PRIMARY KEY,
    tipo VARCHAR(50) NOT NULL,
    rareza VARCHAR(20) NOT NULL,
    probabilidad FLOAT NOT NULL
);

-- Tabla de Salas
CREATE TABLE Sala(
    id_sala INT PRIMARY KEY,
    id_enemigo INT NOT NULL,
    id_puzzle INT NOT NULL,
    id_power_up_recompensa INT NOT NULL,
    tipo1 VARCHAR(50),
    tipo2 varchar(50),
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
    nombre_partida VARCHAR(50) NOT NULL,
    ultima_actualizacion DATETIME NOT NULL,
    tiempo_en_partida TIME NOT NULL,
    estatus_jugador VARCHAR(20) NOT NULL DEFAULT 'activo' CHECK (estatus_jugador IN ('activo', 'muerto', 'pausa')),
    FOREIGN KEY (id_partida) REFERENCES Partida(id_partida),
    FOREIGN KEY (id_nivel_actual) REFERENCES Nivel(id_nivel)
);


INSERT INTO Arma VALUES
(1, 'Espada Láser', 0.3, 25, 1),
(2, 'Taser', 0.2, 15, 2),
(3, 'Pistola Láser', 0.25, 20, 4),
(4, 'Bastón Eléctrico', 0.1, 30, 1),
(5, 'Guantes EMP', 0.05, 10, 1),
(6, 'Bomba de Pulso', 0.05, 40, 3),
(7, 'Shuriken Digital', 0.15, 18, 5),
(8, 'Rayo Cortante', 0.1, 28, 3),
(9, 'Granada de Humo', 0.2, 5, 2),
(10, 'Espina Cibernética', 0.05, 35, 2);

INSERT INTO Jugador VALUES
(1, 1, 'NeoX', 21, 'neox@correo.com', 5, 5, 1.2, 100),
(2, 2, 'ByteSlayer', 19, 'byte@correo.com', 10, 3, 1.0, 90),
(3, 3, 'Glitch', 23, 'glitch@correo.com', 7, 6, 1.1, 80),
(4, 4, 'RootKit', 18, 'root@correo.com', 2, 8, 1.3, 95),
(5, 5, 'CyberZen', 22, 'zen@correo.com', 4, 4, 0.9, 85),
(6, 6, 'Phantom', 24, 'phantom@correo.com', 8, 2, 1.5, 70),
(7, 7, 'GhostHack', 20, 'ghost@correo.com', 6, 1, 1.0, 75),
(8, 8, 'ZeroOne', 25, 'zero@correo.com', 3, 9, 1.4, 65),
(9, 9, 'Terminal', 22, 'term@correo.com', 0, 0, 1.0, 88),
(10, 10, 'BitCrush', 26, 'bit@correo.com', 1, 3, 1.2, 92);

INSERT INTO Estadisticas VALUES
(1, 1, 50, 3, 120, 5, 10, 1, 2, 'Espada Láser'),
(2, 2, 30, 5, 200, 3, 7, 0, 1, 'Taser'),
(3, 3, 40, 2, 100, 6, 9, 2, 2, 'Pistola Láser'),
(4, 4, 20, 4, 150, 2, 5, 1, 1, 'Bastón Eléctrico'),
(5, 5, 55, 1, 90, 4, 11, 3, 3, 'Guantes EMP'),
(6, 6, 15, 6, 250, 1, 4, 0, 0, 'Bomba de Pulso'),
(7, 7, 60, 2, 110, 5, 12, 4, 2, 'Shuriken Digital'),
(8, 8, 45, 3, 130, 3, 8, 1, 1, 'Rayo Cortante'),
(9, 9, 70, 0, 80, 6, 13, 2, 2, 'Granada de Humo'),
(10, 10, 35, 4, 160, 2, 6, 0, 1, 'Espina Cibernética');

INSERT INTO Enemigo VALUES
(1, 'Robot', 50, 10, 2, 0.8, 5, 5),
(2, 'Dron', 30, 5, 4, 1.5, 6, 4),
(3, 'Jefe', 150, 25, 5, 0.5, 7, 7),
(4, 'Robot', 40, 8, 3, 1.0, 3, 2),
(5, 'Dron', 25, 6, 2, 1.8, 2, 3),
(6, 'Jefe', 200, 30, 6, 0.4, 8, 8),
(7, 'Robot', 35, 7, 2, 0.9, 1, 1),
(8, 'Dron', 28, 5, 3, 1.3, 4, 6),
(9, 'Robot', 45, 9, 3, 1.1, 9, 0),
(10, 'Jefe', 180, 27, 5, 0.6, 10, 10);

INSERT INTO Puzzle VALUES
(1, '00:02:00', NULL, 1, 1),
(2, '00:01:30', '00:01:10', 2, 2),
(3, '00:03:00', NULL, 3, 3),
(4, '00:02:30', '00:02:00', 4, 4),
(5, '00:04:00', NULL, 5, 5),
(6, '00:01:45', '00:01:40', 6, 6),
(7, '00:02:15', NULL, 7, 7),
(8, '00:01:20', '00:01:10', 8, 8),
(9, '00:03:30', NULL, 9, 9),
(10, '00:02:45', '00:02:30', 10, 10);

INSERT INTO PowerUp VALUES
(1, 'Recuperar vida', 'común', 0.3),
(2, 'Escudo', 'raro', 0.2),
(3, 'Aumento vida máxima', 'épico', 0.1),
(4, 'Espada láser', 'raro', 0.15),
(5, 'Taser', 'raro', 0.12),
(6, 'Pistola láser', 'épico', 0.08),
(7, 'Bomba EMP', 'épico', 0.05),
(8, 'Regeneración', 'legendario', 0.03),
(9, 'Invisibilidad', 'legendario', 0.01),
(10, 'Velocidad x2', 'raro', 0.25);

INSERT INTO Sala VALUES
(1, 1, 1, 1, 'Combate', 'Puzzle', 'incompleta'),
(2, 2, 2, 2, 'Puzzle', NULL, 'completa'),
(3, 3, 3, 3, 'Jefe', 'Combate', 'incompleta'),
(4, 4, 4, 4, 'Combate', NULL, 'completa'),
(5, 5, 5, 5, 'Puzzle', 'Exploración', 'incompleta'),
(6, 6, 6, 6, 'Jefe', 'Puzzle', 'completa'),
(7, 7, 7, 7, 'Exploración', NULL, 'incompleta'),
(8, 8, 8, 8, 'Combate', 'Jefe', 'completa'),
(9, 9, 9, 9, 'Puzzle', 'Combate', 'incompleta'),
(10, 10, 10, 10, 'Jefe', 'Exploración', 'completa');

INSERT INTO Partida VALUES
(1, '00:25:00', '2025-04-01 10:00:00', 'En progreso'),
(2, '00:35:00', '2025-04-01 11:00:00', 'Finalizado'),
(3, '00:40:00', '2025-04-01 12:00:00', 'En progreso'),
(4, '00:20:00', '2025-04-01 13:00:00', 'Finalizado'),
(5, '00:50:00', '2025-04-01 14:00:00', 'En progreso'),
(6, '00:15:00', '2025-04-01 15:00:00', 'En progreso'),
(7, '00:30:00', '2025-04-01 16:00:00', 'Finalizado'),
(8, '00:22:00', '2025-04-01 17:00:00', 'En progreso'),
(9, '00:18:00', '2025-04-01 18:00:00', 'Finalizado'),
(10, '00:27:00', '2025-04-01 19:00:00', 'En progreso');

INSERT INTO Nivel VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(6, 6),
(7, 7),
(8, 8),
(9, 9),
(10, 10);

INSERT INTO Partida_Progreso VALUES
(1, 1, 1, 'Hack1', '2025-04-01 10:30:00', '00:15:00', 'activo'),
(2, 2, 2, 'Hack2', '2025-04-01 11:20:00', '00:20:00', 'muerto'),
(3, 3, 3, 'Hack3', '2025-04-01 12:50:00', '00:35:00', 'activo'),
(4, 4, 4, 'Hack4', '2025-04-01 13:10:00', '00:10:00', 'pausa'),
(5, 5, 5, 'Hack5', '2025-04-01 14:40:00', '00:40:00', 'activo'),
(6, 6, 6, 'Hack6', '2025-04-01 15:20:00', '00:05:00', 'muerto'),
(7, 7, 7, 'Hack7', '2025-04-01 16:30:00', '00:25:00', 'activo'),
(8, 8, 8, 'Hack8', '2025-04-01 17:50:00', '00:18:00', 'activo'),
(9, 9, 9, 'Hack9', '2025-04-01 18:10:00', '00:12:00', 'pausa'),
(10, 10, 10, 'Hack10', '2025-04-01 19:25:00', '00:22:00', 'activo');



