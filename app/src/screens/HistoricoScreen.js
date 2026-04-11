import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, Alert,
  FlatList, StyleSheet, ActivityIndicator
} from 'react-native';
import { ouvirHistorico, excluirRegistro } from '../services/cultoService';

export default function HistoricoScreen() {
  const [historico, setHistorico] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    // Escuta em tempo real — atualiza automaticamente quando algo muda
    const unsubscribe = ouvirHistorico((lista) => {
      setHistorico(lista);
      setCarregando(false);
    });
    return unsubscribe; // limpa o listener ao sair da tela
  }, []);

  function confirmarExclusao(id) {
    Alert.alert(
      'Excluir registro',
      'Deseja excluir este registro permanentemente?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => excluirRegistro(id),
        },
      ]
    );
  }

  function calcularTotal(item) {
    if (item.tipo === 'Culto') {
      return (item.membros || 0) + (item.visitantes || 0);
    }
    return (item.adulto_membro || 0) + (item.crianca_membro || 0) +
           (item.adulto_visitante || 0) + (item.crianca_visitante || 0);
  }

  function renderItem({ item }) {
    const total = calcularTotal(item);
    const eCulto = item.tipo === 'Culto';

    return (
      <View style={styles.card}>
        <View style={styles.cabecalho}>
          <View>
            <Text style={styles.data}>{item.data}</Text>
            <Text style={[styles.tipo, eCulto ? styles.tipoCulto : styles.tipoEBD]}>
              {item.nomeCulto || item.tipo}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.botaoExcluir}
            onPress={() => confirmarExclusao(item.id)}
          >
            <Text style={styles.iconeExcluir}>🗑️</Text>
          </TouchableOpacity>
        </View>

        {eCulto ? (
          <View style={styles.detalhes}>
            <Text style={styles.detalhe}>Membros: {item.membros || 0}</Text>
            <Text style={styles.detalhe}>Visitantes: {item.visitantes || 0}</Text>
          </View>
        ) : (
          <View style={styles.detalhes}>
            <Text style={styles.detalhe}>Membros adultos: {item.adulto_membro || 0}</Text>
            <Text style={styles.detalhe}>Membros crianças: {item.crianca_membro || 0}</Text>
            <Text style={styles.detalhe}>Visitantes adultos: {item.adulto_visitante || 0}</Text>
            <Text style={styles.detalhe}>Visitantes crianças: {item.crianca_visitante || 0}</Text>
          </View>
        )}

        <Text style={styles.total}>Total: {total}</Text>
      </View>
    );
  }

  if (carregando) {
    return (
      <View style={styles.centralizador}>
        <ActivityIndicator size="large" color="#d91c1c" />
        <Text style={styles.textoCarregando}>Carregando histórico...</Text>
      </View>
    );
  }

  if (historico.length === 0) {
    return (
      <View style={styles.centralizador}>
        <Text style={styles.textoVazio}>Nenhum registro ainda.</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      data={historico}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={{ paddingBottom: 32 }}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5', padding: 16 },
  centralizador: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  textoCarregando: { marginTop: 12, color: '#888' },
  textoVazio: { color: '#888', fontSize: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderLeftWidth: 5,
    borderLeftColor: '#d91c1c',
  },
  cabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  data: { fontSize: 13, color: '#666' },
  tipo: { fontSize: 15, fontWeight: 'bold', marginTop: 2 },
  tipoCulto: { color: '#d91c1c' },
  tipoEBD: { color: '#1a5fa8' },
  detalhes: { marginBottom: 8 },
  detalhe: { fontSize: 13, color: '#555', lineHeight: 20 },
  total: { fontSize: 15, fontWeight: 'bold', color: '#222' },
  botaoExcluir: { padding: 4 },
  iconeExcluir: { fontSize: 18 },
});
