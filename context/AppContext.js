// context/AppContext.js
import React, { createContext, useState } from 'react';
import { Alert } from 'react-native';

export const AppContext = createContext();

const generateId = () => Math.random().toString(36).substring(2, 10);

export const AppProvider = ({ children }) => {
  const [perfil, setPerfil] = useState(null); // 'cliente' ou 'admin'

  const [produtos, setProdutos] = useState([
    {
      id: '1',
      nome: 'Pizza de Calabresa',
      preco: 29.9,
      descricao: 'Calabresa com cebola e queijo',
      categoria: 'Pizza'
    },
    {
      id: '2',
      nome: 'Refrigerante 2L',
      preco: 9.9,
      descricao: 'Coca-Cola bem gelada',
      categoria: 'Bebida'
    }
  ]);

  const [categorias, setCategorias] = useState(['Pizza', 'Bebida']);
  const [carrinho, setCarrinho] = useState([]);
  const [vendas, setVendas] = useState([]);

  const addProduto = (produto) => {
    const novo = { ...produto, id: generateId() };
    setProdutos([...produtos, novo]);
  };

  const addCategoria = (nova) => {
    if (!categorias.includes(nova)) {
      setCategorias([...categorias, nova]);
    } else {
      Alert.alert('Categoria já existe');
    }
  };

  const adicionarAoCarrinho = (produto) => {
    setCarrinho([...carrinho, produto]);
  };

  const limparCarrinho = () => {
    setCarrinho([]);
  };

  const registrarVenda = () => {
    if (carrinho.length === 0) return;

    const total = carrinho.reduce((soma, item) => soma + item.preco, 0);
    const venda = {
      id: generateId(),
      itens: [...carrinho],
      total,
      data: new Date().toISOString()
    };
    setVendas([...vendas, venda]);
    limparCarrinho();
    Alert.alert('Venda registrada com sucesso!');
  };

  return (
    <AppContext.Provider
      value={{
        perfil,
        setPerfil,
        produtos,
        setProdutos,
        addProduto,
        categorias,
        setCategorias,
        addCategoria,
        carrinho,
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
