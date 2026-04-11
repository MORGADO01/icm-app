import { db } from "./firebase.js";
import { ref, push } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { alterar, getDados, getTotal, resetar } from "./contadores.js";
import { iniciarHistorico } from "./historico.js";

// ─── CULTO DO DIA ────────────────────────────────────────────────────────────

const CULTOS = {
  0: { manha: "EBD", tarde: "Culto de Glorificação" },
  1: "Culto de Louvor",
  2: "Culto Doutrinário",
  3: "Culto de Senhoras",
  4: "Culto de Oração",
  5: "Culto no Lar",
  6: "Culto de Glorificação",
};

const DIAS = ["Domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sábado"];

function getCultoAtual() {
  const agora = new Date();
  const dia = agora.getDay();
  const hora = agora.getHours();

  let nome, abaInicial;

  if (dia === 0) {
    nome = hora < 12 ? CULTOS[0].manha : CULTOS[0].tarde;
    abaInicial = hora < 12 ? "ebd" : "culto";
  } else {
    nome = CULTOS[dia];
    abaInicial = "culto";
  }

  return {
    nome,
    abaInicial,
    dataFormatada: agora.toLocaleDateString("pt-BR", {
      weekday: "long", day: "2-digit", month: "long", year: "numeric"
    }),
  };
}

// ─── ABAS ─────────────────────────────────────────────────────────────────────

function trocarAba(aba) {
  document.querySelectorAll(".secao").forEach(s => s.classList.remove("ativa"));
  document.querySelectorAll(".aba-btn").forEach(b => b.classList.remove("ativo"));

  document.getElementById(`secao-${aba}`).classList.add("ativa");
  document.getElementById(`btn-${aba}`).classList.add("ativo");
}

// ─── TOAST ────────────────────────────────────────────────────────────────────

function mostrarToast(msg, tipo = "sucesso") {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.className = `toast ${tipo} show`;
  setTimeout(() => toast.classList.remove("show"), 2800);
}

// ─── SALVAR ───────────────────────────────────────────────────────────────────

async function salvar(dados, btnId) {
  const btn = document.getElementById(btnId);
  btn.disabled = true;
  btn.textContent = "Salvando...";

  try {
    await push(ref(db, "historico"), dados);
    mostrarToast("Salvo com sucesso! ✓", "sucesso");
    resetar(dados._secao);
  } catch (e) {
    mostrarToast("Erro ao salvar. Verifique a conexão.", "erro");
  } finally {
    btn.disabled = false;
    btn.textContent = dados._textoBotao;
  }
}

// ─── INIT ─────────────────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  const culto = getCultoAtual();

  // Preenche header
  document.getElementById("data-atual").textContent = culto.dataFormatada;
  document.getElementById("culto-nome").textContent = culto.nome;

  // Aba inicial automática
  trocarAba(culto.abaInicial);

  // Botões de aba
  document.querySelectorAll(".aba-btn").forEach(btn => {
    btn.addEventListener("click", () => trocarAba(btn.dataset.aba));
  });

  // Botões +/- (delegação de eventos)
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-secao][data-campo][data-delta]");
    if (!btn) return;
    alterar(btn.dataset.secao, btn.dataset.campo, Number(btn.dataset.delta));
  });

  // Salvar EBD
  document.getElementById("btn-salvar-ebd").addEventListener("click", () => {
    salvar({
      tipo: "EBD",
      data: culto.dataFormatada,
      ...getDados("ebd"),
      _secao: "ebd",
      _textoBotao: "Salvar EBD",
    }, "btn-salvar-ebd");
  });

  // Salvar Culto
  document.getElementById("btn-salvar-culto").addEventListener("click", () => {
    salvar({
      tipo: "Culto",
      nomeCulto: culto.nome,
      data: culto.dataFormatada,
      ...getDados("culto"),
      _secao: "culto",
      _textoBotao: "Salvar Culto",
    }, "btn-salvar-culto");
  });

  // Salvar Evento
  document.getElementById("btn-salvar-evento").addEventListener("click", () => {
    const nome = document.getElementById("nome-evento").value.trim();
    if (!nome) { mostrarToast("Informe o nome do evento.", "erro"); return; }

    const dadosEvento = getDados("evento");
    const membros = {
      adulto: dadosEvento.m_adulto, adolescente: dadosEvento.m_adolescente,
      crianca: dadosEvento.m_crianca, bebe: dadosEvento.m_bebe,
    };
    const visitantes = {
      adulto: dadosEvento.v_adulto, adolescente: dadosEvento.v_adolescente,
      crianca: dadosEvento.v_crianca, bebe: dadosEvento.v_bebe,
    };

    salvar({
      tipo: "Evento",
      nomeEvento: nome,
      data: culto.dataFormatada,
      membros,
      visitantes,
      total: getTotal("evento"),
      observacao: document.getElementById("obs-evento").value.trim(),
      _secao: "evento",
      _textoBotao: "Salvar Evento",
    }, "btn-salvar-evento");
  });

  // Histórico em tempo real
  iniciarHistorico();
});
