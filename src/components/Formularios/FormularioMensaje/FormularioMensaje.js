import React from 'react';
import formularioService from '../../../services/formulario.service';
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { faCrosshairs } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default class IncidenciaMensaje extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      atendida: this.props.formulario.atendida,
    };


  }

  async atenderFormulario(e) {
    e.preventDefault();
    await this.setState({ atendida: this.state.atendida === 1 ? 0 : 1 })
    formularioService.atenderFormulario(this.props.formulario.id, this.state.atendida)
    this.props.atender()
  }

  render() {
    return (

      <div style={{ border: '1px solid black' }}>
        <button onClick={(e) => this.atenderFormulario(e)} style={{}}>{this.state.atendida ? "Marcar como no atendida" : "Marcar como atendida"}</button>
        {this.state.atendida ?  
        <p>
          <FontAwesomeIcon icon={faCheck} className="formularioAtendido"/>Atendido</p>
          : 
          <p><FontAwesomeIcon icon={faCrosshairs} className="formularioNoAtendido"/>No atendido</p>}
        <p>Nombre: {this.props.formulario.nombre}</p>
        <p>Contacto: {this.props.formulario.email}</p>
        <p>Consulta: {this.props.formulario.consulta}</p>



      </div>
    )
  }
}

