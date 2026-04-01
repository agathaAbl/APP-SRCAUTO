// styles/dashboardstyles.js
import { StyleSheet } from 'react-native';

export const pill = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: '#071a2c',
  },
  dot: { width: 6, height: 6, borderRadius: 3, marginRight: 5 },
  text: { fontSize: 11, fontWeight: '700', letterSpacing: 0.3, color: '#ffffff' },
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: 'transparent' },

  /* HEADER */
  header: {
    paddingHorizontal: 20,
    paddingTop: 0,
    paddingBottom: 8,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 10,
  },
  hello: { fontSize: 22, fontWeight: '800', color: '#ffffff' },
  subtitle: { fontSize: 20, color: '#ffffff' },
  headerActions: { flexDirection: 'row', alignItems: 'center' },
  iconBtn: {
    width: 42, height: 42, marginLeft: 8,
    backgroundColor: '#0f2c44', borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#0f2c44',
  },

  /* CONTENT */
  content: { padding: 20 },

  /* STAT CARDS */
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 8 },
  statCard: {
    width: '48%', alignItems: 'flex-start',
    backgroundColor: '#0f2c44', borderRadius: 16,
    paddingVertical: 16, paddingHorizontal: 20, marginBottom: 15,
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6, shadowRadius: 12, elevation: 12,
  },
  statIconWrap: { width: 30, height: 30, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  statVal: { fontSize: 22, fontWeight: '800', color: '#39d0a1' },
  statLabel: { fontSize: 15, color: '#7a8fb5', marginTop: 6, textAlign: 'left', fontWeight: '500' },

  /* SECTION */
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#ffffff' },
  seeAllBtn: { flexDirection: 'row', alignItems: 'center' },
  seeAll: { fontSize: 14, color: '#39d0a1', fontWeight: '600', marginRight: 4 },

  /* BANKS */
  banksCard: {
    backgroundColor: '#0f2c44', borderRadius: 16, paddingVertical: 4, marginBottom: 20, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.6, shadowRadius: 12, elevation: 12,
  },
  bankRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10 },
  bankRowBorder: { borderBottomWidth: 1, borderBottomColor: '#071a2c' },
  bankRank: { fontSize: 13, color: '#7a8fb5', width: 24, fontWeight: '600', marginRight: 10 },
  bankName: { fontSize: 15, fontWeight: '600', color: '#ffffff', flex: 1 },
  barWrap: { width: 80, height: 5, backgroundColor: '#071a2c', borderRadius: 3, marginRight: 10 },
  barFill: { height: 5, backgroundColor: '#39d0a1', borderRadius: 3 },
  bankCount: { fontSize: 15, color: '#39d0a1', fontWeight: '700', minWidth: 24, textAlign: 'right' },

  /* VEHICLE CARD */
  vehicleCard: {
    backgroundColor: '#0f2c44', borderRadius: 16, padding: 16, marginBottom: 12, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.6, shadowRadius: 12, elevation: 12,
  },
  vehicleHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  vehicleName: { fontSize: 17, fontWeight: '700', color: '#ffffff' },
  ownerName: { fontSize: 14, color: '#ffffff', marginBottom: 8, fontWeight: '600' },
  vehicleInfo: { flexDirection: 'row', paddingTop: 12, borderTopWidth: 1, borderTopColor: '#071a2c' },
  vehicleInfoItem: { marginRight: 20 },
  vehicleInfoLabel: { fontSize: 12, color: '#7a8fb5', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  vehicleInfoValue: { fontSize: 14, color: '#ffffff', fontWeight: '600' },

  /* BOTTOM MENU */
  bottomMenu: {
    flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 10,
    borderTopWidth: 1, borderTopColor: '#071a2c', paddingVertical: 12, backgroundColor: '#0f2c44',
  },
  menuItem: { alignItems: 'center', paddingHorizontal: 20 },
  menuText: { fontSize: 13, marginTop: 4, fontWeight: '600', color: '#7a8fb5' },
});

export default styles;