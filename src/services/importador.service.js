import {API_URL_Auth} from '../constantes';
import axios from "axios";


class ImportadorService {
 
  resetpassword(password, token) {
    return axios
      .get("http://localhost:4000/screenshot", {
        usuario,
        pass,
        enlace
      })
      .then(response => {
        return response.data;
      });
  }


}

export default new ImportadorService();
