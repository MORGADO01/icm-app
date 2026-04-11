import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function BotaoSalvar({ texto, onPress, carregando }) {
  return (
    <TouchableOpacity
      style={[s.btn, carregando && s.desabilitado]}
      onPress={onPress}
      disabled={carregando}
      activeOpacity={0.85}
    >
      <Text style={s.texto}>{carregando ? 'Salvando...' : texto}</Text>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  btn: {
    backgroundColor: '#d91c1c',
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 4,
  },
  desabilitado: { backgroundColor: '#aaa' },
  texto: { color: '#fff', fontWeight: '700', fontSize: 16, letterSpacing: 0.3 },
});
