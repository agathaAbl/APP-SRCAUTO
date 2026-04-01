import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SquaresFour, Car, Bell, CheckCircle, WarningCircle, Info, XCircle } from 'phosphor-react-native';
import styles from './notificaticoesstyles';

const NOTIFICACOES_INICIAIS = [
  { id: 1, icone: '✅', titulo: 'Registro Aprovado', descricao: 'O veículo com chassi 9BWZZZ377VT004251 foi registrado com sucesso.', tempo: 'Agora', naolida: true, corFundo: 'rgba(0,135,90,0.15)' },
  { id: 2, icone: '⚠️', titulo: 'Pendência Identificada', descricao: 'O registro do veículo placa ABC1D23 requer documentação adicional.', tempo: 'Agora', naolida: true, corFundo: 'rgba(179,92,0,0.15)' },
  { id: 3, icone: 'ℹ️', titulo: 'Novo Lote Processado', descricao: '15 veículos do Bradesco foram processados com sucesso.', tempo: '1d atrás', naolida: true, corFundo: 'rgba(0,85,204,0.15)' },
  { id: 4, icone: '❌', titulo: 'Registro Rejeitado', descricao: 'O registro do veículo chassi 3FAHP0HA7AR123456 foi rejeitado.', tempo: '1d atrás', naolida: false, corFundo: 'rgba(192,57,43,0.15)' },
];

const ICONE_MAP = {
  '✅': <CheckCircle size={22} color="#00875a" weight="fill" />,
  '⚠️': <WarningCircle size={22} color="#b35c00" weight="fill" />,
  'ℹ️': <Info size={22} color="#0055cc" weight="fill" />,
  '❌': <XCircle size={22} color="#c0392b" weight="fill" />,
};

// Sub-componente memoizado para os itens da lista
const NotificationCard = React.memo(({ item, onPress }) => (
  <TouchableOpacity
    style={[styles.card, item.naolida && styles.cardNaoLido]}
    activeOpacity={0.8}
    onPress={() => onPress(item.id)}
  >
    <View style={[styles.iconeWrap, { backgroundColor: item.corFundo }]}>
      {ICONE_MAP[item.icone]}
    </View>
    <View style={styles.corpo}>
      <Text style={styles.tituloNotif}>{item.titulo}</Text>
      <Text style={styles.descricaoNotif} numberOfLines={2}>{item.descricao}</Text>
      <Text style={styles.tempoNotif}>{item.tempo}</Text>
    </View>
    {item.naolida && <View style={styles.pontinho} />}
  </TouchableOpacity>
));

// Sub-componente memoizado para itens do menu
const MenuItem = React.memo(({ label, icon: Icon, active, onPress }) => (
  <TouchableOpacity style={styles.itemMenu} onPress={onPress}>
    <Icon size={30} color={active ? '#39d0a1' : '#7a8fb5'} weight={active ? 'fill' : 'regular'} />
    <Text style={[styles.textoMenu, { color: active ? '#39d0a1' : '#7a8fb5' }]}>{label}</Text>
  </TouchableOpacity>
));

export default function Notifications({ navigation, route }) {
  const [notificacoes, setNotificacoes] = useState(NOTIFICACOES_INICIAIS);
  const telaAtual = route.name;

  // Performance: Só recalcula o total se a lista de notificações mudar
  const totalNaoLidas = useMemo(() => 
    notificacoes.filter(n => n.naolida).length, 
  [notificacoes]);

  // Performance: useCallback evita que a função seja recriada em todo render
  const marcarUmaLida = useCallback((id) => {
    setNotificacoes(prev => prev.map(n => n.id === id ? { ...n, naolida: false } : n));
  }, []);

  const marcarTodasLidas = useCallback(() => {
    setNotificacoes(prev => prev.map(n => ({ ...n, naolida: false })));
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#071a2c' }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
        <StatusBar barStyle="light-content" />

        {/* Header */}
        <View style={styles.cabecalho}>
          <View style={styles.cabecalhoTopo}>
            <Text style={styles.titulo}>
              Notificações {totalNaoLidas > 0 && `(${totalNaoLidas})`}
            </Text>
            {totalNaoLidas > 0 && (
              <TouchableOpacity onPress={marcarTodasLidas} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <CheckCircle size={18} color="#39d0a1" weight="fill" />
                <Text style={{ color: '#39d0a1', fontWeight: '600' }}>Ler todas</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Lista Otimizada */}
        <FlatList
          data={notificacoes}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <NotificationCard item={item} onPress={marcarUmaLida} />
          )}
          contentContainerStyle={styles.lista}
          showsVerticalScrollIndicator={false}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews={true} 
        />

        {/* Menu inferior */}
        <View style={styles.menuInferior}>
          <MenuItem 
            label="Dashboard" 
            icon={SquaresFour} 
            active={telaAtual === 'Dashboard'} 
            onPress={() => navigation.navigate('dashboard')} 
          />
          <MenuItem 
            label="Veículos" 
            icon={Car} 
            active={telaAtual === 'Veiculos'} 
            onPress={() => navigation.navigate('veiculos')} 
          />
          <MenuItem 
            label="Notificações" 
            icon={Bell} 
            active={telaAtual === 'Notifications'} 
            onPress={() => navigation.navigate('notificacoes')} 
          />
        </View>
      </SafeAreaView>
    </View>
  );
}