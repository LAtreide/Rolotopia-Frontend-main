import axios from "axios";
import { API_URL} from '../constantes';

class ForoService {

  listaSecciones(idUsuario) {
    return axios
      .post(API_URL + "listaSecciones", {
        idUsuario
      })
      .then(response => {
        return response.data;
      });
  }

  crearSeccion(titulo, descripcion, staff) {
    return axios
      .post(API_URL + "crearSeccion", {
        titulo,
        descripcion,
        staff
      })
      .then(response => {
        return response.data;
      });
  }

  infoSeccion(enlace) {
    return axios
      .post(API_URL + "infoSeccion", {
        enlace
      })
      .then(response => {
        return response.data;
      });
  }

  borrarSeccion(id){
  return axios
  .post(API_URL + "borrarSeccion", {
    id
  })
}

editarSeccion(infoSeccion){
  return axios
  .post(API_URL + "editarSeccion", {
    id: infoSeccion.id,
    titulo: infoSeccion.titulo,
    descripcion: infoSeccion.descripcion,
    staff: infoSeccion.staff
  })
  .then(response => {
    return response.data;
  });
}

  listaHilos(idSeccion) {
    return axios
      .post(API_URL + "listaHilos", {
        idSeccion
      })
      .then(response => {
        return response.data;
      });
  }

  crearHilo(idSeccion,titulo,idCreador, nombreCreador) {
    return axios
      .post(API_URL + "crearHilo", {
        idSeccion,titulo,idCreador, nombreCreador
      })
      .then(response => {
        return response.data;
      });
  }

  infoHilo(enlace) {
    return axios
      .post(API_URL + "infoHilo", {
        enlace
      })
      .then(response => {
        return response.data;
      });
  }


abrirCerrarHilo(id,cerrado){

  return axios
  .post(API_URL + "abrirCerrarHilo", {
    id,
    cerrado
  }

)}


editarHilo(infoHilo){
  return axios
  .post(API_URL + "editarHilo", {
    id: infoHilo.id,
    titulo: infoHilo.titulo,
  })
  .then(response => {
    return response.data;
  });
}

borrarHilo(id){
  return axios
  .post(API_URL + "borrarHilo", {
    id
  })
}

nuevoMensaje(idHilo, idAutor, texto) {
  return axios
    .post(API_URL + "nuevoMensaje", {
      idHilo,
      idAutor,
      texto
    })
    .then(response => {
      return response.data;
    });
}


listaMensajes(idHilo) {
  return axios
    .post(API_URL + "listaMensajes", {
      idHilo
    })
    .then(response => {
  
      return response.data;
    });
}

borrarMensaje(id){
  return axios
  .post(API_URL + "borrarMensaje", {
    id
  })
}

editarMensaje(id, texto){
  return axios
  .post(API_URL + "editarMensaje", {
    id,
    texto
  })
}

setNotificationes(idUsuario, idHilo, notificacion){
  return axios
  .post(API_URL + "setNotificacionesHilo", {
    idUsuario,
    idHilo,
    notificacion
  })
}

getNotificaciones(idUsuario, idHilo){
  
  return axios
  .post(API_URL + "getNotificacionesHilo", {
    idUsuario,
    idHilo
  })
  .then(response => {
    return response.data;
  });
}


ultimosMensajes(dias){

  return axios
  .post(API_URL + "foroUltimosMensajes", {
    dias
  })
  .then(response => {
    
    return response.data;
  });
}


}

export default new ForoService();

