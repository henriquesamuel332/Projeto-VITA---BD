import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBqYldHlwEbQnafhHl0lkHVouMgJYHEpB4",
  authDomain: "vita-688b1.firebaseapp.com",
  databaseURL: "https://vita-688b1-default-rtdb.firebaseio.com",
  projectId: "vita-688b1",
  storageBucket: "vita-688b1.firebasestorage.app",
  messagingSenderId: "423877579951",
  appId: "1:423877579951:web:5fa5656a9b382b247b305a"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

document.querySelectorAll('.profile-tab').forEach(tab => {
  tab.addEventListener('click', (event) => {
    event.preventDefault();
    document.querySelectorAll('.profile-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    tab.classList.add('active');
    const targetId = tab.getAttribute('data-target');
    document.querySelector(targetId).classList.add('active');
  });
});

const prevBtn = document.getElementById('prev-month');
const nextBtn = document.getElementById('next-month');
const slider = document.getElementById('calendar-slider');
const monthYearDisplay = document.getElementById('month-year-display');
const months = ["Outubro 2025", "Novembro 2025", "Dezembro 2025"];
let currentMonthIndex = 0;

function updateCalendarView() {
  slider.style.transform = `translateX(-${currentMonthIndex * 100}%)`;
  monthYearDisplay.textContent = months[currentMonthIndex];
  prevBtn.disabled = currentMonthIndex === 0;
  nextBtn.disabled = currentMonthIndex === months.length - 1;
}

nextBtn.addEventListener('click', () => {
  if (currentMonthIndex < months.length - 1) {
    currentMonthIndex++;
    updateCalendarView();
  }
});

prevBtn.addEventListener('click', () => {
  if (currentMonthIndex > 0) {
    currentMonthIndex--;
    updateCalendarView();
  }
});

updateCalendarView();

const modalHTML = `
<div id="modal-agenda" class="modal-overlay" style="
  display:none; position:fixed; top:0; left:0; right:0; bottom:0;
  background:rgba(0,0,0,0.5); justify-content:center; align-items:center;
  z-index:1000;">
  <div style="
    background:#fff; padding:2rem; border-radius:12px; width:90%; max-width:420px;
    box-shadow:0 4px 20px rgba(0,0,0,0.2); position:relative;">
    <button id="close-modal" style="
      position:absolute; top:8px; right:12px; border:none; background:none; font-size:20px; cursor:pointer;">✖</button>
    <h2 style="text-align:center; margin-bottom:1rem;">Agendar Consulta</h2>
    <form id="form-agenda" style="display:flex; flex-direction:column; gap:10px;">
      <input type="text" id="nome" placeholder="Seu nome completo" required style="padding:10px; border-radius:8px; border:1px solid #ccc;">
      <input type="text" id="telefone" placeholder="Telefone" required style="padding:10px; border-radius:8px; border:1px solid #ccc;">
      <select id="especialidade" required style="padding:10px; border-radius:8px; border:1px solid #ccc;">
        <option value="">Selecione a especialidade</option>
        <option>Clínico Geral</option>
        <option>Pediatria</option>
        <option>Cardiologia</option>
        <option>Enfermagem</option>
      </select>
      <input type="time" id="hora" required style="padding:10px; border-radius:8px; border:1px solid #ccc;">
      <input type="hidden" id="data-consulta">
      <button type="submit" style="
        background:#009879; color:#fff; padding:12px; border:none;
        border-radius:8px; font-weight:600; cursor:pointer;">
        Confirmar Agendamento
      </button>
    </form>
  </div>
</div>
`;

document.body.insertAdjacentHTML('beforeend', modalHTML);

const modal = document.getElementById('modal-agenda');
const closeModal = document.getElementById('close-modal');
const formAgenda = document.getElementById('form-agenda');

closeModal.addEventListener('click', () => modal.style.display = 'none');
modal.addEventListener('click', (e) => {
  if (e.target === modal) modal.style.display = 'none';
});

document.querySelectorAll('.calendar-dates button.consulta').forEach(btn => {
  btn.addEventListener('click', () => {
    const dia = btn.textContent;
    const mes = months[currentMonthIndex];
    document.getElementById('data-consulta').value = `${dia} ${mes}`;
    modal.style.display = 'flex';
  });
});

formAgenda.addEventListener('submit', (e) => {
  e.preventDefault();
  const nome = document.getElementById('nome').value.trim();
  const telefone = document.getElementById('telefone').value.trim();
  const especialidade = document.getElementById('especialidade').value;
  const hora = document.getElementById('hora').value;
  const dataConsulta = document.getElementById('data-consulta').value;

  const consultasRef = ref(db, 'consultas');
  push(consultasRef, {
    nome,
    telefone,
    especialidade,
    hora,
    dataConsulta,
    criadoEm: new Date().toISOString()
  }).then(() => {
    alert(`✅ Consulta agendada com sucesso para ${dataConsulta} às ${hora}!`);
    formAgenda.reset();
    modal.style.display = 'none';
  }).catch((error) => {
    console.error("Erro ao salvar consulta:", error);
    alert("❌ Ocorreu um erro ao agendar. Tente novamente.");
  });
});
