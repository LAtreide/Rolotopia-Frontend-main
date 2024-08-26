import axios from "axios";
import { API_URL } from '../constantes';


class PersonajeService {

  lista(id) {
    return axios
      .post(API_URL + "listapersonajes", {
        id
      })
      .then(response => {

        return response.data;
      });
  }

  listaPersonajesAsignados(idPartida) {
    return axios
      .post(API_URL + "listaPersonajesAsignados", {
        idPartida
      })
      .then(response => {

        return response.data;
      });
  }


  listaParcial(idPartida, idUsuario) {
    return axios
      .post(API_URL + "listaPersonajesParcial", {
        idPartida,
        idUsuario
      })
      .then(response => {

        return response.data;
      });
  }


  infoid(id) {
    return axios
      .post(API_URL + "infoPersonaje", {
        id
      })
      .then(response => {

        return response.data;
      });
  }

  infoCompletaId(idPersonaje, idUsuario) {
    return axios
      .post(API_URL + "infoCompletaId", {
        idPersonaje,
        idUsuario
      })
      .then(response => {
        return response.data;
      });
  }


  pjsescribir(idEscena, idPartida, idJugador) {
    return axios
      .post(API_URL + "pjsescribir", {
        idEscena,
        idPartida,
        idJugador
      })
      .then(response => {

        return response.data;
      });
  }



  crear(nombre, idPartida) {
    return axios
      .post(API_URL + "crearpj", {
        nombre,
        idPartida,

      })
      .then(response => {
        return response.data;
      });
  }

  actuAvatar(id, archivo) {
    return axios
      .post(API_URL + "actuAvatarPj", {
        id,
        avatar: archivo
      })
      .then(response => {

        return response.data;
      });
  }


  cambiarNombre(id, nombre) {
    return axios
      .post(API_URL + "pjsCambiarNombre", {
        id,
        nombre,
      });
  }





  isPropietario(idPersonaje, idUsuario) {
    return axios
      .post(API_URL + "isPropietario", {
        idPersonaje,
        idUsuario
      })
      .then(response => {
        return response.data;
      });
  }


  infoPestanas(idPersonaje, idUsuario) {
    return axios
      .post(API_URL + "infoPestanasPj", {
        idPersonaje,
        idUsuario
      })
      .then(response => {
        return response.data;
      });
  }

  guardarPestanas(id, pestanas) {
    axios
      .post(API_URL + "guardarPestanas", {
        id,
        pestanas
      })

  }

  guardarPestanaUnica(personaje, pestana, contenido) {
    axios
      .post(API_URL + "guardarPestanaUnica", {
        personaje,
        pestana,
        contenido
      })

  }


  getIdFromAvatar(avatar) {
    return axios
      .post(API_URL + "getIdFromAvatar", {
        avatar
      })
      .then(response => {
        return response.data;
      });
  }

  isAsignado(id) {
    return axios
      .post(API_URL + "isAsignado", {
        id,
        
      })
      .then(response => {
        return response.data;
      });
  }



  guardarEtiquetas(id, etiquetas) {
    axios
      .post(API_URL + "guardarEtiquetas", {
        id,
        etiquetas
      })

  }



  personajesEscena(idEscena) {
    return axios
      .post(API_URL + "personajesEscena", {
        idEscena,
      })
      .then(response => {

        return response.data;
      });
  }

  pjsEscribirEscenas(idEscenas) {
    return axios
      .post(API_URL + "pjsEscribirEscenas", {
        idEscenas,
      })
      .then(response => {
       
        return response.data;
      });
  }

}



const personajeServiceInstance = new PersonajeService();
export default personajeServiceInstance;