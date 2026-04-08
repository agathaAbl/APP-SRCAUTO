import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MagnifyingGlass, Calendar as CalendarIcon } from 'phosphor-react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { getAuth } from '../services/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomMenu from '../menulateral/menulateral';
import styles from './veiculosstyles';

// Configuração do calendário para Português
LocaleConfig.locales['pt-br'] = {
  monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
  monthNamesShort: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'],
  dayNames: ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'],
  dayNamesShort: ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'],
  today: 'Hoje'
};
LocaleConfig.defaultLocale = 'pt-br';

const API_URL = 'https://srcauto-homolog.grupoabl.com.br/Api/Src/VeiculoContrato';

export default function Veiculos({ navigation }) {
  const [dataSelecionada, setDataSelecionada] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busca, setBusca] = useState('');
  const [statusSelecionados, setStatusSelecionados] = useState([]);

  const scrollRef = useRef(null);

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

  function formatarDataParaApi(data) {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}T00:00:00`;
  }

  function getStatusInfo(status) {
    return STATUS_CONFIG[status] || { label: 'Desconhecido', color: '#6b7280' };
  }

  const veiculosFiltrados = vehicles.filter(v => {
    const termo = busca.toLowerCase().trim();
    const matchesSearch = !termo || (v.plate.toLowerCase().includes(termo) || v.owner.toLowerCase().includes(termo));
    const matchesStatus = statusSelecionados.length === 0 || statusSelecionados.includes(v.status);
    return matchesSearch && matchesStatus;
  });

  async function buscarVeiculos() {
    try {
      setLoading(true);
      const auth = await getAuth();
      let token = auth?.status?.replace(/^"|"$/g, '').trim();

      if (!token) {
        const tokenStorage = await AsyncStorage.getItem('Token');
        token = tokenStorage?.replace(/^"|"$/g, '').trim();
      }

      const payload = {
        tCotr_Cadt_DT: formatarDataParaApi(dataSelecionada),
        tCotr_Stat_CK: 0 
      };

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      let veiculosArray = data?.sdtVeiculoContrato || data?.SDTVeiculoContrato || (Array.isArray(data) ? data : []);

      const veiculosFormatados = veiculosArray.map(item => {
        const statusRaw = item.tCotr_Stat_CK ?? item.tcotr_stat_ck ?? 0;
        const statusNum = Number(statusRaw);
        return {
          id: item.tCotr_ID || item.tcotr_id || Math.random().toString(),
          contratoNumero: item.tCotr_nrCotr_SS || item.tcotr_nrcotr_ss || 'N/A',
          plate: item.tveic_plac_ss || item.Tveic_Plac_SS || 'N/A',
          owner: item.sCotrDvdr_nome_sl || item.scotrdvdr_nome_sl || 'N/A',
          date: item.tcotr_Cadt_DT || 'N/A',
          status: statusNum,
          statusLabel: getStatusInfo(statusNum).label,
          statusColor: getStatusInfo(statusNum).color,
          uf: item.sveicuf_sg || 'N/A',
          original: item,
        };
      });

      setVehicles(veiculosFormatados);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { 
    buscarVeiculos(); 
  }, [dataSelecionada]);

  return (
    <View style={{ flex: 1, backgroundColor: '#0f172a' }}>
      <SafeAreaView style={{ flex: 1 }} edges={['left', 'right', 'bottom']}>
        <StatusBar barStyle="light-content" />

        <View style={styles.header}>
          <Text style={styles.titulo}>Veículos</Text>
        </View>

        {/* Cabeçalho de Data - Clique para abrir o calendário */}
        <TouchableOpacity 
          onPress={() => setShowCalendar(!showCalendar)}
          style={{ alignItems: 'center', marginVertical: 10, backgroundColor: '#1e293b', padding: 10, marginHorizontal: 16, borderRadius: 10 }}
        >
          <Text style={{ color: '#94a3b8', fontSize: 10, fontWeight: 'bold' }}>BUSCA POR DIA (CLIQUE PARA ALTERAR)</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <CalendarIcon size={20} color="#10b981" />
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>
              {dataSelecionada.toLocaleDateString('pt-BR')}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Calendário Condicional */}
        {showCalendar && (
          <View style={{ marginBottom: 10 }}>
            <Calendar
              onDayPress={(day) => {
                const novaData = new Date(day.timestamp);
                novaData.setHours(novaData.getHours() + 3); // Ajuste de fuso horário se necessário
                setDataSelecionada(novaData);
                setShowCalendar(false); // Fecha ao selecionar
              }}
              markedDates={{
                [dataSelecionada.toISOString().split('T')[0]]: { selected: true, selectedColor: '#10b981' }
              }}
              theme={{
                backgroundColor: '#0f172a',
                calendarBackground: '#1e293b',
                textSectionTitleColor: '#94a3b8',
                dayTextColor: '#fff',
                monthTextColor: '#10b981',
                selectedDayBackgroundColor: '#10b981',
                selectedDayTextColor: '#fff',
                arrowColor: '#10b981',
              }}
            />
          </View>
        )}

        {/* Busca */}
        <View style={styles.buscaContainer}>
          <MagnifyingGlass size={20} color="#64748b" />
          <TextInput
            style={[styles.buscaInput, { fontSize: 16 }]}
            placeholder="Buscar placa ou cliente..."
            placeholderTextColor="#64748b"
            value={busca}
            onChangeText={setBusca}
          />
        </View>

        {/* Filtros de Status */}
        <View style={{ height: 50, marginBottom: 10 }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 8, alignItems: 'center' }}>
            {Object.entries(STATUS_CONFIG).map(([key, { label, color }]) => {
              const keyNum = Number(key);
              const selecionado = keyNum === 0 ? statusSelecionados.length === 0 : statusSelecionados.includes(keyNum);
              return (
                <TouchableOpacity
                  key={key}
                  onPress={() => setStatusSelecionados(keyNum === 0 ? [] : [keyNum])}
                  style={{
                    paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20,
                    backgroundColor: selecionado ? color : '#1e293b',
                    borderWidth: 1.5, borderColor: color,
                  }}
                >
                  <Text style={{ color: selecionado ? '#fff' : color, fontSize: 12, fontWeight: 'bold' }}>{label}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#10b981" />
            <Text style={{ color: '#94a3b8', marginTop: 15 }}>Consultando registros...</Text>
          </View>
        ) : (
          <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
            <View style={{ paddingHorizontal: 16, paddingTop: 10 }}>
              {veiculosFiltrados.map((v) => (
                <TouchableOpacity
                  key={v.id}
                  style={styles.card}
                  onPress={() => navigation.navigate('contrato', { veiculo: v.original })}
                >
                  <View style={styles.cardHeader}>
                    <View>
                      <Text style={styles.placa}>{v.plate}</Text>
                      <Text style={styles.contratoText}>{v.contratoNumero}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: v.statusColor }]}>
                      <Text style={styles.statusBadgeText}>{v.statusLabel}</Text>
                    </View>
                  </View>
                  <View style={styles.cardRow}>
                    <Text style={styles.valorDestaque} numberOfLines={1}>{v.owner}</Text>
                    <Text style={styles.valorDestaque}>{v.uf}</Text>
                  </View>
                  <View style={styles.cardFooter}>
                    <Text style={styles.dataText}>Cadastrado em: {v.date}</Text>
                  </View>
                </TouchableOpacity>
              ))}

              {veiculosFiltrados.length === 0 && (
                <View style={{ marginTop: 60, alignItems: 'center' }}>
                  <Text style={{ color: '#475569', fontSize: 16, textAlign: 'center' }}>
                    Nenhum veículo encontrado para{'\n'}esta data e filtros.
                  </Text>
                </View>
              )}
              <View style={{ height: 100 }} />
            </View>
          </ScrollView>
        )}

        <BottomMenu navigation={navigation} />
      </SafeAreaView>
    </View>
  );
}