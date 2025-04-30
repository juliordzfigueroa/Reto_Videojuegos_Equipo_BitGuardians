"use strict"

// Importing modules
import express from 'express'

// The mysql2/promise module is used to connect to the MySQL database. The promise version of the module is used to avoid the use of callbacks and instead use the async/await syntax.
import mysql from 'mysql2/promise'
import fs from 'fs'

const app = express()
const port = 3000

app.use(express.json())
app.use(express.static('./public'))

// Function to connect to the MySQL database
async function connectToDB() {
    return await mysql.createConnection({
        host: "localhost",
        user: "card_user",
        password: "asdf1234",
        database: "FinalHack_Api",
    });
}

// Routes definition and handling
app.get('/', (request, response) => {
    fs.readFile('./public/Juego/html/prueba.html', 'utf8', (err, html) => {
        if (err) response.status(500).send('There was an error: ' + err)
        console.log('Loading page...')
        response.send(html)
    })
})

// Get all jugadores from the database and return them as a JSON object
app.get('/api/jugador', async (request, response) => {
    let connection = null

    try {
        connection = await connectToDB()
        const [results, fields] = await connection.execute('select * from jugador')

        console.log(`${results.length} rows returned`)
        console.log(results)
        response.json(results)
    }
    catch (error) {
        response.status(500)
        response.json(error)
        console.log(error)
    }
    finally {
        if (connection !== null) {
            connection.end()
            console.log("Connection closed succesfully!")
        }
    }
})

// Get a specific user from the database and return it as a JSON object
app.post('/api/login', async (request, response) => {
    let connection = null

    try {
        connection = await connectToDB()
        console.log(request.body);

        const [results_user, _] = await connection.query('select * from jugador where email = ? and contrasena = ?', [request.body['email'], request.body['contrasena']])

        console.log(`${results_user.length} rows returned`)
        response.json(results_user)
    }
    catch (error) {
        response.status(500)
        response.json(error)
        console.log(error)
    }
    finally {
        if (connection !== null) {
            connection.end()
            console.log("Connection closed succesfully!")
        }
    }
})

// Insert a new user into the database and return a JSON object with the id of the new user
app.post('/api/jugador', async (request, response) => {

    let connection = null

    try {
        connection = await connectToDB()

        const [results, fields] = await connection.query('insert into jugador set ?', request.body)

        console.log(`${results.affectedRows} row inserted`)
        response.status(201).json({ 'message': "Data inserted correctly.", "id": results.insertId })
    }
    catch (error) {
        response.status(500)
        response.json(error)
        console.log(error)
    }
    finally {
        if (connection !== null) {
            connection.end()
            console.log("Connection closed succesfully!")
        }
    }
})

// Update a user in the database and return a JSON object with the number of rows updated
app.put('/api/jugador', async (request, response) => {

    let connection = null

    try {
        connection = await connectToDB()

        const [results, fields] = await connection.query('update jugador set name = ?, surname = ? where id_jugador= ?', [request.body['name'], request.body['surname'], request.body['userID']])

        console.log(`${results.affectedRows} rows updated`)
        response.json({ 'message': `Data updated correctly: ${results.affectedRows} rows updated.` })
    }
    catch (error) {
        response.status(500)
        response.json(error)
        console.log(error)
    }
    finally {
        if (connection !== null) {
            connection.end()
            console.log("Connection closed succesfully!")
        }
    }
})

// Delete a user from the database and return a JSON object with the number of rows deleted
app.delete('/api/jugador/:id', async (request, response) => {

    let connection = null

    try {
        connection = await connectToDB()

        const [results, fields] = await connection.query('delete from Jugador where id_jugador = ?', [request.params.id])

        console.log(`${results.affectedRows} row deleted`)
        response.json({ 'message': `Data deleted correctly: ${results.affectedRows} rows deleted.` })
    }
    catch (error) {
        response.status(500)
        response.json(error)
        console.log(error)
    }
    finally {
        if (connection !== null) {
            connection.end()
            console.log("Connection closed succesfully!")
        }
    }
})

app.post('/api/jugador/stats', async (request, response) => {
    let connection = null

    try {
        console.log(request.body['id_jugador'])
        connection = await connectToDB()
        const [results, fields] = await connection.query('select * from jugador where id_jugador = ?', [request.body['id_jugador']])

        console.log(`${results.length} rows returned`)
        console.log(results)
        response.json(results)
    }
    catch (error) {
        response.status(500)
        response.json(error)
        console.log(error)
    }
    finally {
        if (connection !== null) {
            connection.end()
            console.log("Connection closed succesfully!")
        }
    }
})

app.post('/api/jugador/stats/partida/update', async (request, response) => {
    let connection = null;

    try {
        console.log('Datos recibidos: ', request.body);
        connection = await connectToDB();

        const [results] = await connection.query('SELECT * FROM Estadisticas WHERE id_jugador = ?', [request.body['id_jugador']]);

        if (results.length > 0) {
            // Comparar y actualizar mejor tiempo si es menor
            const mejorTiempoActual = results[0].mejor_tiempo_partida_ganada;
            const nuevoMejorTiempo = request.body.mejor_tiempo_partida_ganada;

            const mejorTiempo = (mejorTiempoActual === null || (nuevoMejorTiempo !== null && nuevoMejorTiempo < mejorTiempoActual))
                ? nuevoMejorTiempo
                : mejorTiempoActual;

            // Actualizar estadísticas
            await connection.query(
                `UPDATE Estadisticas 
                SET enemigos_derrotados = enemigos_derrotados + ?, 
                    dano_total_recibido = dano_total_recibido + ?, 
                    power_ups_utilizados = power_ups_utilizados + ?,
                    salas_completadas = salas_completadas + ?, 
                    jefes_derrotados = jefes_derrotados + ?, 
                    puzzles_resueltos = puzzles_resueltos + ?, 
                    partidas_jugadas = partidas_jugadas + ?,
                    partidas_ganadas = partidas_ganadas + ?,
                    mejor_tiempo_partida_ganada = ?
                WHERE id_jugador = ?`,
                [
                    request.body.enemigos_derrotados,
                    request.body.dano_total_recibido,
                    request.body.power_ups_utilizados,
                    request.body.salas_completadas,
                    request.body.jefes_derrotados,
                    request.body.puzzles_resueltos,
                    request.body.partidas_jugadas,
                    request.body.partidas_ganadas,
                    mejorTiempo,
                    request.body.id_jugador
                ]
            );

            response.json({ message: "Estadísticas actualizadas correctamente." });
        } else {
            // Insertar nuevas estadísticas
            await connection.query(
                'INSERT INTO Estadisticas SET ?',
                request.body
            );

            response.json({ message: "Estadísticas insertadas correctamente." });
        }
    } catch (error) {
        response.status(500).json(error);
        console.log(error);
    } finally {
        if (connection) {
            await connection.end();
            console.log("Conexión cerrada correctamente.");
        }
    }
});


app.post('/api/jugador/stats/partida', async (request, response) => {
    let connection = null

    try {
        console.log(request.body['id_jugador'])
        connection = await connectToDB()
        const [results, fields] = await connection.query('select * from Estadisticas where id_jugador = ?', [request.body['id_jugador']])

        console.log(`${results.length} rows returned`)
        console.log(results)
        response.json(results)
    }
    catch (error) {
        response.status(500)
        response.json(error)
        console.log(error)
    }
    finally {
        if (connection !== null) {
            connection.end()
            console.log("Connection closed succesfully!")
        }
    }
})

//Graficar las vistas creadas en la base de datos
app.get("/api/views/top5", async (request, response) => {
    let connection = null;

    try {
        connection = await connectToDB();

        const [results, fields] = await connection.query(
            "SELECT * FROM Top_5"
        );

        console.log("Sending data correctly.");
        response.status(200);
        response.json(results);
    } catch (error) {
        response.status(500);
        response.json(error);
        console.log(error);
    } finally {
        if (connection !== null) {
            connection.end();
            console.log("Connection closed succesfully!");
        }
    }
});

app.get("/api/views/edades", async (request, response) => {
    let connection = null;

    try {
        connection = await connectToDB();

        const [results, fields] = await connection.query(
            "SELECT * FROM edades"
        );

        console.log("Sending data correctly.");
        response.status(200);
        response.json(results);
    } catch (error) {
        response.status(500);
        response.json(error);
        console.log(error);
    } finally {
        if (connection !== null) {
            connection.end();
            console.log("Connection closed succesfully!");
        }
    }
});

app.get("/api/views/topMenorTiempo", async (request, response) => {
    let connection = null;

    try {
        connection = await connectToDB();

        const [results, fields] = await connection.query(
            "SELECT * FROM top_menortiempo"
        );

        console.log("Sending data correctly.");
        response.status(200);
        response.json(results);
    } catch (error) {
        response.status(500);
        response.json(error);
        console.log(error);
    } finally {
        if (connection !== null) {
            connection.end();
            console.log("Connection closed succesfully!");
        }
    }
});

app.get('/api/jugador/:id/vida_maxima', async (request, response) => {
    let connection = null;

    try {
        console.log(request.params['id']);
        connection = await connectToDB();

        const [results, fields] = await connection.query ('SELECT vida_maxima FROM Jugador WHERE id_jugador = ?',[request.params['id']]);

        console.log(`${results.length} rows returned`);
        console.log(results);

        if (results.length > 0) {response.json({ vida_maxima: results[0].vida_maxima });}
        else {response.status(404).json({ message: 'Jugador no encontrado' });}
    }
    catch (error) {
        response.status(500);
        response.json(error);
        console.log(error);
    }
    finally {
        if (connection !== null) {
            connection.end();
            console.log("Connection closed succesfully!");
        }
    }
});

app.post('/api/jugador/:id/vida_maxima', async (request, response) => {
    let connection = null;

    try {
        console.log('Datos recibidos:', request.body);
        const idJugador = request.params['id'];
        const nuevaVidaMaxima = request.body['vida_maxima'];

        connection = await connectToDB();

        const [results, fields] = await connection.query ('UPDATE Jugador SET vida_maxima = ? WHERE id_jugador = ?',[nuevaVidaMaxima, idJugador]);

        console.log(`${results.affectedRows} rows returned`);
        response.json({ message: 'vida_maxima actualizada correctamente' });
    }
    catch (error) {
        response.status(500);
        response.json(error);
        console.log(error);
    }
    finally {
        if (connection !== null) {
            connection.end();
            console.log("Connection closed succesfully!");
        }
    }
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})