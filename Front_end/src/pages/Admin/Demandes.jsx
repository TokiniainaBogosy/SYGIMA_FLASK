import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useApi } from '../../hooks/useApi'
import DemandeMateriel from '../../components/Formulaire/DemandeMatériel'

export default function Demandes() {
  const [showForm, setShowForm] = useState(false)
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [searchStatus, setSearchStatus] = useState('')
  const [searchDepartement, setSearchDepartement] = useState('')
  const [rejectingId, setRejectingId] = useState(null)
  const [demandeID, setDemandeID] = useState(null)
  const [tempMotif, setTempMotif] = useState('')
  const [form, setForm] = useState({ reference: "", status: "", motif: "" })

  // ✅ GET via useApi
  const url = user
    ? user.role === 'Magasinier' || user.role === 'Admin'
      ? '/demande/'
      : `/demande/?departement=${user.departement}`
    : null

  const { data: demandesApi } = useApi(url)

  // ✅ State local pour permettre les mises à jour optimistes
  const [demandes, setDemandes] = useState([])

  useEffect(() => {
    if (demandesApi) setDemandes(demandesApi)
  }, [demandesApi])

  // ✅ Un seul patch
  const { patch } = useApi()

  const updateStatus = (ref, newStatus, motif = '') => {
    setDemandes(demandes.map(req =>
      req.ligne_id === ref ? { ...req, statut_ligne: newStatus, motif_rejet: motif } : req
    ))
    setRejectingId(null)
    setTempMotif('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await patch('/demande/answer', form)
      setForm({ reference: "", status: "", motif: "" })
    } catch (err) { }
  }

  const handleAction = async (reference, id, nouveauStatut, motif = "") => {
    let statutFinal = nouveauStatut

    if (nouveauStatut === 'REJETEE') {
      statutFinal = user?.role === 'Magasinier' ? 'REJETEE2' : 'REJETEE1'
    } else if (nouveauStatut === 'APPROUVEE') {
      statutFinal = user?.role === 'Magasinier' ? 'APPROUVEE2' : 'APPROUVEE1'
    } else if (nouveauStatut === 'STOCK_INSUFFISANT') {
      statutFinal = 'EN_ATTENTE_STOCK'
    } else if (nouveauStatut === 'LIVREE') {
      statutFinal = 'LIVREE'
    } else if (nouveauStatut === 'ANNULER') {
      statutFinal = 'BROULLION'
    }

    updateStatus(id, nouveauStatut, motif)

    try {
      await patch('/demande/answer', { reference, ligne_id: id, status: statutFinal, motif })
      setRejectingId(null)
      setTempMotif("")
    } catch (err) { }
  }

  const filteredDemandes = demandes.filter((dem) => {
    const matchSearch = dem.materiels?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchStatus = dem.statut?.toLowerCase().includes(searchStatus.toLowerCase())
    const matchDepartement = dem.departement?.toLowerCase().includes(searchDepartement.toLowerCase())
    return matchSearch && matchStatus && matchDepartement
  })

  const statuts = [...new Set(demandes.map(dem => dem.statut))]
  const departements = [...new Set(demandes.map(dem => dem.departement))]
  const referenceCounts = demandes.reduce((acc, curr) => {
    acc[curr.reference] = (acc[curr.reference] || 0) + 1
    return acc
  }, {})
  const renderedReferences = new Set()

  const getStatutStyle = (statut) => {
  const styles = {
    SOUMISE:          'bg-blue-100 text-blue-800',
    EN_TRAITEMENT:    'bg-yellow-100 text-yellow-800',
    APPROUVEE1:       'bg-green-100 text-green-800',
    APPROUVEE2:       'bg-green-100 text-green-800',
    REJETEE1:         'bg-red-100 text-red-800',
    REJETEE2:         'bg-red-100 text-red-800',
    EN_ATTENTE_STOCK: 'bg-orange-100 text-orange-800',
    EN_ATTENTE:       'bg-yellow-100 text-yellow-800',
    LIVREE:           'bg-gray-100 text-gray-800',
    BROULLION:        'bg-gray-100 text-gray-500',
  }
  return styles[statut] || 'bg-gray-100 text-gray-800'
}

  return (
    <div className="w-full px-6 lg:px-10 py-8 space-y-8">
      
      {/* En-tête */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Demandes</h1>
          <p className="text-gray-500 mt-1">
            Gestion des demandes de matériel
          </p>
        </div>

        {/* Bouton nouvelle demande (visible pour employé et responsable) */}
        {(user?.role === 'RESPONSABLE' || user?.role === 'EMPLOYE') &&(
          <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition flex items-center gap-2"
        >
          <span className="text-xl">+</span>
          Nouvelle demande
        </button>
        )}
      </div>

      {/* Formulaire de demande */}
      {showForm && (
        <DemandeMateriel/>
    
      )}

      {/* Filtres */}
      <div className="flex gap-4 mb-6">
        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm" value={searchDepartement} onChange={(e) => setSearchDepartement(e.target.value)}>

          <option value="">Toutes les Departements</option>
            {departements.map((dep) => (
              <option key={dep} value={dep}>{dep}</option>
            ))}
        </select>
        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm" value={searchStatus} onChange={(e) => setSearchStatus(e.target.value)}>

          <option value="">Toutes les Status</option>
            {statuts.map((stat) => (
              <option key={stat} value={stat}>{stat}</option>
            ))}
        </select>

        {/* <select 
            value={searchCategorie}
            onChange={(e) => setsearchCategorie(e.target.value)}
          >
            <option value="">Toutes les catégories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
        </select> */}

        <input
          type="text"
          value={searchTerm}
          placeholder="Rechercher..."
          onChange={(e)=>setSearchTerm(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
        />
      </div>

      {/* Tableau des demandes */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="overflow-x-auto">
          <form onSubmit={handleSubmit} className="">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-r border-gray-200 ">
                  Référence
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-r border-gray-200 ">
                  Demandeur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-r border-gray-200 ">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-r border-gray-200 ">
                  Id ligne
                </th>
                {user?.role == 'MAGASINIER' && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-r border-gray-200 ">
                    Département
                  </th>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-r border-gray-200 ">
                  statut ligne
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-r border-gray-200 ">
                  Matériels
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-r border-gray-200 ">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-r border-gray-200 ">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {filteredDemandes.filter((demande) => {
                    if (user?.role === 'RESPONSABLE') {
                      // Le responsable voit ce qu'il doit traiter (SOUMISE) 
                      // ET ce qu'il a déjà traité (APPROUVEE1 ou REJETEE1)
                      return ['SOUMISE', 'APPROUVEE1', 'REJETEE1'].includes(demande.statut);
                    }

                    if (user?.role === 'MAGASINIER') {
                      // Le magasinier voit ce qu'il doit traiter (APPROUVEE1) 
                      // ET ce qu'il a validé (APPROUVEE2)
                      return ['APPROUVEE1', 'APPROUVEE2','REJETEE2','LIVREE'].includes(demande.statut);
                    }
                    if (user?.role === 'EMPLOYE') {
                      // Le magasinier voit ce qu'il doit traiter (APPROUVEE1) 
                      // ET ce qu'il a validé (APPROUVEE2)
                    return ['APPROUVEE1','SOUMISE','REJETEE1','BROULLION'].includes(demande.statut);
                    }

                    
                  })
              .map((demande,index) => {
                const isFirstOccurrence = !renderedReferences.has(demande.reference);
                    if (isFirstOccurrence) {
                      renderedReferences.add(demande.reference);
                    }
                return(
                <tr key={index} className='border-asecna-blue'>
                {/* CELLULE AVEC ROWSPAN DYNAMIQUE */}
                {isFirstOccurrence ? (<>
                  <td 
                    rowSpan={referenceCounts[demande.reference]} 
                    className="px-6 py-4 text-sm font-medium  text-blue-600 border-r border-gray-200 bg-white"
                  >
                    {demande.reference}
                  </td>
                  <td 
                    rowSpan={referenceCounts[demande.reference]} 
                    className="px-6 py-4 text-sm text-gray-500 border-r border-gray-200"
                    >
                      {demande.demandeur}
                  </td>
                  <td 
                    rowSpan={referenceCounts[demande.reference]} 
                    className="px-6 py-4 border-r border-gray-200">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatutStyle(demande.statut)}`}>
                      {demande.statut}
                    </span>
                  </td>
                </>
                ) : null}

                {/* AUTRES CELLULES NORMALES */}
                <td className="px-6 py-4 text-sm text-gray-500 border-r border-gray-200">{demande.ligne_id}</td>
                {user?.role == 'Magasinier' && (
                  <td className="px-6 py-4 text-sm text-gray-500 border-r border-gray-200">{demande.departement}</td>
                )}
                <td 
                    
                    className="px-6 py-4 border-r border-gray-200">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatutStyle(demande.statut_ligne)}`}>
                      {demande.statut_ligne}
                    </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 border-r border-gray-200">{demande.materiels}</td>
                <td className="px-6 py-4 text-sm text-gray-500 border-r border-gray-200">{demande.date}</td>
                  <td className="px-6 py-4 text-sm border-r border-gray-200">
                    <div className="flex gap-2">
                      <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200">
                        👁️ Voir
                      </button>
                      {/* ACTION EMPLOYE : Annuler sa propre demande */}
                      {user?.role === 'EMPLOYE' && demande.statut === 'SOUMISE' && (
                        <button 
                          onClick={() => {
                            if(window.confirm("Êtes-vous sûr de vouloir annuler cette demande ?")) {
                              handleAction(demande.reference,demande.ligne_id, 'ANNULER');
                            }
                          }}
                          className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-xs hover:bg-red-100 hover:text-red-700 transition-colors"
                        >
                          ✖️ Annuler
                        </button>
                      )}
                      {/* ACTION EMPLOYE : Annuler sa propre demande */}
                      {user?.role === 'EMPLOYE' && demande.statut === 'BROULLION' && (
                        <button 
                          onClick={() => {
                              handleAction(demande.reference,demande.ligne_id, 'SOUMISE');
                          }}
                          className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-xs hover:bg-red-100 hover:text-red-700 transition-colors"
                        >
                          Confirmer
                        </button>
                      )}

                      {/* Boutons d'approbation visible seulement pour responsable/admin */}
                      {(user?.role === 'RESPONSABLE' || user?.role === 'Magasinier') &&
                        (
                          <>
                          {demande.statut_ligne === 'EN_ATTENTE' && (
                            <>
                              <button type="button" className="px-3 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200"
                              onClick={() =>  handleAction(demande.reference,demande.ligne_id,'APPROUVEE')}>
                                ✅ APPROUVEE
                              </button>
                              
                              <button className="px-3 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200"
                              onClick={() => {setRejectingId(demande.ligne_id);setDemandeID(demande.reference)}}>
                                ❌ Rejeter
                              </button>
                            </>
                          )}
                            
                          </>
                        )}
                        {/* Optionnel : Bouton spécifique pour le magasinier si la demande est APPROUVEE1 */}
                        {(user?.role === 'Magasinier' && demande.statut === 'APPROUVEE1') && (
                          <button 
                            onClick={() => handleAction(demande.reference,demande.ligne_id, 'STOCK_INSUFFISANT')}
                            className="px-3 py-1 bg-orange-100 text-orange-700 rounded text-xs hover:bg-orange-200"
                          >
                            ⏳ En attente stock
                          </button>
                        )}
                        {user?.role === 'Magasinier' && demande.statut === 'APPROUVEE2' && (
                          <button 
                            onClick={() => handleAction(demande.reference,demande.ligne_id, 'LIVREE')}
                            className="px-3 py-1 bg-orange-100 text-orange-700 rounded text-xs  hover:bg-orange-200"
                          >
                            📦 Confirmer Sortie 
                          </button>
                        )}
                    </div>
                  </td>
                </tr>
              )})}
              
              
            </tbody>
          </table>
          </form>
        </div>
      </div>

      {/* Modal de Rejet Simple */}
        {demandeID && rejectingId && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl">
              <form onSubmit={handleSubmit} className="">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Motif du rejet</h3>
              <p className="text-sm text-gray-500 mb-4">Veuillez indiquer pourquoi cette demande est refusée.</p>
              <textarea 
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                rows="3"
                placeholder="Ex: Budget annuel épuisé, Matériel déjà disponible en stock..."
                value={tempMotif}
                onChange={(e) => setTempMotif(e.target.value)}
              />
              <div className="flex justify-end gap-3 mt-6">
                <button 
                  onClick={() => setRejectingId(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Annuler
                </button>
                <button 
                  disabled={!tempMotif.trim()}
                  onClick={() => handleAction(demandeID, rejectingId, 'REJETEE', tempMotif)}
                  className="px-4 py-2 text-sm font-medium bg-rose-600 text-white hover:bg-rose-700 rounded-lg disabled:opacity-50"
                  type='button'
                >
                  Confirmer le rejet
                </button>
              </div>
              </form>
            </div>
          </div>
        )}
    </div>
  )
}