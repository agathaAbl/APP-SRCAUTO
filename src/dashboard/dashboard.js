import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StatusBar, StyleSheet, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Car, ChartBar, TrendUp,
  CalendarDots as CalendarDotsIcon,
  CaretRight, CaretLeft, BellRinging, SignOut,
} from 'phosphor-react-native';

import styles from './dashboardstyles';
import VehicleCard from '../components/vehiclecard';
import BankRow from '../components/bankrow';
import StatCard from '../components/statcard';
import CalendarioRegistros from '../Calendario/CalendarioRegistros';
import BottomMenu from '../menulateral/menulateral';
import { getAuth } from '../services/storage'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://srcauto-homolog.grupoabl.com.br/Api/SRC/DashBoardGeral?';

const MESES = [
  'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
  'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro',
];

export default function Dashboard({ navigation }) {
  
  const [dataSelecionada, setDataSelecionada] = useState(() => new Date('2025-02-01T12:00:00'));
  const [cards, setCards] = useState([]);
  const [bancos, setBancos] = useState([]);
  const [notificacoes, setNotificacoes] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erroApi, setErroApi] = useState('');

  const ano = dataSelecionada.getFullYear();
  const mes = dataSelecionada.getMonth();
  const dia = dataSelecionada.getDate();

  
  function formatarDataParaApi(data) {
    const a = data.getFullYear();
    const m = String(data.getMonth() + 1).padStart(2, '0');
    const d = String(data.getDate()).padStart(2, '0');
    return `${a}-${m}-${d}`;
  }

  function mudarMes(delta) {
    const novaData = new Date(dataSelecionada);
    novaData.setMonth(novaData.getMonth() + delta);
    setDataSelecionada(novaData);
  }

  function getCorVariacao(valor) {
    const v = Number(valor);
    if (v > 0) return '#39d0a1';
    if (v < 0) return '#ff4d4d';
    return '#7a8fb5';
  }

  function formatarPercentual(valor) {
    if (valor === null || valor === undefined) return '—';
    const v = Number(valor);
    if (isNaN(v)) return '—';
    if (v > 200) return '+200%+';
    if (v < -200) return '-200%-';
    return `${v.toFixed(2)}%`;
  }

  const normalizarNumero = (v) => {
    if (v === null || v === undefined || v === '') return null;
    const n = Number(v);
    return isNaN(n) ? null : n;
  };

  function formatarNumero(v) {
    if (v === null || v === undefined) return '—';
    return String(v);
  }

 
  async function buscarDashboard() {
  try {
    setCarregando(true);
    setErroApi('');

    // Recupera token apenas do AsyncStorage
    const dadostoken = await AsyncStorage.getItem("Token");
    if (!dadostoken) {
      setErroApi('Sessão expirada. Faça login novamente.');
      setCarregando(false);
      return;
    }
    const token = JSON.parse(dadostoken);

    const dataFormatada = formatarDataParaApi(dataSelecionada);
    const url = `${API_URL}?Data=${dataFormatada}&DiaUtil=True`;

    console.log("🔎 URL chamada:", url);
    console.log("🔑 Token usado:", token);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      setErroApi('Sessão inválida ou expirada.');
      setCarregando(false);
      return;
    }

    if (!response.ok) {
      const erroServidor = await response.text();
      console.error("❌ Erro servidor:", erroServidor);
      throw new Error(`Erro HTTP: ${response.status} - ${erroServidor}`);
    }

    const data = await response.json();

    const dados = {
      ...data,
      RegDiaSel_IN: normalizarNumero(data?.RegDiaSel_IN),
      RegSemAnt_IN: normalizarNumero(data?.RegSemAnt_IN),
      RegMesAnt_IN: normalizarNumero(data?.RegMesAnt_IN),
      RegDiaAnt_IN: normalizarNumero(data?.RegDiaAnt_IN),
      VarDia_PC: normalizarNumero(data?.VarDia_PC),
    };

    setCards([
      { valor: formatarNumero(dados.RegDiaSel_IN), descricao: 'Registros Hoje', icon: CalendarDotsIcon, cor: '#39d0a1' },
      { valor: formatarNumero(dados.RegSemAnt_IN), descricao: 'Semana Anterior', icon: ChartBar, cor: '#4da6ff' },
      { valor: formatarNumero(dados.RegMesAnt_IN), descricao: 'Mês Anterior', icon: Car, cor: '#ffb84d' },
      {
        valor: dados.RegDiaAnt_IN === 0 ? 'Novo' : formatarPercentual(dados.VarDia_PC),
        descricao: 'Variação Dia', icon: TrendUp, cor: getCorVariacao(dados.VarDia_PC),
      },
    ]);

    const listaCredores = data?.Credor || [];
    setBancos(listaCredores.map((b) => {
      const regDia = normalizarNumero(b?.RegDiaSel_IN);
      const regDiaAnt = normalizarNumero(b?.RegDiaAnt_IN);
      return {
        ...b,
        RegDiaSel_IN: regDia,
        RegDiaAnt_IN: regDiaAnt,
        variacaoFormatada: regDiaAnt === 0 ? 'Novo' : formatarPercentual(b?.VarDia_PC),
      };
    }));

    setNotificacoes([
      ...(Array.isArray(data?.Credor) ? data.Credor : []),
      ...(Array.isArray(data?.Detran) ? data.Detran : []),
    ]);

  } catch (error) {
    console.error('⚠️ Erro ao buscar dashboard:', error);
    setErroApi('Não foi possível conectar ao servidor.');
  } finally {
    setCarregando(false);
  }
}

  
  useEffect(() => { 
    buscarDashboard(); 
  }, [dataSelecionada]);


  return (
    <View style={{ flex: 1, backgroundColor: '#071a2c' }}>
      <SafeAreaView style={{ flex: 1 }} edges={['left', 'right', 'bottom']}>
        <StatusBar barStyle="light-content" />

        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.topBar}>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('notificacoes')}>
                <BellRinging size={24} color="#39d0a1" />  
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('login')}>
                <SignOut size={24} color="#39d0a1" />  
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.hello}>Olá, Operador</Text>
          <Text style={styles.subtitle}>Painel de registros</Text>
        </View>

        {/* SELETOR DE DATA */}
        <View style={campo.container}>
          <TouchableOpacity onPress={() => mudarMes(-1)}>
            <CaretLeft size={20} color="#258769" />
          </TouchableOpacity>
          <Text style={campo.titulo}>{dia} de {MESES[mes]} de {ano}</Text>
          <View style={campo.ladoDireito}>
            <CalendarioRegistros
              dataSelecionada={dataSelecionada}
              setDataSelecionada={setDataSelecionada}
            />
            <TouchableOpacity onPress={() => mudarMes(1)}>
              <CaretRight size={20} color="#258769" />
            </TouchableOpacity>
          </View>
        </View>

        {/* FEEDBACK DE STATUS */}
        {carregando && (
          <View style={campo.statusBox}>
            <ActivityIndicator color="#39d0a1" />
            <Text style={campo.statusText}>Carregando dados...</Text>
          </View>
        )}
        
        {!!erroApi && (
          <View style={campo.erroBox}>
            <Text style={campo.erroText}>{erroApi}</Text>
          </View>
        )}

        {/* CONTEÚDO SCROLLABLE */}
        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
          <View style={styles.content}>
            
            {/* Grid de Estatísticas (Cards Superiores) */}
            <View style={styles.statsGrid}>
              {cards.map((item, index) => <StatCard key={index} item={item} />)}
            </View>

            {/* Seção de Bancos */}
            <View style={styles.sectionRow}>
              <Text style={styles.sectionTitle}>Bancos com Mais Registros</Text>
            </View>
            <View style={styles.banksCard}>
              {bancos.length > 0
                ? bancos.map((banco, i) => <BankRow key={i} banco={banco} indice={i} />)
                : !carregando && <Text style={campo.listaVazia}>Nenhum banco encontrado.</Text>
              }
            </View>

            {/* Seção de Notificações/Veículos */}
            <View style={styles.sectionRow}>
              <Text style={styles.sectionTitle}>Notificações</Text>
            </View>
            {notificacoes.length > 0
              ? notificacoes.map((notificacao, index) => (
                  <VehicleCard
                    key={index}
                    registro={{
                      nome: notificacao.tCrdr_Nome_SL || notificacao.UF,
                      registrosDia: notificacao.RegDiaSel_IN,
                      variacao: notificacao.VarDia_PC,
                    }}
                  />
                ))
              : !carregando && <Text style={campo.listaVazia}>Nenhuma notificação encontrada.</Text>
            }
            
            {/* Espaçamento final para o menu bottom não cobrir o conteúdo */}
            <View style={{ height: 100 }} />
          </View>
        </ScrollView>

        {/* MENU INFERIOR */}
        <BottomMenu navigation={navigation} notificacoes={notificacoes} />
      </SafeAreaView>
    </View>
  );
}

const campo = StyleSheet.create({
  container: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#0e2236', borderRadius: 8, padding: 10, marginHorizontal: 16, marginBottom: 6,
  },
  titulo: { color: '#258769', fontWeight: '600', flex: 1, textAlign: 'center' },
  ladoDireito: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statusBox: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, padding: 16 },
  statusText: { color: '#fff', fontSize: 14 },
  erroBox: { marginHorizontal: 16, marginVertical: 8, backgroundColor: '#4a1f1f', padding: 12, borderRadius: 8 },
  erroText: { color: '#ffb3b3', textAlign: 'center', fontWeight: 'bold' },
  listaVazia: { color: '#7a8fb5', textAlign: 'center', marginTop: 10, fontStyle: 'italic' },
});