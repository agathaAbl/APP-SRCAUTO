import { StyleSheet } from 'react-native';

export const pill = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 30,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  text: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: 'transparent' },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 8,
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
  },

  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    backgroundColor: '#0f2c44',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#0f2c44',
    paddingHorizontal: 14,
    marginBottom: 4,
    gap: 8,
  },

  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: '#ffffff',
  },

  list: {
    padding: 20,
  },

  card: {
    backgroundColor: '#0f2c44',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#0f2c44',
    padding: 14,
    marginBottom: 10,
  },

  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },

  cardName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
  },

  cardPlate: {
    fontSize: 16,
    color: '#7a8fb5',
    fontWeight: '600',
    marginTop: 1,
  },

  
  statusBadge: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },

  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#071a2c',
  },
});

export default styles;