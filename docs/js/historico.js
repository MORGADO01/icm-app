import { db } from "./firebase.js";
import { ref, onValue, remove } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

/**
 * Inicia a escuta em tempo real do histórico.
 * Atualiza a tela automaticamente quando algo muda no Firebase.
 */
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

/**
 * Renderiza a lista de registros no histórico.
 */
function renderizarHistorico(lista, container) {
  if (lista.length === 0) {
    container.innerHTML = `<p class="historico-vazio">Nenhum registro ainda.</p>`;
    return;
  }

  container.innerHTML = lista.map((h) => criarCardHistorico(h)).join("");
}

/**
 * Gera o HTML de um card de histórico.
 */
function criarCardHistorico(h) {
  const tipo = (h.tipo || "Culto").toLowerCase();
  const classeExtra = tipo === "ebd" ? "tipo-ebd" : tipo === "evento" ? "tipo-evento" : "";

  let detalhes = "";
  let total = 0;

  if (h.tipo === "EBD") {
    const am = h.adulto_membro || 0;
    const cm = h.crianca_membro || 0;
    const av = h.adulto_visitante || 0;
    const cv = h.crianca_visitante || 0;
    total = am + cm + av + cv;
    detalhes = `
      Membros adultos: ${am} &nbsp;|&nbsp; Crianças: ${cm}<br>
      Visitantes adultos: ${av} &nbsp;|&nbsp; Crianças: ${cv}
    `;
  } else if (h.tipo === "Evento") {
    const m = h.membros || {};
    const v = h.visitantes || {};
    const totalM = Object.values(m).reduce((a, b) => a + b, 0);
    const totalV = Object.values(v).reduce((a, b) => a + b, 0);
    total = h.total || (totalM + totalV);
    detalhes = `Membros: ${totalM} &nbsp;|&nbsp; Visitantes: ${totalV}`;
    if (h.observacao) detalhes += `<br><em>${h.observacao}</em>`;
  } else {
    // Culto
    const membros = h.membros || 0;
    const visitantes = h.visitantes || 0;
    total = membros + visitantes;
    detalhes = `Membros: ${membros} &nbsp;|&nbsp; Visitantes: ${visitantes}`;
  }

  return `
    <div class="item-historico ${classeExtra}">
      <div class="item-header">
        <div>
          <div class="item-titulo">${h.nomeCulto || h.nomeEvento || h.tipo}</div>
          <div class="item-data">${h.data || ""}</div>
        </div>
        <button class="btn-excluir" onclick="excluirRegistro('${h.id}')" title="Excluir">🗑️</button>
      </div>
      <div class="item-detalhe">${detalhes}</div>
      <div class="item-total">Total: ${total}</div>
    </div>
  `;
}

/**
 * Exclui um registro do Firebase após confirmação.
 * Exposta globalmente para ser chamada pelo onclick do HTML.
 */
window.excluirRegistro = async function (id) {
  if (!confirm("Deseja excluir este registro?")) return;
  try {
    await remove(ref(db, "historico/" + id));
  } catch (e) {
    alert("Erro ao excluir. Verifique a conexão.");
  }
};
