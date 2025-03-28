import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import PreHomeScreen from '../screens/PreHomeScreen';
import HomeScreen from '../screens/HomeScreen';
import CadastroScreen from '../screens/CadastroScreen';
import CadastroCategoriaScreen from '../screens/CadastroCategoriaScreen';
import CarrinhoScreen from '../screens/CarrinhoScreen'; 
import ConfirmacaoScreen from '../screens/ConfirmacaoScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="PreHome"
        screenOptions={{
          headerStyle: { backgroundColor: '#DF2A2A' },
          headerTintColor: '#FFF',
        }}
      >
        <Stack.Screen
          name="PreHome"
          component={PreHomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Aquela Pizzaria' }}
        />
        <Stack.Screen
          name="Cadastro"
          component={CadastroScreen}
          options={{ title: 'Cadastro de Produto' }}
        />
        <Stack.Screen
          name="CadastroCategoria"
          component={CadastroCategoriaScreen}
          options={{ title: 'Categoria' }}
        />
        <Stack.Screen
          name="Carrinho"
          component={CarrinhoScreen}
          options={{ title: 'Carrinho' }}
        />
        <Stack.Screen
        name="Confirmacao"
        component={ConfirmacaoScreen}
        options={{ title: 'Confirmação' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
