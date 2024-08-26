import axios from "axios";
import {API_URL} from '../constantes';


class HomeService {

  enviarFormulario(nombre,email,consulta) {
    return axios
      .post(API_URL + "enviarFormulario", {
        nombre,
        email,
        consulta
      })
  }


  listaFormularios() {
    return axios
      .post(API_URL + "listaFormularios", {
        
      })   
      .then(response => {
        return response.data;
      });
  }

  atenderFormulario(idFormulario, atendida) {
    return axios
      .post(API_URL + "atenderFormulario", {
        idFormulario,
        atendida
      })   
  }


}


export default new HomeService();

