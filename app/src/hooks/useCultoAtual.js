import { useEffect, useMemo, useState } from 'react';

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

// Intervalo para reavaliar o culto/data atual (1 minuto)
const INTERVALO_ATUALIZACAO_MS = 60 * 1000;

/**
 * Retorna o culto do dia, aba inicial e data formatada.
 * Se atualiza sozinho a cada minuto, então funciona corretamente mesmo
 * se o app ficar aberto passando da meia-noite ou trocando de período (manhã/tarde).
 */
export function useCultoAtual() {
  const [agora, setAgora] = useState(() => new Date());

  useEffect(() => {
    const intervalo = setInterval(() => {
      setAgora(new Date());
    }, INTERVALO_ATUALIZACAO_MS);
    return () => clearInterval(intervalo);
  }, []);

  return useMemo(() => {
    const dia  = agora.getDay();
    const hora = agora.getHours();

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
  }, [agora]);
}
