import { useState } from 'react'
import { 
  ChevronDown, 
  ChevronUp, 
  Package, 
  Eye, 
  XCircle, 
  CheckCircle, 
  AlertTriangle, 
  Pencil
} from 'lucide-react'

export default function DemandeRow({ demande, user, handleAction, setRejectingId, actionLoading }) {
  const [expanded, setExpanded] = useState(false)

  // Parse les matériels si string
  const materiels = Array.isArray(demande.materiels) 
    ? demande.materiels 
    : demande.materiels?.split(',').map(m => m.trim()) || []

  const isLoading = actionLoading === demande.reference

  return (
    <>
      {/* Ligne principale */}
      <tr className="hover:bg-gray-50/50 transition-colors">
        <td 
          className="px-6 py-4 cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-center gap-2">
            <button className="text-gray-400 hover:text-gray-600">
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            <span className="text-sm font-mono font-medium text-blue-600">{demande.reference}</span>
          </div>
        </td>
        <td className="px-6 py-4 text-sm text-gray-900">{demande.demandeur}</td>
        <td className="px-6 py-4 text-sm text-gray-500 hidden sm:table-cell">{demande.departement}</td>
        <td className="px-6 py-4 text-sm text-gray-500">
          <span 
            className="cursor-pointer hover:text-blue-600"
            onClick={() => setExpanded(!expanded)}
          >
            {materiels.length} matériel{materiels.length > 1 ? 's' : ''}
          </span>
        </td>
        <td className="px-6 py-4">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ${getStatutStyle(demande.statut)}`}>
            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${getStatutDot(demande.statut)}`} />
            {demande.statut}
          </span>
        </td>
        <td className="px-6 py-4 text-sm text-gray-500 font-mono hidden md:table-cell">{demande.date}</td>
        <td className="px-6 py-4">
          <div className="flex justify-end gap-1.5">
            {/* VOIR */}
            <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              <Eye className="w-4 h-4" />
            </button>

            {/* EMPLOYÉ : Annuler */}
            {user?.role === 'Employe' && demande.statut === 'SOUMISE' && (
                <>
              <button 
                onClick={() => { if(window.confirm("Annuler ?")) handleAction(demande.reference, 'ANNULER') }}
                disabled={isLoading}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
              >
                <XCircle className="w-4 h-4" />
              </button>
              <button 
                onClick={() => { if(window.confirm("Annuler ?")) handleAction(demande.reference, 'MODIFIER') }}
                disabled={isLoading}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
              >
                <Pencil className="w-4 h-4" />
              </button>
              
              </>
            )}

            {/* RESPONSABLE/MAGASINIER : Approuver/Rejeter */}
            {(user?.role === 'Responsable' || user?.role === 'Magasinier') && (
              <>
                <button 
                  onClick={() => handleAction(demande.reference, 'APPROUVEE')}
                  disabled={isLoading}
                  className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                >
                  <CheckCircle className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setRejectingId(demande.reference)}
                  disabled={isLoading}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              </>
            )}

            {/* MAGASINIER spécifique */}
            {user?.role === 'Magasinier' && demande.statut === 'APPROUVEE1' && (
              <button 
                onClick={() => handleAction(demande.reference, 'STOCK_INSUFFISANT')}
                disabled={isLoading}
                className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors disabled:opacity-50"
              >
                <AlertTriangle className="w-4 h-4" />
              </button>
            )}
            {user?.role === 'Magasinier' && demande.statut === 'APPROUVEE2' && (
              <button 
                onClick={() => handleAction(demande.reference, 'LIVREE')}
                disabled={isLoading}
                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
              >
                <Package className="w-4 h-4" />
              </button>
            )}
          </div>
        </td>
      </tr>

      {/* Ligne déroulée */}
      {expanded && (
        <tr>
          <td colSpan="7" className="px-0 py-0">
            <div className="bg-gray-50/80 border-y border-gray-100 px-6 py-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Package className="w-4 h-4 text-gray-500" />
                Matériels demandés
              </h4>
              <div className="flex flex-wrap gap-2">
                {materiels.map((mat, i) => (
                  <span key={i} className="inline-flex items-center px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 shadow-sm">
                    {mat}
                  </span>
                ))}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

// Helpers
function getStatutStyle(statut) {
  const styles = {
    SOUMISE: 'bg-blue-50 text-blue-700 ring-blue-600/20',
    APPROUVEE1: 'bg-green-50 text-green-700 ring-green-600/20',
    APPROUVEE2: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    REJETEE1: 'bg-red-50 text-red-700 ring-red-600/20',
    REJETEE2: 'bg-rose-50 text-rose-700 ring-rose-600/20',
    EN_ATTENTE_STOCK: 'bg-orange-50 text-orange-700 ring-orange-600/20',
    LIVREE: 'bg-gray-50 text-gray-700 ring-gray-500/20',
    BROULLION: 'bg-slate-50 text-slate-700 ring-slate-500/20',
  }
  return styles[statut] || 'bg-gray-50 text-gray-700 ring-gray-500/20'
}

function getStatutDot(statut) {
  const dots = {
    SOUMISE: 'bg-blue-500',
    APPROUVEE1: 'bg-green-500',
    APPROUVEE2: 'bg-emerald-500',
    REJETEE1: 'bg-red-500',
    REJETEE2: 'bg-rose-500',
    EN_ATTENTE_STOCK: 'bg-orange-500',
    LIVREE: 'bg-gray-500',
    BROULLION: 'bg-slate-500',
  }
  return dots[statut] || 'bg-gray-400'
}