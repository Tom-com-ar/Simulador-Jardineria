// Obtener elementos
const agregarClienteBtn = document.getElementById('agregar-cliente-btn');
const asignarRecordatorioBtn = document.getElementById('asignar-recordatorio-btn');
const modal = document.getElementById('modalAgregarCliente');
const modalRecordatorio = document.getElementById('modalAsignarRecordatorio');
const cerrarBtn = document.querySelectorAll('.cerrar-btn');
const formAgregarCliente = document.getElementById('formAgregarCliente');
const formAsignarRecordatorio = document.getElementById('formAsignarRecordatorio');
const tablaClientes = document.getElementById('tablaClientes').getElementsByTagName('tbody')[0];
const tablaRecordatorios = document.getElementById('tablaRecordatorios').getElementsByTagName('tbody')[0];
const seleccionarCliente = document.getElementById('seleccionar-cliente');
const registrarPagoBtn = document.getElementById('registrar-pago-btn');
const modalPago = document.getElementById('modalRegistrarPago');
const formRegistrarPago = document.getElementById('formRegistrarPago');
const tablaPagos = document.getElementById('tablaPagos').getElementsByTagName('tbody')[0];
const descripcionRecordatorioSelect = document.getElementById('descripcion-recordatorio');

// Inicializar los arrays desde localStorage o crear nuevos si no existen
let clientes = JSON.parse(localStorage.getItem('clientes')) || [];
let recordatorios = JSON.parse(localStorage.getItem('recordatorios')) || [];
let pagos = JSON.parse(localStorage.getItem('pagos')) || [];

// Función para guardar en localStorage
function guardarEnLocalStorage() {
    localStorage.setItem('clientes', JSON.stringify(clientes));
    localStorage.setItem('recordatorios', JSON.stringify(recordatorios));
    localStorage.setItem('pagos', JSON.stringify(pagos));
}

// Función para cargar datos existentes
function cargarDatosExistentes() {
    // Cargar clientes
    clientes.forEach(cliente => {
        const nuevaFila = tablaClientes.insertRow();
        nuevaFila.insertCell(0).textContent = cliente.nombre;
        nuevaFila.insertCell(1).textContent = cliente.apellido;
        nuevaFila.insertCell(2).textContent = cliente.localidad;
        nuevaFila.insertCell(3).textContent = cliente.telefono;
        nuevaFila.insertCell(4).textContent = cliente.direccion;
        
        const celdaAcciones = nuevaFila.insertCell(5);
        const btnEliminar = document.createElement('button');
        btnEliminar.textContent = 'Eliminar';
        btnEliminar.className = 'btn-eliminar';
        btnEliminar.onclick = () => eliminarCliente(cliente, nuevaFila);
        celdaAcciones.appendChild(btnEliminar);
    });

    // Cargar recordatorios
    recordatorios.forEach(recordatorio => {
        const nuevaFila = tablaRecordatorios.insertRow();
        nuevaFila.insertCell(0).textContent = recordatorio.fecha;
        nuevaFila.insertCell(1).textContent = recordatorio.descripcion;
        nuevaFila.insertCell(2).textContent = recordatorio.cliente;
        
        const celdaAcciones = nuevaFila.insertCell(3);
        const btnEliminar = document.createElement('button');
        btnEliminar.textContent = 'Eliminar';
        btnEliminar.className = 'btn-eliminar';
        btnEliminar.onclick = () => eliminarRecordatorio(recordatorio, nuevaFila);
        celdaAcciones.appendChild(btnEliminar);
    });

    // Cargar pagos
    pagos.forEach(pago => {
        const nuevaFila = tablaPagos.insertRow();
        nuevaFila.insertCell(0).textContent = pago.cliente;
        nuevaFila.insertCell(1).textContent = pago.fecha;
        nuevaFila.insertCell(2).textContent = pago.concepto;
        nuevaFila.insertCell(3).textContent = `$${pago.monto}`;
        nuevaFila.insertCell(4).textContent = pago.metodoPago;
        
        const celdaAcciones = nuevaFila.insertCell(5);
        const btnEliminar = document.createElement('button');
        btnEliminar.textContent = 'Eliminar';
        btnEliminar.className = 'btn-eliminar';
        btnEliminar.onclick = () => eliminarPago(pago, nuevaFila);
        celdaAcciones.appendChild(btnEliminar);
    });
}

// Funciones para eliminar registros
function eliminarCliente(cliente, fila) {
    if (confirm('¿Está seguro de eliminar este cliente?')) {
        clientes = clientes.filter(c => c.nombre !== cliente.nombre || c.apellido !== cliente.apellido);
        fila.remove();
        guardarEnLocalStorage();
        llenarSelectorClientes(); // Actualizar selectores
    }
}

function eliminarRecordatorio(recordatorio, fila) {
    if (confirm('¿Está seguro de eliminar este recordatorio?')) {
        recordatorios = recordatorios.filter(r => 
            r.fecha !== recordatorio.fecha || 
            r.cliente !== recordatorio.cliente ||
            r.descripcion !== recordatorio.descripcion
        );
        fila.remove();
        guardarEnLocalStorage();
    }
}

function eliminarPago(pago, fila) {
    if (confirm('¿Está seguro de eliminar este pago?')) {
        pagos = pagos.filter(p => 
            p.fecha !== pago.fecha || 
            p.cliente !== pago.cliente ||
            p.monto !== pago.monto ||
            p.concepto !== pago.concepto ||
            p.metodoPago !== pago.metodoPago
        );
        fila.remove();
        guardarEnLocalStorage();
    }
}

// Abrir el modal para agregar cliente
agregarClienteBtn.addEventListener('click', function() {
    modal.style.display = 'flex'; // Mostrar modal
});

// Abrir el modal para asignar recordatorio
asignarRecordatorioBtn.addEventListener('click', function() {
    llenarSelectorClientes(); // Llenar el selector con los clientes
    modalRecordatorio.style.display = 'flex'; // Mostrar modal
});

// Cerrar el modal cuando se hace clic en el botón de cerrar
cerrarBtn.forEach(button => {
    button.addEventListener('click', function() {
        modal.style.display = 'none';
        modalRecordatorio.style.display = 'none';
        modalPago.style.display = 'none';
    });
});

// Cerrar el modal si se hace clic fuera del contenido del modal
window.addEventListener('click', function(event) {
    if (event.target === modal || event.target === modalRecordatorio || event.target === modalPago) {
        modal.style.display = 'none';
        modalRecordatorio.style.display = 'none';
        modalPago.style.display = 'none';
    }
});

// Agregar cliente a la tabla cuando se envía el formulario
formAgregarCliente.addEventListener('submit', function(event) {
    event.preventDefault(); // Evitar el envío del formulario

    // Obtener los valores de los campos del formulario
    const nombreCliente = document.getElementById('nombre-cliente').value;
    const apellidoCliente = document.getElementById('apellido-cliente').value;
    const localidadCliente = document.getElementById('localidad-cliente').value;
    const telefonoCliente = document.getElementById('telefono-cliente').value;
    const direccionCliente = document.getElementById('direccion-cliente').value;

    // Crear una nueva fila en la tabla de clientes
    const nuevaFila = tablaClientes.insertRow();
    const nuevoCliente = { nombre: nombreCliente, apellido: apellidoCliente, localidad: localidadCliente, telefono: telefonoCliente, direccion: direccionCliente };
    clientes.push(nuevoCliente); // Guardar el cliente para el selector de recordatorios

    // Insertar celdas con los datos del cliente
    nuevaFila.insertCell(0).textContent = nombreCliente;
    nuevaFila.insertCell(1).textContent = apellidoCliente;
    nuevaFila.insertCell(2).textContent = localidadCliente;
    nuevaFila.insertCell(3).textContent = telefonoCliente;
    nuevaFila.insertCell(4).textContent = direccionCliente;

    // Limpiar los campos del formulario
    formAgregarCliente.reset();

    // Cerrar el modal
    modal.style.display = 'none';

    const celdaAcciones = nuevaFila.insertCell(5);
    const btnEliminar = document.createElement('button');
    btnEliminar.textContent = 'Eliminar';
    btnEliminar.className = 'btn-eliminar';
    btnEliminar.onclick = () => eliminarCliente(nuevoCliente, nuevaFila);
    celdaAcciones.appendChild(btnEliminar);

    guardarEnLocalStorage();
});

// Función para llenar los selectores de clientes
function llenarSelectorClientes() {
    // Limpiar ambos selectores
    seleccionarCliente.innerHTML = '';
    const selectorPago = document.getElementById('seleccionar-cliente-pago');
    selectorPago.innerHTML = '';

    // Agregar opción por defecto
    const opcionDefault = document.createElement('option');
    opcionDefault.value = '';
    opcionDefault.textContent = 'Seleccionar cliente...';
    
    seleccionarCliente.appendChild(opcionDefault.cloneNode(true));
    selectorPago.appendChild(opcionDefault);

    // Llenar ambos selectores con los clientes
    clientes.forEach((cliente, index) => {
        const opcion = document.createElement('option');
        opcion.value = index;
        opcion.textContent = `${cliente.nombre} ${cliente.apellido}`;
        
        // Agregar la opción a ambos selectores
        seleccionarCliente.appendChild(opcion.cloneNode(true));
        selectorPago.appendChild(opcion);
    });
}

// Función para verificar si todos los campos están completos
function verificarCamposRecordatorio() {
    const fecha = document.getElementById('fecha-recordatorio').value;
    const descripcion = descripcionRecordatorioSelect.value;
    const cliente = document.getElementById('seleccionar-cliente').value;
    
    const submitButton = formAsignarRecordatorio.querySelector('button[type="submit"]');
    submitButton.disabled = !(fecha && descripcion && cliente);
}

// Agregar después de los otros event listeners de modales
registrarPagoBtn.addEventListener('click', function() {
    llenarSelectorClientes(); // Reutilizamos la función para llenar el selector de clientes
    modalPago.style.display = 'flex';
});

// Agregar el manejo del formulario de pagos
formRegistrarPago.addEventListener('submit', function(event) {
    event.preventDefault();

    const clienteIndex = document.getElementById('seleccionar-cliente-pago').value;
    const montoPago = document.getElementById('monto-pago').value;
    const fechaPago = document.getElementById('fecha-pago').value;
    const conceptoPago = document.getElementById('concepto-pago').value;
    const metodoPago = document.getElementById('metodo-pago').value;

    // Crear objeto de pago
    const nuevoPago = {
        cliente: clientes[clienteIndex].nombre + ' ' + clientes[clienteIndex].apellido,
        fecha: fechaPago,
        monto: montoPago,
        concepto: conceptoPago,
        metodoPago: metodoPago
    };

    // Agregar al array de pagos
    pagos.push(nuevoPago);

    // Crear una nueva fila en la tabla de pagos
    const nuevaFila = tablaPagos.insertRow();
    
    // Insertar los datos del pago
    nuevaFila.insertCell(0).textContent = nuevoPago.cliente;
    nuevaFila.insertCell(1).textContent = fechaPago;
    nuevaFila.insertCell(2).textContent = conceptoPago;
    nuevaFila.insertCell(3).textContent = `$${montoPago}`;
    nuevaFila.insertCell(4).textContent = metodoPago;

    const celdaAcciones = nuevaFila.insertCell(5);
    const btnEliminar = document.createElement('button');
    btnEliminar.textContent = 'Eliminar';
    btnEliminar.className = 'btn-eliminar';
    btnEliminar.onclick = () => eliminarPago(nuevoPago, nuevaFila);
    celdaAcciones.appendChild(btnEliminar);

    // Guardar en localStorage
    guardarEnLocalStorage();

    // Limpiar el formulario y cerrar el modal
    formRegistrarPago.reset();
    modalPago.style.display = 'none';
});

// Función para verificar campos del formulario de pago
function verificarCamposPago() {
    const cliente = document.getElementById('seleccionar-cliente-pago').value;
    const monto = document.getElementById('monto-pago').value;
    const fecha = document.getElementById('fecha-pago').value;
    const concepto = document.getElementById('concepto-pago').value;
    const metodoPago = document.getElementById('metodo-pago').value;
    
    const submitButton = formRegistrarPago.querySelector('button[type="submit"]');
    submitButton.disabled = !(cliente && monto && fecha && concepto && metodoPago);
}

// Agregar listeners para la verificación de campos
document.getElementById('seleccionar-cliente-pago').addEventListener('change', verificarCamposPago);
document.getElementById('monto-pago').addEventListener('input', verificarCamposPago);
document.getElementById('fecha-pago').addEventListener('input', verificarCamposPago);
document.getElementById('concepto-pago').addEventListener('input', verificarCamposPago);
document.getElementById('metodo-pago').addEventListener('change', verificarCamposPago);

// Agregar el evento submit para el formulario de recordatorios
formAsignarRecordatorio.addEventListener('submit', function(event) {
    event.preventDefault();

    // Obtener valores
    const clienteIndex = seleccionarCliente.value;
    const fechaRecordatorio = document.getElementById('fecha-recordatorio').value;
    const descripcionRecordatorio = descripcionRecordatorioSelect.value;

    // Validar que haya un cliente seleccionado
    if (clienteIndex === '') {
        alert('Por favor seleccione un cliente');
        return;
    }

    // Crear el recordatorio
    const nuevoRecordatorio = {
        fecha: fechaRecordatorio,
        descripcion: descripcionRecordatorio,
        cliente: `${clientes[clienteIndex].nombre} ${clientes[clienteIndex].apellido}`
    };

    // Agregar al array
    recordatorios.push(nuevoRecordatorio);

    // Agregar a la tabla
    const nuevaFila = tablaRecordatorios.insertRow();
    nuevaFila.insertCell(0).textContent = fechaRecordatorio;
    nuevaFila.insertCell(1).textContent = descripcionRecordatorio;
    nuevaFila.insertCell(2).textContent = nuevoRecordatorio.cliente;

    // Botón eliminar
    const celdaAcciones = nuevaFila.insertCell(3);
    const btnEliminar = document.createElement('button');
    btnEliminar.textContent = 'Eliminar';
    btnEliminar.className = 'btn-eliminar';
    btnEliminar.onclick = () => eliminarRecordatorio(nuevoRecordatorio, nuevaFila);
    celdaAcciones.appendChild(btnEliminar);

    // Guardar y limpiar
    localStorage.setItem('recordatorios', JSON.stringify(recordatorios));
    formAsignarRecordatorio.reset();
    modalRecordatorio.style.display = 'none';
});

// Función para verificar campos del recordatorio
function verificarCamposRecordatorio() {
    const fecha = document.getElementById('fecha-recordatorio').value;
    const descripcion = descripcionRecordatorioSelect.value;
    const cliente = document.getElementById('seleccionar-cliente').value;
    
    const submitButton = formAsignarRecordatorio.querySelector('button[type="submit"]');
    submitButton.disabled = !(fecha && descripcion && cliente);
}

// Agregar event listeners para la verificación de campos
document.getElementById('fecha-recordatorio').addEventListener('input', verificarCamposRecordatorio);
descripcionRecordatorioSelect.addEventListener('change', verificarCamposRecordatorio);
document.getElementById('seleccionar-cliente').addEventListener('change', verificarCamposRecordatorio);

// Cargar datos al iniciar la página
document.addEventListener('DOMContentLoaded', cargarDatosExistentes);
