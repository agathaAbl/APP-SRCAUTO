import { StyleSheet, Platform, Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

export default StyleSheet.create({

  container: {
    flex: 1,
    minHeight: height,
    backgroundColor: '#071a2c',
    overflow: 'hidden',
  },

  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 60,
  },

  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#0f2c44',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#071a2c',
  },

  card: {
    backgroundColor: '#0f2c44',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#071a2c',
  },

  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: 'rgba(57,208,161,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 8,
    letterSpacing: -0.4,
  },

  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7a8fb5',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 8,
  },

  input: {
    backgroundColor: '#071a2c',
    borderWidth: 1.5,
    borderColor: '#071a2c',
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: Platform.OS === 'ios' ? 16 : 14,
    fontSize: 14.5,
    color: '#ffffff',
    marginBottom: 20,
  },

  inputFocused: {
    borderColor: '#39d0a1',
  },

  btnPrimary: {
    backgroundColor: '#39d0a1',
    borderRadius: 14,
    paddingVertical: 17,
    alignItems: 'center',
  },

  btnDisabled: { opacity: 0.45 },

  btnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#022b28',
    letterSpacing: 0.4,
  },

  backToLogin: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    paddingVertical: 6,
    gap: 4,
  },

  backToLoginText: {
    fontSize: 13,
    color: '#39d0a1',
    fontWeight: '600',
  },

  successCard: { alignItems: 'center' },

  successIconWrap: {
    width: 96,
    height: 96,
    borderRadius: 28,
    backgroundColor: 'rgba(57,208,161,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },

  successTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 12,
    letterSpacing: -0.4,
  },

  successText: {
    fontSize: 14,
    color: '#7a8fb5',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 8,
  },

  successEmail: {
    color: '#39d0a1',
    fontWeight: '700',
  },

  successHint: {
    fontSize: 12,
    color: '#7a8fb5',
    textAlign: 'center',
    marginBottom: 28,
  },

  circle1: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: '#39d0a1',
    opacity: 0.05,
    top: -120,
    left: -80,
  },

  circle2: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#39d0a1',
    opacity: 0.04,
    top: 120,
    right: -100,
  },

  circle3: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: '#39d0a1',
    opacity: 0.03,
    bottom: 120,
    left: -60,
  },

  circle4: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#39d0a1',
    opacity: 0.03,
    bottom: -120,
    right: -120,
  },

});