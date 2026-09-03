import { useState, useEffect } from "react";

import { useApi } from "../../hooks/useApi"; 

const SECTIONS = ["Catégorie", "Matériel"];

export default function CategorieForm() {
  const [active, setActive] = useState(0);

  const [categorie, setCategorie] = useState({ nom: "",description: "" });
  const [materiel, setMateriel] = useState({ reference: "", designation: "", categorie: "",sous_categorie: "", unite: "" });

  const [success, setSuccess] = useState("");

  // GET automatiques — remplace useEffect + fetch + les 3 useState
  const { data: categories, loading: loadingCat }    = useApi("/materiel/categorie")
  const { data: materiels,  loading: loadingMat }    = useApi("/materiel/materiel")
  const { data: departements }                       = useApi("/departement/")

  // Pour les POST
  const { post, loading, error } = useApi()

  // Générer référence basée sur le dernier ID
  const generateReferenceFromLastId = () => {
    const list = materiels || []
    const lastId = list.length > 0
      ? Math.max(...list.map(m => { const id = parseInt(m.id); return isNaN(id) ? 0 : id }))
      : 0
    return `MAT-${(lastId + 1).toString().padStart(5, "0")}`
  }

  // Quand on ouvre la section Matériel, générer une référence auto
  useEffect(() => {
    if (active === 1 && materiels) {
      setMateriel(prev => ({ ...prev, reference: generateReferenceFromLastId() }))
    }
  }, [active, materiels])

  const reset = () => setSuccess("")

  const handleSubmitCategorie = async (e) => {
    e.preventDefault()
    reset()
    try {
      await post("/materiel/categorie", categorie)
      setCategorie({ nom: "", description: "" })
      setSuccess("Catégorie créée avec succès !")
    } catch (err) { /* error géré par le hook */ }
  }

  const handleSubmitMateriel = async (e) => {
    e.preventDefault()
    reset()
    try {
      await post("/materiel/materiel", {
        reference:   materiel.reference,
        designation: materiel.designation,
        categorie:   materiel.categorie,
        sous_categorie: materiel.sous_categorie,
        unite:materiel.unite,
      })
      setMateriel({ reference: generateReferenceFromLastId(), designation: "", categorie: "", sous_categorie: "", unite: "" })
      setSuccess("Matériel créé avec succès !")
    } catch (err) { /* error géré par le hook */ }
  }

  const inputClass = "w-full px-4 py-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition placeholder-gray-400"
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg">

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Gestion des matériels</h1>
            <p className="text-sm text-gray-500 mt-1">Créez une catégorie, un matériel ou ajoutez du stock</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6">
            {SECTIONS.map((s, i) => (
              <button
                key={i}
                onClick={() => { setActive(i); reset(); }}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  active === i
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Feedback */}
          {success && (
            <div className="mb-5 px-4 py-3 bg-green-50 border border-green-100 rounded-xl flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-sm text-green-600">{success}</p>
            </div>
          )}
          {error && (
            <div className="mb-5 px-4 py-3 bg-red-50 border border-red-100 rounded-xl">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Section Catégorie */}
          {active === 0 && (
            <form onSubmit={handleSubmitCategorie} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nom de la catégorie</label>
                <input
                  type="text"
                  value={categorie.nom}
                  onChange={e => setCategorie({ ...categorie, nom: e.target.value })}
                  placeholder="ex: Informatique"
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                <textarea
                  value={categorie.description}
                  onChange={e => setCategorie({ ...categorie, description: e.target.value })}
                  placeholder="Décrivez la catégorie..."
                  rows={3}
                  className={inputClass + " resize-none"}
                />
              </div>
              <Buttons loading={loading} onReset={() => setCategorie({ nom: "",description: "" })} />
            </form>
          )}

          {/* Section Matériel avec RÉFÉRENCE AUTO */}
          {active === 1 && (
            <form onSubmit={handleSubmitMateriel} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Référence</label>
                  <input
                    type="text"
                    value={materiel.reference}
                    disabled
                    className={`${inputClass} bg-gray-100 cursor-not-allowed`}
                  />
                  <p className="text-xs text-gray-400 mt-1">Générée automatiquement</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Unité</label>
                  <input
                    type="text"
                    value={materiel.unite}
                    onChange={e => setMateriel({ ...materiel, unite: e.target.value })}
                    placeholder="ex: pièce, kg"
                    required
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Désignation</label>
                <input
                  type="text"
                  value={materiel.designation}
                  onChange={e => setMateriel({ ...materiel, designation: e.target.value })}
                  placeholder="ex: Ordinateur portable Dell"
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Catégorie</label>
                <select
                  value={materiel.categorie} 
                  onChange={e => setMateriel({ ...materiel, categorie: e.target.value })}
                  required
                  className={inputClass}
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map((c, index) => (
                    <option key={index} value={c.nom}>
                      {c.nom}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Sous catégorie</label>
                <select
                  value={materiel.sous_categorie}
                  onChange={e => setMateriel({ ...materiel, sous_categorie: e.target.value })}
                  className={inputClass}
                >
                  <option value="">Sélectionner une sous-catégorie</option>
                  <option value="Equipement">Equipement</option>
                  <option value="Consommable">Consommable</option>
                </select>
              </div>
              <Buttons loading={loading} onReset={() => setMateriel({ 
                reference: generateReferenceFromLastId(), 
                designation: "", 
                categorie: "", 
                sous_categorie: "",
                unite: "" 
              })} />
            </form>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          SYGIMA — Système de Gestion d'Inventaire et de Demandes de Matériel
        </p>

      </div>
    </div>
  );
}

function Buttons({ loading, onReset }) {
  return (
    <div className="flex gap-3 pt-2">
      <button
        type="button"
        onClick={onReset}
        className="flex-1 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-xl transition-colors duration-200"
      >
        Réinitialiser
      </button>
      <button
        type="submit"
        disabled={loading}
        className="flex-1 py-2.5 px-4 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white text-sm font-medium rounded-xl transition-colors duration-200"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            Enregistrement...
          </span>
        ) : "Enregistrer"}
      </button>
    </div>
  );
}