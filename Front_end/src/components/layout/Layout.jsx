import Navbar from './NavBar2'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Mail } from 'lucide-react'
import { NotificationProvider } from '../../context/NotificationContext'

export default function Layout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const handleLogout = () => setShowLogoutConfirm(true)
  const confirmLogout = () => {
    setShowLogoutConfirm(false)
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NotificationProvider userId={user.id}>
      
    
      {/* ═══ NAVBAR ═══════════════════════════════════ */}
      <Navbar onLogout={handleLogout} user={user} />
        {/* Reste de l'app */}
    </NotificationProvider>

      {/* ═══ CONTENU PRINCIPAL ════════════════════════ */}
      <main className="flex-1">
        {children}
      </main>

      {/* ═══ FOOTER ═══════════════════════════════════ */}
      <footer className="bg-gray-900 text-gray-400 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Colonne 1 : Logo + description */}
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-white font-bold text-lg mb-2">Sygima</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Système de gestion d'inventaire et de demandes de matériel. 
                Simplifiez le suivi de vos ressources.
              </p>
            </div>

            {/* Colonne 2 : Liens rapides */}
            <div>
              <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-3">
                Liens
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/dashboard" className="hover:text-white transition-colors">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/materiels" className="hover:text-white transition-colors">
                    Inventaire
                  </Link>
                </li>
                <li>
                  <Link to="/demandes" className="hover:text-white transition-colors">
                    Demandes
                  </Link>
                </li>
              </ul>
            </div>

          </div>

          {/* Ligne basse */}
          <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-600">
              © 2026 Sygima. Tous droits réservés.
            </p>
            <div className="flex items-center gap-4">
              <a href="mailto:contact@sygima.com" className="text-gray-500 hover:text-white transition-colors">
                <Mail className="w-4 h-4" />
              </a>
              {/* <a href="https://github.com/sygima" className="text-gray-500 hover:text-white transition-colors">
                <Github className="w-4 h-4" />
              </a> */}
            </div>
          </div>
        </div>
      </footer>

      {/* ═══ MODALE DÉCONNEXION ═══════════════════════ */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900">Confirmer la déconnexion</h3>
            <p className="text-gray-500 mt-2">Êtes-vous sûr de vouloir vous déconnecter ?</p>
            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
              >
                Annuler
              </button>
              <button 
                onClick={confirmLogout}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
              >
                Déconnecter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}