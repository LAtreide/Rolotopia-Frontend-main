import React from 'react';
import PersonajeService from '../../../../services/personaje.service';
import AuthService from '../../../../services/auth.service';
import AvatarPersonaje from '../../../Utilidad/AvatarPersonaje/avatarPersonaje';
import personajeService from '../../../../services/personaje.service';
import InfoPersonaje from '../InfoPersonaje/InfoPersonaje.component';
import { SPACE_URL } from '../../../../constantes';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import { faLayerGroup, faSearch } from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import authService from '../../../../services/auth.service';



export default class Personajes extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            personaje: this.props.personaje ? this.props.personaje : 0,
            lista: [],
            listaCompleta: [],
            carga: null,
            pestana: null,
            director: 0,
            creacionPj: '',
            propietario: 0,
            editarPestana: false,
            contenido: "",
            filtros: [],
            listaEtiquetas: [],
            nombreFiltro: "",
            vista: "Lista",
            mostrarGrupos: true
        };
    }



    async pjInfo(idPersonaje) {
        this.setState({
            info: await PersonajeService.infoCompletaId(idPersonaje, AuthService.getCurrentUser().id),
        })
        this.setState({
            propietario: await PersonajeService.isPropietario(this.state.info.id, AuthService.getCurrentUser().id),
        })
        if (this.state.info.pestanas.length > 0) {
            this.setState({ pestana: 0 })
        }

        this.setState({

            personaje: idPersonaje
        })
    }


    componentDidMount = async e => {

        this.setState({
            listaCompleta: this.props.director ? await PersonajeService.lista(this.props.partida)  : await PersonajeService.listaParcial(this.props.partida,authService.getCurrentUser().id),
            director: this.props.director,
        })

        let a = []
        for (let i = 0; i < this.state.listaCompleta.length; i++) {
            for (let j = 0; j < this.state.listaCompleta[i].etiqueta.length; j++) {
                if (!a.includes(this.state.listaCompleta[i].etiqueta[j])) a.push(this.state.listaCompleta[i].etiqueta[j])
            }
        }

        this.setState({
            lista: this.state.listaCompleta,
            carga: 1,
            listaEtiquetas: a,
        })

    };

    crearPj = (value) => this.setState({ creacionPj: value });
    llamadaCrearPj = async e => {
        if (this.state.creacionPj !== '') {
            let a = await PersonajeService.crear(this.state.creacionPj, this.props.partida);
            let b = this.state.listaCompleta;
            b.unshift(a);
            this.setState({
                listaCompleta: b,
                lista: b
            })
            this.props.onCambio({ tipo: "CreacionPj", personaje: a })
        }
    }

    subida(e, idPj) {
        let a = this.state.info;
        let b = this.state.lista;
        a.avatar = e;
        for (var i = 0; i < b.length; i++) {
            if (b[i].id === idPj) b[i].avatar = e;
        }
        this.setState({
            info: a,
            lista: b
        })
       
        this.props.onCambio({ tipo: "AvatarPj", avatar: e, idPj: idPj })

    }

    saveContenido = async e => {
        await personajeService.guardarPestanaUnica(this.state.personaje, this.state.pestana + 1, this.state.contenido);
        let a = this.state.info;
        a.pestanas[this.state.pestana].info = this.state.contenido;
        this.setState({
            editarPestana: false,
            contenido: "",
            info: a
        })
    }

    async onChangeFiltros(filtros) {

        await this.setState({ filtros: filtros })
        this.filtrar();

    }

    filtrar() {
        let lFiltrada = [...this.state.listaCompleta]

        for (let i = lFiltrada.length - 1; i >= 0; i--) {
            for (let j = 0; j < this.state.filtros.length; j++) {

                if (!lFiltrada[i].etiqueta.includes(this.state.filtros[j])) {
                    lFiltrada.splice(i, 1);
                    j = this.state.filtros.length;

                }
            }
        }

        for (let i = lFiltrada.length - 1; i >= 0; i--) {
            if (!lFiltrada[i].nombre.includes(this.state.nombreFiltro)) lFiltrada.splice(i, 1)
        }


        this.setState({ lista: lFiltrada })
    }

    async filtrarNombre(value) {

        await this.setState({ nombreFiltro: value })
        this.filtrar();
    }



    render() {
        return (
            <div style={{ padding: "20px" }}>
                {this.state.carga && this.state.personaje === 0 &&
                    <div>
                        <h2>Personajes</h2>

                        {this.state.director ?
                            <div>
                                <p></p>
                                <input type="text" value={this.state.creacionPj} onChange={e => this.setState({ creacionPj: e.target.value })} />
                                <button type="submit" onClick={this.llamadaCrearPj}>Crear personaje</button>
                                <p></p>

                                {this.state.vista === "Lista" ?
                                    <div>
                                        <h3>Vista de Lista</h3>
                                        <button onClick={() => this.setState({ vista: "Grupos" })} style={{ border: "1px solid white", backgroundColor: "black", color: "white" }}>Vista de Grupos</button>

                                        <h3>Filtros</h3>
                                        <p>Nombre: <input type="text" value={this.state.nombreFiltro} onChange={(e) => this.filtrarNombre(e.target.value)} style={{ width: "100%" }} /></p>
                                        <Autocomplete
                                            multiple
                                            id="tags-standard"

                                            onChange={(event, newValue) => { this.onChangeFiltros(newValue) }}

                                            options={this.state.listaEtiquetas}
                                            getOptionLabel={(option) => option}
                                            defaultValue={[]}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    variant="standard"
                                                    label="Filtro"
                                                    placeholder="Escribe etiqueta"
                                                />
                                            )}
                                        />
                                        <p></p>
                                        <ul style={{ listStyle: "none", display: "inline-block" }}>
                                            {this.state.lista.map(i =>
                                                <li key={i.id} style={{ marginBottom: "5px", display: "inline-block", width: "300px" }}>

                                                    <div onClick={() => this.pjInfo(i.id)} style={{ display: "block", border: "1px solid black", borderRadius: "4px", marginRight: "5px", cursor: "pointer", backgroundColor: "#a5459a" }}>
                                                        <AvatarPersonaje src={SPACE_URL + "/avatarPj/" + (this.props.cambiosAvatar[i.id] ? this.props.cambiosAvatar[i.id]  : i.avatar)} width="120px" alt="" style={{ marginRight: "15px" }} />


                                                        <span style={{ verticalAlign: "top" }}>
                                                        {this.props.nombresPj[i.id] ? this.props.nombresPj[i.id] : i.nombre}
                                                        </span>


                                                    </div>
                                                </li>)}
                                        </ul>

                                    </div>
                                    :
                                    <div>
                                        <h3>Vista de Grupos</h3>

                                        <button onClick={() => this.setState({ vista: "Lista" })} style={{ border: "1px solid white", backgroundColor: "black", color: "white" }}>Vista de Lista</button>
                                        <div>
                                            {this.state.mostrarGrupos &&
                                                <ul style={{ listStyle: "none", display: "flex" }}>


                                                    {this.state.listaEtiquetas.map((j) =>

                                                        <div onClick={() => { this.setState({ etiquetaActual: j, mostrarGrupos: false }) }} key={j} style={{ padding: "15px", display: "block", border: "1px solid black", borderRadius: "4px", marginRight: "5px", cursor: "pointer", backgroundColor: "#a5459a" }}>
                                                            <span >
                                                                <FontAwesomeIcon icon={faLayerGroup} />
                                                                {j}
                                                            </span>
                                                        </div>
                                                    )}
                                                    <div onClick={() => { this.setState({ etiquetaActual: "", mostrarGrupos: false }) }} style={{ padding: "15px", display: "block", border: "1px solid black", borderRadius: "4px", marginRight: "5px", cursor: "pointer", backgroundColor: "#a5459a" }}>
                                                        <span ><FontAwesomeIcon icon={faSearch} /> Sin etiquetas</span>
                                                    </div>
                                                </ul>
                                            }
                                            <h3>{!this.state.mostrarGrupos && this.state.etiquetaActual !== "" ? this.state.etiquetaActual : !this.state.mostrarGrupos ? "Sin etiquetas" : null}</h3>
                                            {!this.state.mostrarGrupos && this.state.listaCompleta.map(i =>

                                                <li key={i.id} style={i.etiqueta.includes(this.state.etiquetaActual) ? { marginBottom: "5px", display: "inline-block", width: "300px" } : { display: 'none' }}>

                                                    <div key={i.id} >
                                                        <div onClick={() => this.pjInfo(i.id)} style={{ display: "block", border: "1px solid black", borderRadius: "4px", marginRight: "5px", cursor: "pointer", backgroundColor: "#a5459a" }}>
                                                            <AvatarPersonaje src={SPACE_URL + "/avatarPj/" + (this.props.cambiosAvatar[i.id] ? this.props.cambiosAvatar[i.id]  : i.avatar)} width="120px" alt="" style={{ marginRight: "15px" }} />

                                                            <span style={{ verticalAlign: "top" }}>
                                                                {this.props.nombresPj[i.id] ? this.props.nombresPj[i.id] :i.nombre}
                                                            </span>


                                                        </div>
                                                    </div>

                                                </li>)}




                                            {!this.state.mostrarGrupos && this.state.listaCompleta.map(i =>

                                                <li key={i.id} style={i.etiqueta.length === 0 && this.state.etiquetaActual === "" ? { marginBottom: "5px", display: "inline-block", width: "300px" } : { display: 'none' }}>
                                                    <div onClick={() => this.pjInfo(i.id)} style={{ display: "block", border: "1px solid black", borderRadius: "4px", marginRight: "5px", cursor: "pointer", backgroundColor: "#a5459a" }}>
                                                        <AvatarPersonaje src={SPACE_URL + "/avatarPj/" + (this.props.cambiosAvatar[i.id] ? this.props.cambiosAvatar[i.id]  : i.avatar)} width="120px" alt="" style={{ marginRight: "15px" }} />


                                                        <span style={{ verticalAlign: "top" }}>
                                                        {this.props.nombresPj[i.id] ? this.props.nombresPj[i.id] :i.nombre}
                                                        </span>


                                                    </div>
                                                </li>

                                            )}

                                            {!this.state.mostrarGrupos &&

                                                <p><button onClick={() => this.setState({ mostrarGrupos: true })} style={{ border: "1px solid white", backgroundColor: "black", color: "white" }}>Atrás</button></p>
                                            }
                                        </div>
                                    </div>
                                }

                            </div>

                            :

                            <ul style={{ listStyle: "none", display: "inline-block" }}>
                                {this.state.lista.map(i =>
                                    <li key={i.id} style={{ marginBottom: "5px", display: "inline-block", width: "300px" }}>

                                        <div onClick={() => this.pjInfo(i.id)} style={{ display: "block", border: "1px solid black", borderRadius: "4px", marginRight: "5px", cursor: "pointer", backgroundColor: "#a5459a" }}>
                                            <AvatarPersonaje src={SPACE_URL + "/avatarPj/" + (this.props.cambiosAvatar[i.id] ? this.props.cambiosAvatar[i.id]  : i.avatar)} width="120px" alt="" style={{ marginRight: "15px" }} />


                                            <span style={{ verticalAlign: "top" }}>
                                            {this.props.nombresPj[i.id] ? this.props.nombresPj[i.id] :i.nombre}
                                            </span>


                                        </div>
                                    </li>)}
                            </ul>
                        }
                    </div>



                }

                {this.state.carga && this.state.personaje !== 0 &&
                    <div>
                        <InfoPersonaje 
                        director={this.props.director} 
                        personaje={this.state.personaje} 
                        subida={(e,idPj)=>this.subida(e,idPj)} 
                        cambioNombre={(idPj,e)=>this.props.onCambio({tipo:"NombrePj",idPj: idPj, nombre: e})}
                        nombresPj={this.props.nombresPj}
                        />
                        <button onClick={() => this.setState({ personaje: 0 })}>Volver</button>
                    </div>
                }

            </div>
        )
    }
};
