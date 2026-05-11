import { useState, useEffect } from "react";

const SECTIONS = ["Catégorie", "Matériel"];

export default function CategorieForm() {
  const [active, setActive] = useState(0);

  // Formulaires
  const [categorie, setCategorie] = useState({ nom: "", description: "" });
  const [materiel, setMateriel] = useState({ reference: "", designation: "", categorie: "", unite: "" });

  // Données distantes
  const [categories, setCategories] = useState([]);
  const [materiels, setMateriels] = useState([]);
  const [departements, setDepartements] = useState([]);

  // États
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  // 🔧 Fonction pour générer une référence automatique
  const generateReference = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `MAT-${year}${month}${day}-${random}`;
  };

  // 🔧 Générer référence basée sur le dernier ID
  const generateReferenceFromLastId = () => {
    const lastId = materiels.length > 0 ? Math.max(...materiels.map(m => {
      const id = parseInt(m.id);
      return isNaN(id) ? 0 : id;
    })) : 0;
    const newId = (lastId + 1).toString().padStart(5, '0');
    return `MAT-${newId}`;
  };

  useEffect(() => {
    const load = async () => {
      try {
        const [c, m, d] = await Promise.all([
          fetch("http://localhost:8000/materiel/categorie", { headers }).then(r => r.json()),
          fetch("http://localhost:8000/materiel/materiel", { headers }).then(r => r.json()),
          fetch("http://localhost:8000/departement/", { headers }).then(r => r.json()),
        ]);
        setCategories(c || []);
        console.log("Catégories chargées:", c);
        setMateriels(m || []);
        setDepartements(d || []);
      } catch (e) {
        console.error("Erreur chargement données", e);
      }
    };
    load();
  }, []);

  // 🔧 Quand on ouvre la section Matériel, générer une référence auto
  useEffect(() => {
    if (active === 1) { // Section Matériel
      const autoRef = generateReferenceFromLastId();
      setMateriel(prev => ({ ...prev, reference: autoRef }));
    }
  }, [active, materiels]);

  const reset = () => {
    setError("");
    setSuccess("");
  };

  const handleSubmitCategorie = async (e) => {
    e.preventDefault();
    setLoading(true); reset();
    try {
      const res = await fetch("http://localhost:8000/materiel/categorie", {
        method: "POST", headers,
        body: JSON.stringify(categorie),
      });
      if (!res.ok) throw new Error((await res.json()).detail || "Erreur");
      const created = await res.json();
      setCategories([...categories, created]);
      setCategorie({ nom: "", description: "" });
      setSuccess("Catégorie créée avec succès !");
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const handleSubmitMateriel = async (e) => {
    e.preventDefault();
    setLoading(true); 
    reset();
    try {
      const res = await fetch("http://localhost:8000/materiel/materiel", {
        method: "POST", 
        headers,
        body: JSON.stringify({
          reference: materiel.reference, // Référence auto
          designation: materiel.designation,
          categorie: materiel.categorie,
          unite: materiel.unite
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Erreur lors de la création");
      }

      const created = await res.json();
      
      // Mise à jour de la liste locale
      setMateriels([...materiels, created]);
      
      // Générer nouvelle référence pour le prochain
      const newRef = generateReferenceFromLastId();
      setMateriel({ reference: newRef, designation: "", categorie: "", unite: "" });
      setSuccess("Matériel créé avec succès !");
    } catch (err) { 
      setError(err.message); 
    } finally { 
      setLoading(false); 
    }
  };

  const inputClass = "w-full px-4 py-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition placeholder-gray-400";

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
              <Buttons loading={loading} onReset={() => setCategorie({ nom: "", description: "" })} />
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
                    disabled  // ← Désactivé, l'utilisateur ne peut pas modifier
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
              <Buttons loading={loading} onReset={() => setMateriel({ 
                reference: generateReferenceFromLastId(), 
                designation: "", 
                categorie: "", 
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