// Estado de cada seção isolado
const estados = {
  ebd: {
    adulto_membro: 0,
    crianca_membro: 0,
    adulto_visitante: 0,
    crianca_visitante: 0,
  },
  culto: {
    membros: 0,
    visitantes: 0,
  },
  evento: {
    m_adulto: 0, m_adolescente: 0, m_intermediario: 0, m_crianca: 0, m_bebe: 0,
    v_adulto: 0, v_adolescente: 0, v_intermediario: 0, v_crianca: 0, v_bebe: 0,
  },
};

export function alterar(secao, campo, delta) {
  const estado = estados[secao];
  estado[campo] = Math.max(0, (estado[campo] || 0) + delta);
  const el = document.getElementById(`${secao}_${campo}`);
  if (el) el.value = estado[campo];
  atualizarTotal(secao);
}

// Usado quando o usuário digita o valor manualmente no campo.
// Garante número inteiro >= 0 e mantém o botão +/- funcionando normalmente depois.
export function definir(secao, campo, valorDigitado) {
  const estado = estados[secao];
  let valor = parseInt(valorDigitado, 10);
  if (isNaN(valor) || valor < 0) valor = 0;
  estado[campo] = valor;
  const el = document.getElementById(`${secao}_${campo}`);
  if (el) el.value = valor;
  atualizarTotal(secao);
  return valor;
}

function atualizarTotal(secao) {
  const total = Object.values(estados[secao]).reduce((a, b) => a + b, 0);
  const el = document.getElementById(`total_${secao}`);
  if (el) el.textContent = total;
}

export function getDados(secao) {
  return { ...estados[secao] };
}

export function getTotal(secao) {
  return Object.values(estados[secao]).reduce((a, b) => a + b, 0);
}

export function resetar(secao) {
  const estado = estados[secao];
  Object.keys(estado).forEach((campo) => {
    estado[campo] = 0;
    const el = document.getElementById(`${secao}_${campo}`);
    if (el) el.value = 0;
  });
  atualizarTotal(secao);
}
