// ==========================================
// 1. PWA & NOTIFICACIONES
// ==========================================
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').catch(err => console.log(err));
}

function pedirPermisoNotificaciones() {
  if ('Notification' in window) {
    Notification.requestPermission().then((perm) => {
      if (perm === 'granted') {
        alert('¡Notificaciones activadas!');
      }
    });
  }
}

// ==========================================
// 2. INICIO DE SESIÓN Y NOMBRE (CORREGIDO)
// ==========================================
function cargarSesion() {
  const nombreGuardado = localStorage.getItem('cch_nombre_usuario');
  const cuentaGuardada = localStorage.getItem('cch_num_cuenta');
  
  if (nombreGuardado) {
    const elNombre = document.getElementById('nombre-usuario');
    const inputNombre = document.getElementById('input-nombre');
    if (elNombre) elNombre.textContent = nombreGuardado;
    if (inputNombre) inputNombre.value = nombreGuardado;
  }
  if (cuentaGuardada) {
    const elCuenta = document.getElementById('cuenta-display');
    const inputCuenta = document.getElementById('num-cuenta');
    if (elCuenta) elCuenta.textContent = `Cuenta: ${cuentaGuardada}`;
    if (inputCuenta) inputCuenta.value = cuentaGuardada;
  }
}

function guardarSesion() {
  const inputNombre = document.getElementById('input-nombre');
  const inputCuenta = document.getElementById('num-cuenta');
  
  if (!inputNombre || !inputCuenta) return;

  const nombre = inputNombre.value.trim();
  const cuenta = inputCuenta.value.trim();

  if (nombre !== '') {
    localStorage.setItem('cch_nombre_usuario', nombre);
    const elNombre = document.getElementById('nombre-usuario');
    if (elNombre) elNombre.textContent = nombre;
  }
  
  if (cuenta !== '') {
    localStorage.setItem('cch_num_cuenta', cuenta);
    const elCuenta = document.getElementById('cuenta-display');
    if (elCuenta) elCuenta.textContent = `Cuenta: ${cuenta}`;
  }

  alert('¡Datos guardados con éxito!');
}

// Asegurar que las funciones queden disponibles globalmente para los botones HTML
window.guardarSesion = guardarSesion;
window.pedirPermisoNotificaciones = pedirPermisoNotificaciones;

// ==========================================
// 3. HORARIOS Y REGISTRO DE ASISTENCIA
// ==========================================
function actualizarReloj() {
  const ahora = new Date();
  const relojEl = document.getElementById('reloj');
  const fechaEl = document.getElementById('fecha');

  if (relojEl) relojEl.textContent = ahora.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  if (fechaEl) fechaEl.textContent = ahora.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'short' });
  verificarClaseActual(ahora);
}

function obtenerMensajeClase(ahora) {
  const dia = ahora.getDay(); 
  const hora = ahora.getHours();

  if (dia < 1 || dia > 5) return "🎉 Fin de semana libre de clases.";

  if (hora >= 15 && hora < 17) {
    if (dia === 5) return "📖 Clase (03:00 - 04:00 p.m.): Matemáticas I [B-04] | ✨ Libres (04:00 - 05:00 p.m.)";
    if (dia === 1 || dia === 3) return "📖 Bloque 1 (03:00 - 05:00 p.m.): Matemáticas I — Edificio [B] 04";
    return "📖 Bloque 1 (03:00 - 05:00 p.m.): Historia Universal — Edificio [V] 02";
  } else if (hora >= 17 && hora < 19) {
    if (dia === 5) return "✨ Libres (05:00 - 06:00 p.m.) | 📖 Clase (06:00 - 07:00 p.m.): Química I [E-13]";
    if (dia === 1 || dia === 3) return "📖 Bloque 2 (05:00 - 07:00 p.m.): Taller de Cómputo — Edificio [Z] 07";
    return "📖 Bloque 2 (05:00 - 07:00 p.m.): Química I — Edificio [E] 13";
  } else if (hora >= 19 && hora < 21) {
    if (dia === 1) return "📖 Bloque 3 (07:00 - 09:00 p.m.): Inglés I — Edificio [IN] 04";
    if (dia === 5) return "📖 Bloque 3 (07:00 - 09:00 p.m.): Inglés I — Edificio [IN] 10";
    return "📖 Bloque 3 (07:00 - 09:00 p.m.): TLRIID I — Edificio [L] 01";
  } else if (hora < 15) {
    return "⏳ Tu turno vespertino inicia a las 03:00 p.m. Prepara tus cosas para el CCH Sur.";
  } else {
    return "🌙 Clases concluidas por hoy.";
  }
}

function verificarClaseActual(ahora) {
  const el = document.getElementById('texto-clase');
  if (el) el.textContent = obtenerMensajeClase(ahora);
}

function marcarAsistencia(estado) {
  const ahora = new Date();
  const fechaClave = ahora.toLocaleDateString('es-MX');
  const horaClave = ahora.getHours();
  
  const registro = {
    fecha: fechaClave,
    hora: `${horaClave}:00`,
    estado: estado,
    clase: obtenerMensajeClase(ahora)
  };

  let historial = JSON.parse(localStorage.getItem('cch_asistencias')) || [];
  historial.push(registro);
  localStorage.setItem('cch_asistencias', JSON.stringify(historial));

  const statusText = document.getElementById('registro-confirmado');
  if (statusText) {
    statusText.textContent = `Registrado: "${estado}" para la clase actual (${ahora.toLocaleTimeString('es-MX', {hour:'2-digit', minute:'2-digit'})})`;
  }
}

window.marcarAsistencia = marcarAsistencia;

// ==========================================
// 4. FUNCIONES DE MAPA Y BLOC DE NOTAS
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  cargarSesion();

  const btnConsultar = document.getElementById('btn-consultar-clase');
  if (btnConsultar) {
    btnConsultar.addEventListener('click', () => {
      const ahora = new Date();
      const hora12 = ahora.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: true });
      const mensaje = obtenerMensajeClase(ahora);
      alert(`Son las ${hora12}\n\n${mensaje}`);
    });
  }

  const btnMapa = document.getElementById('btn-toggle-mapa');
  const mapaCont = document.getElementById('mapa-container');
  if (btnMapa && mapaCont) {
    btnMapa.addEventListener('click', () => {
      mapaCont.style.display = (mapaCont.style.display === 'none') ? 'block' : 'none';
    });
  }

  const blocNotas = document.getElementById('bloc-notas');
  if (blocNotas) {
    blocNotas.value = localStorage.getItem('cch_apuntes') || '';
    blocNotas.addEventListener('input', () => {
      localStorage.setItem('cch_apuntes', blocNotas.value);
    });
  }

  renderTareas();
  renderCalendar();
});

setInterval(actualizarReloj, 1000);

// ==========================================
// 5. TAREAS Y CALENDARIO
// ==========================================
let tareas = JSON.parse(localStorage.getItem('cch_tareas_v7')) || [];
let currentDate = new Date();

function renderTareas() {
  const listaTareas = document.getElementById('lista-tareas');
  if (!listaTareas) return;
  listaTareas.innerHTML = '';
  tareas.forEach((t, i) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <strong>${t.materia}</strong>
        <small style="color:red; cursor:pointer;" onclick="eliminarTarea(${i})">✖ Borrar</small>
      </div>
      <div>${t.desc}</div>
      <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.8rem; margin-top:4px;">
        <span>Entrega: <b>${t.fecha || 'Sin fecha'}</b></span>
        <select onchange="cambiarEstado(${i}, this.value)">
          <option value="Pendiente" ${t.estado === 'Pendiente' ? 'selected' : ''}>⏳ Pendiente</option>
          <option value="Hecha" ${t.estado === 'Hecha' ? 'selected' : ''}>✅ Entregada</option>
        </select>
      </div>
    `;
    listaTareas.appendChild(li);
  });
  renderCalendar();
}

const btnAgregar = document.getElementById('btn-agregar-tarea');
if (btnAgregar) {
  btnAgregar.addEventListener('click', () => {
    const inputDesc = document.getElementById('tarea-desc');
    const selectMat = document.getElementById('tarea-materia');
    const inputFecha = document.getElementById('tarea-fecha');
    
    if (!inputDesc || !inputDesc.value.trim()) return;
    tareas.push({ desc: inputDesc.value.trim(), materia: selectMat.value, fecha: inputFecha.value, estado: 'Pendiente' });
    localStorage.setItem('cch_tareas_v7', JSON.stringify(tareas));
    inputDesc.value = '';
    inputFecha.value = '';
    renderTareas();
  });
}

window.eliminarTarea = function(i) {
  tareas.splice(i, 1);
  localStorage.setItem('cch_tareas_v7', JSON.stringify(tareas));
  renderTareas();
};

window.cambiarEstado = function(i, val) {
  tareas[i].estado = val;
  localStorage.setItem('cch_tareas_v7', JSON.stringify(tareas));
};

function renderCalendar() {
  const monthYear = document.getElementById('cal-month-year');
  const grid = document.getElementById('calendar-grid');
  if (!monthYear || !grid) return;

  grid.innerHTML = '';
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  monthYear.textContent = currentDate.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement('div');
    grid.appendChild(empty);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayDiv = document.createElement('div');
    dayDiv.className = 'cal-day';
    dayDiv.textContent = day;
    const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    if (tareas.some(t => t.fecha === formattedDate)) {
      dayDiv.classList.add('has-task');
    }
    grid.appendChild(dayDiv);
  }
}

const btnCalPrev = document.getElementById('cal-prev');
const btnCalNext = document.getElementById('cal-next');
if (btnCalPrev) btnCalPrev.addEventListener('click', () => { currentDate.setMonth(currentDate.getMonth() - 1); renderCalendar(); });
if (btnCalNext) btnCalNext.addEventListener('click', () => { currentDate.setMonth(currentDate.getMonth() + 1); renderCalendar(); });

// CALCULADORA
function calcularPromedio() {
  const inputs = document.querySelectorAll('.input-calif');
  let suma = 0, contadas = 0;
  inputs.forEach(input => {
    const val = parseFloat(input.value);
    if (!isNaN(val) && val >= 0 && val <= 10) { suma += val; contadas++; }
  });
  const resEl = document.getElementById('resultado-promedio');
  if (resEl) {
    if (contadas === 0) resEl.textContent = '⚠️ Ingresa al menos una nota.';
    else resEl.textContent = `🎯 Promedio: ${(suma / contadas).toFixed(2)}`;
  }
}

window.calcularPromedio = calcularPromedio;
