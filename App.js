import 'react-native-gesture-handler';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';

import login from './src/login/login';
import dashboard from './src/dashboard/dashboard';
import veiculos from './src/veiculos/veiculos';
import notificacoes from './src/notificacoes/notificacoes';
import esqueceusenha from './src/senha/esqueceusenha';
import menulateral from './src/menulateral/menulateral';
import contrato from './src/Contrato/Contrato';
const Stack = createNativeStackNavigator();

const AppTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#091525',
  },
};

export default function App() {
  return (
    <SafeAreaProvider>

      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <NavigationContainer theme={AppTheme}>

        <Stack.Navigator
          initialRouteName="login"
          screenOptions={{
            headerShown: false,
            animation: 'fade_from_bottom',
            contentStyle: { backgroundColor: '#091525' },
          }}
        >

          <Stack.Screen
            name="login"
            component={login}
          />

          <Stack.Screen
            name="dashboard"
            component={dashboard}
          />

          <Stack.Screen
            name="veiculos"
            component={veiculos}
          />

          <Stack.Screen
            name="notificacoes"
            component={notificacoes}
          />

          <Stack.Screen
            name="esqueceusenha"
            component={esqueceusenha}
          />
        
            <Stack.Screen
            name="menulateral"
            component={menulateral}
          />
          <Stack.Screen
            name="contrato"
            component={contrato}
          />
        </Stack.Navigator>

      </NavigationContainer>

    </SafeAreaProvider>
  );
}