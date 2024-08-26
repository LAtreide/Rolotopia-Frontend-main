import axios from "axios";
import { API_URL } from '../constantes';


class PerspropioService {

  lista(id) {
    return axios
      .post(API_URL + "listaperspropios", {
        id
      })
      .then(response => {

        return response.data;
      });
  }

  listaPerspropiosPublicos(id) {
    return axios
      .post(API_URL + "listaperspropiospublicos", {
        id
      })
      .then(response => {

        return response.data;
      });
  }


  crear(nombre, idUsuario) {
    return axios
      .post(API_URL + "crearperspropio", {
        nombre,
        idUsuario,

      })
      .then(response => {
    
        return response.data;
      });
  }


  infoid(id) {
    return axios
      .post(API_URL + "infoPerspropio", {
        id
      })
      .then(response => {

        return response.data;
      });
  }

  actuAvatar(id, archivo) {
    return axios
      .post(API_URL + "actuAvatarPerspropio", {
        id,
        avatar: archivo
      })
      .then(response => {

        return response.data;
      });
  }



  cambiarNombre(id, nombre) {
    return axios
      .post(API_URL + "perspropioCambiarNombre", {
        id,
        nombre,
      });
  }


  infoPestanas(idPersonaje, idUsuario) {
    return axios
      .post(API_URL + "infoPestanasPerspropio", {
        idPersonaje,
        idUsuario
      })
      .then(response => {
        return response.data;
      });
  }

  guardarPestanas(id, pestanas) {

    axios
      .post(API_URL + "guardarPestanasPerspropio", {
        id,
        pestanas
      })

  }

  guardarPestanaUnica(personaje, pestana, contenido) {
    axios
      .post(API_URL + "guardarPestanaUnicaPerspropio", {
        personaje,
        pestana,
        contenido
      })

  }

  infoCompletaId(idPersonaje, idUsuario) {

    return axios
      .post(API_URL + "infoCompletaPerspropioId", {
        idPersonaje,
        idUsuario
      })
      .then(response => {
        return response.data;
      });
  }


  guardarEtiquetas(id, etiquetas) {
    axios
      .post(API_URL + "guardarEtiquetasPerspropio", {
        id,
        etiquetas
      })

  }

  importarPerspropio(idPerspropio, idPersonaje, idUsuario) {
    return axios
    .post(API_URL + "importarPerspropio", {
      idPerspropio,
      idPersonaje,

    })
    .then(response => {
   
      return response.data;
    });


}


  exportarPersonaje(idUsuario, idPersonaje) {
    axios
      .post(API_URL + "exportarPersonaje", {
        idUsuario,
        idPersonaje,

      })

  }

  cambiarPrivacidad(idPersonaje, publico) {
    axios
      .post(API_URL + "cambiarPrivacidad", {
        idPersonaje,
        publico
      })

  }

}


export default new PerspropioService();