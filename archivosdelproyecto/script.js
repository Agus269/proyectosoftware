const platos = [
  { nombre: "Lasagna", precio: 10000, costo: 6000, imagen: "/imagenes/lasagna.png" },
  { nombre: "Pizza", precio: 12500, costo: 6000, imagen: "/imagenes/pizza.jpg" },
  { nombre: "Fettuccine", precio: 9000, costo: 4000, imagen: "/imagenes/fettuccine.jpg" },
  { nombre: "Risotto", precio: 8000, costo: 3800, imagen: "/imagenes/risotto.jpg" },
  { nombre: "Ñoquis", precio: 8500, costo: 4200, imagen: "/imagenes/ñoquis.jpg" }
];

const bebidas = [
  { nombre: "Gaseosa", precio: 3500, costo: 1500, imagen: "/imagenes/lineacoca.jpg", opciones: ["Coca Cola", "Sprite", "Fanta"] },
  { nombre: "Vino", precio: 11400, costo: 5000, imagen: "/imagenes/vino.jpg", opciones: ["Tinto", "Blanco", "Rosado"] },
  { nombre: "Agua", precio: 2000, costo: 950, imagen: "/imagenes/aguasingas.jpg", opciones:  ["Agua sin gas", "Agua con gas"]},
  { nombre: "Cerveza", precio: 4500, costo: 2250, imagen: "/imagenes/cerveza.jpg" },
  { nombre: "Agua Saborizada", precio: 3000, costo: 1500, imagen: "/imagenes/aquarius.jpg", opciones: ["Manzana", "Pomelo", "Pera", "Uva", "Naranja", "Pomelo rosado"] }
  

];

let pedido = [];
let historial = JSON.parse(localStorage.getItem("historial")) || [];

window.onload = () => {
  if (document.getElementById("platos")) cargarItems("platos", platos);
  if (document.getElementById("bebidas")) cargarItems("bebidas", bebidas);
  if (document.getElementById("lista-pedido")) mostrarPedido();
};

function cargarItems(idContenedor, lista) {
  const cont = document.getElementById(idContenedor);
  cont.innerHTML = "";

  lista.forEach((item, i) => {
    let extra = "";

    if (item.opciones && Array.isArray(item.opciones)) {
      extra = `<select id="${idContenedor}-opcion-${i}">`;
      item.opciones.forEach(opcion => {
        extra += `<option value="${opcion}">${opcion}</option>`;
      });
      extra += `</select>`;
    }

    cont.innerHTML += `
      <div>
        <h3>${item.nombre}</h3>
        <p>Precio: $${item.precio}</p>
        ${item.imagen ? `<img src="${item.imagen}" alt="${item.nombre}" class="imagenmenu" />` : ""}
        <br>
        ${extra}
        <input type="number" id="${idContenedor}-cant-${i}" min="1" value="1" />
        <button onclick="añadir('${idContenedor}', ${i})">Añadir</button>
      </div>
    `;
  });
}

function añadir(tipo, index) {
  const lista = tipo === "platos" ? platos : bebidas;
  const cantidad = parseInt(document.getElementById(`${tipo}-cant-${index}`).value);

  for (let i = 0; i < cantidad; i++) {
    let item = { ...lista[index] };
    if (item.opciones && Array.isArray(item.opciones)) {
      const opcionSeleccionada = document.getElementById(`${tipo}-opcion-${index}`).value;
      item.nombre += ` (${opcionSeleccionada})`;
    }
    pedido.push(item);
  }

  localStorage.setItem("pedidoActual", JSON.stringify(pedido));

  const btn = document.querySelector(`#${tipo}-cant-${index}`).nextElementSibling;
  const tick = document.createElement('span');
  tick.textContent = "✓ Añadido";
  tick.className = "tick";
  btn.parentElement.appendChild(tick);
  setTimeout(() => tick.classList.add("fade-in"), 10);
  setTimeout(() => tick.remove(), 2000);
}

function verPedido() {
  localStorage.setItem("pedidoActual", JSON.stringify(pedido));
  window.open("pedido.html", "_blank");
}

function mostrarPedido() {
  const lista = document.getElementById("lista-pedido");
  const totalElem = document.getElementById("total");
  const pedidoGuardado = JSON.parse(localStorage.getItem("pedidoActual")) || [];

  let total = 0;
  lista.innerHTML = "";

  pedidoGuardado.forEach(p => {
    lista.innerHTML += `<li>${p.nombre} - $${p.precio}</li>`;
    total += p.precio;
  });

  totalElem.textContent = "Total a pagar: $" + total;
}

function finalizarPedido() {
  const nombre = document.getElementById("nombre-cliente")?.value || "Cliente sin nombre";
  const pedidoActual = JSON.parse(localStorage.getItem("pedidoActual")) || [];

  let total = 0, costoTotal = 0;
  pedidoActual.forEach(p => {
    total += p.precio;
    costoTotal += p.costo;
  });

  historial.push({ pedido: pedidoActual, total, costoTotal, ganancia: total - costoTotal, nombre });
  localStorage.setItem("historial", JSON.stringify(historial));
  localStorage.removeItem("pedidoActual");
  pedido = [];

  alert(`Gracias ${nombre} por pedir en Bambino, su pedido estará listo pronto.`);
  window.close();
}

function borrarPedido() {
  if (confirm("¿Estás seguro de que querés borrar el pedido?")) {
    localStorage.removeItem("pedidoActual");
    location.reload();
  }
}


function validarAdmin() {
  const clave = document.getElementById("clave").value;
  const adminData = document.getElementById("admin-data");
  const formAdmin = document.getElementById("form-admin");

  if (clave === "bambino123") {
    formAdmin.classList.add("oculto");
    adminData.classList.remove("oculto");
    mostrarHistorial();
  } else {
    alert("Contraseña incorrecta.");
  }
}

function mostrarHistorial() {
  const adminData = document.getElementById("admin-data");
  adminData.innerHTML = "<h3>Historial de Pedidos</h3>";

  historial = JSON.parse(localStorage.getItem("historial")) || [];
  let totalIngresos = 0, totalCostos = 0, totalGanancia = 0;


  historial.forEach((h, i) => {
    totalIngresos += h.total;
    totalCostos += h.costoTotal;
    totalGanancia += h.ganancia;

    adminData.innerHTML += `
      <p><strong>Pedido ${i + 1}</strong><br>
      Cliente: ${h.nombre}<br>
      Ingreso: $${h.total} | Costos: $${h.costoTotal} | Ganancia: $${h.ganancia}</p>
      <hr>
    `;
  });

  adminData.innerHTML += `
    <h4>Totales</h4>
    <p>Ingresos Totales: $${totalIngresos}</p>
    <p>Costos Totales: $${totalCostos}</p>
    <p><strong>Ganancia Total: $${totalGanancia}</strong></p>
    <button onclick="limpiarHistorial()">Limpiar Historial</button>
  `;
}

function limpiarHistorial() {
  if (confirm("¿Seguro que querés borrar el historial de pedidos?")) {
    localStorage.removeItem("historial");
    location.reload();
  }
}
