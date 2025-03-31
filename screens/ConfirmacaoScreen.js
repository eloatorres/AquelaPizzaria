// screens/ConfirmacaoScreen.js
import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, FlatList } from 'react-native';
import { AppContext } from '../context/AppContext';
import { Ionicons } from '@expo/vector-icons';
import uuid from 'react-native-uuid';

export default function ConfirmacaoScreen({ navigation }) {
  const { carrinho, registrarVenda, setVendas, vendas, perfil } = useContext(AppContext);

  const total = carrinho.reduce((soma, item) => soma + item.preco, 0);

  const confirmar = async () => {
    const novaVenda = {
      id: uuid.v4(),
      itens: [...carrinho],
      total,
      data: new Date().toISOString(),
      perfil: perfil || 'cliente'  // importante: salva o perfil
    };

    const sucesso = await registrarVenda(novaVenda);

    if (sucesso) {
      Alert.alert('Sucesso', 'Pedido confirmado!', [
        { text: 'OK', onPress: () => navigation.navigate('Home') }
      ]);
    } else {
      Alert.alert('Erro', 'Erro ao registrar o pedido.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topo}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.botaoVoltar}>
          <Ionicons name="arrow-back" size={28} color="#DF2A2A" />
        </TouchableOpacity>
        <Text style={styles.titulo}>Confirmação do Pedido</Text>
      </View>

      <FlatList
        data={carrinho}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.item}>
            <Text style={styles.nome}>{item.nome}</Text>
            <Text style={styles.preco}>R$ {item.preco.toFixed(2)}</Text>
          </View>
        )}
      />

      <Text style={styles.total}>Total: R$ {total.toFixed(2)}</Text>

      <TouchableOpacity style={styles.botao} onPress={confirmar}>
        <Text style={styles.textoBotao}>Confirmar Pedido</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FEF8E5', padding: 20 },
  topo: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, marginTop: 60 },
  botaoVoltar: { marginRight: 10 },
  titulo: { fontSize: 24, fontWeight: '600', color: '#DF2A2A' },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    borderRadius: 8,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1
  },
  nome: { fontSize: 16, color: '#333' },
  preco: { fontSize: 16, fontWeight: '500', color: '#333' },
  total: { fontSize: 20, fontWeight: 'bold', color: '#DF2A2A', textAlign: 'right', marginTop: 20, marginBottom: 30 },
  botao: {
    backgroundColor: '#FF902C',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  textoBotao: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});
