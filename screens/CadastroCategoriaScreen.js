// screens/CadastroCategoriaScreen.js
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
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';

export default function CadastroCategoriaScreen({ route, navigation }) {
  const { categorias, setCategorias } = useContext(AppContext);
  const [novaCategoria, setNovaCategoria] = useState('');

  const adicionarOuEditarCategoria = () => {
    const nome = novaCategoria.trim();
    if (!nome) {
      Alert.alert('Erro', 'Informe o nome da categoria.');
      return;
    }
    if (categorias.includes(nome)) {
      Alert.alert('Atenção', 'Essa categoria já existe.');
      return;
    }
    setCategorias([...categorias, nome]);
    setNovaCategoria('');
    Alert.alert('Sucesso', 'Categoria salva!');
  };

  const excluirCategoria = (categoria) => {
    Alert.alert('Confirmar', `Deseja excluir a categoria "${categoria}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir', style: 'destructive', onPress: () => {
          setCategorias(categorias.filter(c => c !== categoria));
        }
      }
    ]);
  };

  const editarCategoria = (categoria) => {
    setNovaCategoria(categoria);
    setCategorias(categorias.filter(c => c !== categoria));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Cadastro de Categoria</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome da categoria"
        value={novaCategoria}
        onChangeText={setNovaCategoria}
      />

      <TouchableOpacity style={styles.botao} onPress={adicionarOuEditarCategoria}>
        <Text style={styles.textoBotao}>Salvar Categoria</Text>
      </TouchableOpacity>

      <Text style={styles.subtitulo}>Categorias Existentes:</Text>

      <FlatList
        data={categorias}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.categoriaItem}>
            <Text style={styles.categoriaTexto}>{item}</Text>
            <View style={styles.icones}>
              <TouchableOpacity onPress={() => editarCategoria(item)}>
                <Ionicons name="create" size={22} color="#FF902C" style={{ marginRight: 10 }} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => excluirCategoria(item)}>
                <Ionicons name="trash" size={22} color="#DF2A2A" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <TouchableOpacity style={styles.botaoVoltar} onPress={() => navigation.goBack()}>
        <Text style={styles.textoBotaoSecundario}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#FEF8E5' },
  titulo: { fontSize: 28, fontWeight: 'bold', color: '#DF2A2A', textAlign: 'center', marginBottom: 20 },
  subtitulo: { fontSize: 18, fontWeight: 'bold', color: '#DF2A2A', marginTop: 30, marginBottom: 10 },
  input: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#DF2A2A'
  },
  botao: {
    backgroundColor: '#FF902C',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center'
  },
  textoBotao: { color: '#FFF', fontWeight: 'bold' },
  botaoVoltar: {
    marginTop: 30,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#FF902C',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center'
  },
  textoBotaoSecundario: { color: '#FF902C', fontWeight: 'bold' },
  categoriaItem: {
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#DF2A2A',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  categoriaTexto: { color: '#DF2A2A', fontWeight: 'bold', fontSize: 16 },
  icones: { flexDirection: 'row', alignItems: 'center' }
});