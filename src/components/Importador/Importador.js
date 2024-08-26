import React, { Component } from "react";
import { Ring } from 'react-awesome-spinners'
import axios from "axios";
import AuthService from "../../services/auth.service";


export default class Importador extends Component {
  constructor(props) {
    super(props);

    this.state = {
      partida: null,
      user: "",
      pass: "",
      enlace: "",
      cargando: false,
    };
  }


  async componentDidMount() {
   this.setState({pass:""})

  }


  handleSubmit = async e => {
    e.preventDefault();
    this.setState({cargando: true})
    this.setState({partida: await this.getPartida()})
    this.setState({cargando: false})
      
    axios.post("https://rolotopia-back.duckdns.org/rolo/importador", {
      idCreador: AuthService.getCurrentUser().id,
      nombre: this.state.partida.data.nombre, 
      imagen: this.state.partida.data.imagen, 
      descripcion: this.state.partida.data.descripcion, 
      /*notas: notas, introduccion: introduccion, */
      personajes: this.state.partida.data.personajes, 
      pnjs: this.state.partida.data.pnjs, 
      escenas: this.state.partida.data.escenas, 
      postEscenas: this.state.partida.data.postEscenas, 
      editor:  JSON.stringify([
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


    
  }

  getPartida = async e => {
   return axios.get("http://146.190.22.8:4001/screenshot/?user="+this.state.user+"&enlace="+this.state.enlace+"&pass="+this.state.pass);
}

  render() {
    return (
      <div>
      
      <form onSubmit={this.handleSubmit}>
            <p>
              <strong>Cargar partida:</strong>
            </p>
            <p>Usuario: </p>
            <input
              type="text"
              value={this.state.user}
              onChange={e => this.setState({ user: e.target.value })}
            />

            <p>Contraseña: </p>
            <input
              type="password"
              value={this.state.pass}
              onChange={e => this.setState({ pass: e.target.value })}
              autoComplete="off"
            />

            <p>Enlace: </p>
            <input
              type="text"
              value={this.state.enlace}
              onChange={e => this.setState({ enlace: e.target.value })}
            />



            <p></p>
            <button type="submit">Cargar partida</button>
          </form>


{this.state.cargando &&  <Ring />}

      </div>
    );
  }
}
