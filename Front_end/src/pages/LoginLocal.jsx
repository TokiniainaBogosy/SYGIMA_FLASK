import React, { useState } from 'react';
import logo from '../assets/asecna-logo.png';
import logo2 from '../assets/logo-sygima.png';
import { useNavigate, Link,useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext';
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, Boxes, ArrowRight, Loader2 } from 'lucide-react'

const LoginLocal = () => {

  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { login, error } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const fromModal = location.state?.fromModal || false
    
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  
  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      await login(data.email, data.password)
      navigate('/dashboard')
    } catch (error) {
      console.error("Erreur de connexion", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-slate-950">
          Gestion de Matériel
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600 ">
          Portail interne de l'entreprise
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="flex justify-between items-center w-full mb-4">
            <img className="h-18 object-contain" src={logo} alt="Logo de l'entreprise" />
            <img className="object-contain h-18 w-28" src={logo2} alt="Logo de l'entreprise" />
          </div>
          {/* Boutons d'onglets pour basculer */}
          <div className="flex border-b border-slate-200 mb-6">
            <button
              className={`flex-1 pb-3 text-sm font-medium text-center border-b-2 transition-colors border-blue-600 text-blue-600`}
            >
              Connexion
            </button>
          </div>

          {/* Formulaire de Connexion */}
          
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Adresse Email professionnelle
                </label>
                <div className="mt-1">
                  <input
                    name="email"
                    type="email"
                    required
                    {...register("email", { required: true })}
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
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      {...register("password", { required: true })}
                      className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>   
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {isLoading ? 'Connexion...' : 'Se connecter'}
                </button>
              </div>
            </form>
        </div>
      </div>
    </div>
  );
};

export default LoginLocal;