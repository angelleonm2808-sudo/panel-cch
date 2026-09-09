// Reloj y Notificador de Clase Actual con Edificios Exactos
function actualizarReloj() {
  const ahora = new Date();
  document.getElementById('reloj').textContent = ahora.toLocaleTimeString('es-MX');
  document.getElementById('fecha').textContent = ahora.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'short' });
  verificarClaseActual(ahora);
}

function verificarClaseActual(ahora) {
  const dia = ahora.getDay();
  const hora = ahora.getHours();
  const texto = document.getElementById('texto-clase');

  if (dia < 1 || dia > 5) {
    texto.textContent = "🎉 Fin de semana sin clases.";
    return;
  }

  if (hora >= 15 && hora < 17) {
    if (dia === 1 || dia === 3 || dia === 5) texto.textContent = "📖 Clase Actual: Matemáticas I — Edificio [B] 04";
    else texto.textContent = "📖 Clase Actual: Historia Universal — Edificio [V] 02";
  } else if (hora >= 17 && hora < 19) {
    if (dia === 1 || dia === 3) texto.textContent = "📖 Clase Actual: Taller de Cómputo — Edificio [Z] 07";
    else if (dia === 2 || dia === 4 || dia === 5) texto.textContent = "📖 Clase Actual: Química I — Edificio [E] 13";
  } else if (hora >= 19 && hora < 21) {
    if (dia === 1) texto.textContent = "📖 Clase Actual: Inglés I — Edificio [IN] 04";
    else if (dia === 5) texto.textContent = "📖 Clase Actual: Inglés I — Edificio [IN] 10";
    else texto.textContent = "📖 Clase Actual: TLRIID I — Edificio [L] 01";
  } else if (hora < 15) {
    texto.textContent = "⏳ Tu turno inicia a las 15:00 hrs. Prepara tus cosas para el CCH Sur.";
  } else {
    texto.textContent = "🌙 Clases concluidas por hoy.";
  }
}
setInterval(actualizarReloj, 1000);
actualizarReloj();

// Gestor de Tareas y Calendario
let tareas = JSON.parse(localStorage.getItem('cch_tareas_v4')) || [];
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
  localStorage.setItem('cch_tareas_v4', JSON.stringify(tareas));
  inputDesc.value = '';
  inputFecha.value = '';
  renderTareas();
});

window.eliminarTarea = function(i) {
  tareas.splice(i, 1);
  localStorage.setItem('cch_tareas_v4', JSON.stringify(tareas));
  renderTareas();
};

window.cambiarEstado = function(i, val) {
  tareas[i].estado = val;
  localStorage.setItem('cch_tareas_v4', JSON.stringify(tareas));
};

// Renderizar Calendario
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
      dayDiv.title = 'Tienes entregas pendientes';
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
