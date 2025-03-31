// database/DbService.js
import * as SQLite from 'expo-sqlite';
import uuid from 'react-native-uuid';


export async function getDbConnection() {
  const db = await SQLite.openDatabaseAsync('dbPizzaria.db');
  return db;
}

export async function createTables() {
  const queries = [
    `CREATE TABLE IF NOT EXISTS produtos (
      id TEXT PRIMARY KEY NOT NULL,
      nome TEXT NOT NULL,
      preco REAL NOT NULL,
      descricao TEXT,
      categoria TEXT,
      imagem TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS categorias (
      id TEXT PRIMARY KEY NOT NULL,
      nome TEXT NOT NULL UNIQUE
    )`,
    `CREATE TABLE IF NOT EXISTS vendas (
      id TEXT PRIMARY KEY NOT NULL,
      data TEXT NOT NULL,
      total REAL NOT NULL,
      itens TEXT NOT NULL
    )`
  ];
  const db = await getDbConnection();
  for (const query of queries) {
    await db.execAsync(query);
  }
  await db.closeAsync();
}

// Produtos
export async function adicionarProduto(produto) {
  console.log('📦 Produto recebido para salvar no DB:', produto);

  try {
    const db = await getDbConnection();
    const query = `
      INSERT OR REPLACE INTO produtos (id, nome, preco, descricao, categoria, imagem)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const result = await db.runAsync(query, [
        produto.id || uuid.v4(),
      produto.nome,
      produto.preco,
      produto.descricao || '',
      produto.categoria,
      produto.imagem || ''
    ]);

    await db.closeAsync();

    console.log('✅ Produto salvo com sucesso no banco:', result);
    return true;
  } catch (error) {
    console.error('❌ Erro ao salvar produto no banco:', error);
    return false;
  }
}

export async function obterProdutos() {
  const db = await getDbConnection();
  const results = await db.getAllAsync('SELECT * FROM produtos');
  await db.closeAsync();
  return results.map(item => ({
    ...item,
    preco: parseFloat(item.preco)
  }));
}

export async function excluirProduto(id) {
  const db = await getDbConnection();
  const result = await db.runAsync('DELETE FROM produtos WHERE id = ?', [id]);
  await db.closeAsync();
  return result.changes === 1;
}

export async function limparProdutos() {
  const db = await getDbConnection();
  await db.execAsync('DELETE FROM produtos');
  await db.closeAsync();
}

// Categorias
export async function adicionarCategoria(nome) {
  const db = await getDbConnection();
  const query = 'INSERT INTO categorias (id, nome) VALUES (?, ?)';
  try {
    await db.runAsync(query, [uuid.v4(), nome]);
    await db.closeAsync();
    return true;
  } catch (error) {
    await db.closeAsync();
    return false;
  }
}

export async function obterCategorias() {
  const db = await getDbConnection();
  const results = await db.getAllAsync('SELECT nome FROM categorias ORDER BY nome ASC');
  await db.closeAsync();
  return results.map(item => item.nome);
}

export async function excluirCategoria(nome) {
  const db = await getDbConnection();
  const result = await db.runAsync('DELETE FROM categorias WHERE nome = ?', [nome]);
  await db.closeAsync();
  return result.changes === 1;
}

// Vendas
export async function salvarVenda(venda) {
  const db = await getDbConnection();
  const query = `INSERT INTO vendas (id, data, total, itens) VALUES (?, ?, ?, ?)`;
  const result = await db.runAsync(query, [
    venda.id,
    venda.data,
    venda.total,
    JSON.stringify(venda.itens)
  ]);
  await db.closeAsync();
  return result.changes === 1;
}

export async function obterVendas() {
  const db = await getDbConnection();
  const rows = await db.getAllAsync('SELECT * FROM vendas ORDER BY data DESC');
  await db.closeAsync();
  return rows.map(row => ({
    id: row.id,
    data: row.data,
    total: row.total,
    itens: JSON.parse(row.itens)
  }));
}

// 🔍 Função de debug para listar os produtos salvos
export async function listarProdutosConsole() {
  const db = await getDbConnection();
  const results = await db.getAllAsync('SELECT * FROM produtos');
  await db.closeAsync();
  console.log('📦 Produtos atuais no banco:');
  results.forEach((item, i) => {
    console.log(`  ${i + 1}.`, item);
  });
}
