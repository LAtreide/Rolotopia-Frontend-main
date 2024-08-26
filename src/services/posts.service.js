import axios from "axios";
import { API_URL, BASE_URL } from '../constantes';



class PostService {


  lista(idEscena, pag, idUsuario) {
    return axios
      .post(API_URL + "listaPosts", {
        idEscena, pag, idUsuario
      })
      .then(response => {
        return response.data;
      });
  }

  npaginas(idEscena, idUsuario) {
    return axios
      .post(API_URL + "nPaginasPosts", {
        idEscena, idUsuario
      })
      .then(response => {
        return response.data;
      });
  }


  crearPost(idEscena, idPersonaje, texto, notas, idUsuario, destinatarios) {

    return axios
      .post(API_URL + "crearpost", {
        idEscena,
        idPersonaje,
        texto,
        notas,
        idUsuario,
        destinatarios
      })
      .then(response => {

        return response.data;
      });
  }

  destinatarios(idEscena) {

    return axios
      .post(API_URL + "destinatarios", {
        idEscena
      })
      .then(response => {

        return response.data;
      });
  }

  borrarPost(idPost) {
    return axios
      .post(API_URL + "borrarPost", {
        idPost
      })
      .then(response => {
        return response.data;
      });
  }

  subirPost(idPost) {
    return axios
      .post(API_URL + "subirPost", {
        idPost
      })
      .then(response => {
        return response.data;
      });
  }

  bajarPost(idPost) {
    return axios
      .post(API_URL + "bajarPost", {
        idPost
      })
      .then(response => {
        return response.data;
      });
  }


  siguientePost(idEscena, pag, idUsuario) {
    return axios
      .post(API_URL + "siguientePost", {
        idEscena, pag, idUsuario
      })
      .then(response => {
        return response.data;
      });
  }



  editPost(id, idEscena, idPersonaje, texto, notas, idUsuario, destinatarios) {

    return axios
      .post(API_URL + "editPost", {
        id,
        idEscena,
        idPersonaje,
        texto,
        notas,
        idUsuario,
        destinatarios
      })
      .then(response => {


        return response.data;
      });
  }

  editDestPost(id, destinatarios) {

    return axios
      .post(API_URL + "editDestPost", {
        id,
        destinatarios
      })
  }



  insertPost(id, idEscena, idPersonaje, texto, notas, idUsuario, destinatarios) {

    return axios
      .post(API_URL + "insertarpost", {
        id,
        idEscena,
        idPersonaje,
        texto,
        notas,
        idUsuario,
        destinatarios
      })
      .then(response => {



        return response.data;
      });
  }

  compartirPost(idPost, idUsuario) {
    return axios
      .post(BASE_URL+ "compartirPost", {
        idPost,
        idUsuario

      })
      .then(response => {
        

        return response.data;
      });
  }

  previsualizarJugador(eEscena, idUsuario) {

    return axios
      .post(API_URL + "previsualizarJugador", {
        eEscena,
        idUsuario
      })
      .then(response => {
        return response.data;
      });
  }


  previsualizarDirector(eEscena, idUsuario) {

    return axios
      .post(API_URL + "previsualizarDirector", {
        eEscena,
        idUsuario
      })
      .then(response => {
        return response.data;
      });
  }



  listaExportar(escenas, idUsuario) {
    return axios
      .post(API_URL + "listaExportar", {
        escenas, idUsuario
      })
      .then(response => {
        return response.data;
      });
    }



marcarNoLeido(idUsuario, idPost) {
  return axios
    .post(API_URL + "marcarNoLeido", {
      idUsuario, idPost
    })
  
}

marcarNoLeidoSiguientes(idUsuario, idPost) {
  return axios
    .post(API_URL + "marcarNoLeidoSiguientes", {
      idUsuario, idPost
    })
  
}

}

const postService = new PostService();
export default postService;

