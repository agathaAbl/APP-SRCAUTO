import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  TextInput,
  Modal,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  MagnifyingGlass,
  Funnel,
  X,
  Check,
} from 'phosphor-react-native';

import { getAuth } from '../services/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomMenu from '../menulateral/menulateral';
import styles from './veiculosstyles';

const API_URL = 'https://srcauto-homolog.grupoabl.com.br/Api/Src/VeiculoContrato';

export default function Veiculos({ navigation }) {
  const [dataSelecionada, setDataSelecionada] = useState(new Date('2025-02-01T12:00:00'));
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [busca, setBusca] = useState('');
  const [statusSelecionados, setStatusSelecionados] = useState([]);
  const [modalVisivel, setModalVisivel] = useState(false);

  const scrollRef = useRef(null);
  const posicoesRef = useRef({});
  const registradosRef = useRef({});

  const STATUS_CONFIG = {
    0: { label: 'Todos', color: '#6b7280' },
    1: { label: 'Cadastrado', color: '#3b82f6' },
    2: { label: 'Alterado', color: '#6366f1' },
    3: { label: 'Registrado', color: '#10b981' },
    4: { label: 'Erro', color: '#ef4444' },
    5: { label: 'Baixado', color: '#f59e0b' },
    6: { label: 'Cancelado', color: '#8b5cf6' },
    7: { label: 'Recusado', color: '#dc2626' },
    8: { label: 'Verificado', color: '#22c55e' },
    9: { label: 'EnviadoImagem', color: '#0ea5e9' },
    10: { label: 'Transmitido', color: '#14b8a6' },
  };

  function getStatusInfo(status) {
    return STATUS_CONFIG[status] || { label: 'Desconhecido', color: '#6b7280' };
  }

  const statusDisponiveis = [...new Set(vehicles.map(v => v.status))].sort((a, b) => a - b);

  const veiculosFiltrados = vehicles
    .filter((v) => {
      const termo = busca.toLowerCase().trim();
      const matchesSearch = !termo || (
        String(v.plate || '').toLowerCase().includes(termo) ||
        String(v.owner || '').toLowerCase().includes(termo) ||
        String(v.contratoNumero || '').toLowerCase().includes(termo) ||
        String(v.chassi || '').toLowerCase().includes(termo) ||
        String(v.banco || '').toLowerCase().includes(termo)
      );
      const matchesStatus = statusSelecionados.length === 0 || statusSelecionados.includes(v.status);
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => a.status - b.status);

  useEffect(() => {
    posicoesRef.current = {};
    registradosRef.current = {};
  }, [vehicles, statusSelecionados, busca]);

  function registrarPosicao(status, y) {
    if (registradosRef.current[status]) return;
    registradosRef.current[status] = true;
    posicoesRef.current[status] = y;
  }

  function scrollParaStatus(keyNum) {
    if (keyNum === 0) {
      scrollRef.current?.scrollTo({ y: 0, animated: true });
      return;
    }
    const y = posicoesRef.current[keyNum];
    if (y !== undefined) {
      scrollRef.current?.scrollTo({ y: Math.max(0, y - 12), animated: true });
    }
  }

  function toggleStatus(status) {
    setStatusSelecionados(prev =>
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  }

  function limparFiltros() {
    setStatusSelecionados([]);
  }

  function aplicarFiltros() {
    setModalVisivel(false);
  }

  function formatarDataParaApi(data) {
    const a = data.getFullYear();
    const m = String(data.getMonth() + 1).padStart(2, '0');
    const d = String(data.getDate()).padStart(2, '0');
    return `${a}-${m}-${d}`;
  }

  async function buscarVeiculos() {
    try {
      setLoading(true);
      setError('');
      const auth = await getAuth();
      if (!auth || !auth.token) {
        setError('Sessão expirada. Faça login novamente.');
        setLoading(false);
        return;
      }

      const token = JSON.parse(await AsyncStorage.getItem('Token'));
      const dataFormatada = formatarDataParaApi(dataSelecionada);

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ tCotr_Cadt_DT: dataFormatada, tCotr_Stat_CK: 0 }),
      });

      if (response.status === 401) { setError('Sessão inválida ou expirada.'); setLoading(false); return; }
      if (response.status === 403) { setError('Acesso negado pela API.'); setLoading(false); return; }
      if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);

      const data = await response.json();
      let veiculosArray = Array.isArray(data?.sdtVeiculoContrato)
        ? data.sdtVeiculoContrato
        : Array.isArray(data) ? data : [];

      const veiculosFormatados = veiculosArray.map(item => {
        const statusNum = isNaN(Number(item.tCotr_Stat_CK)) ? 0 : Number(item.tCotr_Stat_CK);
        const statusInfo = getStatusInfo(statusNum);
        return {
          id: item.tCotr_ID,
          contratoNumero: item.tCotr_nrCotr_SS || 'N/A',
          plate: item.tveic_plac_ss || 'N/A',
          owner: item.sCotrDvdr_nome_sl || 'N/A',
          chassi: item.tveic_chss_sl || 'N/A',
          date: item.tcotr_Cadt_DT ? new Date(item.tcotr_Cadt_DT).toLocaleDateString('pt-BR') : 'N/A',
          status: statusNum,
          statusLabel: statusInfo.label,
          statusColor: statusInfo.color,
          banco: item.sCotrCrdr_nome_sl || 'N/A',
          uf: item.sveicuf_sg || 'N/A',
          restricao: item.tcotrveic_nrrest_in || 'N/A',
        };
      });

      setVehicles(veiculosFormatados);
    } catch (err) {
      console.error(err);
      setError('Não foi possível conectar ao servidor.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { buscarVeiculos(); }, [dataSelecionada]);

  return (
    <View style={{ flex: 1, backgroundColor: '#0f172a' }}>
      <SafeAreaView style={{ flex: 1 }} edges={['left', 'right', 'bottom']}>
        <StatusBar barStyle="light-content" />

        <View style={styles.header}>
          <Text style={styles.titulo}>Veículos</Text>
          
        </View>

        <View style={styles.buscaContainer}>
          <MagnifyingGlass size={20} color="#64748b" />
          <TextInput
            style={styles.buscaInput}
            placeholder="Buscar por chassi, placa ou gravame..."
            placeholderTextColor="#64748b"
            value={busca}
            onChangeText={setBusca}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginVertical: 8, flexGrow: 0 }}
          contentContainerStyle={{
            paddingHorizontal: 16,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
          }}
        >
          {Object.entries(STATUS_CONFIG).map(([key, { label, color }]) => {
            const keyNum = Number(key);

            const selecionado =
              keyNum === 0
                ? statusSelecionados.length === 0
                : statusSelecionados.includes(keyNum);

            return (
              <TouchableOpacity
                key={key}
                activeOpacity={0.75}
                onPress={() => {
                  if (keyNum === 0) {
                    setStatusSelecionados([]);
                  } else {
                    setStatusSelecionados([keyNum]);
                  }
                  scrollParaStatus(keyNum);
                }}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 5,
                  borderRadius: 999,
                  backgroundColor: selecionado ? color : 'transparent',
                  borderWidth: 1.5,
                  borderColor: color,
                }}
              >
                <Text
                  style={{
                    color: selecionado ? '#fff' : color,
                    fontSize: 12,
                    fontWeight: '600',
                  }}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <Text style={[styles.resultadosText, { marginHorizontal: 16, marginBottom: 8 }]}>
          {veiculosFiltrados.length} veículo{veiculosFiltrados.length !== 1 ? 's' : ''} encontrado{veiculosFiltrados.length !== 1 ? 's' : ''}
        </Text>

        {loading && (
          <View style={styles.statusBox}>
            <ActivityIndicator color="#10b981" />
            <Text style={styles.statusText}>Carregando veículos...</Text>
          </View>
        )}

        {error ? (
          <View style={styles.erroBox}><Text style={styles.erroText}>{error}</Text></View>
        ) : null}

        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
        >
          <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
            {veiculosFiltrados.length > 0
              ? veiculosFiltrados.map((v, i) => (
                <View
                  key={v.id ?? i}
                  style={styles.card}
                  onLayout={(e) => registrarPosicao(v.status, e.nativeEvent.layout.y)}
                >
                  <View style={styles.cardHeader}>
                    <View>
                      <Text style={styles.placa}>{v.plate}</Text>
                      <Text style={styles.contratoText}>{v.contratoNumero}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: v.statusColor }]}>
                      <View style={styles.statusDot} />
                      <Text style={styles.statusBadgeText}>{v.statusLabel}</Text>
                    </View>
                  </View>
                  <View style={styles.cardRow}>
                    <View style={styles.cardCol}>
                      <Text style={styles.labelSmall}>Financiado</Text>
                      <Text style={styles.valorDestaque}>{v.owner}</Text>
                    </View>
                    <View style={styles.cardColRight}>
                      <Text style={styles.labelSmall}>UF</Text>
                      <Text style={styles.valorDestaque}>{v.uf}</Text>
                    </View>
                  </View>
                  <View style={styles.cardLinha}>
                    <Text style={styles.labelSmall}>Chassi</Text>
                    <Text style={styles.valorSecundario}>{v.chassi}</Text>
                  </View>
                  <View style={styles.cardRow}>
                    <View style={styles.cardCol}>
                      <Text style={styles.labelSmall}>Gravame</Text>
                      <Text style={styles.valorSecundario}>{v.restricao}</Text>
                    </View>
                    <View style={styles.cardColRight}>
                      <Text style={styles.labelSmall}>Banco</Text>
                      <Text style={styles.valorDestaque}>{v.banco}</Text>
                    </View>
                  </View>
                  <View style={styles.cardFooter}>
                    <Text style={styles.dataText}>{v.date}</Text>
                  </View>
                </View>
              ))
              : !loading
                ? <Text style={styles.listaVazia}>Nenhum veículo encontrado.</Text>
                : null
            }
            <View style={{ height: 100 }} />
          </View>
        </ScrollView>

        <Modal visible={modalVisivel} transparent animationType="slide">
          <Pressable style={styles.modalOverlay} onPress={() => setModalVisivel(false)}>
            <Pressable style={styles.modalContent} onPress={e => e.stopPropagation()}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitulo}>Filtrar por Status</Text>
                <TouchableOpacity onPress={() => setModalVisivel(false)}>
                  <X size={24} color="#94a3b8" weight="bold" />
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.modalBody}>
                {statusDisponiveis.map((s) => {
                  const selecionado = statusSelecionados.includes(s);
                  const info = getStatusInfo(s);
                  const qtd = vehicles.filter(v => v.status === s).length;
                  return (
                    <TouchableOpacity
                      key={s}
                      onPress={() => toggleStatus(s)}
                      style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 14 }}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: info.color }} />
                        <View>
                          <Text style={{ color: '#e2e8f0' }}>{info.label}</Text>
                          <Text style={{ color: '#64748b', fontSize: 12 }}>
                            {qtd} veículo{qtd !== 1 ? 's' : ''}
                          </Text>
                        </View>
                      </View>
                      <View style={{
                        width: 22,
                        height: 22,
                        borderRadius: 5,
                        backgroundColor: selecionado ? info.color : 'transparent',
                        borderWidth: selecionado ? 0 : 2,
                        borderColor: '#475569',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                        {selecionado && <Check size={14} color="#fff" weight="bold" />}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
              <View style={styles.modalFooter}>
                <TouchableOpacity style={styles.btnLimpar} onPress={limparFiltros}>
                  <Text style={styles.btnLimparTexto}>Limpar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnAplicar} onPress={aplicarFiltros}>
                  <Text style={styles.btnAplicarTexto}>
                    Aplicar{statusSelecionados.length > 0 ? ` (${statusSelecionados.length})` : ''}
                  </Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </Pressable>
        </Modal>

        <BottomMenu navigation={navigation} />
      </SafeAreaView>
    </View>
  );
}