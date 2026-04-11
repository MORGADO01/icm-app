import { useMemo } from 'react';

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

/**
 * Retorna o culto do dia, aba inicial e data formatada.
 */
export function useCultoAtual() {
  return useMemo(() => {
    const agora = new Date();
    const dia   = agora.getDay();
    const hora  = agora.getHours();

    let nomeCulto, abaInicial;

    if (dia === 0) {
      nomeCulto  = hora < 12 ? CULTOS[0].manha : CULTOS[0].tarde;
      abaInicial = hora < 12 ? 'EBD' : 'Culto';
    } else {
      nomeCulto  = CULTOS[dia];
      abaInicial = 'Culto';
    }

    const dataFormatada = agora.toLocaleDateString('pt-BR', {
      weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
    });

    return { nomeCulto, abaInicial, dataFormatada, diaSemana: DIAS[dia] };
  }, []);
}
