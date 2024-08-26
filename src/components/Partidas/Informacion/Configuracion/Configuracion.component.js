import React from 'react';
import Crop from "../../../Upload/crop.component"
import partidaService from '../../../../services/partida.service';
import sistemaService from '../../../../services/sistema.service';
import personajeService from '../../../../services/personaje.service';
import authService from '../../../../services/auth.service';
import EditorTextoCompleto from "../../../EditorTexto/editorTextoCompleto"
import ColorPicker from "../../../Utilidad/ColorPicker"
import confirmacion from "../../../Utilidad/Confirmacion"

export default class Configuracion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            carga: null,
            sistema: this.props.sistema,
            editorTextoConf: false,
            editorPestanas: false,
            nombre: "",
            infoPartida: null,
            editarDescripcion: false,
            descripcion: "",
            enlace: "",
            editorEstilo: false,
            estilo: null,
            editorVentanaPersonajes: false,
            partidaPublica: false,
            estado: "",
            partidaAbierta: false,

        };
    }

    componentDidMount = async e => {

        this.setState({
            listaSistemas: await sistemaService.lista(),
            infoPartida: await partidaService.infoPartidaId(this.props.partida),
        })

        this.setState({
            carga: 1,
            sistema: this.state.infoPartida.idSistema,
            nombre: this.state.infoPartida.nombre,
            descripcion: this.state.infoPartida.descripcion,
            personajes: this.state.infoPartida.mostrarPersonajes,
            estilo: this.state.infoPartida.estilo,
            partidaPublica: this.state.infoPartida.publica,
            estado: this.state.infoPartida.estado,
            partidaAbierta: this.state.infoPartida.abierta

        })


    };

    cambiarEstado = async e => {
        e.preventDefault();
        partidaService.cambiarEstado(authService.getCurrentUser().id, this.props.partida, this.state.estado);
        let cambio = { tipo: "Estado", estado: this.state.estado }
        this.props.onCambio(cambio)
    }

    cambiarSistema = async e => {
        e.preventDefault();
        partidaService.cambiarSistema(this.props.partida, this.state.sistema);
        let cambio = { tipo: "Sistema", sistema: this.state.sistema }
        this.props.onCambio(cambio)
    }

    cambiarTitulo = async e => {
        e.preventDefault();
        this.setState({ enlace: await partidaService.cambiarTitulo(this.props.partida, this.state.nombre) })
        let cambio = { tipo: "Titulo", titulo: this.state.nombre, enlace: this.state.enlace }
        this.props.onCambio(cambio)

    }


    handleChangeDescripcion(descripcion) {
        this.setState({ descripcion: descripcion })
    }

    cambiarDescripcion = async e => {
        e.preventDefault();
        partidaService.cambiarDescripcion(this.props.partida, this.state.descripcion)
        let cambio = { tipo: "Descripcion", descripcion: this.state.descripcion }
        this.props.onCambio(cambio)

    }

    cambiarEstilo = async (e, estilo) => {
        e.preventDefault();
        partidaService.cambiarEstilo(this.props.partida, estilo)
        let cambio = { tipo: "Estilo", estilo: estilo }
        this.props.onCambio(cambio)

    }


    subida(e) {
        let cambio = { tipo: "Portada", portada: e }
        this.props.onCambio(cambio)
    }


    onChangePersonajes(value) {
        this.setState({ personajes: value })
        partidaService.cambiarMostrarPersonajes(this.props.partida, value)

    }



    async borrarPartida() {
        if (await confirmacion('¿Estás seguro de que quieres borrar esta partida?')) {

            partidaService.borrarPartida(this.props.partida)
        }
    }

    guardarPartidaPublica() {

        let a = this.state.infoPartida;
        a.publica = this.state.partidaPublica;
        this.setState({ infoPartida: a })
        partidaService.guardarPartidaPublica(this.props.partida, this.state.partidaPublica)
    }

    async guardarPartidaAbierta() {

       
        if (this.state.partidaAbierta) {
            if (await confirmacion('¿Estás seguro de que quieresabrir esta partida a nuevos jugadores?')) {
                let a = this.state.infoPartida;
                a.abierta = this.state.partidaAbierta;
                this.setState({ infoPartida: a })
                partidaService.guardarPartidaAbierta(authService.getCurrentUser().id, this.props.partida, this.state.partidaAbierta)

            }
            else this.setState({partidaAbierta: false})
        }

        else {
            let a = this.state.infoPartida;
            a.abierta = this.state.partidaAbierta;
            this.setState({ infoPartida: a })
            partidaService.guardarPartidaAbierta(authService.getCurrentUser().id, this.props.partida, this.state.partidaAbierta)

        }
    }


    render() {
        return (
            <div>

                <Crop ancho={500} alto={500} destino="portada" texto="Cambiar portada" id={this.props.partida} subida={(e) => this.subida(e)} />


                {this.state.carga === 1 &&
                    <div>

                        <label style={{ width: "150px", border: "1px solid grey", cursor: "pointer", backgroundColor: "black", color: "white", textAlign: "center" }} onClick={() => this.borrarPartida()}>
                            <span>Borrar Partida</span>
                        </label>

                        <form onSubmit={this.cambiarEstado}>
                            <select value={this.state.estado} onChange={e => this.setState({ estado: e.target.value })}>
                                <option value="borrador" key="borrador">Borrador</option>
                                <option value="en_juego" key="en_juego">En juego</option>
                                <option value="cerrada" key="cerrada">Cerrada</option>
                            </select>
                            <button type="submit" style={{ width: "150px", border: "1px solid grey", cursor: "pointer", backgroundColor: "black", color: "white", textAlign: "center" }}>Cambiar estado</button>
                            <p></p>
                        </form>


                        <form onSubmit={this.cambiarTitulo}>

                            <input type="text" value={this.state.nombre} onChange={e => this.setState({ nombre: e.target.value })} />
                            <button type="submit">Cambiar Titulo</button>
                            <p></p>
                        </form>

                        <div style={{ width: "150px", border: "1px solid grey", cursor: "pointer", backgroundColor: "black", color: "white", textAlign: "center" }} onClick={() => this.setState({ editarDescripcion: true })}>
                            <p>Editar descripción</p>
                        </div>
                        {this.state.editarDescripcion ?
                            <div>

                                <form onSubmit={this.cambiarDescripcion}>
                                    <div style={{ width: '700px', textAlign: 'left', color: 'black' }}>
                                        <EditorTextoCompleto texto={this.state.descripcion} onCambio={(texto) => this.handleChangeDescripcion(texto)} />
                                        <div style={{ display: "inline-flex", width: '700px', justifyContent: "space-between", marginBottom: '5px' }}>
                                            <input style={{ backgroundColor: 'black', color: 'white', textAlign: 'right' }} type="submit" value="Cambiar" />
                                        </div>
                                    </div>
                                </form>
                            </div>
                            :
                            null}

                        <div style={{ display: "flex" }}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={this.state.partidaPublica}
                                    onChange={e => this.setState({ partidaPublica: e.target.checked })}
                                />
                                Partida pública
                            </label>

                            {this.state.infoPartida.publica !== this.state.partidaPublica && (
                                <button onClick={() => this.guardarPartidaPublica()}>Guardar cambios</button>
                            )}
                        </div>

                        <div style={{ display: "flex" }}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={this.state.partidaAbierta}
                                    onChange={e => this.setState({ partidaAbierta: e.target.checked })}
                                />
                                La partida acepta nuevos jugadores
                            </label>

                            {this.state.infoPartida.abierta !== this.state.partidaAbierta && (
                                <button onClick={() => this.guardarPartidaAbierta()}>Guardar cambios</button>
                            )}
                        </div>

                        <form onSubmit={this.cambiarSistema}>
                            <select value={this.state.sistema} onChange={e => this.setState({ sistema: e.target.value })}>
                                {this.state.listaSistemas.map((i) =>
                                    <option value={i.id} key={i.id}>{i.nombre}</option>
                                )}
                            </select>

                            <button type="submit" style={{ width: "150px", border: "1px solid grey", cursor: "pointer", backgroundColor: "black", color: "white", textAlign: "center" }}>Cambiar Sistema</button>
                            <p></p>
                        </form>


                        {this.state.editorEstilo ?
                            <div>
                                <input type="submit" value="Cancelar" onClick={() => this.setState({ editorEstilo: !this.state.editorEstilo })} />

                                <EditorEstilo partida={this.state.infoPartida} guardado={(e, estilo) => { this.cambiarEstilo(e, estilo) }} />
                            </div> :
                            <input
                                type="submit"
                                value="Configurar estilo de la partida"
                                onClick={() => this.setState({ editorEstilo: !this.state.editorEstilo })}
                                style={{ border: "1px solid grey", cursor: "pointer", backgroundColor: "black", color: "white", textAlign: "center" }}
                            />
                        }
                        <p></p>
                        {this.state.editorTextoConf ?
                            <div>
                                <input type="submit" value="Cerrar configuración" onClick={() => this.setState({ editorTextoConf: !this.state.editorTextoConf })} />
                                <ConfiguracionEditor partida={this.props.partida} guardado={() => this.setState({ editorTextoConf: !this.state.editorTextoConf })} />
                            </div> :
                            <input
                                type="submit"
                                value="Editor de texto para jugadores"
                                onClick={() => this.setState({ editorTextoConf: !this.state.editorTextoConf })}
                                style={{ border: "1px solid grey", cursor: "pointer", backgroundColor: "black", color: "white", textAlign: "center" }}
                            />
                        }
                        <p></p>

                        {this.state.editorPestanas ?
                            <div>
                                <input type="submit" value="Cancelar" onClick={() => this.setState({ editorPestanas: !this.state.editorPestanas })} />
                                <EditorPestanas partida={this.props.partida} guardado={() => this.setState({ editorPestanas: !this.state.editorPestanas })} />
                            </div> :
                            <input
                                type="submit"
                                value="Pestañas para jugadores"
                                onClick={() => this.setState({ editorPestanas: !this.state.editorPestanas })}
                                style={{ border: "1px solid grey", cursor: "pointer", backgroundColor: "black", color: "white", textAlign: "center" }}
                            />
                        }

                        <p></p>
                        {this.state.editorVentanaPersonajes ?
                            <div>
                                <input type="submit" value="Cancelar" onClick={() => this.setState({ editorVentanaPersonajes: !this.state.editorVentanaPersonajes })} />
                                <p>En la ventana de personajes mostrar a los jugadores:</p>

                                <div onChange={(event) => this.onChangePersonajes(event.target.value)}>
                                    <p><input type="radio" value="Secretos" name="personajes" defaultChecked={this.state.personajes === "Secretos"} /> Solo sus propios personajes</p>
                                    <p><input type="radio" value="Asignados" name="personajes" defaultChecked={this.state.personajes === "Asignados"} /> Los personajes con jugadores asignados</p>
                                    <p><input type="radio" value="Todos" name="personajes" defaultChecked={this.state.personajes === "Todos"} /> Todos los personajes</p>
                                    <p><input type="radio" value="Visibles" name="personajes" defaultChecked={this.state.personajes === "Visibles"} /> Los personajes con la etiqueta "Visible"</p>
                                </div>
                            </div> :
                            <input
                                type="submit"
                                value="Ventana de personajes"
                                onClick={() => this.setState({ editorVentanaPersonajes: !this.state.editorVentanaPersonajes })}
                                style={{ border: "1px solid grey", cursor: "pointer", backgroundColor: "black", color: "white", textAlign: "center" }}
                            />
                        }



                    </div>
                }
            </div>
        )
    }
};


class ConfiguracionEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            carga: null,
            editorCompleto: [


                "undo",
                "redo",
                "style",
                "|",
                "bold",
                "italic",
                "strikethrough",
                "underline",
                "subscript",
                "superscript",
                "removeFormat",
                "|",
                "heading",
                "alignment",
                "outdent",
                "indent",
                "|",
                "-",
                "fontFamily",
                "fontBackgroundColor",
                "fontColor",
                "fontSize",
                "highlight",
                "bulletedList",
                "numberedList",
                "|",
                "imageInsert",
                "mediaEmbed",
                "blockQuote",
                "insertTable",
                "|",
                "horizontalLine",
                "specialCharacters",
                "|",
                "codeBlock",
                "link",
                "|"

            ],
            editor: [

                "undo",
                "redo",
                "style",
                "|",
                "bold",
                "italic",
                "strikethrough",
                "underline",
                "subscript",
                "superscript",
                "removeFormat",
                "|",
                "heading",
                "alignment",
                "outdent",
                "indent",
                "|",
                "-",
                "fontFamily",
                "fontBackgroundColor",
                "fontColor",
                "fontSize",
                "highlight",
                "bulletedList",
                "numberedList",
                "|",
                "imageInsert",
                "mediaEmbed",
                "blockQuote",
                "insertTable",
                "|",
                "horizontalLine",
                "specialCharacters",
                "|",
                "codeBlock",
                "link",
                "|"

            ],
            nombres: [


                "Deshacer",
                "Rehacer",
                "Estilo",
                "Separador",
                "Negrita",
                "Cursiva",
                "Tachado",
                "Subrayado",
                "Subíndice",
                "Superíndice",
                "Eliminar formato",
                "Separador",
                "Título",
                "Alineación",
                "Disminuir sangría",
                "Aumentar sangría",
                "Separador",
                "Separador",
                "Fuente",
                "Color de fondo",
                "Color de fuente",
                "Tamaño de fuente",
                "Resaltado",
                "Lista de puntos",
                "Lista numerada",
                "Separador",
                "Insertar imagen",
                "Insertar contenido multimedia",
                "Cita",
                "Insetar tabla",
                "Separador",
                "Línea horizontal",
                "Caracteres espeaciales",
                "Separador",
                "Insertar bloque de código",
                "Enlace",
                "Separador"

            ]
        };
    }

    componentDidMount = async e => {

        this.setState({
            editor: await partidaService.editorInfo(this.props.partida),
        })
        this.setState({ carga: 1 })


    };


    editorChange(e, i, s) {
        let a = this.state.editor;
        a[i] = !a[i];
        if (a[i]) a[i] = s;
        this.setState({ editor: a });

    }

    guardarEditor(e) {
        e.preventDefault();

        partidaService.guardarEditor(this.props.partida, JSON.stringify(this.state.editor));
        this.props.guardado();

    }

    render() {
        return (
            <div>{this.state.carga &&
                <div>
                    <ul>
                        {this.state.editorCompleto.map((i, index) =>
                            <li key={index}>
                                {this.state.nombres[index] !== "Separador" &&
                                    <div>
                                        <input
                                            name={index}
                                            type="checkbox"
                                            checked={this.state.editor.includes(this.state.editorCompleto[index])}
                                            onChange={e => this.editorChange(e, index, this.state.editorCompleto[index])} />
                                        <span style={{ marginLeft: "5px" }}>{this.state.nombres[index]}</span>
                                        <p></p>
                                    </div>}
                            </li>
                        )}
                    </ul>

                    <input type="submit" value="Guardar" onClick={(e) => this.guardarEditor(e)} />

                </div>
            }



            </div>
        )
    }
};



class EditorPestanas extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            carga: 0,
            carga2: 0,
            personajes: [],
            idPersonajes: [],
            nombrePersonajes: [],
            pjActual: 0,
            pestanas: [],
            editTitulos: [],
            titulosProvisionales: [],
            editContenidos: [],
            contenidosProvisionales: [],

        };
    }

    componentDidMount = async e => {

        this.setState({
            personajes: await personajeService.lista(this.props.partida),
            pestanas: await partidaService.infoPestanas(this.props.partida, authService.getCurrentUser().id)


        })
        let a = [0];
        let b = ["Pestañas por defecto"];
        for (let i = 0; i < this.state.personajes.length; i++) {
            a.push(this.state.personajes[i].id);
            b.push(this.state.personajes[i].nombre);
        }
        this.setState({
            idPersonajes: a,
            nombrePersonajes: b,
        })

        this.setState({
            carga: 1,
            carga2: 1
        })

    };

    seleccionPersonaje = async e => {

        this.setState({ carga2: 0 })
        await this.setState({ pjActual: e })
        this.setState({
            pestanas: this.state.pjActual === "0" ?
                await partidaService.infoPestanas(this.props.partida, authService.getCurrentUser().id) :
                await personajeService.infoPestanas(this.state.pjActual, authService.getCurrentUser().id)
        })
        this.setState({ carga2: 1 })


    };


    cambiarPestanas = async e => {
        personajeService.guardarPestanas(this.state.pjActual, this.preparar())
        e.preventDefault();

    }


    sobreescribir = async e => {
        partidaService.sobreescribirPestanas(this.props.partida, this.preparar())
        e.preventDefault();

    }


    guardarDefecto = async e => {
        e.preventDefault();
        partidaService.defectoPestanas(this.props.partida, this.preparar())


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
                    <div>
                        <select value={this.state.pjActual} onChange={e => this.seleccionPersonaje(e.target.value)}>
                            {this.state.nombrePersonajes.map((index, i) =>
                                <option value={this.state.idPersonajes[i]} key={i}>{this.state.nombrePersonajes[i]}</option>
                            )}
                        </select>


                        <p></p>

                        {this.state.carga2 === 1 &&

                            <div>
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

                                    {this.state.pjActual === 0 ?
                                        <div>
                                            <button onClick={e => this.guardarDefecto(e)}>Guardar por defecto</button>
                                            <p></p>
                                            <button onClick={e => this.sobreescribir(e)}>Sobreescribir</button>

                                        </div>
                                        :
                                        <button onClick={e => this.cambiarPestanas(e)}>Guardar</button>
                                    }
                                    <p></p>


                                </form>


                            </div>
                        }

                    </div>
                    : null}
            </div>
        )
    }
};




class EditorEstilo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            carga: null,
            imagenFondo: this.props.partida.estilo.imagenFondo,
            colorDados: this.HexToRgb(this.props.partida.estilo.colorDados),
            fondoEscenas: this.props.partida.estilo.fondoEscenas,
            textoEscenas: this.HexToRgb(this.props.partida.estilo.textoEscenas),
            fondoProvisional: "",
            colorTitulo: this.HexToRgb(this.props.partida.estilo.colorTitulo),
            fuenteTitulo: this.props.partida.estilo.fuenteTitulo,
            fondoPost: this.props.partida.estilo.fondoPost,

        };
    }

    componentDidMount = async e => {

        this.setState({

        })
        this.setState({ carga: 1 })

    };



    rgbToHex(c) {
        return ("#" +
            (c.r.toString(16).length === 1 ? ("0" + c.r.toString(16)) : c.r.toString(16)) +
            (c.g.toString(16).length === 1 ? ("0" + c.g.toString(16)) : c.g.toString(16)) +
            (c.b.toString(16).length === 1 ? ("0" + c.b.toString(16)) : c.b.toString(16)));
    }

    guardarEstilo(e) {
        e.preventDefault();
        this.props.guardado(e, {
            fondoEscenas: this.state.fondoEscenas,
            imagenFondo: this.state.imagenFondo,
            colorDados: this.rgbToHex(this.state.colorDados),
            textoEscenas: this.rgbToHex(this.state.textoEscenas),
            colorTitulo: this.rgbToHex(this.state.colorTitulo),
            fuenteTitulo: this.state.fuenteTitulo,
            fondoPost: this.state.fondoPost,

        });

    }

    SepararRGBA(rgba) {


        let c = rgba.substring(4, rgba.length - 1).replace(/ /g, '').split(',');
        return { r: c[0], g: c[1], b: c[2], a: c[3] };
    }

    HexToRgb(hex) {
        let color = { r: parseInt(hex.substring(1, 3), 16), g: parseInt(hex.substring(3, 5), 16), b: parseInt(hex.substring(5, 7), 16) }
        return color;
    }

    render() {
        return (
            <div>{this.state.carga &&
                <div>

                    <p>Imagen de fondo</p>
                    <img src={this.state.imagenFondo} alt="" width="200px"></img>
                    <select value={this.state.imagenFondo} onChange={e => this.setState({ imagenFondo: e.target.value })}>
                        <option value={"https://www.rolotopia.duckdns.org/static/media/Fondo1.ca147867.jpg"}>Imagen 1</option>
                        <option value={"https://www.rolotopia.duckdns.org/static/media/Fondo2.4cc426be.jpg"}>Imagen 2</option>
                        <option value={"https://www.rolotopia.duckdns.org/static/media/Fondo3.b36228c6.jpg"}>Imagen 3</option>
                        <option value={"Personalizado"}>Personalizado</option>


                    </select>
                    <span>O introduce la URL del fondo que quieras:</span>
                    <input type="text" value={this.state.fondoProvisional} onChange={e => this.setState({ fondoProvisional: e.target.value })} />

                    <p onClick={() => this.setState({ imagenFondo: this.state.fondoProvisional })}>Probar</p>

                    <p>Color del titulo de la partida</p>
                    <ColorPicker r={this.state.colorTitulo.r} g={this.state.colorTitulo.g} b={this.state.colorTitulo.b} a={this.state.colorTitulo.a} color={(c) => this.setState({ colorTitulo: c })} />

                    <p>Fuente del título</p>
                    <select value={this.state.fuenteTitulo} onChange={e => this.setState({ fuenteTitulo: e.target.value })}>
                        <option value={"Times New Roman"}>Times New Roman</option>
                        <option value={"Arial"}>Arial</option>
                        <option value={"Georgia"}>Georgia</option>

                        <option value={"Impact"}>Impact</option>
                    </select>


                    <p>Fondo de escenas</p>
                    <ColorPicker r={this.SepararRGBA(this.state.fondoEscenas).r} g={this.SepararRGBA(this.state.fondoEscenas).g} b={this.SepararRGBA(this.state.fondoEscenas).b} a={this.SepararRGBA(this.state.fondoEscenas).a} color={(c) => this.setState({ fondoEscenas: "rgba(" + c.r + "," + c.g + "," + c.b + "," + c.a + ")" })} />
                    <p>Fondo de posts</p>
                    <ColorPicker r={this.SepararRGBA(this.state.fondoPost).r} g={this.SepararRGBA(this.state.fondoPost).g} b={this.SepararRGBA(this.state.fondoPost).b} a={this.SepararRGBA(this.state.fondoPost).a} color={(c) => this.setState({ fondoPost: "rgba(" + c.r + "," + c.g + "," + c.b + "," + c.a + ")" })} />

                    <p>Color de dados</p>
                    <ColorPicker r={this.state.colorDados.r} g={this.state.colorDados.g} b={this.state.colorDados.b} a={this.state.colorDados.a} color={(c) => this.setState({ colorDados: c })} />
                    <p>Texto del menú de escenas</p>
                    <ColorPicker r={this.state.textoEscenas.r} g={this.state.textoEscenas.g} b={this.state.textoEscenas.b} a={this.state.textoEscenas.a} color={(c) => this.setState({ textoEscenas: c })} />


                    <input type="submit" value="Guardar" onClick={(e) => this.guardarEstilo(e)} />

                </div>
            }



            </div>
        )
    }
};
