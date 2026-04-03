document.getElementById('historiaForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Obtener valores del formulario
    const historiaData = {
        nombre_completo: document.getElementById('full-name').value,
        edad: document.getElementById('age').value,
        genero: document.getElementById('gender').value,
        estado_civil: document.getElementById('estado_civil').value,
        tipo_documento: document.getElementById('tipo_documento').value,
        id: document.getElementById('id').value,
        motivo_consulta: document.getElementById('reason').value,
        antecedentes_medicos: document.getElementById('medical-history').value,
        diagnosticos: document.getElementById('diagnosis').value,
        tratamiento: document.getElementById('treatment').value
    };

    fetch('http://localhost:3000/guardar-historia', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(historiaData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            document.getElementById('mensaje').textContent = data.message;
            document.getElementById('mensaje').style.color = "green";
            // Limpiar el formulario
            document.getElementById('historiaForm').reset();
            // Redirigir a la página principal después de 2 segundos
            setTimeout(() => {
                window.location.href = "./DrPrincipal.html";
            }, 2000);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('mensaje').textContent = "Error al guardar la historia clínica";
        document.getElementById('mensaje').style.color = "red";
    });
});