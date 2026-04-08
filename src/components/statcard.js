import React from 'react';
import { View, Text } from 'react-native';
import styles from '../dashboard/dashboardstyles';

export default function StatCard({ item }) {
  // Detecta se é variação
  const isVariacao = item?.descricao?.toLowerCase().includes('variação');

  const Icon = item?.icon;

  return (
    <View style={[styles.statCard, { borderWidth: 1, borderColor: '#0f3a55' }]}>
      
      {/* Ícone */}
      <View style={[styles.statIconWrap, { backgroundColor: `${item?.cor || '#999'}22` }]}>
        {Icon ? (
          <Icon size={20} color={item?.cor || '#999'} weight="fill" />
        ) : (
          
          <Text style={{ color: '#999' }}>?</Text>
        )}
      </View>

      {/* Valor */}
      <Text
        style={[
          styles.statVal,
          { color: isVariacao ? item?.cor || '#fff' : '#ffffff' }
        ]}
      >
        {item?.valor !== null && item?.valor !== undefined ? item.valor : '0'}
      </Text>

      {/* Descrição */}
      <Text style={styles.statLabel} numberOfLines={1}>
        {item?.descricao || '—'}
      </Text>
    </View>
  );
}
