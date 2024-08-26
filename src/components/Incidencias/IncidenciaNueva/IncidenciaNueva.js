import React from 'react';
import { Rnd } from 'react-rnd';
import authService from '../../../services/auth.service';
import EditorTextoCompleto from "../../EditorTexto/editorTextoCompleto"
import incidenciaService from '../../../services/incidencia.service';



export default class IncidenciaNueva extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

      carga: 0,
      titulo: "",
      seccion: 0,
      subseccion: 0,
      descripcion: "",
      secciones: ["Incidencias técnicas", "Arbitraje entre usuarios", "Partidas", "Otros"],
      subsecciones: [["Dados", "Web"], ["Disputas", "Otros"], ["Director desaparecido"], ["Otros"]]
    };


  }


  async componentDidMount() {

    this.setState({ carga: 1 })


  }




  handleSubmit = async e => {
    e.preventDefault();
    this.setState({
      titulo: "",
    });
    let a= await incidenciaService.crearIncidencia(
      authService.getCurrentUser().id,
      this.state.secciones[this.state.seccion],
      this.state.subsecciones[this.state.seccion][this.state.subseccion],
      this.state.titulo,
      this.state.descripcion)
      this.props.enviarIncidencia(a);
  }


  render() {
    return (

      <div>

        <Rnd
          disableDragging
          enableResizing={{
            bottom: false
          }}
          style={{ boxSizing: 'border-box', border: '1px solid blue', backgroundColor: 'white', paddingRight: '10px', paddingLeft: '10px' }}>
          <form onSubmit={this.handleSubmit}>

            <span>Sección: </span>
            <select id="seccion" value={this.state.seccion} onChange={e => this.setState({ seccion: e.target.value, subseccion: 0 })}>
              {this.state.secciones.map((i, index) =>
                <option value={index} key={i}>{this.state.secciones[index]}</option>
              )}

            </select>

            <span>Subsección: </span>
            <select id="subseccion" value={this.state.subseccion} onChange={e => this.setState({ subseccion: e.target.value })}>

              {this.state.subsecciones[this.state.seccion].map((i, index) =>
                <option value={this.state.subsecciones[this.state.seccion][index]} key={i}>{this.state.subsecciones[this.state.seccion][index]}</option>
              )}

            </select>

            <p>Titulo: </p>
            <input
              type="text"
              value={this.state.titulo}
              onChange={e => this.setState({ titulo: e.target.value })}
            />


            <p></p>
            <div style={{ width: '700px', textAlign: 'left', color: 'black' }}>

              <EditorTextoCompleto texto={this.state.descripcion} onCambio={(descripcion) => this.setState({ descripcion: descripcion })} />

              <div style={{ display: "inline-flex", width: '700px', justifyContent: "space-between", marginBottom: '5px' }}>
              </div>
            </div>
            {this.state.titulo !== "" && this.state.descripcion !== "" ?
              <button type="submit">Enviar incidencia</button> :
              <button onClick={(e) => e.preventDefault()} style={{ opacity: '50%', cursor: 'not-allowed' }}>Enviar incidencia</button>
            }
          </form>

          <button onClick={() => { this.props.cerrar() }}> Cancelar</button>

        </Rnd>


      </div>
    )
  }
}

