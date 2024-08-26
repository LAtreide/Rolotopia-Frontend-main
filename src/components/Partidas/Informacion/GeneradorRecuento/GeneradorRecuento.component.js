import React from 'react';
import personajeService from '../../../../services/personaje.service';
import escenaService from '../../../../services/escena.service';
import authService from '../../../../services/auth.service';
import partidaService from '../../../../services/partida.service';
import "../../../../css/Recuento.css";
import { Default } from 'react-awesome-spinners'


export default class GeneradorRecuento extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            carga: 0,
            fechaTipo: "Esta semana",
            finicio: "",
            ffin: "",
            escenas: [],
            listaPersonajes: [],
            personajesIncluir: [],
            listaPersonajesAsignados: [],
            resultado: null,
            fechaInicioPartida: "",
            semanas: [],
            selectAllEscenas: false,
            selectAllPersonajes: false,
            selectJuegoPersonajes: false,
            cargando: false,

        };
    }

    componentDidMount = async e => {

        this.setState({
            escenas: await escenaService.listaPlanas(this.props.partida, authService.getCurrentUser().id),
            fechaInicioPartida: (await partidaService.infoPartidaId(this.props.partida)).fechaInicio,
            listaPersonajesAsignados: await personajeService.listaPersonajesAsignados(this.props.partida)
        })

        if (!this.state.fechaInicioPartida) this.setState({ fechaInicioPartida: "2023-01-01" })


        this.setState({
            carga: 1,
        })

        this.onChangeDate(this.state.fechaTipo)

        let b = [];
        for (let i = 0; i < this.state.escenas.length; i++) {
            if (this.state.escenas[i].recuento === 1) b.push(this.state.escenas[i].id)
        }
        if (b.length === 0) this.setState({ listaPersonajes: [] })
        else this.setState({ listaPersonajes: await personajeService.pjsEscribirEscenas(b) })
        let c = {}
        for (let j = 0; j < this.state.listaPersonajes.length; j++) {

            c[this.state.listaPersonajes[j].id] = 1;
        }

        this.setState({ personajesIncluir: c })


    };




    async onChangeDate(value) {
        await this.setState({ fechaTipo: value })
        var day = new Date().getDay(),
            diff = new Date().getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday

        if (this.state.fechaTipo === "Esta semana") {

            this.setState({
                finicio: new Date(new Date().setDate(diff)).toISOString().substring(0, 10).replace("T", " "),
                ffin: new Date().toISOString().substring(0, 10).replace("T", " ")
            })
        }


        if (this.state.fechaTipo === "La semana pasada") {

            this.setState({
                finicio: new Date(new Date().setDate(diff - 7)).toISOString().substring(0, 10).replace("T", " "),
                ffin: new Date(new Date().setDate(diff - 1)).toISOString().substring(0, 10).replace("T", " ")
            })
        }


        if (this.state.fechaTipo === "Este mes") {

            this.setState({
                finicio: new Date(new Date().setDate(1)).toISOString().substring(0, 10).replace("T", " "),
                ffin: new Date().toISOString().substring(0, 10).replace("T", " ")
            })
        }


        if (this.state.fechaTipo === "El mes pasado") {

            this.setState({
                finicio: new Date(new Date(new Date().setDate(1)).setMonth(new Date().getMonth() - 1)).toISOString().substring(0, 10).replace("T", " "),
                ffin: new Date(new Date().setDate(0)).toISOString().substring(0, 10).replace("T", " "),
            })
        }

        if (this.state.fechaTipo === "La partida hasta hoy") {

            this.setState({
                finicio: this.state.fechaInicioPartida,
                ffin: new Date().toISOString().substring(0, 10).replace("T", " "),
            })
        }





    }


    async recuentoEscenaChange(e, i) {
        let a = this.state.escenas;
        e.target.checked ? a[i].recuento = 1 : a[i].recuento = 0;
        this.setState({ escenas: a });
        let b = [];
        for (let i = 0; i < this.state.escenas.length; i++) {
            if (this.state.escenas[i].recuento === 1) b.push(this.state.escenas[i].id)
        }
        if (b.length === 0) this.setState({ listaPersonajes: [] })
        else this.setState({ listaPersonajes: await personajeService.pjsEscribirEscenas(b) })
        let c = {}
        for (let j = 0; j < this.state.listaPersonajes.length; j++) {

            c[this.state.listaPersonajes[j].id] = this.state.selectAllPersonajes ? 1 : 0;
        }

        this.setState({ personajesIncluir: c })

    }


    async personajeEscenaChange(e, i) {
        let a = this.state.personajesIncluir;
        if (e.target.checked) {
            a[this.state.listaPersonajes[i].id] = 1;
        }
        else {
            a[this.state.listaPersonajes[i].id] = 0;
            this.setState({ selectAllPersonajes: false })
        }
        this.setState({ personajesIncluir: a });

    }



    async onEnviar() {

        let personajes = []
        for (let i = 0; i < this.state.listaPersonajes.length; i++) {
            if (this.state.personajesIncluir[this.state.listaPersonajes[i].id] === 1) personajes.push(this.state.listaPersonajes[i].id)
        }
        let escenas = []
        for (let i = 0; i < this.state.escenas.length; i++) {
            if (this.state.escenas[i].recuento === 1) escenas.push(this.state.escenas[i].id)
        }

        this.setState({cargando: true})


        let start = new Date(this.state.finicio);
        let end = new Date(this.state.ffin);
        let weeks = [];
        start.setDate(start.getDate() - start.getDay() + 1);


        while (start <= end) {
            const week = [];
            for (let i = 0; i < 7; i++) {
                week.push(new Date(start));
                start.setDate(start.getDate() + 1);
            }
            weeks.push(week);
        }

        this.setState({ weeks });

        this.setState({ resultado: await partidaService.solicitarRecuento(authService.getCurrentUser().id, escenas, personajes, this.state.finicio, this.state.ffin), cargando: false })

    }

    handleSelectAllEscenas = async (e) => {
        const selectAllEscenas = e.target.checked;
        let a = this.state.escenas;
        let b = [];

        this.setState({ selectAllEscenas: selectAllEscenas })
        for (let j = 0; j < a.length; j++) {
            a[j].recuento = selectAllEscenas ? 1 : 0;
            if (selectAllEscenas) b.push(a[j].id)
        }

        this.setState({ escenas: a });

        if (b.length === 0) this.setState({ listaPersonajes: [] })
        else {
            this.setState({ listaPersonajes: await personajeService.pjsEscribirEscenas(b) })
            this.handleSelectPersonajesJuego(true);
        }


    }

    handleSelectAllPersonajes = (e) => {
        let a = this.state.personajesIncluir;
        const selectAll = e.target.checked;

        for (let i = 0; i < this.state.listaPersonajes.length; i++) {
            a[this.state.listaPersonajes[i].id] = selectAll ? 1 : 0;
        }

        this.setState({ personajesIncluir: a, selectAllPersonajes: selectAll, selectJuegoPersonajes: false });
    }


    handleSelectPersonajesJuego = (e) => {

        let a = this.state.listaPersonajesAsignados;
        const selectJuego = e;
        let b = [];
        for (let i = 0; i < a.length; i++) {
            b[a[i].id] = selectJuego ? 1 : 0;
        }

        this.setState({ personajesIncluir: b, selectJuegoPersonajes: selectJuego, selectAllPersonajes: false });



    }




    render() {
        return (
            <div>
                {this.state.carga === 1 ?
                    <div>
                        <div style={{ display: "flex", marginTop: "10px", }}>
                            <div style={{ display: "flex", flexDirection: "column", marginRight: "20px" }}>
                                <h3>Rango de tiempos</h3>
                                <div onChange={(event) => this.onChangeDate(event.target.value)}>
                                    <p><input type="radio" value="Esta semana" name="recuento" defaultChecked={this.state.fechaTipo === "Esta semana"} /> Esta semana</p>
                                    <p><input type="radio" value="La semana pasada" name="recuento" defaultChecked={this.state.fechaTipo === "La semana pasada"} /> La semana pasada</p>
                                    <p><input type="radio" value="Este mes" name="recuento" defaultChecked={this.state.fechaTipo === "Este mes"} /> Este mes</p>
                                    <p><input type="radio" value="El mes pasado" name="recuento" defaultChecked={this.state.fechaTipo === "El mes pasado"} /> El mes pasado</p>
                                    <p><input type="radio" value="La partida hasta hoy" name="recuento" defaultChecked={this.state.fechaTipo === "La partida hasta hoy"} /> La partida hasta hoy</p>
                                    <p><input type="radio" value="Personalizado" name="recuento" defaultChecked={this.state.fechaTipo === "Personalizado"} /> Personalizado</p>
                                </div>


                                <p>Fecha inicio: </p>
                                {this.state.fechaTipo === "Personalizado" ?
                                    <input
                                        type="date"
                                        value={this.state.finicio}
                                        onChange={e => this.setState({ finicio: e.target.value })}
                                    />


                                    : <span style={{ border: "1px solid black" }}>{this.state.finicio}</span>}

                                <p>Fecha fin: </p>
                                {this.state.fechaTipo === "Personalizado" ?
                                    <input
                                        type="date"
                                        value={this.state.ffin}
                                        onChange={e => this.setState({ ffin: e.target.value })}
                                    />


                                    : <span style={{ border: "1px solid black" }}>{this.state.ffin}</span>}

                                <p>{this.state.finicio && this.state.ffin && new Date(this.state.finicio).getTime() > new Date(this.state.ffin).getTime() ? "Orden incorrecto" : null}</p>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", marginRight: "20px" }}>
                                <h3>Escenas</h3>
                                <li
                                    key="select-all"
                                    style={{ display: 'block', textAlign: 'left', cursor: 'pointer' }}
                                    onClick={() => this.handleSelectAllEscenas({ target: { checked: !this.state.selectAllEscenas } })}
                                >
                                    <input
                                        name="select-all"
                                        type="checkbox"
                                        checked={this.state.selectAllEscenas}
                                        onChange={e => e.stopPropagation()} // Evita que el evento se propague cuando se hace clic directamente en el checkbox
                                    />
                                    <span style={{ marginLeft: "5px" }}>Marcar todas</span>
                                </li>

                                {this.state.escenas.map((i, index) =>
                                   <li 
                                   key={i.id} 
                                   style={{ display: 'block', textAlign: 'left', cursor: 'pointer' }} 
                                   onClick={() => this.recuentoEscenaChange({ target: { checked: i.recuento !== 1 }}, index)}
                               >
                                   <input
                                       name={index}
                                       type="checkbox"
                                       checked={i.recuento === 1}
                                       onChange={e => e.stopPropagation()} // Evita que el evento se propague cuando se hace clic directamente en el checkbox
                                   />
                                   <span style={{ marginLeft: "5px" }}>{i.nombre}</span>
                               </li>
                               
                                )}

                            </div>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <h3>Personajes</h3>
                                <li
                                    key="select-juego"
                                    style={{ display: 'block', textAlign: 'left', cursor: 'pointer' }}
                                    onClick={() => this.handleSelectPersonajesJuego(!this.state.selectJuegoPersonajes)}
                                >
                                    <input
                                        name="select-all"
                                        type="checkbox"
                                        checked={this.state.selectJuegoPersonajes}
                                        onChange={e => e.stopPropagation()} // Evita que el evento se propague cuando se hace clic directamente en el checkbox
                                    />
                                    <span style={{ marginLeft: "5px" }}>Marcar personajes en juego</span>
                                </li>


                                <li
                                    key="select-all"
                                    style={{ display: 'block', textAlign: 'left', cursor: 'pointer' }}
                                    onClick={() => this.handleSelectAllPersonajes({ target: { checked: !this.state.selectAllPersonajes } })}
                                >
                                    <input
                                        name="select-all"
                                        type="checkbox"
                                        checked={this.state.selectAllPersonajes}
                                        onChange={e => e.stopPropagation()} // Evita que el evento se propague cuando se hace clic directamente en el checkbox
                                    />
                                    <span style={{ marginLeft: "5px" }}>Marcar todos</span>
                                </li>

                                {this.state.listaPersonajes.map((i, index) =>
                                   <li 
                                   key={i.id} 
                                   style={{ display: 'block', textAlign: 'left', cursor: 'pointer' }} 
                                   onClick={() => this.personajeEscenaChange({ target: { checked: this.state.personajesIncluir[i.id] !== 1 }}, index)}
                               >
                                   <input
                                       name={index}
                                       type="checkbox"
                                       checked={this.state.personajesIncluir[i.id] === 1}
                                       onChange={e => e.stopPropagation()} // Evita que el evento se propague cuando se hace clic directamente en el checkbox
                                   />
                                   <span style={{ marginLeft: "5px" }}>{i.nombre}</span>
                               </li>
                               
                                )}


                            </div>

                        </div>
                        <div style={{ textAlign: "center" }}>

                            <span onClick={() => this.onEnviar()} style={{ border: "1px solid black", color: "white", background: "black", borderRadius: "5px", marginLeft: "5px", padding: '7px', cursor: 'pointer' }} >Solicitar Recuento</span>

                        </div>

                        {
                            this.state.cargando && <div>
                                <Default color={"#04434a"}/>
                                <p>Cargando recuento...</p>
                                </div>
                        }
                        {this.state.resultado && !this.state.cargando ? <div>

                            <table className="calendar">
                                <thead>
                                    <tr>
                                        <td className="recuentoVacio"></td>
                                        <th>Lun</th>
                                        <th>Mar</th>
                                        <th>Mié</th>
                                        <th>Jue</th>
                                        <th>Vie</th>
                                        <th>Sáb</th>
                                        <th>Dom</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.weeks.map((week, index) => (
                                        <React.Fragment key={index}>
                                            <tr>
                                                <td className="recuentoVacio"></td>
                                                {week.map((day, i) => (
                                                    <td key={i} className="date-row">
                                                        {day.getDate()}/{day.getMonth() + 1}/{day.getFullYear()}
                                                    </td>
                                                ))}

                                            </tr>

                                            {Object.keys(this.state.resultado).map((nombre, i) => (
                                                <tr key={i} className="personaje-row">
                                                    <th>{nombre}</th>
                                                    {week.map((day, j) => {
                                                        const dateString = day.toISOString().split('T')[0];
                                                        const isDateInList = this.state.resultado[nombre].includes(dateString);
                                                        return (
                                                            <td
                                                                key={j}
                                                                className={isDateInList ? 'calendar-highlight' : ''}
                                                            >
                                                                {isDateInList ? '✔' : ''}
                                                            </td>
                                                        );
                                                    })}
                                                </tr>
                                            ))}
                                            <tr>
                                            <td className="recuentoVacio"></td>
                                            <td className="recuentoVacio"></td>
                                            <td className="recuentoVacio"></td>
                                            <td className="recuentoVacio"></td>
                                            <td className="recuentoVacio"></td>
                                            <td className="recuentoVacio"></td>
                                            <td className="recuentoVacio"></td>
                                            <td className="recuentoVacio"></td>
                                            </tr>
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>

                        </div> : null
                        }

                    </div>

                    : null}
            </div>
        )
    }
};

