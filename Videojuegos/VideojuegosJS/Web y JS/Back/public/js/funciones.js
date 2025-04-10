document.addEventListener("DOMContentLoaded", () => {
    const musica = document.getElementById("musicaFondo");
    const activarMusica = () => {
        musica.play();
        document.removeEventListener("click", activarMusica);
    };
    document.addEventListener("click", activarMusica);

    document.getElementById("btnAcerca").addEventListener("click", () => {
        window.location.href = "Juego/html/Info.html";
    });

    document.getElementById("btnJugar").addEventListener("click", () => {
        window.location.href = "Juego/html/videojuego.html";
    });

    document.getElementById("btnCreditos").addEventListener("click", () => {
        window.location.href = "Juego/html/creditos.html";
    });
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
}

//REGISTRO
function mostrarRegistro() {
    document.getElementById("popupRegistro").style.display = "block";
}

async function cerrarRegistro(e) {
    const name = document.getElementById("nombreRegistro");
    const email = document.getElementById("emailRegistro");
    const contrasena = document.getElementById("contrasenaRegistro");
    const data = {
        nombre: name.value,
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