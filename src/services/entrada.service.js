import axios from "axios";
import { API_URL } from '../constantes';


class EntradaService {

  crearEntrada(idBlog, titulo, etiquetas, texto, borrador) {

    return axios
      .post(API_URL + "crearEntrada", {
        idBlog,
        titulo,
        etiquetas,
        texto,
        borrador
      })
      .then(response => {
  
        return response.data;
      });
  }


  listaEntradas(idBlog, idUsuario) {

    return axios
      .post(API_URL + "listaEntradas", {
        idBlog,
        idUsuario
      })
      .then(response => {

        return response.data;
      });
  }



  guardarEmoji(idEntrada, idUsuario, emoji) {

    return axios
      .post(API_URL + "guardarEmoji", {
        idEntrada,
        idUsuario,
        emoji
      })
      .then(response => {

        return response.data;
      });
  }

  getEmojis(idEntrada) {

    return axios
      .post(API_URL + "getEmojis", {
        idEntrada,
      })
      .then(response => {

        return response.data;
      });
  }

  getEtiquetas(idEntrada) {

    return axios
      .post(API_URL + "getEtiquetas", {
        idEntrada,
      })
      .then(response => {

        return response.data;
      });
  }

  emojiUsuarioEntrada(idEntrada, idUsuario) {

    return axios
      .post(API_URL + "emojiUsuarioEntrada", {
        idEntrada,
        idUsuario
      })
      .then(response => {

        return response.data;
      });
  }

  getEntradaEnlace(enlace, idUsuario) {

    return axios
      .post(API_URL + "getEntradaEnlace", {
        enlace,
        idUsuario,
      })
      .then(response => {

        return response.data;
      });
  }

  editarEntrada(entrada) {

    return axios
      .post(API_URL + "editarEntrada", {
        id: entrada.id,
        idBlog: entrada.idBlog,
        titulo: entrada.titulo,
        etiquetas: entrada.etiquetas,
        texto: entrada.texto,
        borrador: entrada.borrador
      })
      .then(response => {
        return response.data;
      });


  }

  borrarEntrada(id) {

    return axios
      .post(API_URL + "borrarEntrada", {
        id
      })
  }



}


export default new EntradaService();

