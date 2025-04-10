document.addEventListener("DOMContentLoaded", () => {
    const musica = document.getElementById("musicaFondo");
    const activarMusica = () => {
        musica.play();
        document.removeEventListener("click", activarMusica);
    };
    document.addEventListener("click", activarMusica);

    document.getElementById("btnAcerca").addEventListener("click", () => {
        window.location.href = "../html/Info.html";
    });

    document.getElementById("btnJugar").addEventListener("click", () => {
        window.location.href = "../html/videojuego.html";
    });

    document.getElementById("btnCreditos").addEventListener("click", () => {
        window.location.href = "../html/creditos.html";
    });

    document.getElementById("btnSesion").addEventListener("click", () => {
        document.getElementById("popupLogin").style.display = "block";
    });
});


function mostrarPopup() {
    document.getElementById("popupLogin").style.display = "block";
}

async function cerrarPopup(e) {
    const name = document.getElementById("nombre");
    const email = document.getElementById("email");
    const contrasena = document.getElementById("contrasena");
    const datos = {
        nombre: name.value,
        email: email.value,
        contrasena: contrasena.value
    };

    let response = await fetch('http://localhost:3000/api/jugador', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    })

    if (response.ok) {
        let results = await response.json()
        console.log(results)
        postResults.innerHTML = results.message + ' id: ' + results.id
    }
    else {
        postResults.innerHTML = response.status
    }
}

window.onclick = function (event) {
    const popup = document.getElementById("popupLogin");
    if (event.target === popup) {
        popup.style.display = "none";
    }
};
