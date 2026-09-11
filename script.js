// ==========================================
// 1. REGISTRO PWA Y SISTEMA DE NOTIFICACIONES
// ==========================================
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js')
    .then(() => console.log('App lista para funcionar sin internet'))
    .catch((err) => console.log('Error al registrar Service Worker:', err));
}

function pedirPermisoNotificaciones() {
  if ('Notification' in window) {
    Notification.requestPermission().then((perm) => {
      if (perm === 'granted') {
        alert('¡Notificaciones activadas! Te avisaremos 15 minutos antes de tus clases.');
        revisarNotificacionesClase();
      } else {
        alert('Permiso de notificaciones denegado.');
      }
    });
  } else {
    alert('Tu navegador no soporta notificaciones locales.');
  }
}

// HORARIO DE CLASES GRUPO 146B (TURNO VESPERTINO)
const horarioNotificaciones = [
  { dia: 1, hora: "15:00", materia: "Matemáticas I", salon: "Edificio [B] 04" },
  { dia: 1, hora: "17:00", materia: "Taller de Cómputo", salon: "Edificio [Z] 07" },
  { dia: 1, hora: "19:00", materia: "Inglés I", salon: "Edificio [IN] 04" },
  { dia: 2, hora: "15:00", materia: "Historia Universal", salon: "Edificio [V] 02" },
  { dia: 2, hora: "17:00", materia: "Química I", salon: "Edificio [E] 13" },
  { dia: 2, hora: "19:00", materia: "TLRIID I", salon: "Edificio [L] 01" },
  { dia: 3, hora: "15:00", materia: "Matemáticas I", salon: "Edificio [B] 04" },
  { dia: 3, hora: "17:00", materia: "Taller de Cómputo", salon: "Edificio [Z] 07" },
  { dia: 3, hora: "19:00", materia: "TLRIID I", salon: "Edificio [L] 01" },
  { dia: 4, hora: "15:00", materia: "Historia Universal", salon: "Edificio [V] 02" },
  { dia: 4, hora: "17:00", materia: "Química I", salon: "Edificio [E] 13" },
  { dia: 4, hora: "19:00", materia: "TLRIID I", salon: "Edificio [L] 01" },
  { dia: 5, hora: "15:00", materia: "Matemáticas I", salon: "Edificio [B] 04" },
  { dia: 5, hora: "18:00", materia: "Química I", salon: "Edificio [E] 13" },
  { dia: 5, hora: "19:00", materia: "Inglés I", salon: "Edificio [IN] 10" }
];

function revisarNotificacionesClase() {
  if (Notification.permission !== 'granted') return;

  const ahora = new Date();
  const diaSemana = ahora.getDay();
  const horas = ahora.getHours();
  const minutos = ahora.getMinutes();
  const horaActual = `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;

  horarioNotificaciones.forEach(clase => {
    if (clase.dia === diaSemana) {
      let [h, m] = clase.hora.split(':').map(Number);
      let mNotif = m - 15;
      let hNotif = h;
      if (mNotif < 0) {
        mNotif += 60;
        hNotif -= 1;
      }
      let tiempoNotif = `${hNotif.toString().padStart(2, '0')}:${mNotif.toString().padStart(2, '0')}`;

      if (horaActual === tiempoNotif) {
        new Notification(`⏰ ¡Próxima Clase en 15 min!`, {
          body: `${clase.materia} en ${clase.salon}`,
          icon: 'https://cdn-icons-png.flaticon.com/512/2232/2232688.png'
        });
      }
    }
  });
}

// ==========================================
// 2. RELOJ Y MENSAJES DE ESTADO DE CLASE
// ==========================================
function actualizarReloj() {
  const ahora = new Date();
  document.getElementById('reloj').textContent = ahora.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  document.getElementById('fecha').textContent = ahora.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'short' });
  verificarClaseActual(ahora);
  revisarNotificacionesClase();
}

function obtenerMensajeClase(ahora) {
  const dia = ahora.getDay(); 
  const hora = ahora.getHours();

  if (dia < 1 || dia > 5) return "🎉 Fin de semana sin clases.";

  if (hora >= 15 && hora < 16) {
    if (dia === 1 || dia === 3 || dia === 5) return "📖 Clase Actual (03:00 p.m. - 04:00 p.m.): Matemáticas I — Edificio [B] 04";
    else return "📖 Clase Actual (03:00 p.m. - 04:00 p.m.): Historia Universal — Edificio [V] 02";
  } else if (hora >= 16 && hora < 17) {
    if (dia === 5) return "✨ Horas Libres (04:00 p.m. - 06:00 p.m.). ¡Tiempo para descansar o repasar!";
    else if (dia === 1 || dia === 3) return "📖 Clase Actual (04:00 p.m. - 05:00 p.m.): Matemáticas I — Edificio [B] 04";
    else return "📖 Clase Actual (04:00 p.m. - 05:00 p.m.): Historia Universal — Edificio [V] 02";
  } else if (hora >= 17 && hora < 18) {
    if (dia === 5) return "✨ Horas Libres (04:00 p.m. - 06:00 p.m.). ¡Tiempo para descansar o repasar!";
    else if (dia === 1 || dia === 3) return "📖 Clase Actual (05:00 p.m. - 06:00 p.m.): Taller de Cómputo — Edificio [Z] 07";
    else return "📖 Clase Actual (05:00 p.m. - 06:00 p.m.): Química I — Edificio [E] 13";
  } else if (hora >= 18 && hora < 19) {
    if (dia === 1 || dia === 3) return "📖 Clase Actual (06:00 p.m. - 07:00 p.m.): Taller de Cómputo — Edificio [Z] 07";
    else return "📖 Clase Actual (06:00 p.m. - 07:00 p.m.): Química I — Edificio [E] 13";
  } else if (hora >= 19 && hora < 21) {
    if (dia === 1) return "📖 Clase Actual (07:00 p.m. - 09:00 p.m.): Inglés I — Edificio [IN] 04";
    else if (dia === 5) return "📖 Clase Actual (07:00 p.m. - 09:00 p.m.): Inglés I — Edificio [IN] 10";
    else return "📖 Clase Actual (07:00 p.m. - 09:00 p.m.): TLRIID I — Edificio [L] 01";
  } else if (hora < 15) {
    return "⏳ Tu turno inicia a las 03:00 p.m. Prepara tus cosas para el CCH Sur.";
  } else {
    return "🌙 Clases concluidas por hoy.";
  }
}

function verificarClaseActual(ahora) {
  const el = document.getElementById('texto-clase');
  if (el) el.textContent = obtenerMensajeClase(ahora);
}

setInterval(actualizarReloj, 1000);
actualizarReloj();

const btnConsultar = document.getElementById('btn-consultar-clase');
if (btnConsultar) {
  btnConsultar.addEventListener('click', () => {
    const ahora = new Date();
    const hora12 = ahora.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: true });
    const mensaje = obtenerMensajeClase(ahora);
    alert(`Son las ${hora12}\n\n${mensaje}`);
  });
}

// ==========================================
// 3. PERSISTENCIA DE NOMBRE Y NOTAS
// ==========================================
const nombreEl = document.getElementById('nombre-usuario');
if (nombreEl) {
  const nombreGuardado = localStorage.getItem('cch_nombre_usuario');
  if (nombreGuardado) nombreEl.textContent = nombreGuardado;
  nombreEl.addEventListener('blur', () => {
    localStorage.setItem('cch_nombre_usuario', nombreEl.textContent.trim() || 'Alumno CCH');
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

// ==========================================
// 4. CONTROL DE TAREAS Y CALENDARIO
// ==========================================
let tareas = JSON.parse(localStorage.getItem('cch_tareas_v7')) || [];
const inputDesc = document.getElementById('tarea-desc');
const selectMat = document.getElementById('tarea-materia');
const inputFecha = document.getElementById('tarea-fecha');
const btnAgregar = document.getElementById('btn-agregar-tarea');
const listaTareas = document.getElementById('lista-tareas');

let currentDate = new Date();

function renderTareas() {
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
        <select class="estado-select" onchange="cambiarEstado(${i}, this.value)">
          <option value="Pendiente" ${t.estado === 'Pendiente' ? 'selected' : ''}>⏳ Pendiente</option>
          <option value="Hecha" ${t.estado === 'Hecha' ? 'selected' : ''}>✅ Sí la hice</option>
          <option value="No entregada" ${t.estado === 'No entregada' ? 'selected' : ''}>❌ No la hice</option>
          <option value="Sin tarea" ${t.estado === 'Sin tarea' ? 'selected' : ''}>⚪ No dejaron</option>
        </select>
      </div>
    `;
    listaTareas.appendChild(li);
  });
  renderCalendar();
}

if (btnAgregar) {
  btnAgregar.addEventListener('click', () => {
    if (!inputDesc.value.trim()) return;
    tareas.push({
      desc: inputDesc.value.trim(),
      materia: selectMat.value,
      fecha: inputFecha.value,
      estado: 'Pendiente'
    });
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
    const tieneTarea = tareas.some(t => t.fecha === formattedDate);

    if (tieneTarea) {
      dayDiv.classList.add('has-task');
    }

    grid.appendChild(dayDiv);
  }
}

const btnCalPrev = document.getElementById('cal-prev');
const btnCalNext = document.getElementById('cal-next');

if (btnCalPrev) {
  btnCalPrev.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
  });
}

if (btnCalNext) {
  btnCalNext.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
  });
}

renderTareas();
