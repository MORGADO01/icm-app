import { useMemo } from 'react';

const CULTOS_POR_DIA = {
  0: { manha: 'EBD', tarde: 'Culto de Glorificação' },
  1: 'Culto de Louvor',
  2: 'Culto Doutrinário',
  3: 'Culto de Senhoras',
  4: 'Culto de Oração',
  5: 'Culto no Lar',
  6: 'Culto de Glorificação',
};

/**
 * Retorna o nome do culto atual e a aba inicial recomendada.
 */
export function useCultoAtual() {
  return useMemo(() => {
    const agora = new Date();
    const dia = agora.getDay();
    const hora = agora.getHours();

    let nomeCulto = '';
    let abaInicial = 'culto'; // 'ebd' | 'culto' | 'evento'

    if (dia === 0) {
      if (hora < 12) {
        nomeCulto = CULTOS_POR_DIA[0].manha;
        abaInicial = 'ebd';
      } else {
        nomeCulto = CULTOS_POR_DIA[0].tarde;
        abaInicial = 'culto';
      }
    } else {
      nomeCulto = CULTOS_POR_DIA[dia];
      abaInicial = 'culto';
    }

    const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

    return {
      nomeCulto,
      abaInicial,
      diaSemana: diasSemana[dia],
      dataFormatada: agora.toLocaleDateString('pt-BR'),
    };
  }, []);
}
