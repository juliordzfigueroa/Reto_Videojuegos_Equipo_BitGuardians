-- Base de datos de videojuego final hack versión actualizada
CREATE DATABASE FinalHack_Api;
USE FinalHack_Api;

-- Jugadores
CREATE TABLE Jugador(
    id_jugador INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    edad INT NOT NULL DEFAULT 18,
    email VARCHAR(100) NOT NULL UNIQUE,
    contrasena VARCHAR(100) NOT NULL,
    velocidad FLOAT NOT NULL DEFAULT 0.005,
    vida INT NOT NULL DEFAULT 100
);

CREATE TABLE Estadisticas(
    id_estadisticas INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    id_jugador INT UNSIGNED,
    enemigos_derrotados INT DEFAULT 0,
    muertes INT DEFAULT 0,
    dano_total_recibido INT DEFAULT 0,
    power_ups_utilizados INT DEFAULT 0,
    salas_completadas INT DEFAULT 0,
    jefes_derrotados INT DEFAULT 0,
    puzzles_resueltos INT DEFAULT 0,
    partidas_jugadas INT DEFAULT 0,
    partidas_ganadas INT DEFAULT 0,
    FOREIGN KEY (id_jugador) REFERENCES Jugador(id_jugador)
);
SET AUTOCOMMIT=1;
INSERT INTO Jugador VALUES
(1, 'Jugador1', 31, 'jugador1@correo.com', 'H', 3.79, 100),
(2, 'Jugador2', 27, 'jugador2@correo.com', 'H', 4.63, 67),
(3, 'Jugador3', 30, 'jugador3@correo.com', 'H', 2.83, 60),
(4, 'Jugador4', 30, 'jugador4@correo.com', 'H', 1.06, 59),
(5, 'Jugador5', 23, 'jugador5@correo.com', 'H', 1.31, 75),
(6, 'Jugador6', 20, 'jugador6@correo.com', 'H', 3.04, 67),
(7, 'Jugador7', 27, 'jugador7@correo.com', 'H', 1.2, 72),
(8, 'Jugador8', 35, 'jugador8@correo.com', 'H', 4.49, 91),
(9, 'Jugador9', 38, 'jugador9@correo.com', 'H', 2.75, 84),
(10, 'Jugador10', 24, 'jugador10@correo.com', 'H', 3.98, 81);

select * from jugador;
select * from jugador where email = 'jugador1@correo.com' and contrasena = 'H';
select * from Estadisticas where id_jugador = 2;
select * from Estadisticas;

