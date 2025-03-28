// screens/HomeScreen.js
import React, { useContext, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';

export default function HomeScreen({ navigation }) {
  const { perfil, setPerfil, produtos, adicionarAoCarrinho, setProdutos } = useContext(AppContext);
  const [filtro, setFiltro] = useState('todos');
  const [quantidades, setQuantidades] = useState({});

  const produtosFiltrados =
    filtro === 'todos' ? produtos : produtos.filter(p => p.categoria.toLowerCase() === filtro);

  const aumentarQuantidade = (produto) => {
    adicionarAoCarrinho(produto);
    setQuantidades((prev) => ({
      ...prev,
      [produto.id]: (prev[produto.id] || 0) + 1
    }));
  };

  const diminuirQuantidade = (produto) => {
    if ((quantidades[produto.id] || 0) > 0) {
      setQuantidades((prev) => ({
        ...prev,
        [produto.id]: prev[produto.id] - 1
      }));
    }
  };

  const excluirProduto = (id) => {
    setProdutos(produtos.filter(p => p.id !== id));
  };

  const voltarParaPreHome = () => {
    setPerfil(null);
    navigation.replace('PreHome');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Aquela Pizzaria</Text>
        <TouchableOpacity onPress={voltarParaPreHome}>
          <Ionicons name="log-out" size={28} color="#DF2A2A" />
        </TouchableOpacity>
      </View>

      {/* Botões de filtro */}
      <View style={styles.filtros}>
        <TouchableOpacity
          style={[styles.botaoFiltro, filtro === 'todos' && styles.filtroSelecionado]}
          onPress={() => setFiltro('todos')}
        >
          <Text style={styles.textoBotao}>Todos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.botaoFiltro, filtro === 'pizza' && styles.filtroSelecionado]}
          onPress={() => setFiltro('pizza')}
        >
          <Text style={styles.textoBotao}>Pizzas</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.botaoFiltro, filtro === 'bebida' && styles.filtroSelecionado]}
          onPress={() => setFiltro('bebida')}
        >
          <Text style={styles.textoBotao}>Bebidas</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de produtos */}
      <FlatList
        data={produtosFiltrados}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>Nenhum produto encontrado.</Text>}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.nomeProduto}>{item.nome}</Text>
            <Text style={styles.categoriaProduto}>{item.categoria}</Text>
            <Text style={styles.precoProduto}>R$ {item.preco.toFixed(2)}</Text>

            {perfil === 'cliente' && (
              <View style={styles.contadorContainer}>
                <TouchableOpacity onPress={() => diminuirQuantidade(item)}>
                  <Ionicons name="remove-circle" size={28} color="#FF902C" />
                </TouchableOpacity>
                <Text style={styles.contadorTexto}>{quantidades[item.id] || 0}</Text>
                <TouchableOpacity onPress={() => aumentarQuantidade(item)}>
                  <Ionicons name="add-circle" size={28} color="#FF902C" />
                </TouchableOpacity>
              </View>
            )}

            {perfil === 'admin' && (
              <View style={styles.contadorContainer}>
                <TouchableOpacity onPress={() => navigation.navigate('Cadastro', { produto: item })}>
                  <Ionicons name="create" size={24} color="#FF902C" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => excluirProduto(item.id)}>
                  <Ionicons name="trash" size={24} color="#DF2A2A" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      />

      {perfil === 'admin' && (
        <TouchableOpacity
          style={styles.botaoAdicionar}
          onPress={() => navigation.navigate('Cadastro')}
        >
          <Ionicons name="add-circle" size={60} color="#FF902C" />
        </TouchableOpacity>
      )}

      {perfil === 'cliente' && (
        <TouchableOpacity
          style={styles.botaoCarrinho}
          onPress={() => navigation.navigate('Carrinho')}
        >
          <Ionicons name="cart" size={40} color="#FFF" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#FEF8E5' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  titulo: { fontSize: 28, fontWeight: 'bold', color: '#DF2A2A' },
  filtros: { flexDirection: 'row', justifyContent: 'center', marginVertical: 10 },
  botaoFiltro: {
    marginHorizontal: 10,
    backgroundColor: '#FF902C',
    padding: 12,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5
  },
  filtroSelecionado: { backgroundColor: '#DF2A2A' },
  textoBotao: { color: '#FFF', fontWeight: 'bold' },
  item: {
    padding: 15,
    backgroundColor: '#FFF',
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5
  },
  nomeProduto: { fontSize: 18, color: '#DF2A2A', fontWeight: 'bold' },
  categoriaProduto: { fontSize: 14, color: '#FF902C' },
  precoProduto: { fontSize: 14, color: '#333' },
  contadorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10
  },
  contadorTexto: { fontSize: 16, color: '#555', marginHorizontal: 10 },
  botaoAdicionar: { position: 'absolute', bottom: 20, right: 20 },
  botaoCarrinho: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: '#DF2A2A',
    padding: 10,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5
  }
});
