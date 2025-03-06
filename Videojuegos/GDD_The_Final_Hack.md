# **The Final Hack**

## _Game Design Document_

---
`Profesores`
> Web y reto **Octavio Navarro Hinojosa**

> Bases de datos, Análisis y modelación de sistemas de software **Esteban Castillo Juarez**

> Desarrollo de videojuego **Gilberto Echeverría Furió**

`TC2005B_Equipo BitGuardians`
> **Julio Cesar Rodriguez Figueroa A01029680**

> **Mateo Arminio Castro A01785572**

> **Aquiba Yudah Benarroch Bittan A01783710**

##
## _Index_

---

1. [Index](#index)
2. [Game Design](#game-design)
    1. [Summary](#summary)
    2. [Gameplay](#gameplay)
    3. [Mindset](#mindset)
3. [Technical](#technical)
    1. [Screens](#screens)
    2. [Controls](#controls)
    3. [Mechanics](#mechanics)
4. [Level Design](#level-design)
    1. [Themes](#themes)
        1. Ambience
        2. Objects
            1. Ambient
            2. Interactive
        3. Challenges
    2. [Game Flow](#game-flow)
5. [Development](#development)
    1. [Abstract Classes](#abstract-classes--components)
    2. [Derived Classes](#derived-classes--component-compositions)
6. [Graphics](#graphics)
    1. [Style Attributes](#style-attributes)
    2. [Graphics Needed](#graphics-needed)
7. [Sounds/Music](#soundsmusic)
    1. [Style Attributes](#style-attributes-1)
    2. [Sounds Needed](#sounds-needed)
    3. [Music Needed](#music-needed)
8. [Schedule](#schedule)

## _Game Design_

---

### **Summary**

¿Qué harías si el destino del mundo dependiera de un solo hacker? 
The Final Hack, un roughlite de acción, con un combate cuerpo a cuerpo similar al de Dead Cells y una vista desde arriba inspirada en The Binding of Isaac. 
Es un juego donde encarnas a un hacker de Elite con nombre clave Cipher, el encargado de infiltrarse a una base de seguridad robada por "The Core" para evitar una catástrofe mundial. 
Cada partida te sumergirá en desafiantes acertijos y un combate intenso. Además de un sistema de progresión consiguiendo objetos que pueden ser permanentes, los cuales serán de ayuda para próximas partidas. 
¿Estás listo para hackear el sistema y salvar el mundo?

### **Gameplay**

Nuestro juego tiene como caracteristica principal la vista desde arriba que se pueda controlar con el mismo teclado, pudiendo mover en las 4 direcciones. 
Cuenta tambien con combate cuerpo a cuerpo del jugador hacia los diferentes enemigos. 
En cada nivel tenemos una sala con 3 subsalas y arriba la puerta del jefe. Para que se abra la puerta del jefe se necesita completar algunas misiones de las demás salas. En cada subsala hay bots que te atacan y en caso de que logren golpearte te quitan la vida.
Asimismo, en cada subsala hay un puzzle que al resolverlo te da un power up para llegar con el jefe. Una vez llegado con el jefe si se derrota al jefe tenemos un puzzle más difícil que cuando se resuelve te da una pista para el puzzle del siguiente nivel. 
El juego acaba cuando te robas la información de The Core. 

Los elementos aleatorios son las herramientas y power ups que van saliendo. Los desafíos de cada subsala son aleatorios. Las salas se van a regenerar aleatoriamente y los enemigos también. 

En ocasiones las recompensas que puedes obtener por hacer los diferentes retos de las salas en cada nivel pueden ser permanentes (principalmente las mejoras de ataque, defensa y vida). Cuando te mueras conservas dichas mejoras permanentes que recojas a lo largo de las partidas.


### **Mindset**

Queremos que el jugador pueda sentir las siguientes cosas: 
- **Ingenio y Desafío mental:** Como hacker el jugador deberá usar su lógica y habilidad en resolución de problemas para avanzar. Esto se logrará a través de enemigos que lo atacan y puzzles que deberá resolver conforme avanza en el juego. 
- **Progresión de poder:** El jugador debe poder sentir que a medida que supera obstáculos y niveles, mejora continuamente. Asimismo, con las mejoras permanentes el jugador logrará sentirse cada vez más poderoso y con mejores habilidades. 
- **Adrenalina:** Con los diferentes enemigos y jefes del nivel queremos que la curva de dificultad aumente, creando así un efecto de adrenalina en el jugador a medida que juega. 

## _Technical_

---

### **Screens**

1. Pantalla de inicio: En la pantalla de inicio se tendrán las siguientes opciones para el jugador.
    1. Opciones: En donde se encontraran la opción de:
    
           - Revisar controles
       
           - Alternar controles (Cambiar 'WASD' y las flechas del teclado para moverse con las flechas y atacar con 'WASD')
       
           - Opciones de volúmen de la música (Quitar la música o bajar el volúmen)
       
           - Opciones de volúmen de los efectos de sonido del juego (Quitar los efectos de sonido o bajar el volúmen de estos)
       
    2. Iniciar juego: Donde al dar click en el botón metera al jugador al primer nivel del juego.
    3. *Continuar Partida: Donde el jugador podrá retomar su partida si es que no ha muerto en alguno de los niveles.
2. Juego:  Dento de la partida el jugador podrá ver la pantalla de la primera sala, a sus lados estaran las 3 subsalas y la sala del jefe. Dentro de la partida, el jugador tendrá las siguientes subpantallas:
     Aqui una foto de el concepto de la primera pantalla del juego:
![Primer concepto de The Final Hack](/Videojuegos/images/GDD/The_Final_Hack_concepto.jpg)
    1. Pausa: La cual tendra las siguientes opciones para el jugador:
           1. Botón para salir de la partida y guardarla.
           2. Opciones: Como en la pantalla de inicio se tendrán las mismas opciones en el menú de opciones.
       
               - Revisar controles
       
               - Alternar controles (Cambiar 'WASD' y las flechas del teclado para moverse con las flechas y atacar con 'WASD')
       
               - Opciones de volúmen de la música (Quitar la música o bajar el volúmen)
       
               - Opciones de volúmen de los efectos de sonido del juego (Quitar los efectos de sonido o bajar el volúmen de estos)
       
    3. Siguiente Nivel: Tras completar la sala del jefe, estará una terminal que permitrirá pasar al siguiente nivel. 
3. Tras completar el segundo nivel con una estructura similar al primero (Una sala principal, 3 subsalas adyacentes y la sala del jefe) se mostrarán los creditos.


### **Controls**

El jugador será capaz de interactuar con el juego a través del teclado. Las teclas que se usarán serán las siguientes:
Teclas WASD para el movimiento:

`W` Adelante

`S` Atras

`A` Izquierda

`D` Derecha

Las teclas de flechas son para hacer ataques en cualquier dirección ya sea ataques de pistola o ataques cuerpo a cuerpo.


El jugador tendrá la posibilidad de intercambiar las teclas entre sí. Es decir, si al jugador se le hace más fácil moverse con las teclas de flechas y atacar con las teclas WASD, será posible hacer este intercambio. Esto lo podrá realizar en las opciones de juego. 

Además de esto, utilizaremos dos teclas más:

`F` Abrir los puzzles para resolverlos.

`E` Usar los PowerUps que ha recogido el jugador.


### **Mechanics**

Are there any interesting mechanics? If so, how are you going to accomplish them? Physics, algorithms, etc.

El juego contará con una sala principal rodeada de 4 subsalas. En la parte de arriba estará la sala del jefe. Para poder acceder a ella, se tendrá que completar los retos de las 3 subsalas restantes. Estas subsalas se dividen en 3: 
- Enemigos cuerpo a cuerpo: Esta sala solamente contiene enemigos que atacan cuerpo a cuerpo.
- Enemigos cuerpo a cuerpo y a distancia: Esta sala contiene enemigos que atacan tanto cuerpo a cuerpo, como también a distancia.
- Sala de puzzle con enemigos: Una sala que contiene un puzzle a resolver y enemigos en menor cantidad que los demás cuartos. 

Existen dos tipos de enemigos:
1. Robots: Pueden ser robots que disparan o que atacan cuerpo a cuerpo. 
2. Drones: Dron que ataca con láser. 

Para poder pelear con los enemigos habrán 3 tipos de armas: 
- Pistola láser 
- Tazer
- Espada láser

Despues de completar una subsala, al jugador se le darán PowerUps que se clasifican de la siguiente manera:
1. Comunes:
    - Recuperar vida: Recuperación del 20% de vida.
    - Escudo: Se le otorga al jugador de 10% de vida.
2. Raros:
    - Aumento de vida: Aumento de vida en 20 puntos.
3. Epico:
    - Aumento de daño: Aumenta el daño en el 10 puntos.
4. Legendario: 
    - Bomba EMP: Una bomba que ature a los enemigos por 2 segundos.

Al pasar de nivel los enemigos aumentarán su vida en un 10% y el ataque en un 15%. Asimismo en las salas de puzzle, estos aumentarán de dificultado conforme se avanzan los niveles. 

## _Level Design_

---

_(Note : These sections can safely be skipped if they&#39;re not relevant, or you&#39;d rather go about it another way. For most games, at least one of them should be useful. But I&#39;ll understand if you don&#39;t want to use them. It&#39;ll only hurt my feelings a little bit.)_

### **Themes**

1. Forest
    1. Mood
        1. Dark, calm, foreboding
    2. Objects
        1. _Ambient_
            1. Fireflies
            2. Beams of moonlight
            3. Tall grass
        2. _Interactive_
            1. Wolves
            2. Goblins
            3. Rocks
2. Castle
    1. Mood
        1. Dangerous, tense, active
    2. Objects
        1. _Ambient_
            1. Rodents
            2. Torches
            3. Suits of armor
        2. _Interactive_
            1. Guards
            2. Giant rats
            3. Chests

_(example)_

### **Game Flow**

1. El jugador empieza en la sala central del nivel
2. De su lado izquierdo, derecho y abajo hay tres subsalas con desafios.
3. El jugador entra a una de las salas que tiene a sus lados.
4. El jugador completa el desafio de la subsala y es recompensado por un power-up
5. El jugador regresa a la sala principal, e ingresa a una de las salas restantes.
6. Tras completar las 3 subsalas, la puerta del jefe (encontrada en la parte de arriba de la pantalla) queda desbloqueada.
7. El jugador entra a la sala del jefe.
8. Tras derrotarlo el jugador puede pasar al siguiente nivel.
9. El siguiente nivel se plantea igual, comezando desde el punto 1.
10. Si el jugador es derrotado, el jugador empezará el juego desde el punto 1.


## _Development_

---

### **Abstract Classes / Components**

1. BasePhysics
    1. BasePlayer
    2. BaseEnemy
    3. BaseObject
2. BaseObstacle
3. BaseInteractable

_(example)_

### **Derived Classes / Component Compositions**

1. BasePlayer
    1. PlayerMain
    2. PlayerUnlockable
2. BaseEnemy
    1. EnemyWolf
    2. EnemyGoblin
    3. EnemyGuard (may drop key)
    4. EnemyGiantRat
    5. EnemyPrisoner
3. BaseObject
    1. ObjectRock (pick-up-able, throwable)
    2. ObjectChest (pick-up-able, throwable, spits gold coins with key)
    3. ObjectGoldCoin (cha-ching!)
    4. ObjectKey (pick-up-able, throwable)
4. BaseObstacle
    1. ObstacleWindow (destroyed with rock)
    2. ObstacleWall
    3. ObstacleGate (watches to see if certain buttons are pressed)
5. BaseInteractable
    1. InteractableButton

_(example)_

## _Graphics_

---

### **Style Attributes**

What kinds of colors will you be using? Do you have a limited palette to work with? A post-processed HSV map/image? Consistency is key for immersion.

What kind of graphic style are you going for? Cartoony? Pixel-y? Cute? How, specifically? Solid, thick outlines with flat hues? Non-black outlines with limited tints/shades? Emphasize smooth curvatures over sharp angles? Describe a set of general rules depicting your style here.

Well-designed feedback, both good (e.g. leveling up) and bad (e.g. being hit), are great for teaching the player how to play through trial and error, instead of scripting a lengthy tutorial. What kind of visual feedback are you going to use to let the player know they&#39;re interacting with something? That they \*can\* interact with something?

### **Graphics Needed**

1. Characters
    1. Human-like
        1. Goblin (idle, walking, throwing)
        2. Guard (idle, walking, stabbing)
        3. Prisoner (walking, running)
    2. Other
        1. Wolf (idle, walking, running)
        2. Giant Rat (idle, scurrying)
2. Blocks
    1. Dirt
    2. Dirt/Grass
    3. Stone Block
    4. Stone Bricks
    5. Tiled Floor
    6. Weathered Stone Block
    7. Weathered Stone Bricks
3. Ambient
    1. Tall Grass
    2. Rodent (idle, scurrying)
    3. Torch
    4. Armored Suit
    5. Chains (matching Weathered Stone Bricks)
    6. Blood stains (matching Weathered Stone Bricks)
4. Other
    1. Chest
    2. Door (matching Stone Bricks)
    3. Gate
    4. Button (matching Weathered Stone Bricks)

_(example)_


## _Sounds/Music_

---

### **Style Attributes**

Again, consistency is key. Define that consistency here. What kind of instruments do you want to use in your music? Any particular tempo, key? Influences, genre? Mood?

Stylistically, what kind of sound effects are you looking for? Do you want to exaggerate actions with lengthy, cartoony sounds (e.g. mario&#39;s jump), or use just enough to let the player know something happened (e.g. mega man&#39;s landing)? Going for realism? You can use the music style as a bit of a reference too.

 Remember, auditory feedback should stand out from the music and other sound effects so the player hears it well. Volume, panning, and frequency/pitch are all important aspects to consider in both music _and_ sounds - so plan accordingly!

### **Sounds Needed**

1. Effects
    1. Soft Footsteps (dirt floor)
    2. Sharper Footsteps (stone floor)
    3. Soft Landing (low vertical velocity)
    4. Hard Landing (high vertical velocity)
    5. Glass Breaking
    6. Chest Opening
    7. Door Opening
2. Feedback
    1. Relieved &quot;Ahhhh!&quot; (health)
    2. Shocked &quot;Ooomph!&quot; (attacked)
    3. Happy chime (extra life)
    4. Sad chime (died)

_(example)_

### **Music Needed**

1. Slow-paced, nerve-racking &quot;forest&quot; track
2. Exciting &quot;castle&quot; track
3. Creepy, slow &quot;dungeon&quot; track
4. Happy ending credits track
5. Rick Astley&#39;s hit #1 single &quot;Never Gonna Give You Up&quot;

_(example)_


## _Schedule_

---

_(define the main activities and the expected dates when they should be finished. This is only a reference, and can change as the project is developed)_

1. develop base classes
    1. base entity
        1. base player
        2. base enemy
        3. base block
  2. base app state
        1. game world
        2. menu world
2. develop player and basic block classes
    1. physics / collisions
3. find some smooth controls/physics
4. develop other derived classes
    1. blocks
        1. moving
        2. falling
        3. breaking
        4. cloud
    2. enemies
        1. soldier
        2. rat
        3. etc.
5. design levels
    1. introduce motion/jumping
    2. introduce throwing
    3. mind the pacing, let the player play between lessons
6. design sounds
7. design music

_(example)_
