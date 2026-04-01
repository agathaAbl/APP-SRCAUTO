import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  lupaBtn: {
    backgroundColor: '#0e2236',
    padding: 10,
    borderRadius: 50,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarioWrapper: {
    width: 340,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 20,
  },
});

export default styles;