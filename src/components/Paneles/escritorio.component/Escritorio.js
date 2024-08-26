import React, { Component } from "react";
import usuariosService from "../../../services/usuarios.service";
import authService from "../../../services/auth.service";
import { Link } from "react-router-dom";
import postsService from "../../../services/posts.service";
import AvatarPersonaje from "../../Utilidad/AvatarPersonaje/avatarPersonaje";
import { SPACE_URL } from '../../../constantes';
import ListaPartida from "../../Partidas/listaPartida.component";
import "../../../css/Escritorio.css"

export default class Escritorio extends Component {
    constructor(props) {
        super(props);
        this.state = {
            novJugador: null,
            novDirector: null,
            carga: false,
            preview: []
        };

    }


    async componentDidMount() {
        this.setState({
            novJugador: await usuariosService.novedadesJugador(authService.getCurrentUser().id),
            novDirector: await usuariosService.novedadesDirector(authService.getCurrentUser().id),

        });

        
        
        this.setState({ carga: true });

    }

    onPreview(enlaceEscena) {
        let a = this.state.preview;
        a.push(enlaceEscena);
        this.setState({ preview: a })
    };

    offPreview(enlaceEscena) {
        let b = this.state.preview;
        b.splice(b.indexOf(enlaceEscena), 1);
        this.setState({
            preview: b
        });

    }




    render() {
        return (
            <div>
                {this.state.carga &&
                    <div className="container mTop20">
                        <div className="jumbotron">
                            <h2>Novedades en partidas como jugador</h2>
                            {this.state.novJugador.nPartidas.length > 0 ?

                                <ul>
                                    {this.state.novJugador.nPartidas.map((i, index) =>
                                        <li key={i}>
                                            <Link to={"/partida/" + this.state.novJugador.ePartidas[index]} className="link">{i}</Link>
                                            <ul>
                                                {this.state.novJugador.nEscenas[index].map((j, index2) =>
                                                    <li key={j}>
                                                        <Link to={"/partida/" + this.state.novJugador.ePartidas[index] + "/escena/" + this.state.novJugador.eEscenas[index][index2]} className="link">{j}</Link>

                                                        <Link to={"/post/" + this.state.novJugador.idPosts[index][index2]} className="link">{this.state.novJugador.nPosts[index][index2]}</Link>


                                                        {this.state.preview.includes(this.state.novJugador.eEscenas[index][index2]) ?
                                                            <>
                                                                <span onClick={() => this.offPreview(this.state.novJugador.eEscenas[index][index2])}>—</span>
                                                                <Preview director={false} eEscena={this.state.novJugador.eEscenas[index][index2]} idUsuario={authService.getCurrentUser().id} />

                                                            </>
                                                            :
                                                            <span onClick={() => this.onPreview(this.state.novJugador.eEscenas[index][index2])}>+</span>
                                                        }

                                                    </li>)}
                                            </ul>
                                        </li>)}
                                </ul>
                                : <p>No tienes posts pendientes como jugador</p>}
                        </div>
                        <div className="jumbotron">
                            <h2>Novedades en partidas como director</h2>
                            {this.state.novDirector.nPartidas.length > 0 ?

                                <ul>
                                    {this.state.novDirector.nPartidas.map((i, index) =>
                                        <li key={i}>
                                            <Link to={"/partida/" + this.state.novDirector.ePartidas[index]} className="link">{i}</Link>
                                            <ul>
                                                {this.state.novDirector.nEscenas[index].map((j, index2) =>
                                                    <li key={j}>
                                                        <Link to={"/partida/" + this.state.novDirector.ePartidas[index] + "/escena/" + this.state.novDirector.eEscenas[index][index2]} className="link">{j}</Link>

                                                        <Link to={"/post/" + this.state.novDirector.idPosts[index][index2]} className="link">{this.state.novDirector.nPosts[index][index2]}</Link>


                                                        {this.state.preview.includes(this.state.novDirector.eEscenas[index][index2]) ?
                                                            <>
                                                                <span onClick={() => this.offPreview(this.state.novDirector.eEscenas[index][index2])}>—</span>
                                                                <Preview director={true} eEscena={this.state.novDirector.eEscenas[index][index2]} idUsuario={authService.getCurrentUser().id} />
                                                            </>
                                                            :
                                                            <span onClick={() => this.onPreview(this.state.novDirector.eEscenas[index][index2])}>+</span>
                                                        }

                                                    </li>)}
                                            </ul>
                                        </li>)}
                                </ul>
                                : <p>No tienes posts pendientes como director</p>}


                        </div>

                        <ListaPartida />

                    </div>
                }
            </div>


        );
    }
}




class Preview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            prev: null,
            carga: false
        };

    }


    async componentDidMount() {
        this.setState({
            prev: this.props.director ? await postsService.previsualizarDirector(this.props.eEscena, this.props.idUsuario) : await postsService.previsualizarJugador(this.props.eEscena, this.props.idUsuario),
        });
        this.setState({ carga: true });

    }


    render() {
        return (
            <div>
                {this.state.carga &&
                    <div>
                        <ul>

                            {this.state.prev.texto.map((i, index) =>

                                <li key={index} style={{ border: "1px solid green" }}>
                      
                                    <AvatarPersonaje src={SPACE_URL + "/avatarPj/" + this.state.prev.avatar[index]}
                                        width="50px"
                                        alt=""
                                        style={{ border: "1px solid black" }}

                                    />


                                    <span>{i}</span>
                                </li>)}
                        </ul>
                    </div>

                }
            </div>


        );
    }
}
