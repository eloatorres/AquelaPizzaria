// screens/CarrinhoScreen.js
import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';
import { AppContext } from '../context/AppContext';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function CarrinhoScreen() {
  const { carrinho, setCarrinho, adicionarAoCarrinho } = useContext(AppContext);
  const navigation = useNavigation();
  const [quantidades, setQuantidades] = useState({});

  // Agrupar produtos iguais
  const agrupado = carrinho.reduce((acc, item) => {
    const key = item.id;
    if (!acc[key]) acc[key] = { ...item, quantidade: 0 };
    acc[key].quantidade += 1;
    return acc;
  }, {});

  const produtos = Object.values(agrupado);

  const total = produtos.reduce((soma, item) => soma + item.preco * item.quantidade, 0);

  const aumentar = (item) => {
    adicionarAoCarrinho(item);
  };

  const diminuir = (item) => {
    const index = carrinho.findIndex(p => p.id === item.id);
    if (index !== -1) {
      const novo = [...carrinho];
      novo.splice(index, 1);
      setCarrinho(novo);
    }
  };

  const removerItem = (item) => {
    Alert.alert('Remover item', 'Deseja remover este item do carrinho?', [
      { text: 'Cancelar' },
      {
        text: 'Remover',
        onPress: () => {
          const novoCarrinho = carrinho.filter(p => p.id !== item.id);
          setCarrinho(novoCarrinho);
        },
        style: 'destructive'
      }
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Carrinho de Compras</Text>

      <FlatList
        data={produtos}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.vazio}>Seu carrinho está vazio.</Text>}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={{ flex: 1 }}>
              <Text style={styles.nome}>{item.nome}</Text>
              <Text style={styles.preco}>R$ {item.preco.toFixed(2)}</Text>
              <View style={styles.controles}>
                <TouchableOpacity onPress={() => diminuir(item)}>
                  <Ionicons name="remove-circle" size={26} color="#FF902C" />
                </TouchableOpacity>
                <Text style={styles.quantidade}>{item.quantidade}</Text>
                <TouchableOpacity onPress={() => aumentar(item)}>
                  <Ionicons name="add-circle" size={26} color="#FF902C" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => removerItem(item)} style={styles.lixeira}>
                  <Ionicons name="trash" size={22} color="#DF2A2A" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />

      <Text style={styles.total}>Total: R$ {total.toFixed(2)}</Text>

      {produtos.length > 0 && (
        <TouchableOpacity
          style={styles.botao}
          onPress={() => navigation.navigate('Confirmacao')}
        >
          <Text style={styles.textoBotao}>Confirmar Pedido</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FEF8E5', padding: 20 },
  titulo: { fontSize: 24, fontWeight: 'bold', color: '#DF2A2A', textAlign: 'center', marginBottom: 20 },
  vazio: { textAlign: 'center', color: '#888', marginTop: 40 },
  item: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3
  },
  nome: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  preco: { fontSize: 16, color: '#666' },
  controles: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 10
  },
  quantidade: { fontSize: 16, color: '#333' },
  total: { fontSize: 18, fontWeight: 'bold', color: '#DF2A2A', textAlign: 'right', marginTop: 30 },
  botao: {
    backgroundColor: '#FF902C',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20
  },
  textoBotao: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  lixeira: { marginLeft: 'auto' }
});
