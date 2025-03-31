// screens/HistoricoScreen.js
import React, { useContext } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { AppContext } from '../context/AppContext';

export default function HistoricoScreen() {
  const { perfil, vendas } = useContext(AppContext);

  const isAdmin = perfil === 'admin';

  const vendasFiltradas = isAdmin ? vendas : vendas.filter(v => v.perfil === 'cliente');

  const formatarDataHora = (iso) => {
    const data = new Date(iso);
    data.setHours(data.getHours() - 3); // Ajuste para GMT-3
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    const hora = String(data.getHours()).padStart(2, '0');
    const min = String(data.getMinutes()).padStart(2, '0');
    return `${dia}/${mes}/${ano} ${hora}:${min}`;
  };

  const totalGeral = vendasFiltradas.reduce((acc, v) => acc + v.total, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Histórico de Pedidos</Text>
      <FlatList
        data={vendasFiltradas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.vendaItem}>
            <Text style={styles.data}>{formatarDataHora(item.data)}</Text>
            {item.itens.map((i, idx) => (
              <Text key={idx} style={styles.item}>{`• ${i.nome} - R$ ${i.preco.toFixed(2)}`}</Text>
            ))}
            <Text style={styles.total}>Total: R$ {item.total.toFixed(2)}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.vazio}>Nenhuma venda encontrada.</Text>}
      />

      {vendasFiltradas.length > 0 && (
        <Text style={styles.totalGeral}>Valor Total: R$ {totalGeral.toFixed(2)}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#FEF8E5' },
  titulo: { fontSize: 24, fontWeight: 'bold', color: '#DF2A2A', textAlign: 'center', marginBottom: 20 },
  vendaItem: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, elevation: 3 },
  data: { fontWeight: 'bold', marginBottom: 5, color: '#333' },
  item: { color: '#555', marginLeft: 10 },
  total: { fontWeight: 'bold', color: '#FF902C', marginTop: 5, textAlign: 'right' },
  totalGeral: { marginTop: 15, fontSize: 18, fontWeight: 'bold', textAlign: 'right', color: '#DF2A2A' },
  vazio: { textAlign: 'center', color: '#999', marginTop: 30 }
});
