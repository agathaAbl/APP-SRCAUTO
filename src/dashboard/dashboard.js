import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StatusBar, StyleSheet, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Car, ChartBar, TrendUp,
  Calendar as CalendarIcon,
  CaretRight, CaretLeft, BellRinging, SignOut,
} from 'phosphor-react-native';

import styles from './dashboardstyles';
import VehicleCard from '../components/vehiclecard';
import BankRow from '../components/bankrow';
import StatCard from '../components/statcard';
import CalendarioRegistros from '../Calendario/CalendarioRegistros';
import BottomMenu from '../menulateral/menulateral';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiFetch } from '../services/apiFetch';

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

/**
 * Garante uma data LOCAL sem risco de virar dia anterior/seguinte por timezone.
 * Sempre fixa a hora em 12:00.
 */
function criarDataLocalSegura(entrada) {
  if (!entrada) {
    const hoje = new Date();
    return new Date(
      hoje.getFullYear(),
      hoje.getMonth(),
      hoje.getDate(),
      12, 0, 0, 0
    );
  }

  // Se já for Date
  if (entrada instanceof Date && !isNaN(entrada.getTime())) {
    return new Date(
      entrada.getFullYear(),
      entrada.getMonth(),
      entrada.getDate(),
      12, 0, 0, 0
    );
  }

  // Se vier string yyyy-mm-dd
  if (typeof entrada === 'string') {
    const isoMatch = entrada.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (isoMatch) {
      const [, ano, mes, dia] = isoMatch;
      return new Date(Number(ano), Number(mes) - 1, Number(dia), 12, 0, 0, 0);
    }

    // Se vier dd/mm/yyyy
    const brMatch = entrada.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (brMatch) {
      const [, dia, mes, ano] = brMatch;
      return new Date(Number(ano), Number(mes) - 1, Number(dia), 12, 0, 0, 0);
    }

    // Fallback
    const tentativa = new Date(entrada);
    if (!isNaN(tentativa.getTime())) {
      return new Date(
        tentativa.getFullYear(),
        tentativa.getMonth(),
        tentativa.getDate(),
        12, 0, 0, 0
      );
    }
  }

  const hoje = new Date();
  return new Date(
    hoje.getFullYear(),
    hoje.getMonth(),
    hoje.getDate(),
    12, 0, 0, 0
  );
}

function formatarDataParaApi(data) {
  const dataSegura = criarDataLocalSegura(data);
  const a = dataSegura.getFullYear();
  const m = String(dataSegura.getMonth() + 1).padStart(2, '0');
  const d = String(dataSegura.getDate()).padStart(2, '0');
  return `${a}-${m}-${d}`;
}

function normalizarNumero(v) {
  if (v === null || v === undefined) return null;

  if (typeof v === 'string') {
    const texto = v.trim();
    if (texto === '') return null;

    // troca vírgula decimal por ponto quando necessário
    const convertido = Number(texto.replace(',', '.'));
    return Number.isFinite(convertido) ? convertido : null;
  }

  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function formatarNumero(v) {
  if (v === null || v === undefined) return '—';
  return String(v);
}

function getCorVariacao(valor) {
  if (valor > 0) return '#39d0a1';
  if (valor < 0) return '#ff4d4d';
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

export default function Dashboard({ navigation }) {
  const [dataSelecionada, setDataSelecionada] = useState(() =>
    criarDataLocalSegura(new Date())
  );
  const [cards, setCards] = useState([]);
  const [bancos, setBancos] = useState([]);
  const [notificacoes, setNotificacoes] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erroApi, setErroApi] = useState('');

  const ano = dataSelecionada.getFullYear();
  const mes = dataSelecionada.getMonth();
  const dia = dataSelecionada.getDate();

  const atualizarDataSelecionada = useCallback((novaData) => {
    const dataSegura = criarDataLocalSegura(novaData);

    console.log('🗓️ Nova data recebida do calendário:', novaData);
    console.log('🛡️ Data normalizada salva no state:', {
      local: dataSegura.toString(),
      iso: dataSegura.toISOString(),
      api: formatarDataParaApi(dataSegura),
    });

    setDataSelecionada(dataSegura);
  }, []);

  function mudarMes(delta) {
    setDataSelecionada((dataAnterior) => {
      const base = criarDataLocalSegura(dataAnterior);
      const novaData = new Date(
        base.getFullYear(),
        base.getMonth() + delta,
        base.getDate(),
        12, 0, 0, 0
      );

      console.log('📆 Mudança de mês:', {
        anterior: formatarDataParaApi(base),
        nova: formatarDataParaApi(novaData),
      });

      return novaData;
    });
  }

  async function buscarDashboard() {
    try {
      setCarregando(true);
      setErroApi('');

      const dadostoken = await AsyncStorage.getItem('Token');

      if (!dadostoken) {
        setErroApi('Sessão expirada. Faça login novamente.');
        return;
      }

      const token = JSON.parse(dadostoken);

      const dataSegura = criarDataLocalSegura(dataSelecionada);
      const dataFormatada = formatarDataParaApi(dataSegura);
     const endpoint = `/DashBoardGeral?Data=2026-04-07`;

      console.log('🧪 DEBUG DATA:', {
        dataSelecionadaString: dataSelecionada?.toString?.(),
        dataSelecionadaISO: dataSelecionada?.toISOString?.(),
        dataSeguraString: dataSegura?.toString?.(),
        dataSeguraISO: dataSegura?.toISOString?.(),
        timezoneOffset: dataSegura?.getTimezoneOffset?.(),
        dataFormatada,
        endpoint,
      });

      const data = await apiFetch(endpoint, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('📊 RESPOSTA CRUA API:', JSON.stringify(data, null, 2));

      const dados = {
        ...data,
        RegDiaSel_IN: normalizarNumero(data?.RegDiaSel_IN),
        RegSemAnt_IN: normalizarNumero(data?.RegSemAnt_IN),
        RegMesAnt_IN: normalizarNumero(data?.RegMesAnt_IN),
        RegDiaAnt_IN: normalizarNumero(data?.RegDiaAnt_IN),
        VarDia_PC: normalizarNumero(data?.VarDia_PC),
      };

      console.log('🔧 DADOS NORMALIZADOS:', dados);

      const cardsArray = [
        {
          valor: formatarNumero(dados.RegDiaSel_IN),
          descricao: 'Registros Hoje',
          icon: CalendarIcon,
          cor: '#39d0a1',
        },
        {
          valor: formatarNumero(dados.RegSemAnt_IN),
          descricao: 'Semana Anterior',
          icon: ChartBar,
          cor: '#4da6ff',
        },
        {
          valor: formatarNumero(dados.RegMesAnt_IN),
          descricao: 'Mês Anterior',
          icon: Car,
          cor: '#ffb84d',
        },
        {
          valor: dados.RegDiaAnt_IN === 0 ? 'Novo' : formatarPercentual(dados.VarDia_PC),
          descricao: 'Variação Dia',
          icon: TrendUp,
          cor: getCorVariacao(dados.VarDia_PC),
        },
      ];

      setCards(cardsArray);

      const listaCredores = Array.isArray(data?.Credor) ? data.Credor : [];

      setBancos(
        listaCredores.map((b) => {
          const regDia = normalizarNumero(b?.RegDiaSel_IN);
          const regDiaAnt = normalizarNumero(b?.RegDiaAnt_IN);

          return {
            ...b,
            RegDiaSel_IN: regDia,
            RegDiaAnt_IN: regDiaAnt,
            variacaoFormatada:
              regDiaAnt === 0 ? 'Novo' : formatarPercentual(b?.VarDia_PC),
          };
        })
      );

      setNotificacoes([
        ...(Array.isArray(data?.Credor) ? data.Credor : []),
        ...(Array.isArray(data?.Detran) ? data.Detran : []),
      ]);
    } catch (error) {
      console.error('⚠️ Erro ao buscar dashboard:', error);

      if (String(error?.message).includes('404')) {
        setErroApi('Endpoint não encontrado. Verifique a URL da API.');
      } else if (String(error?.message).includes('Network request failed')) {
        setErroApi('Não foi possível conectar ao servidor. Verifique sua rede.');
      } else {
        setErroApi('Ocorreu um erro ao buscar os dados.');
      }
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    console.log('📅 Data selecionada mudou:', {
      local: dataSelecionada?.toString?.(),
      iso: dataSelecionada?.toISOString?.(),
      api: formatarDataParaApi(dataSelecionada),
    });

    buscarDashboard();
  }, [dataSelecionada]);

  return (
    <View style={{ flex: 1, backgroundColor: '#071a2c' }}>
      <SafeAreaView style={{ flex: 1 }} edges={['left', 'right', 'bottom']}>
        <StatusBar barStyle="light-content" />

        <View style={styles.header}>
          <View style={styles.topBar}>
            <View style={styles.headerActions}>
              <TouchableOpacity
                style={styles.iconBtn}
                onPress={() => navigation.navigate('notificacoes')}
              >
                <BellRinging size={24} color="#39d0a1" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.iconBtn}
                onPress={() => navigation.navigate('login')}
              >
                <SignOut size={24} color="#39d0a1" />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.hello}>Olá, Operador</Text>
          <Text style={styles.subtitle}>Painel de registros</Text>
        </View>

        <View style={campo.container}>
          <TouchableOpacity onPress={() => mudarMes(-1)}>
            <CaretLeft size={20} color="#258769" />
          </TouchableOpacity>

          <Text style={campo.titulo}>
            {dia} de {MESES[mes]} de {ano}
          </Text>

          <View style={campo.ladoDireito}>
            <CalendarioRegistros
              dataSelecionada={dataSelecionada}
              setDataSelecionada={atualizarDataSelecionada}
            />

            <TouchableOpacity onPress={() => mudarMes(1)}>
              <CaretRight size={20} color="#258769" />
            </TouchableOpacity>
          </View>
        </View>

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

        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
          <View style={styles.content}>
            <View style={styles.statsGrid}>
              {cards.map((item, index) => (
                <StatCard key={index} item={item} />
              ))}
            </View>

            <View style={styles.sectionRow}>
              <Text style={styles.sectionTitle}>Bancos com Mais Registros</Text>
            </View>

            <View style={styles.banksCard}>
              {bancos.length > 0 ? (
                bancos.map((banco, i) => (
                  <BankRow key={i} banco={banco} indice={i} />
                ))
              ) : (
                !carregando && (
                  <Text style={campo.listaVazia}>Nenhum banco encontrado.</Text>
                )
              )}
            </View>

            <View style={styles.sectionRow}>
              <Text style={styles.sectionTitle}>Notificações</Text>
            </View>

            {notificacoes.length > 0 ? (
              notificacoes.map((notificacao, index) => (
                <VehicleCard
                  key={index}
                  registro={{
                    nome: notificacao.tCrdr_Nome_SL || notificacao.UF,
                    registrosDia: notificacao.RegDiaSel_IN,
                    variacao: notificacao.VarDia_PC,
                  }}
                />
              ))
            ) : (
              !carregando && (
                <Text style={campo.listaVazia}>
                  Nenhuma notificação encontrada.
                </Text>
              )
            )}

            <View style={{ height: 100 }} />
          </View>
        </ScrollView>

        <BottomMenu navigation={navigation} notificacoes={notificacoes} />
      </SafeAreaView>
    </View>
  );
}

const campo = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0e2236',
    borderRadius: 8,
    padding: 10,
    marginHorizontal: 16,
    marginBottom: 6,
  },
  titulo: {
    color: '#258769',
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  ladoDireito: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    padding: 16,
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
  },
  erroBox: {
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: '#4a1f1f',
    padding: 12,
    borderRadius: 8,
  },
  erroText: {
    color: '#ffb3b3',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  listaVazia: {
    color: '#7a8fb5',
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },
});
