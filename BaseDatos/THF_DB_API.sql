-- Base de datos de videojuego final hack versión actualizada
CREATE DATABASE FinalHack_Api;
USE FinalHack_Api;

-- Jugadores
CREATE TABLE Jugador(
    id_jugador INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    edad INT NOT NULL DEFAULT 18,
    email VARCHAR(100) NOT NULL,
    contrasena VARCHAR(100) NOT NULL,
	pos_x INT NOT NULL DEFAULT 13,
    pos_y INT NOT NULL DEFAULT 7,
    velocidad FLOAT NOT NULL DEFAULT 0.005,
    vida INT NOT NULL DEFAULT 100
);

