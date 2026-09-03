import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { useApi } from '../../hooks/useApi'
import { ArrowLeft, UserPlus, Loader2 } from 'lucide-react'

const REGEX_EMAIL = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
export default function RegisterParDepartement() {
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { registerAuth, error } = useAuth()
  const navigate = useNavigate()

  // Chargement automatique des départements
  const { data: departements, loading: isLoadingDeps } = useApi('/departement/')

  // Soumission du formulaire
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const password = watch('password')

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      await registerAuth(
        data.email,
        data.nom,
        data.prenom,
        data.password,
        data.role,
        data.departement_id
      )
      navigate('/dashboard')
    } catch (error) {
      // Erreur gérée par le context
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f4f7f8] px-4 py-8 sm:py-12">
      <div className="mx-auto w-full max-w-lg">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-[#0D3056]"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour
        </button>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        
        {/* Titre & Logo */}
        <div className="mb-8 flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0D3056]">
            <UserPlus className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#58B2B0]">Administration</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#0D3056]">Créer un compte</h1>
            <p className="mt-1 text-sm text-gray-500">Ajoutez un utilisateur à un département.</p>
          </div>
        </div>

        {/* Message d'erreur avec sécurité pour ne pas crash si error est un objet */}
        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {typeof error === 'object' ? "Erreur de validation. Vérifiez les champs." : error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* Departement Dynamique */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Departement
            </label>
            <select
              {...register('departement_id', { required: 'Le département est requis' })}
              className={`w-full rounded-lg border bg-gray-50 px-4 py-2.5 text-sm text-gray-900 focus:border-[#58B2B0] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#58B2B0]/20 ${
                errors.departement_id ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={isSubmitting || isLoadingDeps}
            >
              <option value="">-- Choisissez un département --</option>
              {(departements || []).map((dep) => (
                <option key={dep.id} value={dep.id}>
                  {dep.nom}
                </option>
              ))}
            </select>
            {errors.departement_id && (
              <p className="text-red-500 text-sm mt-1">{errors.departement_id.message}</p>
            )}
          </div>

          {/* Role */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Rôle</label>
            <select
              {...register('role', { required: 'Le rôle est requis' })}
              className={`w-full rounded-lg border bg-gray-50 px-4 py-2.5 text-sm text-gray-900 focus:border-[#58B2B0] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#58B2B0]/20 ${
                errors.role ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={isSubmitting}
            >
              <option value="">-- Choisissez un rôle --</option>
              <option value="Admin">Admin</option>
              <option value="Responsable">Responsable</option>
              <option value="Employe">Employe</option>
            </select>
            {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              {...register('email', { 
                required: "L'email est requis", 
                pattern: { value: REGEX_EMAIL, message: "Email invalide" } 
              })}
              className={`w-full rounded-lg border bg-gray-50 px-4 py-2.5 text-sm text-gray-900 focus:border-[#58B2B0] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#58B2B0]/20 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="votre.email@asecna.mg"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          {/* Nom & Prénom (version compacte) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
              <input
                type="text"
                {...register('nom', { required: "Requis" })}
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 focus:border-[#58B2B0] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#58B2B0]/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
              <input
                type="text"
                {...register('prenom', { required: "Requis" })}
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 focus:border-[#58B2B0] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#58B2B0]/20"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Mot de passe</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password', { required: "Requis", minLength: { value: 6, message: "6 caractères min." } })}
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 pr-11 text-sm text-gray-900 focus:border-[#58B2B0] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#58B2B0]/20"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0D3056]" aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}>
                {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Bouton */}
          <button
            type="submit"
            disabled={isSubmitting || isLoadingDeps}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#0D3056] px-4 text-sm font-semibold text-white transition hover:bg-[#1e4e7e] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isSubmitting ? 'Création en cours...' : 'Créer le compte'}
          </button>
        </form>
      </div>
      </div>
    </div>
  )
}