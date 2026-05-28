import { useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ClipboardList, 
  Settings, 
  LogOut,
  Boxes,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';
import { NavLink, useNavigate } from "react-router-dom"

export default function Navbar({ onLogout, user }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const handleRegister = () => {
    navigate('/registerParDepartement')
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ONGLETS DE NAVIGATION AVEC RÔLES
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const menuItems = [
    { 
      icon: LayoutDashboard, 
      label: 'Dashboard', 
      path: '/dashboard', 
    roles: ['ADMIN', 'RESPONSABLE', 'MAGASINIER', 'EMPLOYE']
    },
    { 
      icon: Package, 
      label: 'Stock', 
      path: '/stock', 
      roles: ['RESPONSABLE', 'MAGASINIER']
    },
    { 
      icon: Package, 
      label: 'StockAdmin', 
      path: '/StockAdmin', 
      roles: ['ADMIN']
    },
    {
      icon: Boxes, 
      label: 'MaterielAdmin', 
      path: '/MaterielAdmin', 
      roles: ['ADMIN']
    },
    { 
      icon: Boxes, 
      label: 'Matériels', 
      path: '/materiels', 
      roles: ['RESPONSABLE','MAGASINIER']
    },
    { 
      icon: ClipboardList, 
      label: 'Demandes', 
      path: '/demandes', 
      roles: ['ADMIN', 'RESPONSABLE', 'MAGASINIER', 'EMPLOYE']
    },
    { 
      icon: Settings, 
      label: 'Paramètres', 
      path: '/parametres', 
      roles: ['ADMIN']
    },
    { 
      icon: Settings, 
      label: 'Départements', 
      path: '/departements', 
      roles: ['ADMIN']
    }
    
  ];

  // Filtrer les menus selon le rôle de l'utilisateur
  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(user?.role)
  );

  // ━━━━━━━━━━━━━━━━━━━━━━━━━
  // BADGE COULEUR SELON RÔLE
  // ━━━━━━━━━━━━━━━━━━━━━━━━━
  const roleBadgeColor = {
    admin: "bg-red-500/20 text-red-300 border-red-500/30",
    responsable: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    magasinier: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    employe: "bg-green-500/20 text-green-300 border-green-500/30",
  }

  const roleLabel = {
    admin: "Admin",
    responsable: "Responsable",
    magasinier: "Magasinier",
    employe: "Employé",
  }

  return (
    <nav className="bg-gray-900 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo + Liens desktop */}
          <div className="flex items-center gap-8">
            {/* Logo */}
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/dashboard')}>
              <Boxes className="w-7 h-7 text-blue-400" />
              <span className="font-bold text-lg tracking-tight">SYGIMA</span>
            </div>

            {/* Navigation desktop (selon rôle) */}
            <div className="hidden md:flex items-center gap-1">
              {filteredMenuItems.map((item, i) => (
                <NavLink
                  key={i}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                     ${isActive
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    }`
                  }
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Droite : Profil + Déconnexion */}
          <div className="hidden md:flex items-center gap-4">
            {/* Bouton Ajouter utilisateur (admin only) */}
            {user?.role === 'ADMIN' && (
              <button
                onClick={handleRegister}
                className="group w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/30
                           flex items-center justify-center
                           hover:bg-indigo-500 hover:border-indigo-400 hover:shadow-lg hover:shadow-indigo-500/25
                           transition-all duration-300"
                title="Ajouter un utilisateur"
              >
                <svg
                  className="w-4 h-4 text-indigo-300 group-hover:text-white transition-colors"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </button>
            )}
            {/* Infos utilisateur avec badge rôle */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold">
                {user?.prenom?.[0] || user?.nom?.[0] || 'U'}
              </div>
              <div className="text-sm">
                <p className="font-medium text-white">{user?.prenom} {user?.nom}</p>
                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md border inline-block mt-0.5 ${roleBadgeColor[user?.role?.toLowerCase()] || "bg-white/10 text-white/50 border-white/20"}`}>
                  {roleLabel[user?.role?.toLowerCase()] || user?.role || 'Employé'}
                </span>
              </div>
            </div>
            
            <div className="h-6 w-px bg-gray-700" />
            
            <button
              onClick={onLogout}
              className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors text-sm font-medium"
            >
              <LogOut className="w-4 h-4" />
              Déconnexion
            </button>
          </div>

          {/* Bouton burger mobile */}
          <button
            className="md:hidden p-2 text-gray-400 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* MENU MOBILE (selon rôle aussi) */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-800 bg-gray-900">
          <div className="px-4 py-3 space-y-1">
            {filteredMenuItems.map((item, i) => (
              <NavLink
                key={i}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                   ${isActive
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </NavLink>
            ))}
            
            <div className="border-t border-gray-800 my-2 pt-2">
              {/* Infos user dans mobile */}
              <div className="flex items-center gap-3 px-3 py-2 mb-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold">
                  {user?.prenom?.[0] || 'U'}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{user?.prenom} {user?.nom}</p>
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md border inline-block ${roleBadgeColor[user?.role?.toLowerCase()] || "bg-white/10 text-white/50 border-white/20"}`}>
                    {roleLabel[user?.role?.toLowerCase()] || user?.role}
                  </span>
                </div>
              </div>
              
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLogout();
                }}
                className="flex items-center gap-3 px-3 py-2.5 text-red-400 hover:bg-red-500/10 rounded-lg text-sm font-medium w-full"
              >
                <LogOut className="w-5 h-5" />
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}