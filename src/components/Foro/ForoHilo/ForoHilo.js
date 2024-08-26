import React from 'react';
import foroService from '../../../services/foro.service';
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ForoMensaje from '../ForoMensaje/ForoMensaje';
import EditorTextoCompleto from "../../EditorTexto/editorTextoCompleto"
import authService from '../../../services/auth.service';

import { Rnd } from 'react-rnd';
import Switch from '@mui/material/Switch';
import Popup from 'reactjs-popup';


export default class ForoHilo extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      listaMensajes: [],
      carga: 0,
      menuNuevoMensaje: false,
      texto: "",
      seccion: this.props.seccion,
      hilo: this.props.hilo,
      infoSeccion: null,
      infoHilo: null,
      menu: false,
      tituloAux: null,
      notificacionesActivadas: false,
    };


  }

  async componentDidMount() {

    this.setState({
      infoSeccion: await foroService.infoSeccion(this.state.seccion),
      infoHilo: await foroService.infoHilo(this.state.hilo),
    })
    this.setState({
      listaMensajes: await foroService.listaMensajes(this.state.infoHilo.id),
      notificacionesActivadas: await foroService.getNotificaciones(authService.getCurrentUser().id, this.state.infoHilo.id)
    })
    this.setState({ carga: 1 })

  }


  handleSubmit = async e => {
    e.preventDefault();

    let a = await foroService.nuevoMensaje(this.state.infoHilo.id, authService.getCurrentUser().id, this.state.texto);
    let b = this.state.listaMensajes;
    b.push(a);
    this.setState({
      listaMensajes: b,
      texto: "",
      menuNuevoMensaje: false
    });
  }

  cerrarHilo() {
    let a = this.state.infoHilo;
    a.cerrado = 1;
    this.setState({ menu: false, infoHilo: a })
    foroService.abrirCerrarHilo(this.state.infoHilo.id, 1)
  }

  abrirHilo() {
    let a = this.state.infoHilo;
    a.cerrado = 0;
    this.setState({ menu: false, infoHilo: a })
    foroService.abrirCerrarHilo(this.state.infoHilo.id, 0)
  }


  handleSubmitEditar = async e => {
    e.preventDefault();
    let a = this.state.infoHilo;
    a.titulo = this.state.tituloAux;
    this.setState({
      infoHilo: a,
      menuEditar: false,
      tituloAux: null,
    });
    let b = await foroService.editarHilo(this.state.infoHilo);
    window.history.replaceState(null, "New Page Title", "/foro/" + this.state.seccion + "/hilo/" + b.enlace)
    // this.props.onEditHilo(b);
  }




  async borrarHilo() {
    await foroService.borrarHilo(this.state.infoHilo.id);
    this.setState({
      menu: false,
    })
    this.props.general();

  }


  handleNotif(a) {
    foroService.setNotificationes(authService.getCurrentUser().id, this.state.infoHilo.id, a.target.checked);
    this.setState({ notificacionesActivadas: a.target.checked })
  }

  render() {
    return (

      <div>
        {this.state.carga === 1 && (this.state.infoSeccion.staff === 0 || (authService.getCurrentUser().roles.includes("ROLE_MODERATOR") || authService.getCurrentUser().roles.includes("ROLE_ADMIN"))) ?


          <div style={{ display: "flex", flexDirection: "column" }}>
            <h2 onClick={() => this.props.onSeccion(this.state.seccion)}  className="tituloSeccion">{this.state.infoSeccion.titulo}</h2>
            <h3>{this.state.infoHilo.cerrado === 1 ? <FontAwesomeIcon icon={faLock}></FontAwesomeIcon> : null}{this.state.infoHilo.titulo}</h3>
            <div style={{ float: 'right', alignItems: "right" }}>

              {(authService.getCurrentUser().roles.includes("ROLE_MODERATOR") || authService.getCurrentUser().roles.includes("ROLE_ADMIN")) ?
                <input type="submit" value={this.state.menu ? "⇭" : "⤋"} style={{float: "right"}} onClick={() => this.setState({ menu: !this.state.menu })} /> : null}
              <div style={{ float: 'right' }}>
                <Popup
                  trigger={<Switch defaultChecked={this.state.notificacionesActivadas} onChange={(a) => this.handleNotif(a)}  /*color="secondary"*/ />}
                  position="bottom center"
                  nested
                >
                  {close =>
                    <p style={{ border: '1px solid black' }} close={setTimeout(() => {

                      setTimeout(() => {
                        close()
                      }, 1000)

                    }, 1000)}  >
                      {this.state.notificacionesActivadas ? "Notificaciones activadas" : "Notificaciones desactivadas"}
                    </p>

                  }
                </Popup>
                {this.state.menu &&
                  <div style={{ display: 'block' }}>
                    <Rnd
                      disableDragging
                      enableResizing={{
                        bottom: false
                      }}
                      style={{ boxSizing: 'border-box', border: '1px solid blue', backgroundColor: 'white', paddingRight: '10px' }}
                    >
                      <ul>
                        <li><button onClick={() => { if (window.confirm('¿Estás seguro de que quieres borrar este hilo?')) this.borrarHilo() }}> Borrar hilo</button></li>
                        <li><button onClick={() => this.setState({ menu: false, menuEditar: true, tituloAux: this.state.infoHilo.titulo })}> Editar Hilo</button></li>
                        {this.state.infoHilo.cerrado === 0 ?
                          <li>
                            <button onClick={() => this.cerrarHilo()}> Cerrar Hilo</button>
                          </li>
                          :
                          <li>
                            <button onClick={() => this.abrirHilo()}> Abrir Hilo</button>
                          </li>
                        }

                      </ul>
                    </Rnd>
                  </div>
                }

                {this.state.menuEditar &&
                  <Rnd
                    disableDragging
                    enableResizing={{
                      bottom: false
                    }}
                    style={{ boxSizing: 'border-box', border: '1px solid blue', backgroundColor: 'white', paddingRight: '10px', paddingLeft: '10px' }}>
                    <form onSubmit={this.handleSubmitEditar}>
                      <p>Titulo: </p>
                      <input
                        type="text"
                        value={this.state.tituloAux}
                        onChange={e => this.setState({ tituloAux: e.target.value })}
                      />
                      <p></p>
                      <button type="submit">Guardar Cambios</button>
                    </form>

                    <button onClick={() => this.setState({ menuEditar: false, tituloAux: null, descripcionAux: null, staffAux: null })}> Cancelar</button>

                  </Rnd>
                }

              </div>

            </div>


            {this.state.listaMensajes.map(i =>

              <li key={i.id} style={{ listStyle: "none" }}>
           
                <ForoMensaje mensaje={i} />


              </li>)
            }
            {(this.state.infoHilo.cerrado === 0 || authService.getCurrentUser().roles.includes("ROLE_MODERATOR") || authService.getCurrentUser().roles.includes("ROLE_ADMIN")) ?

              <button onClick={() => this.setState({ menuNuevoMensaje: true })}>Nuevo Mensaje</button> : null
            }
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
          </div> : null}
      </div>


    )
  }
}

