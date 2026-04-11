import React, { useState } from 'react';
import { ScrollView, Alert, StyleSheet } from 'react-native';
import ContadorCard from '../components/ContadorCard';
import TotalBox from '../components/TotalBox';
import BotaoSalvar from '../components/BotaoSalvar';
import { useContador } from '../hooks/useContador';
import { useCultoAtual } from '../hooks/useCultoAtual';
import { salvarRegistro } from '../services/registroService';

export default function EBDScreen() {
  const { dataFormatada } = useCultoAtual();
  const [salvando, setSalvando] = useState(false);

  const { contadores, incrementar, decrementar, resetar, total } = useContador({
    adulto_membro:     0,
    crianca_membro:    0,
    adulto_visitante:  0,
    crianca_visitante: 0,
  });

  async function handleSalvar() {
    setSalvando(true);
    const resultado = await salvarRegistro({
      tipo: 'EBD',
      data: dataFormatada,
      adulto_membro:     contadores.adulto_membro,
      crianca_membro:    contadores.crianca_membro,
      adulto_visitante:  contadores.adulto_visitante,
      crianca_visitante: contadores.crianca_visitante,
    });
    setSalvando(false);

    if (resultado.sucesso) {
      Alert.alert('Salvo!', 'EBD registrada com sucesso.', [{ text: 'OK', onPress: resetar }]);
    } else {
      Alert.alert('Erro', 'Não foi possível salvar. Verifique a conexão.');
    }
  }

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <ContadorCard label="Membros adultos"     valor={contadores.adulto_membro}     onMais={() => incrementar('adulto_membro')}     onMenos={() => decrementar('adulto_membro')} />
      <ContadorCard label="Membros crianças"    valor={contadores.crianca_membro}    onMais={() => incrementar('crianca_membro')}    onMenos={() => decrementar('crianca_membro')} />
      <ContadorCard label="Visitantes adultos"  valor={contadores.adulto_visitante}  onMais={() => incrementar('adulto_visitante')}  onMenos={() => decrementar('adulto_visitante')} />
      <ContadorCard label="Visitantes crianças" valor={contadores.crianca_visitante} onMais={() => incrementar('crianca_visitante')} onMenos={() => decrementar('crianca_visitante')} />
      <TotalBox total={total} />
      <BotaoSalvar texto="Salvar EBD" onPress={handleSalvar} carregando={salvando} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  content:   { padding: 16 },
});
