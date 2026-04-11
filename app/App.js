import React from 'react';
import { View, Text, Image, StyleSheet, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import EBDScreen       from './src/screens/EBDScreen';
import CultoScreen     from './src/screens/CultoScreen';
import EventoScreen    from './src/screens/EventoScreen';
import HistoricoScreen from './src/screens/HistoricoScreen';
import { useCultoAtual } from './src/hooks/useCultoAtual';

const Tab = createBottomTabNavigator();

function Header() {
  const { nomeCulto, dataFormatada } = useCultoAtual();
  return (
    <View style={s.header}>
      <StatusBar backgroundColor="#d91c1c" barStyle="light-content" />
      {/* Faixa vermelha com logo */}
      <View style={s.logoFaixa}>
        <Image
          source={require('./assets/logo_icm.png')}
          style={s.logo}
          resizeMode="contain"
        />
      </View>
      {/* Info fora da faixa */}
      <View style={s.headerInfo}>
        <Text style={s.headerTitulo}>Controle de Cultos</Text>
        <Text style={s.headerData}>{dataFormatada}</Text>
        <View style={s.cultoTag}>
          <Text style={s.cultoTagTexto}>{nomeCulto}</Text>
        </View>
      </View>
    </View>
  );
}

export default function App() {
  const { abaInicial } = useCultoAtual();

  return (
    <NavigationContainer>
      <Header />
      <Tab.Navigator
        initialRouteName={abaInicial}
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor:   '#d91c1c',
          tabBarInactiveTintColor: '#999',
          tabBarStyle: { paddingBottom: 6, height: 56 },
          tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
        }}
      >
        <Tab.Screen name="EBD"       component={EBDScreen} />
        <Tab.Screen name="Culto"     component={CultoScreen} />
        <Tab.Screen name="Evento"    component={EventoScreen} />
        <Tab.Screen name="Histórico" component={HistoricoScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const s = StyleSheet.create({
  header: { backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
  logoFaixa: {
    backgroundColor: '#d91c1c',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  logo: { height: 80, width: 200 },
  headerInfo: { alignItems: 'center', paddingVertical: 12 },
  headerTitulo: { fontSize: 20, fontWeight: '800', color: '#1a1a1a' },
  headerData:   { fontSize: 13, color: '#666', marginTop: 2 },
  cultoTag: {
    backgroundColor: '#fde8e8',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 3,
    marginTop: 6,
  },
  cultoTagTexto: { fontSize: 14, fontWeight: '700', color: '#d91c1c' },
});
