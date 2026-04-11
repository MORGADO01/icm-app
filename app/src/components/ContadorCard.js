import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

/**
 * Card reutilizável com label, botões +/- e valor atual.
 * Props:
 *   label     - string com o nome do campo
 *   valor     - número atual
 *   onMais    - função chamada ao pressionar +
 *   onMenos   - função chamada ao pressionar -
 */
export default function ContadorCard({ label, valor, onMais, onMenos }) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.linha}>
        <TouchableOpacity style={styles.botaoMenos} onPress={onMenos}>
          <Text style={styles.botaoTexto}>−</Text>
        </TouchableOpacity>
        <Text style={styles.valor}>{valor}</Text>
        <TouchableOpacity style={styles.botaoMais} onPress={onMais}>
          <Text style={styles.botaoTexto}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  label: {
    fontSize: 15,
    color: '#444',
    marginBottom: 10,
    fontWeight: '500',
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  botaoMenos: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#d91c1c',
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoMais: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#1a8c3f',
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoTexto: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 28,
  },
  valor: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222',
    minWidth: 60,
    textAlign: 'center',
  },
});
