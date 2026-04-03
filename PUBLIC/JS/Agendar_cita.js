document.getElementById('citaForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const userConfirmed = confirm("¿Está seguro que desea agendar su cita?");

    if (userConfirmed) {
        // Obtener los valores del formulario
        const tipoCita = document.getElementById('appointment-type').value;
        const dia = document.getElementById('appointment-date').value;
        const descripcion = document.getElementById('problem-description').value;
        const usuario = localStorage.getItem("usuario");
        console.log("Usuario agendando cita:", usuario);
        
        try {
            const response = await fetch('http://localhost:3000/agendar-cita', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    usuario,
                    tipoCita,
                    dia,
                    descripcion
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert("Cita agendada exitosamente");
                // Redirigir a la página principal
                window.location.href = "./Principal.html";
            } else {
                alert(data.message || "Error al agendar la cita");
            }
        } catch (error) {
            console.error('Error:', error);
            alert("Error de conexión al servidor");
        }
    }
});

// Establecer la fecha mínima como la de hoy
const today = new Date().toISOString().split("T")[0];
document.getElementById("appointment-date").setAttribute("min", today);
