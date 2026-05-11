import { useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { useAuth } from '../../context/AuthContext'

function Navbar() {
  const [active, setActive] = useState("accueil")
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleRegister = () => {
    navigate('/register')
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ICÔNES SVG INLINE (remplacent les emojis)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const icons = {
    dashBoard: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z" />
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
    stock: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    demandes: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    departements: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    utilisateurs: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  }

  // ━━━━━━━━━━━━━━━━━━━━━━
  // ONGLETS DE NAVIGATION
  // ━━━━━━━━━━━━━━━━━━━━━━
  const onglets = [
    {
      id: "dashBoard", label: "Dashboard", path: '/dashboard',
      roles: ['Admin', 'Responsable', 'Magasinier', 'Employe']
    },
    {
      id: "materiels", label: "Materiels", path: '/materiels',
      roles: ['Magasinier']
    },
    {
      id: "stock", label: "Stock", path: '/Stock',
      roles: ['Magasinier', 'Responsable']
    },
    {
      id: "demandes", label: "Demandes", path: '/demandes',
      roles: ['Responsable', 'Magasinier', 'Employe']
    },
    {
      id: "departements", label: "Départements", path: '/departements',
      roles: ['Admin']
    },
    {
      id: "utilisateurs", label: "Utilisateurs", path: '/utilisateur',
      roles: ['Admin']
    }
  ]

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
    <div className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gray-400 backdrop-blur-lg border border-white/10 rounded-2xl px-3 py-2 flex items-center justify-between shadow-2xl shadow-black/20">

          {/* ══════════════════════════════ */}
          {/*       SECTION GAUCHE          */}
          {/* ══════════════════════════════ */}
          <div className="flex items-center gap-3 min-w-[180px]">

            {/* Avatar avec initiale */}
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-500/25">
                {user?.prenom?.charAt(0)?.toUpperCase() || "U"}
              </div>
              {/* Pastille verte "en ligne" */}
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-gray-900" />
            </div>

            {/* Nom + rôle */}
            <div className="hidden sm:flex flex-col">
              <span className="text-white text-sm font-semibold leading-tight">
                {user?.prenom || "Utilisateur"}
              </span>
              <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md border w-fit mt-0.5 ${roleBadgeColor[user?.role] || "bg-white/10 text-white/50 border-white/20"}`}>
                {roleLabel[user?.role] || user?.role}
              </span>
            </div>
          </div>

          {/* ══════════════════════════════ */}
          {/*       NAVIGATION CENTRE       */}
          {/* ══════════════════════════════ */}
          <nav className="flex items-center gap-1 bg-white/5 rounded-xl p-1">
            {onglets
              .filter(item => item.roles.includes(user?.role))
              .map((onglet) => (
                <NavLink
                  key={onglet.id}
                  to={onglet.path}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-2 px-4 py-2 rounded-lg
                     transition-all duration-300 text-sm font-medium
                     ${isActive
                      ? "bg-white text-gray-900 shadow-lg shadow-white/10"
                      : "text-white/50 hover:text-white hover:bg-white/10"
                    }`
                  }
                >
                  {/* Icône SVG */}
                  <span className="transition-transform duration-200 group-hover:scale-110">
                    {icons[onglet.id]}
                  </span>

                  {/* Label (caché sur petits écrans) */}
                  <span className="hidden md:inline">{onglet.label}</span>
                </NavLink>
              ))}
          </nav>

          {/* ══════════════════════════════ */}
          {/*       SECTION DROITE          */}
          {/* ══════════════════════════════ */}
          <div className="flex items-center gap-2 min-w-[180px] justify-end">

            {/* Bouton Ajouter utilisateur (admin only) */}
            {user?.role === 'Admin' && (
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

            {/* Séparateur vertical */}
            <div className="w-px h-6 bg-white/10 mx-1" />

            {/* Bouton Déconnexion */}
            <button
              onClick={handleLogout}
              className="group flex items-center gap-2 px-3 py-2 rounded-xl
                         text-white/50 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20
                         transition-all duration-300 text-sm font-medium"
              title="Se déconnecter"
            >
              <svg
                className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden lg:inline">Déconnexion</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar