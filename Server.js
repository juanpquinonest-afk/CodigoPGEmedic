const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// URL de conexión base de datos MongoDB
const dbUrl = 'mongodb://localhost/PGEmedic';                

// Conexión a la base de datos

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('✅ Conexión a MongoDB exitosa');
}).catch(err => {
    console.error('❌ Error de conexión a MongoDB:', err);
});


const pacienteSchema = new mongoose.Schema({
    Primer_nombres: String,
    Segundo_nombres: String,
    Primer_apellidos: String,
    Segundo_apellidos: String,
    correo: String,
    identificacion: String,
    telefono: String,
    otro_telefono: String,
    direccion: String,
    historias_clinicas: Array,
    usuario: String,     
    contrasena: String   

});

const Paciente = mongoose.model('Paciente', pacienteSchema);//

const medicoSchema = new mongoose.Schema({
    nombre: String,
    especializacion: String,
    usuario: String,
    contrasena: String,
    usuario: String,        
    contrasena: String
});

const Medico = mongoose.model('Medico', medicoSchema);

// Ruta para registrar paciente
 app.post('/registroForm', async (req, res) => 
  { try { console.log("📩 Datos recibidos:", req.body); 

    const {
      Primer_nombres,
      Primer_apellidos,
      identificacion
    } = req.body;

    const usuario = identificacion; 
    const contrasena =
      Primer_nombres.substring(0, 3).toLowerCase() + 
      identificacion.substring(0, 3) +               
      Primer_apellidos.substring(0, 3).toLowerCase(); 

    // Esto agrega los nuevos campos a la base de datos 
    const pacienteData = {
      ...req.body,
      usuario,
      contrasena
    };
    const nuevoPaciente = new Paciente(pacienteData); 
    await nuevoPaciente.save();
    
    res.status(201).send({ message: 'Paciente registrado exitosamente', usuario, contrasena});

    } catch (error) 
     { console.error("❌ Error al registrar:", error); 
      res.status(500).send({ message: 'Error al registrar el paciente', error }); 
    } 
  });

    

// Rutas para servir archivos estáticos
app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});




// +++++++ METODO DE CAMBIO DE CONTRASEÑA ++++++++++

app.post("/cambiarContrasena", async (req, res) => {
  const { usuario, correo, nuevaContrasena } = req.body;

  if (!usuario || !correo || !nuevaContrasena) {
    return res.status(400).send({ message: "Usuario, correo y nueva contraseña son requeridos" });
  }

  try {
    const paciente = await Paciente.findOneAndUpdate(
      { usuario: usuario, correo: correo },        
      { contrasena: nuevaContrasena },             
      { new: true }                                
    );

    if (!paciente) {
      return res.status(404).send({ message: "No existe paciente con ese usuario y correo" });
    }

    res.status(200).send({message: "Contraseña actualizada correctamente", 
      nuevaContrasena: nuevaContrasena
    });
  } catch (error) {
    console.error("❌ Error cambiando contraseña:", error);
    res.status(500).send({ message: "Error en el servidor", error });
  }
});

// +++++++ LOGIN USUARIO O MÉDICO ++++++++++
app.post("/login", async (req, res) => {
  const { usuario, contrasena } = req.body;

  if (!usuario || !contrasena) {
    return res.status(400).send({ message: "Por favor, complete todos los campos." });
  }

  try {
    // Buscar en pacientes
    const paciente = await Paciente.findOne({ usuario, contrasena });
    if (paciente) {
      return res.status(200).send({
        message: "Inicio de sesión exitoso como paciente",
        tipo: "paciente",
      });
    }

    // Buscar en médicos
    const medico = await Medico.findOne({ usuario, contrasena });
    if (medico) {
      return res.status(200).send({
        message: "Inicio de sesión exitoso como médico",
        tipo: "medico",
      });
    }

    // Si no existe ninguno
    res.status(401).send({
      message: "Usuario o contraseña incorrectos. Verifica tus datos o regístrate.",
    });
  } catch (error) {
    console.error("❌ Error en login:", error);
    res.status(500).send({ message: "Error en el servidor. Inténtelo más tarde." });
  }
});
