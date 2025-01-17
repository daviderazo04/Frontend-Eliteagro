// Carrito de compras
let carrito = [];

// Productos disponibles (puedes agregar más productos aquí)
const productos = [
    {
        id: 'PROD0001',
        nombre: 'Balanceado para potro',
        descripcion: 'Ideal para la nutrición de potros en crecimiento.',
        detalles: ['Peso: 50kg', 'Marca: EliteAgro'],
        precioOriginal: 65.00,
        precioDescuento: 60.00,
        imagenes: ['../images/productos/suplemento.webp']
    },
    {
        id: 'PROD0002',
        nombre: 'Jeringa Tipo pistola',
        descripcion: 'Jeringa reutilizable para uso veterinario.',
        detalles: ['Material: Acero inoxidable', 'Capacidad: 50ml'],
        precioOriginal: 50.00,
        precioDescuento: 45.00,
        imagenes: ['../images/productos/pistola.jpg']
    },
    {
        id: 'PROD0003',
        nombre: 'Kit inseminación',
        descripcion: 'Herramientas esenciales para la inseminación equina.',
        detalles: ['Incluye: 5 herramientas', 'Material: Policarbonato'],
        precioOriginal: 480.00,
        precioDescuento: 460.00,
        imagenes: ['../images/productos/kit_inseminacion.png']
    },
    {
        id: 'PROD0004',
        nombre: 'Nutrimin',
        descripcion: 'Suplemento mineral de alta calidad.',
        detalles: ['Formato: Inyectable', 'Cantidad: 500ml'],
        precioOriginal: 35.00,
        precioDescuento: 30.00,
        imagenes: ['../images/productos/nutrimin.png']
    },
    {
        id: 'PROD0005',
        nombre: 'Montura 100% Cuero',
        descripcion: 'Suplemento mineral de alta calidad.',
        detalles: ['Formato: Unidad', 'Peso: 18kg'],
        precioOriginal: 250.00,
        precioDescuento: 175.00,
        imagenes: ['../images/productos/montura.png', '../images/productos/montura2.jpg', '../images/productos/montura3.jpg']
    },
    {
        id: 'PROD0006',
        nombre: 'Vitamina B',
        descripcion: 'Suplemento mineral de alta calidad.',
        detalles: ['Formato: Inyectable', 'Cantidad: 500ml'],
        precioOriginal: 40.00,
        precioDescuento: 40.00,
        imagenes: ['../images/productos/vitaminab.jpg']
    },
    {
        id: 'PROD0007',
        nombre: 'Jaquima equina',
        descripcion: 'Accesorio para manejo equino, diseñado para proporcionar comodidad y control durante el manejo.',
        detalles: ['Formato: Unidad', 'Material: Nylon resistente', 'Color: Negro'],
        precioOriginal: 50.00,
        precioDescuento: 40.00,
        imagenes: ['../images/productos/jaquima.jpg', '../images/productos/jaquima2.jpg', '../images/productos/jaquima3.jpg']
    }

];

// Función para redirigir al detalle del producto
function verDetalleProducto(event) {
    event.preventDefault(); // Evita la navegación por defecto
    const idProducto = event.currentTarget.getAttribute('data-id');
    window.location.href = `detalle_producto.html?id=${idProducto}`;
}

// Función para cargar el detalle del producto dinámicamente
function cargarDetalleProducto() {
    const urlParams = new URLSearchParams(window.location.search);
    const idProducto = urlParams.get('id');
    const producto = productos.find(p => p.id === idProducto);

    if (producto) {
        // Actualizar título, descripción y precios
        document.getElementById('titulo-producto').textContent = producto.nombre;
        document.getElementById('descripcion-producto').textContent = producto.descripcion;
        document.getElementById('precio-original').textContent = `$${producto.precioOriginal.toFixed(2)}`;
        document.getElementById('precio-descuento').textContent = `$${producto.precioDescuento.toFixed(2)}`;
        document.getElementById('imagen-principal').src = producto.imagenes[0];

        // Cargar miniaturas (Limpiar primero para evitar duplicados)
        const miniaturas = document.getElementById('miniaturas');
        miniaturas.innerHTML = ''; // Limpia el contenedor de miniaturas antes de agregar nuevas
        producto.imagenes.forEach((img, index) => {
            const miniatura = document.createElement('img');
            miniatura.src = img;
            miniatura.className = 'img-thumbnail';
            if (index === 0) miniatura.classList.add('active'); // Marca la primera como activa
            miniatura.onclick = () => {
                document.getElementById('imagen-principal').src = img;
                document.querySelectorAll('.miniaturas img').forEach(img => img.classList.remove('active'));
                miniatura.classList.add('active');
            };
            miniaturas.appendChild(miniatura);
        });

        // Configurar botón para agregar al carrito
        document.getElementById('boton-agregar').onclick = () => {
            const cantidad = parseInt(document.getElementById('cantidad').value);
            if (cantidad > 0) {
                agregarAlCarrito(producto.id, producto.nombre, producto.precioDescuento, cantidad);
                alert(`${cantidad} unidad(es) de "${producto.nombre}" añadidas al carrito.`);
            } else {
                alert('La cantidad debe ser mayor a 0.');
            }
        };
    } else {
        alert('Producto no encontrado.');
    }
}


// Cambiar la imagen principal del producto
function cambiarImagen(src) {
    document.getElementById('imagen-principal').src = src;
}

// Función para agregar productos al carrito
function agregarAlCarrito(idProducto, nombreProducto, precioProducto, cantidad = 1) {
    const productoExistente = carrito.find(item => item.id === idProducto);
    if (productoExistente) {
        productoExistente.cantidad += cantidad;
    } else {
        carrito.push({ id: idProducto, nombre: nombreProducto, precio: precioProducto, cantidad });
    }
    actualizarCarrito();
    guardarCarrito();
}

// Función para quitar productos del carrito
function quitarDelCarrito(idProducto) {
    carrito = carrito.filter(item => {
        if (item.id === idProducto && item.cantidad > 1) {
            item.cantidad--;
            return true;
        }
        return item.id !== idProducto;
    });
    actualizarCarrito();
    guardarCarrito();
}

// Función para actualizar el número de productos en el icono del carrito
function actualizarCarrito() {
    const totalProductos = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    document.getElementById('contadorCarrito').textContent = totalProductos || '';
}

// Función para cargar los datos del carrito en la página carrito.html
function cargarCarritoEnTabla() {
    const tbody = document.getElementById("tablaCarrito");
    tbody.innerHTML = ""; // Limpiar la tabla

    let subtotal = 0;

    carrito.forEach((item, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.nombre}</td>
            <td>
                <input type="number" min="1" value="${item.cantidad}" class="form-control cantidad-input" data-index="${index}">
            </td>
            <td>$${item.precio.toFixed(2)}</td>
            <td>$${(item.cantidad * item.precio).toFixed(2)}</td>
            <td>
                <button class="btn btn-danger btn-sm" onclick="eliminarProducto(${index})">Eliminar</button>
            </td>
        `;
        tbody.appendChild(row);
        subtotal += item.cantidad * item.precio;
    });

    const iva = subtotal * 0.15;
    const total = subtotal + iva;

    // Actualizar subtotales, IVA y total en la tabla
    document.getElementById("subtotal").textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById("iva").textContent = `$${iva.toFixed(2)}`;
    document.getElementById("total").textContent = `$${total.toFixed(2)}`;

    // Escuchar cambios en las cantidades de los productos
    document.querySelectorAll(".cantidad-input").forEach(input => {
        input.addEventListener("change", (event) => {
            const index = event.target.dataset.index;
            const nuevaCantidad = parseInt(event.target.value);

            if (nuevaCantidad > 0) {
                carrito[index].cantidad = nuevaCantidad;
                guardarCarrito();
                cargarCarritoEnTabla(); // Recargar la tabla para reflejar los cambios
            } else {
                alert("La cantidad debe ser mayor a 0.");
                event.target.value = carrito[index].cantidad;
            }
        });
    });
}


// Guardar y cargar el carrito en localStorage
function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}
// app.js

document.addEventListener("DOMContentLoaded", () => {
    // Manejar clics en los productos
    const productosEnlaces = document.querySelectorAll(".producto");
    productosEnlaces.forEach(enlace => {
        enlace.addEventListener("click", (event) => {
            event.preventDefault(); // Evita la navegación predeterminada
            const idProducto = enlace.getAttribute("data-id");
            if (idProducto) {
                window.location.href = `detalle_producto.html?id=${idProducto}`;
            }
        });
    });

    // Cargar el carrito si es necesario
    cargarCarrito();

    // Detectar si estamos en la página de detalle del producto
    if (document.body.classList.contains('detalle-producto')) {
        cargarDetalleProducto();
    }

    // Detectar si estamos en la página del carrito
    if (document.body.classList.contains('carrito-page')) {
        cargarCarritoEnTabla();
    }
});

function cargarCarrito() {
    const carritoGuardado = JSON.parse(localStorage.getItem("carrito"));
    if (carritoGuardado) carrito = carritoGuardado;
    actualizarCarrito();
}

// Inicializar al cargar la página
window.onload = function () {
    cargarCarrito();

    // Detectar si estamos en la página de detalle del producto
    if (document.body.classList.contains('detalle-producto')) {
        cargarDetalleProducto();
    }

    // Detectar si estamos en la página del carrito
    if (document.body.classList.contains('carrito-page')) {
        cargarCarritoEnTabla();
    }
};
// Eliminar producto
function eliminarProducto(index) {
    carrito.splice(index, 1);
    guardarCarrito();
    cargarCarritoEnTabla();
}

const backendUrl = "https://backend-eliteagro-production.up.railway.app"; // URL del backend

function confirmarCompra() {
    if (carrito.length === 0) {
        alert('El carrito está vacío.');
        return;
    }

    const username = localStorage.getItem('username');
    if (!username) {
        alert('Inicia sesión para proceder con la compra');
        return;
    }

    // Obtener el ID del cliente desde el backend
    fetch(`${backendUrl}/api/clients/by-email?email=${username}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo obtener el ID del cliente.');
            }
            return response.json();
        })
        .then(data => {
            const client = { id: data.id }; // ID del cliente devuelto por el backend
            const address = "Pedido de prueba, Quito";
            const subtotal = carrito.reduce((acc, item) => acc + item.cantidad * item.precio, 0);
            const iva = subtotal * 0.15;
            const products = carrito.map(item => ({
                productId: item.id,
                quantity: item.cantidad,
                unitPrice: item.precio
            }));

            const orderData = {
                client,
                address,
                subtotal,
                iva,
                products
            };

            // Confirmar la compra
            return fetch(`${backendUrl}/api/products/create-order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            });
        })
        .then(response => response.json()) // Procesar como JSON
        .then(data => {
            if (data.status === "success") {
                alert(`Pedido creado exitosamente. ¡Gracias, ${username}, por tu compra!`);
                carrito = [];
                guardarCarrito();
                actualizarCarrito();
                cargarCarritoEnTabla();
            } else if (data.status === "error") {
                if (data.productId) {
                    alert(`Error: Producto con ID ${data.productId} no encontrado.`);
                } else if (data.productName) {
                    alert(`Error: Stock insuficiente para el producto "${data.productName}". Disponible: ${data.availableStock}, solicitado: ${data.requestedQuantity}.`);
                } else {
                    alert(`Error: ${data.message}`);
                }
            } else {
                alert('Respuesta inesperada del servidor.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}



// Función para generar un archivo PDF con la factura
function generarFacturaPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Configurar el encabezado de la factura
    doc.setFontSize(16);
    doc.text("Factura de Compra", 10, 10);
    doc.setFontSize(12);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 10, 20);
    doc.text(`Hora: ${new Date().toLocaleTimeString()}`, 10, 30);

    // Agregar los detalles del carrito
    let y = 50; // Posición inicial vertical
    let subtotal = 0;

    doc.setFontSize(14);
    doc.text("Detalles de la compra:", 10, y);
    y += 10;

    carrito.forEach((item, index) => {
        const totalProducto = item.cantidad * item.precio;
        subtotal += totalProducto;

        doc.setFontSize(12);
        doc.text(
            `${index + 1}. ${item.nombre} - Cantidad: ${item.cantidad} - Precio Unitario: $${item.precio.toFixed(
                2
            )} - Total: $${totalProducto.toFixed(2)}`,
            10,
            y
        );
        y += 10;
    });

    // Agregar subtotal, IVA y total
    const iva = subtotal * 0.12;
    const total = subtotal + iva;

    y += 10;
    doc.setFontSize(14);
    doc.text(`Subtotal: $${subtotal.toFixed(2)}`, 10, y);
    y += 10;
    doc.text(`IVA (12%): $${iva.toFixed(2)}`, 10, y);
    y += 10;
    doc.text(`Total: $${total.toFixed(2)}`, 10, y);

    // Guardar el archivo PDF
    doc.save(`factura_${Date.now()}.pdf`);
}

// Asociar el botón "Confirmar Compra" con la función
document.addEventListener("DOMContentLoaded", () => {
    const botonConfirmarCompra = document.getElementById("confirmarCompra");
    if (botonConfirmarCompra) {
        botonConfirmarCompra.addEventListener("click", confirmarCompra);
    }
});
// JavaScript para manejar el clic en los productos
document.addEventListener("DOMContentLoaded", () => {
    const productosEnlaces = document.querySelectorAll(".producto");  // Asegúrate de que las clases sean correctas
    productosEnlaces.forEach(enlace => {
        enlace.addEventListener("click", (event) => {
            event.preventDefault(); // Evita la navegación predeterminada
            const idProducto = enlace.getAttribute("data-id");
            if (idProducto) {
                window.location.href = `detalle_producto.html?id=${idProducto}`;
            }
        });
    });
});
// JavaScript para manejar el clic en los productos
document.addEventListener("DOMContentLoaded", () => {
    const productosEnlaces = document.querySelectorAll(".producto a");  // Seleccionamos los enlaces dentro de los productos
    productosEnlaces.forEach(enlace => {
        enlace.addEventListener("click", (event) => {
            event.preventDefault(); // Evita la navegación predeterminada
            const idProducto = enlace.getAttribute("data-id"); // Recuperamos el ID del producto
            if (idProducto) {
                window.location.href = `detalle_producto.html?id=${idProducto}`; // Redirigimos a la página de detalle del producto
            }
        });
    });
});




//FORMULARIO REGISTRO
document.getElementById('registroForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Evita que la página se recargue al enviar el formulario

    // Capturar los datos del formulario
    const form = document.getElementById('registroForm');
    const data = {
        nombre: form.elements['nombre'].value.trim(),
        apellido: form.elements['apellido'].value.trim(),
        cedula: form.elements['cedula'].value.trim(), // Capturar el campo cedula
        email: form.elements['email'].value.trim(),
        password: form.elements['password'].value.trim(),
        telefono: form.elements['telefono'].value.trim(),
        direccion: form.elements['direccion'].value.trim(),
        ciudad: form.elements['ciudad'].value.trim(),
        fechaNacimiento: form.elements['fechaNacimiento'].value,
        genero: form.elements['genero'].value,
    };

    // Validaciones básicas
    if (Object.values(data).some(field => !field)) {
        alert('Por favor, llena todos los campos.');
        return;
    }

    if (data.cedula.length < 10) { // Validar longitud mínima
        alert('La cédula debe tener al menos 10 caracteres.');
        return;
    }

    if (!data.email.includes('@') || !data.email.includes('.')) {
        alert('Por favor, ingresa un correo electrónico válido.');
        return;
    }

    if (data.password.length < 6) {
        alert('La contraseña debe tener al menos 6 caracteres.');
        return;
    }

    // Enviar datos al servidor
    fetch('/submit', {
        method: 'POST', // Método HTTP
        headers: {
            'Content-Type': 'application/json' // Tipo de contenido
        },
        body: JSON.stringify(data) // Serializar los datos del formulario en JSON
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al comunicarse con el servidor');
            }
            return response.json();
        })
        .then(data => {
            if (data.message) {
                alert(data.message); // Mostrar mensaje de éxito
                form.reset(); // Limpiar formulario
            } else {
                alert('Ocurrió un error al registrar el usuario.');
            }
        })
        .catch(error => {
            console.error('Error:', error); // Mostrar error en consola
            alert('Ocurrió un error al enviar el formulario.');
        });
});



// Recuperar los valores guardados al cargar la página desde sessionStorage
window.addEventListener('DOMContentLoaded', () => {
    const inputs = document.querySelectorAll('#registroForm input');
    inputs.forEach(input => {
        const savedValue = sessionStorage.getItem(input.id);
        if (savedValue) {
            input.value = savedValue;
        }
    });
});

// Guardar automáticamente en sessionStorage mientras el usuario escribe
document.querySelectorAll('#registroForm input').forEach(input => {
    input.addEventListener('input', (event) => {
        sessionStorage.setItem(event.target.id, event.target.value);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    const productResults = document.createElement('div'); // Crear contenedor dinámico para los resultados
    productResults.className = 'mt-4'; // Añadir margen superior
    searchForm.parentElement.appendChild(productResults); // Insertar el contenedor en el mismo nivel que el formulario

    searchForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Evitar envío tradicional del formulario
        const prefix = searchInput.value.trim(); // Limpiar espacios del input
        if (!prefix) {
            productResults.innerHTML = '<p class="text-danger">Por favor, ingresa un texto para buscar.</p>';
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/products/search?prefix=${encodeURIComponent(prefix)}`);
            if (response.ok) {
                const products = await response.json();
                if (products.length > 0) {
                    displayProducts(products);
                } else {
                    productResults.innerHTML = '<p class="text-warning">No se encontraron productos con ese prefijo.</p>';
                }
            } else {
                console.error('Error al obtener productos:', response.statusText);
                productResults.innerHTML = '<p class="text-danger">Error al obtener los productos. Intenta nuevamente más tarde.</p>';
            }
        } catch (error) {
            console.error('Error al realizar la petición:', error);
            productResults.innerHTML = '<p class="text-danger">Error al conectar con el servidor. Verifica tu conexión.</p>';
        }
    });

    function displayProducts(products) {
        productResults.innerHTML = ''; // Limpiar resultados anteriores
        products.forEach(product => {
            const productElement = document.createElement('div');
            productElement.classList.add('product', 'card', 'mb-3'); // Clases de Bootstrap
            productElement.style.maxWidth = '540px';
            productElement.innerHTML = `
                <div class="row g-0">
                    <div class="col-md-4">
                        ${product.fotos.length > 0
                    ? `<img src="${product.fotos[0].ruta}" class="img-fluid rounded-start" alt="${product.nombre}">`
                    : '<div class="text-center text-muted">Sin imagen disponible</div>'
                }
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <h5 class="card-title">${product.nombre}</h5>
                            <p class="card-text">${product.descripcion}</p>
                            <p class="card-text"><small class="text-muted">Precio: $${product.precio}</small></p>
                            <p class="card-text"><small class="text-muted">Stock: ${product.stock}</small></p>
                        </div>
                    </div>
                </div>
            `;
            productResults.appendChild(productElement);
        });
    }
});
// Obtener referencia al formulario del footer
const sugerenciaForm = document.querySelector(".footer-section form");

// Escuchar el evento de envío del formulario
sugerenciaForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevenir la recarga de la página

    // Obtener los datos del formulario
    const nombre = sugerenciaForm.querySelector("input[type='text']").value.trim();
    const correo = sugerenciaForm.querySelector("input[type='email']").value.trim();
    const mensaje = sugerenciaForm.querySelector("textarea").value.trim();

    // Validar los campos
    if (!nombre || !correo || !mensaje) {
        alert("Por favor, complete todos los campos.");
        return;
    }

    // Crear el objeto sugerencia
    const sugerencia = {
        sugNombre: nombre,
        sugCorreo: correo,
        sugMensaje: mensaje,
        empId: "EMP0001" // Ajusta esto según tu lógica para asociar la sugerencia a una empresa
    };

    try {
        // Enviar la sugerencia al backend
        const response = await fetch("http://localhost:8080/api/sugerencias", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(sugerencia)
        });

        if (!response.ok) throw new Error("Error al enviar la sugerencia.");

        alert("¡Sugerencia enviada exitosamente!");
        // Limpiar el formulario
        sugerenciaForm.reset();
    } catch (error) {
        alert(error.message);
    }
});
