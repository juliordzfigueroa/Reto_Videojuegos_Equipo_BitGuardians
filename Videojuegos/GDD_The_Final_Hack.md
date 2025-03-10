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

En ocasiones las recompensas que puedes obtener por hacer los diferentes retos de las salas en cada nivel pueden ser permanentes (principalmente las mejoras de ataque y vida). Cuando te mueras conservas dichas mejoras permanentes que recojas a lo largo de las partidas.


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
**1. Escenario donde el jugador gana:** 
    - El jugador entra al nivel 1. Aparece a la mitad de la sala principal con 3 salas abiertas y una bloqueada alrededor. La sala bloqueada es la del jefe, que se desbloquea una vez completando las otras tres. 
    - El jugador entra a todas las salas y se enfrenta a los diferentes desafíos, ya sea enemigos que disparan a distancia, cuerpo a cuerpo o una sala con enemigos y un puzzle. Finalmente pasa los retos de las salas. 
    - Se desbloquea la sala del jefe.
    - Entra a la sala del jefe y lo derrota. 
    - Se desbloquea el siguiente nivel. 
    - Se repite el mismo proceso mencionado arriba, pero el jugador se enfrenta a enemigos más agresivos. 
    - Si el jugador logra atravesar todas las salas de todos los niveles disponibles, entonces obtiene la información robada de “The Core” y gana el juego.
    - El jugador puede jugar las veces que quiera para mejorar sus estadísticas. 
**2. Escenario donde el jugador muere en algún punto del juego:** 
    - El jugador entra al nivel 1. Aparece a la mitad de la sala principal con 3 salas abiertas y una bloqueada alrededor. La sala bloqueada es la del jefe, que se desbloquea una vez completando las otras tres. 
    - El jugador entra a alguna sala y se enfrenta a los diferentes desafíos, ya sea enemigos que disparan a distancia, cuerpo a cuerpo o una sala con enemigos y un puzzle. 
    - El jugador es derrotado debido a que se le acabó la vida por los ataques de los enemigos. 
    - El jugador regresa al inicio donde puede volver a empezar el nivel 1 y únicamente conserva aquellas mejoras permanentes que obtuvo durante sus intentos anteriores. 
    - El jugador repite este proceso hasta que logre completar todos los niveles y recuperar la información robada por “The Core”. 
 

## _Level Design_

---

### **Themes**

1. Nivel 1 y 2: Servidor 1: 
    1. Mood
        1. Lugar con poca iluminación, donde el jugador debe estar atento a los diferentes desafios del nivel
    2. Objects
        1. _Ambient_
            1. Cables salientes del piso y pared
        2. _Interactive_
            1. Robots
            2. Drones
            3. Terminal para el puzzle
            4. Puerta para el cambio de nivel
            5. Jefe del nivel

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

Nuestro juego al estar ambientado en la temática de ciberseguridad en una base secreta tomada por una organización clandestina, queremos usar una paleta de colores que emitan una vibra de estetica digital dentro de esta base secreta. Para lograr esto, planeamos usar lo siguiente:

1. Colores base
    1. Negro
    2. Azul neón
    3. Gris obscuro
    4. Gris claro

2. Peligro o daño
    1. Rojo

3. Puzzles
    1. Blanco
    2. Gris
    3. Negro
    4. Verde

4. Objetos permanentes/power ups
    1. Contorno Verde
    2. Contorno Azul
    3. Contorno Morado
    4. Contorno Naranja claro 
  
Nuestro estílo artistico será pixel-art con animaciones. Las animaciones serán movimientos de ataque rápidos y fluidos para dar una sensación satisfactoria al jugador, los golpes y daño recibido serán acompañados de un flsah rojo que de la sensación de peligro, y la interacción con objetos será resaltada por un brillo.

Para que el jugador pueda saber cuando puede interactuar con un objeto y cuando no, pondremos las siguientes animaciones en los objetos interactivos:

1. Parpadeo brillante del objeto

También, es importante dar retroalimentación positiva y negativa al jugador, por lo que desarrollaremos medidas para que pueda entender cuando esta haciendo las cosas bien, y cuando esta haciendo las cosas mal. Lo haremos de la siguiente manera:

1. Daño recibido y daño infligido
    1. Tanto como los enemigos como el personaje tendrán un efecto de flash color rojo al ser impactados
  

### **Graphics Needed**

1. Personajes
    1. Humanos
        1. Cipher el hacker 
    2. Otros
        1. Robots
        2. Drones
        3. Jefes
2. Bloques
    1. Paredes con grietas
    2. Circuitos
    3. Placas de concreto para el piso
    4. Placas de concreto ligeramente agrietadas
3. Ambiente
    1. Cables saliendo del piso
    2. Cables saliendo de las paredes
4. Otros
    1. Terminales
    2. Puertas
    3. Power Ups: aumento de vida, recuperación de vida, bomba EMP, distintas armas
    4. Armas

Aqui algunos de los diseños ya hechos para usar en nuestro juego:
Primer diseño del protagonista Cipher: 
![Cipher](/Videojuegos/images/GDD/cipher_1_1.png)

Logo con el nombre del juego para usarlo en la pantalla del titulo del juego:
![Logo_The_Final_Hack](/Videojuegos/images/GDD/the_final_hack_1_1.png)


## _Sounds/Music_

---

### **Style Attributes**

La música de The Final Hack, tiene como propósito sumergir al jugador en una operación de hackeo de alto riesgo y dificultad. Queremos que el jugador, sienta los elementos electronicos, de tensión y concentración, y batalla. 

1. Género
    1. Cyberpunk
    2. Electrónica
    3. 8-Bit   
2. Influencias
    1. Cyberpunk 2077
    2. Tron Legacy
3. Mood
    1. Tenso
    2. Adrenalina
    3. Nervio
4. Instrumentos
    1. instrumentos electrónicos que creen sonidos con sensación digital
  
Los efectos de sonido son elegidos con el propósito de reforzar la temática tecnológica-digital. Para esto, utilizaremos sonidos sintéticos o de estilo glitch, y metálicos-mecánicos, para darle seriedad a la temática, en vez de optar por algo más caricaturesco. Los efectos serán claros y diferenciables, para que no colisionen con la música de fondo y que el jugador tenga una esxperiencia auditiva agradable y satisfactoria. 

La retroalimentación auditiva será clara y equilibrada, ayudando al jugador entender la situación a la que se enfrenta. Los efectos críticos o de ataque, serán más fuertes que la música y los sonidos de ambiente. Para mantener un equilibrio sonoro, los sonidos se reproduciran de manera uniforme sin variaciones de dirección. Por otra parte, se van a utilizar frecuencias y tempos diferentes para evitar colisiones de sonido con efectos importantes, y para que el jugador pueda percibir la dificultad de los diferentes retos a los que se enfrentará.


### **Sounds Needed**

1. Effects
    1. Pasos en piso de concreto
    2. Puzzle resuelto
    3. Ataque lanzado con cada tipo de arma diferente
    4. Ataque lanzado por enemigo
    5. Ataque conectado con enemigo
    6. Ataque recibido
    7. Sonido de chispas de cable
    8. Interacciones 
    9. Apertura de puerta
    10. Cerradura de puerta
    11. Sonido corto característico de un jefe

2. Feedback
    1. "Ugh": Daño recibido
    2. Activación de power up
    3. "Yuju": Sala completada
    4. "Error": Puzzle fallado
    5. Intro del boss
    6. Sonido de nivel pasado
    7. Alarma para indicar que el jugador murió
    8. "Hacked": Puzzle correcto
    9. Sonido de sistema apagado para indicar que derrotaste a un enemigo


### **Music Needed**

1. Música electrónica no acelerado pero no muy lenta para las 3 subsalas, por ejemplo: 
2. Música energizante con tema electrónico para el menú principal, por ejemplo:
3. Música electrónica acelerada para la batalla contra el jefe, por ejemplo: 
4. Créditos finales del videojuego. CANCIÓN
5. Música triste de derrota. CANCION
6. Música de tensión y concentración para los puzzles. CANCIÓN


## _Schedule_

---
Este será el orden de como desarrollaremos los diferentes aspectos mecionados del videojuego. Este orden esta sujeto a cambios a lo largo del desarrollo

1. Clases de objetos del juego
    1. Entidad Base:
        1. Jugador 
        2. Clase enemigos
        3. Power-ups
        4. Puzzles
        5. Obstaculos
  2. Diseño de niveles
        1. Clase con el layout de los niveles
        2. Menú pausa
2. Encontar controles comodos para el usuario
    1. Opción para alternar los controles
3. Desarrollo de las interacciones entre el jugador y los power ups 
    1. Físicas y colisione    
4. Ajustar las físicas del jugador y de los power-ups
5. Desarrollo de las clases restantes
    1. Enemigos
        1. Robot
        2. Dron
        3. Jefe
    2. Obstaculos
        1. Posición de los cables que salen del piso
        2. Posición de los cables que salen de la pared
    3. Puzzles
       1. Puzzle de acomodar las fichas en orden dentro de una matríz
6. Diseño de niveles
    1. Introducir los power-ups para pruebas
    2. Probar el botón de interacción con los puzzles y el cambio de nivel
    3. Detallar el posicionamineto de enemigos en cada tipo de sala
7. Diseño de animaciones
8. Diseño de efectos de sonido
9. Diseño de musica para los niveles
   1. Música para la sala del jefe
   2. Música para el resto del nivel

