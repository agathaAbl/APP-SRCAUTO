import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617', // fundo geral
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },

  headerTitulo: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  /* STATUS */
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginHorizontal: 12,
    marginTop: 10,
    borderRadius: 10,
  },

  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },

  statusText: {
    fontWeight: 'bold',
  },

  /* CARD */
  card: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 12,
    marginTop: 12,

    // sombra iOS
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },

    // sombra Android
    elevation: 5,

    borderWidth: 1,
    borderColor: '#1f2937',
  },

  /* TITULO DA SEÇÃO */
  sectionTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
    paddingBottom: 6,
  },

  sectionTitleText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },

  /* LINHAS */
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  infoLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  infoLabelText: {
    color: '#9ca3af',
    fontSize: 12,
  },

  infoValue: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    maxWidth: '55%',
    textAlign: 'right',
  },

  /* LOADING */
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    color: '#9ca3af',
    marginTop: 10,
  },

  /* ERRO */
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  errorText: {
    color: '#ef4444',
    marginBottom: 10,
  },

  retryButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },

  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});