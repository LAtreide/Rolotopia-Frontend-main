import React from 'react';
import partidaService from '../../../../services/partida.service';
import usuariosService from '../../../../services/usuarios.service';
import personajeService from '../../../../services/personaje.service';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import AvatarPersonaje from '../../../Utilidad/AvatarPersonaje/avatarPersonaje';
import { SPACE_URL } from '../../../../constantes';

export default class Jugadores extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            carga: null,
            jugadores: null,
            listaJugadores: [],
            nuevopj: false,
            pj: {id: 0, nombre: "Crear nuevo personaje"},
            jugador: null,



        };
    }

    componentDidMount = async e => {
        
        this.setState({
            jugadores: await partidaService.jugadores(this.props.partida),
            usuarios: await usuariosService.listaUsuarios(),
            personajes: await personajeService.lista(this.props.partida),

        })

        for (const [key/*, value*/] of Object.entries(this.state.jugadores)) {
            this.state.listaJugadores.push(key);
        }

    let personajes = this.state.personajes;
    personajes.unshift({ id: 0, nombre: "Crear nuevo personaje" });

    this.setState({ carga: 1, personajes: personajes });
  
    };

    eliminar = (jugador, personaje) => {
        partidaService.desasignar(jugador, this.state.jugadores[jugador][personaje].id, this.props.partida);
        let a = this.state.jugadores;
        a[jugador].splice(personaje, 1);
        if (a[jugador].length === 0) {
            let b = this.state.listaJugadores;
            b.splice(b.indexOf(jugador), 1);
            this.setState({ listaJugadores: b });
        }
        this.setState({ jugadores: a });


    }

    setValue = (value) => this.setState({ jugador: value });
    setValuePj = (value) => this.setState({ pj: value });
    menuAsignar = () => this.setState({ nuevopj: !this.state.nuevopj });


    Asignar = async e => {

        if (this.state.jugador && this.state.pj.id !== null) {
        
            await partidaService.nuevoJugador(this.state.jugador, this.props.partida, this.state.pj.id);
            this.setState({
                jugador: null,
                pj: {id:0, nombre: "Crear nuevo personaje"},
                jugadores: await partidaService.jugadores(this.props.partida),
            })
            let a = [];
            for (const [key/*, value*/] of Object.entries(this.state.jugadores)) {
                a.push(key);
            }
            this.setState({ listaJugadores: a })

        }
    }


    render() {
        return (
            <div>
                {this.state.carga &&
                    <div>
                        <h1>Jugadores</h1>

                        {this.props.director && !this.state.nuevopj ?
                            <button type="submit" onClick={this.menuAsignar}>Asignar personaje</button>
                            :
                            this.state.director ?
                                <button type="submit" onClick={this.menuAsignar}>Cancelar</button> : null
                        }
                        {this.state.nuevopj ?
                            <div style={{ display: 'flex' }}>
                                <Autocomplete
                                    value={this.state.jugador}
                                    onChange={(event, newValue) => { this.setValue(newValue); }}

                                    options={this.state.usuarios}
                                    getOptionLabel={(option) => option}
                                    style={{ width: 300 }}
                                    renderInput={(params) => <TextField {...params} label="Nuevo jugador" variant="outlined" />}
                                />

                                <Autocomplete
                                    value={this.state.pj}
                                    onChange={(event, newValue) => { this.setValuePj(newValue);}}

                                    options={this.state.personajes}
                                    getOptionLabel={(option) => option.nombre}
                                    style={{ width: 300 }}
                                    renderInput={(params) => <TextField {...params} label="Nuevo personaje" variant="outlined" />}
                                />
                                <button type="submit" onClick={this.Asignar}>Asignar</button>



                            </div>

                            : null}

                        <ul>
                            {this.state.listaJugadores.map((i) =>


                                <li key={i} style={{ display: 'block' }}>
                                    <p></p>
                                    <span>{i}</span>
                                    <ul>
                                        {this.state.jugadores[i].map((j, index) =>
                                            <li key={j.id} style={{ display: 'inline-block', marginLeft: "15px" }}>
                                                <AvatarPersonaje src={SPACE_URL + "/avatarPj/" +  j.avatar} width="40px" alt="" />

                                                <span>{j.nombre}</span>
                                                {this.props.director ?
                                                    <button onClick={() => this.eliminar(i, index)} style={{ border: "1px solid white", backgroundColor: "black", color: "white", width: "15px" }}>X</button>
                                                    : null}
                                            </li>
                                        )}
                                    </ul>


                                </li>
                            )}
                        </ul>


                    </div>
                }
            </div>
        )
    }
};
