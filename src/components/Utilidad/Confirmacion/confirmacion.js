
import React from 'react'
import { confirm } from "react-confirm-box";

export default async function confirmacion(message) {
  return await confirm(message,
          
  {closeOnOverlayClick: true,
   render: (message, onConfirm, onCancel) => {
     return (
       <div style={{border: "1px solid black", backgroundColor: "white", position: "fixed", borderRadius: "10px", padding: "5px"}}>
         <p style={{}}> {message} </p>
         <button onClick={onConfirm} style={{backgroundColor: "black", color: "white"}}> Sí </button>
         <button onClick={onCancel} style={{backgroundColor: "black", color: "white"}}> No </button>
       </div>
     );
  }}
  
   ) 
}