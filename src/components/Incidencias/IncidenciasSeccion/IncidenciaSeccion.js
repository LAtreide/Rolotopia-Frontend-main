import React from 'react';
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { faLockOpen } from "@fortawesome/free-solid-svg-icons";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { faCrosshairs } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import authService from '../../../services/auth.service';
import incidenciaService from '../../../services/incidencia.service';



export default class IncidenciaSeccion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listaIncidencias: [],
      listaSubsecciones: [],
      incidencia: 0,
      carga: 0,
      subseccion: "",
      abiertasSubsecciones: [],
      noAtendidasSubsecciones: []
    };


  }


  general() {
    this.props.general()
  }

  async componentDidMount() {

    this.setState({ listaSubsecciones: await incidenciaService.listaSubsecciones(authService.getCurrentUser().id, this.props.seccion) })
    let a = [];
    for (let i = 0; i < this.state.listaSubsecciones.length; i++) {
      a[i] = await this.getSubseccionAbiertas(this.state.listaSubsecciones[i]);
    }
    this.setState({ abiertasSubsecciones: a })
    let b = [];
    for (let i = 0; i < this.state.listaSubsecciones.length; i++) {
      b[i] = await this.getSubseccionNoAtendidas(this.state.listaSubsecciones[i]);
    }
    this.setState({ noAtendidasSubsecciones: b })

    this.setState({ carga: 1 })
  }

  async onSubseccion(i) {
    if (this.state.subseccion === i) {
      this.setState({
        subseccion: "",
        listaIncidencias: []
      })

    }
    else {
      this.setState({ subseccion: "" })
      this.setState({ listaIncidencias: await incidenciaService.listaIncidenciasSeccion(authService.getCurrentUser().id, i) })
      this.setState({ subseccion: i })
    }
  }

  onIncidencia(idIncidencia) {
    this.props.onIncidencia(idIncidencia)
  }



  async getSubseccionAbiertas(i) {
    return await incidenciaService.getSubseccionAbiertas(i);
  }

  async getSubseccionNoAtendidas(i) {
    return await incidenciaService.getSubseccionNoAtendidas(i);
  }



  render() {
    return (

      <div>
        <h2 onClick={() => this.setState({ incidencia: 0, subseccion: "" })}>{this.props.seccion}</h2>

        
        {this.state.carga === 1 && <div>

          {this.state.listaSubsecciones.map((i, index) =>

            <div key={i}>
              <p onClick={() => this.onSubseccion(i)}>
                {i}  {this.state.abiertasSubsecciones[index]}<FontAwesomeIcon icon={faLockOpen}></FontAwesomeIcon> {this.state.noAtendidasSubsecciones[index]}<FontAwesomeIcon icon={faCrosshairs}></FontAwesomeIcon>
              </p>

              {this.state.subseccion === i ?
                <ul>
                  {this.state.listaIncidencias.map(j =>

                    <li key={j.id}>
                      <p></p>
                      <p onClick={() => this.onIncidencia(j.id)}>
                        {j.cerrada === 1 ? <FontAwesomeIcon icon={faLock}></FontAwesomeIcon> : null}
                        {j.atendida === 1 ? <FontAwesomeIcon icon={faCheck} style={{color: "green"}}></FontAwesomeIcon> : <FontAwesomeIcon icon={faCrosshairs} style={{color: "red"}}></FontAwesomeIcon> }
                        {j.titulo} 
                      </p>


                    </li>)
                  }

                </ul> : null
              }

            </div>)

          }
        </div>}

        <p onClick={() => { this.general() }}>Volver</p>

      </div>
    )
  }
}

