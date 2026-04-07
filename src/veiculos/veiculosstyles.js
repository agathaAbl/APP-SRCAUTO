import { StyleSheet } from 'react-native';

// ✅ Calculado com base nos estilos do card:
// padding (14x2=28) + header(48) + row(38) + linha(38) + row(38) + footer(28) + marginBottom(12) ≈ 230
// Se o scroll não bater certinho, ajuste esse valor
export const CARD_HEIGHT = 230;

export const pill = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: '#1e293b',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  text: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
  },
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0f172a' },

  // Header
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0f172a',
  },
  titulo: { color: '#fff', fontSize: 32, fontWeight: '800' },
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
  filtroBadgeCountText: { color: '#fff', fontSize: 11, fontWeight: '700' },

  // Busca
  buscaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 16,
    marginBottom: 12,
    gap: 10,
  },
  buscaInput: { flex: 1, fontSize: 14, color: '#e2e8f0' },

  statusBarScroll: {
    flexGrow: 0,
    marginBottom: 10,
  },
  statusBarContent: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1.5,
  },
  statusPillText: {
    fontSize: 18,
    fontWeight: '600',
  },


  filtrosAtivosContainer: { marginHorizontal: 16, marginBottom: 8 },
  filtrosAtivosContent: { gap: 8 },
  chipFiltroAtivo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  chipFiltroAtivoText: { color: '#fff', fontSize: 12, fontWeight: '700' },

  // Contagem de resultados
  resultadosContainer: { paddingHorizontal: 16, paddingBottom: 8 },
  resultadosText: { color: '#94a3b8', fontSize: 13 },

  // Loading / Erro
  statusBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    padding: 16,
  },
  statusText: { color: '#e2e8f0', fontSize: 18 },
  erroBox: {
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: '#7f1d1d',
    padding: 12,
    borderRadius: 12,
  },
  erroText: { color: '#fecaca', textAlign: 'center', fontWeight: '700' },

  // Card de veículo
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    overflow: 'hidden',
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    minHeight: 48, 
  },
  placa: { color: '#000000', fontSize: 16, fontWeight: 'bold', backgroundColor: '#f1f5f9', paddingHorizontal: 8, borderRadius:10, marginBottom: 6,},
  contratoText: { color: '#d1d5db', fontSize: 14, martgintop: 6, },
  labelSmall: { color: '#60a5fa', fontSize: 12,  },
  valorDestaque: { color: '#ffffff', fontSize: 14, fontWeight: '700', lineHeight: 20 },
  valorSecundario: { color: '#f1f5f9', fontSize: 14,},
  dataText: { color: '#94a3b8', fontSize: 12, textAlign: 'right' },
  listaVazia: { color: '#64748b', textAlign: 'center', padding: 20 },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  statusBadgeText: { color: '#ffffff', fontSize: 12, fontWeight: '700' },

  
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    minHeight: 38, 
  },
  cardCol: { flex: 1 },
  cardColRight: { flex: 1, alignItems: 'flex-end' },
  cardLinha: {
    marginTop: 8,
    minHeight: 38, 
  },
  cardFooter: {
    marginTop: 8,
    minHeight: 28, 
  },
 
  // FlatList container
  listContent: {
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 100,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#0f172a',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  modalTitulo: { color: '#e2e8f0', fontSize: 16, fontWeight: '700' },
  modalBody: { paddingHorizontal: 8 },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  btnLimpar: {
    backgroundColor: '#1e293b',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  btnLimparTexto: { color: '#10b981', fontWeight: '700' },
  btnAplicar: {
    backgroundColor: '#10b981',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  btnAplicarTexto: { color: '#fff', fontWeight: '700' },
});

export default styles;