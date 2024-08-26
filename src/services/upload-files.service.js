import http from "../http-common";
import UsuariosService from "./usuarios.service";
import authService from "./auth.service";
import partidaService from "./partida.service";
import { API_URL_Upload } from "../constantes";
import personajeService from "./personaje.service"
import perspropioService from "./perspropio.service.";
import axios from "axios";
import blogService from "./blog.service";

class UploadFilesService {
  upload(file, destino, id) {
    let formData = new FormData();

    formData.append("file", file);

    return axios
    .post(API_URL_Upload+destino, formData, {
      
      formData
      
    })
    .then(response => {
      
      if(destino==="avatar") UsuariosService.actuAvatar(authService.getCurrentUser().id,response.data);
      if(destino==="portada") partidaService.actuPortada(id,response.data); 
      if(destino==="avatarPj") personajeService.actuAvatar(id,response.data);
      if(destino==="avatarPerspropio") perspropioService.actuAvatar(id,response.data);
      if(destino==="portadaBlog") blogService.actuPortada(id,response.data);
      
      
      
      return response.data;
    });
  }

  getFiles() {
    return http.get("/files");
  }
}

export default new UploadFilesService();
