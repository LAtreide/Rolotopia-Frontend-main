import React from 'react';
import { Rnd } from 'react-rnd';
import ReactHtmlParser from 'react-html-parser';
import PartidaService from '../../../services/partida.service';
import authService from '../../../services/auth.service';
import { BASE_URL_FRONT, SPACE_URL } from '../../../constantes';
import AvatarInfoPj from '../../Utilidad/AvatarInfoPj/AvatarInfoPj';
import postService from '../../../services/posts.service';
import "../../../css/Post.css"
import confirm from "../../Utilidad/Confirmacion"
import { faDice, faEdit, faEllipsisV, faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TiradaConstructor from './tiradaConstructor.component';

export default class PublicarPost extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            carga: null,
            menu: false,
            borrado: false,
            editar: false,
            editarDestinatarios: false,
            contenido: "",
            marcador: false,
            textoMarcador: "",
            cambioDestinatarios: this.props.post.destinatarios,
            showNotas: false,
            showTiradas: false,
        };

    }


    componentDidMount = async e => {

        this.setState({
            carga: "cargado",
            menu: false,
            borrado: false,
        });

    };

    Menu = () => {

        this.setState({
            menu: !this.state.menu
        })

    }

    BorrarPost = async () => {
        if (await confirm('¿Estás seguro de que quieres borrar este post?')) {
            this.setState({ borrado: true });
            this.props.onBorrarPost(this.props.post.id);
        }
        else this.setState({ menu: false });
    }

    MoverArriba = async () => {
        this.setState({
            menu: !this.state.menu
        })
        this.props.onSubirPost(this.props.post.id);


    }

    MoverAbajo = async () => {
        this.setState({
            menu: !this.state.menu
        })
        this.props.onBajarPost(this.props.post.id);


    }


    EditarPost = async () => {
        this.setState({ editar: true });
        this.props.onEditPost(this.props.post.id);


    }

    EditarDestinatarios = async () => {
        this.setState({
            editarDestinatarios: !this.state.editarDestinatarios,
            menu: !this.state.menu
        })

    }



    InsertarPost = async () => {
        this.setState({
            menu: !this.state.menu
        })
        this.props.onInsertPost(this.props.post.id);


    }


    ConseguirEnlace = () => {

        navigator.clipboard.writeText(BASE_URL_FRONT + "post/" + this.props.post.url);
        this.setState({
            menu: !this.state.menu
        })
    }

    CrearMarcador = () => {
        this.setState({
            marcador: true,

        })
    }

    handleSubmitMarcador = async e => {
        await PartidaService.crearMarcador(this.props.idPartida, authService.getCurrentUser().id, BASE_URL_FRONT + "post/" + this.props.post.url, this.state.textoMarcador)
        this.setState({
            marcador: false,
            textoMarcador: ""

        })
    }

    destinatarioEdit(idPersonaje) {
        let a = this.state.cambioDestinatarios;
        if (a.includes(idPersonaje)) a.splice(a.indexOf(idPersonaje), 1)
        else a.push(idPersonaje)
        this.setState({ cambioDestinatarios: a })

    }

    onEditDestPost = async e => {
        let a = this.props.post;
        a.destinatarios = this.state.cambioDestinatarios;
        await postService.editDestPost(this.props.post.id, this.state.cambioDestinatarios);
        this.setState({
            editarDestinatarios: false
        })
    }

    cancelEditDestPost() {
        this.setState({
            cambioDestinatarios: this.props.post.destinatarios,
            editarDestinatarios: false
        })
    }

    MarcarNoLeido() {
        postService.marcarNoLeido(authService.getCurrentUser().id, this.props.post.id)
    }

    MarcarNoLeidoSiguientes() {
        postService.marcarNoLeidoSiguientes(authService.getCurrentUser().id, this.props.post.id)
    }


    render() {
        return (
            <div>

                {this.state.carga && !this.state.borrado && !this.state.editar ?
                    <div>
                        <div className='post'>
                            <div style={{ width: "204px", marginRight: "15px", textAlign: "center" }}>
                                <div style={{ position: "sticky", top: "70px" }}>
                                    <h5>{(this.props.nombresPj[this.props.post.idPersonaje] ? this.props.nombresPj[this.props.post.idPersonaje] : this.props.post.nPersonaje)}</h5>
                                    <div className="avatarAutor">
                                      
                                        <AvatarInfoPj
                                            src={SPACE_URL + "/avatarPj/" + ((this.props.cambiosAvatar[this.props.post.idPersonaje] ? this.props.cambiosAvatar[this.props.post.idPersonaje]  :  this.props.post.avPersonaje)) }
                                            width="204px"
                                            alt=""
                                            personaje={this.props.post.idPersonaje}
                                            director={this.props.director}
                                            cambioNombre={(idPj, nombre)=>this.props.cambioNombre(idPj, nombre)}
                                            subida={(avatar, idPj)=>this.props.subida(avatar, idPj)}
                                            nombresPj={this.props.nombresPj}
                                        />
                                    </div>
                                    <div style={{textAlign: "right"}}>
                                    <p>{this.props.post.fechaCreacion} {this.props.post.horaCreacion.substring(0,5)}</p>
                                    {(this.props.post.fechaCreacion !== this.props.post.fechaModificacion || this.props.post.horaCreacion !== this.props.post.horaModificacion) &&
                                        <p>Mod: {this.props.post.fechaModificacion} {this.props.post.horaModificacion.substring(0,5)}</p>

                                    }
                                    </div>
                                </div>
                            </div>

                            <div style={{ flex: "1" }}>


                                {!this.state.editarDestinatarios ?
                                    <ul className="destinatarios">
                                        {this.props.post.destinatarios.length === 0 &&
                                            <li>

                                                <img
                                                    src={SPACE_URL + "/avatarPj/defecto.png"}
                                                    width="30px"
                                                    style={{ opacity: "0" }}
                                                    alt= ""

                                                />

                                            </li>
                                        }
                                        {this.props.post.destinatarios.length > 0 && this.props.post.destinatarios.map((i, index) =>
                                            <li key={i}>

                                                <AvatarInfoPj
                                                key={this.props.avdestinatarios[i]}
                                                    src={SPACE_URL + "/avatarPj/" + this.props.avdestinatarios[i]}
                                                    width="50px"
                                                    alt=""
                                                    className={"destinatario" + (this.props.post.leido[index] === 1 ? " postLeido" : "postNoLeido")}
                                                    avatar={this.props.avdestinatarios[i]} director={this.props.director}
                                                    personaje={this.props.post.destinatarios[index]}
                                                    cambioNombre={(idPj, nombre)=>this.props.cambioNombre(idPj, nombre)}
                                                    subida={(avatar, idPj)=>this.props.subida(avatar, idPj)}
                                                    nombresPj={this.props.nombresPj}
                                                />

                                            </li>
                                        )}

                                    </ul>
                                    :
                                    <div>
                                        <ul className="destinatarios">
                                            {this.props.destinatariosTotales[0].map((i, index) =>

                                                <li key={index}>
                                                    <img src={SPACE_URL + "/avatarPj/" +  (this.props.cambiosAvatar[i.id] ? this.props.cambiosAvatar[i.id]  :  i.avatar)}
                                                        width="50px"
                                                        alt=""
                                                        onClick={() => this.destinatarioEdit(i.id)}
                                                        style={{ opacity: this.state.cambioDestinatarios.includes(i.id) ? "1" : "0.5" }}
                                                    />




                                                </li>
                                            )}

                                            {this.props.destinatariosTotales[1].map((i, index) =>
                                                <li key={index}>
                                                    <img src={SPACE_URL + "/avatarPj/" + (this.props.cambiosAvatar[i.id] ? this.props.cambiosAvatar[i.id]  :  i.avatar)}
                                                        width="50px"
                                                        alt=""
                                                        onClick={() => this.destinatarioEdit(i.id)}
                                                        style={{ opacity: this.state.cambioDestinatarios.includes(i.id) ? "1" : "0.5" }}
                                                    />
                                                </li>
                                            )}
                                        </ul>
                                        <button onClick={() => this.onEditDestPost()}>O</button>

                                        <button onClick={() => this.cancelEditDestPost()}>X</button>
                                    </div>

                                }



                                <div id="miDiv">

                                    <div id="botones">


                                        {ReactHtmlParser(this.props.post.notas).length > 0 &&
                                            <label className="boton"><span onClick={() => { this.setState({ showNotas: !this.state.showNotas }) }}>Notas </span></label>
                                        }

                                        {this.props.post.tiradas.length > 0 &&
                                            <label className="boton"><span onClick={() => { this.setState({ showTiradas: !this.state.showTiradas }) }}><FontAwesomeIcon icon={faDice} /></span></label>
                                        }
                                        <label className="boton"><span>
                                            <FontAwesomeIcon onClick={() => { this.MarcarNoLeido() }} icon={faEye} style={{ marginRight: "7px" }} />
                                            {this.props.post.editable && <FontAwesomeIcon icon={faEdit} onClick={this.EditarPost} style={{ marginRight: "7px" }} />}
                                            <FontAwesomeIcon onClick={this.Menu} icon={faEllipsisV} />
                                        </span>


                                        </label>
                                    </div>
                                </div>





                                {this.state.menu &&
                                    <div className="postMenu">
                                        <Rnd
                                            disableDragging
                                            enableResizing={{
                                                bottom: false
                                            }}
                                        
                                        >   
                                            <ul>

                                                <li><button onClick={() => { this.MarcarNoLeidoSiguientes() }}> Marcar como no leído desde aquí</button></li>
                                                {this.props.post.editable && <li><button onClick={() => { this.BorrarPost() }}> Borrar post</button></li>}
                                                {this.props.director && <li><button onClick={this.MoverArriba}> Mover arriba</button></li>}
                                                {this.props.director && <li><button onClick={this.MoverAbajo}> Mover abajo</button></li>}
                                                {this.props.director && <li><button onClick={this.EditarDestinatarios}> Editar Destinatarios</button></li>}
                                                {this.props.director && <li><button onClick={this.InsertarPost}> Insertar encima</button></li>}
                                                <li><button onClick={this.ConseguirEnlace}> Obtener enlace</button></li>
                                                <li><button onClick={this.CrearMarcador}> Crear Marcador</button></li>
                                                {this.state.marcador &&
                                                    <div>

                                                        <input
                                                            type="text"
                                                            value={this.state.textoMarcador}
                                                            onChange={e => this.setState({ textoMarcador: e.target.value })}
                                                        />
                                                        <button type="submit" onClick={() => this.handleSubmitMarcador()}>Crear marcador</button>


                                                    </div>
                                                }



                                            </ul>
                                        </Rnd>
                                    </div>
                                }



                                <div className="textoPost">
                                    {this.props.post.texto.length > 0 ? ReactHtmlParser(this.props.post.texto) : <p></p>}
                                </div>
                                {this.state.showNotas ?
                                    <div className="notasPost">
                                        <p><b>Notas de juego:</b></p>
                                        {ReactHtmlParser(this.props.post.notas)}
                                    </div>
                                    : null}
                                {this.state.showTiradas ?
                                    <div className="tiradasPost">
                                        <p className="tituloTiradas">Tiradas</p>
                                        <ul className="listaTiradas">
                                            {this.props.post.tiradas.map(i =>
                                                <li key={i.id} className="itemTirada">
                                               
                                                    {TiradaConstructor(i)}
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                    :
                                    null}
                            </div>

                        </div>
                    </div>
                    : null}


            </div>
        );
    }
}