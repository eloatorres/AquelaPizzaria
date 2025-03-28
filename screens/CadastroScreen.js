// screens/CadastroScreen.js
import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList
} from 'react-native';
import { AppContext } from '../context/AppContext';

export default function CadastroScreen({ navigation }) {
  const { categorias, setCategorias, addProduto } = useContext(AppContext);

  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoria, setCategoria] = useState('');

  const salvarProduto = () => {
    if (!nome || !preco || !categoria) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios!');
      return;
    }

    const precoFormatado = parseFloat(preco.replace(',', '.'));
    if (isNaN(precoFormatado)) {
      Alert.alert('Erro', 'Preço inválido!');
      return;
    }

    const novoProduto = {
      nome,
      preco: precoFormatado,
      descricao,
      categoria
    };

    addProduto(novoProduto);
    Alert.alert('Sucesso', 'Produto cadastrado!');
    navigation.goBack();
  };

  const adicionarCategoria = () => {
    navigation.navigate('CadastroCategoria', { categorias, setCategorias });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Cadastro de Produto</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome do Produto"
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        style={styles.input}
        placeholder="Preço (ex: 29.90)"
        keyboardType="decimal-pad"
        value={preco}
        onChangeText={setPreco}
      />

      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Descrição do Produto (opcional)"
        multiline
        numberOfLines={4}
        value={descricao}
        onChangeText={setDescricao}
      />

      <Text style={styles.label}>Selecione a Categoria:</Text>
      <FlatList
        data={categorias}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.categoriaItem, categoria === item && styles.categoriaSelecionada]}
            onPress={() => setCategoria(item)}
          >
            <Text style={styles.categoriaTexto}>{item}</Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.botaoAdicionar} onPress={adicionarCategoria}>
        <Text style={styles.textoBotaoSecundario}>Adicionar Nova Categoria</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.botao} onPress={salvarProduto}>
        <Text style={styles.textoBotao}>Salvar Produto</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#FEF8E5' },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#DF2A2A',
    textAlign: 'center',
    marginBottom: 20
  },
  input: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#DF2A2A'
  },
  label: { fontSize: 16, color: '#DF2A2A', marginBottom: 10 },
  categoriaItem: {
    padding: 10,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#DF2A2A',
    alignItems: 'center'
  },
  categoriaSelecionada: {
    backgroundColor: '#FF902C',
    borderColor: '#FF902C'
  },
  categoriaTexto: { color: '#DF2A2A', fontWeight: 'bold' },
  botao: {
    backgroundColor: '#FF902C',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10
  },
  botaoAdicionar: {
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 20,
    borderWidth: 1,
    borderColor: '#FF902C'
  },
  textoBotao: { color: '#FFF', fontWeight: 'bold' },
  textoBotaoSecundario: { color: '#FF902C', fontWeight: 'bold' }
});