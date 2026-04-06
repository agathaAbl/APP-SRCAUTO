import { StyleSheet, Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#071a2c',
    width: '100%',
    paddingHorizontal: 24,
    overflow: 'hidden',
  },

  logoWrap: {
    alignItems: 'center',
    marginTop: height < 700 ? 50 : 90,   
    marginBottom: height < 700 ? 24 : 50,
  },

  logoBox: {
    width: height < 700 ? 110 : 150,    
    height: height < 700 ? 110 : 150,
    borderRadius: 40,
    backgroundColor: '#0f2c44',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },

  logoImage: {
    width: height < 700 ? 75 : 100,
    height: height < 700 ? 75 : 100,
  },

  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7a8fb5',
    marginTop: 16,
    marginBottom: 6,
  },

  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f2c44',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ffffff',
    paddingHorizontal: 16,
    marginBottom: 16,
  },

  input: {
    flex: 1,
    height: 50,
    color: '#fff',
    fontSize: 15,
  },

  eyeButton: {
    padding: 6,
  },

  btnPrimary: {
    width: '100%',
    height: 52,
    borderRadius: 14,
    backgroundColor: '#25c7a4',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },

  btnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#052a2a',
  },

  forgotWrap: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 32,   
  },

  forgotText: {
    fontSize: 13,
    color: '#7a8fb5',
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
