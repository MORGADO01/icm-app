import { db } from "./firebase.js";
import { ref, onValue, remove } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// Mapa de chave → label legível
const LABELS = {
  adulto:        'Adultos',
  adolescente:   'Adolescentes',
  intermediario: 'Intermediários',
  crianca:       'Crianças',
  bebe:          'Bebês',
};

export function iniciarHistorico() {
  const container = document.getElementById("historico");

  onValue(ref(db, "historico"), (snapshot) => {
    const lista = [];
    snapshot.forEach((child) => {
      lista.push({ id: child.key, ...child.val() });
    });
    renderizarHistorico(lista.reverse(), container);
  });
}

function renderizarHistorico(lista, container) {
  if (lista.length === 0) {
    container.innerHTML = '<p class="historico-vazio">Nenhum registro ainda.</p>';
    return;
  }
  container.innerHTML = lista.map(criarCard).join("");
}

// Gera uma linha  "Label ........... valor"
function linha(chave, valor) {
  if (!valor || valor === 0) return '';
  const label = LABELS[chave] || chave;
  return `<div class="hist-linha">
    <span class="hist-cat">${label}</span>
    <span class="hist-val">${valor}</span>
  </div>`;
}

// Gera um bloco "MEMBROS (n)" com todas as linhas
function bloco(titulo, dados) {
  const total = Object.values(dados).reduce((a, b) => a + (b || 0), 0);
  const linhas = Object.entries(dados).map(([k, v]) => linha(k, v)).join('');
  if (!linhas) return '';
  return `<div class="hist-grupo">
    <div class="hist-grupo-titulo">${titulo} (${total})</div>
    ${linhas}
  </div>`;
}

function criarCard(h) {
  const tipo = (h.tipo || 'Culto').toLowerCase();
  const classeExtra = tipo === 'ebd' ? 'tipo-ebd' : tipo === 'evento' ? 'tipo-evento' : '';

  let detalhes = '';
  let total = 0;

  if (h.tipo === 'EBD') {
    const am = h.adulto_membro    || 0;
    const cm = h.crianca_membro   || 0;
    const av = h.adulto_visitante || 0;
    const cv = h.crianca_visitante|| 0;
    total = am + cm + av + cv;
    detalhes = `
      <div class="hist-grupo">
        <div class="hist-grupo-titulo">Membros</div>
        ${linha('adulto', am)}
        ${linha('crianca', cm)}
      </div>
      <div class="hist-grupo">
        <div class="hist-grupo-titulo">Visitantes</div>
        ${linha('adulto', av)}
        ${linha('crianca', cv)}
      </div>`;

  } else if (h.tipo === 'Evento') {
    const m = h.membros    || {};
    const v = h.visitantes || {};
    const totalM = Object.values(m).reduce((a, b) => a + (b || 0), 0);
    const totalV = Object.values(v).reduce((a, b) => a + (b || 0), 0);
    total = h.total || (totalM + totalV);
    detalhes = bloco('Membros', m) + bloco('Visitantes', v);
    if (h.observacao) {
      detalhes += `<div class="hist-obs">${h.observacao}</div>`;
    }

  } else {
    // Culto normal
    const membros    = h.membros    || 0;
    const visitantes = h.visitantes || 0;
    total = membros + visitantes;
    detalhes = `<div class="hist-grupo">
      ${linha('adulto', membros)}
    </div>`;
    // reutiliza label genérico
    detalhes = `<div class="hist-grupo">
      <div class="hist-linha"><span class="hist-cat">Membros</span><span class="hist-val">${membros}</span></div>
      <div class="hist-linha"><span class="hist-cat">Visitantes</span><span class="hist-val">${visitantes}</span></div>
    </div>`;
  }

  const titulo = h.nomeCulto || h.nomeEvento || h.tipo || 'Registro';

  return `<div class="item-historico ${classeExtra}">
    <div class="item-header">
      <div>
        <div class="item-titulo">${titulo}</div>
        <div class="item-data">${h.data || ''}</div>
      </div>
      <button class="btn-excluir" onclick="excluirRegistro('${h.id}')" title="Excluir">🗑️</button>
    </div>
    <div class="hist-detalhes">${detalhes}</div>
    <div class="item-total">Total: ${total}</div>
  </div>`;
}

window.excluirRegistro = async function(id) {
  if (!confirm("Deseja excluir este registro?")) return;
  try {
    await remove(ref(db, "historico/" + id));
  } catch (e) {
    alert("Erro ao excluir. Verifique a conexão.");
  }
};
