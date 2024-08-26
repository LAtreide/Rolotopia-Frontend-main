import axios from "axios";
import { API_URL } from '../constantes';


class ChatService {

  listaChats(idUsuario) {
    return axios
      .post(API_URL + "listaChats", {
        idUsuario
      })
      .then(response => {
        return response.data;
      });
  }


  getMensajes(idUsuario, idChat, tipo) {
    return axios
      .post(API_URL + "getMensajes", {
        idUsuario,
        idChat,
        tipo
      })
      .then(response => {
        return response.data;
      });
  }


  getMensajesAnteriores(idUsuario, idChat, tipo, id) {
    return axios
      .post(API_URL + "getMensajesAnteriores", {
        idUsuario,
        idChat,
        tipo,
        id
      })
      .then(response => {
        return response.data;
      });
  }


  guardarMensaje(idUsuario, idChat, tipo, mensaje) {
    return axios
      .post(API_URL + "guardarMensaje", {
        idUsuario,
        idChat,
        tipo,
        mensaje
      })
  }

  nuevoGrupo(idUsuario, nombre) {
    return axios
      .post(API_URL + "crearGrupoChat", {
        idUsuario,
        nombre
      })
      .then(response => {
        return response.data;
      });
  }

  getColorGrupo(idGrupo) {
    return axios
      .post(API_URL + "getColorGrupoChat", {
        idGrupo,
      })
      .then(response => {
        return response.data;
      });
  }

  listaMiembros(idGrupo) {
    return axios
      .post(API_URL + "listaMiembrosChat", {
        idGrupo,
      })
      .then(response => {
        return response.data;
      });
  }

  isAdministrador(idUsuario, idGrupo){
    return axios
      .post(API_URL + "isAdministradorGrupoChat", {
        idUsuario,
        idGrupo,
      })
      .then(response => {
        return response.data;
      });
  }


  eliminarUsuarioGrupoChat(usuario, idGrupo){
    return axios
      .post(API_URL + "eliminarUsuarioGrupoChat", {
        usuario,
        idGrupo,
      })
      .then(response => {
        return response.data;
      });
  }

  agregarUsuarioGrupoChat(usuario, idGrupo){
    return axios
      .post(API_URL + "agregarUsuarioGrupoChat", {
        usuario,
        idGrupo,
      })
      .then(response => {
        return response.data;
      });
  }


cambiarColorGrupo(idGrupo, color){
  return axios
    .post(API_URL + "cambiarColorGrupoChat", {
      idGrupo,
      color,
    })
}

cambiarAdmin(idGrupo, usuario, administrador){
 
  return axios
    .post(API_URL + "cambiarAdministradorGrupoChat", {
      idGrupo,
      usuario,
      administrador
    })
}


}



const chatService = new ChatService();
export default chatService;
