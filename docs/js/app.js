import { db } from "./firebase.js";
import { ref, push } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { alterar, definir, getDados, getTotal, resetar } from "./contadores.js";
import { iniciarHistorico } from "./historico.js";

// ── CULTO DO DIA ──────────────────────────────────────────────────────────────
const CULTOS = {
  0: { manha: 'EBD', tarde: 'Culto de Glorificação' },
  1: 'Culto de Louvor',
  2: 'Culto Doutrinário',
  3: 'Culto de Senhoras',
  4: 'Culto de Oração',
  5: 'Culto no Lar',
  6: 'Culto de Glorificação',
};
const DIAS = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];

function getCultoAtual() {
  const agora = new Date();
  const dia   = agora.getDay();
  const hora  = agora.getHours();
  let nome, abaInicial;
  if (dia === 0) {
    nome       = hora < 12 ? CULTOS[0].manha : CULTOS[0].tarde;
    abaInicial = hora < 12 ? 'ebd' : 'culto';
  } else {
    nome       = CULTOS[dia];
    abaInicial = 'culto';
  }
  return {
    nome,
    abaInicial,
    dataFormatada: agora.toLocaleDateString('pt-BR', {
      weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'
    }),
  };
}

// ── ABAS ──────────────────────────────────────────────────────────────────────
function trocarAba(aba) {
  document.querySelectorAll('.secao').forEach(s => s.classList.remove('ativa'));
  document.querySelectorAll('.aba-btn').forEach(b => b.classList.remove('ativo'));
  document.getElementById(`secao-${aba}`).classList.add('ativa');
  document.getElementById(`btn-${aba}`).classList.add('ativo');
}

// ── TOAST ─────────────────────────────────────────────────────────────────────
function toast(msg, tipo = 'sucesso') {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = `toast ${tipo} show`;
  setTimeout(() => el.classList.remove('show'), 2800);
}

// ── SALVAR ────────────────────────────────────────────────────────────────────
async function salvar(dados, btnId, textoBotao) {
  const btn = document.getElementById(btnId);
  btn.disabled = true;
  btn.textContent = 'Salvando...';
  try {
    await push(ref(db, 'historico'), dados);
    toast('Salvo com sucesso! ✓', 'sucesso');
    resetar(dados._secao);
    // limpa campo nome do evento se for evento
    if (dados._secao === 'evento') {
      document.getElementById('nome-evento').value = '';
      document.getElementById('obs-evento').value  = '';
    }
  } catch (e) {
    toast('Erro ao salvar. Verifique a conexão.', 'erro');
  } finally {
    btn.disabled = false;
    btn.textContent = textoBotao;
  }
}

// ── INIT ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const culto = getCultoAtual();

  document.getElementById('data-atual').textContent = culto.dataFormatada;
  document.getElementById('culto-nome').textContent = culto.nome;

  trocarAba(culto.abaInicial);

  // Botões de aba
  document.querySelectorAll('.aba-btn').forEach(btn => {
    btn.addEventListener('click', () => trocarAba(btn.dataset.aba));
  });

  // Contadores +/- via delegação
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-secao][data-campo][data-delta]');
    if (!btn) return;
    alterar(btn.dataset.secao, btn.dataset.campo, Number(btn.dataset.delta));
  });

  // Digitação manual no contador (apenas números) — mantém o estado
  // sincronizado para que os botões +/- continuem funcionando corretamente.
  function campoDoContador(el) {
    const [secao, ...resto] = el.id.split('_');
    return { secao, campo: resto.join('_') };
  }

  document.addEventListener('input', (e) => {
    const el = e.target;
    if (!el.classList.contains('contador-valor')) return;
    const somenteDigitos = el.value.replace(/[^0-9]/g, '');
    if (somenteDigitos !== el.value) el.value = somenteDigitos;
    const { secao, campo } = campoDoContador(el);
    definir(secao, campo, somenteDigitos);
  });

  // Ao focar, seleciona o valor todo para facilitar sobrescrever digitando
  document.addEventListener('focusin', (e) => {
    const el = e.target;
    if (el.classList.contains('contador-valor')) el.select();
  });

  // Se o campo ficar vazio ao sair, volta para 0
  document.addEventListener('focusout', (e) => {
    const el = e.target;
    if (!el.classList.contains('contador-valor')) return;
    if (el.value.trim() === '') {
      const { secao, campo } = campoDoContador(el);
      definir(secao, campo, 0);
    }
  });

  // ── Salvar EBD
  document.getElementById('btn-salvar-ebd').addEventListener('click', () => {
    salvar({
      tipo: 'EBD',
      data: culto.dataFormatada,
      ...getDados('ebd'),
      _secao: 'ebd',
    }, 'btn-salvar-ebd', 'Salvar EBD');
  });

  // ── Salvar Culto
  document.getElementById('btn-salvar-culto').addEventListener('click', () => {
    salvar({
      tipo: 'Culto',
      nomeCulto: culto.nome,
      data: culto.dataFormatada,
      ...getDados('culto'),
      _secao: 'culto',
    }, 'btn-salvar-culto', 'Salvar Culto');
  });

  // ── Salvar Evento
  document.getElementById('btn-salvar-evento').addEventListener('click', () => {
    const nome = document.getElementById('nome-evento').value.trim();
    if (!nome) { toast('Informe o nome do evento.', 'erro'); return; }

    const d = getDados('evento');

    salvar({
      tipo: 'Evento',
      nomeEvento: nome,
      data: culto.dataFormatada,
      membros: {
        adulto:        d.m_adulto,
        adolescente:   d.m_adolescente,
        intermediario: d.m_intermediario,
        crianca:       d.m_crianca,
        bebe:          d.m_bebe,
      },
      visitantes: {
        adulto:        d.v_adulto,
        adolescente:   d.v_adolescente,
        intermediario: d.v_intermediario,
        crianca:       d.v_crianca,
        bebe:          d.v_bebe,
      },
      total: getTotal('evento'),
      observacao: document.getElementById('obs-evento').value.trim(),
      _secao: 'evento',
    }, 'btn-salvar-evento', 'Salvar Evento');
  });

  // Histórico em tempo real
  iniciarHistorico();
});
