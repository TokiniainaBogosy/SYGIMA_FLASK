import React from 'react'
import { useEffect, useState } from 'react'
import { useApi } from '../../hooks/useApi'
import { Search, Plus, Pencil, Trash2, Package, Tag } from 'lucide-react'
import UserManager from '../../components/Formulaire/UserManager'

const GestionUser = () => {

  const [selectedUser, setSelectedUser] = useState(null)

  const [searchTerm, setSearchTerm] = useState('')
  const [searchDepartement, setSearchDepartement] = useState('')
  const [searchRoles, setSearchStatus] = useState('')
  const [newNom,setNewNom] = useState('')
  const [newPrenom,setNewPrenom] = useState('')
  const [newDepartement,setNewDepartement] = useState('')
  const [newEmail,setNewEmail] = useState('')
  const [newRole,setNewRole] = useState('')
  const [newActivity,setNewActivity] = useState('')

  const { data: users } = useApi("/user/")

  const [utilisateurs, setUtilisateurs] = useState([])

  const roles = [...new Set(utilisateurs.map(dem => dem.role))]
  const departements = [...new Set(utilisateurs.map(util => util.departement))]

  useEffect(() => {
    if (users) setUtilisateurs(users)
  }, [users])


  const filteredUtilisateurs = utilisateurs.filter((util) => {
    const matchSearch = util.nom?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchRoles = util.role?.toLowerCase().includes(searchRoles.toLowerCase())
    const matchDepartement = util.departement?.toLowerCase().includes(searchDepartement.toLowerCase())
    return matchSearch && matchRoles && matchDepartement
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    // try {
    //   await patch('/demande/answer', form)
    //   setForm({ reference: "", status: "", motif: "" })
    // } catch (err) { }
  }

  const { del } = useApi()
  
    const handleDelete = async (id, type) => {
      if (!window.confirm("Supprimer ?")) return
      try {
        await del(`/user/${type}/${id}`)
        window.location.reload() // ou re-fetch
      } catch (e) {
        alert("Erreur suppression")
      }
    }


   return (
    <div className="w-full px-6 lg:px-10 py-8 space-y-8">
      {/* En-tête */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-500 mt-1">
            Gestion des utilisateurs
          </p>
        </div>
      </div>
      
      {/* Filtres */}
      <div className="flex gap-4 mb-6">
        
        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm" 
        value={searchDepartement} onChange={(e) => setSearchDepartement(e.target.value)}
        >
          <option value="">Toutes les Departements</option>
            {departements.map((dep) => (
              <option key={dep} value={dep}>{dep}</option>
            ))}
        </select>

        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm" 
        value={searchRoles} onChange={(e) => setSearchStatus(e.target.value)}
        >

          <option value="">Roles</option>
            {roles.map((rol) => (
              <option key={rol} value={rol}>{rol}</option>
            ))} 
        </select>

        {/* <select 
            value={searchCategorie}
            onChange={(e) => setsearchCategorie(e.target.value)}
          >
            <option value="">Toutes les catégories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
        </select> */}

        <input
          type="text"
          value={searchTerm}
          placeholder="Rechercher..."
          onChange={(e)=>setSearchTerm(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
        />
      </div>
      {/* Tableau des demandes */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="overflow-x-auto">
          <form onSubmit={handleSubmit} className="">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-r border-gray-200 ">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-r border-gray-200 ">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-r border-gray-200 ">
                  Prenom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-r border-gray-200 ">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-r border-gray-200 ">
                  Departement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-r border-gray-200 ">
                  is active
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-r border-gray-200 ">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-r border-gray-200 ">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-r border-gray-200 ">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUtilisateurs
              .map((demande,index) => {
                return(
                <tr key={index} className='border-asecna-blue'>

                {/* AUTRES CELLULES NORMALES */}
                <td className="px-6 py-4 text-sm text-gray-500 border-r border-gray-200">{demande.id}</td>  
                <td className="px-6 py-4 text-sm text-gray-500 border-r border-gray-200">{demande.nom}</td>
                <td className="px-6 py-4 text-sm text-gray-500 border-r border-gray-200"> {demande.prenom} </td>
                <td className="px-6 py-4 text-sm text-gray-500 border-r border-gray-200">{demande.email}</td>
                <td className="px-6 py-4 text-sm text-gray-500 border-r border-gray-200">{demande.departement}</td>
                <td className="px-6 py-4 text-sm text-gray-500 border-r border-gray-200">{demande.is_active}</td>
                <td className="px-6 py-4 text-sm text-gray-500 border-r border-gray-200">{demande.role}</td>
                <td className="px-6 py-4 text-sm text-gray-500 border-r border-gray-200">{demande.created_at}</td>

                  <td className="px-6 py-4 text-sm border-r border-gray-200">
                    <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => {setSelectedUser(demande);setNewNom(demande.nom);setNewPrenom(demande.prenom);setNewEmail(demande.email);setNewDepartement(demande.departement);setNewActivity(demande.is_active);setNewRole(demande.role)}}
                          selectedUser={selectedUser} 
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(demande.id, 'delete')}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                  </td>
                </tr>
              )})}
              
              
            </tbody>

          </table>
          </form>
        </div>
      </div>
      {/* Modales */}
      {selectedUser && (
        <UserManager 
          selectedUser={selectedUser} 
          setSelectedUser={setSelectedUser}
          newNom={newNom}
          setNewNom={setNewNom}
          newPrenom={newPrenom}
          setNewPrenom={setNewPrenom}
          newEmail={newEmail}
          setNewEmail={setNewEmail}
          newRole={newRole}
          setNewRole={setNewRole}
          newDepartement={newDepartement}
          setNewDepartement={setNewDepartement}
          newActivity = {newActivity}
          setNewActivity = {setNewActivity}
          listRoles = {roles}
          listDepartements = {departements}
          setUtilisateurs = {setUtilisateurs}
        />
            )}
    </div>
   )
}

export default GestionUser