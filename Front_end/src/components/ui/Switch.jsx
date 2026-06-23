// Dans ton fichier ../ui/Switch.jsx
import React from 'react';

export default function Switch({ checked, onChange }) {
  return (
    <label className="relative inline-flex items-center cursor-pointer select-none">
      <input 
        type="checkbox" 
        checked={checked}
        onChange={onChange} // Déclenche la fonction reçue du parent
        className="sr-only peer"
      />
      
      <div className="w-14 h-8 bg-gray-300 rounded-full peer 
        peer-checked:bg-green-500 
        transition-colors duration-300 ease-in-out
        after:content-[''] after:absolute after:top-1 after:left-1 
        after:bg-white after:rounded-full after:h-6 after:w-6 
        after:transition-transform after:duration-300
        peer-checked:after:translate-x-6
        shadow-inner">
      </div>
    </label>
  );
}