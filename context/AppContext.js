// context/AppContext.js
import React, { createContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import uuid from 'react-native-uuid';

import {
  createTables,
  obterProdutos,
  adicionarProduto as salvarNoBanco,
  excluirProduto as excluirDoBanco,
  adicionarCategoria as salvarCategoriaNoBanco,
  obterCategorias,
  excluirCategoria as excluirCategoriaDoBanco,
  salvarVenda,
  obterVendas
} from '../database/DbService';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [carrinho, setCarrinho] = useState([]);
  const [vendas, setVendas] = useState([]);
  const [perfil, setPerfil] = useState(null);

  useEffect(() => {
    async function init() {
      await createTables();
      const produtosDb = await obterProdutos();
      const categoriasDb = await obterCategorias();
      const vendasDb = await obterVendas();
      setProdutos(produtosDb);
      setCategorias(categoriasDb);
      setVendas(vendasDb);
    }
    init();
  }, []);

  const addProduto = async (produto) => {
    try {
      const sucesso = await salvarNoBanco(produto);
  
      if (sucesso) {
        const atualizados = await obterProdutos();
        setProdutos(atualizados);
        return true;
      } else {
        Alert.alert('Erro', 'Erro ao salvar o produto.');
        return false;
      }
    } catch (e) {
      console.error('Erro ao salvar produto no contexto:', e);
      Alert.alert('Erro', 'Erro inesperado ao salvar produto.');
      return false;
    }
  };

  const removerProduto = async (id) => {
    const sucesso = await excluirDoBanco(id);
    if (sucesso) {
      setProdutos(prev => prev.filter(p => p.id !== id));
    }
  };

  const addCategoria = async (nova) => {
    const sucesso = await salvarCategoriaNoBanco(nova);
    if (sucesso) {
      setCategorias(prev => [...prev, nova]);
    } else {
      Alert.alert('Atenção', 'Categoria já existe ou erro ao salvar.');
    }
  };

  const removerCategoria = async (nome) => {
    const sucesso = await excluirCategoriaDoBanco(nome);
    if (sucesso) {
      setCategorias(prev => prev.filter(c => c !== nome));
    }
  };

  const adicionarAoCarrinho = (produto) => {
    setCarrinho([...carrinho, produto]);
  };

  const limparCarrinho = () => {
    setCarrinho([]);
  };

  const registrarVenda = async () => {
    if (carrinho.length === 0) return false;
  
    const total = carrinho.reduce((soma, item) => soma + item.preco, 0);
    const venda = {
      id: uuid.v4(),
      itens: [...carrinho],
      total,
      data: new Date().toISOString()
    };
  
    try {
      const sucesso = await salvarVenda(venda);
      if (sucesso) {
        const atualizadas = await obterVendas();
        setVendas(atualizadas);
        limparCarrinho();
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Erro ao registrar venda:', error);
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        perfil,
        setPerfil,
        produtos,
        setProdutos,
        addProduto,
        removerProduto,
        categorias,
        setCategorias,
        addCategoria,
        removerCategoria,
        carrinho,
        setCarrinho,
        adicionarAoCarrinho,
        limparCarrinho,
        vendas,
        registrarVenda
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
