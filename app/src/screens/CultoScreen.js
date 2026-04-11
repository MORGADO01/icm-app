import React, { useState } from 'react';
import { ScrollView, Alert, StyleSheet } from 'react-native';
import ContadorCard from '../components/ContadorCard';
import TotalBox from '../components/TotalBox';
import BotaoSalvar from '../components/BotaoSalvar';
import { useContador } from '../hooks/useContador';
import { useCultoAtual } from '../hooks/useCultoAtual';
import { salvarRegistro } from '../services/registroService';

export default function CultoScreen() {
  const { nomeCulto, dataFormatada } = useCultoAtual();
  const [salvando, setSalvando] = useState(false);

  const { contadores, incrementar, decrementar, resetar, total } = useContador({
    membros:    0,
    visitantes: 0,
  });

  async function handleSalvar() {
    setSalvando(true);
    const resultado = await salvarRegistro({
      tipo:      'Culto',
      nomeCulto: nomeCulto,
      data:      dataFormatada,
      membros:   contadores.membros,
      visitantes: contadores.visitantes,
    });
    setSalvando(false);

    if (resultado.sucesso) {
      Alert.alert('Salvo!', 'Culto registrado com sucesso.', [{ text: 'OK', onPress: resetar }]);
    } else {
      Alert.alert('Erro', 'Não foi possível salvar. Verifique a conexão.');
    }
  }

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <ContadorCard label="Membros"    valor={contadores.membros}    onMais={() => incrementar('membros')}    onMenos={() => decrementar('membros')} />
      <ContadorCard label="Visitantes" valor={contadores.visitantes} onMais={() => incrementar('visitantes')} onMenos={() => decrementar('visitantes')} />
      <TotalBox total={total} />
      <BotaoSalvar texto="Salvar Culto" onPress={handleSalvar} carregando={salvando} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  content:   { padding: 16 },
});
