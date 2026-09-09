// Reloj y Fecha
function actualizarReloj() {
  const ahora = new Date();
  document.getElementById('reloj').textContent = ahora.toLocaleTimeString('es-MX');
  document.getElementById('fecha').textContent = ahora.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'short' });
  verificarClaseActual(ahora);
}
setInterval(actualizarReloj, 1000);

// Notificador de Clase Actual
function verificarClaseActual(ahora) {
  const dia = ahora.getDay(); // 1: Lun, 2: Mar, 3: Mié, 4: Jue, 5: Vie
  const hora = ahora.getHours();
  const texto = document.getElementById('texto-clase');

  if (dia < 1 || dia > 5) {
    texto.textContent = "🎉 ¡Fin de semana! Sin clases programadas.";
    return;
  }

  if (hora >= 15 && hora < 17) {
    if (dia === 1 || dia === 3 || dia === 5) texto.textContent = "📖 Clase Actual: Matemáticas I — Edificio E-104";
    else texto.textContent = "📖 Clase Actual: Historia Universal — Edificio E-102";
  } else if (hora >= 17 && hora < 19) {
    if (dia === 1 || dia === 3 || dia === 5) texto.textContent = "📖 Clase Actual: TLRIID I — Edificio E-107";
    else texto.textContent = "📖 Clase Actual: Química I — Edificio E-113";
  } else if (hora >= 19 && hora < 21) {
    if (dia === 1 || dia === 3 || dia === 5) texto.textContent = "📖 Clase Actual: Taller de Cómputo — Edificio M-104";
    else texto.textContent = "📖 Clase Actual: Inglés I — Edificio L-101";
  } else if (hora < 15) {
    texto.textContent = "⏳ Tu turno inicia a las 15:00 hrs. ¡Prepárate para salir a CCH Sur!";
  } else {
    texto.textContent = "🌙 Clases terminadas por hoy. ¡Buen regreso a casa!";
  }
}

actualizarReloj();

// Pomodoro Timer
let tiempo = 25 * 60;
let timerId = null;
const displayPomo = document.getElementById('pomo-timer');
const btnStart = document.getElementById('pomo-start');
const btnReset = document.getElementById('pomo-reset');

function actualizarDisplayPomo() {
  const min = String(Math.floor(tiempo / 60)).padStart(2, '0');
  const seg = String(tiempo % 60).padStart(2, '0');
  displayPomo.textContent = `${min}:${seg}`;
}

btnStart.addEventListener('click', () => {
  if (timerId !== null) {
    clearInterval(timerId);
    timerId = null;
    btnStart.textContent = 'Reanudar';
  } else {
    btnStart.textContent = 'Pausar';
    timerId = setInterval(() => {
      if (tiempo > 0) {
        tiempo--;
        actualizarDisplayPomo();
      } else {
        clearInterval(timerId);
        alert('¡Tiempo de estudio completado! Toma un descanso.');
      }
    }, 1000);
  }
});

btnReset.addEventListener('click', () => {
  clearInterval(timerId);
  timerId = null;
  tiempo = 25 * 60;
  btnStart.textContent = 'Iniciar Focus';
  actualizarDisplayPomo();
});

// Tareas
const btnTarea = document.getElementById('btn-agregar-tarea');
const inputTarea = document.getElementById('tarea-desc');
const listaTareas = document.getElementById('lista-tareas');
let tareas = JSON.parse(localStorage.getItem('cch_tareas_v3')) || [];

function renderTareas() {
  listaTareas.innerHTML = '';
  tareas.forEach((t, i) => {
    const li = document.createElement('li');
    li.innerHTML = `<span>${t}</span> <small style="color:red; cursor:pointer;" onclick="eliminarTarea(${i})">✖</small>`;
    listaTareas.appendChild(li);
  });
}

btnTarea.addEventListener('click', () => {
  if (!inputTarea.value.trim()) return;
  tareas.push(inputTarea.value.trim());
  localStorage.setItem('cch_tareas_v3', JSON.stringify(tareas));
  inputTarea.value = '';
  renderTareas();
});

window.eliminarTarea = function(i) {
  tareas.splice(i, 1);
  localStorage.setItem('cch_tareas_v3', JSON.stringify(tareas));
  renderTareas();
};
renderTareas();




  
