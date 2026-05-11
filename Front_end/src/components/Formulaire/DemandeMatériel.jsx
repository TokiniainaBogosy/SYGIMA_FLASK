import { useEffect, useState } from 'react'
import api from '../../api'

const ligneParcDefaut = {
  type_materiel: '',
  quantite: 1,
}

const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };

function DemandeMateriel() {
  const [entete, setEntete] = useState({
    date_souhaitee: '',
    justification: ''
  })

  const [lignes, setLignes] = useState([{ ...ligneParcDefaut }])
  const [message, setMessage] = useState(null)

  const handleEnteteChange = (e) => {
    setEntete({ ...entete, [e.target.name]: e.target.value })
  }

  const handleLigneChange = (index, e) => {
    const nouvelleLignes = [...lignes]
    nouvelleLignes[index][e.target.name] = e.target.value
    setLignes(nouvelleLignes)
  }

  const ajouterLigne = () => {
    setLignes([...lignes, { ...ligneParcDefaut }])
  }

  const supprimerLigne = (index) => {
    if (lignes.length === 1) return
    setLignes(lignes.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await api.post('demande/', { ...entete, lignes })
      const numero = response.data.numero_demande
      setMessage({ type: 'succes', texte: `Demande envoyée ! Votre numéro : ${numero}` })
      // Réinitialisation sans nom ni service
      setEntete({ date_souhaitee: '', justification: '' })
      setLignes([{ ...ligneParcDefaut }])
    } catch (error) {
      setMessage({ type: 'erreur', texte: "Erreur lors de l'envoi. Réessayez." })
    }
  }

  const [materiels, setMateriels] = useState([]);
  const [demande, setDemande] = useState({ materiel_id: "", quantite: "" });

  useEffect(()=>{
    const load = async ()=>{
      try{
        const response = await fetch('http://127.0.0.1:8000/materiel/materiel',{
            method: 'GET', headers});
          const result = await response.json();
          setMateriels(result);
      }
      catch(error){
          console.error("Erreur lors de la récupération:", error);
      }
    }
    load()
  },[])

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-3xl p-8">

        <h2 className="text-2xl font-bold text-gray-800 mb-1">Demande de matériel</h2>
        <p className="text-gray-500 text-sm mb-6">Remplissez les informations nécessaires pour votre demande.</p>

        {message && (
          <div className={`mb-6 px-4 py-3 rounded-lg text-sm font-medium ${
            message.type === 'succes' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {message.texte}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* ── EN-TÊTE ── */}
          <div>
            <h3 className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-4">
              Détails de la demande
            </h3>
            <div className="grid grid-cols-1 gap-4">

              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date souhaitée</label>
                <input
                  type="date"
                  name="date_souhaitee"
                  value={entete.date_souhaitee}
                  onChange={handleEnteteChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div> */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Justification globale</label>
                <textarea
                  name="justification"
                  value={entete.justification}
                  onChange={handleEnteteChange}
                  rows="3"
                  required
                  placeholder="Expliquez le contexte de votre demande..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

            </div>
          </div>

          {/* ── LIGNES ── */}
          <div>
            <h3 className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-4">
              Matériel demandé
            </h3>

            <div className="space-y-3">
              {lignes.map((ligne, index) => (
                <div key={index} className="grid grid-cols-12 gap-3 items-end bg-gray-50 border border-gray-200 rounded-xl p-4">

                  <div className="col-span-1 flex items-center justify-center">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                      {index + 1}
                    </span>
                  </div>

                  <div className="col-span-8">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Type de matériel</label>
                    {/* <input
                      type="text"
                      name="type_materiel"
                      value={ligne.type_materiel}
                      onChange={(e) => handleLigneChange(index, e)}
                      required
                      placeholder="Ordinateur, écran, accessoires..."
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    /> */}
                    <select
                      /* On utilise materiel.categorie qui stockera maintenant le NOM */
                      value={ligne.type_materiel}
                      name="type_materiel" 
                      onChange={(e) => handleLigneChange(index, e)}
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Sélectionner un materiel</option>
                      {materiels.map((m, index, tableauEntier) => {
                        const elementPrecedent = tableauEntier[index - 1];
                        const isDuplicate = index > 0 && m.designation === elementPrecedent.designation;
                        if (!isDuplicate) {
                          return (
                            <option key={m.id} value={m.designation}>
                              {m.designation}
                            </option>
                          );
                        }
                        return null; 
                      })}
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Quantité</label>
                    <input
                      type="number"
                      name="quantite"
                      value={ligne.quantite}
                      onChange={(e) => handleLigneChange(index, e)}
                      min="1"
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="col-span-1 flex justify-center">
                    <button
                      type="button"
                      onClick={() => supprimerLigne(index)}
                      disabled={lignes.length === 1}
                      className="text-red-400 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed text-lg font-bold"
                      title="Supprimer cette ligne"
                    >
                      ✕
                    </button>
                  </div>

                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={ajouterLigne}
              className="mt-3 w-full border-2 border-dashed border-blue-300 text-blue-500 hover:border-blue-500 hover:text-blue-700 rounded-xl py-2 text-sm font-medium transition-colors duration-200"
            >
              + Ajouter un article
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors duration-200"
          >
            Envoyer la demande
          </button>

        </form>
      </div>
    </div>
  )
}

export default DemandeMateriel