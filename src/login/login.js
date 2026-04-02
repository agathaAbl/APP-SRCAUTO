
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Image,
  Animated,
  ActivityIndicator,
  Alert,
  StatusBar,
} from 'react-native';
import { Eye, EyeSlash } from 'phosphor-react-native';
import { loginRequest } from '../services/auth';
import { saveAuth } from '../services/storage';
import styles from './styleslogin';

export default function Login({ navigation }) {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const logoAnim = useRef(new Animated.Value(0)).current;
  const cardAnim = useRef(new Animated.Value(0)).current;
  const btnScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.stagger(200, [
      Animated.timing(logoAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(cardAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const animateButton = useCallback((value) => {
    Animated.spring(btnScale, {
      toValue: value,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLogin = useCallback(async () => {
    if (!user.trim() || !pass.trim()) {
      Alert.alert('Atenção', 'Preencha o usuário e a senha.');
      return;
    }

    setLoading(true);
    try {
      const data = await loginRequest(user, pass);
      const isAuth = data?.Status?.trim().toLowerCase() === 'autenticado';

      if (isAuth) {
        await saveAuth(data.Token, data.ExpirationDate);
        navigation.push('dashboard');
      } else {
        Alert.alert('Erro', 'Usuário ou senha incorretos.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível conectar ao servidor.');
    } finally {
      setLoading(false);
    }
  }, [user, pass, navigation]);

  const togglePassword = () => setShowPass((prev) => !prev);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#071a2c' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <View style={styles.container}>
        {/* Elementos Decorativos */}
        <View style={styles.circle1} />
        <View style={styles.circle2} />
        <View style={styles.circle3} />
        <View style={styles.circle4} />

        <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} bounces={false}>
          {/* Logo Animada */}
          <Animated.View style={[styles.logoWrap, { opacity: logoAnim }]}>
            <View style={styles.logoBox}>
              <Image
                source={require('../assets/Images/logo-branca-src.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
          </Animated.View>

          {/* Formulário Animado */}
          <Animated.View style={{ opacity: cardAnim }}>
            <Text style={styles.label}>E-MAIL OU USUÁRIO</Text>
            <View style={styles.inputWrap}>
              <TextInput
                placeholder="seu@email.com"
                placeholderTextColor="#6f8aa4"
                value={user}
                onChangeText={setUser}
                style={styles.input}
                autoCapitalize="none"
              />
            </View>

            <Text style={styles.label}>SENHA</Text>
            <View style={styles.inputWrap}>
              <TextInput
                placeholder="********"
                placeholderTextColor="#6f8aa4"
                secureTextEntry={!showPass}
                value={pass}
                onChangeText={setPass}
                style={styles.input}
              />
              <TouchableOpacity style={styles.eyeButton} onPress={togglePassword}>
                {showPass ? <Eye size={20} color="#8fa4b8" /> : <EyeSlash size={20} color="#8fa4b8" />}
              </TouchableOpacity>
            </View>

            {/* Botão de Entrar */}
            <Animated.View style={{ transform: [{ scale: btnScale }] }}>
              <TouchableOpacity
                style={[styles.btnPrimary, loading && { opacity: 0.7 }]}
                onPressIn={() => animateButton(0.96)}
                onPressOut={() => animateButton(1)}
                onPress={handleLogin}
                activeOpacity={1}
                disabled={loading || !user.trim() || !pass.trim()}
              >
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Entrar</Text>}
              </TouchableOpacity>
            </Animated.View>

            <TouchableOpacity style={styles.forgotWrap} onPress={() => navigation.navigate('esqueceusenha')}>
              <Text style={styles.forgotText}>Esqueci minha senha</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
