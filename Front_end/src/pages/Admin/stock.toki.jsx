import { useState } from 'react'
import MaterielForm from '../../components/Formulaire/MaterielForm';
import { useApi } from '../../hooks/useApi';

export default function Stock() {
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchCategorie, setsearchCategorie] = useState('')

  // Chargement des données via useApi
  const { data, loading, error } = useApi('/api/v1/materiel/stockList')

  const materiels = data || []  // évite le crash si data est null au départ

  const getQuantiteStyle = (quantite, seuil) => {
    if (quantite <= seuil) return 'text-red-600 font-bold'
    return 'text-green-600 font-bold'
  }

  const filteredMateriels = materiels.filter((mat) => {
    const matchSearch = mat.designation.toLowerCase().includes(searchTerm.toLowerCase())
    const matchCategorie = mat.categorie.toLowerCase().includes(searchCategorie.toLowerCase())
    return matchSearch && matchCategorie
  })

  const categories = [...new Set(materiels.map(mat => mat.categorie))]

  // Optionnel mais recommandé : gérer loading et error
  if (loading) return <p>Chargement...</p>
  if (error) return <p>Erreur : {error}</p>

  return (
    <div>
      {/* En-tête de la page */}
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold text-gray-900">Stock</h1>
            <p className="text-gray-500 mt-1">
                Gestion des matériels et inventaire
            </p>
        </div>
        {/* Recherche */}
      <div className="mb-6">
        {/* <select>

        </select> */}
        <select 
            value={searchCategorie}
            onChange={(e) => setsearchCategorie(e.target.value)}
          >
            <option value="">Toutes les catégories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
        </select>
        <input
          type="text"
          placeholder="Rechercher un matériel..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

            {/* Bouton pour ajouter un matériel */}
            <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition flex items-center gap-2"
            >
            <span className="text-xl">+</span>
            Nouveau matériel
            </button>
      </div>

      {/* Formulaire d'ajout (visible quand on clique sur le bouton) */}
      {showForm && 
        (<MaterielForm/>)
      }

      {/* Tableau du stock */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">
            Inventaire des matériels
          </h2>

          {/* Barre de recherche */}
          <input
            type="text"
            placeholder="🔍 Rechercher..."
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Référence
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Désignation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Catégorie
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Quantité
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Seuil
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Département
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {filteredMateriels.map((mat) => (
                <tr key={mat.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-blue-600">
                    {mat.reference}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {mat.designation}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {mat.categorie}
                  </td>
                  <td className={`px-6 py-4 text-sm ${getQuantiteStyle(mat.quantite, mat.seuil)}`}>
                    {mat.quantite_actuelle}
                    {/* Affiche une icône d'alerte si stock bas */}
                    {mat.quantite <= mat.seuil && ' (stock faible)'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {mat.seuil_alerte}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {mat.departement}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200">
                        ✏️ Modifier
                      </button>
                      <button className="px-3 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200">
                        🗑️ Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}