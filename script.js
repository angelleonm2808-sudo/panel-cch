// Reloj (12 Horas AM/PM), Fecha y Notificador de Clase
function actualizarReloj() {
  const ahora = new Date();
  document.getElementById('reloj').textContent = ahora.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  document.getElementById('fecha').textContent = ahora.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'short' });
  verificarClaseActual(ahora);
}

function obtenerMensajeClase(ahora) {
  const dia = ahora.getDay(); // 1: Lun, 2: Mar, 3: Mié, 4: Jue, 5: Vie
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
  document.getElementById('texto-clase').textContent = obtenerMensajeClase(ahora);
}
setInterval(actualizarReloj, 1000);
actualizarReloj();

// Botón de Consulta Manual de Clase
document.getElementById('btn-consultar-clase').addEventListener('click', () => {
  const ahora = new Date();
  const hora12 = ahora.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: true });
  const mensaje = obtenerMensajeClase(ahora);
  alert(`Son las ${hora12}\n\n${mensaje}`);
});

// Nombre Editable y Guardado
const nombreEl = document.getElementById('nombre-usuario');
const nombreGuardado = localStorage.getItem('cch_nombre_usuario');
if (nombreGuardado) nombreEl.textContent = nombreGuardado;

nombreEl.addEventListener('blur', () => {
  localStorage.setItem('cch_nombre_usuario', nombreEl.textContent.trim() || 'Alumno CCH');
});

// Visibilidad del Mapa
const btnMapa = document.getElementById('btn-toggle-mapa');
const mapaCont = document.getElementById('mapa-container');
btnMapa.addEventListener('click', () => {
  if (mapaCont.style.display === 'none') {
    mapaCont.style.display = 'block';
  } else {
    mapaCont.style.display = 'none';
  }
});

// Bloc de Notas Persistente
const blocNotas = document.getElementById('bloc-notas');
blocNotas.value = localStorage.getItem('cch_apuntes') || '';
blocNotas.addEventListener('input', () => {
  localStorage.setItem('cch_apuntes', blocNotas.value);
});

// Gestor de Tareas y Calendario
let tareas = JSON.parse(localStorage.getItem('cch_tareas_v6')) || [];
const inputDesc = document.getElementById('tarea-desc');
const selectMat = document.getElementById('tarea-materia');
const inputFecha = document.getElementById('tarea-fecha');
const btnAgregar = document.getElementById('btn-agregar-tarea');
const listaTareas = document.getElementById('lista-tareas');

let currentDate = new Date();

function renderTareas() {
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

btnAgregar.addEventListener('click', () => {
  if (!inputDesc.value.trim()) return;
  tareas.push({
    desc: inputDesc.value.trim(),
    materia: selectMat.value,
    fecha: inputFecha.value,
    estado: 'Pendiente'
  });
  localStorage.setItem('cch_tareas_v6', JSON.stringify(tareas));
  inputDesc.value = '';
  inputFecha.value = '';
  renderTareas();
});

window.eliminarTarea = function(i) {
  tareas.splice(i, 1);
  localStorage.setItem('cch_tareas_v6', JSON.stringify(tareas));
  renderTareas();
};

window.cambiarEstado = function(i, val) {
  tareas[i].estado = val;
  localStorage.setItem('cch_tareas_v6', JSON.stringify(tareas));
};

function renderCalendar() {
  const monthYear = document.getElementById('cal-month-year');
  const grid = document.getElementById('calendar-grid');
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

document.getElementById('cal-prev').addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
});

document.getElementById('cal-next').addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
});

renderTareas();
