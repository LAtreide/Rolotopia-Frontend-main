import axios from "axios";
import { API_URL, BASE_URL } from '../constantes';

class PartidaService {

  lista(id) {
    return axios
      .post(API_URL + "listapartidas", {
        id
      })
      .then(response => {
        return response.data;
      });
  }


  infolink(enlace) {
    return axios
      .post(API_URL + "infoPartida", {
        enlace
      })
      .then(response => {
        return response.data;
      });
  }

  infoPartidaId(id) {
    return axios
      .post(API_URL + "infoPartidaId", {
        id
      })
      .then(response => {
        return response.data;
      });
  }

  isDirector(idPartida, idUsuario) {
    return axios
      .post(API_URL + "isDirector", {
        id: idPartida,
        idCreador: idUsuario
      })
      .then(response => {


        return response.data;
      });
  }

  actuPortada(id, archivo) {
    return axios
      .post(API_URL + "actuPortada", {
        id,
        imagen: archivo
      });
  }
  jugadores(idPartida) {
    return axios
      //.post(API_URL + "listaJugadores", {
      .post(BASE_URL + "listaJugadores", {
        idPartida
      })
      .then(response => {
        return response.data;
      });


  }


  creaPartida(nombre, plazas, m18, ritmo, nivel, fechaCreacion, fechaInicio, idCreador) {
    return axios
      .post(API_URL + "creaPartida", {
        nombre,
        plazas,
        m18,
        ritmo,
        nivel,
        fechaCreacion,
        fechaInicio,
        idCreador,
        editor: JSON.stringify([
          "undo",
          "redo",
          "style",
          "|",
          "bold",
          "italic",
          "strikethrough",
          "underline",
          "subscript",
          "superscript",
          "removeFormat",
          "|",
          "heading",
          "alignment",
          "outdent",
          "indent",
          "|",
          "-",
          "fontFamily",
          "fontBackgroundColor",
          "fontColor",
          "fontSize",
          "highlight",
          "bulletedList",
          "numberedList",
          "|",
          "imageInsert",
          "mediaEmbed",
          "blockQuote",
          "insertTable",
          "|",
          "horizontalLine",
          "specialCharacters",
          "|",
          "codeBlock",
          "link",
          "|"

        ])
      })
      .then(response => {

        return response.data;
      });
  }

  nuevoJugador(jugador, idPartida, idPersonaje) {

    return axios
      .post(API_URL + "nuevoJugador", {
        jugador,
        idPartida,
        idPersonaje,
      })
      .then(response => {

        return response.data;
      });

  }

  desasignar(jugador, idPersonaje, idPartida) {
    return axios
      .post(API_URL + "desasignar", {
        jugador,
        idPersonaje,
        idPartida
      })


  }


  cambiarSistema(id, idSistema) {
    return axios
      .post(API_URL + "cambiarSistema", {
        id,
        idSistema,
      })
  }

  cambiarEstado(idUsuario, idPartida, estado) {
    console.log(estado)
    return axios
      .post(API_URL + "cambiarEstado", {
        idUsuario,
        idPartida,
        estado,
      })
  }

  cambiarTitulo(id, titulo) {
    return axios
      .post(BASE_URL + "cambiarTitulo", {
        id,
        titulo,
      })
      .then(response => {
        return response.data;
      });
  }

  cambiarDescripcion(id, descripcion) {
    return axios
      .post(API_URL + "cambiarDescripcion", {
        id,
        descripcion,
      })
  }



  editorInfo(idPartida) {
    return axios
      .post(API_URL + "editorInfo", {
        idPartida,
      })
      .then(response => {

        return response.data;
      });

  }


  guardarEditor(idPartida, editor) {
    return axios
      .post(API_URL + "guardarEditor", {
        idPartida,
        editor
      })
      .then(response => {

        return response.data;
      });

  }

  cambiarEstilo(id, estilo) {
    return axios
      .post(API_URL + "cambiarEstilo", {
        id,
        imagenFondo: estilo.imagenFondo,
        fondoEscenas: estilo.fondoEscenas,
        colorDados: estilo.colorDados,
        textoEscenas: estilo.textoEscenas,
        colorTitulo: estilo.colorTitulo,
        fuenteTitulo: estilo.fuenteTitulo,
        fondoPost: estilo.fondoPost,
      })
  }

  setNotifications(idJugador, idPartida, notificacion) {
    return axios
      .post(API_URL + "setNotifications", {
        idJugador,
        idPartida,
        notificacion
      });
  }


  isNotification(idPartida, idJugador) {
    return axios
      .post(API_URL + "isNotification", {
        idPartida,
        idJugador
      })
      .then(response => {

        return response.data;
      });

  }


  infoPestanas(idPartida, idUsuario) {
    return axios
      .post(API_URL + "infoPestanas", {
        idPartida,
        idUsuario
      })
      .then(response => {

        return response.data;
      });

  }

  defectoPestanas(id, pestanas) {
    axios
      .post(API_URL + "defectoPestanas", {
        id,
        pestanas
      })
  }

  sobreescribirPestanas(id, pestanas) {
    axios
      .post(API_URL + "sobreescribirPestanas", {
        id,
        pestanas
      })
  }


  crearMarcador(idPartida, idUsuario, url, texto) {
    axios
      .post(API_URL + "crearMarcador", {
        idPartida,
        idUsuario,
        url,
        texto
      })
  }


  getMarcadores(idPartida, idUsuario) {
    return axios

      .post(BASE_URL + "getMarcadores", {
        idPartida,
        idUsuario
      })
      .then(response => {
        return response.data;
      });


  }

  borrarMarcador(idPartida, idUsuario, texto) {

    axios
      .post(BASE_URL + "borrarMarcador", {
        idPartida,
        idUsuario,
        texto
      })


  }

  cambiarMostrarPersonajes(id, mostrarPersonajes) {

    axios
      .post(BASE_URL + "guardarMostrarPersonajes", {
        id,
        mostrarPersonajes

      })


  }




  solicitarRecuento(idPartida, escenas, personajes, finicio, ffin) {
    return axios
      .post(API_URL + "solicitarRecuento", {
        idPartida,
        escenas,
        personajes,
        finicio,
        ffin
      })
      .then(response => {
        console.log(personajes)
        console.log(response.data)
        return response.data;
      });
  }


  borrarPartida(idPartida) {
    return axios
      .post(API_URL + "borrarPartida", {
        idPartida,
      })
  }


  ultimasPartidas(limite) {
    return axios
      .post(API_URL + "ultimasPartidas", {
        limite,
      })
      .then(response => {
        return response.data;
      });
  }


  guardarFormulario(partida, formulario) {
    return axios
      .post(API_URL + "guardarFormularioPartida", {
        partida, formulario
      })
      .then(response => {
        return response.data;
      });
  }


  cargarFormulario(partida) {
    return axios
      .post(API_URL + "cargarFormularioPartida", {
        partida
      })
      .then(response => {
        return response.data;
      });
  }

  formulariosLegiblesPartida( idPartida) {
    return axios
      .post(API_URL + "formulariosLegiblesPartida", {
        idPartida
      })
      .then(response => {
        return response.data;
      });
  }

  formulariosNoLeidosPartida(idUsuario, idPartida) {
    return axios
      .post(API_URL + "formulariosNoLeidosPartida", {
        idUsuario,
        idPartida
      })
      .then(response => {
        return response.data;
      });
  }


  listaFormulariosPartida(idPartida) {
    return axios
      .post(API_URL + "listaFormulariosPartida", {
        idPartida
      })
      .then(response => {
        return response.data;
      });
  }


  cargarFormularioId(idUsuario, id) {
    return axios
      .post(API_URL + "cargarFormularioId", {
        idUsuario,
        id
      })
      .then(response => {
        return response.data;
      });
  }

  cargarBorradorFormulario(idUsuario, idPartida) {
    return axios
      .post(API_URL + "cargarBorradorFormulario", {
        idUsuario,
        idPartida
      })
      .then(response => {
        return response.data;
      });
  }


  formularioRelleno(idUsuario, idPartida, formulario, borrador) {
    return axios
      .post(API_URL + "formularioRelleno", {
        idUsuario,
        idPartida,
        formulario,
        borrador
      })
      .then(response => {
        return response.data;
      });
  }

  borrarFormulario(id) {
    return axios
      .post(API_URL + "borrarFormulario", {
     id
      })
      .then(response => {
        return response.data;
      });
  }

  formularioPrevio(idUsuario, idPartida) {
    return axios
      .post(API_URL + "formularioPrevioPartida", {
        idUsuario,
        idPartida
      })
      .then(response => {
        return response.data;
      });
  }

  guardarPartidaPublica(idPartida, publica) {
   
    return axios
      .post(API_URL + "setPartidaPublica", {
        idPartida,
        publica
      })
      .then(response => {
        return response.data;
      });
  }

  guardarPartidaAbierta(idUsuario, idPartida, abierta) {
   
    return axios
      .post(API_URL + "setPartidaAbierta", {
        idUsuario,
        idPartida,
        abierta
      })
      .then(response => {
        return response.data;
      });
  }


}

const partidaServiceInstance = new PartidaService();
export default partidaServiceInstance;