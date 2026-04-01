import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Modal,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  CaretLeft,
  CaretRight,
  MagnifyingGlass,
  Funnel,
  X,
  Check,
} from 'phosphor-react-native';

import CalendarioRegistros from '../Calendario/CalendarioRegistros';
import { getAuth } from '../services/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomMenu from '../menulateral/menulateral';

const API_URL =
  'https://srcauto-homolog.grupoabl.com.br/Api/Src/VeiculoContrato';

const MESES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

// Mapeamento de status (ajuste conforme sua lógica)
const STATUS_CONFIG = {
  0: { label: 'Pendente', color: '#6b7280' },
  1: { label: 'Em Análise', color: '#f59e0b' },
  2: { label: 'Rejeitado', color: '#ef4444' },
  3: { label: 'Registrado', color: '#10b981' },
  4: { label: 'Cancelado', color: '#8b5cf6' },
};

function formatarDataParaApi(data) {
  const a = data.getFullYear();
  const m = String(data.getMonth() + 1).padStart(2, '0');
  const d = String(data.getDate()).padStart(2, '0');
  return `${a}-${m}-${d}`;
}

export default function Veiculos({ navigation }) {
  const [dataSelecionada, setDataSelecionada] = useState(
    () => new Date('2025-02-01T12:00:00')
  );
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [busca, setBusca] = useState('');
  const [statusSelecionados, setStatusSelecionados] = useState([]);
  const [modalVisivel, setModalVisivel] = useState(false);

  const ano = dataSelecionada.getFullYear();
  const mes = dataSelecionada.getMonth();
  const dia = dataSelecionada.getDate();

  // Get unique status from vehicles
  const statusDisponiveis = [...new Set(vehicles.map(v => v.status))].sort((a, b) => a - b);

  const veiculosFiltrados = vehicles.filter((v) => {
    const termo = busca.toLowerCase().trim();

    const matchesSearch = !termo || (
      String(v.plate || '').toLowerCase().includes(termo) ||
      String(v.owner || '').toLowerCase().includes(termo) ||
      String(v.contratoNumero || '').toLowerCase().includes(termo) ||
      String(v.chassi || '').toLowerCase().includes(termo) ||
      String(v.banco || '').toLowerCase().includes(termo)
    );

    const matchesStatus = statusSelecionados.length === 0 || 
                          statusSelecionados.includes(v.status);

    return matchesSearch && matchesStatus;
  });

  function mudarMes(delta) {
    const novaData = new Date(dataSelecionada);
    novaData.setMonth(novaData.getMonth() + delta);
    setDataSelecionada(novaData);
  }

  function toggleStatus(status) {
    setStatusSelecionados(prev => {
      if (prev.includes(status)) {
        return prev.filter(s => s !== status);
      } else {
        return [...prev, status];
      }
    });
  }

  function limparFiltros() {
    setStatusSelecionados([]);
  }

  function aplicarFiltros() {
    setModalVisivel(false);
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

      const dadosToken = await AsyncStorage.getItem('Token');
      const token = JSON.parse(dadosToken);

      const dataFormatada = formatarDataParaApi(dataSelecionada);

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tCotr_Cadt_DT: dataFormatada,
          tCotr_Stat_CK: 0,
        }),
      });

      if (response.status === 401) {
        setError('Sessão inválida ou expirada.');
        setLoading(false);
        return;
      }

      if (response.status === 403) {
        setError('Acesso negado pela API. Verifique token/permissão.');
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const data = await response.json();

      let veiculosArray = [];

      if (Array.isArray(data?.sdtVeiculoContrato)) {
        veiculosArray = data.sdtVeiculoContrato;
      } else if (Array.isArray(data)) {
        veiculosArray = data;
      }

      const veiculosFormatados = veiculosArray.map((item) => ({
        id: item.tCotr_ID,
        contratoNumero: item.tCotr_nrCotr_SS || 'N/A',
        plate: item.tveic_plac_ss || 'N/A',
        owner: item.sCotrDvdr_nome_sl || 'N/A',
        chassi: item.tveic_chss_sl || 'N/A',
        date: item.tcotr_Cadt_DT
          ? new Date(item.tcotr_Cadt_DT).toLocaleDateString('pt-BR')
          : 'N/A',
        status: isNaN(Number(item.tCotr_Stat_CK))
          ? 0
          : Number(item.tCotr_Stat_CK),
        banco: item.sCotrCrdr_nome_sl || 'N/A',
        uf: item.sveicuf_sg || 'N/A',
        restricao: item.tcotrveic_nrrest_in || 'N/A',
      }));

      setVehicles(veiculosFormatados);
    } catch (err) {
      console.error('Erro ao buscar veículos:', err);
      setError('Não foi possível conectar ao servidor.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    buscarVeiculos();
  }, [dataSelecionada]);

// Mapeamento de status conforme sua lista
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

  };

  return (
    <View style={{ flex: 1, backgroundColor: '#0f172a' }}>
      <SafeAreaView style={{ flex: 1 }} edges={['left', 'right', 'bottom']}>
        <StatusBar barStyle="light-content" />

        <View style={styles.header}>
          <Text style={styles.titulo}>Veículos</Text>
          
          {/* Botão de Filtro no Header */}
          <TouchableOpacity 
            style={styles.filtroHeaderBtn}
            onPress={() => setModalVisivel(true)}
          >
            <Funnel size={22} color="#10b981" weight="regular" />
            {statusSelecionados.length > 0 && (
              <View style={styles.filtroBadgeCount}>
                <Text style={styles.filtroBadgeCountText}>
                  {statusSelecionados.length}
                </Text>
              </View>
            )}
          </TouchableOpacity>
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

        {/* Active Filters Display */}
        {statusSelecionados.length > 0 && (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.filtrosAtivosContainer}
            contentContainerStyle={styles.filtrosAtivosContent}
          >
            {statusSelecionados.map((statusVal) => {
              const statusInfo = getStatusInfo(statusVal);
              return (
                <View 
                  key={statusVal} 
                  style={[
                    styles.chipFiltroAtivo,
                    { backgroundColor: statusInfo.color }
                  ]}
                >
                  <Text style={styles.chipFiltroAtivoText}>
                    {statusInfo.label}
                  </Text>
                  <TouchableOpacity onPress={() => toggleStatus(statusVal)}>
                    <X size={14} color="#fff" weight="bold" />
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>
        )}

        {/* Results Counter */}
        <View style={styles.resultadosContainer}>
          <Text style={styles.resultadosText}>
            {veiculosFiltrados.length} veículo{veiculosFiltrados.length !== 1 ? 's' : ''} encontrado{veiculosFiltrados.length !== 1 ? 's' : ''}
          </Text>
        </View>

        {loading && (
          <View style={styles.statusBox}>
            <ActivityIndicator color="#10b981" />
            <Text style={styles.statusText}>Carregando veículos...</Text>
          </View>
        )}

        {!!error && (
          <View style={styles.erroBox}>
            <Text style={styles.erroText}>{error}</Text>
          </View>
        )}

        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
          <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
            {veiculosFiltrados.length > 0 ? (
              veiculosFiltrados.map((veiculo, index) => {
                const statusInfo = getStatusInfo(veiculo.status);
                
                return (
                  <View key={veiculo.id ?? index} style={styles.card}>
                    <View style={styles.cardHeader}>
                      <View>
                        <Text style={styles.placa}>{veiculo.plate}</Text>
                        <Text style={styles.contratoText}>{veiculo.contratoNumero}</Text>
                      </View>
                      <View style={[styles.statusBadge, { backgroundColor: statusInfo.color }]}>
                        <View style={styles.statusDot} />
                        <Text style={styles.statusBadgeText}>{statusInfo.label}</Text>
                      </View>
                    </View>

                    <View style={styles.cardRow}>
                      <View style={styles.cardCol}>
                        <Text style={styles.labelSmall}>Financiado</Text>
                        <Text style={styles.valorDestaque}>{veiculo.owner}</Text>
                      </View>
                      <View style={styles.cardColRight}>
                        <Text style={styles.labelSmall}>UF</Text>
                        <Text style={styles.valorDestaque}>{veiculo.uf}</Text>
                      </View>
                    </View>

                    <View style={styles.cardLinha}>
                      <Text style={styles.labelSmall}>Chassi</Text>
                      <Text style={styles.valorSecundario}>{veiculo.chassi}</Text>
                    </View>

                    <View style={styles.cardRow}>
                      <View style={styles.cardCol}>
                        <Text style={styles.labelSmall}>Gravame</Text>
                        <Text style={styles.valorSecundario}>{veiculo.restricao}</Text>
                      </View>
                      <View style={styles.cardColRight}>
                        <Text style={styles.labelSmall}>Banco</Text>
                        <Text style={styles.valorDestaque}>{veiculo.banco}</Text>
                      </View>
                    </View>

                    <View style={styles.cardFooter}>
                      <Text style={styles.dataText}>{veiculo.date}</Text>
                    </View>
                  </View>
                );
              })
            ) : !loading ? (
              <Text style={styles.listaVazia}>Nenhum veículo encontrado.</Text>
            ) : null}

            <View style={{ height: 100 }} />
          </View>
        </ScrollView>

        {/* Modal de Filtro */}
        <Modal
          visible={modalVisivel}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalVisivel(false)}
        >
          <Pressable 
            style={styles.modalOverlay}
            onPress={() => setModalVisivel(false)}
          >
            <Pressable 
              style={styles.modalContent} 
              onPress={(e) => e.stopPropagation()}
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitulo}>Filtrar por Status</Text>
                <TouchableOpacity onPress={() => setModalVisivel(false)}>
                  <X size={24} color="#94a3b8" weight="bold" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody}>
                {statusDisponiveis.map((status) => {
                  const statusInfo = getStatusInfo(status);
                  const isSelected = statusSelecionados.includes(status);
                  const qtd = vehicles.filter(v => v.status === status).length;
                  
                  return (
                    <TouchableOpacity
                      key={status}
                      style={styles.opcaoFiltro}
                      onPress={() => toggleStatus(status)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.opcaoFiltroLeft}>
                        <View 
                          style={[
                            styles.colorIndicator, 
                            { backgroundColor: statusInfo.color }
                          ]} 
                        />
                        <View>
                          <Text style={styles.opcaoFiltroLabel}>
                            {statusInfo.label}
                          </Text>
                          <Text style={styles.opcaoFiltroCount}>
                            {qtd} veículo{qtd !== 1 ? 's' : ''}
                          </Text>
                        </View>
                      </View>
                      
                      <View 
                        style={[
                          styles.checkbox,
                          isSelected && styles.checkboxChecked,
                          isSelected && { 
                            backgroundColor: statusInfo.color,
                            borderColor: statusInfo.color
                          }
                        ]}
                      >
                        {isSelected && (
                          <Check size={16} color="#fff" weight="bold" />
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              <View style={styles.modalFooter}>
                <TouchableOpacity 
                  style={styles.btnLimpar}
                  onPress={limparFiltros}
                >
                  <Text style={styles.btnLimparTexto}>Limpar</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.btnAplicar}
                  onPress={aplicarFiltros}
                >
                  <Text style={styles.btnAplicarTexto}>
                    Aplicar
                    {statusSelecionados.length > 0 && ` (${statusSelecionados.length})`}
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



const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titulo: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  filtroHeaderBtn: {
    width: 44,
    height: 44,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  filtroBadgeCount: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#10b981',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  filtroBadgeCountText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  buscaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    gap: 10,
  },
  buscaInput: {
    flex: 1,
    color: '#e2e8f0',
    fontSize: 14,
  },
  filtrosAtivosContainer: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  filtrosAtivosContent: {
    gap: 8,
  },
  chipFiltroAtivo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  chipFiltroAtivoText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  resultadosContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  resultadosText: {
    color: '#64748b',
    fontSize: 13,
  },
  statusBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    padding: 16,
  },
  statusText: {
    color: '#e2e8f0',
    fontSize: 14,
  },
  erroBox: {
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: '#7f1d1d',
    padding: 12,
    borderRadius: 12,
  },
  erroText: {
    color: '#fecaca',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  placa: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  contratoText: {
    color: '#64748b',
    fontSize: 13,
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
  },
  statusBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardCol: {
    flex: 1,
  },
  cardColRight: {
    alignItems: 'flex-end',
  },
  cardLinha: {
    marginBottom: 12,
  },
  labelSmall: {
    color: '#64748b',
    fontSize: 12,
    marginBottom: 4,
  },
  valorDestaque: {
    color: '#e2e8f0',
    fontSize: 14,
    fontWeight: '600',
  },
  valorSecundario: {
    color: '#94a3b8',
    fontSize: 13,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  dataText: {
    color: '#64748b',
    fontSize: 12,
  },
  listaVazia: {
    color: '#64748b',
    textAlign: 'center',
    marginTop: 40,
    fontStyle: 'italic',
    fontSize: 14,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1e293b',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  modalTitulo: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalBody: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  opcaoFiltro: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  opcaoFiltroLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  colorIndicator: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  opcaoFiltroLabel: {
    color: '#e2e8f0',
    fontSize: 16,
    fontWeight: '600',
  },
  opcaoFiltroCount: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#475569',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  checkboxChecked: {
    borderWidth: 0,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  btnLimpar: {
    flex: 1,
    backgroundColor: '#334155',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnLimparTexto: {
    color: '#e2e8f0',
    fontSize: 15,
    fontWeight: '700',
  },
  btnAplicar: {
    flex: 2,
    backgroundColor: '#10b981',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnAplicarTexto: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});
