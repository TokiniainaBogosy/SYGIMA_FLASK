import { use, useEffect, useState } from 'react'
import { useApi } from '../../hooks/useApi'
import { Search, Plus, Pencil, Trash2, Package, Tag } from 'lucide-react'
import CategorieManager from '../../components/Formulaire/CategorieManager'
import MaterielManager from '../../components/Formulaire/MaterielManager'
import CategorieForm from '../../components/Formulaire/CategorieForm'

export default function Materiel() {
  const [showForm, setShowForm] = useState(false)
  const [searchCat, setSearchCat] = useState('')
  const [searchMat, setSearchMat] = useState('')
  const [selectedCategorie, setSelectedCategorie] = useState(null)
  const [selectedMateriel, setSelectedMateriel] = useState(null)
  const [newUnite, setNewUnite] = useState("");
  const [newDesignation, setNewDesignation] = useState("");
  const [data,setData] = useState([])
  const [newName,setNewName] = useState("");
  const [newDescription,setNewDescription] = useState("");
  const [newCategorie,setNewCategorie] = useState("")
  const [newReference,setNewReference] = useState("")

  // ─── GET avec useApi ──────────────────────────────
  const { data: categories, loading: catLoading } = useApi('/materiel/categorie')
  const { data: materiels, loading: matLoading } = useApi('/materiel/materielList')
  console.log(materiels)
  useEffect(() => {
    setCategoriesData(categories || [])
    setMaterielsData(materiels || [])
  }, [categories, materiels]) // On peut faire un useEffect pour logger les données si besoin
  const [categoriesData, setCategoriesData] = useState([])
  const [materielsData, setMaterielsData] = useState([])
  // ─── DELETE avec useApi ───────────────────────────
  const { del } = useApi()

  const handleDelete = async (id, type) => {
    if (!window.confirm("Supprimer ?")) return
    try {
      await del(`/materiel/${type}/${id}`)
      window.location.reload() // ou re-fetch
    } catch (e) {
      alert("Erreur suppression")
    }
  }

  // Filtres
  const filteredCategories = categoriesData?.filter(c => 
    c.nom.toLowerCase().includes(searchCat.toLowerCase())
  ) || []

  const filteredMateriels = materielsData?.filter(m => 
    m.designation.toLowerCase().includes(searchMat.toLowerCase()) ||
    m.reference.toLowerCase().includes(searchMat.toLowerCase())
  ) || []

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories et Materiels existants</h1>
          <p className="text-gray-500">Gestion des matériels et catégories</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Nouveau
        </button>
      </div>

      {showForm && <CategorieForm />}

      {/* ─── DEUX COLONNES CÔTE À CÔTE ───────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* ═══ COLONNE GAUCHE : CATÉGORIES ═══ */}
        <div className="bg-white rounded-xl border border-gray-200 flex flex-col h-[600px]">
          {/* Header */}
          <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Tag className="w-5 h-5 text-blue-600" />
              <h2 className="font-semibold text-gray-900">Catégories</h2>
              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                {filteredCategories.length}
              </span>
            </div>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Filtrer..."
                value={searchCat}
                onChange={(e) => setSearchCat(e.target.value)}
                className="pl-9 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Liste scrollable */}
          <div className="flex-1 overflow-y-auto">
            {catLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                    <th className="px-5 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredCategories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-gray-50">
                      <td className="px-5 py-3 text-sm font-medium text-blue-600">{cat.nom}</td>
                      <td className="px-5 py-3 text-sm text-gray-500 truncate max-w-[200px]">{cat.description}</td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => {setSelectedCategorie(cat);setNewName(cat.nom);setNewDescription(cat.description)}}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(cat.id, 'categorie')}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* ═══ COLONNE DROITE : MATÉRIELS ═══ */}
        <div className="bg-white rounded-xl border border-gray-200 flex flex-col h-[600px]">
          {/* Header */}
          <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-green-600" />
              <h2 className="font-semibold text-gray-900">Matériels</h2>
              <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                {filteredMateriels.length}
              </span>
            </div>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Référence, désignation..."
                value={searchMat}
                onChange={(e) => setSearchMat(e.target.value)}
                className="pl-9 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>
          </div>

          {/* Liste scrollable */}
          <div className="flex-1 overflow-y-auto">
            {matLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600" />
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Référence</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Désignation</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Catégorie</th>
                    <th className="px-5 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredMateriels.map((mat) => (
                    <tr key={mat.id} className="hover:bg-gray-50">
                      <td className="px-5 py-3 text-sm font-mono text-blue-600">{mat.reference}</td>
                      <td className="px-5 py-3 text-sm text-gray-900">{mat.designation}</td>
                      <td className="px-5 py-3 text-sm text-gray-500 hidden sm:table-cell">{mat.categorie}</td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => {setSelectedMateriel(mat);setNewDesignation(mat.designation);setNewUnite(mat.unite);setNewCategorie(mat.categorie);setNewReference(mat.reference)}}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(mat.id, 'materiel')}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>

      {/* Modales */}
      {selectedCategorie && (
        <CategorieManager 
          selectedCategorie={selectedCategorie} 
          setSelectedCategorie={setSelectedCategorie}
          newName={newName}
          setNewName={setNewName}
          newDescription={newDescription}
          setNewDescription={setNewDescription}
          setCategories={setCategoriesData}
          setMateriels={setMaterielsData}

        />
      )}
      {selectedMateriel && (
        <MaterielManager 
          selectedMateriel={selectedMateriel} 
          newReference={newReference}
          setNewReference={setNewReference}
          setSelectedMateriel={setSelectedMateriel}
          newDesignation={newDesignation}
          setNewDesignation={setNewDesignation}
          newUnite={newUnite}
          setNewUnite={setNewUnite}
          newCategorie={newCategorie}
          setNewCategorie={setNewCategorie}
          listCategorie={categories}
          setCategories={setCategoriesData}
          setMateriels={setMaterielsData}
        />
      )}
    </div>
  )
}