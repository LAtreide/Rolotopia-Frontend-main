import axios from "axios";
import AuthService from "./auth.service";
import { API_URL_MOD } from '../constantes';
class TareaService {

 
    listaTareas() {
        
        return axios
        .get(API_URL_MOD+"listaTareas", {
            
      headers:{
        "Authorization": "Bearer "+ AuthService.getCurrentUser().accessToken
      }

          })
          .then(response => {       
            return response.data;
          })
      }

    
      eliminarTarea(id) {
        
        return axios.post( API_URL_MOD+"eliminarTarea", {
        id,
      headers:{
        "Authorization": "Bearer "+ AuthService.getCurrentUser().accessToken
      }
         
        });
      }
    
      nuevaTarea(tipo,nombre,descripcion,estado,porcentaje,autor) {
        
        return axios.post( API_URL_MOD+"agregarTarea", {
        tipo,
        nombre,
        descripcion,
        estado,
        porcentaje,
        autor
        })
        .then(response => {       
          return response.data;
        })
        ;
      }
      
      editarTarea(tarea) {
        
        return axios.post( API_URL_MOD+"editarTarea", {
        id:tarea.id,
        nombre: tarea.nombre,
        descripcion: tarea.descripcion,
        estado: tarea.estado,
        porcentaje: tarea.porcentaje,
         
        });
      }
}

export default new TareaService();