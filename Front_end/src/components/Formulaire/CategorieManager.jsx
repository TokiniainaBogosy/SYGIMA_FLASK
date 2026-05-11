import React, { useState, useEffect } from 'react';

const CategorieManager = ({ selectedCategorie , setSelectedCategorie , setCategories , newName, setNewName, newDescription, setNewDescription }) => {
//   const [categories, setCategories] = useState([]);
//   const [editingCategorie, setEditingCategorie] = useState(null); // Stocke la catégorie en cours de modif
  

//   // 1. Charger les catégories
//   const fetchCategories = async () => {
//     const res = await fetch('http://127.0.0.1:8000/api/v1/materiel/categorie');
//     const data = await res.json();
//     setCategories(data);
//   };

//   useEffect(() => { fetchCategories(); }, []);

  // 2. Ouvrir le mode édition
//   const openEdit = (cat) => {
//     setEditingCategorie(cat);
//     setNewName(cat.nom); // On pré-remplit l'input avec le nom actuel
//   };

  // 3. Envoyer la modification (PATCH)
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://127.0.0.1:8000/materiel/categorie/update/${selectedCategorie.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom: newName , description: newDescription }),
      });

      if (response.ok) {
        setSelectedCategorie(null); // Fermer le modal
        setCategories(prev => prev.map(cat => cat.id === selectedCategorie.id ? { ...cat, nom: newName } : cat)); // Rafraîchir la liste
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Gestion des Catégories</h2>
      
      {/* Tableau des catégories */}
      {/* <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="border p-2">Nom</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(cat => (
            <tr key={cat.id}>
              <td className="border p-2">{cat.nom}</td>
              <td className="border p-2">
                <button 
                  onClick={() => openEdit(cat)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Modifier
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table> */}

      {/* Modal d'édition (s'affiche seulement si editingCategorie n'est pas null) */}
      
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Modifier la catégorie</h3>
            <form onSubmit={handleUpdate}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Nom de la catégorie</label>
                <input 
                  type="text"
                  className="w-full border p-2 rounded"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Description</label>
                <input 
                  type="text"
                  className="w-full border p-2 rounded"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="flex justify-end gap-2">
                <button 
                  type="button"
                  onClick={() => setSelectedCategorie(null)}
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

export default CategorieManager;