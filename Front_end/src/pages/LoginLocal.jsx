import React, { useState } from 'react';

const LoginLocal = () => {
  // État pour basculer entre 'login' et 'register'
  const [isLogin, setIsLogin] = useState(true);

  // États pour le formulaire de Connexion
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  // États pour le formulaire d'Inscription
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    department: '',
    password: '',
    confirmPassword: '',
  });

  // Gestion des changements pour le Login
  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  // Gestion des changements pour le Register
  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  // Soumission de la Connexion
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    console.log('Connexion avec :', loginData);
    // TODO: Appel API vers votre backend (ex: axios.post('/api/login', loginData))
  };

  // Soumission de l'Inscription
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      alert('Les mots de passe ne correspondent pas.');
      return;
    }
    console.log('Inscription avec :', registerData);
    // TODO: Appel API vers votre backend (ex: axios.post('/api/register', registerData))
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-slate-950">
          Gestion de Matériel
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Portail interne de l'entreprise
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          
          {/* Boutons d'onglets pour basculer */}
          <div className="flex border-b border-slate-200 mb-6">
            <button
              className={`flex-1 pb-3 text-sm font-medium text-center border-b-2 transition-colors ${
                isLogin
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
              onClick={() => setIsLogin(true)}
            >
              Connexion
            </button>
            <button
              className={`flex-1 pb-3 text-sm font-medium text-center border-b-2 transition-colors ${
                !isLogin
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
              onClick={() => setIsLogin(false)}
            >
              Inscription
            </button>
          </div>

          {/* Formulaire de Connexion */}
          {isLogin ? (
            <form className="space-y-6" onSubmit={handleLoginSubmit}>
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Adresse Email professionnelle
                </label>
                <div className="mt-1">
                  <input
                    name="email"
                    type="email"
                    required
                    value={loginData.email}
                    onChange={handleLoginChange}
                    className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="nom.prenom@entreprise.local"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Mot de passe
                </label>
                <div className="mt-1">
                  <input
                    name="password"
                    type="password"
                    required
                    value={loginData.password}
                    onChange={handleLoginChange}
                    className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Se connecter
                </button>
              </div>
            </form>
          ) : (
            /* Formulaire d'Inscription */
            <form className="space-y-4" onSubmit={handleRegisterSubmit}>
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Nom complet
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  value={registerData.name}
                  onChange={handleRegisterChange}
                  className="mt-1 appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Jean Dupont"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Email professionnel
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  value={registerData.email}
                  onChange={handleRegisterChange}
                  className="mt-1 appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="jean.dupont@entreprise.local"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Département / Service
                </label>
                <select
                  name="department"
                  value={registerData.department}
                  onChange={handleRegisterChange}
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white"
                >
                  <option value="">Sélectionnez votre service</option>
                  <option value="IT">Informatique (IT)</option>
                  <option value="RH">Ressources Humaines</option>
                  <option value="Comptabilite">Comptabilité / Finance</option>
                  <option value="Logistique">Logistique / Terrain</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Mot de passe
                </label>
                <input
                  name="password"
                  type="password"
                  required
                  value={registerData.password}
                  onChange={handleRegisterChange}
                  className="mt-1 appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Confirmer le mot de passe
                </label>
                <input
                  name="confirmPassword"
                  type="password"
                  required
                  value={registerData.confirmPassword}
                  onChange={handleRegisterChange}
                  className="mt-1 appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="••••••••"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Créer le compte
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

export default LoginLocal;