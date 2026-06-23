import React, { useState, useEffect } from 'react';
import { useApi } from '../../hooks/useApi';
import Switch from '../ui/Switch';
const UserManager = ({ selectedUser , setSelectedUser , setCategories , newNom,newEmail,setNewEmail,setNewNom, newPrenom, setNewPrenom,setNewDepartement,newDepartement,newRole,setNewRole,newActivity,setNewActivity,listRoles,listDepartements,setUtilisateurs}) => {

  const { patch } = useApi()

const handleUpdate = async (e) => {
  e.preventDefault()
  try {
    await patch(
      `/user/update/${selectedUser.id}`,
      { nom: newNom, prenom: newPrenom, email:newEmail,role:newRole,departement_id:newDepartement,is_active:newActivity}
    )
    setUtilisateurs(prev =>
      prev.map(user =>
        user.id === selectedUser.id ? { ...user,nom: newNom, prenom: newPrenom, email: newEmail, role: newRole, departement_id: newDepartement, is_active: newActivity} : user
      )
    )
    setSelectedUser(null)
  } catch (err) { /* error géré par le hook */ }
}

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Modifier les informations de l'utilisateur</h2>
      
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
            <h3 className="text-lg font-bold mb-4">Modifier l'utilisateur'</h3>
            <form onSubmit={handleUpdate}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Nom</label>
                <input 
                  type="text"
                  className="w-full border p-2 rounded"
                  value={newNom}
                  onChange={(e) => setNewNom(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Prenom</label>
                <input 
                  type="text"
                  className="w-full border p-2 rounded"
                  value={newPrenom}
                  onChange={(e) => setNewPrenom(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">E-mail</label>
                <input 
                  type="text"
                  className="w-full border p-2 rounded"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Departement</label>
                <select 
                  value={newDepartement}
                  onChange = {(e)=>setNewDepartement(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg">
                  {listDepartements?.map((dep) => ( 
                      <option key={dep.nom} value={dep.nom}>{dep.nom}</option>     
                  ))}
                </select>
              </div>
              {/* Remplace l'ancien bloc "Compte active" par celui-ci */}
              <div className="mb-4 flex flex-col gap-2">
                <label className="block text-sm font-medium text-gray-700">Compte actif</label>
                
                <div className="flex items-center gap-3 mt-1">
                  {/* On passe la valeur et la fonction de modification */}
                  <Switch 
                    checked={newActivity} 
                    onChange={(e) => setNewActivity(e.target.checked)} 
                  />
                  
                  {/* Petit indicateur textuel à côté (optionnel mais sympa) */}
                  <span className="text-sm font-medium text-gray-600">
                    {newActivity ? 'Oui (Actif)' : 'Non (Inactif)'}
                  </span>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Role</label>
                <select 
                  value={newRole}
                  onChange = {(e)=>setNewRole(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg">
                
                  <option key="EMPLOYE" value="EMPLOYE">EMPLOYE</option>     
                  <option key="RESPONSABLE" value="REPSONSABLE">RESPONSABLE</option>
                  
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button 
                  type="button"
                  onClick={() => setSelectedUser(null)}
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

export default UserManager;