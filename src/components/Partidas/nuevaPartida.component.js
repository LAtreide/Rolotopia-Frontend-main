import React, { Component } from "react";

import AuthService from "../../services/auth.service";
import PartidaService from "../../services/partida.service"
import { Rnd } from "react-rnd";
import "../../css/NuevaPartida.css"

export default class MenuNuevaPartida extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: "",
      showCrearPartida: false,
      nombre: '',
      finicio: new Date().getFullYear() + "-" + (new Date().getMonth() + 1).toString().padStart(2, '0') + "-" + (new Date().getDate().toString().padStart(2, '0')),
      plazas: 0,
      m18: false,
      ritmo: '',
      nivel: '',
      enviado: false,

    };

  }


  handleSubmit = async e => {
    e.preventDefault();
    this.setState({
      enviado: true,

    });

    this.props.onPublicar(
      await PartidaService.creaPartida(
        this.state.nombre,
        this.state.plazas,
        this.state.m18,
        this.state.ritmo,
        this.state.nivel,
        new Date().getFullYear() + "-" + (new Date().getMonth() + 1).toString().padStart(2, '0') + "-" + (new Date().getDate().toString().padStart(2, '0')),
        this.state.finicio,
        AuthService.getCurrentUser().id
      ));
  }




  render() {
    return (
      <div>

        <Rnd className="menuNuevaPartida">
          
          <form onSubmit={this.handleSubmit}>
            <p></p>
            <h2>Título de la partida:</h2>
            <textarea
  value={this.state.nombre}
  onChange={e => this.setState({ nombre: e.target.value })}
/>

            <p></p>
            <span><strong>Fecha inicio:</strong> </span>
            <input
              type="date"
              value={this.state.finicio}
              onChange={e => this.setState({ finicio: e.target.value })}
            />

            <p></p>
            <span><strong>Plazas: </strong></span>
            <input
              type="number"
              value={this.state.plazas}
              onChange={e => e.target.value >= 0 ? this.setState({ plazas: e.target.value }): null}
            />

            <p></p>
            <span><strong>Ritmo: </strong></span>
            <select value={this.state.ritmo} onChange={e => this.setState({ ritmo: e.target.value })}>
              <option value="Lento">Lento</option>
              <option value="Medio">Medio</option>
              <option value="Rápido">Rápido</option>
              <option value="Frenético">Frenético</option>
            </select>

            <p></p>
            <span><strong>Nivel: </strong></span>
            <select value={this.state.nivel} onChange={e => this.setState({ nivel: e.target.value })}>
              <option value="Novato">Novato</option>
              <option value="Intermedio">Intermedio</option>
              <option value="Experto">Experto</option>
            </select>

            <p></p>
            <input
              type="checkbox"
              checked={this.state.m18}
              onChange={e => this.setState({ m18: e.target.checked })}
            />
            <span style={{ marginLeft: "3px" }}><strong>Solo apta para +18 </strong></span>

            <p></p>
            <button type="submit">Crear partida</button>
            <button onClick={this.props.onClose}> Cancelar</button>
          </form>




        </Rnd>
      </div>


    );
  }
}