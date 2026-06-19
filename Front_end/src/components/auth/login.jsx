import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../context/AuthContext'
import { useNavigate, Link,useLocation } from 'react-router-dom'
import { Eye, EyeOff, Boxes, ArrowRight, Loader2 } from 'lucide-react'

export default function Login({ inModal = false }) {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { login, error } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const fromModal = location.state?.fromModal || false
  
  // Si inModal prop OU fromModal state
  const isModal = inModal || fromModal
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
    <div className={`${inModal ? '' : 'min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30 px-4 py-8'} `}>
      <div className={`w-full max-w-lg ${inModal ? '' : 'mx-auto'} `}>
      <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8">
        {/* Logo seulement si pas en modale */}
        {!inModal && (
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <Boxes className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Sygima</h1>
          </div>
        )}

        {/* Titre en modale */}
        {inModal && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">Bon retour !</h2>
            <p className="text-sm text-gray-500">Connectez-vous à votre compte.</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email — plus compact */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              {...register('email', { required: 'Requis' })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              placeholder="vous@exemple.com"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password', { required: 'Requis' })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 pr-10"
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

          {/* Bouton */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
          >
            {isLoading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
        <div>
        {/* Lien vers register */}
        <p className="text-center text-sm text-gray-500 mt-4">
          Pas de compte ?{' '}
          <span className="text-blue-600 font-medium cursor-pointer hover:underline">
            S'inscrire
          </span>
        </p>
          {/* Footer */}
          <p className="text-center text-gray-400 text-xs mt-8">
            Tous droits réservés
          </p>
        </div>
      </div>
      </div>
    </div>
  )
}