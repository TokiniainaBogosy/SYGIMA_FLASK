import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useApi } from '../../hooks/useApi'
import DemandeMateriel from '../../components/Formulaire/DemandeMatériel'
import DetailDemandes from '../../components/Affichage/DetailDemandes'
import api from "../../services/api";
import { Download } from 'lucide-react';

// Rôles alignés sur l'enum backend RoleUser (EMPLOYE, RESPONSABLE, MAGASINIER, ADMIN, SUPER_ADMIN)
const ROLES = {
  EMPLOYE: 'EMPLOYE',
  RESPONSABLE: 'RESPONSABLE',
  MAGASINIER: 'MAGASINIER',
  ADMIN: 'ADMIN',
};

export default function Demandes() {
  const [showForm, setShowForm] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [detailData, setDetailData] = useState(null)
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [searchStatus, setSearchStatus] = useState('')
  const [searchDepartement, setSearchDepartement] = useState('')
  const [rejectingId, setRejectingId] = useState(null)
  const [demandeID, setDemandeID] = useState(null)
  const [tempMotif, setTempMotif] = useState('')

  const handleExportPdf = async () => {
    try {
      const response = await api.get("/demande/pdf", { responseType: "blob" });
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "rapport_demandes.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erreur lors de l'export PDF :", error);
      alert("Impossible de générer le PDF.");
    }
  };

  // BUG CORRIGÉ : casse des rôles ('Magasinier'/'Admin' -> 'MAGASINIER'/'ADMIN')
  // et champ inexistant `user.departement` -> `user.departement_id`
  const url = user ? '/demande/' : null

  const { data: demandesApi, refetch: refetchDemandes } = useApi(url)

  const [demandes, setDemandes] = useState([])

  useEffect(() => {
    if (demandesApi) setDemandes(demandesApi)
  }, [demandesApi])

  const { patch } = useApi()

  const updateStatus = (ligneId, statutReel, motif = '') => {
    setDemandes(demandes.map(req =>
      req.ligne_id === ligneId ? { ...req, statut_ligne: statutReel, motif_rejet: motif } : req
    ))
    setRejectingId(null)
    setTempMotif('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
  }

  const handleAction = async (reference, id, nouveauStatut, motif = "") => {
    let statutFinal = nouveauStatut

    if (nouveauStatut === 'REJETEE') {
      // Magasinier désactivé : plus de niveau 2, tout rejet reste au niveau 1
      statutFinal = 'REJETEE1'
      /* statutFinal = user?.role === ROLES.MAGASINIER ? 'REJETEE2' : 'REJETEE1' */
    } else if (nouveauStatut === 'APPROUVEE1') {
      statutFinal = 'APPROUVEE1'
      /* statutFinal = user?.role === ROLES.MAGASINIER ? 'APPROUVEE2' : 'APPROUVEE1' */
    } else if (nouveauStatut === 'STOCK_INSUFFISANT') {
      statutFinal = 'EN_ATTENTE_STOCK'
    } else if (nouveauStatut === 'LIVREE') {
      statutFinal = 'LIVREE'
    } else if (nouveauStatut === 'ANNULER') {
      statutFinal = 'BROUILLON'
    }

    // BUG CORRIGÉ : la mise à jour optimiste utilisait le label brut du bouton
    // (ex: 'STOCK_INSUFFISANT') au lieu de la vraie valeur envoyée au backend.
    updateStatus(id, statutFinal, motif)

    try {
      await patch('/demande/answer', { reference, ligne_id: id, status: statutFinal, motif })
      refetchDemandes()
      setRejectingId(null)
      setTempMotif("")
      setShowDetails(false)
    } catch (err) { }
  }

  const filteredDemandes = demandes.filter((dem) => {
    const search = searchTerm.trim().toLowerCase()
    const matchSearch =
      dem.materiels?.toLowerCase().includes(search) ||
      dem.demandeur?.toLowerCase().includes(search)
    const matchStatus = dem.statut?.toLowerCase().includes(searchStatus.toLowerCase())
    const matchDepartement = dem.departement?.toLowerCase().includes(searchDepartement.toLowerCase())
    return matchSearch && matchStatus && matchDepartement
  })

  // BUG CORRIGÉ : filtrage par rôle appliqué AVANT le calcul des rowSpan,
  // pour que le nombre de lignes par référence corresponde à ce qui est
  // réellement affiché (sinon le tableau se casse visuellement).
  const visibleDemandes = filteredDemandes.filter((demande) => {
    if (user?.role === ROLES.RESPONSABLE || user?.role === ROLES.ADMIN) {
      // Le magasinier étant désactivé, le responsable voit aussi les lignes
      // approuvées en attente de sortie stock, pour pouvoir livrer lui-même.
      return ['SOUMISE', 'APPROUVEE1', 'REJETEE1', 'EN_ATTENTE_STOCK'].includes(demande.statut);
    }
    /* Vue magasinier désactivée — le responsable gère tout le workflow pour l'instant
    if (user?.role === ROLES.MAGASINIER) {
      return ['APPROUVEE1', 'APPROUVEE2', 'REJETEE2', 'EN_ATTENTE_STOCK', 'LIVREE'].includes(demande.statut);
    }
    */
    if (user?.role === ROLES.EMPLOYE) {
      return ['APPROUVEE1', 'SOUMISE', 'REJETEE1', 'BROUILLON', 'LIVREE'].includes(demande.statut);
    }
    return false;
  })

  const statuts = [...new Set(demandes.map(dem => dem.statut))]
  const departements = [...new Set(demandes.map(dem => dem.departement))]
  const referenceCounts = visibleDemandes.reduce((acc, curr) => {
    acc[curr.reference] = (acc[curr.reference] || 0) + 1
    return acc
  }, {})
  const renderedReferences = new Set()

  const getStatutStyle = (statut) => {
    const styles = {
      SOUMISE: 'bg-blue-100 text-blue-800',
      EN_TRAITEMENT: 'bg-yellow-100 text-yellow-800',
      APPROUVEE1: 'bg-[#58B2B0] text-white',
      APPROUVEE2: 'bg-green-100 text-green-800',
      REJETEE1: 'bg-red-100 text-red-800',
      REJETEE2: 'bg-red-100 text-red-800',
      EN_ATTENTE_STOCK: 'bg-orange-100 text-orange-800',
      LIVREE: 'bg-gray-100 text-gray-800',
      BROUILLON: 'bg-gray-100 text-gray-500',
    }
    return styles[statut] || 'bg-gray-100 text-gray-800'
  }

  // Affichage sans le chiffre de niveau : "APPROUVEE1" -> "APPROUVEE", "REJETEE1" -> "REJETEE"
  // La valeur brute (avec le chiffre) reste utilisée pour la couleur (getStatutStyle) et la logique.
  const formatStatutLabel = (statut) => statut?.replace(/^(APPROUVEE|REJETEE)[12]$/, '$1') ?? statut

  return (
    <div className="w-full px-6 lg:px-10 py-8 space-y-8">

      {/* En-tête */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Demandes</h1>
          <p className="text-gray-500 mt-1">Gestion des demandes de matériel</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => { handleExportPdf(); }}
            className="inline-flex h-10 min-w-30 items-center justify-center gap-2 px-4 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            Exporter
          </button>
          {(user?.role === ROLES.RESPONSABLE || user?.role === ROLES.EMPLOYE) && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="inline-flex h-10 min-w-45 items-center justify-center gap-2 px-4 bg-[#0D3056] hover:bg-[#1e4e7e] text-white rounded-lg transition"
            >
              <span className="text-xl">+</span>
              Nouvelle demande
            </button>
          )}
        </div>
      </div>

      {showForm && <DemandeMateriel refetchDemandes={refetchDemandes} />}

      {/* Filtres */}
      <div className="flex gap-4 mb-6">
        {user.role === ROLES.ADMIN && (
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm" value={searchDepartement} onChange={(e) => setSearchDepartement(e.target.value)}>
            <option value="">Toutes les Departements</option>
            {departements.map((dep) => (
              <option key={dep} value={dep}>{dep}</option>
            ))}
          </select>
        )}
        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm" value={searchStatus} onChange={(e) => setSearchStatus(e.target.value)}>
          <option value="">Toutes les Status</option>
          {statuts.map((stat) => (
            <option key={stat} value={stat}>{stat}</option>
          ))}
        </select>

        <input
          type="text"
          value={searchTerm}
          placeholder="Rechercher par matériel ou demandeur..."
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
        />
      </div>

      {/* Tableau des demandes */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="overflow-x-auto">
          <form onSubmit={handleSubmit}>
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-r border-gray-200">Référence</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-r border-gray-200">Demandeur</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-r border-gray-200">Statut</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-r border-gray-200">Id ligne</th>
                  {/* Colonne "Département" réservée au magasinier — désactivée, le responsable suffit pour l'instant
                  {user?.role === ROLES.MAGASINIER && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-r border-gray-200">Département</th>
                  )}
                  */}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-r border-gray-200">Statut ligne</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-r border-gray-200">Matériels</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-r border-gray-200">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-r border-gray-200">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {visibleDemandes.map((demande, index) => {
                  const isFirstOccurrence = !renderedReferences.has(demande.reference);
                  if (isFirstOccurrence) {
                    renderedReferences.add(demande.reference);
                  }
                  return (
                    <tr key={index} className='border-asecna-blue'>
                      {isFirstOccurrence ? (
                        <>
                          <td rowSpan={referenceCounts[demande.reference]} className="px-6 py-4 text-sm font-medium text-[#0D3056] border-r border-gray-200 bg-white">
                            {demande.reference}
                          </td>
                          <td rowSpan={referenceCounts[demande.reference]} className="px-6 py-4 text-sm text-gray-500 border-r border-gray-200">
                            {demande.demandeur}
                          </td>
                          <td rowSpan={referenceCounts[demande.reference]} className="px-6 py-4 border-r border-gray-200">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatutStyle(demande.statut)}`}>
                              {formatStatutLabel(demande.statut)}
                            </span>
                          </td>
                        </>
                      ) : null}

                      <td className="px-6 py-4 text-sm text-gray-500 border-r border-gray-200">{demande.ligne_id}</td>
                      {/* Cellule "Département" magasinier — désactivée en même temps que l'en-tête
                      {user?.role === ROLES.MAGASINIER && (
                        <td className="px-6 py-4 text-sm text-gray-500 border-r border-gray-200">{demande.departement}</td>
                      )}
                      */}
                      <td className="px-6 py-4 border-r border-gray-200">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatutStyle(demande.statut_ligne)}`}>
                          {formatStatutLabel(demande.statut_ligne)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 border-r border-gray-200">{demande.materiels}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 border-r border-gray-200">{demande.date}</td>
                      <td className="px-6 py-4 text-sm border-r border-gray-200">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setShowDetails(true)
                              setDetailData({
                                reference: demande.reference,
                                demandeur: demande.demandeur,
                                materiel: demande.materiels,
                                justification: demande.justification,
                                stock: demande.qte_disponible,
                                qte_demande: demande.qte_demandee,
                                motif_rejet: demande.motif_rejet,
                                qte_disponible: demande.qte_disponible,
                                statut: demande.statut_ligne,
                                departement: demande.departement,
                                ligne_id: demande.ligne_id,
                                 // BUG CORRIGÉ : casse alignée avec la lecture plus bas
                              })
                            }}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200">
                            Voir
                          </button>

                          {user?.role === ROLES.EMPLOYE && demande.statut === 'SOUMISE' && (
                            <button
                              onClick={() => {
                                if (window.confirm("Êtes-vous sûr de vouloir annuler cette demande ?")) {
                                  handleAction(demande.reference, demande.ligne_id, 'ANNULER');
                                }
                              }}
                              className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-xs hover:bg-red-100 hover:text-red-700 transition-colors"
                            >
                              Annuler
                            </button>
                          )}

                          {user?.role === ROLES.EMPLOYE && demande.statut === 'BROUILLON' && (
                            <button
                              onClick={() => { handleAction(demande.reference, demande.ligne_id, 'SOUMISE'); }}
                              className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-xs hover:bg-red-100 hover:text-red-700 transition-colors"
                            >
                              Confirmer
                            </button>
                          )}

                          {/* RESPONSABLE : approuve/rejette la ligne au niveau 1 */}
                          {user?.role === ROLES.RESPONSABLE && demande.statut_ligne === 'SOUMISE' && (
                            <>
                              <button type="button" className="px-3 py-1 bg-[#0D3056] text-white rounded text-xs hover:bg-[#155191]"
                                onClick={() => handleAction(demande.reference, demande.ligne_id, 'APPROUVEE1')}>
                                Approuver
                              </button>
                              <button className="px-3 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200"
                                onClick={() => { setRejectingId(demande.ligne_id); setDemandeID(demande.reference) }}>
                                Rejeter
                              </button>
                            </>
                          )}

                          {/* RESPONSABLE : gère aussi le stock et la livraison, le magasinier étant désactivé */}
                          {user?.role === ROLES.RESPONSABLE && demande.statut_ligne === 'APPROUVEE1' && (
                            <>
                              <button
                                onClick={() => handleAction(demande.reference, demande.ligne_id, 'STOCK_INSUFFISANT')}
                                className="px-3 py-1 bg-orange-100 text-orange-700 rounded text-xs hover:bg-orange-200"
                              >
                                En attente stock
                              </button>
                              <button
                                onClick={() => handleAction(demande.reference, demande.ligne_id, 'LIVREE')}
                                className="px-3 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200"
                              >
                                Confirmer Sortie
                              </button>
                            </>
                          )}

                          {/* RESPONSABLE : relance la livraison une fois le stock réapprovisionné */}
                          {user?.role === ROLES.RESPONSABLE && demande.statut_ligne === 'EN_ATTENTE_STOCK' && (
                            <button
                              onClick={() => handleAction(demande.reference, demande.ligne_id, 'LIVREE')}
                              className="px-3 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200"
                            >
                              Réessayer la livraison
                            </button>
                          )}

                          {/* Blocs magasinier désactivés — le responsable suffit pour l'instant.
                              À réactiver si un rôle magasinier séparé redevient nécessaire.
                          {user?.role === ROLES.MAGASINIER && demande.statut_ligne === 'APPROUVEE1' && (
                            <>
                              <button
                                onClick={() => handleAction(demande.reference, demande.ligne_id, 'STOCK_INSUFFISANT')}
                                className="px-3 py-1 bg-orange-100 text-orange-700 rounded text-xs hover:bg-orange-200"
                              >
                                En attente stock
                              </button>
                              <button
                                onClick={() => handleAction(demande.reference, demande.ligne_id, 'LIVREE')}
                                className="px-3 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200"
                              >
                                Confirmer Sortie
                              </button>
                            </>
                          )}

                          {user?.role === ROLES.MAGASINIER && demande.statut_ligne === 'EN_ATTENTE_STOCK' && (
                            <button
                              onClick={() => handleAction(demande.reference, demande.ligne_id, 'LIVREE')}
                              className="px-3 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200"
                            >
                              Réessayer la livraison
                            </button>
                          )}
                          */}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </form>
        </div>
      </div>

      {showDetails && (
        <DetailDemandes
          getStatutStyle={getStatutStyle}
          reference={detailData?.reference}
          demandeur={detailData?.demandeur}
          materiel={detailData?.materiel}
          justification={detailData?.justification}
          stock={detailData?.stock}
          setShow={setShowDetails}
          qte_demande={detailData?.qte_demande}
          motif_rejet={detailData?.motif_rejet}
          qte_disponible={detailData?.qte_disponible}
          statut={detailData?.statut}
          departement={detailData?.departement}
          handleAction={handleAction}
          setRejectingId={setRejectingId}
          setDemandeID={setDemandeID}
          ligne_id={detailData?.ligne_id}
          demandeID={detailData?.demandeId}
          rejectingId={detailData?.rejectingId}
          handleSubmit={handleSubmit}
          tempMotif={tempMotif}
          setTempMotif={setTempMotif}
        />
      )}

      {/* Modal de Rejet Simple */}
      {demandeID && rejectingId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl">
            <form onSubmit={handleSubmit}>
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
                  onClick={() => { setRejectingId(null); setTempMotif(""); setDemandeID(null) }}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
                  type="button"
                >
                  Annuler
                </button>
                <button
                  disabled={!tempMotif.trim()}
                  onClick={() => { handleAction(demandeID, rejectingId, 'REJETEE', tempMotif); setTempMotif(""); setDemandeID(null); setRejectingId(null) }}
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
