// Reloj y Fecha en tiempo real
function actualizarReloj() {
  const ahora = new Date();
  
  // Hora
  const horas = String(ahora.getHours()).padStart(2, '0');
  const minutos = String(ahora.getMinutes()).padStart(2, '0');
  const segundos = String(ahora.getSeconds()).padStart(2, '0');
  document.getElementById('reloj').textContent = `${horas}:${minutos}:${segundos}`;

  // Fecha
  const opcionesFecha = { weekday: 'long', day: 'numeric', month: 'short' };
  document.getElementById('fecha').textContent = ahora.toLocaleDateString('es-MX', opcionesFecha);
}
setInterval(actualizarReloj, 1000);
actualizarReloj();

// Guardar Notas Automáticamente
const notasArea = document.getElementById('notas-rapidas');
notasArea.value = localStorage.getItem('cch_notas') || '';

notasArea.addEventListener('input', () => {
  localStorage.setItem('cch_notas', notasArea.value);
});

// Lógica de Eventos / Calendario
const btnAgregar = document.getElementById('btn-agregar-evento');
const inputDesc = document.getElementById('evento-desc');
const inputFecha = document.getElementById('evento-fecha');
const listaEventos = document.getElementById('lista-eventos');

let eventos = JSON.parse(localStorage.getItem('cch_eventos')) || [];

function renderEventos() {
  listaEventos.innerHTML = '';
  eventos.forEach((evt, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${evt.desc}</span>
      <strong>${evt.fecha}</strong>
    `;
    li.addEventListener('dblclick', () => eliminarEvento(index));
    listaEventos.appendChild(li);
  });
}

function agregarEvento() {
  if (!inputDesc.value || !inputFecha.value) return;
  eventos.push({ desc: inputDesc.value, fecha: inputFecha.value });
  localStorage.setItem('cch_eventos', JSON.stringify(eventos));
  inputDesc.value = '';
  inputFecha.value = '';
  renderEventos();
}

function eliminarEvento(index) {
  eventos.splice(index, 1);
  localStorage.setItem('cch_eventos', JSON.stringify(eventos));
  renderEventos();
}

btnAgregar.addEventListener('click', agregarEvento);
renderEventos();