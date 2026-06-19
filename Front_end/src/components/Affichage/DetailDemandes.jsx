import React from 'react'
import { useApi } from '../../hooks/useApi'

const DetailDemandes = ({ getStatutStyle, reference, demandeur, materiel, justification, stock, setShow, qte_demande, motif_rejet, qte_disponible, statut, departement,setDemandeID,setRejectingId,handleAction,ligne_id,demandeID,rejectingId,handleSubmit,tempMotif,setTempMotif }) => {
    
    
  return (
    <div>          
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full overflow-hidden border border-slate-200">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <div className="flex items-center gap-3">
                        <h3 className="text-lg font-bold text-slate-800">Demande {reference}</h3>
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getStatutStyle(statut)}`}>
                            {statut}
                        </span>
                    </div>
                    <button 
                        onClick={()=>{setShow(false)}}
                        className="text-slate-400 hover:text-slate-600 text-xl font-medium">
                        &times;
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                    <div className="md:col-span-2 space-y-4">
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Demandeur</label>
                            <p className="text-sm font-medium text-slate-700 mt-1">{demandeur} — <span className="text-slate-500">{departement}</span></p>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Matériel Demandé</label>
                            <ul className="mt-1 space-y-1 text-sm text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                <li className="flex justify-between"><span>{materiel}</span> <span className="font-bold">x{qte_demande}</span></li>
                            </ul>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Justification</label>
                            <p className="text-sm text-slate-600 mt-1 italic bg-amber-50/30 p-3 rounded-lg border border-dashed border-amber-200">
                                "{justification}"
                            </p>
                        </div>
                    </div>
                    <div className="space-y-4 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 bg-slate-50/50 p-3 rounded-xl">
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Statut Logistique</label>
                            <p className="text-sm text-emerald-700 font-medium mt-1 flex items-center gap-1.5">
                                <span className="h-2 w-2 rounded-full bg-emerald-500"></span> {qte_disponible} unités disponibles
                            </p>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Notes & Messages</label>
                            <div className="mt-2 text-xs bg-white p-2.5 rounded border border-slate-200 shadow-sm text-slate-600">
                                <span className="font-bold text-slate-700 block">Responsable :</span>
                                {motif_rejet}
                            </div>
                            <input type="text" placeholder="Répondre..." className="w-full mt-2 p-2 text-xs border border-slate-200 rounded focus:outline-none focus:border-blue-500 bg-white"/>
                        </div>
                    </div>
                </div>   
                <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
                    {/* <button className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition">Demander précision</button> */}
                    <button 
                    onClick={() => {setRejectingId(ligne_id);setDemandeID(reference)}}
                    className="px-4 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition">Refuser</button>
                    <button 
                    onClick={() =>  handleAction(reference,ligne_id,'APPROUVEE')}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition shadow-sm">Approuver la demande</button>
                </div>
            </div>
        </div>
        {demandeID && rejectingId && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl">
              <form onSubmit={handleSubmit} className="">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Motif du rejet</h3>
              <p className="text-sm text-gray-500 mb-4">Veuillez indiquer pourquoi cette demande est refusée.</p>
              <textarea 
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                rows="3"
                placeholder="Ex: Budget annuel épuisé, Matériel déjà disponible en stock..."
                value={tempMotif}
                onChange={(e) => setTempMotif(e.target.value)}
              />
              <div className="flex justify-end gap-3 mt-6">
                <button 
                  onClick={() => {setRejectingId(null);setTempMotif("");setDemandeID(null);}}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Annuler
                </button>
                <button 
                  disabled={!tempMotif.trim()}
                  onClick={() => {handleAction(demandeID, rejectingId, 'REJETEE', tempMotif);setShow(false); }}
                  className="px-4 py-2 text-sm font-medium bg-rose-600 text-white hover:bg-rose-700 rounded-lg disabled:opacity-50"
                  type='button'
                >
                  Confirmer le rejet
                </button>
              </div>
              </form>
            </div>
          </div>
        )}
    </div>
  )
}

export default DetailDemandes