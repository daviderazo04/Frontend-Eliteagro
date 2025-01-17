const backendUrl = "https://backend-eliteagro-production.up.railway.app"; // URL del backend

// Elementos del DOM
const productosTable = document.getElementById("productosTable");
const loadProductos = document.getElementById("loadProductos");
const buscarProducto = document.getElementById("buscarProducto");
const searchProducto = document.getElementById("searchProducto");

// Modal y formulario de edición
const editProductoModal = new bootstrap.Modal(document.getElementById("editarProductoModal"));
const editarProductoForm = document.getElementById("editarProductoForm");

// Lista de tipos de productos
const tiposProductos = [
    { id: "TIPO0001", descripcion: "Alimentos y Suplementos" },
    { id: "TIPO0002", descripcion: "Equipos de Manejo" },
    { id: "TIPO0003", descripcion: "Equipamiento Ecuestre" },
    { id: "TIPO0004", descripcion: "Medicación y Veterinaria" },
    { id: "TIPO0005", descripcion: "Infraestructura" },
];

// Cargar tipos de productos en el combo box
function cargarTiposDeProductos() {
    const editTipoProducto = document.getElementById("editTipoProducto");
    editTipoProducto.innerHTML = tiposProductos.map(tipo => `
        <option value="${tipo.id}">${tipo.descripcion}</option>
    `).join("");
}

// Cargar todos los productos
async function cargarProductos() {
    try {
        const response = await fetch(`${backendUrl}/api/products`);
        if (!response.ok) throw new Error("Error al cargar los productos.");
        const productos = await response.json();

        productosTable.innerHTML = productos.map(producto => `
            <tr>
                <td>${producto.id}</td>
                <td>${producto.nombre}</td>
                <td>${producto.descripcion}</td>
                <td>${producto.precio}</td>
                <td>${producto.stock}</td>
                <td>${producto.tipoProducto?.descripcion || 'Sin tipo'}</td>
                <td>
                    <button class="btn btn-primary btn-sm" data-id="${producto.id}" onclick="cargarProductoParaEditar(event)">Editar</button>
                    <button class="btn btn-danger btn-sm" data-id="${producto.id}" onclick="eliminarProducto(event)">Eliminar</button>
                </td>
            </tr>
        `).join("");
    } catch (error) {
        alert(error.message);
    }
}

// Buscar producto por nombre
async function buscarProductoPorNombre() {
    const prefix = searchProducto.value.trim();
    if (!prefix) {
        alert("Ingrese un nombre o prefijo para buscar.");
        return;
    }
    try {
        const response = await fetch(`${backendUrl}/api/products/search?prefix=${prefix}`);
        if (!response.ok) throw new Error("Error al buscar productos.");
        const productos = await response.json();

        productosTable.innerHTML = productos.map(producto => `
            <tr>
                <td>${producto.id}</td>
                <td>${producto.nombre}</td>
                <td>${producto.descripcion}</td>
                <td>${producto.precio}</td>
                <td>${producto.stock}</td>
                <td>${producto.tipoProducto?.descripcion || 'Sin tipo'}</td>
                <td>
                    <button class="btn btn-primary btn-sm" data-id="${producto.id}" onclick="cargarProductoParaEditar(event)">Editar</button>
                    <button class="btn btn-danger btn-sm" data-id="${producto.id}" onclick="eliminarProducto(event)">Eliminar</button>
                </td>
            </tr>
        `).join("");
    } catch (error) {
        alert(error.message);
    }
}

// Cargar producto para editar
async function cargarProductoParaEditar(event) {
    const productoId = event.target.dataset.id;
    try {
        const response = await fetch(`${backendUrl}/api/products/${productoId}`);
        if (!response.ok) throw new Error("Error al cargar datos del producto.");
        const producto = await response.json();

        document.getElementById("editProductoId").value = producto.id;
        document.getElementById("editNombre").value = producto.nombre;
        document.getElementById("editDescripcion").value = producto.descripcion;
        document.getElementById("editPrecio").value = producto.precio;
        document.getElementById("editStock").value = producto.stock;
        document.getElementById("editTipoProducto").value = producto.tipoProducto?.id || '';

        editProductoModal.show();
    } catch (error) {
        alert(error.message);
    }
}

// Guardar cambios del producto
async function guardarCambiosProducto(event) {
    event.preventDefault();
    const productoId = document.getElementById("editProductoId").value;
    const producto = {
        nombre: document.getElementById("editNombre").value,
        descripcion: document.getElementById("editDescripcion").value,
        precio: parseFloat(document.getElementById("editPrecio").value),
        stock: parseInt(document.getElementById("editStock").value),
        tipoProductoId: document.getElementById("editTipoProducto").value
    };

    try {
        const response = await fetch(`${backendUrl}/api/products/${productoId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(producto)
        });
        if (!response.ok) throw new Error("Error al guardar los cambios del producto.");
        alert("Producto actualizado exitosamente.");
        editProductoModal.hide();
        cargarProductos();
    } catch (error) {
        alert(error.message);
    }
}

// Eliminar producto
async function eliminarProducto(event) {
    const productoId = event.target.dataset.id;
    if (!confirm("¿Seguro que deseas eliminar este producto?")) return;

    try {
        const response = await fetch(`${backendUrl}/api/products/${productoId}`, {
            method: "DELETE"
        });
        if (!response.ok) throw new Error("Error al eliminar el producto.");
        cargarProductos();
    } catch (error) {
        alert(error.message);
    }
}

// Listeners
loadProductos.addEventListener("click", cargarProductos);
buscarProducto.addEventListener("click", buscarProductoPorNombre);
editarProductoForm.addEventListener("submit", guardarCambiosProducto);

// Inicialización
cargarTiposDeProductos();
cargarProductos();
