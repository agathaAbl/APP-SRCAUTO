import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CaretLeft, Calendar, FileText, Car, User, Bank, MapPin, Percent, CreditCard } from 'phosphor-react-native';

import BottomMenu from '../menulateral/menulateral';
import styles from '../../src/Contrato/contratoStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ✅ MAPEAMENTO COMPLETO DOS STATUS
const STATUS_MAP = {
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

export default function Contrato({ navigation, route }) {
  const { veiculo } = route.params;
  const idContrato = veiculo?.tCotr_ID;

  const [contrato, setContrato] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [erroApi, setErroApi] = useState('');

  // ✅ FUNÇÃO PARA PEGAR INFORMAÇÕES DO STATUS
  const getStatusInfo = (statusCode) => {
    const status = STATUS_MAP[statusCode] || STATUS_MAP[0];
    return {
      label: status.label,
      color: status.color,
    };
  };

  async function buscarContrato(showLoading = true) {
    console.log('🚀 BUSCANDO CONTRATO ID:', idContrato);

    if (showLoading) setCarregando(true);
    setErroApi('');

    try {
      let token = await AsyncStorage.getItem("Token");
      try {
        token = JSON.parse(token);
      } catch (e) {}

      const response = await fetch(
        `https://srcauto-homolog.grupoabl.com.br/Api/Src/Contrato?ContratoID=${idContrato}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        setErroApi('Sessão inválida ou expirada.');
        return;
      }

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ CONTRATO RECEBIDO:', data);
      setContrato(data);

    } catch (error) {
      console.log('❌ ERRO:', error);
      setErroApi('Erro ao buscar contrato.');
    } finally {
      if (showLoading) setCarregando(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    buscarContrato();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    buscarContrato(false);
  };


  const InfoRow = ({ label, value, icon: Icon }) => (
    <View style={styles.infoRow}>
      <View style={styles.infoLabel}>
        {Icon && <Icon size={18} color="#10b981" />}
        <Text style={styles.infoLabelText}>{label}</Text>
      </View>
      <Text style={styles.infoValue}>{value || 'Não informado'}</Text>
    </View>
  );

  const SectionTitle = ({ title, icon: Icon }) => (
    <View style={styles.sectionTitle}>
      {Icon && <Icon size={20} color="#10b981" />}
      <Text style={styles.sectionTitleText}>{title}</Text>
    </View>
  );

  const Card = ({ children }) => (
    <View style={styles.card}>{children}</View>
  );


  const formatDate = (dateStr) => {
    if (!dateStr || dateStr === '0000-00-00') return 'Não informada';
    return dateStr.split('-').reverse().join('/');
  };

  const formatCurrency = (value) => {
    if (!value || value === '0.00') return 'R$ 0,00';
    const num = parseFloat(value);
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(num);
  };

  const formatPercent = (value) => {
    if (!value || value === '0.000') return '0%';
    return `${value}%`;
  };

  const formatCpfCnpj = (value) => {
    if (!value) return 'Não informado';
    // Remove pontos e traços se já tiver
    const clean = value.replace(/[^\d]/g, '');
    if (clean.length === 11) {
      return clean.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    if (clean.length === 14) {
      return clean.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
    return value;
  };

  

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" />

        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <CaretLeft size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitulo}>Detalhes do Contrato</Text>
          <View style={{ width: 22 }} />
        </View>

        {carregando ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#10b981" />
            <Text style={styles.loadingText}>Carregando contrato...</Text>
          </View>
        ) : erroApi ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{erroApi}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={() => buscarContrato()}>
              <Text style={styles.retryButtonText}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        ) : contrato ? (
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#10b981']} />
            }
          >
            {/* ✅ STATUS BANNER ATUALIZADO COM O MAPEAMENTO CORRETO */}
            {(() => {
              const statusInfo = getStatusInfo(contrato.tCotr_Stat_CK);
              return (
                <View style={[styles.statusBanner, { backgroundColor: statusInfo.color + '20' }]}>
                  <View style={[styles.statusDot, { backgroundColor: statusInfo.color }]} />
                  <Text style={[styles.statusText, { color: statusInfo.color }]}>
                    {statusInfo.label}
                  </Text>
                </View>
              );
            })()}

            {/* IDENTIFICAÇÃO */}
            <Card>
              <SectionTitle title="Identificação" icon={FileText} />
              <InfoRow label="ID do Contrato" value={contrato.tCotr_ID} />
              <InfoRow label="Número do Contrato" value={contrato.tCotr_NrCotr_SS} />
              <InfoRow label="Nº Registro" value={contrato.tCotr_NrRegCotr_SS} />
              <InfoRow label="Grupo/Cota" value={`${contrato.tCotr_NrGrupCnsc_SS || '-'} / ${contrato.tCotr_NrCotaCnsc_IN || '-'}`} />
              <InfoRow label="Data da Contratação" value={formatDate(contrato.tCotr_DtCotr_DT)} icon={Calendar} />
              <InfoRow label="Vigência" value={formatDate(contrato.tCotr_Vig_DT)} />
            </Card>

            {/* CLIENTE */}
            <Card>
              <SectionTitle title="Cliente" icon={User} />
              <InfoRow label="Nome" value={contrato.sCotrDvdr_Nome_SL || contrato.tCotr_DvdrNome_SL} />
              <InfoRow label="CPF/CNPJ" value={formatCpfCnpj(contrato.sCotrDvdr_CPFCNPJ)} />
              <InfoRow label="Cidade/UF" value={`${contrato.sContrMunicipio_Nome_STL} / ${contrato.sContrMunicipio_UF_SG}`} />
            </Card>

            {/* VEÍCULO */}
            <Card>
              <SectionTitle title="Veículo" icon={Car} />
              <InfoRow label="Placa" value={contrato.tVeic_Plac_SS?.toUpperCase()} />
              <InfoRow label="UF" value={contrato.tVeic_Plac_UF || contrato.sVeicUf_SG || 'SP'} />
              <InfoRow label="Chassi" value={contrato.tVeic_Chss_SL} />
              <InfoRow label="Ano" value={`${contrato.tVeic_AnoFabr_IN}/${contrato.tVeic_AnoMode_IN}`} />
              <InfoRow label="Renavam" value={contrato.tVeic_Rnvn} />
            </Card>

            {/* FINANCEIRO */}
            <Card>
              <SectionTitle title="Financeiro" icon={CreditCard} />
              <InfoRow label="Valor Total" value={formatCurrency(contrato.tCotr_VlrTotFinc_CUR)} />
              <InfoRow label="Valor da Parcela" value={formatCurrency(contrato.tCotr_VlrParcFinc_CUR)} />
              <InfoRow label="Qtd. Parcelas" value={contrato.tCotr_QtdParc_IN} />
              <InfoRow label="Dia de Vencimento" value={`Dia ${contrato.tCotr_DiaVenc_DI}`} />
              <InfoRow label="1ª Parcela" value={formatDate(contrato.tCotr_VencPrimParc_DT)} />
              <InfoRow label="Última Parcela" value={formatDate(contrato.tCotr_VencUltmParc_DT)} />
              <InfoRow label="Tipo" value={contrato.tCotr_Indi_SS === 'PreFixado' ? 'Pré-fixado' : 'Pós-fixado'} />
            </Card>

            {/* TAXAS */}
            <Card>
              <SectionTitle title="Taxas e Encargos" icon={Percent} />
              <InfoRow label="Juros Mensal" value={formatPercent(contrato.tCotr_TxJuroMes_PC)} />
              <InfoRow label="Juros Anual" value={formatPercent(contrato.tCotr_TxJuroAno_PC)} />
              <InfoRow label="Multa" value={contrato.tCotr_TxMlta_CK === 'Sim' ? `Sim (${contrato.tCotr_VlrTxMlta_PC}%)` : 'Não'} />
              <InfoRow label="Mora" value={contrato.tCotr_TxMora_CK === 'Sim' ? `Sim (${contrato.tCotr_VlrTxMora_PC}%/dia)` : 'Não'} />
              <InfoRow label="IOF" value={formatCurrency(contrato.tCotr_VlrIOF_PC)} />
            </Card>

            {/* DETRAN */}
            <Card>
              <SectionTitle title="DETRAN" icon={Bank} />
              <InfoRow label="Órgão" value={contrato.tDtrn_Nome_SL} />
              <InfoRow label="Valor Registro" value={formatCurrency(contrato.tCotr_VlrReg_MN)} />
              <InfoRow label="Protocolo" value={contrato.tCotr_ProtRegDtrn_SL || 'Não informado'} />
              <InfoRow label="Restrição" value={contrato.tCotr_TpRestFnna_CK === 3 ? 'Alienação Fiduciária' : 'Outra'} />
            </Card>

            {/* ADMINISTRADORA */}
            <Card>
              <SectionTitle title="Administradora" icon={Bank} />
              <InfoRow label="Nome" value={contrato.sCotrCrdr_Nome_SL} />
              <InfoRow label="CNPJ" value={formatCpfCnpj(contrato.sCotrCrdr_CPFCNPJ)} />
            </Card>

            {/* AGENTE CREDENCIADO */}
            <Card>
              <SectionTitle title="Agente Credenciado" icon={User} />
              <InfoRow label="Nome" value={contrato.sCotrAgeCrdd_Nome_SL} />
              <InfoRow label="CNPJ" value={formatCpfCnpj(contrato.sCotrAgeCrdd_Cnpj_SS)} />
            </Card>

            <View style={{ height: 80 }} />
          </ScrollView>
        ) : null}

        <BottomMenu navigation={navigation} />
      </SafeAreaView>
    </View>
  );
}