import React from 'react';
import { View, Text } from 'react-native';
import styles from '../dashboard/dashboardstyles';

export default function StatCard({ item }) {
  // Verificamos se a descrição contém "Variação" para aplicar a cor dinâmica no texto
  const isVariacao = item.descricao?.toLowerCase().includes('variação');

  // Safeguard: if no icon, don't render
  if (!item.icon) {
    return null;
  }

  return (
    <View style={[styles.statCard, { borderWidth: 1, borderColor: '#0f3a55' }]}>
      {/* O fundo do ícone ganha uma transparência da cor original (22 no final do hex) */}
      <View style={[styles.statIconWrap, { backgroundColor: `${item.cor}22` }]}>
        <item.icon size={20} color={item.cor} weight="fill" />
      </View>
      
      <Text 
        style={[
          styles.statVal, 
          { color: isVariacao ? item.cor : '#ffffff' }
        ]}
      >
        {item.valor}
      </Text>
      
      <Text style={styles.statLabel} numberOfLines={1}>
        {item.descricao}
      </Text>
    </View>
  );
}