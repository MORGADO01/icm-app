/**
 * Gerencia os contadores de cada seção.
 * Cada seção tem seu próprio estado isolado.
 */

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
    v_adulto: 0, v_adolescente: 0, v_intermediario: 0,v_crianca: 0, v_bebe: 0,
  },
};

/**
 * Altera o valor de um campo em uma seção.
 * @param {string} secao - 'ebd' | 'culto' | 'evento'
 * @param {string} campo - nome do campo
 * @param {number} delta - +1 ou -1
 */
export function alterar(secao, campo, delta) {
  const estado = estados[secao];
  estado[campo] = Math.max(0, (estado[campo] || 0) + delta);

  // Atualiza o elemento na tela
  const el = document.getElementById(`${secao}_${campo}`);
  if (el) el.textContent = estado[campo];

  atualizarTotal(secao);
}

/**
 * Recalcula e exibe o total de uma seção.
 */
function atualizarTotal(secao) {
  const total = Object.values(estados[secao]).reduce((a, b) => a + b, 0);
  const el = document.getElementById(`total_${secao}`);
  if (el) el.textContent = total;
}

/**
 * Retorna os dados atuais de uma seção para salvar.
 */
export function getDados(secao) {
  return { ...estados[secao] };
}

/**
 * Retorna o total de uma seção.
 */
export function getTotal(secao) {
  return Object.values(estados[secao]).reduce((a, b) => a + b, 0);
}

/**
 * Zera todos os contadores de uma seção.
 */
export function resetar(secao) {
  const estado = estados[secao];
  Object.keys(estado).forEach((campo) => {
    estado[campo] = 0;
    const el = document.getElementById(`${secao}_${campo}`);
    if (el) el.textContent = 0;
  });
  atualizarTotal(secao);
}
