import React, { Component } from "react";

import ListaPartida from "../Partidas/listaPartida.component";


export default class BoardUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: "",
      
    };

  }
   
   
  render() {
    return (
      <div>
        <div style={{margin:"25px"}}></div>
        <ListaPartida />

      </div>


    );
  }
}
