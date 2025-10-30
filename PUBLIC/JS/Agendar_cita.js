document.getElementById('registroForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Evitar el envío del formulario

  const userConfirmed = confirm("¿Está seguro que desea agendar su cita?");

  if (userConfirmed) {
    // Obtener los valores de los inputs
    const appointmentType = document.getElementById('appointment-type').value;
    const appointmentDate = document.getElementById('appointment-date').value;
    const doctorName = "Dr. [Nombre]"; // Nombre del doctor (puede ser dinámico si se requiere)

    // Guardar datos en localStorage
    /*localStorage.setItem('appointmentType', appointmentType);
    localStorage.setItem('appointmentDate', appointmentDate);
    localStorage.setItem('doctorName', doctorName);*/

    // Obtener las citas existentes
  let appointments = JSON.parse(localStorage.getItem('appointments')) || [];

  // Agregar la nueva cita al array
  appointments.push({
    type: appointmentType,
    date: appointmentDate,
    doctor: doctorName
  });

   // Guardar de nuevo el array actualizado
  localStorage.setItem('appointments', JSON.stringify(appointments));

    alert("Cita agendada con éxito.");

    // Redirigir a la página principal
    window.location.href = "./Principal.html";
  }
});

// Establecer la fecha mínima como la de hoy
const today = new Date().toISOString().split("T")[0];
document.getElementById("appointment-date").setAttribute("min", today);
