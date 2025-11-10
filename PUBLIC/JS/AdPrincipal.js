const { MongoClient } = require('mongodb');

// Connection URI
// URL de conexión base de datos MongoDB
const uri = 'mongodb://localhost/3000'; // Cambia esto si tu base de datos está en otro host o puerto

// Database and collection names
const dbName = "PGEmedic";
const client = new MongoClient(uri);

async function fetchCounts() {
    try {
        // Conectar al cliente de MongoDB
        await client.connect();
        console.log("Conectado a la base de datos");

        const db = client.db(dbName);

        // Consultar la cantidad de usuarios registrados
        const cantUsuarios = await db.collection("pacientes").countDocuments({});
        document.getElementById("cant-usuarios").textContent = cantUsuarios;

        // Consultar la cantidad de doctores registrados
        const cantDoctores = await db.collection("doctores").countDocuments({});
        document.getElementById("cant-doctores").textContent = cantDoctores;

        // Consultar la cantidad de administradores registrados
        const cantAdministradores = await db.collection("administradores").countDocuments({});
        document.getElementById("cant-administradores").textContent = cantAdministradores;

    } catch (error) {
        console.error("Error al conectar o consultar la base de datos:", error);
    } finally {
        // Cerrar la conexión
        await client.close();
    }
}

// Llamar a la función cuando la página esté cargada
window.onload = fetchCounts;