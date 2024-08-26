import React from 'react';
import ReactHtmlParser from 'react-html-parser';
import Crop from "../../../Upload/crop.component";
import AuthService from '../../../../services/auth.service';
import AvatarPersonaje from '../../../Utilidad/AvatarPersonaje/avatarPersonaje';
import EditorTextoCompleto from '../../../EditorTexto/editorTextoCompleto';
import perspropioService from '../../../../services/perspropio.service.';
import { SPACE_URL } from '../../../../constantes';
import authService from '../../../../services/auth.service';
import "../../../../css/Personajes.css"

export default class InfoPerspropio extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            personaje: this.props.personaje,
            lista: [],
            carga: null,
            pestana: null,
            editarPestana: false,
            contenido: "",
            nuevaEtiqueta: "",
            changeNombre: false,
            nombre: "",
            showAvatar: true,
            editorPestanas: false
        };
    }




    componentDidMount = async e => {

        this.setState({
            info: await perspropioService.infoCompletaId(this.state.personaje.id, AuthService.getCurrentUser().id),
        })
        if (this.state.info.pestanas.length > 0) {
            this.setState({ pestana: 0 })
        }
        this.setState({
            nombre: this.state.info.nombre,
            carga: 1
        })
    };



    subida(e) {

        let info = this.state.info;

        info.avatar = e;
        this.setState({ info: info })
        this.setState({ showAvatar: false })
        this.setState({ showAvatar: true })

    }

    saveContenido = async e => {
        await perspropioService.guardarPestanaUnica(this.state.personaje.id, this.state.info.pestanas[this.state.pestana].pestana, this.state.contenido);
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
        perspropioService.guardarEtiquetas(this.state.info.id, this.state.info.etiqueta)
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

        perspropioService.guardarEtiquetas(this.state.info.id, this.state.info.etiqueta)
    }


    handleSubmit = async e => {
        e.preventDefault();
        let a = this.state.info;
        a.nombre = this.state.nombre;
        this.setState({
            info: a,
            changeNombre: false

        });
        this.props.cambioDraggable();
        perspropioService.cambiarNombre(this.state.info.id, this.state.nombre)

    }

    cambiarPrivacidad() {
        let a = this.state.info;
        a.publico = this.state.info.publico === 1 ? 0 : 1;
        this.setState({ publico: a })
        perspropioService.cambiarPrivacidad(this.state.info.id, this.state.info.publico)
    }

    render() {
        return (
            <div style={{ padding: "20px" }}>

                {this.state.carga && this.state.personaje.id !== 0 &&
                    <div>


                        {this.state.changeNombre ?
                            <form onSubmit={this.handleSubmit} >
                                <input type="text" value={this.state.nombre} onChange={(e) => this.setState({ nombre: e.target.value })} style={{ width: "100%", height: "3em" }} />
                                <input type="submit" value="Guardar" />
                                <button onClick={() => { this.setState({ changeNombre: false, nombre: this.state.info.nombre }); this.props.cambioDraggable() }}>Cancelar</button>


                            </form>
                            :
                            this.state.info.idUsuario === authService.getCurrentUser().id ?
                                <h2 onClick={() => {this.setState({ changeNombre: !this.state.changeNombre }); this.props.cambioDraggable() }}>{this.state.info.nombre}</h2>
                                :
                                <h2>{this.state.info.nombre}</h2>
                        }


                        <div style={{ display: "inline" }}>
                            {this.state.showAvatar &&

                                <AvatarPersonaje src={SPACE_URL + "/avatarPj/" + this.state.info.avatar} width="120px" alt="" />
                            }
                            <span>{this.state.info.nombre}</span>


                            {this.state.info.idUsuario === authService.getCurrentUser().id &&
                                <Crop ancho={204} alto={324} destino="avatarPerspropio" texto="Cambiar imagen" id={this.state.info.id} subida={(e) => { this.subida(e, this.state.personaje) }} />

                            }
                        </div>

                        {this.state.info.idUsuario === authService.getCurrentUser().id &&
                            <div>
                                <p>Este personaje es {this.state.info.publico === 1 ? "público" : "privado"}</p>
                                <input type="submit" value="Cambiar privacidad" onClick={() => this.cambiarPrivacidad()} />
                                {this.state.editorPestanas ?
                                    <div>
                                        <input type="submit" value="Cancelar" onClick={() => this.setState({ editorPestanas: !this.state.editorPestanas })} />
                                        <EditorPestanas personaje={this.state.info.id} guardado={() => this.setState({ editorPestanas: !this.state.editorPestanas })} />
                                    </div>
                                    :
                                    <input type="submit" value="Configurar pestañas del personaje" onClick={() => this.setState({ editorPestanas: !this.state.editorPestanas })} />
                                }
                            </div>

                        }

                        {this.state.info.idUsuario === authService.getCurrentUser().id &&
                            <div>
                                {this.state.editorPestanas ?
                                    <div>
                                        <input type="submit" value="Cancelar" onClick={() => this.setState({ editorPestanas: !this.state.editorPestanas })} />
                                        <EditorPestanas personaje={this.state.info.id} guardado={() => this.setState({ editorPestanas: !this.state.editorPestanas })} />
                                    </div>
                                    :
                                    <input type="submit" value="Configurar pestañas del personaje" onClick={() => this.setState({ editorPestanas: !this.state.editorPestanas })} />
                                }
                            </div>

                        }


                        {this.state.info.idUsuario === authService.getCurrentUser().id &&
                             <div class="EtiquetaContenedor">
                                <h3>Etiquetas</h3>
                                <div>
                                    <input type="text" value={this.state.nuevaEtiqueta} onChange={(e) => this.setState({ nuevaEtiqueta: e.target.value })} />
                                    <button onClick={() => this.agregarEtiqueta()} class="BotonGuardar">Guardar</button>
                                </div>
                                <ul>
                                {this.state.info.etiqueta.map((i, index) =>
                                        <li key={i} class="etiqueta">
                                            <p>{i} <button onClick={() => this.eliminarEtiqueta(index)} class="BotonBorrar">X</button></p>
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
                                            {((this.state.info.idUsuario === authService.getCurrentUser().id)
                                                || (i.publica === 1)
                                                || (i.publica === 0 && this.state.info.idUsuario === authService.getCurrentUser().id)
                                            ) && (i.secreta === 0 || this.state.info.idUsuario === authService.getCurrentUser().id)
                                                ?


                                                <span
                                                    onClick={() => this.setState({ pestana: index, contenido: "", editarPestana: false })}
                                                    className={"etipestana"+(this.state.pestana===index?" active":"")}>
                                                    {i.titulo}
                                                </span>




                                                : null}
                                        </li>
                                    )

                                    }
                                </ul>

                                <div className="contenido">
                                    {this.state.editarPestana ?
                                        <div>

                                            <EditorTextoCompleto texto={this.state.info.pestanas[this.state.pestana].info} onCambio={(texto) => this.setState({ contenido: texto })} />
                                            <label  className="primary" onClick={() => this.saveContenido()}>
                                                <span>Guardar </span>
                                            </label>
                                            <label  className="secondary" onClick={() => this.setState({ contenido: "", editarPestana: false })}>
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
                                    {!this.state.editarPestana && ((this.state.info.idUsuario === authService.getCurrentUser().id)
                                        || (this.state.info.pestanas[this.state.pestana].editable === 1 && this.state.info.idUsuario === authService.getCurrentUser().id)) ?

                                        <label style={{ width: "150px", border: "1px solid grey", cursor: "pointer", backgroundColor: "black", color: "white", textAlign: "center" }} onClick={() => this.setState({ editarPestana: true, contenido: this.state.info.pestanas[this.state.pestana].info })}>
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





class EditorPestanas extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            carga: 0,
            pestanas: [],
            editTitulos: [],
            titulosProvisionales: [],
            editContenidos: [],
            contenidosProvisionales: [],

        };
    }

    componentDidMount = async e => {

        this.setState({

            pestanas: await perspropioService.infoPestanas(this.props.personaje, authService.getCurrentUser().id)

        })
        this.setState({
            carga: 1,
        })

    };


    cambiarPestanas = async e => {
        e.preventDefault();
        perspropioService.guardarPestanas(this.props.personaje, this.preparar())


    }


    preparar() {
        let a = [];
        for (let i = 0; i < this.state.pestanas.length; i++) {
            let b = {
                titulo: this.state.pestanas[i].titulo,
                info: this.state.pestanas[i].contenido,
                publica: this.state.pestanas[i].publica ? 1 : 0,
                editable: this.state.pestanas[i].editable ? 1 : 0,
                secreta: this.state.pestanas[i].secreta ? 1 : 0
            }
            a.push(b);
        }
        return a;

    }

    changeEditable(index, value) {
        let a = this.state.pestanas;
        a[index].editable = value;
        if (a[index].editable && a[index].secreta) a[index].secreta = false
        this.setState({ pestanas: a })

    }

    changePublica(index, value) {
        let a = this.state.pestanas;
        a[index].publica = value;
        if (a[index].publica && a[index].secreta) a[index].secreta = false
        this.setState({ pestanas: a })

    }

    changeSecreta(index, value) {
        let a = this.state.pestanas;
        a[index].secreta = value;
        if (a[index].publica && a[index].secreta) a[index].publica = false;
        if (a[index].editable && a[index].secreta) a[index].editable = false;
        this.setState({ pestanas: a })

    }

    changeTitulo(index) {
        let a = this.state.editTitulos;
        a.push(index);
        let b = this.state.titulosProvisionales;
        b[index] = this.state.pestanas[index].titulo;
        this.setState({ editTitulos: a, titulosProvisionales: b });
    }

    changeTituloInput(index, titulo) {
        let a = this.state.titulosProvisionales;
        a[index] = titulo;
        this.setState({ titulosProvisionales: a });
    }

    saveTitulo(index) {
        let a = this.state.pestanas;
        a[index].titulo = this.state.titulosProvisionales[index];
        let b = this.state.editTitulos;
        b.splice(b.indexOf(index), 1);
        this.setState({ pestanas: a, editTitulos: b });
    }

    cancelTitulo(index) {
        let a = this.state.editTitulos;
        a.splice(a.indexOf(index), 1);
        this.setState({ editTitulos: a });

    }


    changeContenido(index) {
        let a = this.state.editContenidos;
        a.push(index);
        let b = this.state.contenidosProvisionales;
        b[index] = this.state.pestanas[index].info;
        this.setState({ editContenidos: a, contenidosProvisionales: b });
    }

    handleChangeContenido(index, texto) {
        let a = this.state.contenidosProvisionales;
        a[index] = texto;
        this.setState({ contenidosProvisionales: a });
    }

    saveContenido(index) {
        let a = this.state.pestanas;
        a[index].contenido = this.state.contenidosProvisionales[index];
        let b = this.state.editContenidos;
        b.splice(b.indexOf(index), 1);
        this.setState({ pestanas: a, editContenidos: b });
    }

    cancelContenido(index) {
        let a = this.state.editContenidos;
        a.splice(a.indexOf(index), 1);
        this.setState({ editContenidos: a });

    }

    addPestana() {

        let a = this.state.pestanas;
        a.push({ titulo: "Nueva Pestaña", contenido: "<p></p>", editable: true, publica: false, secreta: false });
        this.setState({ pestanas: a });
    }

    deletePestana(index) {


        let a = this.state.pestanas;
        let b = this.state.editContenidos;
        let c = this.state.editTitulos;

        a.splice(index, 1);
        if (b.indexOf(index) >= 0) b.splice(b.indexOf(index), 1);
        if (c.indexOf(index) >= 0) c.splice(c.indexOf(index), 1);


        this.setState({
            pestanas: a,
            editContenidos: b,
            editTitulos: c
        });

    }


    render() {
        return (
            <div>
                {this.state.carga === 1 ?
                    <form>
                        <ul>
                            {this.state.pestanas.map((i, index) =>
                                <li key={index}>
                                    <h2>{i.titulo}</h2>
                                    <label style={{ width: "25px", border: "1px solid grey", cursor: "pointer", backgroundColor: "black", color: "white", textAlign: "center" }} onClick={() => this.deletePestana(index)}>
                                        <span>X</span>
                                    </label>
                                    {!this.state.editTitulos.includes(index) ?
                                        <label style={{ width: "150px", border: "1px solid grey", cursor: "pointer", backgroundColor: "black", color: "white", textAlign: "center" }} onClick={() => this.changeTitulo(index)}>
                                            <span>Editar Título</span>
                                        </label>
                                        :
                                        <div>
                                            <input
                                                type="text"
                                                value={this.state.titulosProvisionales[index]}
                                                onChange={e => this.changeTituloInput(index, e.target.value)}
                                            />
                                            <label style={{ width: "150px", border: "1px solid grey", cursor: "pointer", backgroundColor: "black", color: "white", textAlign: "center" }} onClick={() => this.saveTitulo(index)}>
                                                <span>Guardar </span>
                                            </label>
                                            <label style={{ width: "150px", border: "1px solid grey", cursor: "pointer", backgroundColor: "black", color: "white", textAlign: "center" }} onClick={() => this.cancelTitulo(index)}>
                                                <span>Cancelar</span>
                                            </label>

                                        </div>
                                    }

                                    {!this.state.editContenidos.includes(index) ?
                                        <label style={{ width: "150px", border: "1px solid grey", cursor: "pointer", backgroundColor: "black", color: "white", textAlign: "center" }} onClick={() => this.changeContenido(index)}>
                                            <span>Editar Contenido</span>
                                        </label>
                                        :
                                        <div>
                                            <EditorTextoCompleto texto={i.info} onCambio={(texto) => this.handleChangeContenido(index, texto)} />
                                            <label style={{ width: "150px", border: "1px solid grey", cursor: "pointer", backgroundColor: "black", color: "white", textAlign: "center" }} onClick={() => this.saveContenido(index)}>
                                                <span>Guardar </span>
                                            </label>
                                            <label style={{ width: "150px", border: "1px solid grey", cursor: "pointer", backgroundColor: "black", color: "white", textAlign: "center" }} onClick={() => this.cancelContenido(index)}>
                                                <span>Cancelar</span>
                                            </label>

                                        </div>
                                    }


                                    <p>
                                        <input
                                            type="checkbox"
                                            label="Editable"
                                            checked={i.editable}
                                            onChange={e => this.changeEditable(index, e.target.checked)}
                                        />
                                        <span>Editable</span>
                                    </p>

                                    <p>
                                        <input
                                            type="checkbox"
                                            label="Publica"
                                            checked={i.publica}
                                            onChange={e => this.changePublica(index, e.target.checked)}
                                        />
                                        <span>Pública</span>

                                    </p>
                                    <p>
                                        <input
                                            type="checkbox"
                                            label="Secreta"
                                            checked={i.secreta}
                                            onChange={e => this.changeSecreta(index, e.target.checked)}
                                        />

                                        <span>Secreta</span>
                                    </p>


                                </li>
                            )}

                            <label style={{ width: "150px", border: "1px solid grey", cursor: "pointer", backgroundColor: "black", color: "white", textAlign: "center" }} onClick={() => this.addPestana()}>
                                <span>Nueva Pestaña</span>
                            </label>



                        </ul>

                        <button onClick={e => this.cambiarPestanas(e)}>Guardar</button>
                        <p></p>


                    </form>

                    : null}
            </div>
        )
    }
};

