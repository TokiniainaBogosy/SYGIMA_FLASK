import { useEffect, useState } from 'react'
import MaterielForm from '../../components/Formulaire/MaterielForm';
import { useApi } from '../../hooks/useApi';
import StockManager from '../../components/Formulaire/StockManager';
import { useAuth } from '../../context/AuthContext';
import { Search, Plus, Pencil, Trash2, Package, Tag } from 'lucide-react'

export default function Stock() {
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const { user } = useAuth()


  // ✅ Correction 1 : useApi retourne déjà les données
  const { data: stocklist, loading: stocklistLoading, error: stocklistError } = 
    useApi('materiel/stockList')
  const [searchCategorie, setSearchCategorie] = useState('')
  const [searchDepartement, setSearchDepartement] = useState('')
  const [selectedStock, setSelectedStock] = useState(null)
  const [newUnite, setNewUnite] = useState("");
  const [data,setData] = useState([])
  const [newDesignation, setNewDesignation] = useState("");
  const [newName,setNewName] = useState("");
  const [newDescription,setNewDescription] = useState("");
  // ✅ Correction 2 : Ne pas faire setData en dehors d'un useEffect
  // Utilisez directement stocklist au lieu de créer un state séparé
  const materiels = stocklist || []

  // ✅ Correction 3 : Extraire les catégories et départements UNIQUEMENT quand les données sont chargées
  const categories = [...new Set(materiels.map(mat => mat.categorie).filter(Boolean))]
  const departements = [...new Set(materiels.map(mat => mat.departement).filter(Boolean))]

  // ✅ Correction 4 : Fonction pour le style de quantité
  const getQuantiteStyle = (quantite, seuil) => {
    if (quantite <= seuil) {
      return 'text-red-600 font-bold'
    }
    return 'text-green-600 font-bold'
  }

  // ✅ Correction 5 : Filtrage des matériels
  const filteredMateriels = materiels.filter((mat) => {
    const matchSearch = mat.designation?.toLowerCase().includes(searchTerm.toLowerCase()) || false
    const matchCategorie = searchCategorie === '' || mat.categorie === searchCategorie
    const matchDepartement = searchDepartement === '' || mat.departement === searchDepartement
    
    return matchSearch && matchCategorie && matchDepartement
  })

  // Affichage du chargement
  if (stocklistLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    )
  }

  // Affichage de l'erreur
  if (stocklistError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-800 font-medium">Erreur de chargement</p>
        <p className="text-red-600 text-sm">{stocklistError}</p>
      </div>
    )
  }
  
  console.log(materiels);
  return (
    <div className="space-y-6 w-full px-6 lg:px-10 py-8 space-y-8">
      {/* En-tête de la page */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Stock</h1>
          <p className="text-gray-500 mt-1">Gestion des Stocks</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition flex items-center gap-2"
        >
          <span className="text-xl">+</span>
          Ajouter un matériel
        </button>
      </div>

      {/* Barres de recherche et filtres */}
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <select 
          value={searchCategorie}
          onChange={(e) => setSearchCategorie(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">Toutes les catégories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        {
          user?.role === 'ADMIN' && (
            <select 
            value={searchDepartement}
            onChange={(e) => setSearchDepartement(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">Tous les départements</option>
            {departements.map((dep) => (
              <option key={dep} value={dep}>{dep}</option>
            ))}
          </select>
          )
        }
        
        
        <input
          type="text"
          placeholder="Rechercher un matériel..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
        />
      </div>

      {/* Formulaire d'ajout */}
      {showForm && <MaterielForm />}

      {/* Tableau du stock */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Inventaire des matériels <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">{filteredMateriels.length}</span>
          </h2>
        </div>
        {selectedStock && (<StockManager selectedStock={selectedStock} setSelectedStock={setSelectedStock} setStocks={setData} newDesignation={newDesignation} setNewDesignation={setNewDesignation} newUnite={newUnite} setNewUnite={setNewUnite}/>)}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Référence</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Désignation</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Catégorie</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantité</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Seuil</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Département</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {filteredMateriels.map((mat, id) => (
                <tr key={id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-blue-600">{mat.reference}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{mat.designation}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{mat.categorie}</td>
                  <td className={`px-6 py-4 text-sm ${getQuantiteStyle(mat.quantite_actuelle, mat.seuil_alerte)}`}>
                    {mat.quantite_actuelle}
                    {mat.quantite_actuelle <= mat.seuil_alerte && ' ⚠️'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{mat.seuil_alerte}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{mat.departement}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                      onClick={() => {setSelectedStock(mat);console.log(mat);setNewDesignation(mat.designation);setNewUnite(mat.quantite_actuelle)}}>
                        <Pencil className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Message si aucun résultat */}
          {filteredMateriels.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Aucun matériel trouvé
            </div>
          )}
        </div>
      </div>
    </div>
  )
}