import { useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ClipboardList, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Boxes
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true },
  { icon: Package, label: 'Inventaire', active: false },
  { icon: ClipboardList, label: 'Demandes', active: false },
  { icon: Boxes, label: 'Matériels', active: false },
  { icon: Settings, label: 'Paramètres', active: false },
];

export default function Sidebar({ onLogout }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`bg-gray-900 text-white flex flex-col transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-gray-800">
        <Boxes className="w-8 h-8 text-blue-400 flex-shrink-0" />
        {!collapsed && <span className="ml-3 font-bold text-lg tracking-tight">Sygima</span>}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {menuItems.map((item, i) => (
          <a
            key={i}
            href="#"
            className={`flex items-center px-3 py-2.5 rounded-lg transition-colors ${
              item.active 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" strokeWidth={item.active ? 2.5 : 2} />
            {!collapsed && <span className="ml-3 text-sm font-medium">{item.label}</span>}
          </a>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-2 border-t border-gray-800">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
        <button
          onClick={onLogout}
          className="w-full flex items-center px-3 py-2.5 mt-1 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="ml-3 text-sm font-medium">Déconnexion</span>}
        </button>
      </div>
    </aside>
  );
}