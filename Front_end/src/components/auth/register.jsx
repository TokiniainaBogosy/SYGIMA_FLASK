import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, Link } from 'react-router-dom'
import { 
  Building2, Hash, MapPin, Image as ImageIcon, 
  ArrowRight, Loader2, Boxes, User, Mail, Lock, Eye, EyeOff, ChevronLeft 
} from 'lucide-react'
import { useApi } from '../../hooks/useApi'  // ✅ import

const REGEX_EMAIL = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i

export default function RegisterEntreprise({ inModal = false }) {
  const [step, setStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [enterpriseData, setEnterpriseData] = useState(null)
  
  const navigate = useNavigate()

  // ✅ Remplace useState(isLoading) + fetch manuel
  const { post, loading, error } = useApi()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const password = watch('password')

  const onStepOneSubmit = (data) => {
    setEnterpriseData(data)
    setStep(2)
  }

  const onFinalSubmit = async (adminData) => {
    const fullPayload = {
      entreprise: {
        nom: enterpriseData.nom,
        code: enterpriseData.code,
        adresse: enterpriseData.adresse,
        logo_url: enterpriseData.logo_url || null
      },
      admin: {
        nom: adminData.adminNom,
        prenom: adminData.adminPrenom,
        email: adminData.adminEmail,
        password: adminData.password,
        role: 'Admin'
      }
    }

    try {
      // ✅ Remplace le fetch POST manuel
      await post('/entreprises/setup-entreprise', fullPayload)
      navigate('/dashboard')
    } catch (e) {
      // L'erreur est déjà stockée dans `error` par le hook
      alert(error || e.message)
    }
  }

  return (
    <div className={`${inModal ? '' : 'min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30 px-4 py-8'} rounded-2xl`}>
      <div className={`w-full max-w-lg ${inModal ? '' : 'mx-auto'}`}>
        
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8">
          
          {/* Logo & Titre */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-blue-600/20">
              {step === 1 ? <Boxes className="w-8 h-8 text-white" /> : <User className="w-8 h-8 text-white" />}
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              {step === 1 ? "Créer une entreprise" : "Compte Administrateur"}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {step === 1 ? "Informations sur votre structure" : "Identifiants du gestionnaire principal"}
            </p>
          </div>

          <form onSubmit={step === 1 ? handleSubmit(onStepOneSubmit) : handleSubmit(onFinalSubmit)} className="space-y-5">

            {/* ÉTAPE 1 : CHAMPS ENTREPRISE */}
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-gray-400" /> Nom
                  </label>
                  <input
                    {...register('nom', { required: 'Nom requis' })}
                    className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm ${errors.nom ? 'border-red-300 bg-red-50/50' : 'border-gray-200'}`}
                    placeholder="ex: ASECNA Madagascar"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                    <Hash className="w-3.5 h-3.5 text-gray-400" /> Code Identifiant
                  </label>
                  <input
                    {...register('code', { required: 'Code requis' })}
                    className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm ${errors.code ? 'border-red-300 bg-red-50/50' : 'border-gray-200'}`}
                    placeholder="ex: ASECNA-MG"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" /> Adresse
                  </label>
                  <input
                    {...register('adresse')}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                    placeholder="Antananarivo, Madagascar"
                  />
                </div>
              </div>
            )}

            {/* ÉTAPE 2 : CHAMPS ADMIN */}
            {step === 2 && (
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Nom Admin</label>
                    <input
                      {...register('adminNom', { required: 'Requis' })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm"
                      placeholder="Dupont"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Prénom Admin</label>
                    <input
                      {...register('adminPrenom', { required: 'Requis' })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm"
                      placeholder="Jean"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-gray-400" /> Email Admin
                  </label>
                  <input
                    type="email"
                    {...register('adminEmail', { 
                      required: "Requis", 
                      pattern: { value: REGEX_EMAIL, message: "Email invalide" } 
                    })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm"
                    placeholder="admin@asecna.mg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-gray-400" /> Mot de passe
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      {...register('password', { required: "Requis", minLength: { value: 6, message: "6 car. min" } })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm pr-10"
                      placeholder="••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                    >
                      {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Boutons */}
            <div className="flex flex-col gap-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 group"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    {step === 1 ? "Continuer vers l'admin" : "Finaliser la création"}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>

              {step === 2 && (
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full py-2 text-sm text-gray-500 hover:text-gray-700 flex items-center justify-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" /> Retour à l'entreprise
                </button>
              )}
            </div>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white text-gray-400">Sygima Management</span>
            </div>
          </div>

          <p className="text-center text-sm">
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
              Se connecter à un compte existant
            </Link>
          </p>
        </div>

        <p className="text-center text-gray-400 text-xs mt-6">
          © 2026 ASECNA Madagascar — Système de Gestion Intégré
        </p>
      </div>
    </div>
  )
}