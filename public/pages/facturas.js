document.addEventListener("DOMContentLoaded", () => {
    const backendUrl = "https://backend-eliteagro-production.up.railway.app"; // URL del backend
    const facturasTable = document.getElementById("facturasTable");
    const loadFacturasButton = document.getElementById("loadFacturas");
    const estadoForm = document.getElementById("estadoForm");
    const searchByIdButton = document.getElementById("searchById");
    const searchByCedulaButton = document.getElementById("searchByCedula");

    // Función para renderizar facturas
    function renderFacturas(facturas) {
        facturasTable.innerHTML = ""; // Limpiar la tabla
        facturas.forEach(factura => {
            // Crear fila principal de factura
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${factura.id}</td>
                <td>${factura.nombreCliente} ${factura.apellidoCliente}</td>
                <td>${factura.direccion}</td>
                <td>${factura.subtotal.toFixed(2)}</td>
                <td>${factura.iva.toFixed(2)}</td>
                <td>${factura.estado}</td>
                <td>
                    <button class="btn btn-info btn-sm ver-detalle" data-id="${factura.id}">Ver Detalle</button>
                    <button class="btn btn-warning btn-sm cambiar-estado" data-id="${factura.id}" data-estado="${factura.estado}">Cambiar Estado</button>
                </td>
            `;
            facturasTable.appendChild(tr);

            // Crear fila para mostrar los detalles
            const detalleRow = document.createElement("tr");
            detalleRow.classList.add("detalle-factura", "d-none");
            detalleRow.setAttribute("data-id", factura.id);
            detalleRow.innerHTML = `
                <td colspan="7">
                    <strong>Detalles:</strong>
                    <ul>
                        ${factura.detalles.map(detalle => `
                            <li>
                                Producto: ${detalle.nombreProducto}, Cantidad: ${detalle.cantidad}, Precio: $${detalle.precioUnitario.toFixed(2)}
                            </li>
                        `).join("")}
                    </ul>
                </td>
            `;
            facturasTable.appendChild(detalleRow);
        });

        // Configurar eventos para botones de detalles y estado
        configurarBotones();
    }

    // Configurar botones
    function configurarBotones() {
        document.querySelectorAll(".ver-detalle").forEach(btn => {
            btn.addEventListener("click", () => {
                const detalleRow = document.querySelector(`.detalle-factura[data-id="${btn.dataset.id}"]`);
                if (detalleRow) {
                    detalleRow.classList.toggle("d-none");
                } else {
                    console.error(`No se encontró la fila de detalles para la factura ID ${btn.dataset.id}`);
                }
            });
        });

        document.querySelectorAll(".cambiar-estado").forEach(btn => {
            btn.addEventListener("click", () => {
                const facturaId = btn.dataset.id;
                const estadoActual = btn.dataset.estado;
                document.getElementById("facturaId").value = facturaId;
                document.getElementById("estadoSelect").value = estadoActual;
                const modal = new bootstrap.Modal(document.getElementById("estadoModal"));
                modal.show();
            });
        });
    }

    // Cargar todas las facturas
    loadFacturasButton.addEventListener("click", async () => {
        try {
            const response = await fetch(`${backendUrl}/api/pedidos/detalles`);
            if (!response.ok) throw new Error("Error al cargar facturas.");
            const facturas = await response.json();
            renderFacturas(facturas);
        } catch (error) {
            console.error(error);
            alert("Error al cargar las facturas.");
        }
    });

    // Buscar factura por ID
    searchByIdButton.addEventListener("click", async () => {
        const id = document.getElementById("searchFacturaById").value.trim();
        if (!id) {
            alert("Por favor, ingresa un ID válido.");
            return;
        }

        try {
            const response = await fetch(`${backendUrl}/api/pedidos/detalles/${id}`);
            if (!response.ok) throw new Error("Factura no encontrada.");
            const factura = await response.json();
            renderFacturas([factura]);
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    });

    // Buscar facturas por cédula
    searchByCedulaButton.addEventListener("click", async () => {
        const cedula = document.getElementById("searchFacturaByCedula").value.trim();
        if (!cedula) {
            alert("Por favor, ingresa una cédula válida.");
            return;
        }

        try {
            const response = await fetch(`${backendUrl}/api/pedidos/detalles/cliente/${cedula}`);
            if (!response.ok) throw new Error("Pedidos no encontrados.");
            const facturas = await response.json();
            if (facturas.length === 0) {
                alert("No se encontraron pedidos para esta cédula.");
                return;
            }
            renderFacturas(facturas);
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    });

    // Cambiar estado de factura
    estadoForm.addEventListener("submit", async event => {
        event.preventDefault();
        const facturaId = document.getElementById("facturaId").value;
        const nuevoEstado = document.getElementById("estadoSelect").value;

        try {
            const response = await fetch(`${backendUrl}/api/pedidos/${facturaId}/estado`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ estado: nuevoEstado })
            });

            if (!response.ok) throw new Error("Error al cambiar el estado de la factura.");
            alert("Estado actualizado con éxito.");
            const modal = bootstrap.Modal.getInstance(document.getElementById("estadoModal"));
            modal.hide();
            loadFacturasButton.click(); // Recargar facturas
        } catch (error) {
            console.error(error);
            alert("Error al cambiar el estado.");
        }
    });
});
