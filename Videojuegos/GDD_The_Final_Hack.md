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
- **Presión:** Los puzzles tendrán tiempos limites para resolverlos. Creando así presión sobre el jugador para que los resuelva de la manera más rápida posible. 

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

El objetivo principal del juego es que el jugador pueda recuperar la información robada por "The Core". Esto lo hace a tráves de completar los diferentes desafíos de los niveles del juego. Una vez que los completa, gana el juego. El juegador siempre tiene la oportunidad de mejorar en términos de estadística. 
Se quiere que el jugador pueda enfrentarse a niveles que lo pongan a prueba sus habilidades tanto de combate con los diferentes tipos de enemigos, y además sus habilidades intelectuales con los puzzles. 

El juego contará con una sala principal rodeada de 4 subsalas. En la parte de arriba estará la sala del jefe. Para poder acceder a ella, se tendrá que completar los retos de las 3 subsalas restantes. Estas subsalas se dividen en 3: 
- Enemigos cuerpo a cuerpo: Esta sala solamente contiene enemigos que atacan cuerpo a cuerpo.
- Enemigos cuerpo a cuerpo y a distancia: Esta sala contiene enemigos que atacan tanto cuerpo a cuerpo, como también a distancia.
- Sala de puzzle con enemigos: Una sala que contiene un puzzle a resolver y enemigos en menor cantidad que los demás cuartos. 
Además de esto, el jugador es capaz de interactuar con las el entorno de las salas. Es decir, habrán salas donde hay obstaculos que el jugador también puede usar como pared de escudo. Los enemigos no pueden pasar por sobre estos obstáculos o paredes. 

Existen dos tipos de enemigos:
1. Robots:
    - Cuerpo a cuerpo: Estos robots que atacan cuerpo a cuerpo tendrán tendrán más vida que los robots a distancia, sin embargo, tendrán menos daño. 
    - Distancia: Los robots que atacan a distancia tienen más daño que los robots cuerpo a cuerpo, pero menos vida. 
2. Drones: Dron que ataca con láser. Este dron se encontrará con valores balanceados. Es decir, tendrá más de vida que el robot a distancia, y más de daño que el robot cuerpo a cuerpo.  

Estos enemigos su único objetivo es derrotar al jugador, por lo que su comportamiento siempre será agresivo contra el jugador. Con los enemigos solo hay dos opciones:
1. Los derrotas
2. Te derrotan. Es crucial que todos los enemigos esten derrotados, debido a que si no los derrotas a todos, entonces la sala del jefe nunca se abre. 

Para poder pelear con los enemigos habrán 3 tipos de armas: 
- Pistola láser: pistola que dispara proyectiles con velocidad definida. Esta pistola hará menos daño que el tazer. 
- Tazer: Arma de corto alcance que aturde a los enemigos por un tiempo breve. El tazer estará en un nivel balanceado con respecto al daño de la pistola láser y la espada. 
- Espada láser: Para golpes de cuerpo a cuerpo. La espada hará más daño que el tazer. 

El puzzle será de tipo lógicos. Van a funcionar de la siguiente manera:
- Slide puzzle, donde el jugador tendrá que ordenar una matriz de imagenes en el orden correcto. 
- Puzzle es dinámico, lo que significa que se genera aleatoriamente y cada nivel sube la dificultad. Esto al poner más imágenes en la matriz. 
- Tendrán un tiempo limite para resolverlo. 
- En caso de que el jugador no logre resolver el puzzle, sale del puzzle y tiene que enfrentar más enemigos. 
- Una vez hecho esto, puede volver a intentar resolver el puzzle. 
- Cada nivel el tiempo se hace menor para aumentar la dificultad y la presión. 

Despues de completar una subsala, al jugador se le darán PowerUps que apareceran según un sistema de probabilidad basado en la rareza y se clasifican de la siguiente manera:
1. **Comunes** (40% de aparición):
    - Recuperar vida: Recuperación del 20% de vida.
    - Escudo: Se le otorga al jugador de 10% de vida.
2. **Raros** (30% de aparición):
    - Aumento de vida: Aumento de vida en 20 puntos.
3. **Epico** (20% de aparición):
    - Aumento de daño: Aumenta el daño en el 10 puntos.
4. **Legendario** (10% de aparición): 
    - Bomba EMP: Una bomba que ature a los enemigos por 2 segundos.

Al pasar de nivel los enemigos aumentarán su vida en un 10% y el ataque en un 15%. Asimismo en las salas de puzzle, estos aumentarán de dificultado conforme se avanzan los niveles.

En relación a los jefes, estos siempre serán un 20% más fuetes que los enemigos del nivel y tendrán 50% más de vida comparado a los enemigos del nivel en el que se encuentra el jugador. 


> **Posibles escenarios del jugador en el juego**
Los escenarios a los que el jugador se puede enfrentar en el juego son los siguientes:
1. Escenario donde el jugador gana: 
    - El jugador entra al nivel 1. Aparece a la mitad de la sala principal con 3 salas abiertas y una bloqueada alrededor. La sala bloqueada es la del jefe, que se desbloquea una vez completando las otras tres. 
    - El jugador entra a todas las salas y se enfrenta a los diferentes desafíos, ya sea enemigos que disparan a distancia, cuerpo a cuerpo o una sala con enemigos y un puzzle. Finalmente pasa los retos de las salas. 
    - Se desbloquea la sala del jefe.
    - Entra a la sala del jefe y lo derrota. 
    - Se desbloquea el siguiente nivel. 
    - Se repite el mismo proceso mencionado arriba, pero el jugador se enfrenta a enemigos más agresivos. 
    - Si el jugador logra atravesar todas las salas de todos los niveles disponibles, entonces obtiene la información robada de “The Core” y gana el juego.
    - El jugador puede jugar las veces que quiera para mejorar sus estadísticas. 
2. Escenario donde el jugador muere en algún punto del juego. 
    - El jugador entra al nivel 1. Aparece a la mitad de la sala principal con 3 salas abiertas y una bloqueada alrededor. La sala bloqueada es la del jefe, que se desbloquea una vez completando las otras tres. 
    - El jugador entra a alguna sala y se enfrenta a los diferentes desafíos, ya sea enemigos que disparan a distancia, cuerpo a cuerpo o una sala con enemigos y un puzzle. 
    - El jugador es derrotado debido a que se le acabó la vida por los ataques de los enemigos. 
    - El jugador regresa al inicio donde puede volver a empezar el nivel 1 y únicamente conserva aquellas mejoras que obtuvo durante su primer intento. 
    - El jugador repite este proceso hasta que logre completar todos los niveles y recuperar la información robada por “The Core”. 
 

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
4. Una vez dentro, la puerta se cierra automáticamente hasta completar el desafío. 
5. El jugador completa el desafio de la subsala y es recompensado con un power-up. 
6. La puerta es desbloqueada para que el jugador salga de la subsala.
7. El jugador regresa a la sala principal, e ingresa a una de las salas restantes.
8. En la subsala del puzzle el jugador tiene tiempo limite para resolverlo. 
9. Si no logra resolver el puzzle en el tiempo, más enemigos aparecen. 
10. Tras completar las 3 subsalas, la puerta del jefe (encontrada en la parte de arriba de la pantalla) queda desbloqueada.
11. El jugador entra a la sala del jefe.
12. La puerta se cierra una vez el jugador entra y empieza el combate. 
13. Tras derrotarlo el jugador puede pasar al siguiente nivel.
14. El siguiente nivel se plantea igual, comezando desde el punto 1.
15. Si el jugador es derrotado, el jugador empezará el juego desde el punto 1.
16. El jugador conserva los power-ups permanentes para volver a comenzar el juego. 
17. El jugador gana el juego una vez complete todo los niveles disponibles y cumpla el objetivo mencionado al inicio de las mecanicas.


## _Development_

---

### **Abstract Classes / Components**

1. Fisicas Básicas a desarrollar
    1. Fisicas del personaje: 
    - Movimiento
    - Ataque 
    - Puntos de vida
    - Interacciones con las paredes y obstaculos
    - Interacción con los puzzles para su solución
    2. Fisicas de los enemigos:
    - Movimiento hacia el jugador
    - Ataque
    - Puntos de vida
    - Interacciones con las paredes y obstaculos
    - Interacción con el jugador
    3. Fisicas de Power-ups:
    - Probabilidad de aparición
    - Rareza
    - Duracion del power-up: Uso único, permanente.
    - Interacción con el jugador: Se activa automáticamente o requiere de la activación por boton. 
2. Obstaculos del escenario
3. Obejtos para interactuar

   
_(example)_

### **Derived Classes / Component Compositions**

1. Fisicas del personaje
    1. Personaje principal
2. Fisicas de los enemigos 
    1. Enemigos cuerpo a cuerpo
    2. Enemigos que disparan a distancia
    3. Jefe del nivel (Versión más grande del enemigo cuerpo a cuerpo o a distancia)
3. Fisicas de Power-ups
    1. Power-Up para recuperar vida
    2. Power-Up para aumentar la vida
    3. Power-Up para aumentar el daño
    4. Power-Up Bomba EMP (Poder guardarlo y usarlo con E)
4.  Obstaculos del escenario
    1. Obstaculo de cables saliendo de las paredes
    2. Obstaculo de cables saliendo del piso
5.  Objetos para interactuar
    1. Botón que simule una terminal para abrir un puzzle
    2. Botón para cambiar de nivel.

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