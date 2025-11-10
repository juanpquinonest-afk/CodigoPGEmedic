// JS para DrPrincipal.html
// Busca un paciente por número de documento y muestra sus datos en la tabla

document.addEventListener('DOMContentLoaded', () => {
  const btnBuscar = document.querySelector('.btn-buscar');
  const inputBuscar = document.getElementById('buscar');
  const alertaEl = document.getElementById('alerta');

  if (!btnBuscar || !inputBuscar) return;

  btnBuscar.addEventListener('click', async (e) => {
    e.preventDefault();
    alertaEl.textContent = '';
    const query = inputBuscar.value.trim();
    if (!query) {
      alertaEl.textContent = 'Ingrese número de documento o nombre del paciente';
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/buscar-paciente', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identificacion: query })
      });

      const data = await res.json();

  // Seleccionamos la tabla izquierda con id "appointments-table-body-left"
  const tbody = document.getElementById('appointments-table-body-left');
      if (!tbody) return;

      if (res.ok && data.paciente) {
        const p = data.paciente;
        tbody.innerHTML = `
          <tr>
            <td>${p.identificacion || ''}</td>
            <td>${p.nombre || ''}</td>
            <td>${p.correo || ''}</td>
            <td>${p.telefono || ''}</td>
          </tr>
        `;
        alertaEl.textContent = '';
      } else {
        tbody.innerHTML = '<tr><td colspan="4">Paciente no encontrado</td></tr>';
        alertaEl.textContent = data.message || 'Paciente no encontrado';
      }

    } catch (err) {
      console.error('Error buscando paciente:', err);
      document.getElementById('alerta').textContent = 'Error al buscar paciente';
    }
  });
});

// Nota: en el HTML actual hay dos tablas que comparten el mismo id
// "appointments-table-body". querySelector('#appointments-table-body')
// elegirá la primera ocurrencia. Si quieres que la búsqueda rellene
// la tabla de la derecha en lugar de la de la izquierda, cambia el
// id en el HTML para que sean únicos y ajústalo aquí.
