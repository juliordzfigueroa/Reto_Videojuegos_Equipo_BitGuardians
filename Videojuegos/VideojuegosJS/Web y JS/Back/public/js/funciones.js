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



function mostrarLogin() {
    document.getElementById("popupLogin").style.display = "block";
}

async function cerrarLogin(e) {
    const email = document.getElementById("email");
    const contrasena = document.getElementById("contrasena");
    const dataObj = {
        email: email.value,
        contrasena: contrasena.value
    };
    console.log(dataObj)

    let response = await fetch(`http://localhost:3000/api/jugador/${dataObj['email']}`, {
        method: 'GET'
    })

    if (response.ok) {
        let results = await response.json()

        if (results.length > 0) {
            const headers = Object.keys(dataObj[0])
            const values = Object.values(dataObj)

            let table = document.createElement("table")

            let tr = table.insertRow(-1)

            for (const header of headers) {
                let th = document.createElement("th")
                th.innerHTML = header
                tr.appendChild(th)
            }

            for (const row of values) {
                let tr = table.insertRow(-1)

                for (const key of Object.keys(row)) {
                    let tabCell = tr.insertCell(-1)
                    tabCell.innerHTML = row[key]
                }
            }

            const container = document.getElementById('getResultsID')
            container.innerHTML = ''
            container.appendChild(table)
        }
        else {
            const container = document.getElementById('getResultsID')
            container.innerHTML = 'No results to show.'
        }
    }
    else {
        getResults.innerHTML = response.status
    }
}


function mostrarRegistro() {
    document.getElementById("popupRegistro").style.display = "block";
}

async function cerrarRegistro(e) {
    const name = document.getElementById("nombre");
    const email = document.getElementById("email");
    const contrasena = document.getElementById("contrasena");
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
        postResults.innerHTML = results.message + ' id: ' + results.id
    }
    else {
        postResults.innerHTML = response.status
    }
}

window.onclick = function (event) {
    const popup = document.getElementById("popupLogin" || "popupRegistro");
    if (event.target === popup) {
        popup.style.display = "none";
    }
};
