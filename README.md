# Reto_Videojuegos_Equipo_BitGuardians
Repositorio de Git en donde se llevará acabo el desarrollo del videojuego.

## ¿Cómo jugar The Final Hack en la web?

Para poder jugar a The Final Hack es necesario acceder al Directorio Videojuegos, después al directorio VideojuegoJS, por último, descargar la carpeta Juego, En esta carpeta se incluyen los assets, archivos HTML, archivos JS y archivos CSS usados en la creación del prototipo. Una vez tengas la carpeta desacrgada, para abrir la página principal del juego es necesario abrir el directorio HTML para poder abrir indezx.html (definir aqui el archivo final donde se mostrará el prototipo).

# Funcionalidades Terminadas

## ¿Cómo se juega The Final Hack?

Principalemnte tenemos las siguientes teclas de acción:

El jugador será capaz de interactuar con el juego a través del teclado. Las teclas que se usarán serán las siguientes:
Teclas WASD para el movimiento en la pantalla:

`W` Adelante

`S` Atras

`A` Izquierda

`D` Derecha

Las teclas de flechas son para hacer ataques en cualquier dirección ya sea ataques de pistola o ataques cuerpo a cuerpo con la espada o el táser.

El jugador tendrá la posibilidad de intercambiar las teclas entre sí. Es decir, si al jugador se le hace más fácil moverse con las teclas de flechas y atacar con
las teclas WASD, será posible hacer este intercambio. Esto lo podrá realizar en las opciones de juego. 

Además de esto, utilizaremos dos teclas más:

`F` Abrir los puzzles para resolverlos.

`E` Usar los Power Ups que ha recogido el jugador.

Para poder acceder a la sala del jefe se deberá completar los desafíos de los cuartos adyacentes, en este prototipo, estan definidos los diferentes tipos de cuartos, el cuarto con enemigos cuerpo a cuerpo, el cuarto con ambos tipos de enemigos (cuerpo a cuerpo y a distancia) y el cuarto con enemigos y puzzle. Tras completar cada sala el jugador será recompensado con un powerup de la siguiente lista. 

1. **Comunes** (40% de aparición):
    - Recuperar vida: Recuperación del 20% de vida.
    - Escudo: Se le otorga al jugador un 10% de vida.
2. **Raros** (30% de aparición):
    - Aumento de vida: Aumentó de vida en 20 puntos.
3. **Épico** (20% de aparición):
    - Armas 

## Salas:

El jugador al entrar a cada tipo de sala se encontrará con los retos ya establecidos en el tipo de sala:

### Sala con Enemigos Cuerpo a Cuerpo

En esta sala contará con 4 enemigos cuerpo a cuerpo, los cuales contarán con las siguientes estadisticas: 

|Enemigo|Vida|Daño|Alcance|**Velocidad**|
|-------|----|-------|------|------|
|Robot|100|10|1|2|

### Sala con Enemigos a distancia
En esta sala contará con 4 enemigos, estos pueden ser cuerpo a cuerpo o a distancia, los cuales contarán con las siguientes estadisticas: 

|Enemigo|Vida|Daño|Alcance|**Velocidad**|
|-------|----|-------|------|------|
|Dron|50|20|Infinito|2.5| ** Valor por ajustar

### Sala con enemigos y puzzle

Al igual que las anteriores, esta contara con 4 enemigos, y un puzzle, los enemigos podrán ser a distancia o cuerpo a cuerpo y el puzzle será definido aleatoriamente cada que se reinicie.

### Sala del Boss
|Enemigo|Vida|Daño|Alcance|**Velocidad**|
|-------|----|-------|------|------|
|Robot|200|20|1|3|

Esta sala únicamente se abrirá cuando las demás hayan sido completadas. 

## Mécanicas y funcionalidades por terminar que están en desarrollo

En cuanto a las mecanicas pendientes por desarrollar, están:

- La hitbox de ataque del táser con el cambio de estado a los enemigos
- Prueba del powerUp EMP para aturdir a los enemigos y cambiarlos de estado
