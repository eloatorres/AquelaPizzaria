// screens/ConfirmacaoScreen.js
import React, { useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { AppContext } from '../context/AppContext';
import { Ionicons } from '@expo/vector-icons';

export default function ConfirmacaoScreen({ navigation }) {
  const { vendas } = useContext(AppContext);
  const ultimaVenda = vendas[vendas.length - 1];

  if (!ultimaVenda) {
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>Nenhum pedido encontrado.</Text>
        <TouchableOpacity style={styles.botao} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.textoBotao}>Voltar para o início</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Pedido Confirmado!</Text>
      <Ionicons name="checkmark-circle" size={60} color="#28A745" style={{ marginVertical: 20 }} />

      <Text style={styles.subtitulo}>Itens:</Text>
      <FlatList
        data={ultimaVenda.itens}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.nome}>{item.nome}</Text>
            <Text style={styles.preco}>R$ {item.preco.toFixed(2)}</Text>
          </View>
        )}
      />

      <Text style={styles.total}>Total: R$ {ultimaVenda.total.toFixed(2)}</Text>

      <TouchableOpacity style={styles.botao} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.textoBotao}>Voltar para o início</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#FEF8E5', alignItems: 'center' },
  titulo: { fontSize: 26, fontWeight: 'bold', color: '#DF2A2A', marginBottom: 10, textAlign: 'center' },
  subtitulo: { fontSize: 18, fontWeight: 'bold', color: '#DF2A2A', alignSelf: 'flex-start', marginTop: 20 },
  item: {
    backgroundColor: '#FFF',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#FF902C',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  nome: { fontSize: 16, color: '#DF2A2A' },
  preco: { fontSize: 16, color: '#333' },
  total: { fontSize: 20, fontWeight: 'bold', color: '#DF2A2A', marginTop: 20 },
  botao: {
    marginTop: 30,
    backgroundColor: '#FF902C',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center'
  },
  textoBotao: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});
