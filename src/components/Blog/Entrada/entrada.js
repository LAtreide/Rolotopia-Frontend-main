import React, { Component } from 'react';
import authService from '../../../services/auth.service';
import entradaService from '../../../services/entrada.service';
import PublicarEntrada from './PublicarEntrada/publicarEntrada';
import comentarioService from '../../../services/comentario.service';
import NombreUsuario from '../../Usuarios/NombreUsuario';
import ReactHtmlParser from 'react-html-parser';

export default class Entrada extends Component {
  constructor(props) {
    super(props);
    this.state = {
      entrada: null,
      carga: 0,

    };
  }

  async componentDidMount() {

    await this.setState({
      entrada: await entradaService.getEntradaEnlace(this.props.enlace, authService.getCurrentUser().id),
      
    })
    await this.setState({listaComentarios: await comentarioService.listaComentarios(this.state.entrada.id)})

    this.setState({ carga: 1 })
  }

  render() {
    return (
      this.state.carga === 1 &&
      <div>
        {this.state.entrada.id === 0 ?
          <p>Entrada no encontrada</p>
          :
          <div>
            <PublicarEntrada entrada={this.state.entrada} />
          </div>
        }
        {this.state.listaComentarios.length > 0 &&
          <ul style={{ listStyle: "none", paddingLeft: "5px" }}>
            {this.state.listaComentarios.map(i =>
              <li key={i.id} style={{ border: "1px solid black", borderRadius: "3px", marginBottom: "3px", padding: "3px" }}>
                <p><NombreUsuario usuario={i.nombreUsuario} /> escribió</p>

                {ReactHtmlParser(i.texto)}

              </li>
            )}

          </ul>
        }
      </div>
    )
  }


}