import { useState } from 'react';
import NotificationButton from '../NotificationButton';
import { 
  LayoutDashboard, 
  Package, 
  ClipboardList, 
  Settings, 
  LogOut,
  Boxes,
  Menu,
  X,
  ChevronDown,
  Building2,
  UsersIcon,
  HistoryIcon
} from 'lucide-react';
import { NavLink, useLocation, useNavigate } from "react-router-dom"
import logo from '../../../public/logo-sygima.png'

export default function Navbar({ onLogout, user }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const handleRegister = () => {
    navigate('/registerParDepartement')
  }

  // Navigation
  // ONGLETS DE NAVIGATION AVEC RÔLES
  // Navigation mobile
  const menuItems = [
    { 
      icon: LayoutDashboard, 
      label: 'Dashboard', 
      path: '/dashboard', 
      roles: ['ADMIN', 'RESPONSABLE', 'MAGASINIER', 'EMPLOYE']
    },
    { 
      icon: Building2, 
      label: 'Départements', 
      path: '/departements', 
      roles: ['ADMIN']
    },
    {
      icon: UsersIcon,
      label:"Users",
      path:"/GestionUser",
      roles:['ADMIN']
    },
    { 
      icon: Package, 
      label: 'Stock', 
      path: '/stock', 
      roles: ['RESPONSABLE','MAGASINIER']
    },
    {
      icon: Package, 
      label: 'Inventaire', 
      path: '/stockDepartement', 
      roles: ['RESPONSABLE', 'EMPLOYE']
    },
    { 
      icon: Package, 
      label: 'Stock', 
      path: '/StockAdmin', 
      roles: ['ADMIN']
    },
    { 
      icon: Package, 
      label: 'Inventaire', 
      path: '/StockDepartementAdmin', 
      roles: ['ADMIN']
    },
    {
      icon: Boxes, 
      label: 'Materiel', 
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
      roles: ['']
    },
    {
      icon:HistoryIcon,
      label:"Historique",
      path:"/Historique",
      roles:['ADMIN','RESPONSABLE','EMPLOYE']
    }
  ];

  // Filtrer les menus selon le rôle de l'utilisateur
  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(user?.role)
  );
  const isAdmin = user?.role?.toUpperCase?.() === 'ADMIN';

  const dashboardItem = filteredMenuItems.find(item => item.path === '/dashboard');
  const navigationGroups = [
    {
      id: 'organisation',
      label: 'Organisation',
      icon: Building2,
      paths: ['/departements', '/GestionUser'],
    },
    {
      id: 'materiel',
      label: 'Matériel et stock',
      icon: Package,
      paths: ['/stock', '/StockAdmin', '/stockDepartement', '/StockDepartementAdmin', '/materiels', '/MaterielAdmin'],
    },
    {
      id: 'demandes',
      label: 'Demandes',
      icon: ClipboardList,
      paths: ['/demandes'],
    },
    {
      id: 'historique',
      label: 'Historique',
      icon: HistoryIcon,
      paths: ['/Historique'],
    },
  ].map(group => ({
    ...group,
    items: filteredMenuItems.filter(item => group.paths.includes(item.path)),
  })).filter(group => group.items.length > 0);

  // Filtrage par rôle
  // BADGE COULEUR SELON RÔLE
  // Couleur du rôle
  const roleBadgeColor = {
    admin: "bg-red-500/20 text-red-300 border-red-500/30",
    responsable: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    magasinier: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    employe: " text-[#58B2B0] border-[#58B2B0]/30",
  }

  const roleLabel = {
    admin: "Admin",
    responsable: "Responsable",
    magasinier: "Magasinier",
    employe: "Employé",
  }

  return (
    <nav className="bg-gray-900 text-white sticky top-0 z-50">
      <div className="mx-auto max-w-7xl overflow-visible px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 min-w-0 items-center justify-between gap-3">
          
          {/* Logo + Liens desktop */}
          <div className="flex min-w-0 flex-1 items-center gap-3 lg:gap-5">
            {/* Logo */}
            <div className="flex shrink-0 cursor-pointer items-center gap-2.5" onClick={() => navigate('/dashboard')}>
              <img src={logo} alt="Logo" className="w-7 h-7" />
              <span className="font-bold text-lg tracking-tight">SYGIMA</span>
            </div>

            {/* Navigation desktop (selon rôle) */}
            <div className="hidden min-w-0 flex-1 items-center justify-center gap-3 md:flex">
              {isAdmin ? <>
                {dashboardItem && (
                <NavLink
                  to={dashboardItem.path}
                  className={({ isActive }) => `flex h-9 shrink-0 items-center gap-1.5 rounded-lg px-2 text-sm font-medium transition-colors ${isActive ? 'bg-[#58B2B0] text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                >
                  <dashboardItem.icon className="h-4 w-4" />
                  {dashboardItem.label}
                </NavLink>
                )}
              {navigationGroups.map(group => {
                const GroupIcon = group.icon;
                const isActive = group.items.some(item => item.path === location.pathname);
                return (
                  <div key={group.id} className="relative">
                    <button
                      type="button"
                      onClick={() => setOpenGroup(openGroup === group.id ? null : group.id)}
                      className={`flex h-9 shrink-0 items-center gap-1.5 rounded-lg px-2 text-sm font-medium transition-colors ${isActive ? 'bg-[#58B2B0] text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                    >
                      <GroupIcon className="h-4 w-4" />
                      {group.label}
                      <ChevronDown className={`h-3.5 w-3.5 transition-transform ${openGroup === group.id ? 'rotate-180' : ''}`} />
                    </button>
                    {openGroup === group.id && (
                      <div className="absolute left-0 top-full z-50 mt-2 min-w-48 rounded-lg border border-gray-700 bg-gray-900 p-1 shadow-xl">
                        {group.items.map(item => (
                          <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={() => setOpenGroup(null)}
                            className={({ isActive: itemActive }) => `flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${itemActive ? 'bg-[#58B2B0] text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
                          >
                            <item.icon className="h-4 w-4" />
                            {item.label}
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              </> : filteredMenuItems.map(item => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive ? 'bg-[#58B2B0] text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Droite : Profil + Déconnexion */}
          <div className="hidden shrink-0 items-center gap-2 lg:gap-3 md:flex">
            {/* Bouton Ajouter utilisateur (admin only) */}
            {(user?.role?.toUpperCase?.() === 'ADMIN') &&(
              <>
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
              
              </>
            )}
            <NotificationButton/>
            {/* Infos utilisateur avec badge rôle */}
            <div className="flex min-w-0 items-center gap-2 xl:gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold">
                {user?.prenom?.[0] || user?.nom?.[0] || 'U'}
              </div>
              <div className="hidden min-w-0 text-sm xl:block xl:max-w-36">
                <p className="truncate font-medium text-white">{user?.prenom} {user?.nom}</p>
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
            {isAdmin ? <>
            {dashboardItem && (
              <NavLink to={dashboardItem.path} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white">
                <dashboardItem.icon className="h-5 w-5" />
                {dashboardItem.label}
              </NavLink>
            )}
            {navigationGroups.map(group => {
              const GroupIcon = group.icon;
              return (
                <div key={group.id} className="border-b border-gray-800 py-1 last:border-b-0">
                  <p className="flex items-center gap-3 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    <GroupIcon className="h-4 w-4" />
                    {group.label}
                  </p>
                  {group.items.map(item => (
                    <NavLink key={item.path} to={item.path} onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${isActive ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                      <item.icon className="h-5 w-5" />
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              );
            })}
            </> : filteredMenuItems.map(item => (
              <NavLink key={item.path} to={item.path} onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${isActive ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                <item.icon className="h-5 w-5" />
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