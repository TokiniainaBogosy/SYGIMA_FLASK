import { useState,useEffect } from 'react'

export default function Utilisateur() {
  // State pour afficher/masquer le formulaire
  const [showForm, setShowForm] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [deletingUser, setDeleteUser] = useState(null)

const [data,setData] = useState([])

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect (()=>{
      const fetchData = async () =>{
        try{
          const response = await fetch('http://127.0.0.1:8000/api/v1/user',{
            method: 'GET', headers});
          const result = await response.json();
          setData(result)
        }
        catch(error){
          console.error("Erreur lors de la récupération:", error);
        }
      }
      fetchData();
    },[])  

  // Fausses données utilisateurs (on remplacera par des vraies depuis le Backend)
  const utilisateurs = [...data]

  // Fonction pour ouvrir le formulaire de modification
  const handleEdit = (user) => {
    setEditingUser(user)
    setShowForm(true)
  }

  // Fonction pour fermer le formulaire
  const handleCloseForm = () => {
    setShowForm(false)
    setEditingUser(null)
  }

  // Style du badge rôle
  const getRoleStyle = (role) => {
    const styles = {
      admin: 'bg-purple-100 text-purple-800',
      responsable: 'bg-blue-100 text-blue-800',
      magasinier: 'bg-green-100 text-green-800',
      employe: 'bg-gray-100 text-gray-800',
    }
    return styles[role] || 'bg-gray-100 text-gray-800'
  }

  // Traduction des rôles
  const getRoleLabel = (role) => {
    const labels = {
      admin: 'Administrateur',
      responsable: 'Responsable',
      magasinier: 'Magasinier',
      employe: 'Employé',
    }
    return labels[role] || role
  }

  return (
    <div>
      {/* En-tête */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Utilisateurs</h1>
          <p className="text-gray-500 mt-1">
            Gestion des comptes utilisateurs
          </p>
        </div>

        {/* Bouton créer utilisateur */}
        <button
          onClick={() => {
            setEditingUser(null)
            setShowForm(true)
          }}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition flex items-center gap-2"
        >
          <span className="text-xl">+</span>
          Nouvel utilisateur
        </button>
      </div>

      {/* Formulaire de création/modification */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {editingUser ? 'Modifier l\'utilisateur' : 'Créer un nouvel utilisateur'}
          </h2>

          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nom */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom *
                </label>
                <input
                  type="text"
                  defaultValue={editingUser?.nom}
                  placeholder="Rakoto"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Prénom */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prénom *
                </label>
                <input
                  type="text"
                  defaultValue={editingUser?.prenom}
                  placeholder="Jean"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  defaultValue={editingUser?.email}
                  placeholder="jean.rakoto@asecna.mg"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Mot de passe (uniquement à la création) */}
              {!editingUser && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mot de passe *
                  </label>
                  <input
                    type="password"
                    placeholder="Minimum 6 caractères"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              )}

              {/* Rôle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rôle *
                </label>
                <select
                  defaultValue={editingUser?.role || 'employe'}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="employe">Employé</option>
                  <option value="responsable">Responsable</option>
                  <option value="magasinier">Magasinier</option>
                  <option value="admin">Administrateur</option>
                </select>
              </div>

              {/* Département */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Département
                </label>
                <select
                  defaultValue={editingUser?.departement || ''}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="">Aucun (Global)</option>
                  <option value="RSI">RSI</option>
                  <option value="MTO">MTO</option>
                  <option value="CNS">CNS</option>
                  <option value="TEL">TEL</option>
                  <option value="CNA">CNA</option>
                  <option value="ERD">ERD</option>
                  <option value="TOUR">TOUR</option>
                  <option value="DSI">DSI</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Laissez vide pour Admin et Magasinier
                </p>
              </div>

              {/* Statut actif (uniquement en modification) */}
              {editingUser && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Statut du compte
                  </label>
                  <select
                    defaultValue={editingUser?.is_active ? 'active' : 'inactive'}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="active">Actif</option>
                    <option value="inactive">Désactivé</option>
                  </select>
                </div>
              )}
            </div>

            {/* Boutons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
              >
                {editingUser ? '💾 Enregistrer' : '➕ Créer'}
              </button>
              <button
                type="button"
                onClick={handleCloseForm}
                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filtres et recherche */}
      <div className="flex gap-4 mb-6">
        {/* Filtre par rôle */}
        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm">
          <option value="">Tous les rôles</option>
          <option value="admin">Administrateur</option>
          <option value="responsable">Responsable</option>
          <option value="magasinier">Magasinier</option>
          <option value="employe">Employé</option>
        </select>

        {/* Filtre par département */}
        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm">
          <option value="">Tous les départements</option>
          <option value="RSI">RSI</option>
          <option value="MTO">MTO</option>
          <option value="CNS">CNS</option>
          <option value="TEL">TEL</option>
        </select>

        {/* Filtre par statut */}
        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm">
          <option value="">Tous les statuts</option>
          <option value="active">Actifs</option>
          <option value="inactive">Désactivés</option>
        </select>

        {/* Recherche */}
        <input
          type="text"
          placeholder="🔍 Rechercher par nom ou email..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
        />
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-500">Total utilisateurs</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{utilisateurs.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-500">Actifs</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {utilisateurs.filter(u => u.is_active).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-500">Désactivés</p>
          <p className="text-2xl font-bold text-red-600 mt-1">
            {utilisateurs.filter(u => !u.is_active).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-500">Administrateurs</p>
          <p className="text-2xl font-bold text-purple-600 mt-1">
            {utilisateurs.filter(u => u.role === 'admin').length}
          </p>
        </div>
      </div>

      {/* Tableau des utilisateurs */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Liste des utilisateurs
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Nom complet
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Rôle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Département
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Créé le
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {utilisateurs.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  {/* Nom complet */}
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {user.prenom} {user.nom}
                  </td>

                  {/* Email */}
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {user.email}
                  </td>

                  {/* Rôle */}
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleStyle(user.role)}`}>
                      {getRoleLabel(user.role)}
                    </span>
                  </td>

                  {/* Département */}
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {user.departement || '—'}
                  </td>

                  {/* Statut */}
                  <td className="px-6 py-4">
                    {user.is_active ? (
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        ✓ Actif
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                        ✗ Désactivé
                      </span>
                    )}
                  </td>

                  {/* Date création */}
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {user.created_at}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200"
                      >
                        ✏️ Modifier
                      </button>
                      <button className="px-3 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200" onClick={() => handleEdit(user)}>
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