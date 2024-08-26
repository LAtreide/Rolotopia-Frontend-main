import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import PartidaService from '../../services/partida.service';

import AuthService from "../../services/auth.service";
import "../../css/App.css"
import MenuNuevaPartida from "./nuevaPartida.component"
import { SPACE_URL } from '../../constantes';
import Portada from './Portada/portada.component';
import "../../css/Escritorio.css"

export default class ListaPartida extends Component {
  constructor(props) {
    super(props);
    this.state = {
      partidas: [],
      carga: null,
      usuario: AuthService.getCurrentUser(),
      showCrearPartida: false,


    };
  }


  async componentDidMount() {
    const datos = await PartidaService.lista(this.state.usuario.id);

    if (datos) {
      this.setState({
        partidas: datos,
        carga: "cargado",

      });
    }
  }


  onClick = () => this.setState({ showCrearPartida: !this.state.showCrearPartida });
  nuevaPartida = (a) => {
    let b = this.state.partidas;
    b[0][this.state.partidas[0].length] = a;
    this.setState({ partidas: b, showCrearPartida: false });
  }


  render() {
    return (
      <div>

        {this.state.carga &&
          <div>
            <div className="jumbotron listaPartidas">
              <h2>Partidas como director</h2>
              {this.state.partidas[0].length === 0 ? <p>No tienes partidas como director.</p> :
                <ul>
                  {this.state.partidas[0].map(i =>
                    <li key={i.id}>

                      <Link to={"/partida/" + i.enlace} className="link">
                        <Portada src={SPACE_URL + "/portada/" + i.imagen} width={"100px"} />
                        <span>{i.nombre}</span>
                      </Link>
                    </li>)}
                </ul>
              }
              <input type="submit" value="Nueva Partida" onClick={this.onClick} />

              {this.state.showCrearPartida && <MenuNuevaPartida onClose={this.onClick} onPublicar={this.nuevaPartida} />}

            </div>
            <div className="jumbotron listaPartidas">
              <h2>Partidas como jugador</h2>
              {this.state.partidas[1].length === 0 ? <p>No tienes partidas como jugador.</p> :

                <ul>
                  {this.state.partidas[1].map(i =>
                    <li key={i.id}>

                      <Link to={"/partida/" + i.enlace} className="link">
                        <Portada src={SPACE_URL + "/portada/" + i.imagen} width={"100px"} />
                        <span>{i.nombre}</span>
                      </Link>
                    </li>)}
                </ul>
              }
            </div>
          </div>}

      </div>
    )

  }
}