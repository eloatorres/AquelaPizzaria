// AppNavigator.js
import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { AppContext } from '../context/AppContext';

import PreHomeScreen from '../screens/PreHomeScreen';
import HomeScreen from '../screens/HomeScreen';
import CadastroScreen from '../screens/CadastroScreen';
import CadastroCategoriaScreen from '../screens/CadastroCategoriaScreen';
import CarrinhoScreen from '../screens/CarrinhoScreen';
import ConfirmacaoScreen from '../screens/ConfirmacaoScreen';
import HistoricoScreen from '../screens/HistoricoScreen';
import GraficoScreen from '../screens/GraficoScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function TabsNavigator() {
  const { perfil, setPerfil } = useContext(AppContext);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'pizza';
          else if (route.name === 'Carrinho') iconName = 'cart';
          else if (route.name === 'Histórico') iconName = 'time';
          else if (route.name === 'Dashboard') iconName = 'pie-chart';
          else if (route.name === 'Cadastro') iconName = 'add-circle';
          else if (route.name === 'Sair') iconName = 'log-out';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#DF2A2A',
        tabBarInactiveTintColor: '#888',
        headerStyle: { backgroundColor: '#DF2A2A' },
        headerTintColor: '#FFF'
      })}
    >
    <Tab.Screen name="Home" component={HomeScreen} />

    {perfil === 'cliente' && (
     <Tab.Screen name="Carrinho" component={CarrinhoScreen} />
    )}

    {perfil === 'admin' && (
      <Tab.Screen name="Histórico" component={HistoricoScreen} />
    )}

    {perfil === 'admin' && (
     <Tab.Screen name="Dashboard" component={GraficoScreen} />
    )}

    {perfil === 'admin' && (
      <Tab.Screen name="Cadastro" component={CadastroScreen} />
    )}
    
      <Tab.Screen
        name="Sair"
        component={PreHomeScreen}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            setPerfil(null);
            navigation.replace('PreHome');
          }
        })}
        options={{ tabBarLabel: 'Sair' }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="PreHome" component={PreHomeScreen} />
        <Stack.Screen name="Home" component={TabsNavigator} />
        <Stack.Screen name="Cadastro" component={CadastroScreen} />
        <Stack.Screen name="CadastroCategoria" component={CadastroCategoriaScreen} />
        <Stack.Screen name="Confirmacao" component={ConfirmacaoScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
