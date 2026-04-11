import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native';
import ContadorCard from '../components/ContadorCard';
import { useContador } from '../hooks/useContador';
import { useCultoAtual } from '../hooks/useCultoAtual';
import { salvarRegistro } from '../services/cultoService';

export default function EBDScreen() {
  const { dataFormatada, diaSemana } = useCultoAtual();
  const { contadores, incrementar, decrementar, resetar, total } = useContador({
    adulto_membro: 0,
    crianca_membro: 0,
    adulto_visitante: 0,
    crianca_visitante: 0,
  });
  const [salvando, setSalvando] = useState(false);

  async function handleSalvar() {
    setSalvando(true);
    const resultado = await salvarRegistro({
      tipo: 'EBD',
      data: `${diaSemana}, ${dataFormatada}`,
      ...contadores,
    });
    setSalvando(false);

    if (resultado.sucesso) {
      Alert.alert('Salvo!', 'EBD registrada com sucesso.', [
        { text: 'OK', onPress: resetar }
      ]);
    } else {
      Alert.alert('Erro', 'Não foi possível salvar. Verifique a conexão.');
    }
  }

  return (
    <ScrollView style={styles.container}>
      <ContadorCard
        label="Membros Adultos"
        valor={contadores.adulto_membro}
        onMais={() => incrementar('adulto_membro')}
        onMenos={() => decrementar('adulto_membro')}
      />
      <ContadorCard
        label="Membros Crianças"
        valor={contadores.crianca_membro}
        onMais={() => incrementar('crianca_membro')}
        onMenos={() => decrementar('crianca_membro')}
      />
      <ContadorCard
        label="Visitantes Adultos"
        valor={contadores.adulto_visitante}
        onMais={() => incrementar('adulto_visitante')}
        onMenos={() => decrementar('adulto_visitante')}
      />
      <ContadorCard
        label="Visitantes Crianças"
        valor={contadores.crianca_visitante}
        onMais={() => incrementar('crianca_visitante')}
        onMenos={() => decrementar('crianca_visitante')}
      />

      <Text style={styles.total}>Total: {total}</Text>

      <TouchableOpacity
        style={[styles.botaoSalvar, salvando && styles.botaoDesabilitado]}
        onPress={handleSalvar}
        disabled={salvando}
      >
        <Text style={styles.botaoTexto}>
          {salvando ? 'Salvando...' : 'Salvar EBD'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5', padding: 16 },
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
