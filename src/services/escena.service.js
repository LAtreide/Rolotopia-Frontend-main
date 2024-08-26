import axios from "axios";
import {API_URL} from '../constantes';


class EscenaService {

  crearescena(nombre,descripcion,idPartida) {
    return axios
      .post(API_URL + "crearescena", {
        nombre,
        descripcion,
        idPartida
      })
      .then(response => {
        
        return response.data;
      });
  }

  
  lista(idPartida,idJugador) {
    return axios
      .post(API_URL + "listaescenasp", {
        idPartida,
        idJugador
      })
      .then(response => {
        return response.data;
      });
  }

  
  listaPlanas(idPartida,idJugador) {
    return axios
      .post(API_URL + "listaEscenasPlanas", {
        idPartida,
        idJugador
      })
      .then(response => {
        return response.data;
      });
  }


  infolink(enlace) {
    return axios
      .post(API_URL + "infoEscena", {
        enlace
      })
      .then(response => {
        
        return response.data;
      });
  }


  destinatarios(idPartida,idEscena) {
    return axios
      .post(API_URL + "listadestinatarios", {
        idPartida,
        id: idEscena
      })
      .then(response => {
       
        return response.data;
      });
  }

  
  fijardestinatarios(a,idEscena) {
    
    for(let i=0;i<a.length;i++){
      if(i%5!==0) a[i] ? a[i]=1: a[i]=0;
    }
    
    return axios
      .post(API_URL + "fijardestinatarios", {
        a,
        idEscena
      })
      .then(response => {
      
        return response.data;
      });
  }

  orden(idPartida,orden) {
    
    return axios
      .post(API_URL + "orden", {
        idPartida,
        orden
      })
      .then(response => {
      
        return response.data;
      });
  }

  ordenCapitulo(idCapitulo,orden) {
    
    return axios
      .post(API_URL + "ordenCapitulo", {
        idCapitulo,
        orden
      })
      .then(response => {
      
        return response.data;
      });
  }




changeData(idEscena,nombre,descripcion, recuento){
    
  return axios
    .post(API_URL + "changeEscenaData", {
      idEscena,
      nombre,
      descripcion,
      recuento
    })
}

changeCapituloData(idCapitulo,nombre,descripcion){
    
  return axios
    .post(API_URL + "changeCapituloData", {
      idCapitulo,
      nombre,
      descripcion,
    })
}


crearCapitulo(nombre,descripcion,idPartida) {
  return axios
    .post(API_URL + "crearCapitulo", {
      nombre,
      descripcion,
      idPartida
    })
    .then(response => {  
      return response.data;
    });
}


listaEscenasCapitulo(idCapitulo,idJugador) {
  return axios
    .post(API_URL + "listaEscenasCapitulo", {
      idCapitulo,
      idJugador
    })
    .then(response => {

      return response.data;
    });
}

listaCapitulos(idPartida,idJugador) {
  return axios
    .post(API_URL + "listaCapitulos", {
      idPartida,
      idJugador
    })
    .then(response => {
      return response.data;
    });
}


moverEscena(idEscena,idCapitulo) {
  return axios
    .post(API_URL + "moverEscena", {
      idEscena,
      idCapitulo
    })
  
}

borrarEscena(idEscena) {
  return axios
    .post(API_URL + "borrarEscena", {
      idEscena
    })
  
}

borrarCapitulo(idCapitulo) {
  return axios
    .post(API_URL + "borrarCapitulo", {
      idCapitulo
    })
  
}

}

const escenaService = new EscenaService();
export default escenaService;
