import { StyleSheet } from 'react-native';

export const menulateralstyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#0e2236',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#1a324d',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  item: { alignItems: 'center', justifyContent: 'center' },
  label: { color: '#fff', fontSize: 10, marginTop: 4 },
  badge: {
    position: 'absolute',
    top: -5,
    right: -10,
    backgroundColor: '#ff4d4d',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
});