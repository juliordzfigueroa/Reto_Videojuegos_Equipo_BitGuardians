document.addEventListener("DOMContentLoaded", () => {
    const musica = document.getElementById("musicaFondo");
    const activarMusica = () => {
        musica.play();
        document.removeEventListener("click", activarMusica);
    };
    document.addEventListener("click", activarMusica);

    const btnAcerca = document.getElementById("btnAcerca");
    if (btnAcerca) {
        btnAcerca.addEventListener("click", () => {
            window.location.href = "Juego/html/Info.html";
        });
    }

    const btnJugar = document.getElementById("btnJugar");
    if (btnJugar) {
        btnJugar.addEventListener("click", () => {
            window.location.href = "Juego/html/videojuego.html";
        });
    }

    const btnCreditos = document.getElementById("btnCreditos");
    if (btnCreditos) {
        btnCreditos.addEventListener("click", () => {
            window.location.href = "Juego/html/creditos.html";
        });
    }

    const btnEstadisticas = document.getElementById("btnEstadisticas");
    if (btnEstadisticas) { //Si el jugador ha iniciado sesion, se le mostrara el boton de estadisticas
        btnEstadisticas.style.display = localStorage.getItem('jugador_id') ? "block" : "none"; //Si el jugador existe, se le mostrara el boton de estadisticas
    }

    const btnSesion = document.getElementById("btnSesion");
    if (localStorage.getItem('jugador_id')) {
        btnSesion.textContent = "Cerrar Sesión";
        btnSesion.onclick = cerrarSesion;
    } else {
        btnSesion.textContent = "Iniciar Sesión";
        btnSesion.onclick = mostrarLogin;
    }
});


//LOGIN
function mostrarLogin() {
    document.getElementById("popupLogin").style.display = "block";
}

async function cerrarLogin(e) {
    const email = document.getElementById("emailLogin");
    const contrasena = document.getElementById("contrasenaLogin");
    const dataObj = {
        email: email.value,
        contrasena: contrasena.value
    };
    console.log(dataObj)
    console.log(dataObj['email'])

    let response = await fetch(`http://localhost:3000/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataObj)
    })

    if (response.ok) {
        let results = await response.json()

        if (results.length > 0) {
            alert("Sesión iniciada correctamente.");
            // Mostrar el botón de estadísticas
            const btnEstadisticas = document.getElementById("btnEstadisticas");
            btnEstadisticas.style.display = "block";

            //Guardar el ID para poder usarlo en los stats o otras partes del juego.
            localStorage.setItem('jugador_id', results[0].id_jugador);
            console.log("Usuario autenticado:");
            console.log(`Id: ${results[0].id_jugador} \n` +
                `Nombre: ${results[0].nombre} \n` +
                `Email: ${results[0].email} \n`);
        } else {
            alert("Credenciales incorrectas. Intente de nuevo.");
        }
    } else {
        alert(`Error: ${response.status}`);
    }

    //Cerrar el popup de login
    if (localStorage.getItem('jugador_id')) {
        document.getElementById("popupLogin").style.display = "none";
        const btnSesion = document.getElementById("btnSesion");
        btnSesion.textContent = "Cerrar Sesión";
        btnSesion.onclick = cerrarSesion; //Solo cierra sesion si el usuario ya ha iniciado sesion
    }
}

//REGISTRO
function mostrarRegistro() {
    document.getElementById("popupRegistro").style.display = "block";
}

async function cerrarRegistro(e) {
    const name = document.getElementById("nombreRegistro");
    const edad = document.getElementById("edadRegistro");
    const email = document.getElementById("emailRegistro");
    const contrasena = document.getElementById("contrasenaRegistro");
    const data = {
        nombre: name.value,
        edad: edad.value,
        email: email.value,
        contrasena: contrasena.value
    };

    let response = await fetch('http://localhost:3000/api/jugador', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })

    if (response.ok) {
        let results = await response.json()
        console.log(results)
    }
    else {
        postResults.innerHTML = response.status
    }
}

window.onclick = function (event) {
    const popupLogin = document.getElementById("popupLogin");
    const popupRegistro = document.getElementById("popupRegistro");

    if (event.target === popupLogin) {
        popupLogin.style.display = "none";
    }

    if (event.target === popupRegistro) {
        popupRegistro.style.display = "none";
    }
};

//CERRAR SESION
function cerrarSesion() {
    localStorage.removeItem('jugador_id');
    const btnSesion = document.getElementById("btnSesion");
    btnSesion.textContent = "Iniciar Sesión";
    btnSesion.onclick = mostrarLogin; //Reasignar la funcion de iniciar sesion al boton
    document.getElementById("btnEstadisticas").style.display = "none";
    alert("Sesión cerrada correctamente.");
}

//STATS
async function mostarStatsJugador() {
    console.log("Called function mostarStatsJugador()")
    const currentUserId = localStorage.getItem('jugador_id');
    const Nombre = document.getElementById("nombreStats");
    const Email = document.getElementById("emailStats");
    const Edad = document.getElementById("edadStats");
    const vidaMaxima = document.getElementById("vidaMaximaStats");

    let response = await fetch('http://localhost:3000/api/jugador/stats', {
        method: 'Post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_jugador: currentUserId })
    })

    if (response.ok) {
        let results = await response.json()
        console.log(results)
        Nombre.innerHTML = `Nombre: ${results[0].nombre}`;
        Email.innerHTML = `Email: ${results[0].email}`;
        Edad.innerHTML = `Edad: ${results[0].edad}`;
        vidaMaxima.innerHTML = `Vida Máxima: ${results[0].vida_maxima}`;

    }
}

async function mostrarStatsPartida() {
    console.log("Called function mostarStatsPartida()")
    const currentUserId = localStorage.getItem('jugador_id');
    const enemigosDerrotados = document.getElementById("enemigosDerrotados");
    const danoTotalRecibido = document.getElementById("danoTotalRecibido");
    const powerUpsUtilizados = document.getElementById("powerUpsUtilizados");
    const salasCompletadas = document.getElementById("salasCompletadas");
    const jefesDerrotados = document.getElementById("jefesDerrotados");
    const puzzlesResueltos = document.getElementById("puzzlesResueltos");
    const partidasJugadas = document.getElementById("partidasJugadas");
    const partidasGanadas = document.getElementById("partidasGanadas");
    const mejorTiempo = document.getElementById("mejorTiempo");


    let response = await fetch('http://localhost:3000/api/jugador/stats/partida', {
        method: 'Post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_jugador: currentUserId })
    })

    if (response.ok) {
        let results = await response.json()
        console.log(results)
        enemigosDerrotados.innerHTML = `Enemigos Derrotados: ${results[0].enemigos_derrotados}`;
        danoTotalRecibido.innerHTML = `Daño Total Recibido: ${results[0].dano_total_recibido}`;
        powerUpsUtilizados.innerHTML = `Power Ups Utilizados: ${results[0].power_ups_utilizados}`;
        salasCompletadas.innerHTML = `Salas Completadas: ${results[0].salas_completadas}`;
        jefesDerrotados.innerHTML = `Jefes Derrotados: ${results[0].jefes_derrotados}`;
        puzzlesResueltos.innerHTML = `Puzzles Resueltos: ${results[0].puzzles_resueltos}`;
        partidasJugadas.innerHTML = `Partidas Jugadas: ${results[0].partidas_jugadas}`;
        partidasGanadas.innerHTML = `Partidas Ganadas: ${results[0].partidas_ganadas}`;
        mejorTiempo.innerHTML = `Mejor Tiempo: ${results[0].mejor_tiempo_partida_ganada}`;
    }
}
