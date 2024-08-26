import axios from "axios";
import { API_URL } from '../constantes';


class TiradaService {


  nuevaTirada(idEscena, idPersonaje, idUsuario, solicitud, idPartida) {

    return axios
      .post(API_URL + "nuevaTirada", {
        idEscena,
        idPersonaje,
        idUsuario,
        solicitud,
        idPartida,
        

      })
      .then(response => {
        return response.data;
      });
  }

  editaTirada(idPost, panel, idUsuario, idPartida) {

    return axios
      .post(API_URL + "editaTirada", {
        idPost,
        solicitud: JSON.stringify(panel),
        idUsuario,
        idPartida,
      })
      .then(response => {
        return response.data;
      });
  }


  nuevaTiradaProvisional(idEscena, idPersonaje, idUsuario, solicitud, idPartida) {

    return axios
      .post(API_URL + "nuevaTiradaProvisional", {
        idEscena,
        idPersonaje,
        idUsuario,
        solicitud,
        idPartida,
        

      })
      .then(response => {
        return response.data;
      });
  }

  editaTiradaProvisional(idPost, panel, idUsuario, idPartida) {

    return axios
      .post(API_URL + "editaTiradaProvisional", {
        idPost,
        solicitud: JSON.stringify(panel),
        idUsuario,
        idPartida,
      })
      .then(response => {
        return response.data;
      });
  }

  tiradaDefinitiva(tirada) {
  
    return axios
      .post(API_URL + "tiradaDefinitiva", {
        id: tirada.id,
        idSistema: tirada.idSistema,
        idPost: tirada.idPost,
        tipo: tirada.tipo,
        solicitud: tirada.solicitud,
        dados: tirada.resultado,
        html: tirada.html
      })
      .then(response => {
      
        return response.data;
      });
  }

  tiradaVisible(idUsuario, idPartida) {
    
    return axios
      .post(API_URL + "tiradaVisible", {
        idUsuario,
        idPartida
      })
      .then(response => {
        
        return response.data;
      });
  }


}


const tiradaService = new TiradaService();
export default tiradaService;