import { useState } from 'react'
import { X } from 'lucide-react'
import Login from '../../../components/auth/login'
import Register from '../../../components/auth/register'
export default function ModalAuth({ isOpen, onClose, defaultTab = 'login' }) {
  const [activeTab, setActiveTab] = useState(defaultTab)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Fond flouté */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Contenu — PLUS LARGE, pas de scroll interne */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-auto">
        
        {/* Bouton fermer */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Layout horizontal : tabs à gauche, formulaire à droite */}
        <div className="flex min-h-0">
          
          {/* Sidebar gauche avec tabs */}
          <div className="w-1/3 bg-gray-50 rounded-l-2xl p-6 flex flex-col justify-center">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Sygima</h3>
            <p className="text-sm text-gray-500 mb-8">Gérez votre inventaire efficacement.</p>
            
            <div className="space-y-2">
              <button
                onClick={() => setActiveTab('login')}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === 'login'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Connexion
              </button>
              <button
                onClick={() => setActiveTab('register')}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === 'register'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Créer un compte
              </button>
            </div>
          </div>

          {/* Formulaire à droite */}
          <div className="w-2/3 p-8 flex items-center">
            {activeTab === 'login' ? (
              <Login inModal={true} />
            ) : (
              <Register inModal={true} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}