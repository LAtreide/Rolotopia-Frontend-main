import axios from "axios";
import { API_URL } from '../constantes';


class UsuariosService {




  actuAvatar(idUsuario, archivo) {
    return axios
      .post(API_URL + "actuAvatar", {
        id: idUsuario,
        avatar: archivo
      })
      .then(response => {


        let u = JSON.parse(localStorage.getItem('user'));
        u.avatar = archivo;
        localStorage.setItem("user", JSON.stringify(u));
        return response.data;
      });
  }

  listaUsuarios() {
    return axios
      .post(API_URL + "listaUsuarios", {
      })
      .then(response => {
        return response.data;
      });
  }

  infoUsuario(nombreUsuario) {
    return axios
      .post(API_URL + "infoUsuario", {
        nombre: nombreUsuario
      })
      .then(response => {
        return response.data;
      });
  }

  infoUsuarioId(idUsuario) {
    return axios
      .post(API_URL + "infoUsuarioId", {
        idUsuario
      })
      .then(response => {
        return response.data;
      });
  }


  novedadesJugador(idUsuario) {
    return axios
      .post(API_URL + "novedadesJugador", {
        idUsuario
      })
      .then(response => {
        return response.data;
      });
  }



  novedadesDirector(idUsuario) {
    return axios
      .post(API_URL + "novedadesDirector", {
        idUsuario
      })
      .then(response => {
        return response.data;
      });
  }

  getPostpPag(idUsuario) {

    return axios
      .post(API_URL + "getPostpPag", {
        idUsuario
      })
      .then(response => {
        return response.data;
      });
  }



  guardarPostpPag(idUsuario, postppag) {
    return axios
      .post(API_URL + "guardarPostpPag", {
        idUsuario,
        postppag
      })
  }


  getPermisosEmail(idUsuario) {

    return axios
      .post(API_URL + "getPermisosEmail", {
        idUsuario
      })
      .then(response => {
        return response.data;
      });
  }

  guardarPermisosEmail(idUsuario, permisos) {
    return axios
      .post(API_URL + "guardarPermisosEmail", {
        idUsuario,
        permisos
      })
  }


  getMostrarDados(idUsuario) {
    return axios
      .post(API_URL + "getMostrarDados", {
        idUsuario
      })
      .then(response => {
        return response.data;
      });
  }



  guardarMostrarDados(idUsuario, mostrarDados) {
    return axios
      .post(API_URL + "guardarMostrarDados", {
        idUsuario,
        mostrarDados
      })
  }


}

export default new UsuariosService();