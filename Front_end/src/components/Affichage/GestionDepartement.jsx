import React, { useState, useEffect } from 'react';
import { Search, Plus, Pencil, Trash2, Package, Tag, UserPlus, Building2,ShieldCheck } from 'lucide-react'
import {useApi} from '../../hooks/useApi';
import DepartementForm from '../Formulaire/DepartementForm';

const DepartementList = () => {

  const { data: departements, loading: isLoadingDeps, setData : setDepartements } = useApi('/departement/departement-and-responsable');
  const [showForm, setShowForm] = useState(false);
  
  const [editingId, setEditingId] = useState(null);
  const { data: users, loading: isLoadingUsers, setData : setUsers } = useApi(`/user/${editingId}`);
  const {patch} = useApi();
  const [searchTerm, setSearchTerm] = useState("");

  const assignResponsable = (deptId, userId, oldUserName) => {
    const selectedUser = users.find(u => u.id === parseInt(userId));
    setDepartements(departements.map(d => 
      d.id === deptId ? { ...d, responsable_nom: selectedUser.nom } : d
    ));
    setEditingId(null);
    console.log(`Assigning user ${userId} to department ${deptId}`);
    patch(`/responsable/`, { departement_id: deptId, user_id: userId ,old_user_name: oldUserName})
    // Ici, vous ajouteriez l'appel API : api.patch(`/departements/${deptId}`, { responsable_id: userId })
  };

  const filteredDepts = departements?.filter(d => 
    d.nom.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-5xl mx-auto">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Départements</h1>
            <p className="text-gray-500 text-sm">Gérez les services et leurs responsables attitrés.</p>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Rechercher un service..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl w-full md:w-64 focus:ring-2 focus:ring-blue-500 outline-none bg-white transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
          </div>
          <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700"
           >
              <Plus className="w-4 h-4" />
                Nouveau
          </button>
        </div>

        { 
          showForm && (
            <DepartementForm/>
          )
        }

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Département</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Code</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Responsable Actuel</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredDepts?.map((dept) => (
                <tr key={dept.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <Building2 size={18} />
                      </div>
                      <span className="font-medium text-gray-900">{dept.nom}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded">
                      {dept.code}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {editingId === dept.id ? (
                      <select 
                        autoFocus
                        className="text-sm border border-gray-300 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => assignResponsable(dept.id, e.target.value,dept?.responsable_nom)}
                        onBlur={() => setEditingId(null)}
                        defaultValue={dept.responsable?.id || ""}
                      >
                        <option value="">Choisir un responsable</option>
                        {users?.map(u => (
                          <option key={u.id} value={u.id}>{u.nom}</option>
                        ))}
                      </select>
                    ) : (
                      <div className="flex items-center gap-2">
                        {dept.responsable_nom ? (
                          <>
                            <ShieldCheck size={16} className="text-emerald-500" />
                            <span className="text-sm text-gray-700">{dept.responsable_nom}</span>
                          </>
                        ) : (
                          <span className="text-sm italic text-gray-400">Non assigné</span>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => {setEditingId(dept.id)}}
                      className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <UserPlus size={16} />
                      {dept.responsable_nom ? "Changer" : "Assigner"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DepartementList;