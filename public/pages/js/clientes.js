// Selección de elementos necesarios
const loadClientesButton = document.getElementById("loadClientes");
const buscarClienteButton = document.getElementById("buscarCliente");
const clientesTableBody = document.getElementById("clientesTable");

// Cargar todos los clientes
loadClientesButton.addEventListener("click", async () => {
    try {
        const response = await fetch("http://localhost:8080/api/clientes");
        if (!response.ok) throw new Error("Error al cargar los clientes.");
        const clientes = await response.json();
        renderClientes(clientes);
    } catch (error) {
        alert(error.message);
    }
});

// Buscar cliente por cédula
buscarClienteButton.addEventListener("click", async () => {
    const cedula = document.getElementById("searchCliente").value;
    if (!cedula) {
        alert("Por favor, ingresa una cédula.");
        return;
    }
    try {
        const response = await fetch(`http://localhost:8080/api/clientes/${cedula}`);
        if (!response.ok) throw new Error("Cliente no encontrado.");
        const cliente = await response.json();
        renderClientes([cliente]); // Renderizar un solo cliente en la tabla
    } catch (error) {
        alert(error.message);
    }
});

function renderClientes(clientes) {
    const clientesTable = document.getElementById("clientesTable");
    clientesTable.innerHTML = "";

    clientes.forEach(cliente => {
        const row = `
            <tr>
                <td>${cliente.id}</td>
                <td>${cliente.cedula}</td>
                <td>${cliente.nombre}</td>
                <td>${cliente.apellido}</td>
                <td>${cliente.genero}</td>
                <td>${cliente.telefono}</td>
                <td>${cliente.fechaNacimiento}</td>
                <td>${cliente.ciudad}</td>
                <td>
                    <button class="btn btn-primary btn-sm me-2" data-cedula="${cliente.cedula}" onclick="cargarClienteParaEditar(event)">Editar</button>
                    <button class="btn btn-danger btn-sm" data-id="${cliente.id}" onclick="eliminarCliente(event)">Eliminar</button>
                </td>
            </tr>
        `;
        clientesTable.innerHTML += row;
    });
}


// Lista estática de ciudades
const ciudades = [
    { id: "CIU001", descripcion: "Azuay" },
    { id: "CIU002", descripcion: "Bolívar" },
    { id: "CIU003", descripcion: "Cañar" },
    { id: "CIU004", descripcion: "Carchi" },
    { id: "CIU005", descripcion: "Chimborazo" },
    { id: "CIU006", descripcion: "Cotopaxi" },
    { id: "CIU007", descripcion: "El Oro" },
    { id: "CIU008", descripcion: "Esmeraldas" },
    { id: "CIU009", descripcion: "Galápagos" },
    { id: "CIU010", descripcion: "Guayas" },
    { id: "CIU011", descripcion: "Imbabura" },
    { id: "CIU012", descripcion: "Loja" },
    { id: "CIU013", descripcion: "Los Ríos" },
    { id: "CIU014", descripcion: "Manabí" },
    { id: "CIU015", descripcion: "Morona Santiago" },
    { id: "CIU016", descripcion: "Napo" },
    { id: "CIU017", descripcion: "Orellana" },
    { id: "CIU018", descripcion: "Pastaza" },
    { id: "CIU019", descripcion: "Pichincha" },
    { id: "CIU020", descripcion: "Santa Elena" },
    { id: "CIU021", descripcion: "Santo Domingo de los Tsáchilas" },
    { id: "CIU022", descripcion: "Sucumbíos" },
    { id: "CIU023", descripcion: "Tungurahua" },
    { id: "CIU024", descripcion: "Zamora Chinchipe" },
    { id: "CIU025", descripcion: "Quito" }
];

// Cargar ciudades en el combo box
function cargarCiudadesManual() {
    const ciudadSelect = document.getElementById("editCiudad");
    ciudadSelect.innerHTML = ""; // Limpiamos las opciones previas

    ciudades.forEach(ciudad => {
        const option = document.createElement("option");
        option.value = ciudad.id; // El valor será el ID
        option.textContent = ciudad.descripcion; // El texto será el nombre
        ciudadSelect.appendChild(option);
    });
}

// Cargar cliente para editar
async function cargarClienteParaEditar(event) {
    const cedula = event.target.dataset.cedula; // Obtener la cédula del botón
    try {
        const response = await fetch(`http://localhost:8080/api/clientes/${cedula}`);
        if (!response.ok) throw new Error("Error al cargar datos del cliente.");
        const cliente = await response.json();

        // Llenar los campos del formulario con los datos del cliente
        document.getElementById("editClienteId").value = cliente.id;
        document.getElementById("editCedula").value = cliente.cedula;
        document.getElementById("editNombre").value = cliente.nombre;
        document.getElementById("editApellido").value = cliente.apellido;
        document.getElementById("editGenero").value = cliente.genero;
        document.getElementById("editTelefono").value = cliente.telefono;
        document.getElementById("editFechaNacimiento").value = cliente.fechaNacimiento;

        // Cargar las ciudades y seleccionar la ciudad actual del cliente
        cargarCiudadesManual();
        document.getElementById("editCiudad").value = cliente.ciudad.id;

        const modal = new bootstrap.Modal(document.getElementById("editarClienteModal"));
        modal.show();
    } catch (error) {
        alert(error.message);
    }
}




// Guardar cambios del cliente
document.getElementById("editarClienteForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const id = document.getElementById("editClienteId").value;
    const cedula = document.getElementById("editCedula").value;
    const cliente = {
        cedula: document.getElementById("editCedula").value,
        nombre: document.getElementById("editNombre").value,
        apellido: document.getElementById("editApellido").value,
        genero: document.getElementById("editGenero").value,
        telefono: document.getElementById("editTelefono").value,
        fechaNacimiento: document.getElementById("editFechaNacimiento").value,
        ciudad: { id: document.getElementById("editCiudad").value }
    };

    try {
        const response = await fetch(`http://localhost:8080/api/clientes/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(cliente)
        });
        if (!response.ok) throw new Error("Error al guardar los cambios del cliente.");
        alert("Cliente actualizado con éxito.");
        const modal = bootstrap.Modal.getInstance(document.getElementById("editarClienteModal"));
        modal.hide();
        loadClientesButton.click(); // Recargar la tabla de clientes
    } catch (error) {
        alert(error.message);
    }
});

// Eliminar cliente
async function eliminarCliente(event) {
    const clienteId = event.target.dataset.id;
    if (!confirm("¿Estás seguro de eliminar este cliente?")) return;
    try {
        const response = await fetch(`http://localhost:8080/api/clientes/${clienteId}`, {
            method: "DELETE"
        });
        if (!response.ok) throw new Error("Error al eliminar el cliente.");
        alert("Cliente eliminado con éxito.");
        loadClientesButton.click(); // Recargar la tabla de clientes
    } catch (error) {
        alert(error.message);
    }
}
