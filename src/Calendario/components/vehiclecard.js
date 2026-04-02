import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles, { pill } from '../dashboard/dashboardstyles';

function PilulaStatus({ status }) {
  // Mapeamento de cores e textos baseado no status vindo da API
  const CONFIG_STATUS = {
    registrado: { rotulo: 'Registrado', corFundo: '#00875a' },
    pendente:   { rotulo: 'Pendente',   corFundo: '#c9a800' },
    analise:    { rotulo: 'Em Análise', corFundo: '#0097a7' },
    rejeitado:  { rotulo: 'Rejeitado',  corFundo: '#c0392b' },
  };

  const statusChave = status?.toLowerCase() || 'analise';
  const cfg = CONFIG_STATUS[statusChave] || CONFIG_STATUS.analise;

  return (
    <View style={[pill.wrap, { backgroundColor: cfg.corFundo }]}>
      <View style={[pill.dot, { backgroundColor: '#ffffff' }]} />
      <Text style={pill.text}>{cfg.rotulo}</Text>
    </View>
  );
}

export default function VehicleCard({ registro }) {
  return (
    <TouchableOpacity style={styles.vehicleCard} activeOpacity={0.8}>
      <View style={styles.vehicleHeader}>
        <Text style={styles.vehicleName}>{registro.nomeVeiculo || 'Veículo não identificado'}</Text>
        <PilulaStatus status={registro.status} />
      </View>

      <Text style={styles.ownerName}>{registro.proprietario || 'Proprietário não informado'}</Text>

      <View style={styles.vehicleInfo}>
        <View style={styles.vehicleInfoItem}>
          <Text style={styles.vehicleInfoLabel}>Chassi</Text>
          <Text style={styles.vehicleInfoValue}>{registro.chassi || '—'}</Text>
        </View>
        <View style={styles.vehicleInfoItem}>
          <Text style={styles.vehicleInfoLabel}>Banco</Text>
          <Text style={styles.vehicleInfoValue}>{registro.banco || '—'}</Text>
        </View>
        <View style={styles.vehicleInfoItem}>
          <Text style={styles.vehicleInfoLabel}>Estado</Text>
          <Text style={styles.vehicleInfoValue}>{registro.estado || '—'}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}