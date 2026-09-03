import { useEffect, useState, useRef } from 'react'
import { useApi } from '../../hooks/useApi'
import { Search, Plus, Pencil, Trash2, Package, Tag, Download, Upload, X, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react'
import CategorieManager from '../../components/Formulaire/CategorieManager'
import MaterielManager from '../../components/Formulaire/MaterielManager'
import CategorieForm from '../../components/Formulaire/CategorieForm'
import api from "../../services/api";

export default function Materiel() {
  const [showForm, setShowForm] = useState(false)
  const [searchCat, setSearchCat] = useState('')
  const [searchMat, setSearchMat] = useState('')
  const [selectedCategorie, setSelectedCategorie] = useState(null)
  const [selectedMateriel, setSelectedMateriel] = useState(null)
  const [newUnite, setNewUnite] = useState("");
  const [newDesignation, setNewDesignation] = useState("");
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newCategorie, setNewCategorie] = useState("")
  const [newReference, setNewReference] = useState("")

  // Import CSV
  const [showImportModal, setShowImportModal] = useState(false)
  const [importType, setImportType] = useState('materiel') // 'materiel' | 'categorie'
  const [importFile, setImportFile] = useState(null)
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState(null) // { success, created, errors: [] }
  const fileInputRef = useRef(null)

  // Chargement avec useApi
  const { data: categories, loading: catLoading } = useApi('/materiel/categorie')
  const { data: materiels, loading: matLoading } = useApi('/materiel/materielList')

  const [categoriesData, setCategoriesData] = useState([])
  const [materielsData, setMaterielsData] = useState([])

  useEffect(() => {
    setCategoriesData(categories || [])
    setMaterielsData(materiels || [])
  }, [categories, materiels])

  // Suppression avec useApi
  const { del } = useApi()

  const handleDelete = async (id, type) => {
    if (!window.confirm("Supprimer ?")) return
    try {
      await del(`/materiel/${type}/${id}`)
      window.location.reload()
    } catch (e) {
      alert("Erreur suppression")
    }
  }

  const handleExportMaterielPdf = async () => {
    try {
      const response = await api.get("/materiel/materiel/pdf", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = "catalogue_materiels.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erreur lors de l'export des matériels :", error);
      alert("Impossible de générer le catalogue des matériels.");
    }
  };

  // Ouvre la modale d'import pour un type donné
  const openImportModal = (type) => {
    setImportType(type)
    setImportFile(null)
    setImportResult(null)
    setShowImportModal(true)
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) setImportFile(file)
  }

  const handleImportSubmit = async () => {
    if (!importFile) return
    setImporting(true)
    setImportResult(null)
    try {
      const formData = new FormData()
      formData.append('file', importFile)

      // Endpoint attendu côté backend :
      // POST /materiel/categorie/import  ou  /materiel/materiel/import
      // Réponse attendue : { created: <int>, errors: [{ ligne: <int>, message: <str> }, ...] }
      const response = await api.post(`/materiel/${importType}/import`, formData, {
        headers: { 'Content-Type': undefined }, // annule le défaut JSON de l'instance axios pour laisser le boundary multipart s'ajouter automatiquement
      })

      setImportResult({
        success: true,
        created: response.data.created ?? 0,
        errors: response.data.errors ?? [],
      })
    } catch (error) {
      console.error("Erreur lors de l'import :", error)
      setImportResult({
        success: false,
        message: error.response?.data?.error || "Impossible d'importer le fichier.",
      })
    } finally {
      setImporting(false)
    }
  }

  const closeImportModal = () => {
    // Si des éléments ont été créés, on rafraîchit la liste en fermant
    const shouldReload = importResult?.success && importResult.created > 0
    setShowImportModal(false)
    setImportFile(null)
    setImportResult(null)
    if (fileInputRef.current) fileInputRef.current.value = null
    if (shouldReload) window.location.reload()
  }

  const handleDownloadTemplate = () => {
    const templates = {
      categorie: {
        filename: 'modele_categories.csv',
        content: 'nom;description\nInformatique;Ordinateurs, périphériques et accessoires bureautiques\nMobilier;Bureaux, chaises et rangements\n',
      },
      materiel: {
        filename: 'modele_materiels.csv',
        content: 'reference;designation;unite;categorie;sous_categorie\nINF-001;Ordinateur portable Dell Latitude;unité;Informatique;equipement\nFOU-001;Ramette papier A4;ramette;Fournitures;consommable\n',
      },
    }
    const { filename, content } = templates[importType]
    // \uFEFF = BOM pour qu'Excel détecte l'UTF-8 et affiche correctement les accents
    const blob = new Blob(['\uFEFF' + content], { type: 'text/csv;charset=utf-8;' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
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
    <div className="w-full px-6 lg:px-10 py-8 space-y-8">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories et Materiels existants</h1>
          <p className="text-gray-500">Gestion des matériels et catégories</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleExportMaterielPdf}
            className="inline-flex h-10 min-w-30 items-center justify-center gap-2 px-4 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            Exporter
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex h-10 min-w-30 items-center justify-center gap-2 px-4 bg-[#0D3056] text-white rounded-lg hover:bg-[#1e4e7e]"
          >
            <Plus className="w-4 h-4" />
            Nouveau
          </button>
        </div>
      </div>

      {showForm && <CategorieForm />}

      {/* Deux colonnes côte à côte */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ═══ COLONNE GAUCHE : CATÉGORIES ═══ */}
        <div className="bg-white rounded-xl border border-gray-200 flex flex-col h-[600px]">
          <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Tag className="w-5 h-5 text-blue-600" />
              <h2 className="font-semibold text-gray-900">Catégories</h2>
              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                {filteredCategories.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => openImportModal('categorie')}
                className="px-3 py-1.5 bg-[#0D3056] text-white rounded-lg flex items-center gap-2 hover:bg-[#1e4e7e] text-sm"
              >
                <Upload className="w-4 h-4" />
                Importer
              </button>
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
          </div>

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
                      <td className="px-5 py-3 text-sm font-medium text-[#0D3056]">{cat.nom}</td>
                      <td className="px-5 py-3 text-sm text-gray-500 truncate max-w-[200px]">{cat.description}</td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => { setSelectedCategorie(cat); setNewName(cat.nom); setNewDescription(cat.description) }}
                            className="p-1.5 text-[#58B2B0] hover:bg-blue-50 rounded"
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
          <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-[#E5A03A]" />
              <h2 className="font-semibold text-gray-900">Matériels</h2>
              <span className="bg-[#f7b24c] text-white text-xs px-2 py-0.5 rounded-full">
                {filteredMateriels.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => openImportModal('materiel')}
                className="px-3 py-1.5 bg-[#0D3056] text-white rounded-lg flex items-center gap-2 hover:bg-[#1e4e7e] text-sm"
              >
                <Upload className="w-4 h-4" />
                Importer
              </button>
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
          </div>

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
                      <td className="px-5 py-3 text-sm font-mono text-[#0D3056]">{mat.reference}</td>
                      <td className="px-5 py-3 text-sm text-gray-900">{mat.designation}</td>
                      <td className="px-5 py-3 text-sm text-gray-500 hidden sm:table-cell">{mat.categorie}</td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => { setSelectedMateriel(mat); setNewDesignation(mat.designation); setNewUnite(mat.unite); setNewCategorie(mat.categorie); setNewReference(mat.reference) }}
                            className="p-1.5 text-[#58B2B0] hover:bg-blue-50 rounded"
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

      {/* Modales existantes */}
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
          listCategorie={categoriesData}
          setCategories={setCategoriesData}
          setMateriels={setMaterielsData}
        />
      )}

      {/* Modale d'import CSV */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Importer des {importType === 'categorie' ? 'catégories' : 'matériels'}
              </h3>
              <button onClick={closeImportModal} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {!importResult && (
              <>
                <p className="text-sm text-gray-500 mb-2">
                  Fichier CSV attendu — colonnes :{' '}
                  {importType === 'categorie'
                    ? <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">nom, description</code>
                    : <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">reference, designation, unite, categorie, sous_categorie</code>
                  }
                </p>
                <button
                  type="button"
                  onClick={handleDownloadTemplate}
                  className="text-sm text-[#58B2B0] hover:underline mb-4 inline-flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  Télécharger le modèle
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="w-full text-sm border border-gray-300 rounded-lg p-2 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-[#E8EDF1] file:text-[#0D3056] file:text-sm file:font-medium hover:file:bg-[#dbe3ea]"
                />
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={closeImportModal}
                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    Annuler
                  </button>
                  <button
                    disabled={!importFile || importing}
                    onClick={handleImportSubmit}
                    className="px-3 py-1.5 bg-[#0D3056] text-white rounded-lg flex items-center gap-2 hover:bg-[#1e4e7e] text-sm"
                  >
                    {importing && <Loader2 className="w-4 h-4 animate-spin" />}
                    {importing ? 'Import en cours...' : 'Importer'}
                  </button>
                </div>
              </>
            )}

            {importResult && (
              <div>
                {importResult.success ? (
                  <div className="flex items-start gap-2 bg-[#E7F4F3] border border-[#58B2B0]/30 rounded-lg p-3 mb-3">
                    <CheckCircle2 className="w-5 h-5 text-[#58B2B0] shrink-0 mt-0.5" />
                    <p className="text-sm text-[#0D3056]">
                      {importResult.created} élément(s) importé(s) avec succès.
                    </p>
                  </div>
                ) : (
                  <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <p className="text-sm text-red-800">{importResult.message}</p>
                  </div>
                )}

                {importResult.errors?.length > 0 && (
                  <div className="max-h-40 overflow-y-auto border border-[#E5A03A]/40 bg-[#FCF1E1] rounded-lg p-3 mb-3">
                    <p className="text-xs font-medium text-[#0D3056] mb-1">
                      {importResult.errors.length} ligne(s) ignorée(s) :
                    </p>
                    <ul className="text-xs text-[#8B939A] space-y-0.5">
                      {importResult.errors.map((err, i) => (
                        <li key={i}>Ligne {err.ligne} : {err.message}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex justify-end mt-4">
                  <button
                    onClick={closeImportModal}
                    className="px-4 py-2 text-sm font-medium bg-[#0D3056] text-white hover:bg-[#1e4e7e] rounded-lg"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
