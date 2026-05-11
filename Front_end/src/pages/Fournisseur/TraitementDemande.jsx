import React from 'react'
import TraitementDemandeForm from '../../components/Formulaire/TraitementDemandeForm'
import ConsultationStock from '../../components/Affichage/ConsultationStock'

const TraitementDemande = () => {
  return (
    <div>
        <ConsultationStock/>
        <TraitementDemandeForm/>
    </div>
  )
}

export default TraitementDemande