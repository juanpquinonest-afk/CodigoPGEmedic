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
}).then(() => console.log('✅ Conexión a MongoDB exitosa'))
  .catch(err => console.error('❌ Error de conexión a MongoDB:', err));


// =================== CONFIG ADMIN DIRECTO ===================
const ADMIN_USER = "adminPGEmedic";
const ADMIN_PASS = "admin123"; 
// ============================================================


// =================== ESQUEMAS ===================
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
const Paciente = mongoose.model('Paciente', pacienteSchema);

const doctorSchema = new mongoose.Schema({
  nombre: String,
  especializacion: String,
  usuario: String,
  contrasena: String
});

const Doctor = mongoose.model("Doctor", doctorSchema);


// =================== REGISTRO PACIENTE ===================
app.post('/registroForm', async (req, res) => {
  try {
    console.log("📩 Datos recibidos:", req.body);

    const { Primer_nombres, Primer_apellidos, identificacion } = req.body;

    const usuario = identificacion;
    const contrasena =
      Primer_nombres.substring(0, 3).toLowerCase() +
      identificacion.substring(0, 3) +
      Primer_apellidos.substring(0, 3).toLowerCase();

    const pacienteData = { ...req.body, usuario, contrasena };
    const nuevoPaciente = new Paciente(pacienteData);
    await nuevoPaciente.save();

    res.status(201).send({
      message: 'Paciente registrado exitosamente',
      usuario,
      contrasena
    });

  } catch (error) {
    console.error("❌ Error al registrar:", error);
    res.status(500).send({ message: 'Error al registrar el paciente', error });
  }
});


// =================== CAMBIO CONTRASEÑA ===================
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

    res.status(200).send({
      message: "Contraseña actualizada correctamente",
      nuevaContrasena
    });

  } catch (error) {
    console.error("❌ Error cambiando contraseña:", error);
    res.status(500).send({ message: "Error en el servidor", error });
  }
});


// LOGIN USUARIO, MÉDICO O ADMIN
app.post("/login", async (req, res) => {
  const { usuario, contrasena } = req.body;

  if (!usuario || !contrasena) {
    return res.status(400).send({ message: "Por favor, complete todos los campos." });
  }

  try {
    // 0) Comprobar admin directamente
    if (usuario === ADMIN_USER && contrasena === ADMIN_PASS) {
      return res.status(200).send({
        message: "Inicio de sesión exitoso como administrador",
        tipo: "admin",
        usuario: ADMIN_USER
      });
    }

    // 1) Buscar en pacientes
    const paciente = await Paciente.findOne({ usuario, contrasena });
    if (paciente) {
      return res.status(200).send({
        message: "Inicio de sesión exitoso como paciente",
        tipo: "paciente",
        usuario: paciente.usuario
      });
    }

    // 2) Buscar en médicos
    const medico = await Doctor.findOne({ usuario, contrasena });
    if (medico) {
      return res.status(200).send({
        message: "Inicio de sesión exitoso como médico",
        tipo: "medico",
        usuario: medico.usuario
      });
    }

    // Si no existe ninguno
    res.status(401).send({
      message: "Usuario o contraseña incorrectos. Verifica tus datos o regístrate.",
    });
  } catch (error) {
    console.error("❌ Error en login:", error);
    res.status(500).send({ message: "Error en el servidor. Inténtelo más tarde.", error: error.message });
  }
});

// =================== ACTUALIZAR DATOS PACIENTE ===================
app.post("/actualizarDatos", async (req, res) => {
  const { usuario, correo, telefono, otro_telefono, direccion } = req.body;

  if (!usuario) {
    return res.status(400).send({ message: "El usuario es obligatorio para actualizar datos" });
  }

  const updates = {};
  if (correo) updates.correo = correo;
  if (telefono) updates.telefono = telefono;
  if (otro_telefono) updates.otro_telefono = otro_telefono;
  if (direccion) updates.direccion = direccion;

  if (Object.keys(updates).length === 0) {
    return res.status(400).send({ message: "No se enviaron campos para actualizar" });
  }

  try {
    const paciente = await Paciente.findOneAndUpdate(
      { usuario },
      updates,
      { new: true }
    );

    if (!paciente) {
      return res.status(404).send({ message: "No se encontró paciente con ese usuario" });
    }

    res.status(200).send({
      message: "✅ Datos actualizados exitosamente",
      paciente
    });

  } catch (error) {
    console.error("❌ Error actualizando datos:", error);
    res.status(500).send({ message: "Error en el servidor", error: error.message });
  }
});


// =================== SERVIR ARCHIVOS ===================
app.use(express.static('public'));

app.listen(port, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${port}`);
  console.log(`👑 Admin: ${ADMIN_USER} / ${ADMIN_PASS}`);
});

// =================== RUTAS DEL ADMIN ===================

// --- Registrar nuevo paciente (por el admin) ---
app.post("/admin/registrarPaciente", async (req, res) => {
  try {
    const {
      Primer_nombres,
      Segundo_nombres,
      Primer_apellidos,
      Segundo_apellidos,
      identificacion,
      correo,
      telefono,
      otro_telefono,
      direccion
    } = req.body;

    if (!Primer_nombres || !Primer_apellidos || !identificacion || !correo) {
      return res.status(400).send({
        message: "⚠️ Faltan campos obligatorios: nombre, apellido, identificación o correo."
      });
    }

    // Evitar duplicados
    const existe = await Paciente.findOne({ identificacion });
    if (existe) {
      return res.status(409).send({
        message: "❌ Ya existe un paciente con esa identificación."
      });
    }

    // Generar usuario y contraseña automáticos
    const usuario = identificacion;
    const contrasena =
      Primer_nombres.substring(0, 3).toLowerCase() +
      identificacion.substring(0, 3) +
      Primer_apellidos.substring(0, 3).toLowerCase();

    // Crear y guardar el nuevo paciente
    const nuevoPaciente = new Paciente({
      Primer_nombres,
      Segundo_nombres,
      Primer_apellidos,
      Segundo_apellidos,
      identificacion,
      correo,
      telefono,
      otro_telefono,
      direccion,
      usuario,
      contrasena
    });

    await nuevoPaciente.save();

    res.status(201).send({
      message: `✅ Paciente registrado exitosamente.
      Usuario: ${usuario}
      Contraseña: ${contrasena}`
    });

  } catch (error) {
    console.error("❌ Error al registrar paciente:", error);
    res.status(500).send({ message: "Error en el servidor al registrar paciente." });
  }
});

app.post("/admin/registrarDoctor", async (req, res) => {
  try {
    const { nombre, especializacion, usuario, contrasena } = req.body;

    if (!nombre || !especializacion || !usuario || !contrasena) {
      return res.status(400).send({
        message: "⚠️ Faltan campos obligatorios: nombre, especialización, usuario o contraseña."
      });
    }

    const existe = await Doctor.findOne({ usuario });
    if (existe) {
      return res.status(409).send({
        message: "❌ Ya existe un doctor con ese usuario."
      });
    }

    const nuevoDoctor = new Doctor({
      nombre,
      especializacion,
      usuario,
      contrasena
    });

    await nuevoDoctor.save();

    res.status(201).send({
      message: "✅ Doctor registrado exitosamente."
    });
  } catch (error) {
    console.error("❌ Error al registrar doctor:", error);
    res.status(500).send({ message: "Error en el servidor al registrar doctor." });
  }
});

// +++++++ ESQUEMA Y MODELO DE CITAS ++++++++++
const citaSchema = new mongoose.Schema({
    usuario: String,
    tipoCita: String,
    dia: Date,
    descripcion: String,
});

const Cita = mongoose.model('Cita', citaSchema);

// +++++++ RUTA PARA AGENDAR CITA ++++++++++
app.post("/agendar-cita", async (req, res) => {
    try {
        const { usuario, tipoCita, dia, descripcion } = req.body;
        console.log("Datos recibidos:", req.body);

        // Validar campos requeridos
        if (!tipoCita || !dia) {
            return res.status(400).send({ 
                message: "Tipo de cita y día son requeridos" 
            });
        }

        // Crear nueva cita
        const nuevaCita = new Cita({
            usuario,
            tipoCita,
            dia: new Date(dia),
            descripcion: descripcion || ""
        });

        // Guardar la cita
        console.log("Nuevo documento que se guardará:", nuevaCita);
        await nuevaCita.save();
        
        res.status(201).send({ 
            message: "Cita agendada exitosamente",
            cita: nuevaCita
        });

    } catch (error) {
        console.error("❌ Error al agendar cita:", error);
        res.status(500).send({ 
            message: "Error al agendar la cita", 
            error: error.message 
        });
    }
});

// +++++++ ESQUEMA Y MODELO DE HISTORIAS CLÍNICAS ++++++++++
const historiaClinicaSchema = new mongoose.Schema({
    nombre_completo: String,
    edad: Number,
    genero: String,
    estado_civil: String,
    tipo_documento: String,
    id: String,
    motivo_consulta: String,
    antecedentes_medicos: String,
    diagnosticos: String,
    tratamiento: String,
    fecha_registro: { type: Date, default: Date.now }
});

const HistoriaClinica = mongoose.model('HistoriaClinica', historiaClinicaSchema);

// +++++++ RUTA PARA GUARDAR HISTORIA CLÍNICA ++++++++++
app.post("/guardar-historia", async (req, res) => {
    try {
        const historiaData = req.body;
        
        // Validar campos requeridos
        const camposRequeridos = [
            'nombre_completo', 'edad', 'genero', 'estado_civil',
            'tipo_documento', 'id', 'motivo_consulta', 
            'antecedentes_medicos', 'diagnosticos', 'tratamiento'
        ];

        for (const campo of camposRequeridos) {
            if (!historiaData[campo]) {
                return res.status(400).send({ 
                    message: `El campo ${campo} es requerido` 
                });
            }
        }

        // Crear nueva historia clínica
        const nuevaHistoria = new HistoriaClinica(historiaData);
        await nuevaHistoria.save();
        
        res.status(201).send({ 
            message: "Historia clínica guardada exitosamente",
            historia: nuevaHistoria
        });

    } catch (error) {
        console.error("❌ Error al guardar historia clínica:", error);
        res.status(500).send({ 
            message: "Error al guardar la historia clínica", 
            error: error.message 
        });
    }
});

// +++++++ RUTA PARA BUSCAR PACIENTE POR NÚMERO DE DOCUMENTO ++++++++++
app.post('/buscar-paciente', async (req, res) => {
  try {
    const { identificacion, query } = req.body;
    const idToSearch = (identificacion || query || '').toString().trim();

    if (!idToSearch) {
      return res.status(400).send({ message: 'Se requiere número de documento (identificacion) para buscar' });
    }

    // Buscar paciente por campo `identificacion`
    const paciente = await Paciente.findOne({ identificacion: idToSearch });
    if (!paciente) {
      return res.status(404).send({ message: 'Paciente no encontrado' });
    }

    // Construir objeto con los campos que la vista necesita
    const resultado = {
      identificacion: paciente.identificacion || '',
      nombre: [paciente.Primer_nombres, paciente.Segundo_nombres, paciente.Primer_apellidos, paciente.Segundo_apellidos].filter(Boolean).join(' '),
      correo: paciente.correo || '',
      telefono: paciente.telefono || ''
    };

    return res.status(200).send({ paciente: resultado });

  } catch (error) {
    console.error('❌ Error buscando paciente:', error);
    res.status(500).send({ message: 'Error en el servidor', error: error.message });
  }
});