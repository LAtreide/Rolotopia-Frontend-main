import axios from "axios";
import { API_URL } from '../constantes';


class GrupoService {

  guardarGrupo(nombre, idUsuario, r, g, b, a, protegido) {

    return axios
      .post(API_URL + "addGrupo", {
        nombre,
        idUsuario,
        r,
        g,
        b,
        a,
        protegido,
      })
      ;
  }


  listaGrupos(idPropietario) {
    return axios
      .post(API_URL + "listaGrupos", {
        idPropietario
      })
      .then(response => {
        return response.data;
      });

  }

  actualizarNombre(id, nombre) {
    return axios
      .post(API_URL + "actualizarNombre", {
        id,
        nombre
      })
      ;
  }

  actualizarColor(id, r, g, b, a) {
    return axios
      .post(API_URL + "actualizarColor", {
        id,
        r,
        g,
        b,
        a,
      })
      ;
  }


  addUsuario(id, usuario) {
    return axios
      .post(API_URL + "addUsuario", {
        id,
        usuario,
      })
      ;
  }

  delUsuario(id, usuario) {
    return axios
      .post(API_URL + "delUsuario", {
        id,
        usuario,
      })
      ;
  }


  colores(idPropietario, nombre) {
    return axios
      .post(API_URL + "colores", {
        idPropietario,
        nombre,
      })
      .then(response => {
        return response.data;
      });
    ;
  }

  nombreGrupo(idPropietario, nombre) {
    return axios
      .post(API_URL + "nombreGrupo", {
        idPropietario,
        nombre,
      })
      .then(response => {
        return response.data;
      });
    ;
  }

  delGrupo(id) {
    return axios
      .post(API_URL + "delGrupo", {
        id,
      })
      ;
  }

}

export default new GrupoService();