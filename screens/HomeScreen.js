// screens/HomeScreen.js
import React, { useContext, useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';
import { useFocusEffect } from '@react-navigation/native';
import { obterProdutos } from '../database/DbService';

export default function HomeScreen({ navigation }) {
  const { perfil, produtos, setProdutos, adicionarAoCarrinho, removerProduto, categorias } = useContext(AppContext);
  const [filtro, setFiltro] = useState('todos');
  const [quantidades, setQuantidades] = useState({});
  const [carregando, setCarregando] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const carregarProdutos = async () => {
        setCarregando(true);
        const atualizados = await obterProdutos();
        setProdutos(atualizados);
        setCarregando(false);
      };
      carregarProdutos();
    }, [])
  );

  const produtosFiltrados =
    filtro === 'todos' ? produtos : produtos.filter(p => p.categoria?.toLowerCase() === filtro);

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
    removerProduto(id);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>🍕 Aquela Pizzaria</Text>

      <View style={styles.filtros}>
        <TouchableOpacity
          style={[styles.botaoFiltro, filtro === 'todos' && styles.filtroSelecionado]}
          onPress={() => setFiltro('todos')}
        >
          <Text style={styles.textoFiltro}>Todos</Text>
        </TouchableOpacity>
        {categorias.map((cat, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.botaoFiltro, filtro === cat.toLowerCase() && styles.filtroSelecionado]}
            onPress={() => setFiltro(cat.toLowerCase())}
          >
            <Text style={styles.textoFiltro}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {carregando ? (
        <ActivityIndicator size="large" color="#DF2A2A" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={produtosFiltrados}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>Nenhum produto encontrado.</Text>}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <View style={{ flex: 1 }}>
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
            </View>
          )}
        />
      )}

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
  titulo: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#DF2A2A',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 25,
    fontFamily: 'Poppins_700Bold'
  },
  filtros: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 20
  },
  botaoFiltro: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 30,
    backgroundColor: '#FF902C',
    margin: 4
  },
  filtroSelecionado: {
    backgroundColor: '#DF2A2A'
  },
  textoFiltro: {
    color: '#FFF',
    fontWeight: 'bold',
    fontFamily: 'Poppins_600SemiBold'
  },
  item: {
    padding: 16,
    backgroundColor: '#FFF',
    marginVertical: 10,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5
  },
  nomeProduto: {
    fontSize: 18,
    color: '#DF2A2A',
    fontWeight: 'bold',
    fontFamily: 'Poppins_600SemiBold'
  },
  categoriaProduto: {
    fontSize: 14,
    color: '#FF902C',
    fontFamily: 'Poppins_400Regular'
  },
  precoProduto: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'Poppins_400Regular'
  },
  contadorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 10
  },
  contadorTexto: {
    fontSize: 16,
    color: '#555',
    marginHorizontal: 10,
    fontFamily: 'Poppins_500Medium'
  },
  botaoAdicionar: {
    position: 'absolute',
    bottom: 20,
    right: 20
  },
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
