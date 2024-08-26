import axios from "axios";
import { API_URL } from '../constantes';



class MisPostService {


  fechas(idUsuario) {
    return axios
      .post(API_URL + "mesesmisposts", {
        idUsuario
      })
      .then(response => {
        return response.data;
      });
  }


  partidasMes(idUsuario, ano, mes) {
    return axios
      .post(API_URL + "partidasmes", {
        idUsuario,
        ano,
        mes
      })
      .then(response => {
        return response.data;
      });
  }


  escenasMes(idUsuario, idPartida, ano, mes) {
    return axios
      .post(API_URL + "escenasmes", {
        idUsuario,
        idPartida,
        ano,
        mes
      })
      .then(response => {
        return response.data;
      });
  }
  
  postsMes(idUsuario, idEscena, ano, mes) {
    return axios
      .post(API_URL + "postsmes", {
        idUsuario,
        idEscena,
        ano,
        mes
      })
      .then(response => {
        return response.data;
      });
  }


}

export default new MisPostService();

