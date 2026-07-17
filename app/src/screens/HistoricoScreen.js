import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, Alert,
  FlatList, StyleSheet, ActivityIndicator,
} from 'react-native';
import { ouvirHistorico, excluirRegistro } from '../services/registroService';

const LABELS = {
  adulto:        'Adultos',
  adolescente:   'Adolescentes',
  intermediario: 'Intermediários',
  crianca:       'Crianças',
  bebe:          'Bebês',
};

// Linha "Label ........... valor"
function LinhaCategoria({ label, valor }) {
  if (!valor || valor === 0) return null;
  return (
    <View style={s.histLinha}>
      <Text style={s.histCat}>{label}</Text>
      <Text style={s.histVal}>{valor}</Text>
    </View>
  );
}

// Bloco "MEMBROS (n)" com todas as linhas
function BlocoGrupo({ titulo, dados }) {
  const total  = Object.values(dados).reduce((a, b) => a + (b || 0), 0);
  const temDado = Object.values(dados).some(v => v > 0);
  if (!temDado) return null;
  return (
    <View style={s.histGrupo}>
      <Text style={s.histGrupoTitulo}>{titulo} ({total})</Text>
      {Object.entries(dados).map(([k, v]) => (
        <LinhaCategoria key={k} label={LABELS[k] || k} valor={v} />
      ))}
    </View>
  );
}

function calcularTotal(item) {
  if (item.tipo === 'Culto') return (item.membros || 0) + (item.visitantes || 0);
  if (item.tipo === 'EBD')   return (item.adulto_membro || 0) + (item.crianca_membro || 0) + (item.adulto_visitante || 0) + (item.crianca_visitante || 0);
  if (item.tipo === 'Evento') return item.total || 0;
  return 0;
}

function CardHistorico({ item, onExcluir }) {
  const total      = calcularTotal(item);
  const eCulto     = item.tipo === 'Culto';
  const eEBD       = item.tipo === 'EBD';
  const eEvento    = item.tipo === 'Evento';
  const corBorda   = eCulto ? '#d91c1c' : eEBD ? '#1a56a0' : '#1a8c3f';
  const titulo     = item.nomeCulto || item.nomeEvento || item.tipo;

  return (
    <View style={[s.card, { borderLeftColor: corBorda }]}>
      <View style={s.cardHeader}>
        <View style={{ flex: 1 }}>
          <Text style={s.cardTitulo}>{titulo}</Text>
          <Text style={s.cardData}>{item.data || ''}</Text>
        </View>
        <TouchableOpacity
          style={s.btnExcluir}
          onPress={onExcluir}
          accessibilityRole="button"
          accessibilityLabel={`Excluir registro: ${titulo}`}
        >
          <Text style={{ fontSize: 18 }}>🗑️</Text>
        </TouchableOpacity>
      </View>

      {/* EBD */}
      {eEBD && (
        <>
          <View style={s.histGrupo}>
            <Text style={s.histGrupoTitulo}>Membros</Text>
            <LinhaCategoria label="Adultos"  valor={item.adulto_membro} />
            <LinhaCategoria label="Crianças" valor={item.crianca_membro} />
          </View>
          <View style={s.histGrupo}>
            <Text style={s.histGrupoTitulo}>Visitantes</Text>
            <LinhaCategoria label="Adultos"  valor={item.adulto_visitante} />
            <LinhaCategoria label="Crianças" valor={item.crianca_visitante} />
          </View>
        </>
      )}

      {/* Culto */}
      {eCulto && (
        <View style={s.histGrupo}>
          <LinhaCategoria label="Membros"    valor={item.membros} />
          <LinhaCategoria label="Visitantes" valor={item.visitantes} />
        </View>
      )}

      {/* Evento */}
      {eEvento && (
        <>
          {item.membros    && <BlocoGrupo titulo="Membros"    dados={item.membros} />}
          {item.visitantes && <BlocoGrupo titulo="Visitantes" dados={item.visitantes} />}
          {item.observacao ? <Text style={s.histObs}>{item.observacao}</Text> : null}
        </>
      )}

      <View style={s.totalLinha}>
        <Text style={s.totalTexto}>Total: {total}</Text>
      </View>
    </View>
  );
}

export default function HistoricoScreen() {
  const [historico,  setHistorico]  = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const unsub = ouvirHistorico((lista) => {
      setHistorico(lista);
      setCarregando(false);
    });
    return unsub;
  }, []);

  function confirmarExclusao(id) {
    Alert.alert('Excluir', 'Deseja excluir este registro permanentemente?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir',  style: 'destructive', onPress: () => excluirRegistro(id) },
    ]);
  }

  if (carregando) {
    return (
      <View style={s.centralizador}>
        <ActivityIndicator size="large" color="#d91c1c" />
        <Text style={s.textoCarregando}>Carregando histórico...</Text>
      </View>
    );
  }

  if (historico.length === 0) {
    return (
      <View style={s.centralizador}>
        <Text style={s.textoVazio}>Nenhum registro ainda.</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={s.lista}
      data={historico}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
      renderItem={({ item }) => (
        <CardHistorico item={item} onExcluir={() => confirmarExclusao(item.id)} />
      )}
    />
  );
}

const s = StyleSheet.create({
  lista:           { flex: 1, backgroundColor: '#f0f2f5' },
  centralizador:   { flex: 1, alignItems: 'center', justifyContent: 'center' },
  textoCarregando: { marginTop: 12, color: '#888' },
  textoVazio:      { color: '#888', fontSize: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderLeftWidth: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  cardHeader:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  cardTitulo:      { fontSize: 15, fontWeight: '700', color: '#1a1a1a' },
  cardData:        { fontSize: 12, color: '#888', marginTop: 2 },
  btnExcluir:      { padding: 4 },
  histGrupo:       { marginBottom: 8 },
  histGrupoTitulo: { fontSize: 11, fontWeight: '700', color: '#d91c1c', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 4 },
  histLinha:       { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3, borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
  histCat:         { fontSize: 13, color: '#666' },
  histVal:         { fontSize: 13, fontWeight: '700', color: '#1a1a1a' },
  histObs:         { fontSize: 12, color: '#888', fontStyle: 'italic', marginTop: 4 },
  totalLinha:      { borderTopWidth: 1, borderTopColor: '#eee', marginTop: 6, paddingTop: 8 },
  totalTexto:      { fontSize: 14, fontWeight: '700', color: '#1a1a1a' },
});
