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
        verificarNotificacionesTareas();
      } else {
        alert('Para recibir alertas de tareas a las 9:00 AM, activa las notificaciones.');
      }
    });
  }
}
window.pedirPermisoNotificaciones = pedirPermisoNotificaciones;

// ==========================================
// 2. INICIO DE SESIÓN Y NOMBRE
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
window.guardarSesion = guardarSesion;

// ==========================================
// 3. HORARIOS DINÁMICOS Y RELOJ
// ==========================================
let mostrandoTodoElHorario = false;

function ajustarHorarioPorDia() {
  if (mostrandoTodoElHorario) return;

  const ahora = new Date();
  const dia = ahora.getDay(); // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
  const columnas = document.querySelectorAll('.dia-columna');
  const tituloHorario = document.querySelector('#tira-materias h2');

  // Si es fin de semana (Sábado o Domingo)
  if (dia === 0 || dia === 6) {
    columnas.forEach(col => col.style.display = '');
    if (tituloHorario) tituloHorario.innerText = "📚 Fin de semana (Horario de referencia)";
    return;
  }

  // Si es día de semana (Lunes a Viernes)
  columnas.forEach(col => col.style.display = 'none');
  const columnasHoy = document.querySelectorAll(`.col-${dia}`);
  columnasHoy.forEach(col => col.style.display = '');

  const nombresDias = ["", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
  if (tituloHorario) {
    tituloHorario.innerText = `📚 Horario de Hoy (${nombresDias[dia]})`;
  }
}

function alternarVistaHorario() {
  mostrandoTodoElHorario = !mostrandoTodoElHorario;
  const btn = document.getElementById('btn-alternar-horario');
  const columnas = document.querySelectorAll('.dia-columna');
  const tituloHorario = document.querySelector('#tira-materias h2');

  if (mostrandoTodoElHorario) {
    columnas.forEach(col => col.style.display = '');
    if (btn) btn.innerText = "Ver solo hoy";
    if (tituloHorario) tituloHorario.innerText = "📚 Horario Completo (Semana)";
  } else {
    ajustarHorarioPorDia();
    if (btn) btn.innerText = "Ver toda la semana";
  }
}
window.alternarVistaHorario = alternarVistaHorario;

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
// 4. INICIALIZACIÓN Y EVENTOS DEL DOM
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  cargarSesion();
  ajustarHorarioPorDia();

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

  renderTareas();
  renderCalendar();
  verificarNotificacionesTareas();
});

setInterval(actualizarReloj, 1000);
setInterval(verificarNotificacionesTareas, 60000);

// ==========================================
// 5. TAREAS, NOTIFICACIONES Y CALENDARIO
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
          <option value="Hecha">✅ Entregada (Completar)</option>
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
    tareas.push({ desc: inputDesc.value.trim(), materia: selectMat.value, fecha: inputFecha.value, estado: 'Pendiente', notificada: false });
    localStorage.setItem('cch_tareas_v7', JSON.stringify(tareas));
    inputDesc.value = '';
    inputFecha.value = '';
    renderTareas();
  });
}

window.eliminarTarea = function(i) {
  tareas.splice(i, 1);
  localStorage.setItem('
