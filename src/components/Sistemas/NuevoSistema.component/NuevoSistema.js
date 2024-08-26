import React, { Component } from "react";
import SistemaService from "../../../services/sistema.service";

export default class NuevoSistema extends Component {
    constructor(props) {
        super(props);

        this.state = {
            nombre: "",
            enviado: false,
            mensaje: "",


        };

    }


    handleSubmit = async event => {
        event.preventDefault();


        if (this.state.lista.some(element => element.nombre === this.state.nombre)) {
            this.setState({ mensaje: "Ya existe un sistema con ese nombre" });
        }
        else {

            SistemaService.addSistema(this.state.nombre);
            this.setState({
                mensaje: "Sistema añadido a la base de datos.",
                enviado: true,
                nombre: "",
                addSistema: false,
            });
        }

    }




    componentDidMount = async e => {

        this.setState({ lista: await SistemaService.lista() });
        

    };

    render() {
        return (
            <div>

                <button onClick={e => this.setState({ addSistema: true })}> Añadir nuevo sistema</button>
                {this.state.addSistema ?
                    <div>
                        <form onSubmit={this.handleSubmit}>
                            <p>Nombre: </p>
                            <input
                                type="text"
                                value={this.state.nombre}
                                onChange={e => this.setState({ nombre: e.target.value })}
                            />
                            <p></p>
                            <input type="submit" value="Guardar" />
                        </form>

                        <button onClick={e => this.setState({ addSistema: false })}> Cancelar</button>
                    </div>
                    : null}
            </div>


        );
    }
}

