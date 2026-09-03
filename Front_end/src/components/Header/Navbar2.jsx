import React, { useState } from 'react'
import { NavLink, useNavigate } from "react-router-dom"
import { useAuth } from '../../context/AuthContext'

const Navbar2 = () => {
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
    
      // Navigation
      // ICÔNES SVG INLINE (remplacent les emojis)
      // Navigation mobile
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
    
      // Menu
      // ONGLETS DE NAVIGATION
      // Menu utilisateur
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
      },
      {
        id: "materielAdmin", label: "MaterielAdmin", path: '/MaterielAdmin',
        roles: ['Admin']
      }

    ]
    
      // Filtrage par rôle
      // BADGE COULEUR SELON RÔLE
      // Couleur du rôle
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
    <div>
        <nav class="bg-white px-6 md:px-12 lg:px-24 xl:px-40 py-4 flex items-center justify-between relative">
            <a href="https://prebuiltui.com">
                <svg width="151" height="36" viewBox="0 0 151 36" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M38.786 14.72q.696-.912 1.896-1.536t2.712-.624q1.728 0 3.144.864 1.44.84 2.256 2.376t.816 3.528-.816 3.576q-.816 1.56-2.256 2.448-1.416.864-3.144.864-1.512 0-2.688-.6-1.176-.624-1.92-1.536v8.208H36.05V12.776h2.736zm8.04 4.608q0-1.368-.576-2.352-.552-1.008-1.488-1.512a3.86 3.86 0 0 0-1.968-.528q-1.032 0-1.968.528-.912.528-1.488 1.536-.552 1.008-.552 2.376t.552 2.4q.576 1.008 1.488 1.536.936.528 1.968.528 1.056 0 1.968-.528.936-.552 1.488-1.584.576-1.032.576-2.4m8.226-4.632q.6-1.008 1.584-1.56 1.008-.576 2.376-.576v2.832h-.696q-1.608 0-2.448.816-.816.816-.816 2.832V26h-2.736V12.776h2.736zm18.595 4.368q0 .744-.096 1.344H63.447q.12 1.584 1.176 2.544t2.592.96q2.208 0 3.12-1.848h2.952q-.6 1.824-2.184 3-1.56 1.152-3.888 1.152-1.896 0-3.408-.84a6.3 6.3 0 0 1-2.352-2.4q-.84-1.56-.84-3.6t.816-3.576q.84-1.56 2.328-2.4 1.512-.84 3.456-.84q1.872 0 3.336.816a5.75 5.75 0 0 1 2.28 2.304q.816 1.464.816 3.384M70.79 18.2q-.024-1.512-1.08-2.424t-2.616-.912q-1.416 0-2.424.912-1.008.888-1.2 2.424zm8.284-3.456q.696-.96 1.896-1.56 1.224-.624 2.712-.624 1.752 0 3.168.84t2.232 2.4q.816 1.536.816 3.528t-.816 3.576q-.816 1.56-2.256 2.448-1.416.864-3.144.864-1.536 0-2.736-.6-1.176-.6-1.872-1.536V26H76.34V8.24h2.736zm8.04 4.584q0-1.368-.576-2.352-.552-1.008-1.488-1.512a3.86 3.86 0 0 0-1.968-.528q-1.032 0-1.968.528-.912.528-1.488 1.536-.552 1.008-.552 2.376t.552 2.4q.576 1.008 1.488 1.536.936.528 1.968.528 1.056 0 1.968-.528.936-.552 1.488-1.584.576-1.032.576-2.4m17.466-6.552V26h-2.736v-1.56q-.648.816-1.704 1.296a5.4 5.4 0 0 1-2.208.456q-1.56 0-2.808-.648-1.224-.648-1.944-1.92-.696-1.272-.696-3.072v-7.776h2.712v7.368q0 1.776.888 2.736.888.936 2.424.936t2.424-.936q.912-.96.912-2.736v-7.368zm5.002-1.752q-.744 0-1.248-.504a1.7 1.7 0 0 1-.504-1.248q0-.744.504-1.248a1.7 1.7 0 0 1 1.248-.504q.72 0 1.224.504t.504 1.248-.504 1.248a1.67 1.67 0 0 1-1.224.504m1.344 1.752V26h-2.736V12.776zm6.328-4.536V26h-2.736V8.24zm6.784 6.768v7.32q0 .744.336 1.08.36.312 1.2.312h1.68V26h-2.16q-1.848 0-2.832-.864t-.984-2.808v-7.32h-1.56v-2.232h1.56V9.488h2.76v3.288h3.216v2.232zm17.714-2.232V26h-2.736v-1.56q-.648.816-1.704 1.296a5.4 5.4 0 0 1-2.208.456q-1.56 0-2.808-.648-1.224-.648-1.944-1.92-.696-1.272-.696-3.072v-7.776h2.712v7.368q0 1.776.888 2.736.888.936 2.424.936t2.424-.936q.912-.96.912-2.736v-7.368zm5.002-1.752q-.744 0-1.248-.504a1.7 1.7 0 0 1-.504-1.248q0-.744.504-1.248a1.7 1.7 0 0 1 1.248-.504q.72 0 1.224.504t.504 1.248-.504 1.248a1.67 1.67 0 0 1-1.224.504m1.344 1.752V26h-2.736V12.776z" fill="#000" /><path d="m7.25 10.86 6 3.366 6-3.367m-12 20.176v-6.721l-6-3.367m24 0-6 3.367v6.72M1.61 14.42l11.64 6.54 11.64-6.54M13.25 34V20.947m12 5.18v-10.36c0-.454-.124-.9-.358-1.293a2.63 2.63 0 0 0-.975-.947l-9.333-5.18a2.73 2.73 0 0 0-2.667 0l-9.333 5.18a2.63 2.63 0 0 0-.976.947 2.54 2.54 0 0 0-.358 1.293v10.36c0 .454.124.9.358 1.293s.57.72.976.947l9.333 5.18a2.73 2.73 0 0 0 2.667 0l9.333-5.18a2.63 2.63 0 0 0 .975-.947 2.53 2.53 0 0 0 .358-1.293" stroke="#000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" /></svg>
            </a>
            <div class="hidden md:flex items-center bg-zinc-50 border border-zinc-200 rounded-full px-1 py-1 gap-2">
            {onglets
              .filter(item => item.roles.includes(user?.role))
              .map((onglet) => (
                <NavLink
                  key={onglet.id}
                  to={onglet.path}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-1.5 rounded-full text-sm transition-colors
                     ${isActive
                      ? "bg-white border border-zinc-200 font-medium text-zinc-800 hover:text-zinc-600"
                      : "text-zinc-500 hover:text-zinc-400"
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
            </div>
            
           


            <button class="hidden md:flex items-center gap-2.5 bg-linear-to-r from-zinc-950 to-zinc-500 text-zinc-50 hover:text-zinc-200 text-sm font-medium pl-5 pr-2 py-2 rounded-full cursor-pointer border-0">
                Get started
                <span class="w-7 h-7 rounded-full bg-white flex items-center justify-center">
                    <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M.6 4.602h10m-4-4 4 4-4 4" stroke="#3f3f47" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </span>
            </button>

            <button id="hamburger" onclick="toggleMenu()" class="md:hidden flex flex-col gap-1.5 cursor-pointer bg-transparent border-0 p-1">
                <span id="bar1" class="block w-6 h-0.5 bg-zinc-800 transition-transform"></span>
                <span id="bar2" class="block w-6 h-0.5 bg-zinc-800 transition-opacity"></span>
                <span id="bar3" class="block w-6 h-0.5 bg-zinc-800 transition-transform"></span>
            </button>

        
            <div id="mobileMenu" class="hidden absolute top-full left-0 w-full bg-white border-t border-zinc-200 flex-col p-5 gap-1 md:hidden z-50">
                <a href="#" class="block px-4 py-2.5 rounded-lg text-sm bg-zinc-50 font-medium text-zinc-800">Products</a>
                <a href="#" class="block px-4 py-2.5 rounded-lg text-sm text-zinc-500 hover:bg-zinc-50">Services</a>
                <a href="#" class="block px-4 py-2.5 rounded-lg text-sm text-zinc-500 hover:bg-zinc-50">Apps</a>
                <a href="#" class="block px-4 py-2.5 rounded-lg text-sm text-zinc-500 hover:bg-zinc-50">Pricing</a>
                <a href="#" class="block px-4 py-2.5 rounded-lg text-sm text-zinc-500 hover:bg-zinc-50">About</a>
                <button class="flex items-center justify-center gap-2.5 bg-linear-to-r from-zinc-950 to-zinc-500 text-zinc-50 text-sm font-medium px-5 py-2.5 rounded-full cursor-pointer border-0 mt-3 w-fit">
                    Get started
                    <span class="w-7 h-7 rounded-full bg-white flex items-center justify-center">
                        <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M.6 4.602h10m-4-4 4 4-4 4" stroke="#3f3f47" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </span>
                </button>
            </div>
        </nav>
        <div
          className={`${
            isApplicationMenuOpen ? "flex" : "hidden"
          } items-center justify-between w-full gap-4 px-5 py-4 lg:flex shadow-theme-md lg:justify-end lg:px-0 lg:shadow-none`}
        >
          <div className="flex items-center gap-2 2xsm:gap-3">
            {/* <!-- Dark Mode Toggler --> */}
            <ThemeToggleButton />
            {/* <!-- Dark Mode Toggler --> */}
            <NotificationDropdown />
            {/* <!-- Notification Menu Area --> */}
          </div>
          {/* <!-- User Area --> */}
          <UserDropdown />
        </div>
    </div>
  )
}

export default Navbar2

