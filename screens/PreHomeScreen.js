// screens/PreHomeScreen.js
import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AppContext } from '../context/AppContext';

export default function PreHomeScreen({ navigation }) {
  const { setPerfil } = useContext(AppContext);

  const entrarComo = (tipo) => {
    setPerfil(tipo);
    navigation.replace('Home');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Bem-vindo à Aquela Pizzaria</Text>
      <Text style={styles.subtitulo}>Escolha como deseja acessar:</Text>

      <TouchableOpacity style={styles.botao} onPress={() => entrarComo('cliente')}>
        <Text style={styles.textoBotao}>Sou Cliente</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.botao} onPress={() => entrarComo('admin')}>
        <Text style={styles.textoBotao}>Sou Admin</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FEF8E5' },
  titulo: { fontSize: 28, fontWeight: 'bold', color: '#DF2A2A', marginBottom: 20 },
  subtitulo: { fontSize: 18, color: '#555', marginBottom: 30 },
  botao: {
    backgroundColor: '#FF902C',
    padding: 15,
    borderRadius: 10,
    width: '70%',
    alignItems: 'center',
    marginBottom: 15
  },
  textoBotao: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});
