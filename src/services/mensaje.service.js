import axios from "axios";
import {API_URL} from '../constantes';


class MensajeService {

  noLeidos(id) {
    return axios
      .post(API_URL + "mensajes/noleidos", {
      id
    })
      .then(response => {
        return response.data;
        
      });
  }



  leerMensaje(id, idUsuario) {
    return axios
      .post(API_URL + "mensajes/leermensaje", {
      id,
      idUsuario
    })
      .then(response => {
        return response.data;
      });
  }

  hiloMensajes(hilo, idUsuario) {
    return axios
      .post(API_URL + "mensajes/hiloMensajes", {
      hilo,
      idUsuario
    })
      .then(response => {
        return response.data;
      });
  }

  listaMensajes(id, pagina) {
    return axios
      .post(API_URL + "mensajes/listamensajes", {
      id,
      pagina
    })
      .then(response => {
        return response.data;
      });
  }


  listaEnviados(id, pagina) {
    return axios
      .post(API_URL + "mensajes/listaenviados", {
      id, 
      pagina
    })
      .then(response => {
        return response.data;
      });
  }

  nuevoMensaje(idRemitente, hilo, nDestinatarios, asunto, importante, texto, respuesta, texRespuesta) {
    return axios
      .post(API_URL + "mensajes/nuevomensaje", {
      idRemitente,
      hilo,
      nDestinatarios,
      asunto,
      importante,
      texto,
      respuesta,
      texRespuesta
    })
    .then(response => {
      return response.data;
    });
      ;
  }
  
  paginasEntrantes(idUsuario) {
    return axios
      .post(API_URL + "mensajes/paginasEntrantes", {
      idUsuario
    })
    .then(response => {
      return response.data;
    });
      ;
  }
  
  paginasEnviados(idUsuario) {
    return axios
      .post(API_URL + "mensajes/paginasEnviados", {
      idUsuario
    })
    .then(response => {
      return response.data;
    });
      ;
  }
  

}

export default new MensajeService();

