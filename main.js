/* --- DATOS REMOTOS SIMULADOS --- */
const productosBazar = [
    {
        id: 1,
        nombre: "Maceta Nórdica",
        descripcion: "Maceta de porcelana con pintitas.",
        precio: "9.500",
        imagen: "/img/macetanordicainicio.png"
    },
    {
        id: 2,
        nombre: "Set de Baño",
        descripcion: "Set de porcelana para baño, incluye dispenser, porta cepillo y jabonera.",
        precio: "30.000",
        imagen: "/img/setporcelanainicio.jpeg"
    },
    {
        id: 3,
        nombre: "Frasco de Vidro con tapa de Corcho",
        descripcion: "Frasco de vidrio con tapa de corcho. Medida 20cm.",
        precio: "11.600",
        imagen: "/img/frascotapacorchoinicio.png"
    },
    
];

/* --- ESTADO DEL CARRITO --- */
let carrito = [];

/* --- FUNCIONES DE RENDERIZADO --- */
function cargarProductosAlInicio() {
    const contenedor = document.getElementById('contenedor-productos');
    contenedor.innerHTML = ""; 

    productosBazar.forEach(producto => {
        const div = document.createElement('div');
        div.className = 'tarjeta-producto';

        div.innerHTML = `
            <img class="imagen-producto" src="${producto.imagen}" alt="${producto.nombre}">

            <div class="info-producto">
                <h3 class="nombre-producto">${producto.nombre}</h3>
                <p class="descripcion-producto">${producto.descripcion}</p>
                <p class="precio-producto">$${producto.precio}</p>
            </div>

            <div class="controles-cantidad">
                <button class="boton-cantidad" onclick="ajustarContadorVisual(${producto.id}, -1)">-</button>
                <span class="numero-contador" id="contador-${producto.id}">1</span>
                <button class="boton-cantidad" onclick="ajustarContadorVisual(${producto.id}, 1)">+</button>
            </div>

            <button class="boton-agregar" onclick="meterAlCarrito(${producto.id})">
                Agregar al Carrito
            </button>
        `;

        contenedor.appendChild(div);
    });
}

function ajustarContadorVisual(id, delta) {
    const span = document.getElementById(`contador-${id}`);
    let actual = parseInt(span.innerText);
    actual += delta;
    if (actual < 1) actual = 1;
    span.innerText = actual;
}

/* --- LOGICA DEL CARRITO --- */
function meterAlCarrito(id) {
    const productoBase = productosBazar.find(p => p.id === id);
    const contadorSpan = document.getElementById(`contador-${id}`);
    const cantidadAAgregar = parseInt(contadorSpan.innerText);

    const productoEnCarrito = carrito.find(item => item.id === id);

    if (productoEnCarrito) {
        productoEnCarrito.cantidad += cantidadAAgregar;
    } else {
        carrito.push({
            ...productoBase,
            cantidad: cantidadAAgregar
        });
    }

    contadorSpan.innerText = 1;

    refrescarTotales();
    
    Swal.fire({
        text: `${productoBase.nombre} agregado`,
        icon: 'success',
        toast: true,
        position: 'top-end',
        timer: 2000,
        showConfirmButton: false
    });
}


function refrescarTotales() {
    const totalItems = carrito.reduce((suma, p) => suma + p.cantidad, 0);
    const totalPesos = carrito.reduce((suma, p) => suma + (p.precio * p.cantidad), 0);

    const badge = document.getElementById('cantidad-total');

    if (totalItems > 0) {
        badge.style.display = 'flex';
        badge.innerText = totalItems;
    } else {
        badge.style.display = 'none';
    }

    document.getElementById('precio-total-acumulado').innerText =
        totalPesos.toLocaleString();
}

function procesarCompra() {
    if (carrito.length === 0) {
        Swal.fire('Atención', 'Tu carrito está vacío', 'info');
        return;
    }

    Swal.fire({
        title: '¿Confirmar pedido?',
        text: `Total final: $${document.getElementById('precio-total-acumulado').innerText}`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, finalizar',
        cancelButtonText: 'Seguir comprando'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire('¡Éxito!', 'Pedido recibido correctamente.', 'success');
            carrito = [];
            refrescarTotales();
        }
    });
}

document.addEventListener('DOMContentLoaded', cargarProductosAlInicio);