import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

/**
 * Card reutilizável com botões +/-.
 * Props: label, valor, onMais, onMenos
 */
export default function ContadorCard({ label, valor, onMais, onMenos }) {
  return (
    <View style={s.card}>
      <Text style={s.label}>{label}</Text>
      <View style={s.controles}>
        <TouchableOpacity style={s.btnMenos} onPress={onMenos} activeOpacity={0.8}>
          <Text style={s.btnTexto}>−</Text>
        </TouchableOpacity>
        <Text style={s.valor}>{valor}</Text>
        <TouchableOpacity style={s.btnMais} onPress={onMais} activeOpacity={0.8}>
          <Text style={s.btnTexto}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  label: { fontSize: 15, fontWeight: '600', color: '#1a1a1a', flex: 1 },
  controles: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  btnMenos: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: '#d91c1c',
    alignItems: 'center', justifyContent: 'center',
  },
  btnMais: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: '#1a8c3f',
    alignItems: 'center', justifyContent: 'center',
  },
  btnTexto: { color: '#fff', fontSize: 24, fontWeight: 'bold', lineHeight: 28 },
  valor: {
    fontSize: 26, fontWeight: '700',
    minWidth: 44, textAlign: 'center', color: '#1a1a1a',
  },
});
