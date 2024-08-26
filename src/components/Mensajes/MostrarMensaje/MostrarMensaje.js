import React from 'react';
import mensajeService from '../../../services/mensaje.service';
import ReactHtmlParser from 'react-html-parser';
import AuthService from '../../../services/auth.service';
import NuevoMensaje from '../NuevoMensaje';
import { Link } from 'react-router-dom';
import "../../../css/MensajesPrivados.css"
import authService from '../../../services/auth.service';


export default class MostrarHilo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            previos: false,
            responder: 0,
            destResponder: null,
            destResponderTodos: null,
            mensaje: null,
            hilo: []

        };
    }


    componentDidMount = async e => {
        this.setState({
            hilo: await mensajeService.hiloMensajes(this.props.hilo, AuthService.getCurrentUser().id),
            carga: 1
        })

    }

    async onEnviado(mensaje) {
        
       this.setState({ responder: 0 });
        let m = await mensajeService.leerMensaje(mensaje, AuthService.getCurrentUser().id);
        let a = [...this.state.hilo, m];
       
        
        await this.setState({ hilo: a })
        console.log(this.state.hilo)
        
    }



    render() {
        return (
            <div className="container mt-3">
                {this.state.carga === 1 &&

                    <div style={{ textAlign: 'left', display: 'block' }}>


                        <ul style={{ listStyle: "none" }}>
                            {
                                this.state.hilo.map((i, index) =>

                                    <li key={index}>
                                        
                                        <MostrarMensaje mensaje={i} mostrar={index === this.state.hilo.length - 1} onEnviado={mensaje => this.onEnviado(mensaje)} />

                                    </li>

                                )
                            }

                        </ul>
                        <button onClick={e => this.props.onVolver()}>Volver</button>


                    </div>
                }

            </div>
        )
    }
};





class MostrarMensaje extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            previos: false,
            responder: 0,
            destResponder: null,
            destResponderTodos: null,
            mensaje: this.props.mensaje,
            mostrar: (this.props.mostrar || this.props.mensaje.leido === 0) ? true : false,
            reenviar: 0,

        };
    }

    componentDidMount = async e => {

        

    };

    destResponder() {
        if (this.state.mensaje.nRemitente === authService.getCurrentUser().username) return this.props.mensaje.nDestinatarios;
        else return [this.state.mensaje.nRemitente]
    }

    onEnviado = (mensaje) => {
        this.setState({ responder: 0, reenviar: 0 });
        this.props.onEnviado(mensaje);

    }

    respTodos() {
        let a = this.state.mensaje.nDestinatarios;

        var index = a.indexOf(this.state.mensaje.nRemitente);

        if (index === -1) {
            a.push(this.state.mensaje.nRemitente)
        }

        index = a.indexOf(authService.getCurrentUser().username);

        if (index !== -1) {
            a.splice(index, 1)
        }

        return a;

    }

    render() {
        return (
            <div>


                <div style={{ border: '1px solid black', borderRadius: '8px'}}>
                    <div className="cabeceraMensaje" onClick={() => { this.setState({ mostrar: !this.state.mostrar }) }}>

            
                        <Link to={"/usuario/" + this.state.mensaje.nRemitente} ><span>{this.state.mensaje.nRemitente} </span></Link>


                        <span className="c2">{this.state.mensaje.asunto}</span>

                        <span className="c3">Para:
                            {this.state.mensaje.nDestinatarios.length > 0 && this.state.mensaje.nDestinatarios.map((i) =>

                                    <span key={i}>{i} </span>

                                )
                            }
                        </span>
                        <span className="c4">{this.state.mensaje.fecha} {this.state.mensaje.hora.substring(0, 5)}</span>



                        <span className="c5">{this.state.mensaje.importante === 1 ? "!" : null}</span>

                    </div>

             

                    {this.state.mostrar &&
                        <div className="mensaje">
                            {ReactHtmlParser(this.state.mensaje.texto)}


                            <p>{this.state.previos}</p>
                            {this.state.mensaje.respuesta > 0 &&
                                <button onClick={e => this.setState({ previos: !this.state.previos })}>...</button>
                            }

                            {this.state.previos ?
                                <div >
                                    {ReactHtmlParser(this.state.mensaje.texRespuesta)}

                                </div>
                                : null
                            }



                            <button onClick={e => this.setState({ responder: 1 })}>Responder</button>
                            {this.state.mensaje.nDestinatarios.length > 1 &&
                                <button onClick={e => this.setState({ responder: 2 })}>Responder a todos</button>
                            }
                            <button onClick={e => this.setState({ reenviar: 1 })}>Reenviar</button>



                        </div>}
                </div>

                {this.state.responder === 1 &&
                    <div>
                        <NuevoMensaje
                            onEnviado={mensaje => this.onEnviado(mensaje)}
                            asunto={this.state.mensaje.respuesta === 0 ? ("Re: " + this.state.mensaje.asunto) : this.state.mensaje.asunto}
                            destinatarios={this.destResponder()}
                            hilo={this.state.mensaje.hilo}
                            respuesta={this.state.mensaje.id}
                            texRespuesta={"<p>" + this.state.mensaje.nRemitente + " escribió: </p>" + this.state.mensaje.texto + "<hr/>" + this.state.mensaje.texRespuesta} />
                        <button onClick={e => this.setState({ responder: 0 })}>Cancelar</button>
                    </div>
                }

                {this.state.responder === 2 &&
                    <div>
                        <NuevoMensaje
                            onEnviado={mensaje => this.onEnviado(mensaje)}
                            asunto={this.state.mensaje.respuesta === 0 ? ("Re: " + this.state.mensaje.asunto) : this.state.mensaje.asunto}
                            destinatarios={this.respTodos()}
                            respuesta={this.state.mensaje.id}
                            hilo={this.state.mensaje.hilo}
                            texRespuesta={"<p>" + this.state.mensaje.nRemitente + " escribió: </p>" + this.state.mensaje.texto + "<hr/>" + this.state.mensaje.texRespuesta} />
                        <button onClick={e => this.setState({ responder: 0 })}>Cancelar</button>
                    </div>
                }

                {this.state.reenviar === 1 &&
                    <div>
                        <NuevoMensaje
                            onEnviado={mensaje => this.onEnviado(mensaje)}
                            destinatarios={[]}
                            asunto={"Fwd: " + this.state.mensaje.asunto}
                            texto={this.state.mensaje.texto} />
                        <button onClick={e => this.setState({ reenviar: 0 })}>Cancelar</button>
                    </div>

                }

            </div>



        )
    }
};
