import { useState } from 'react'
import { useApi } from '../../hooks/useApi';
import StockManager from '../../components/Formulaire/StockManager';
import { useAuth } from '../../context/AuthContext';
import { Minus } from 'lucide-react'
import { Search, Plus, Pencil, Trash2, Package, Tag,
  Download } from 'lucide-react'
import api from "../../services/api";

const StockDepartement = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchCategorie, setSearchCategorie] = useState('')
  const [searchDepartement, setSearchDepartement] = useState('')
  const [selectedStock, setSelectedStock] = useState(null)
  const { user } = useAuth()

  const { data: stocklist, loading: stocklistLoading, error: stocklistError, refetch } =
    useApi('materiel/inventaire')  // ← refetch extrait du hook

  const materiels = stocklist?.filter(stock => stock.sous_categorie == "equipement") || []

  const categories = [...new Set(materiels.map(mat => mat.categorie).filter(Boolean))]
  const departements = [...new Set(materiels.map(mat => mat.departement).filter(Boolean))]

  const handleExportInventairePdf = async () => {
    try {
        const response = await api.get(
            "/materiel/inventaire/pdf",
            {
                responseType: "blob",
            }
        );

        const url = window.URL.createObjectURL(
            new Blob([response.data], {
                type: "application/pdf",
            })
        );

        const link = document.createElement("a");

        link.href = url;
        link.download = "rapport_inventaire.pdf";

        document.body.appendChild(link);

        link.click();

        link.remove();

        window.URL.revokeObjectURL(url);

    } catch (error) {
        console.error(
            "Erreur lors de l'export de l'inventaire :",
            error
        );

        alert(
            "Impossible de générer le rapport de l'inventaire."
        );
    }
  };

  const getQuantiteStyle = (quantite) => {
    if (quantite <= 0) return 'text-red-600 font-bold'
    return 'text-green-600 font-bold'
  }

  const filteredMateriels = materiels.filter((mat) => {
    const matchSearch = mat.designation?.toLowerCase().includes(searchTerm.toLowerCase()) || false
    const matchCategorie = searchCategorie === '' || mat.categorie === searchCategorie
    const matchDepartement = searchDepartement === '' || mat.departement === searchDepartement
    return matchSearch && matchCategorie && matchDepartement
  })

  if (stocklistLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    )
  }

  if (stocklistError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-800 font-medium">Erreur de chargement</p>
        <p className="text-red-600 text-sm">{stocklistError}</p>
      </div>
    )
  }

  return (
    <div className="w-full px-6 lg:px-10 py-8 space-y-6">

      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventaire du département</h1>
          <p className="text-gray-500 mt-1">Matériels distribués aux employés</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => {
              handleExportInventairePdf();
            }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" /> 
              Exporter
          </button>
        </div>
      </div>
      

      {/* Filtres */}
      <div className="flex flex-wrap gap-4 items-center">
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

        {user?.role === 'admin' && (
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
        )}

        <input
          type="text"
          placeholder="Rechercher un matériel..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
        />
      </div>

      {/* Modal StockManager */}
      {selectedStock && (
        <StockManager
          selectedStock={selectedStock}
          setSelectedStock={setSelectedStock}
          mode="reduire"
          onSuccess={() => {
            refetch()              // ← rafraîchit la liste
            setSelectedStock(null)
          }}
        />
      )}

      {/* Tableau */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Inventaire des matériels{' '}
            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
              {filteredMateriels.length}
            </span>
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Référence</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Désignation</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Catégorie</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employé</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantité</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unité</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Département</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mis à jour</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredMateriels.map((mat) => (  // ← key sur mat.id, pas l'index
                <tr key={mat.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-blue-600">{mat.reference}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{mat.designation}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{mat.categorie}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{mat.employe_prenom} {mat.employe_nom}</td>
                  <td className={`px-6 py-4 text-sm ${getQuantiteStyle(mat.quantite)}`}>
                    {mat.quantite}
                    {mat.quantite <= 0 && ' ⚠️'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{mat.unite}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{mat.departement}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {mat.updated_at ? new Date(mat.updated_at).toLocaleDateString('fr-FR') : '—'}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      className="p-1.5 bg-red-50 hover:bg-red-100 rounded"
                      onClick={() => setSelectedStock(mat)}
                    >
                      <Minus className="w-4 h-4 text-red-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

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

export default StockDepartement