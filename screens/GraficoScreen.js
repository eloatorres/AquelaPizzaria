// screens/GraficoScreen.js
import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { AppContext } from '../context/AppContext';

export default function GraficoScreen() {
  const { vendas } = useContext(AppContext);
  const [periodo, setPeriodo] = useState('todos');

  const hoje = new Date();
  const vendasFiltradas = vendas.filter(venda => {
    if (periodo === '7dias') {
      const dataVenda = new Date(venda.data);
      const diff = (hoje - dataVenda) / (1000 * 60 * 60 * 24);
      return diff <= 7;
    }
    if (periodo === '30dias') {
      const dataVenda = new Date(venda.data);
      const diff = (hoje - dataVenda) / (1000 * 60 * 60 * 24);
      return diff <= 30;
    }
    return true;
  });

  const contagemPorProduto = {};
  const contagemPorPizza = {};

  vendasFiltradas.forEach(venda => {
    venda.itens.forEach(item => {
      const chaveProduto = `${item.categoria}: ${item.nome}`;
      contagemPorProduto[chaveProduto] = (contagemPorProduto[chaveProduto] || 0) + 1;

      if (item.categoria.toLowerCase() === 'pizza') {
        contagemPorPizza[item.nome] = (contagemPorPizza[item.nome] || 0) + 1;
      }
    });
  });

  const chartDataProdutos = Object.keys(contagemPorProduto).map((nome, index) => ({
    name: nome,
    population: contagemPorProduto[nome],
    color: cores[index % cores.length],
  }));

  const chartDataPizzas = Object.keys(contagemPorPizza).map((nome, index) => ({
    name: nome,
    population: contagemPorPizza[nome],
    color: cores[index % cores.length],
  }));

  const renderLegendas = (data) => (
    <View style={styles.legendasContainer}>
      {data.map((item, index) => (
        <View key={index} style={styles.legendaItem}>
          <View style={[styles.legendaCor, { backgroundColor: item.color }]} />
          <Text style={styles.legendaTexto}>{item.name}</Text>
        </View>
      ))}
    </View>
  );

  const larguraGrafico = Math.min(Dimensions.get('window').width * 0.9, 320);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.tituloContainer}>
        <Text style={styles.titulo}>Dashboard de Vendas</Text>
      </View>

      <View style={styles.filtrosPeriodo}>
        <TouchableOpacity onPress={() => setPeriodo('todos')} style={[styles.botaoPeriodo, periodo === 'todos' && styles.selecionado]}>
          <Text style={styles.textoBotao}>Todos</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setPeriodo('7dias')} style={[styles.botaoPeriodo, periodo === '7dias' && styles.selecionado]}>
          <Text style={styles.textoBotao}>Últimos 7 dias</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setPeriodo('30dias')} style={[styles.botaoPeriodo, periodo === '30dias' && styles.selecionado]}>
          <Text style={styles.textoBotao}>Últimos 30 dias</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.chartWrapper}>
        <Text style={styles.subtitulo}>Produtos Mais Vendidos</Text>
        {chartDataProdutos.length > 0 ? (
          <>
            <View style={styles.chartContainer}>
              <PieChart
                center={[70, 0]}
                data={chartDataProdutos}
                width={larguraGrafico}
                height={240}
                chartConfig={chartConfig}
                accessor="population"
                backgroundColor="transparent"
                hasLegend={false}
                absolute
              />
            </View>
            {renderLegendas(chartDataProdutos)}
          </>
        ) : (
          <Text style={styles.vazio}>Nenhuma venda registrada nesse período.</Text>
        )}

        <Text style={styles.subtitulo}>Pizzas Mais Vendidas</Text>
        {chartDataPizzas.length > 0 ? (
          <>
            <View style={styles.chartContainer}>
              <PieChart
              center={[70, 0]}
                data={chartDataPizzas}
                width={larguraGrafico}
                height={240}
                chartConfig={chartConfig}
                accessor="population"
                backgroundColor="transparent"
                hasLegend={false}
                absolute
              />
            </View>
            {renderLegendas(chartDataPizzas)}
          </>
        ) : (
          <Text style={styles.vazio}>Nenhuma pizza vendida nesse período.</Text>
        )}
      </View>
    </ScrollView>
  );
}

const cores = ['#FF902C', '#DF2A2A', '#FFD700', '#A52A2A', '#FF6347', '#D2691E'];

const chartConfig = {
  color: (opacity = 1) => `rgba(223, 42, 42, ${opacity})`,
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FEF8E5' },
  scrollContent: { alignItems: 'center', padding: 20 },
  tituloContainer: { alignItems: 'center' },
  titulo: { fontSize: 24, fontWeight: 'bold', color: '#DF2A2A', textAlign: 'center', marginBottom: 20 },
  filtrosPeriodo: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20, width: '100%' },
  botaoPeriodo: { backgroundColor: '#FF902C', padding: 10, borderRadius: 20 },
  selecionado: { backgroundColor: '#DF2A2A' },
  textoBotao: { color: '#FFF', fontWeight: 'bold' },
  subtitulo: { fontSize: 18, fontWeight: 'bold', color: '#FF902C', marginTop: 30, marginBottom: 10, textAlign: 'center' },
  vazio: { marginTop: 10, color: '#888', fontSize: 16, textAlign: 'center' },
  chartWrapper: { alignItems: 'center', width: '100%' },
  chartContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 10,
    paddingRight: 10
  },
  legendasContainer: { marginTop: 10, marginBottom: 20, alignItems: 'flex-start' },
  legendaItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  legendaCor: { width: 16, height: 16, marginRight: 10, borderRadius: 4 },
  legendaTexto: { color: '#333', fontSize: 14 }
});
