import React from 'react';
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import IncidenciaMensaje from '../IncidenciasMensaje/IncidenciaMensaje';
import EditorTextoCompleto from "../../EditorTexto/editorTextoCompleto"
import authService from '../../../services/auth.service';

import incidenciaService from '../../../services/incidencia.service';


export default class Incidencia extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      listaMensajes: [],
      carga: 0,
      menuNuevoMensaje: false,
      texto: "",
      cerrada: 0,
    };
  }

  async componentDidMount() {

    this.setState({
      info: await incidenciaService.infoIncidencia(authService.getCurrentUser().id, this.props.incidencia),
      listaMensajes: await incidenciaService.listaMensajesIncidencia(authService.getCurrentUser().id, this.props.incidencia),

    })
    this.setState({
      carga: 1,
      cerrada: this.state.info.cerrada,
      atendida: this.state.info.atendida,
    })

  }


  handleSubmit = async e => {
    e.preventDefault();

    let a = await incidenciaService.nuevoMensaje(this.props.incidencia, authService.getCurrentUser().id, this.state.texto, 0);
    let b = this.state.listaMensajes;
    b.push(a);
    this.setState({
      listaMensajes: b,
      texto: "",
      menuNuevoMensaje: false
    });
  }


  async abrirCerrarIncidencia(e) {
    e.preventDefault();
    await this.setState({ cerrada: this.state.cerrada === 1 ? 0 : 1 })
    incidenciaService.abrirCerrarIncidencia(this.props.incidencia, this.state.cerrada)
  }

  async atenderIncidencia(e) {
    e.preventDefault();
    await this.setState({ atendida: this.state.atendida === 1 ? 0 : 1 })
    incidenciaService.atenderIncidencia(this.props.incidencia, this.state.atendida)
  }
  render() {
    return (

      <div>
        {this.state.carga === 1 ?


          <div>
            <h2 onClick={() => this.props.onSeccion(this.state.seccion)}>{this.props.seccion}</h2>
            <h3>{this.state.cerrada === 1 ? <FontAwesomeIcon icon={faLock}></FontAwesomeIcon> : null}{this.state.info.titulo}</h3>

            {authService.getCurrentUser().roles.includes("ROLE_MODERATOR") || authService.getCurrentUser().roles.includes("ROLE_ADMIN") ?
              <div>
                <button onClick={(e) => this.atenderIncidencia(e)} style={{}}>{this.state.atendida ? "Marcar como no atendida" : "Marcar como atendida"}</button>
                <button onClick={(e) => this.abrirCerrarIncidencia(e)} style={{}}>{this.state.cerrada ? "Abrir incidencia" : "Cerrar incidencia"}</button>
              </div>
              : null}

            {this.state.listaMensajes.map(i =>

              <li key={i.id}>

                <IncidenciaMensaje mensaje={i} />


              </li>)
            }

            {authService.getCurrentUser().roles.includes("ROLE_MODERATOR") || authService.getCurrentUser().roles.includes("ROLE_ADMIN") ?
              <div>
                <button onClick={(e) => this.atenderIncidencia(e)} style={{}}>{this.state.atendida ? "Marcar como no atendida" : "Marcar como atendida"}</button>
                <button onClick={(e) => this.abrirCerrarIncidencia(e)} style={{}}>{this.state.cerrada ? "Abrir incidencia" : "Cerrar incidencia"}</button>
              </div>
              : null}
            <button onClick={() => this.setState({ menuNuevoMensaje: true })}>Nuevo Mensaje</button>

            {this.state.menuNuevoMensaje &&
              <form onSubmit={this.handleSubmit}>

                <div style={{ width: '700px', textAlign: 'left', color: 'black' }}>

                  <EditorTextoCompleto texto={this.state.texto} onCambio={(texto) => this.setState({ texto: texto })} />

                  <div style={{ display: "inline-flex", width: '700px', justifyContent: "space-between", marginBottom: '5px' }}>
                  </div>
                </div>
                {this.state.texto !== "" ?
                  <button type="submit">Enviar Mensaje</button> :
                  <button onClick={(e) => e.preventDefault()} style={{ opacity: '50%', cursor: 'not-allowed' }}>Enviar Mensaje</button>
                }
                <button onClick={() => this.setState({ menuNuevoMensaje: false, texto: "" })}> Cancelar</button>

              </form>
            }
            <p></p>
                <button onClick={() => this.props.general()}> Volver</button>

          </div> : null}
      </div>


    )
  }
}

