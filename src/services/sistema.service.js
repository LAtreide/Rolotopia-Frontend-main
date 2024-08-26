import axios from "axios";
import {API_URL} from '../constantes';


class SistemaService {

 
    info(id) {
        
        return axios
          .post(API_URL + "infoSistema", {
            id
          })
          .then(response => {       
            return response.data;
          });
      }

      lista() {
        
        return axios
          .post(API_URL + "listaSistema", {
          })
          .then(response => {       
            return response.data;
          });
      }

      actualizar(id,nombre,descripcion,portada,dado_principal,panel) {
      
        return axios
          .post(API_URL + "actualizarSistema", {
            id,nombre,descripcion,portada,dado_principal,panel
          })
          .then(response => {       
            return response.data;
          });
      }

      addSistema(nombre) {
      
        return axios
          .post(API_URL + "addSistema", {
            nombre
          })
          .then(response => {       
            return response.data;
          });
      }

    

      
}

export default new SistemaService();