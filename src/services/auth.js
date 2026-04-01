import AsyncStorage from "@react-native-async-storage/async-storage";


export const loginRequest = async (user, pass) => {
  console.log('CHAMANDO API');

  const response = await fetch(
    'https://srcauto-homolog.grupoabl.com.br/rest/wsAutenticaToken',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sdtAutenticarUsuario: {
          tsCAC_Projeto_Sigla_SG: 'RGCO',
          Login_SM: user.trim(),
          Senha_SM: pass,
          CK_Ambn: 'HOM',
        },
      }),
    }
  );

  const data = await response.json();

  console.log('RESPOSTA:', data.Token);

await AsyncStorage.setItem("Token", JSON.stringify(data.Token));

  return data;
};