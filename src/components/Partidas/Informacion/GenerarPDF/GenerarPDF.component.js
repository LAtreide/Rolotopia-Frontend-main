import React from 'react';
import escenaService from '../../../../services/escena.service';
import authService from '../../../../services/auth.service';
import VistaPDF from './VistaPDF.component';
import ReactToPrint from 'react-to-print';
import personajeService from "../../../../services/personaje.service"


export default class GenerarPDF extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            carga: null,
            escenas: null,
            escenasCapitulos: {},
            escenasExpotar: [],
            mostrarNotas: false,
            mostrarVacios: false,
            mostrarDestinataraios: false,
            mostrarTiradas: false,
            mostrarPjsAsignados: false,
            mostrarPjsNoAsignados: false,
            personajesAsignados: [],
            personajesNoAsignados: [],
        };
    }

    componentDidMount = async e => {


        this.setState({
            escenas: await escenaService.lista(this.props.partida, authService.getCurrentUser().id),
            personajes: await personajeService.lista(this.props.partida)
        })

        let a = {};
        for (let i = 0; i < this.state.escenas.length; i++) {
            if (this.state.escenas[i].tipo === 3) {
                a[this.state.escenas[i].id] = await escenaService.listaEscenasCapitulo(this.state.escenas[i].id, authService.getCurrentUser().id)
            }
        }
        this.setState({ escenasCapitulos: a })
        this.setState({ carga: 1 })

    };


    setEscenasExportar(e, id) {

        let a = this.state.escenasExpotar;
        if (a.includes(id)) a.splice(a.indexOf(id), 1);
        else a.push(id);
        this.setState({ escenasExpotar: a })

    }


    seleccionarTodas(e) {
        e.preventDefault();
        let a = [];
        for (let i = 0; i < this.state.escenas.length; i++) {
            a.push(this.state.escenas[i].id)
        }
        this.setState({ escenasExpotar: a })

    }

    desSeleccionarTodas(e) {
        e.preventDefault();
        let a = [];
        this.setState({ escenasExpotar: a })

    }

    incluida(id) {
        return this.state.escenasExpotar.includes(id);
    }

    nombreEscenas() {

        let a = [];
        for (let i = 0; i < this.state.escenasExpotar.length; i++) {
            for (let j = 0; j < this.state.escenas.length; j++) {

                if (this.state.escenas[j].id === this.state.escenasExpotar[i]) {
                    a.push(this.state.escenas[j].nombre)
                }
            }
        }
        return a;
    }

    handleSubmit = async e => {
        e.preventDefault();

        if (this.state.mostrarPjsAsignados || this.state.mostrarPjsNoAsignados) {
            let personajes = await personajeService.listaParcial(this.props.partida, authService.getCurrentUser().id);
            let b = [];
            let c = [];
            for (let i = 0; i < personajes.length; i++) {
                if (await personajeService.isAsignado(personajes[i].id)) {
                    if (this.state.mostrarPjsAsignados) b.push(personajes[i].id)
                }
                else if (this.state.mostrarPjsNoAsignados) {
                    c.push(personajes[i].id)
                }
            }


            this.setState({ personajesAsignados: b, personajesNoAsignados: c })

        }
        await this.setState({ enviado: false })
        this.setState({ enviado: true })

    }

    render() {
        return (
            <div className='container'>
                {this.state.carga &&
                    <div className='"jumbotron' style={{ background: "rgba(200,200,200,0.7)", borderRadius: "15px", padding: "10px", margin: "10px" }}>



                        <form onSubmit={this.handleSubmit}>
                            <h1>Opciones del Pdf</h1>

                            <div>
                                <div>
                                    <input
                                        type="checkbox"
                                        checked={this.state.mostrarNotas}
                                        onChange={e => this.setState({ mostrarNotas: e.target.checked })}
                                    />

                                    <span>Mostrar Notas </span>
                                </div>

                                <div>
                                    <input
                                        type="checkbox"
                                        checked={this.state.mostrarVacios}
                                        onChange={e => this.setState({ mostrarVacios: e.target.checked })}
                                    />

                                    <span>Mostrar Post Vacios </span>
                                </div>
                                <div>
                                    <input
                                        type="checkbox"
                                        checked={this.state.mostrarDestinatarios}
                                        onChange={e => this.setState({ mostrarDestinataraios: e.target.checked })}
                                    />

                                    <span>Mostrar Destinatarios </span>
                                </div>
                                <div>
                                    <input
                                        type="checkbox"
                                        checked={this.state.mostrarTiradas}
                                        onChange={e => this.setState({ mostrarTiradas: e.target.checked })}
                                    />

                                    <span>Mostrar Tiradas </span>
                                </div>
                                <div>
                                    <input
                                        type="checkbox"
                                        checked={this.state.mostrarPjsAsignados}
                                        onChange={e => this.setState({ mostrarPjsAsignados: e.target.checked })}
                                    />

                                    <span>Mostrar Datos de Personajes Jugadores  </span>
                                </div>
                                <div>
                                    <input
                                        type="checkbox"
                                        checked={this.state.mostrarPjsNoAsignados}
                                        onChange={e => this.setState({ mostrarPjsNoAsignados: e.target.checked })}
                                    />

                                    <span>Mostrar Datos de Personajes No Jugadores</span>
                                </div>

                            </div>


                            <h1>Escenas a exportar</h1>
                            <button onClick={e => this.seleccionarTodas(e)}>Seleccionar todas</button>
                            <button onClick={e => this.desSeleccionarTodas(e)}>Desseleccionar todas</button>

                            <p></p>
                            <ul style={{ listStyle: "none", display: "inline-block" }}>
                                {this.state.escenas.map(i =>

                                    <li key={i.id}>

                                        {i.tipo === 1 &&
                                            <div>
                                                <input
                                                    type="checkbox"
                                                    checked={this.incluida(i.id)}
                                                    onChange={e => this.setEscenasExportar(e, i.id)}
                                                />
                                                {this.state.escenasExpotar.includes(i.id) ? <span> {this.state.escenasExpotar.indexOf(i.id) + 1} </span> : null}
                                                <span>{i.nombre}</span>

                                            </div>
                                        }


                                        {i.tipo === 3 &&
                                            <div>
                                                <span><strong>{i.nombre}</strong></span>
                                                <p></p>
                                                <ul style={{ listStyle: "none", display: "inline-block" }}>
                                                    {this.state.escenasCapitulos[i.id].map(j =>

                                                        <li key={j.id}>


                                                            <div>
                                                                <input
                                                                    type="checkbox"
                                                                    checked={this.incluida(j.id)}
                                                                    onChange={e => this.setEscenasExportar(e, j.id)}
                                                                />
                                                                {this.state.escenasExpotar.includes(j.id) ? <span> {this.state.escenasExpotar.indexOf(j.id) + 1} </span> : null}
                                                                <span>{j.nombre}</span>

                                                            </div>

                                                            <p></p>




                                                        </li>

                                                    )}
                                                </ul>

                                            </div>
                                        }


                                        <p></p>




                                    </li>

                                )}
                            </ul>
                            <p></p>
                            <button type="submit">Generar PDF</button>

                        </form>
                        <button onClick={() => this.props.volver()}>Volver</button>
                        {this.state.enviado ?

                            <div >



                                <ReactToPrint
                                    content={() => this.componentRef}
                                    trigger={() => <button className="btn btn-primary">Imprimir en PDF</button>}
                                    pageStyle="@page { size: 5in 3in }"


                                />

                                <div style={{ backgroundColor: "white" }}>
                                    <VistaPDF
                                        ref={(response) => (this.componentRef = response)}
                                        style={{ display: "none" }}
                                        partida={this.props.partida}
                                        escenas={this.state.escenasExpotar}
                                        nombreEscenas={this.nombreEscenas()}
                                        usuario={authService.getCurrentUser().id}
                                        personajes={this.state.personajes}
                                        personajesAsignados={this.state.personajesAsignados}
                                        personajesNoAsignados={this.state.personajesNoAsignados}
                                        opciones={{
                                            destinatarios: this.state.mostrarDestinataraios,
                                            blanco: this.state.mostrarVacios,
                                            tiradas: this.state.mostrarTiradas,
                                            notas: this.state.mostrarNotas,
                                            mostrarPjs: this.state.mostrarPjsAsignados,
                                            mostrarPnjs: this.state.mostrarPjsNoAsignados,

                                        }}


                                    />

                                </div>

                            </div>

                            : null}

                    </div>
                }
            </div>
        )
    }
};

