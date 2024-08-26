import React from 'react';
import NuevoMensaje from './NuevoMensaje';
import MostrarMensaje from './MostrarMensaje';
import mensajeService from '../../services/mensaje.service';
import AuthService from '../../services/auth.service';
import "../../css/MensajesPrivados.css";
import { over } from 'stompjs';
import SockJS from 'sockjs-client';

var stompClient = null;

export default class Buzon extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mensaje: 0,
      buzon: 1,
      lista: [],
      hilo: [],
      carga: 0,
      pagina: 1,
      npag: 0,
    };
  }

  componentDidMount = async () => {
    if (this.props.buzon === 0) await this.setState({ buzon: 0 });
    if (this.props.buzon === 2) await this.setEnviados();
    if (this.props.buzon === 1) await this.setEntrantes();
    this.setState({ carga: 1 });
  };

  handleRowClick = (event, rowData) => {
    this.setState({ mensaje: this.state.lista[event.index].id });
  };

  onEnviado = (mensaje) => {
    this.setState({ mensaje: 0, buzon: 2 });
    this.setState({ mensaje: mensaje })
  };

  setNuevo = () => {
    this.setState({ buzon: 0, mensaje: 0 });
    window.history.replaceState(null, "New Page Title", "/mensajes/enviar");
  };

  setEntrantes = async () => {
    this.setState({
      buzon: 1,
      mensaje: 0,
      npag: await mensajeService.paginasEntrantes(AuthService.getCurrentUser().id),
      listaEntrantes: await mensajeService.listaMensajes(AuthService.getCurrentUser().id, this.state.pagina),
    });
    window.history.replaceState(null, "New Page Title", "/mensajes/recibidos");
  };

  setEnviados = async () => {
    this.setState({
      npag: await mensajeService.paginasEnviados(AuthService.getCurrentUser().id),
      listaEnviados: await mensajeService.listaEnviados(AuthService.getCurrentUser().id, this.state.pagina),
    });
    this.setState({ buzon: 2, mensaje: 0 });
    window.history.replaceState(null, "New Page Title", "/mensajes/enviados");
  };

  leerNoLeido(hilo) {
    this.setState({ mensaje: hilo });
    let Sock = new SockJS('https://rolotopia-back.duckdns.org/ws');
    stompClient = over(Sock);
    stompClient.connect({}, this.onConnected, this.onError);
  }

  onConnected() {
    stompClient.send("/app/abrir-mensaje", {}, JSON.stringify({
      receiverName: AuthService.getCurrentUser().username
    }));
    stompClient.disconnect();
  }

  render() {
    return (
      <div className="container mensajesContainer">
        <div className="buttonGroup">
          <button onClick={this.setNuevo} className={this.state.buzon === 0 ? "botonActivo" : "botonInactivo"}>Nuevo mensaje</button>
          <button onClick={() => { this.setEntrantes(); this.setState({ pagina: 1 }); }} className={this.state.buzon === 1 ? "botonActivo" : "botonInactivo"}>Buzón de entrada</button>
          <button onClick={() => { this.setEnviados(); this.setState({ pagina: 1 }); }} className={this.state.buzon === 2 ? "botonActivo" : "botonInactivo"}>Buzón de Salida</button>
        </div>

        {this.state.buzon === 0 &&
          <div>
            <p>Escribir mensaje</p>
            <NuevoMensaje onEnviado={mensaje => this.onEnviado(mensaje)} />
          </div>
        }

        {this.state.mensaje === 0 && this.state.carga === 1 &&
          <div>
            {this.state.buzon === 1 &&
              <div>
                <ul className="listaMensajes">
                  {this.state.listaEntrantes.map((i, index) =>
                    <li key={i.id}>
                      <div className={"barraMensaje" + (i.leido === 0 ? " noLeido" : "")} onClick={i.leido === 0 ? e => this.leerNoLeido(i.hilo) : e => { this.setState({ mensaje: i.hilo }); i.leido = 1; }}>
                        <div className="c1"><span>{i.nRemitente}</span></div>
                        <div className="c2"><span>{i.asunto}</span></div>
                        <div className="c3"><span>{i.fecha}  {i.hora.substring(0, 5)}</span></div>
                        <div className="c4"><span>{i.importante === 1 ? "!" : null}</span></div>
                      </div>
                    </li>
                  )}
                </ul>

                <div className="pagination">
  <div className="arrow-left">
    {this.state.pagina > 2 && <span onClick={() => { this.setState({ pagina: 1 }); this.setEntrantes(); }}>1</span>}
    {this.state.pagina > 1 && <span onClick={() => { this.setState({ pagina: this.state.pagina - 1 }); this.setEntrantes(); }}>-</span>}
  </div>
  <div className="center">
    <span className="active"><b>{this.state.pagina}</b></span>
  </div>
  <div className="arrow-right">
    {this.state.pagina < this.state.npag && <span onClick={() => { this.setState({ pagina: this.state.pagina + 1 }); this.setEntrantes(); }}>+</span>}
    {this.state.pagina < this.state.npag - 1 && <span onClick={() => { this.setState({ pagina: this.state.npag }); this.setEntrantes(); }}>{this.state.npag}</span>}
  </div>
</div>
              </div>
            }
            {this.state.buzon === 2 &&
              <div>
                <ul className="listaMensajes">
                  {this.state.listaEnviados.map((i, index) =>
                    <li key={i.id}>
                      <div className="barraMensaje" onClick={() => { this.setState({ mensaje: i.hilo }) }}>
                        <div className="c1"><span>{i.nRemitente}</span></div>
                        <div className="c2"><span>{i.asunto}</span></div>
                        <div className="c3"><span>{i.fecha}  {i.hora.substring(0, 5)}</span></div>
                        <div className="c4"><span>{i.importante === 1 ? "!" : null}</span></div>
                      </div>
                    </li>
                  )}
                </ul>

                <div className="pagination">
                  {this.state.pagina > 2 && <span onClick={() => { this.setState({ pagina: 1 }); this.setEnviados(); }}>1</span>}
                  {this.state.pagina > 1 && <span onClick={() => { this.setState({ pagina: this.state.pagina - 1 }); this.setEnviados(); }}>-</span>}
                  <span className="active"><b>{this.state.pagina}</b></span>
                  {this.state.pagina < this.state.npag && <span onClick={() => { this.setState({ pagina: this.state.pagina + 1 }); this.setEnviados(); }}>+</span>}
                  {this.state.pagina < this.state.npag - 1 && <span onClick={() => { this.setState({ pagina: this.state.npag }); this.setEnviados(); }}>{this.state.npag}</span>}
                </div>
              </div>
            }
          </div>
        }
        {this.state.mensaje !== 0 &&
          <div>
            <MostrarMensaje hilo={this.state.mensaje} onVolver={() => this.state.buzon === 1 ? this.setEntrantes() : this.setEnviados()} onEnviado={mensaje => this.onEnviado(mensaje)} />
          </div>
        }
      </div>
    );
  }
}
