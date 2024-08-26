import axios from "axios";
import { API_URL } from '../constantes';

class IncidenciaService {

  listaSecciones(idUsuario) {
    return axios
      .post(API_URL + "listaSeccionesIncidencias", {
        idUsuario
      })
      .then(response => {
        return response.data;
      });
  }



  listaSubsecciones(idUsuario, seccion) {
    return axios
      .post(API_URL + "listaSubseccionesIncidencias", {
        idUsuario,
        seccion
      })
      .then(response => {
        return response.data;
      });
  }

  listaIncidenciasSeccion(idUsuario, seccion) {
    return axios
      .post(API_URL + "listaIncidenciasSeccion", {
        idUsuario,
        seccion
      })
      .then(response => {
        return response.data;
      });
  }


  listaMensajesIncidencia(idUsuario, idIncidencia) {
    return axios
      .post(API_URL + "listaMensajesIncidencia", {
        idUsuario,
        idIncidencia
      })
      .then(response => {
        return response.data;
      });
  }

  infoIncidencia(idUsuario, idIncidencia) {
    return axios
      .post(API_URL + "infoIncidencia", {
        idUsuario,
        idIncidencia
      })
      .then(response => {
        return response.data;
      });
  }

  nuevoMensaje(idIncidencia, idAutor, mensaje, staff) {
    return axios
      .post(API_URL + "crearMensajeIncidencia", {
        idIncidencia,
        idAutor,
        mensaje,
        staff
      })
      .then(response => {
        return response.data;
      });
  }

  abrirCerrarIncidencia(idIncidencia, cerrada) {
    return axios
      .post(API_URL + "abrirCerrarIncidencia", {
        idIncidencia,
        cerrada
      })
      .then(response => {
        return response.data;
      });
  }

  atenderIncidencia(idIncidencia, atendida) {
    return axios
      .post(API_URL + "atenderIncidencia", {
        idIncidencia,
        atendida
      })
      .then(response => {
        return response.data;
      });
  }

  getSeccionAbiertas(seccion) {
    return axios
      .post(API_URL + "getSeccionAbiertas", {
        seccion
      })
      .then(response => {
        return response.data;
      });
  }



getSeccionNoAtendidas(seccion) {
  return axios
    .post(API_URL + "getSeccionNoAtendidas", {
      seccion
    })
    .then(response => {
      return response.data;
    });
}

getSubseccionAbiertas(subseccion) {
  return axios
    .post(API_URL + "getSubseccionAbiertas", {
      subseccion
    })
    .then(response => {
      return response.data;
    });
}



getSubseccionNoAtendidas(subseccion) {
return axios
  .post(API_URL + "getSubseccionNoAtendidas", {
    subseccion
  })
  .then(response => {
    return response.data;
  });
}


crearIncidencia(idUsuario, seccion, subseccion, titulo, descripcion) {
  return axios
    .post(API_URL + "crearIncidencia", {
      idUsuario,
      seccion,
      subseccion,
      titulo,
      descripcion
    })
    .then(response => {
      return response.data;
    });
  }
  

  listaIncidenciasUsuario(idUsuario) {
    return axios
      .post(API_URL + "listaIncidenciasUsuario", {
        idUsuario
      })
      .then(response => {
        
        return response.data;
      });
    }
    


}

export default new IncidenciaService();

