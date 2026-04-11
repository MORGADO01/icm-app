import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  Alert, StyleSheet, ScrollView
} from 'react-native';
import ContadorCard from '../components/ContadorCard';
import { useContador } from '../hooks/useContador';
import { useCultoAtual } from '../hooks/useCultoAtual';
import { salvarRegistro } from '../services/cultoService';

export default function EventoScreen() {
  const { dataFormatada, diaSemana } = useCultoAtual();
  const [nomeEvento, setNomeEvento] = useState('');
  const [observacao, setObservacao] = useState('');
  const [salvando, setSalvando] = useState(false);

  const membros = useContador({ adulto: 0, adolescente: 0, intermediario: 0, crianca: 0, bebe: 0 });
  const visitantes = useContador({ adulto: 0, adolescente: 0, intermediario: 0, crianca: 0, bebe: 0 });

  const totalGeral = membros.total + visitantes.total;

  async function handleSalvar() {
    if (!nomeEvento.trim()) {
      Alert.alert('Atenção', 'Informe o nome do evento.');
      return;
    }
    setSalvando(true);
    const resultado = await salvarRegistro({
      tipo: 'Evento',
      nomeEvento: nomeEvento.trim(),
      data: `${diaSemana}, ${dataFormatada}`,
      membros: membros.contadores,
      visitantes: visitantes.contadores,
      total: totalGeral,
      observacao,
    });
    setSalvando(false);

    if (resultado.sucesso) {
      Alert.alert('Salvo!', 'Evento registrado com sucesso.', [
        { text: 'OK', onPress: () => { membros.resetar(); visitantes.resetar(); setNomeEvento(''); setObservacao(''); } }
      ]);
    } else {
      Alert.alert('Erro', 'Não foi possível salvar. Verifique a conexão.');
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.inputCard}>
        <Text style={styles.label}>Nome do evento</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Trombetas e Festas"
          value={nomeEvento}
          onChangeText={setNomeEvento}
        />
      </View>

      <Text style={styles.secao}>Membros</Text>
      {['adulto', 'adolescente', 'intermediario', 'crianca', 'bebe'].map((k) => (
        <ContadorCard
          key={`m_${k}`}
          label={k.charAt(0).toUpperCase() + k.slice(1) + 's'}
          valor={membros.contadores[k]}
          onMais={() => membros.incrementar(k)}
          onMenos={() => membros.decrementar(k)}
        />
      ))}

      <Text style={styles.secao}>Visitantes</Text>
      {['adulto', 'adolescente', 'intermediario', 'crianca', 'bebe'].map((k) => (
        <ContadorCard
          key={`v_${k}`}
          label={k.charAt(0).toUpperCase() + k.slice(1) + 's'}
          valor={visitantes.contadores[k]}
          onMais={() => visitantes.incrementar(k)}
          onMenos={() => visitantes.decrementar(k)}
        />
      ))}

      <View style={styles.inputCard}>
        <Text style={styles.label}>Observação (opcional)</Text>
        <TextInput
          style={[styles.input, { minHeight: 70 }]}
          multiline
          placeholder="Alguma observação sobre o evento..."
          value={observacao}
          onChangeText={setObservacao}
        />
      </View>

      <Text style={styles.total}>Total geral: {totalGeral}</Text>

      <TouchableOpacity
        style={[styles.botaoSalvar, salvando && styles.botaoDesabilitado]}
        onPress={handleSalvar}
        disabled={salvando}
      >
        <Text style={styles.botaoTexto}>
          {salvando ? 'Salvando...' : 'Salvar Evento'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5', padding: 16 },
  inputCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  label: { fontSize: 14, color: '#555', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 15,
    color: '#222',
  },
  secao: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#d91c1c',
    marginTop: 8,
    marginBottom: 4,
  },
  total: { textAlign: 'center', fontSize: 22, fontWeight: 'bold', marginVertical: 16 },
  botaoSalvar: {
    backgroundColor: '#d91c1c',
    padding: 14,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 32,
  },
  botaoDesabilitado: { backgroundColor: '#aaa' },
  botaoTexto: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
