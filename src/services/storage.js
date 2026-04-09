// storage.js
//import AsyncStorage from '@react-native-async-storage/async-storage';


const datenow = new Date();

 
export const saveAuth = async (status,token, expirationDateh)  =>{
 
    const authData = {  status,token, expirationDateh };
    await AsyncStorage.setItem('auth', JSON.stringify(authData));
    if (status === 'Autenticado'){
       console.log('Auth salvo com sucesso!');
         } else {
         
      console.log('Erro ao salvar auth: Não autenticado!');
    }
  
};


export const getAuth = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('auth');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (err) {
    console.log('Erro ao recuperar auth:', err);
    return null;
  }
};

/**
 * Remove os dados de autenticação
 */
export const removeAuth = async () => {
  try {
    await AsyncStorage.removeItem('auth');
    console.log('Auth removido!');
  } catch (err) {
    console.log('Erro ao remover auth:', err);
  }
};