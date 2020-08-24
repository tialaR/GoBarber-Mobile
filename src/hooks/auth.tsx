// Hook de Contexto para mostrar/prover os dados do usuário logado na aplicação
import AsyncStorage from '@react-native-community/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import api from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
}

interface AuthState {
  token: string;
  user: User;
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  user: User;
  signIn(creditials: SignInCredentials): Promise<void>;
  updateUser(user: User): Promise<void>;
  signOut(): void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>({} as AuthState);
  const [loading, setLoading] = useState(true);

  /* Buscando variavel inicial (caso o usuário já esteja logado)
      baseada no que está armazenado no AsyncStorage.
      -> A sessão não é perdida.
  */
  useEffect(() => {
    async function loadStorageData(): Promise<void> {
      const [token, user] = await AsyncStorage.multiGet([
        '@GoBarber:token',
        '@GoBarber:user',
      ]);

      if (token[1] && user[1]) {
        api.defaults.headers.authorization = `Bearer ${token[1]}`;

        setData({ token: token[1], user: JSON.parse(user[1]) });
      }

      setLoading(false);
    }

    loadStorageData();
  }, []);

  // Login
  const signIn = useCallback(async ({ email, password }) => {
    // Criando sessão de usuário no back-end
    const response = await api.post('sessions', {
      email,
      password,
    });

    const { token, user } = response.data;

    // Salvando no localStorage:
    await AsyncStorage.multiSet([
      ['@GoBarber:token', token],
      ['@GoBarber:user', JSON.stringify(user)],
    ]);

    /* Definindo como padrão para todas as requisições da aplicação um cabeçalho com o nome
       Authorization contendo o valor do token */
    api.defaults.headers.authorization = `Bearer ${token}`;

    setData({ token, user });
  }, []);

  // Atualiza os dados do usuário (o token continua o mesmo)
  const updateUser = useCallback(
    async (user: User) => {
      await AsyncStorage.setItem('@GoBarber:user', JSON.stringify(user));

      setData({
        token: data.token,
        user,
      });
    },
    [setData, data.token],
  );

  // Logout
  const signOut = useCallback(async () => {
    // Removendo do localStorage:
    await AsyncStorage.multiRemove(['@GoBarber:token', '@GoBarber:user']);

    // Removendo da variável:
    setData({} as AuthState);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user: data.user, loading, signIn, updateUser, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Criando hook de autenticação
function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

export { AuthProvider, useAuth };
