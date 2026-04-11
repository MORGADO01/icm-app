import { db } from '../config/firebase';
import { ref, push, remove, onValue, off } from 'firebase/database';

const CAMINHO = 'historico';

/**
 * Salva um culto ou EBD no Realtime Database.
 * @param {object} dados - { tipo, data, membros, visitantes, ... }
 */
export async function salvarRegistro(dados) {
  try {
    const novoRef = await push(ref(db, CAMINHO), dados);
    return { sucesso: true, id: novoRef.key };
  } catch (erro) {
    console.error('Erro ao salvar:', erro);
    return { sucesso: false, erro };
  }
}

/**
 * Exclui um registro pelo ID.
 */
export async function excluirRegistro(id) {
  try {
    await remove(ref(db, `${CAMINHO}/${id}`));
    return { sucesso: true };
  } catch (erro) {
    console.error('Erro ao excluir:', erro);
    return { sucesso: false, erro };
  }
}

/**
 * Escuta o histórico em tempo real.
 * @param {function} callback - chamado com array de registros (mais recente primeiro)
 * @returns {function} unsubscribe — chame para parar de ouvir
 */
export function ouvirHistorico(callback) {
  const dbRef = ref(db, CAMINHO);

  onValue(dbRef, (snapshot) => {
    const lista = [];
    snapshot.forEach((child) => {
      lista.push({ id: child.key, ...child.val() });
    });
    callback(lista.reverse()); // mais recente primeiro
  });

  // Retorna função de limpeza para usar no useEffect
  return () => off(dbRef);
}
