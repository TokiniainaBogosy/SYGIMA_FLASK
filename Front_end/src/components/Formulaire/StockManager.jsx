import React, { useState, useEffect } from 'react';
import { useApi } from '../../hooks/useApi';
const StockManager = ({ selectedStock, setSelectedStock, setStocks, newDesignation, setNewDesignation, newUnite, setNewUnite }) => {

  // 3. Envoyer la modification (PATCH)
  const { patch } = useApi();

const handleUpdate = async (e) => {
  e.preventDefault()
  try {
    await patch(
      `/materiel/stock/update/${selectedStock.id}`,
      { designation: newDesignation, quantite_actuelle: newUnite }
    )
    setStocks(prev =>
      prev.map(s =>
        s.id === selectedStock.id
          ? { ...s, designation: newDesignation, unite: newUnite }
          : s
      )
    )
    setSelectedStock(null)
  } catch (err) { /* error géré par le hook */ }
}

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Gestion des Stocks</h2>

        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Modifier le Stock</h3>
            <form onSubmit={handleUpdate}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Designation : {newDesignation}</label>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Quantite</label>
                <input 
                  type="text"
                  className="w-full border p-2 rounded"
                  value={newUnite}
                  onChange={(e) => setNewUnite(e.target.value)}
                  autoFocus
                />
            </div>
                
              <div className="flex justify-end gap-2">
                <button 
                  type="button"
                  onClick={() => setSelectedStock(null)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      
    </div>
  );
};

export default StockManager;