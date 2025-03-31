// screens/CadastroScreen.js
import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { AppContext } from '../context/AppContext';

export default function CadastroScreen({ route, navigation }) {
  const { addProduto, categorias } = useContext(AppContext);
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoria, setCategoria] = useState('');
  const [imagem, setImagem] = useState(null);

  useEffect(() => {
    if (route.params?.produto) {
      const { produto } = route.params;
      setNome(produto.nome || '');
      setPreco(produto.preco?.toString() || '');
      setDescricao(produto.descricao || '');
      setCategoria(produto.categoria || '');
      setImagem(produto.imagem || null);
    } else {
      limparCampos();
    }
  }, [route.params]);

  const limparCampos = () => {
    setNome('');
    setPreco('');
    setDescricao('');
    setCategoria('');
    setImagem(null);
  };

  const selecionarImagem = async () => {
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.6
    });

    if (!resultado.canceled) {
      setImagem(resultado.assets[0].uri);
    }
  };

  const salvarProduto = async () => {
    console.log('Tentando salvar produto...');

    if (!nome || !preco || !categoria) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios!');
      return;
    }

    const produto = {
      nome,
      preco: parseFloat(preco),
      descricao,
      categoria,
      imagem: imagem || ''
    };

    const sucesso = await addProduto(produto);
    console.log('Produto salvo no contexto?', sucesso);

    if (sucesso) {
      Alert.alert('Sucesso', 'Produto cadastrado!', [
        { text: 'OK', onPress: () => navigation.navigate('Home') }
      ]);
      limparCampos();
    } else {
      Alert.alert('Erro', 'Erro ao salvar o produto.');
    }
  };

  const adicionarCategoria = () => {
    navigation.navigate('CadastroCategoria');
  };

  const selecionarCategoria = (cat) => {
    setCategoria(cat);
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.titulo}>Cadastro de Produto</Text>

      <TouchableOpacity style={styles.botaoImagem} onPress={selecionarImagem}>
        <Text style={styles.textoBotaoSecundario}>Selecionar Imagem</Text>
      </TouchableOpacity>
      {imagem && <Image source={{ uri: imagem }} style={styles.imagemPreview} />}

      <TextInput
        style={styles.input}
        placeholder="Nome do Produto"
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        style={styles.input}
        placeholder="Preço (ex: 29.90)"
        keyboardType="numeric"
        value={preco}
        onChangeText={setPreco}
      />

      <TextInput
        style={styles.input}
        placeholder="Descrição (opcional)"
        value={descricao}
        onChangeText={setDescricao}
      />

      <Text style={styles.label}>Selecione a Categoria:</Text>
      {categorias.map((cat, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.categoriaItem, categoria === cat && styles.categoriaSelecionada]}
          onPress={() => selecionarCategoria(cat)}
        >
          <Text style={styles.categoriaTexto}>{cat}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.botaoImagem} onPress={adicionarCategoria}>
        <Text style={styles.textoBotaoSecundario}>Adicionar Nova Categoria</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.botao} onPress={salvarProduto}>
        <Text style={styles.textoBotao}>Salvar Produto</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#FEF8E5' },
  titulo: { fontSize: 28, fontWeight: 'bold', color: '#DF2A2A', textAlign: 'center', marginBottom: 20 },
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
    marginTop: 20,
    marginBottom: 40
  },
  textoBotao: { color: '#FFF', fontWeight: 'bold' },
  botaoImagem: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#FF902C',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15
  },
  textoBotaoSecundario: { color: '#FF902C', fontWeight: 'bold' },
  imagemPreview: {
    width: '100%',
    height: 150,
    marginBottom: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FF902C'
  }
});
