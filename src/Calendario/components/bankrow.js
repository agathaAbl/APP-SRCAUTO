import React from 'react';
import { View, Text } from 'react-native';
import styles from '../dashboard/dashboardstyles';

export default function BankRow({ indice, banco }) {

 
  const porcentagem = Number(banco?.TotPrd_PC ?? 0);


  function getCor() {
    const variacao = Number(banco?.VarDia_PC ?? 0);
    if (variacao > 0) return '#39d0a1'; 
    if (variacao < 0) return '#ff4d4d'; 
    return '#7a8fb5'; 
  }

  function formatarNumero(v) {
    if (v === null || v === undefined) return '—';
    return String(v);
  }

  // Fallback para o nome do banco
  const nomeBanco =
    banco?.tCrdr_NomeAbvd_SM ||
    banco?.tCrdr_Nome_SL ||
    '—';

  return (
    <View style={styles.bankRow}>
      <Text style={styles.bankRank}>#{indice + 1}</Text>

    
      <Text style={styles.bankName} numberOfLines={1}>
        {nomeBanco}
      </Text>

      {/* Barra de Progresso Visual */}
      <View style={styles.barWrap}>
        <View
          style={[
            styles.barFill,
            {
              // A largura reflete a participação no total, limitada entre 2% e 100% para visibilidade
              width: `${Math.min(Math.max(Math.abs(porcentagem), 2), 100)}%`,
              backgroundColor: getCor(),
            },
          ]}
        />
      </View>

      {/* Coluna de Valores à Direita */}
      <View style={{ alignItems: 'flex-end', minWidth: 55 }}>
        <Text style={styles.bankCount}>
          {formatarNumero(banco?.RegDiaSel_IN)}
        </Text>

        <Text style={{ fontSize: 10, color: getCor(), fontWeight: 'bold' }}>
          {banco?.variacaoFormatada ?? '—'}
        </Text>
      </View>
    </View>
  );
}