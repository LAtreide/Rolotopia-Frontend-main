import React from 'react';
import PersonajeService from '../../../../services/personaje.service';
import ReactHtmlParser from 'react-html-parser';
import Crop from "../../../Upload/crop.component";
import AuthService from '../../../../services/auth.service';
import AvatarPersonaje from '../../../Utilidad/AvatarPersonaje/avatarPersonaje';
import EditorTextoCompleto from '../../../EditorTexto/editorTextoCompleto';
import personajeService from '../../../../services/personaje.service';
import { SPACE_URL } from '../../../../constantes';
import perspropioService from '../../../../services/perspropio.service.';
import confirmacion from "../../../Utilidad/Confirmacion"
import authService from '../../../../services/auth.service';
import "../../../../css/Personajes.css"

export default class InfoPersonaje extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            personaje: this.props.personaje,
            lista: [],
            carga: null,
            pestana: null,
            director: 0,
            creacionPj: '',
            propietario: 0,
            editarPestana: false,
            contenido: "",
            nuevaEtiqueta: "",
            changeNombre: false,
            nombre: "",
            showAvatar: true,
            perspropio: 0,
            rand: 0,
        };
    }




    componentDidMount = async e => {

        this.setState({
            director: this.props.director,
            info: await PersonajeService.infoCompletaId(this.state.personaje, AuthService.getCurrentUser().id),
            rand: Math.random()
        })
        this.setState({
            propietario: await PersonajeService.isPropietario(this.state.info.id, AuthService.getCurrentUser().id),
        })
        
        if (this.state.info.pestanas.length > 0) {
            this.setState({ pestana: 0 })
        }
      
        this.setState({
            nombre: this.props.nombresPj[this.state.personaje] ? this.props.nombresPj[this.state.personaje]  : this.state.info.nombre,
            carga: 1
        })
    };



    subida(e) {

        let info = this.state.info;

        info.avatar = e;
        this.setState({ info: info })
        this.setState({ showAvatar: false })
        this.setState({ showAvatar: true })
        this.props.subida(e,this.state.info.id)
    }

    saveContenido = async e => {
        await personajeService.guardarPestanaUnica(this.state.personaje, this.state.info.pestanas[this.state.pestana].pestana, this.state.contenido);
        let a = this.state.info;
        a.pestanas[this.state.pestana].info = this.state.contenido;
        this.setState({
            editarPestana: false,
            contenido: "",
            info: a
        })
    }

    async eliminarEtiqueta(index) {
        let a = this.state.info;
        let b = a.etiqueta;
        b.splice(index, 1)
        a.etiqueta = b;
        this.setState({ info: a })
        personajeService.guardarEtiquetas(this.state.info.id, this.state.info.etiqueta)
    }

    async agregarEtiqueta() {
        let a = this.state.info;
        let b = a.etiqueta;
        if (this.state.nuevaEtiqueta !== "" && !b.includes(this.state.nuevaEtiqueta)) {
            b.push(this.state.nuevaEtiqueta)
            a.etiqueta = b;
            this.setState({
                info: a,
                nuevaEtiqueta: ""
            })
        }
        else
            this.setState({
                nuevaEtiqueta: ""
            })

        personajeService.guardarEtiquetas(this.state.info.id, this.state.info.etiqueta)
    }


    handleSubmit = async e => {
        e.preventDefault();
        let a = this.state.info;
        a.nombre = this.state.nombre;
        this.setState({
            info: a,
            changeNombre: false

        });

        personajeService.cambiarNombre(this.state.info.id, this.state.nombre)
        this.props.cambioNombre(this.state.info.id, this.state.nombre)
    }



    async exportar() {
        if (await confirmacion("¿Estás seguro de que quieres exportar este personaje a Mis  personajes?")) {
            perspropioService.exportarPersonaje(authService.getCurrentUser().id, this.state.info.id);

        }
    }


    async prepararImportar() {
        this.setState({
            importar: true,
            listaPerspropios: await perspropioService.lista(authService.getCurrentUser().id)
        })
        this.setState({
            perspropio: this.state.listaPerspropios[0].id
        })
    }

    async importar() {



        this.setState({ info: await perspropioService.importarPerspropio(this.state.perspropio, this.state.info.id) })
        this.setState({
            pestana: 0,
            nombre: this.state.info.nombre,
            rand: Math.random()
        })
    }



    render() {
        return (
            <div style={{ padding: "20px" }}>

                {this.state.carga && this.state.personaje !== 0 &&
                    <div>


                        {this.state.changeNombre ?
                            <form onSubmit={this.handleSubmit} >
                                <input type="text" value={this.state.nombre} onChange={(e) => this.setState({ nombre: e.target.value })} style={{ width: "100%", height: "3em" }} />
                                <input type="submit" value="Guardar" />
                                <button onClick={() => { this.setState({ changeNombre: false, nombre: this.state.info.nombre }) }}>Cancelar</button>


                            </form>
                            :
                            this.state.propietario > 0 ||  this.state.director > 0 ?
                                <h2 onClick={() => this.setState({ changeNombre: !this.state.changeNombre })}>{this.props.nombresPj[this.state.info.id] ? this.props.nombresPj[this.state.info.id]  : this.state.info.nombre}</h2>
                                :
                                <h2>{this.props.nombresPj[this.state.info.id] ? this.props.nombresPj[this.state.info.id]  : this.state.info.nombre}</h2>
                        }


                        <div style={{ display: "inline" }}>
                            {this.state.showAvatar &&

                                <AvatarPersonaje key={this.state.rand} src={SPACE_URL + "/avatarPj/" + this.state.info.avatar} width="120px" alt="" />
                            }
                            <span>{this.state.info.nombre}</span>

                            {(this.state.propietario > 0 ||  this.state.director > 0) &&
                            <div>
                                <Crop ancho={204} alto={324} destino="avatarPj" texto="Cambiar imagen" id={this.state.info.id} subida={(e) => { this.subida(e, this.state.personaje) }} />
                            </div>
                            }
                        </div>


                        {this.state.propietario === 1 &&
                            <div>
                                <label style={{ width: "150px", border: "1px solid grey", cursor: "pointer", backgroundColor: "black", color: "white", textAlign: "center" }} onClick={() => this.exportar()}>
                                    <span>Guardar en Mis Personajes</span>
                                </label>
                                <label style={{ width: "150px", border: "1px solid grey", cursor: "pointer", backgroundColor: "black", color: "white", textAlign: "center" }} onClick={() => this.prepararImportar()}>
                                    <span>Importar personaje propio</span>
                                </label>
                                {this.state.importar &&
                                    <div>
                                        <select value={this.state.perspropio} onChange={e => this.setState({ perspropio: e.target.value })}>
                                            {this.state.listaPerspropios.map((i) =>
                                                <option value={i.id} key={i.id}>{i.nombre}</option>
                                            )}
                                        </select>
                                        <button onClick={e => this.importar()}>Importar</button>
                                        <button onClick={e => this.setState({ importar: !this.state.importar })}>Cancelar</button>
                                    </div>
                                }
                            </div>}


                        {this.state.director &&
                            <div className="EtiquetaContenedor">
                                <h3>Etiquetas</h3>
                                <div>
                                    <input type="text" value={this.state.nuevaEtiqueta} onChange={(e) => this.setState({ nuevaEtiqueta: e.target.value })} />
                                    <button onClick={() => this.agregarEtiqueta()} className="BotonGuardar">Guardar</button>
                                </div>
                                <ul>
                                    {this.state.info.etiqueta.map((i, index) =>
                                        <li key={i} className="etiqueta">
                                            <p>{i} <button onClick={() => this.eliminarEtiqueta(index)} className="BotonBorrar">X</button></p>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        }


                        {this.state.info.pestanas.length > 0 &&

                            <div>
                                <ul className="pestanas">
                                    {this.state.info.pestanas.map((i, index) =>
                                        <li key={i.titulo} style={{ display: "inline" }}>
                                            {((this.state.director)
                                                || (i.publica === 1)
                                                || (i.publica === 0 && this.state.propietario === 1)
                                            ) && (i.secreta === 0 || this.state.director)
                                                ?
                                                <span
                                                    onClick={() => this.setState({ pestana: index, contenido: "", editarPestana: false })}
                                                   
                                                   className={"etipestana"+(this.state.pestana===index?" active":"")}>
                                                    {i.titulo + " " + index}
                                                </span>
                                                : null}
                                        </li>
                                    )}
                                </ul>

                                <div className="contenido">
                                    {this.state.editarPestana ?
                                        <div>
                                            <EditorTextoCompleto texto={this.state.info.pestanas[this.state.pestana].info} onCambio={(texto) => this.setState({ contenido: texto })} />
                                            <label className="primary" onClick={() => this.saveContenido()}>
                                                <span>Guardar </span>
                                            </label>
                                            <label className="secondary" onClick={() => this.setState({ contenido: "", editarPestana: false })}>
                                                <span>Cancelar</span>
                                            </label>
                                        </div>
                                        :
                                        <div>
                                            {ReactHtmlParser(this.state.info.pestanas[this.state.pestana].info)}
                                        </div>
                                    }
                                    <p>Esta pestaña es
                                        {this.state.info.pestanas[this.state.pestana].publica ? " pública, " : " privada, "}
                                        {this.state.info.pestanas[this.state.pestana].editable ? "editable, " : "no editable "}
                                        {this.state.info.pestanas[this.state.pestana].secreta ? " secreta. " : null}
                                    </p>
                                    {!this.state.editarPestana && ((this.state.director)
                                        || (this.state.info.pestanas[this.state.pestana].editable === 1 && this.state.propietario === 1)) ?
                                        <label style={{ width: "150px", border: "1px solid #555", cursor: "pointer", backgroundColor: "#04675F", color: "#fff", textAlign: "center" }} onClick={() => this.setState({ editarPestana: true, contenido: this.state.info.pestanas[this.state.pestana].info })}>
                                            <span>Editar Contenido</span>
                                        </label>
                                        : null}
                                </div>
                            </div>

                        }

                    </div>}

            </div>
        )
    }
};
