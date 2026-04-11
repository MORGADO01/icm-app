import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar, View, Text, Image, StyleSheet } from 'react-native';

import EBDScreen from './src/screens/EBDScreen';
import CultoScreen from './src/screens/CultoScreen';
import EventoScreen from './src/screens/EventoScreen';
import HistoricoScreen from './src/screens/HistoricoScreen';
import { useCultoAtual } from './src/hooks/useCultoAtual';

const Tab = createBottomTabNavigator();

function Header() {
  const { nomeCulto, diaSemana, dataFormatada } = useCultoAtual();
  return (
    <View style={styles.header}>
      {/* Substitua por: <Image source={require('./assets/logo_icm.png')} style={styles.logo} /> */}
      <Text style={styles.headerTitulo}>Controle de Cultos</Text>
      <Text style={styles.headerSub}>{diaSemana} — {dataFormatada}</Text>
      <Text style={styles.headerCulto}>{nomeCulto}</Text>
    </View>
  );
}

export default function App() {
  const { abaInicial } = useCultoAtual();

  return (
    <NavigationContainer>
      <StatusBar backgroundColor="#d91c1c" barStyle="light-content" />
      <Header />
      <Tab.Navigator
        initialRouteName={abaInicial === 'ebd' ? 'EBD' : 'Culto'}
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#d91c1c',
          tabBarInactiveTintColor: '#999',
          tabBarStyle: { paddingBottom: 4 },
        }}
      >
        <Tab.Screen name="EBD" component={EBDScreen} />
        <Tab.Screen name="Culto" component={CultoScreen} />
        <Tab.Screen name="Evento" component={EventoScreen} />
        <Tab.Screen name="Histórico" component={HistoricoScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#d91c1c',
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 16,
  },
  logo: { height: 60, resizeMode: 'contain', marginBottom: 8 },
  headerTitulo: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  headerSub: { color: 'rgba(255,255,255,0.75)', fontSize: 13, marginTop: 4 },
  headerCulto: { color: '#fff', fontSize: 15, fontWeight: '600', marginTop: 2 },
});

// Dependências necessárias (instalar):
// npm install @react-navigation/native @react-navigation/bottom-tabs
// npm install react-native-screens react-native-safe-area-context
