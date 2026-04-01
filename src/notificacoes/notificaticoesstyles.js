import { StyleSheet } from 'react-native';

export default StyleSheet.create({

  //  Layout base 
  safe: { flex: 1, backgroundColor: 'transparent' },

  //  Header 
  cabecalho: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },

  cabecalhoTopo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },

  titulo: {
    fontSize: 26,
    fontWeight: '800',
    color: '#ffffff',
  },

  subtitulo: {
    fontSize: 12,
    color: '#7a8fb5',
  },

  //  Lista 
  lista: {
    padding: 20,
    paddingBottom: 32,
  },

  card: {
    flexDirection: 'row',
    backgroundColor: '#0f2c44',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    overflow: 'hidden',
  },

  cardNaoLido: {
    borderLeftWidth: 4,
    borderLeftColor: '#39d0a1',
  },

  // Card interno 
  iconeWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    flexShrink: 0,
  },

  corpo: { flex: 1 },

  tituloNotif: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },

  descricaoNotif: {
    fontSize: 13,
    color: '#7a8fb5',
    lineHeight: 18,
    marginBottom: 6,
  },

  tempoNotif: {
    fontSize: 11,
    color: '#7a8fb5',
  },

  pontinho: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#39d0a1',
    marginTop: 4,
    marginLeft: 10,
    flexShrink: 0,
  },

  // Menu inferior 
  menuInferior: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    paddingVertical: 12,
    backgroundColor: '#0f2c44',
  },

  itemMenu: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  textoMenu: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7a8fb5',
    marginTop: 4,
  },

});