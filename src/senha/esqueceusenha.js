import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StatusBar, KeyboardAvoidingView, Platform,
  ScrollView, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CaretLeft, Envelope, CheckCircle } from 'phosphor-react-native';
import styles from '../senha/esqueceusenhastyles';

export default function esqueceusenha({ navigation }) {

  const [email, setEmail] = useState('');
  const [emailFocus, setEmailFocus] = useState(false);
  const [sent, setSent] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const btnScale = useRef(new Animated.Value(1)).current;
  const successScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 65,
        useNativeDriver: true
      }),
    ]).start();
  }, []);

  const handleSend = () => {
    if (!email) return;
    setSent(true);
    Animated.spring(successScale, {
      toValue: 1,
      friction: 5,
      tension: 80,
      useNativeDriver: true
    }).start();
  };

  const onPressIn = () =>
    Animated.spring(btnScale, {
      toValue: 0.96,
      friction: 8,
      useNativeDriver: true
    }).start();

  const onPressOut = () =>
    Animated.spring(btnScale, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true
    }).start();

  return (
    <View style={{ flex: 1, backgroundColor: '#071a2c' }}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <View style={styles.container}>

        <View style={styles.circle1} />
        <View style={styles.circle2} />
        <View style={styles.circle3} />
        <View style={styles.circle4} />

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >

            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <CaretLeft size={24} color="#ffffff" weight="bold" />
            </TouchableOpacity>

            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }}
            >
              {!sent ? (

                <View style={styles.card}>

                  <View style={styles.iconWrap}>
                    <Envelope size={32} color="#39d0a1" weight="duotone" />
                  </View>

                  <Text style={styles.title}>Esqueceu a senha</Text>
                  <Text style={styles.label}>E-MAIL</Text>

                  <TextInput
                    style={[styles.input, emailFocus && styles.inputFocused]}
                    placeholder="seu@email.com"
                    placeholderTextColor="#6f8aa4"
                    value={email}
                    onChangeText={setEmail}
                    onFocus={() => setEmailFocus(true)}
                    onBlur={() => setEmailFocus(false)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />

                  <Animated.View style={{ transform: [{ scale: btnScale }] }}>
                    <TouchableOpacity
                      style={[styles.btnPrimary, !email && styles.btnDisabled]}
                      onPressIn={onPressIn}
                      onPressOut={onPressOut}
                      onPress={handleSend}
                      activeOpacity={1}
                      disabled={!email}
                    >
                      <Text style={styles.btnText}>Enviar link</Text>
                    </TouchableOpacity>
                  </Animated.View>

                  <TouchableOpacity
                    style={styles.backToLogin}
                    onPress={() => navigation.navigate('login')}
                    activeOpacity={0.6}
                  >
                    <CaretLeft size={14} color="#39d0a1" weight="bold" />
                    <Text style={styles.backToLoginText}>
                      Voltar para o login
                    </Text>
                  </TouchableOpacity>

                </View>

              ) : (

                <Animated.View
                  style={[
                    styles.card,
                    styles.successCard,
                    { transform: [{ scale: successScale }] }
                  ]}
                >
                  <View style={styles.successIconWrap}>
                    <CheckCircle size={56} color="#39d0a1" weight="duotone" />
                  </View>

                  <Text style={styles.successTitle}>E-mail enviado!</Text>

                  <Text style={styles.successText}>
                    Enviamos um link de redefinição para{'\n'}
                    <Text style={styles.successEmail}>{email}</Text>
                  </Text>

                  <Text style={styles.successHint}>
                    Verifique sua caixa de entrada e a pasta de spam.
                  </Text>

                  <TouchableOpacity
                    style={styles.btnPrimary}
                    onPress={() => navigation.navigate('login')}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.btnText}>
                      Voltar para o login
                    </Text>
                  </TouchableOpacity>

                </Animated.View>

              )}

            </Animated.View>

          </ScrollView>
        </KeyboardAvoidingView>

      </View>
    </View>
  );
}