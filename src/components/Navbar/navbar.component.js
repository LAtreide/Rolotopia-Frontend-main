import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../css/App.css";
import "../../css/notificaciones.css";
import AuthService from "../../services/auth.service";

import letras from '../../letras.png';
import logoMovil from '../../logoMovil.png';

import { faEnvelope, faEnvelopeOpen, faSignOutAlt, faBell, faTools } from "@fortawesome/free-solid-svg-icons";


//import { faUser } from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import mensajeService from "../../services/mensaje.service";



import Popup from 'reactjs-popup';
import authService from "../../services/auth.service";
import MenuLateral from "./MenuLateral/menuLateral";
import AvatarUsuario from "../Utilidad/AvatarUsuario/avatarUsuario";
import { SPACE_URL } from "../../constantes";
import Chat from "../Chat";
import Emitter from "../Utilidad/EventEmitter";



export default class Navbar extends React.Component {
    constructor(props) {
        super(props);
        this.logOut = this.logOut.bind(this);

        this.state = {
            showModeratorBoard: false,
            showAdminBoard: false,
            currentUser: undefined,
            mensajes: 0,
            carga: 0,
            abrirSobre: false,
            listaNotificacionesTemp: [],
            listaNotificaciones: [],
            imagen: 0
        };
    }




    componentDidMount = async e => {
        const user = AuthService.getCurrentUser();
        let logged = false;
        if (user) logged = true;
        if (user)
            if (JSON.parse(atob(user.accessToken.split('.')[1])).exp * 1000 < Date.now()) {
                AuthService.logout();
                logged = false;
                window.location.href = "/login";

            }
        if (logged) {
            this.setState({
                currentUser: user,
                showModeratorBoard: user.roles.includes("ROLE_MODERATOR"),
                showAdminBoard: user.roles.includes("ROLE_ADMIN"),
                mensajes: await mensajeService.noLeidos(user.id)
            });



            Emitter.on('mensajeRecibido', (data) => { this.cargaNoLeidos(); this.cargaNotificacion(data) });
            Emitter.on('mensajeAbierto', (data) => { this.cargaNoLeidos(); this.cargaNotificacion(data) });
            Emitter.on('solicitudRecibida2', (data) => {this.cargaNotificacion(data) });
            Emitter.on('chatEntrante', (data) => { this.chatEntrante(data) });
            
        }

        this.setState({ carga: 1 })

    }


    componentWillUnmount() {
  
    Emitter.off('mensaje', this.handleMensaje);
    Emitter.off('mensajeAbierto', this.handleMensajeAbierto);
    Emitter.off('solicitudRecibida2', this.handleSolicitudRecibida);
    Emitter.off('chatEntrante', this.handleChat);
}
    async cargaNoLeidos() {
        this.setState({ mensajes: await mensajeService.noLeidos(authService.getCurrentUser().id) })
    }



    async cargaNotificacion(data){
    
    let a = this.state.listaNotificacionesTemp;
    a.unshift(data);
    let b = this.state.listaNotificaciones;
    b.unshift(data);
    this.setState({
        listaNotificacionesTemp: a,
        listaNotificaciones: b
    })

    setTimeout(() => {
        a.splice(a.length - 1, 1);
        this.setState({ listaNotificacionesTemp: a })
    }, 5000)
}

delNotification(e, index) {
    e.preventDefault();
    let a = this.state.listaNotificaciones;
    a.splice(index, 1);
    this.setState({ listaNotificaciones: a })
}

logOut() {
    AuthService.logout();
}



chatEntrante(mensaje) {

    this.chat.mensajeRecibido(mensaje);

}

render() {
    const { currentUser, showModeratorBoard, showAdminBoard } = this.state;

    return (

        <div>
            <nav className="navbar navbar-expand navbar-ppal">
                <Link to={"/"} className="navbar-brand">
                    <img src={window.innerWidth < 700 ? logoMovil : letras} alt="Logo" title="Logo" className="navbar-logo" />
                </Link>



                {currentUser && (
                    <div className="navbar-nav mx-auto text-center">

                        <li className="nav-item">
                            <Link to={"/inicio"} className="nav-link">
                                ROLOTOPÍA
                            </Link>
                        </li>


                        <li className="nav-item">
                            <Link to={"/rol-by-post"} className="nav-link" style={{ margin: "0px 35px 0px 35px", }}>
                                ROL BY POST
                            </Link>
                        </li>


                        <li className="nav-item">
                            <Link to={"/escritorio"} className="nav-link">
                                ESCRITORIO
                            </Link>
                        </li>

                    </div>
                )}


                {currentUser ? (
                    <div className="navbar-nav ml-auto" style={{ display: "contents" }}>


                        {showModeratorBoard && (
                            <li className="nav-item">
                                <Link to={"/mod"} className="nav-link">
                                    <FontAwesomeIcon icon={faTools} />
                                </Link>
                            </li>
                        )}

                        {showAdminBoard && (
                            <li className="nav-item">
                                <Link to={"/admin"} className="nav-link">
                                    <FontAwesomeIcon icon={faTools} />
                                </Link>
                            </li>
                        )}

                        <li className="nav-item">
                            <Popup
                                trigger={
                                    <span className={"nav-link" + (this.state.listaNotificaciones.length > 0 ? " nav-active" : "")}>
                                        <FontAwesomeIcon icon={faBell} />
                                        {this.state.carga === 1 ? this.state.listaNotificaciones.length : 0}</span>

                                }
                                position="bottom center"
                                nested
                            >
                                <ul className="listaNotificaciones">
                                    {this.state.listaNotificaciones.length > 0 && this.state.listaNotificaciones.map((i, index) =>
                                        <Link className="notificacionEnlace" to={"/" + this.state.listaNotificaciones[index].enlace}>
                                            <li key={index} className="notificacion notificacionEnlace">
                                                <img src={this.state.listaNotificaciones[index].imagen} alt="" />
                                                <span> {this.state.listaNotificaciones[index].message}</span>
                                                <button className="cerrarNotificacion" onClick={(e) => this.delNotification(e, index)}></button>
                                            </li>
                                        </Link>


                                    )}

                                    {this.state.listaNotificaciones.length === 0 &&
                                        <li className="notificacion">
                                            <span>{"No tienes notificaciones pendientes."}</span>
                                        </li>
                                    }

                                </ul>
                            </Popup>


                        </li>

                        <li className="nav-item" onMouseEnter={() => this.setState({ abrirSobre: true })} onMouseLeave={() => this.setState({ abrirSobre: false })}>
                            <Link to={"/mensajes/recibidos"} className={"nav-link" + (this.state.mensajes > 0 ? " nav-active" : "")}>
                                <span><FontAwesomeIcon icon={this.state.abrirSobre === true ? faEnvelopeOpen : faEnvelope} className={this.state.abrirSobre === true ? "sobreAbierto" : ""} /> {this.state.carga === 1 ? this.state.mensajes : 0}</span>
                            </Link>
                        </li>

                        <li className="nav-item">
                            <a href="/login" className="nav-link" onClick={this.logOut}>
                                <FontAwesomeIcon icon={faSignOutAlt} />
                            </a>
                        </li>
                        <li>
                            <Link to={"/perfil"} className="nav-link" style={{ display: "flex", alignItems: "center" }}>

                                <AvatarUsuario src={SPACE_URL + "/avatarUser/" + currentUser.avatar} height="50px" alt="" style={{ borderRadius: "50%", border: "1px solid white" }} />
                            </Link>

                        </li>
                    </div>
                ) : (
                    <div className="navbar-nav ml-auto">
                        <li className="nav-item">
                            <Link to={"/login"} className="nav-link">
                                Entrar
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link to={"/register"} className="nav-link">
                                Crear cuenta
                            </Link>
                        </li>
                    </div>

                )
                }
            </nav>
            {
                this.state.listaNotificacionesTemp.length > 0 &&
                <ul className="listaNotificacionesTemporal">


                    {this.state.listaNotificacionesTemp.map((i, index) =>

                        <li key={index} className="notificacion">

                            <img src={this.state.listaNotificacionesTemp[index].imagen} alt="" />

                            <span>{this.state.listaNotificacionesTemp[index].message}</span>


                        </li>

                    )}


                </ul>

            }


            {
                currentUser &&
                <MenuLateral />
            }

            {
                currentUser &&
                <Chat usuario={currentUser} ref={ref => this.chat = ref} />
            }
        </div >


    );
}
}



