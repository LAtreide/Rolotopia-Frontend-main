import axios from 'axios';
import authHeader from './auth-header';
//import { API_URL } from '../constantes';

//const API_URL = 'http://170.253.21.98:8080/api/test/';
const API_URL = 'https://rolotopia-back.duckdns.org/test/';



class UserService {
  getPublicContent() {
    return axios.get(API_URL + 'all');
  }

  getUserBoard() {
    return axios.get(API_URL + 'user', { headers: authHeader() });
  }

  getModeratorBoard() {
    return axios.get(API_URL + 'mod', { headers: authHeader() });
  }

  getAdminBoard() {
    return axios.get(API_URL + 'admin', { headers: authHeader() });
  }

}

export default new UserService();
