// screens/CarrinhoScreen.js
import React, { useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';
import { AppContext } from '../context/AppContext';

export default function CarrinhoScreen({ navigation }) {
  const { carrinho, limparCarrinho, registrarVenda } = useContext(AppContext);

  const total = carrinho.reduce((soma, item) => soma + item.preco, 0);

  const confirmarPedido = () => {
    if (carrinho.length === 0) {
      Alert.alert('Carrinho vazio', 'Adicione produtos antes de confirmar.');
      return;
    }

    registrarVenda();
    navigation.navigate('Confirmacao');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Seu Carrinho</Text>

      <FlatList
        data={carrinho}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={<Text style={styles.vazio}>Nenhum item no carrinho.</Text>}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.nome}>{item.nome}</Text>
            <Text style={styles.preco}>R$ {item.preco.toFixed(2)}</Text>
          </View>
        )}
      />

      <Text style={styles.total}>Total: R$ {total.toFixed(2)}</Text>

      <TouchableOpacity style={styles.botao} onPress={confirmarPedido}>
        <Text style={styles.textoBotao}>Confirmar Pedido</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.botao, { backgroundColor: '#ccc', marginTop: 10 }]}
        onPress={limparCarrinho}
      >
        <Text style={[styles.textoBotao, { color: '#333' }]}>Limpar Carrinho</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#FEF8E5' },
  titulo: { fontSize: 26, fontWeight: 'bold', color: '#DF2A2A', marginBottom: 20 },
  item: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#FF902C'
  },
  nome: { fontSize: 18, color: '#DF2A2A' },
  preco: { fontSize: 16, color: '#555' },
  total: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#DF2A2A',
    marginTop: 20,
    textAlign: 'right'
  },
  botao: {
    backgroundColor: '#FF902C',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20
  },
  textoBotao: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  vazio: { textAlign: 'center', color: '#999', marginTop: 30 }
});
