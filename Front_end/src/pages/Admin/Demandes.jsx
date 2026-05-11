import { useState,useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import DemandeMateriel from '../../components/Formulaire/DemandeMatériel'


export default function Demandes() {
  // State pour afficher/masquer le formulaire
  const [showForm, setShowForm] = useState(false)

  // State pour bar de recherche
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [searchStatus, setSearchStatus] = useState('')
  const [searchDepartement, setSearchDepartement] = useState('')

  // Fausses données de demandes
  const [demandes,setDemandes] = useState([])
  const [data,setData] = useState([])

  const [form, setForm] = useState({
    reference: "",
    status: "",
    motif: ""
  })
  // State pour selectionner les demandes azz
  const [rejectingId, setRejectingId] = useState(null);
  const [demandeID, setDemandeID] = useState(null);
  const [tempMotif, setTempMotif] = useState('');

  
  const updateStatus = (ref, newStatus, motif = '') => {
    setDemandes(demandes.map(req => 
      req.ligne_id === ref ? { ...req, statut_ligne: newStatus, motif_rejet: motif } : req
    ));
    setRejectingId(null);
    setTempMotif('');
  };

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`
  };

  useEffect(() => {
  const fetchData = async () => {
    try {
      // On construit l'URL dynamiquement
      let url = 'http://127.0.0.1:8000/demande';
      
      // Si ce n'est pas un magasinier, on ajoute le filtre département dans l'URL
      if (user?.role !== 'Magasinier' && user?.role !== 'Admin') {
        url += `?departement=${user.departement}`;
      }

      const response = await fetch(url, { method: 'GET', headers });
      const result = await response.json();
      setDemandes(result);
    } catch (error) {
      console.error("Erreur lors de la récupération:", error);
    }
  };

  if (user) fetchData();
}, [user]);

  
    const filteredDemandes = demandes
  .filter((dem) => {
    // Filtre recherche (tu l'as déjà)
    const matchSearch = dem.materiels
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    
    // Filtre catégorie (à compléter)
    const matchStatus = dem.statut
    .toLowerCase()
    .includes(searchStatus.toLowerCase()) // À toi de coder !
    const matchDepartement = dem.departement
    .toLowerCase()
    .includes(searchDepartement.toLowerCase()) // À toi de coder !
    
    // Les deux doivent être vrais
    return matchSearch && matchStatus && matchDepartement
  })
  const statuts = [...new Set(demandes.map(dem => dem.statut))]
  const departements = [...new Set(demandes.map(dem => dem.departement))]
  
  
  const handleSubmit = async (e)=>{
    e.preventDefault();
    try{
          const response = await fetch('http://127.0.0.1:8000/demande/answer',{
            method: 'PATCH', headers,body: JSON.stringify(form)});
          if (!response.ok) {
          const data = await response.json();
          throw new Error(data.detail || "Erreur lors de la création");
          }
          setForm({reference:"",status:""});
        }
    catch (err) {
      console.log(err)
    } 
  }
  
  
  // Style du badge statut
  const getStatutStyle = (statut) => {
    const styles = {
      SOUMISE: 'bg-blue-100 text-blue-800',
      EN_TRAITEMENT: 'bg-yellow-100 text-yellow-800',
      APPROUVEE1: 'bg-green-100 text-green-800',
      APPROUVEE: 'bg-green-100 text-green-800',
      REJETEE1: 'bg-red-100 text-red-800',
      REJETEE: 'bg-red-100 text-red-800',
      EN_ATTENTE_STOCK: 'bg-orange-100 text-orange-800',
      LIVREE: 'bg-gray-100 text-gray-800',
    }
    return styles[statut] || 'bg-gray-100 text-gray-800'
  }

  // Texte du statut plus lisible
  const getStatutLabel = (statut) => {
    const labels = {
      SOUMISE: 'Soumise',
      EN_TRAITEMENT: 'En traitement',
      APPROUVEE: 'Approuvée',
      REJETEE: 'Rejetée',
      EN_ATTENTE_STOCK: 'En attente stock',
      LIVREE: 'Livrée',
    }
    return labels[statut] || statut
  }

  const handleAction = async (reference, id , nouveauStatut, motif = "") => {
  // 1. Déterminer le statut final à envoyer au backend
  let statutFinal = nouveauStatut;

  if (nouveauStatut === 'REJETEE') {
    // Si c'est un rejet, on garde ta logique REJETEE1 (ou tu peux aussi différencier par rôle ici)
    statutFinal = user?.role === 'Magasinier' ? 'REJETEE2' : 'REJETEE1';
  } else if (nouveauStatut === 'APPROUVEE') {
    // LOGIQUE DE RÔLE :
    // Si c'est le magasinier qui approuve, ça passe en APPROUVEE2
    // Sinon (Responsable/Admin), ça reste en APPROUVEE1
    statutFinal = user?.role === 'Magasinier' ? 'APPROUVEE2' : 'APPROUVEE1';
  }else if (nouveauStatut === 'STOCK_INSUFFISANT') {
    // Nouveau statut pour le magasinier
    statutFinal = 'EN_ATTENTE_STOCK';
  }else if (nouveauStatut === 'LIVREE') {
    // Nouveau statut pour le magasinier
    statutFinal = 'LIVREE';
  }else if (nouveauStatut === 'ANNULER') {
    // Statut final pour l'annulation par l'employé
    statutFinal = 'BROULLION';
  }


  // 2. Mise à jour locale de l'UI
  updateStatus(id,nouveauStatut, motif)

  // 3. Préparation du payload avec le statut calculé
  const payload = {
    reference: reference,
    ligne_id: id,
    status: statutFinal, // Utilise la variable calculée ici
    motif: motif
  };

  // 4. Appel API
  try {
    const response = await fetch('http://127.0.0.1:8000/demande/answer', {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        // N'oublie pas tes headers d'autorisation si nécessaire
        ...headers 
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erreur détaillée :", errorData.detail);
      // Optionnel : recharger les données pour annuler l'update local
    } else {
      setRejectingId(null);
      setTempMotif("");
    }
  } catch (err) {
    console.error("Erreur réseau :", err);
  }
  };

  // On crée un dictionnaire des comptes
  const referenceCounts = demandes.reduce((acc, curr) => {
    acc[curr.reference] = (acc[curr.reference] || 0) + 1;
    return acc;
  }, {});

  // Pour savoir si on a déjà affiché la cellule pour cette référence
  const renderedReferences = new Set();

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
                {user?.role == 'Magasinier' && (
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
                    if (user?.role === 'Responsable') {
                      // Le responsable voit ce qu'il doit traiter (SOUMISE) 
                      // ET ce qu'il a déjà traité (APPROUVEE1 ou REJETEE1)
                      return ['SOUMISE', 'APPROUVEE1', 'REJETEE1'].includes(demande.statut);
                    }

                    if (user?.role === 'Magasinier') {
                      // Le magasinier voit ce qu'il doit traiter (APPROUVEE1) 
                      // ET ce qu'il a validé (APPROUVEE2)
                      return ['APPROUVEE1', 'APPROUVEE2','REJETEE2','LIVREE'].includes(demande.statut);
                    }
                    if (user?.role === 'Employe') {
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
                      {user?.role === 'Employe' && demande.statut === 'SOUMISE' && (
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
                      {user?.role === 'Employe' && demande.statut === 'BROULLION' && (
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
                      {(user?.role === 'Responsable' || user?.role === 'Magasinier') &&
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