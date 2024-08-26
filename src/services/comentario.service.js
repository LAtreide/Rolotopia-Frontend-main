import axios from "axios";
import {API_URL} from '../constantes';


class ComentarioService {

  nComentarios(idEntrada) {
    return axios
      .post(API_URL + "numeroComentarios", {
        idEntrada
      })
      .then(response => {
        
        return response.data;
      });
  }


  crearComentario(idEntrada, texto, idUsuario) {
  
    return axios
      .post(API_URL + "crearComentario", {
        idEntrada,
        texto,
        idUsuario

      })
      .then(response => {
        
        return response.data;
      });
  }




  listaComentarios(idEntrada){

    return axios
      .post(API_URL + "listaComentarios", {
        idEntrada,
      })
      .then(response => {
     
        return response.data;
      });
  }



}


export default new ComentarioService();

