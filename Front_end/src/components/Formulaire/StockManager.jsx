import React, { useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { Plus, Minus } from 'lucide-react';

const StockManager = ({
  selectedStock,
  setSelectedStock,
  mode = "ajouter",        // "ajouter" pour le responsable, "reduire" pour l'inventaire
  onSuccess              // Callback de rafraîchissement
}) => {
  const [quantite, setQuantite] = useState("")
  const [error, setError] = useState("")
  const { patch } = useApi()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    const qty = parseInt(quantite)
    if (!qty || qty <= 0) {
      setError("Veuillez entrer une quantité valide.")
      return
    }

    try {
      if (mode === "ajouter") {
        // Le responsable augmente le stock
        await patch(`/materiel/stock/update/${selectedStock.id}`, {
          quantite_actuelle: selectedStock.quantite_actuelle + qty,
          quantite_ajoutee: qty
        })
      } else {
        // L'inventaire réduit la quantité
        if (qty > selectedStock.quantite) {
          setError(`Quantité insuffisante. Maximum : ${selectedStock.quantite}`)
          return
        }
        await patch(`/materiel/inventaire/update/${selectedStock.id}`, {
          quantite: selectedStock.quantite - qty,
          quantite_reduite: qty
        })
      }

      onSuccess?.()         // Rafraîchir la liste parente
      setSelectedStock(null)
    } catch (err) {
      setError("Une erreur est survenue.")
    }
  }

  if (!selectedStock) return null

  const isAjouter = mode === "ajouter"

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">

        {/* En-tête */}
        <div className="flex items-center gap-3 mb-6">
          <div className={`p-2 rounded-full ${isAjouter ? 'bg-green-100' : 'bg-red-100'}`}>
            {isAjouter
              ? <Plus className="w-5 h-5 text-green-600" />
              : <Minus className="w-5 h-5 text-red-600" />
            }
          </div>
          <div>
            <h3 className="text-lg font-bold">
              {isAjouter ? "Ajouter au stock" : "Réduire l'inventaire"}
            </h3>
            <p className="text-sm text-gray-500">{selectedStock.designation}</p>
          </div>
        </div>

        {/* Infos stock actuel */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Quantité actuelle</span>
            <span className="font-semibold text-gray-900">
              {isAjouter ? selectedStock.quantite_actuelle : selectedStock.quantite}
              {' '}{selectedStock.unite}
            </span>
          </div>
          {!isAjouter && (
            <div className="flex justify-between mt-1">
              <span>Après réduction</span>
              <span className="font-semibold text-red-600">
                {Math.max(0, selectedStock.quantite - (parseInt(quantite) || 0))}
                {' '}{selectedStock.unite}
              </span>
            </div>
          )}
          {isAjouter && (
            <div className="flex justify-between mt-1">
              <span>Après ajout</span>
              <span className="font-semibold text-green-600">
                {selectedStock.quantite_actuelle + (parseInt(quantite) || 0)}
                {' '}{selectedStock.unite}
              </span>
            </div>
          )}
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Quantité à {isAjouter ? "ajouter" : "retirer"}
            </label>
            <input
              type="number"
              min="1"
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={quantite}
              onChange={(e) => setQuantite(e.target.value)}
              autoFocus
            />
            {error && (
              <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setSelectedStock(null)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Annuler
            </button>
            <button
              type="submit"
              className={`px-4 py-2 text-white rounded-lg ${
                isAjouter
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {isAjouter ? "Ajouter" : "Retirer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default StockManager