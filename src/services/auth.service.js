import {API_URL_Auth} from '../constantes';
import axios from "axios";
import authHeader from './auth-header';
//const API_URL="http://159.223.14.198:8123/rolotopia-backend-0.0.1-SNAPSHOT/api/auth/"
//const API_URL="http://localhost:8565/rolotopia-backend/api/auth/"

class AuthService {
  login(username, password) {
    return axios
      .post(API_URL_Auth + "signin", {
        username,
        password,
        headers: authHeader() 
      })
      .then(response => {
        if (response.data.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }

        return response.data;
      });
  }




  logout() {
    localStorage.removeItem("user");
  }

  register(username, email, password) {
    return axios.post(API_URL_Auth + "signup", {
      username,
      email,
      password
    });
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));;
  }


  recover(email) {
    return axios
      .post(API_URL_Auth + "forgotPassword", {
        email
      })
      .then(response => {
        return response.data;
      });
  }
  resetpassword(password, token) {
    return axios
      .post(API_URL_Auth + "recoverPassword", {
        password,
        token
      })
      .then(response => {
        return response.data;
      });
  }


}

const authService = new AuthService();
export default authService;
