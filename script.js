const platos = [
    { nombre: "Lasagna", precio: 2500, costo: 1300, descripcion: "Lasagna casera con salsa boloñesa.", imagen: "https://example.com/lasagna.jpg" },
    { nombre: "Pizza Margherita", precio: 2200, costo: 1000, descripcion: "Pizza tradicional con mozzarella y albahaca.", imagen: "https://example.com/pizza.jpg" },
    { nombre: "Risotto de Hongos", precio: 2300, costo: 1200, descripcion: "Risotto cremoso con champiñones frescos.", imagen: "https://example.com/risotto.jpg" },
    { nombre: "Ñoquis al Pesto", precio: 2100, costo: 1100, descripcion: "Ñoquis caseros con salsa pesto.", imagen: "https://example.com/gnocchi.jpg" },
    { nombre: "Fettuccine Alfredo", precio: 2400, costo: 1250, descripcion: "Fettuccine en salsa Alfredo cremosa.", imagen: "https://example.com/fettuccine.jpg" }
];

const bebidas = [
    { nombre: "Coca Cola", precio: 800, costo: 400, descripcion: "Gaseosa 500ml", imagen: "https://example.com/cocacola.jpg" },
    { nombre: "Vino Tinto", precio: 1800, costo: 900, descripcion: "Copa de vino Malbec", imagen: "https://example.com/vino.jpg" },
    { nombre: "Agua Saborizada", precio: 600, costo: 300, descripcion: "Botella 500ml", imagen: "https://example.com/aguasabor.jpg" },
    { nombre: "Agua Mineral", precio: 500, costo: 250, descripcion: "Botella 500ml sin gas", imagen: "https://example.com/aguamineral.jpg" },
    { nombre: "Agua con Gas", precio: 500, costo: 250, descripcion: "Botella 500ml con gas", imagen: "https://example.com/aguacongas.jpg" },
    { nombre: "Cerveza", precio: 1000, costo: 500, descripcion: "Lata de cerveza rubia", imagen: "https://example.com/cerveza.jpg" }
];

let pedido = [];
let historial = [];

function mostrarSeccion(id) {
    document.querySelectorAll('.seccion').forEach(s => s.classList.add('oculto'));
    document.getElementById(id).classList.remove('oculto');
    if (id === 'menu') {
        cargarItems('platos', platos);
        cargarItems('bebidas', bebidas);
    } else if (id === 'admin') {
        const password = prompt("Ingrese la contraseña de administrador:");
        if (password === 'bambino123') {
            mostrarHistorial();
        } else {
            alert("Contraseña incorrecta.");
            mostrarSeccion('inicio');

// Agregar botón discreto para acceso admin
setTimeout(() => {
    const pie = document.querySelector('footer');
    if (pie) {
        const btnAdmin = document.createElement('button');
        btnAdmin.textContent = "Admin";
        btnAdmin.style.background = "none";
        btnAdmin.style.border = "none";
        btnAdmin.style.color = "#666";
        btnAdmin.style.cursor = "pointer";
        btnAdmin.style.fontSize = "0.8rem";
        btnAdmin.style.marginTop = "0.5rem";
        btnAdmin.onclick = () => mostrarSeccion('admin');
        pie.appendChild(btnAdmin);
    }
}, 500);
        }
    }
}

function cargarItems(contenedorId, items) {
    const contenedor = document.getElementById(contenedorId);
    contenedor.innerHTML = "";
    items.forEach((item, index) => {
        const div = document.createElement('div');
        div.innerHTML = `
            <img src="${item.imagen}" alt="${item.nombre}">
            <h3>${item.nombre}</h3>
            <p>${item.descripcion}</p>
            <p><strong>$${item.precio}</strong></p>
            <button onclick="añadirAlPedido('${contenedorId}', ${index})">Añadir al pedido</button>
        `;
        contenedor.appendChild(div);
    });
}

function añadirAlPedido(tipo, index) {
    const item = tipo === 'platos' ? platos[index] : bebidas[index];
    pedido.push(item);
    alert(`${item.nombre} añadido al pedido.`);
}

function verPedido() {
    mostrarSeccion('pedido');
    const lista = document.getElementById('lista-pedido');
    lista.innerHTML = "";
    let total = 0;
    pedido.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.nombre} - $${item.precio}`;
        lista.appendChild(li);
        total += item.precio;
    });
    document.getElementById('total').innerHTML = `<strong>Total a pagar: $${total}</strong>`;
}

function confirmarPedido() {
    let total = 0;
    let costoTotal = 0;
    pedido.forEach(item => {
        total += item.precio;
        costoTotal += item.costo;
    });
    const ganancias = total - costoTotal;
    historial.push({ pedido: [...pedido], total, costoTotal, ganancias });
    alert("Muchas gracias por su pedido! En breve se lo acercaremos a su mesa. Gracias por elegir Bambino!");
    pedido = [];
    mostrarSeccion('inicio');

// Agregar botón discreto para acceso admin
setTimeout(() => {
    const pie = document.querySelector('footer');
    if (pie) {
        const btnAdmin = document.createElement('button');
        btnAdmin.textContent = "Admin";
        btnAdmin.style.background = "none";
        btnAdmin.style.border = "none";
        btnAdmin.style.color = "#666";
        btnAdmin.style.cursor = "pointer";
        btnAdmin.style.fontSize = "0.8rem";
        btnAdmin.style.marginTop = "0.5rem";
        btnAdmin.onclick = () => mostrarSeccion('admin');
        pie.appendChild(btnAdmin);
    }
}, 500);
}

function mostrarHistorial() {
    const contenedor = document.getElementById('admin-data');
    contenedor.innerHTML = "<h3>Historial de Pedidos</h3>";
    historial.forEach((registro, i) => {
        const div = document.createElement('div');
        div.classList.add('registro');
        const items = registro.pedido.map(p => `${p.nombre} ($${p.precio} / costo $${p.costo})`).join(', ');
        div.innerHTML = `
            <p><strong>Pedido ${i + 1}</strong></p>
            <p>Items: ${items}</p>
            <p>Total Ingresos: $${registro.total}</p>
            <p>Total Costos: $${registro.costoTotal}</p>
            <p>Ganancia: $${registro.ganancias}</p>
            <hr>
        `;
        contenedor.appendChild(div);
    });
}
