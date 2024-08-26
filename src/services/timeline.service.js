import axios from "axios";
import {API_URL} from '../constantes';


class TimeLineService {

  
listaTotal(idUsuario) {
  return axios
    .post(API_URL + "timeLineTotal", {
    idUsuario
    })
    .then(response => {      
      
      return response.data;
    });
  
}


listaPartidas(idUsuario) {
  return axios
    .post(API_URL + "timeLinePartidas", {
    idUsuario
    })
    .then(response => {      

      return response.data;
    });
  
}


listaTotalUsuario(idUsuario) {
  return axios
    .post(API_URL + "timeLineTotalUsuario", {
    idUsuario
    })
    .then(response => {      
      return response.data;
    });
  
}

listaPartidasUsuario(idUsuario) {
  return axios
    .post(API_URL + "timeLinePartidasUsuario", {
    idUsuario
    })
    .then(response => {      
      
      return response.data;
    });
  
}

}


const timeLineService = new TimeLineService();
export default timeLineService;
