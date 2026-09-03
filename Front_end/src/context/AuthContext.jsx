import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (token) {
      // setUser(JSON.parse(storedUser));
      // Vérifier si le token est encore valide
      api.get('/auth/me')
        .then(res => {
          setUser(res.data);
          localStorage.setItem('user', JSON.stringify(res.data));
    })
        .catch(() => logout())
        .finally(() => setLoading(false));
    } else{
    setLoading(false);}
  }, []);

 const login = async (email, password) => {
    try {
      console.log('Tentative connexion avec:', email);
      setError(null);
      const response = await api.post('/auth/login', { email, password });
      console.log('Réponse serveur:', response.data);
      const { access_token, user } = response.data;
      
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      
      return user;
    } catch (err) {
      console.error('Erreur complète:', err);
      console.error('Status:', err.response?.status);
      console.error('Message:', err.response?.data);
      const errorMsg = err.response?.data?.detail || 'Erreur de connexion';
      setError(errorMsg);
      throw err;
    }
  };
  
 const registerAuth= async (email,nom,prenom,password,role,departement) => {
  try {
    console.log('Tentative inscription avec:', email);
    console.log('Tentative inscription avec:', nom);
    console.log('Tentative inscription avec:', prenom);
    console.log('Tentative inscription avec:', role);
    console.log('Tentative inscription avec:', departement);
    setError(null);
    const response = await api.post('/auth/register', { email,nom,prenom,password,role,departement_id : departement});
    console.log('Réponse serveur:', response.data);
    const { new_user } = response.data;
    
    // localStorage.setItem('token', access_token);
    // localStorage.setItem('user', JSON.stringify(user));
    // setUser(user);
    
    return new_user;
  } catch (err) {
    console.error('Erreur complète:', err);
    console.error('Status:', err.response?.status);
    console.error('Message:', err.response?.data);
    const errorMsg = err.response?.data?.detail || 'Erreur de connexion';
    setError(errorMsg);
    throw err;
  }
};

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setError(null);
  };

  const hasRole = (...roles) => {
    return user && roles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{ user, login, registerAuth , logout, loading, error, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};