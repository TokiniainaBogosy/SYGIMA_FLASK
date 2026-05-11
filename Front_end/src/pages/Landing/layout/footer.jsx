import { Link } from 'react-router-dom'
import { Boxes, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Boxes className="w-6 h-6 text-blue-500" />
              <span className="text-white font-bold text-lg">Sygima</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
              Solution complète de gestion d'inventaire et de demandes de matériel pour les entreprises modernes.
            </p>
          </div>

          {/* Liens */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Produit</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/features" className="hover:text-white transition-colors">Fonctionnalités</Link></li>
              <li><Link to="/pricing" className="hover:text-white transition-colors">Tarifs</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Connexion</Link></li>
            </ul>
          </div>

          {/* Légal */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Légal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/conditions" className="hover:text-white transition-colors">Conditions d'utilisation</Link></li>
              <li><Link to="/confidentialite" className="hover:text-white transition-colors">Confidentialité</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-600">© 2026 Sygima. Tous droits réservés.</p>
          <div className="flex items-center gap-4">
            <a href="mailto:contact@sygima.com" className="hover:text-white transition-colors"><Mail className="w-4 h-4" /></a>
            {/* <a href="#" className="hover:text-white transition-colors"><Github className="w-4 h-4" /></a> */}
            {/* <a href="#" className="hover:text-white transition-colors"><Linkedin className="w-4 h-4" /></a> */}
          </div>
        </div>
      </div>
    </footer>
  )
}