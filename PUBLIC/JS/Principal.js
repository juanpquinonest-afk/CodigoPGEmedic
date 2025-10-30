document.addEventListener('DOMContentLoaded', () => {
const appointmentType = localStorage.getItem('appointmentType');
const appointmentDate = localStorage.getItem('appointmentDate');

if (appointmentType && appointmentDate && doctorName) {
  const row = document.querySelector('.tabla-noti tbody tr');
  row.cells[0].textContent = appointmentType;
  row.cells[1].textContent = appointmentDate;

  // (opcional) limpiar después de mostrar
  localStorage.removeItem('appointmentType');
  localStorage.removeItem('appointmentDate');
}
});

// Leer citas guardadas en localStorage
  const appointments = JSON.parse(localStorage.getItem('appointments')) || [];

  const tableBody = document.getElementById('appointments-table-body');

  // Limpiar el cuerpo de la tabla (por si acaso)
  tableBody.innerHTML = '';

  // Recorrer las citas y crear una fila por cada una
  appointments.forEach(app => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${app.type}</td>
      <td>${app.date}</td>
    `;
    tableBody.appendChild(row);
  });

// Escuchar clic en el botón de borrar notificaciones
  const deleteButton = document.getElementById('delete-notis');
  deleteButton.addEventListener('click', () => {
    // Vaciar la tabla
    tableBody.innerHTML = '';

    // Eliminar las citas del localStorage
    localStorage.removeItem('appointments');

    // (opcional) Mostrar un mensaje de confirmación
    const alerta = document.getElementById('alerta');
    if (alerta) {
      alerta.textContent = 'Todas las notificaciones han sido eliminadas.';
      alerta.style.color = 'red';
      setTimeout(() => alerta.textContent = 'No hay notificaciones pendientes.' , 3000); // mensaje desaparece en 3s
    }
  });