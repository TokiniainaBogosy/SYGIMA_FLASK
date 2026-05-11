import { useState, useEffect } from 'react' // Importé useEffect
import { useForm } from 'react-hook-form'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import axios from 'axios' // NE PAS OUBLIER L'IMPORT D'AXIOS

// Constantes de validation
const REGEX_EMAIL = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
const REGEX_NAME = /[A-ZÀ-ÿ][a-zà-ÿ' -]+$/

export default function RegisterParDepartement() {
  const [departements, setDepartements] = useState([])
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingDeps, setIsLoadingDeps] = useState(true) // AJOUTÉ : État pour le chargement des départements
  
  const { registerAuth, error } = useAuth()
  const navigate = useNavigate()
  
  useEffect(() => {
    const fetchDepartements = async () => {
      try {
        // 1. Récupérer le token
        const token = localStorage.getItem('token');
        // 2. Envoyer la requête avec le header Authorization
        const response = await axios.get('http://127.0.0.1:8000/departement/', {
        headers: {
          Authorization: `Bearer ${token}`
        }});
        setDepartements(response.data) 
      } catch (err) {
        console.error("Impossible de charger les départements", err)
      } finally {
        setIsLoadingDeps(false) // Maintenant défini
      }
    }
    fetchDepartements()
  }, [])

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const password = watch('password')

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      // CORRECTION : On utilise data.departement_id (le nom mis dans register)
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
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 backdrop-blur-lg border border-white/60 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        
        {/* Titre & Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gray-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-white text-2xl font-bold">SG</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-600">SYGIMA</h1>
          <p className="text-gray-500 text-sm mt-1">Système de Gestion d'Inventaire</p>
        </div>

        {/* Message d'erreur avec sécurité pour ne pas crash si error est un objet */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
            {typeof error === 'object' ? "Erreur de validation. Vérifiez les champs." : error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* Departement Dynamique */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Departement
            </label>
            <select
              {...register('departement_id', { required: 'Le département est requis' })}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                errors.departement_id ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={isLoading || isLoadingDeps}
            >
              <option value="">-- Choisissez un département --</option>
              {departements.map((dep) => (
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
            <select
              {...register('role', { required: 'Le rôle est requis' })}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                errors.role ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={isLoading}
            >
              <option value="">-- Choisissez un rôle --</option>
              <option value="Admin">Admin</option>
              <option value="Responsable">Responsable</option>
              <option value="Magasinier">Magasinier</option>
              <option value="Employe">Employe</option>
            </select>
            {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              {...register('email', { 
                required: "L'email est requis", 
                pattern: { value: REGEX_EMAIL, message: "Email invalide" } 
              })}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
              <input
                type="text"
                {...register('prenom', { required: "Requis" })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password', { required: "Requis", minLength: { value: 6, message: "6 caractères min." } })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-gray-400">
                {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Bouton */}
          <button
            type="submit"
            disabled={isLoading || isLoadingDeps}
            className="w-full py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition disabled:opacity-50"
          >
            {isLoading ? 'Inscription...' : "S'inscrire"}
          </button>
        </form>
      </div>
    </div>
  )
}