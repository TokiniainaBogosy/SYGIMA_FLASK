import React, { useState } from 'react'
import { clsx } from 'clsx';
import LienNav from './LienNav/LienNav'
import { NavLink } from 'react-router-dom'

const Navbar = () => {
  return (
    <div className='flex justify-between w-auto p-2 m-2 bg-transparent'>
      <div className='p-2'>
        <div></div>
        <div></div>
      </div>
      <nav className=''>
        <ul className='bg-gray-200 rounded-md flex p-0.5'>
          <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                clsx(
                  "p-2 ml-0.5 mr-0.5 mb-0.5 mt-0.5 rounded-md",
                  isActive ? "bg-white " : "text-gray-600"
                )
              }
            >
              overview
          </NavLink>
          <NavLink
              to="/CategorieMateriel"
              className={({ isActive }) =>
                clsx(
                  "p-2 ml-0.5 mr-0.5 mb-0.5 mt-0.5 rounded-md",
                  isActive ? "bg-white " : "text-gray-600"
                )
              }
            >
              Materiel
          </NavLink>
          <NavLink
              to="/TraitementDemande"
              className={({ isActive }) =>
                clsx(
                  "p-2 ml-0.5 mr-0.5 mb-0.5 mt-0.5 rounded-md",
                  isActive ? "bg-white " : "text-gray-600"
                )
              }
            >
              Demande
          </NavLink>
          
        </ul>
      </nav>
      <div className='p-2'>
          
      </div>
    </div>
  )
}

export default Navbar