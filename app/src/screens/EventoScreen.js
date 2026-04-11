import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, Alert, StyleSheet } from 'react-native';
import ContadorCard from '../components/ContadorCard';
import TotalBox from '../components/TotalBox';
import BotaoSalvar from '../components/BotaoSalvar';
import { useContador } from '../hooks/useContador';
import { useCultoAtual } from '../hooks/useCultoAtual';
import { salvarRegistro } from '../services/registroService';

const CAMPOS_INICIAIS = {
  adulto: 0, adolescente: 0, intermediario: 0, crianca: 0, bebe: 0,
};

const LABELS = {
  adulto:        'Adultos',
  adolescente:   'Adolescentes',
  intermediario: 'Intermediários',
  crianca:       'Crianças',
  bebe:          'Bebês',
};

export default function EventoScreen() {
  const { dataFormatada } = useCultoAtual();
  const [nomeEvento, setNomeEvento] = useState('');
  const [observacao, setObservacao] = useState('');
  const [salvando, setSalvando]     = useState(false);

  const membros    = useContador({ ...CAMPOS_INICIAIS });
  const visitantes = useContador({ ...CAMPOS_INICIAIS });

  const totalGeral = membros.total + visitantes.total;

  async function handleSalvar() {
    if (!nomeEvento.trim()) {
      Alert.alert('Atenção', 'Informe o nome do evento.');
      return;
    }
    setSalvando(true);
    const resultado = await salvarRegistro({
      tipo:       'Evento',
      nomeEvento: nomeEvento.trim(),
      data:       dataFormatada,
      membros:    { ...membros.contadores },
      visitantes: { ...visitantes.contadores },
      total:      totalGeral,
      observacao: observacao.trim(),
    });
    setSalvando(false);

    if (resultado.sucesso) {
      Alert.alert('Salvo!', 'Evento registrado com sucesso.', [{
        text: 'OK',
        onPress: () => {
          membros.resetar();
          visitantes.resetar();
          setNomeEvento('');
          setObservacao('');
        },
      }]);
    } else {
      Alert.alert('Erro', 'Não foi possível salvar. Verifique a conexão.');
    }
  }

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>

      {/* Nome */}
      <View style={s.campoCard}>
        <Text style={s.campoLabel}>Nome do evento</Text>
        <TextInput
          style={s.input}
          placeholder="Ex: Trombetas e Festas"
          placeholderTextColor="#aaa"
          value={nomeEvento}
          onChangeText={setNomeEvento}
        />
      </View>

      {/* Membros */}
      <Text style={s.subtitulo}>Membros</Text>
      {Object.keys(CAMPOS_INICIAIS).map((campo) => (
        <ContadorCard
          key={`m_${campo}`}
          label={LABELS[campo]}
          valor={membros.contadores[campo]}
          onMais={() => membros.incrementar(campo)}
          onMenos={() => membros.decrementar(campo)}
        />
      ))}

      {/* Visitantes */}
      <Text style={s.subtitulo}>Visitantes</Text>
      {Object.keys(CAMPOS_INICIAIS).map((campo) => (
        <ContadorCard
          key={`v_${campo}`}
          label={LABELS[campo]}
          valor={visitantes.contadores[campo]}
          onMais={() => visitantes.incrementar(campo)}
          onMenos={() => visitantes.decrementar(campo)}
        />
      ))}

      <TotalBox total={totalGeral} />

      {/* Observação */}
      <View style={s.campoCard}>
        <Text style={s.campoLabel}>Observação (opcional)</Text>
        <TextInput
          style={[s.input, { minHeight: 70 }]}
          multiline
          placeholder="Alguma anotação sobre o evento..."
          placeholderTextColor="#aaa"
          value={observacao}
          onChangeText={setObservacao}
        />
      </View>

      <BotaoSalvar texto="Salvar Evento" onPress={handleSalvar} carregando={salvando} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container:  { flex: 1, backgroundColor: '#f0f2f5' },
  content:    { padding: 16 },
  campoCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  campoLabel: {
    fontSize: 12, fontWeight: '700', color: '#666',
    textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8,
  },
  input: {
    borderWidth: 1.5, borderColor: '#e0e0e0',
    borderRadius: 10, padding: 10,
    fontSize: 15, color: '#1a1a1a',
  },
  subtitulo: {
    fontSize: 13, fontWeight: '700', color: '#d91c1c',
    textTransform: 'uppercase', letterSpacing: 1,
    marginTop: 8, marginBottom: 6,
  },
});
