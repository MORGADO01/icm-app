import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native';
import ContadorCard from '../components/ContadorCard';
import { useContador } from '../hooks/useContador';
import { useCultoAtual } from '../hooks/useCultoAtual';
import { salvarRegistro } from '../services/cultoService';

export default function CultoScreen() {
  const { nomeCulto, dataFormatada } = useCultoAtual();
  const { contadores, incrementar, decrementar, resetar, total } = useContador({
    membros: 0,
    visitantes: 0,
  });
  const [salvando, setSalvando] = useState(false);

  async function handleSalvar() {
    setSalvando(true);
    const resultado = await salvarRegistro({
      tipo: 'Culto',
      data: dataFormatada,
      nomeCulto,
      membros: contadores.membros,
      visitantes: contadores.visitantes,
      total,
    });
    setSalvando(false);

    if (resultado.sucesso) {
      Alert.alert('Salvo!', 'Culto registrado com sucesso.', [
        { text: 'OK', onPress: resetar }
      ]);
    } else {
      Alert.alert('Erro', 'Não foi possível salvar. Verifique a conexão.');
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.subtitulo}>{nomeCulto} — {dataFormatada}</Text>

      <ContadorCard
        label="Membros"
        valor={contadores.membros}
        onMais={() => incrementar('membros')}
        onMenos={() => decrementar('membros')}
      />
      <ContadorCard
        label="Visitantes"
        valor={contadores.visitantes}
        onMais={() => incrementar('visitantes')}
        onMenos={() => decrementar('visitantes')}
      />

      <Text style={styles.total}>Total: {total}</Text>

      <TouchableOpacity
        style={[styles.botaoSalvar, salvando && styles.botaoDesabilitado]}
        onPress={handleSalvar}
        disabled={salvando}
      >
        <Text style={styles.botaoTexto}>
          {salvando ? 'Salvando...' : 'Salvar Culto'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f2', padding: 16 },
  subtitulo: { color: '#888', fontSize: 14, marginBottom: 12 },
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
