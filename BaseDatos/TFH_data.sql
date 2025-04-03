-- Base de datos de videojuego final hack versión actualizada
-- Datos Dummy para The Final Hack

USE FinalHack_Actualizada;

SET AUTOCOMMIT=0;
INSERT INTO Arma VALUES
(1, 'Tipo1', 0.94, 53, 1),
(2, 'Tipo2', 0.78, 48, 3),
(3, 'Tipo3', 0.73, 76, 4),
(4, 'Tipo4', 0.31, 82, 6),
(5, 'Tipo5', 0.56, 20, 7),
(6, 'Tipo6', 0.49, 26, 7),
(7, 'Tipo7', 0.24, 42, 2),
(8, 'Tipo8', 0.26, 24, 6),
(9, 'Tipo9', 0.16, 61, 10),
(10, 'Tipo10', 0.97, 46, 2);

SET AUTOCOMMIT=0;
INSERT INTO Jugador VALUES
(1, 6, 'Jugador1', 31, 'jugador1@correo.com', 52, 93, 3.79, 100),
(2, 16, 'Jugador2', 27, 'jugador2@correo.com', 54, 66, 4.63, 67),
(3, 6, 'Jugador3', 30, 'jugador3@correo.com', 42, 51, 2.83, 60),
(4, 4, 'Jugador4', 30, 'jugador4@correo.com', 3, 68, 1.06, 59),
(5, 1, 'Jugador5', 23, 'jugador5@correo.com', 73, 5, 1.31, 75),
(6, 5, 'Jugador6', 20, 'jugador6@correo.com', 47, 47, 3.04, 67),
(7, 18, 'Jugador7', 27, 'jugador7@correo.com', 4, 79, 1.2, 72),
(8, 20, 'Jugador8', 35, 'jugador8@correo.com', 34, 10, 4.49, 91),
(9, 17, 'Jugador9', 38, 'jugador9@correo.com', 84, 64, 2.75, 84),
(10, 13, 'Jugador10', 24, 'jugador10@correo.com', 31, 87, 3.98, 81);

SET AUTOCOMMIT=0;
INSERT INTO Estadisticas VALUES
(1, 1, 42, 9, 290, 8, 10, 2, 0, 'Tipo9'),
(2, 2, 90, 0, 26, 6, 6, 3, 0, 'Tipo18'),
(3, 3, 49, 6, 180, 20, 5, 4, 12, 'Tipo14'),
(4, 4, 60, 2, 202, 13, 10, 4, 12, 'Tipo18'),
(5, 5, 16, 8, 279, 10, 1, 1, 10, 'Tipo1'),
(6, 6, 67, 1, 296, 0, 9, 2, 3, 'Tipo2'),
(7, 7, 42, 9, 150, 19, 6, 4, 14, 'Tipo18'),
(8, 8, 67, 1, 77, 11, 10, 4, 3, 'Tipo10'),
(9, 9, 16, 2, 85, 14, 4, 1, 12, 'Tipo20'),
(10, 10, 5, 9, 93, 15, 3, 5, 8, 'Tipo19');

SET AUTOCOMMIT=0;
INSERT INTO Enemigo VALUES
(1, 'Jefe', 198, 29, 2, 2.81, 7, 8),
(2, 'Jefe', 121, 23, 3, 0.77, 83, 14),
(3, 'Dron', 46, 11, 10, 2.84, 33, 6),
(4, 'Jefe', 153, 29, 8, 1.97, 11, 42),
(5, 'Dron', 149, 9, 8, 1.36, 37, 6),
(6, 'Robot', 125, 22, 4, 2.9, 93, 3),
(7, 'Robot', 189, 24, 3, 1.43, 28, 25),
(8, 'Dron', 188, 9, 10, 2.55, 61, 21),
(9, 'Dron', 157, 13, 1, 2.7, 42, 15),
(10, 'Dron', 144, 11, 8, 2.42, 60, 16);

SET AUTOCOMMIT=0;
INSERT INTO Puzzle VALUES
(1, '01:43:29', NULL, 10, 6, 'Puzzle 1 para hackear consola'),
(2, '00:19:05', NULL, 4, 0, 'Puzzle 2 para hackear consola'),
(3, '02:18:00', NULL, 6, 10, 'Puzzle 3 para hackear consola'),
(4, '00:19:59', NULL, 4, 7, 'Puzzle 4 para hackear consola'),
(5, '00:53:52', NULL, 1, 3, 'Puzzle 5 para hackear consola'),
(6, '01:48:49', NULL, 8, 1, 'Puzzle 6 para hackear consola'),
(7, '02:31:11', NULL, 5, 7, 'Puzzle 7 para hackear consola'),
(8, '01:38:01', NULL, 7, 10, 'Puzzle 8 para hackear consola'),
(9, '02:54:17', NULL, 10, 7, 'Puzzle 9 para hackear consola'),
(10, '02:25:36', NULL, 4, 4, 'Puzzle 10 para hackear consola');

SET AUTOCOMMIT=0;
INSERT INTO PowerUp VALUES
(1, 'TipoPower1', 'épico', 0.33),
(2, 'TipoPower2', 'épico', 0.52),
(3, 'TipoPower3', 'épico', 0.94),
(4, 'TipoPower4', 'raro', 0.76),
(5, 'TipoPower5', 'raro', 0.50),
(6, 'TipoPower6', 'épico', 0.72),
(7, 'TipoPower7', 'épico', 0.35),
(8, 'TipoPower8', 'común', 0.51),
(9, 'TipoPower9', 'épico', 0.58),
(10, 'TipoPower10', 'raro', 0.86);

SET AUTOCOMMIT=0;
INSERT INTO Sala VALUES
(1, 3, 3, 6, 'jefe', 'robot', 'incompleta'),
(2, 4, 5, 4, 'inicio', 'dron', 'completa'),
(3, 1, 5, 2, 'subsala', 'puzzle', 'incompleta'),
(4, 2, 9, 4, 'subsala', 'dron', 'completa'),
(5, 1, 8, 6, 'jefe', 'dron', 'incompleta'),
(6, 3, 9, 7, 'subsala', 'puzzle', 'incompleta'),
(7, 2, 4, 4, 'subsala', 'dron', 'completa'),
(8, 6, 1, 9, 'inicio', 'robot', 'incompleta'),
(9, 10, 1, 9, 'jefe', 'robot', 'incompleta'),
(10, 9, 6, 10, 'subsala', 'puzzle', 'incompleta');

SET AUTOCOMMIT=0;
INSERT INTO Partida VALUES
(1, '00:14:10', '2023-09-01 02:03:43', 'En progreso'),
(2, '02:28:51', '2023-12-01 10:20:54', 'En progreso'),
(3, '02:01:41', '2024-03-02 10:04:13', 'Finalizado'),
(4, '02:42:12', '2024-05-24 13:56:24', 'Finalizado'),
(5, '00:16:54', '2023-07-01 23:35:14', 'Finalizado'),
(6, '01:44:00', '2024-03-13 12:02:09', 'Finalizado'),
(7, '00:58:01', '2023-08-21 02:24:55', 'En progreso'),
(8, '00:51:28', '2024-11-07 13:21:49', 'En progreso'),
(9, '02:15:25', '2024-05-18 22:59:00', 'En progreso'),
(10, '02:50:59', '2023-09-07 21:37:31', 'En progreso');


SET AUTOCOMMIT=0;
INSERT INTO Nivel VALUES
(1, 1),
(2, 10),
(3, 5),
(4, 5),
(5, 6),
(6, 5),
(7, 4),
(8, 1),
(9, 10),
(10, 9);

SET AUTOCOMMIT=0;
INSERT INTO Partida_Progreso VALUES
(6, 1, 4, '2023-06-19 09:11:57', '00:39:40', 'activo'),
(8, 2, 2, '2024-06-04 15:15:43', '00:58:13', 'pausa'),
(6, 3, 6, '2024-05-28 10:45:59', '01:20:06', 'activo'),
(2, 4, 6, '2024-11-22 21:10:31', '00:47:58', 'muerto'),
(5, 5, 3, '2024-01-10 04:53:03', '02:46:19', 'muerto'),
(2, 6, 5, '2024-07-23 15:50:04', '01:48:04', 'muerto'),
(4, 7, 1, '2024-12-10 22:11:05', '01:09:03', 'pausa'),
(8, 8, 4, '2024-04-22 15:42:17', '01:27:36', 'muerto'),
(10, 9, 5, '2024-04-29 10:13:55', '00:11:21', 'muerto'),
(4, 10, 8, '2023-07-19 10:52:14', '02:49:43', 'muerto');

SET AUTOCOMMIT=0;
INSERT INTO Estadisticas_Juego VALUES
(1, 1, '01:23:40', 5, 2, 7),
(2, 2, '00:11:47', 6, 10, 4),
(3, 3, '01:28:06', 17, 4, 1),
(4, 4, '00:12:31', 20, 5, 8),
(5, 5, '01:39:14', 27, 1, 6),
(6, 6, '00:04:07', 22, 20, 6),
(7, 7, '02:31:18', 13, 11, 6),
(8, 8, '00:17:36', 5, 6, 9),
(9, 9, '01:59:06', 15, 0, 7),
(10, 10, '00:30:42', 14, 13, 5);