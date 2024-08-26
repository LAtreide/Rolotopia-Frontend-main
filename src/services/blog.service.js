import axios from "axios";
import {API_URL} from '../constantes';


class BlogService {

  tieneBlog(idUsuario) {
    return axios
      .post(API_URL + "tieneBlog", {
        idUsuario
      })
      .then(response => {
        
        return response.data;
      });
  }

  
  crearBlog(idUsuario) {
    return axios
      .post(API_URL + "crearBlog", {
        idUsuario
      })
      .then(response => {
        
        return response.data;
      });
  }
  
  infoBlog(idUsuario) {
    return axios
      .post(API_URL + "infoBlog", {
        idUsuario
      })
      .then(response => {
        
        return response.data;
      });
  }

  infoBlogEnlace(enlace) {
    return axios
      .post(API_URL + "infoBlogEnlace", {
        enlace
      })
      .then(response => {
        return response.data;
      });
  }


  actuPortada(idUsuario, archivo) {
    return axios
      .post(API_URL + "actuPortadaBlog", {
        idUsuario,
        portada: archivo
      });
  }

  blogPopulares(dias) {
    return axios
      .post(API_URL + "blogPopulares", {
        dias,
      })
      .then(response => {
        return response.data;
      });
  }

}


export default new BlogService();

