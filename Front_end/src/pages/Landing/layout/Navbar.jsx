import { useState } from 'react'
import { Link } from 'react-router-dom'
import ModalAuth from '../components/ModalAuth'
import { Boxes, Menu, X } from 'lucide-react'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [authTab, setAuthTab] = useState('login')

  const openLogin = () => {
    setAuthTab('login')
    setShowAuth(true)
  }

  const openRegister = () => {
    setAuthTab('register')
    setShowAuth(true)
  }

  return (
    <>
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5">
              
              <Boxes className="w-7 h-7 text-blue-600" />
              <span className="font-bold text-xl text-gray-900">Sygima</span>
            </Link>

            {/* Desktop */}
            <div className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-sm font-medium text-gray-600 hover:text-blue-600">
                Accueil
              </Link>
              <Link to="/features" className="text-sm font-medium text-gray-600 hover:text-blue-600">
                Fonctionnalités
              </Link>
              <Link to="/pricing" className="text-sm font-medium text-gray-600 hover:text-blue-600">
                Tarifs
              </Link>
              
              {/* Bouton connexion → ouvre modale */}
              <button
                onClick={openLogin}
                className="text-sm font-medium text-gray-600 hover:text-blue-600"
              >
                Se connecter
              </button>
              
              {/* Bouton inscription → ouvre modale */}
              <button
                onClick={openRegister}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
              >
                S'inscrire
              </button>
            </div>

            {/* Mobile burger */}
            <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 px-4 py-4 space-y-3">
            <Link to="/" className="block py-2 text-sm" onClick={() => setMobileOpen(false)}>Accueil</Link>
            <Link to="/features" className="block py-2 text-sm" onClick={() => setMobileOpen(false)}>Fonctionnalités</Link>
            <Link to="/pricing" className="block py-2 text-sm" onClick={() => setMobileOpen(false)}>Tarifs</Link>
            
            {/* Mobile : boutons modale */}
            <button onClick={() => { openLogin(); setMobileOpen(false) }} className="block w-full text-left py-2 text-sm">
              Se connecter
            </button>
            <button onClick={() => { openRegister(); setMobileOpen(false) }} className="block w-full text-center py-2 bg-blue-600 text-white rounded-lg text-sm">
              S'inscrire
            </button>
          </div>
        )}
      </nav>

      {/* Modale auth */}
      <ModalAuth 
        isOpen={showAuth} 
        onClose={() => setShowAuth(false)}
        defaultTab={authTab}
      />
    </>
  )
}