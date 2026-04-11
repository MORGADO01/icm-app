import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TotalBox({ total }) {
  return (
    <View style={s.box}>
      <Text style={s.label}>Total geral</Text>
      <Text style={s.valor}>{total}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  box: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  label: { fontSize: 13, color: '#666', marginBottom: 4 },
  valor: { fontSize: 36, fontWeight: '800', color: '#d91c1c' },
});
