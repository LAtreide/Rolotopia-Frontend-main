import React from 'react';
import incidenciaService from '../../../services/incidencia.service';
import authService from '../../../services/auth.service';
import Incidencia from '../Incidencia';
import IncidenciaNueva from "../IncidenciaNueva"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from '@fortawesome/free-solid-svg-icons';

export default class IncidenciasGeneral extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      listaSecciones: [],
      listaIncidencias: [],
      carga: 0,
      menuNuevaIncidencia: false,
      seccion: "",
      incidencia: 0,
      abiertasSecciones: [],
      noAtendidasSecciones: []

    };
  }

  async componentDidMount() {

    this.setState({
      listaIncidencias: await incidenciaService.listaIncidenciasUsuario(authService.getCurrentUser().id),

    })


    this.setState({ carga: 1 })

  }


  async enviarIncidencia(incidencia) {

    this.setState({
      menuNuevaIncidencia: false
    });
    let b = this.state.listaIncidencias;
    b.push(incidencia);
    this.setState({ listaIncidencias: b })
  }

  onIncidencia(idIncidencia) {

    this.setState({ incidencia: idIncidencia })
  }

  general() {
    this.setState({
      incidencia: 0
    })

    this.componentDidMount();
  }

  render() {
    return (

      <div className="container mt-3">
        <h1 onClick={() => this.general()}>Incidencias</h1>
        {this.state.carga === 1 && this.state.incidencia === 0 &&

          <div>
            <button onClick={() => this.setState({ menuNuevaIncidencia: true })}>Nueva Incidencia</button>
            {this.state.menuNuevaIncidencia &&
              <IncidenciaNueva enviarIncidencia={(a) => this.enviarIncidencia(a)} cerrar={() => this.setState({ menuNuevaIncidencia: false })} />
            }

            <h2>Mis incidencias</h2>

            <ul>
              {this.state.listaIncidencias.length === 0 &&
                <p>No has abierto incidencias</p>}

              {this.state.listaIncidencias.length > 0 && this.state.listaIncidencias.map(i =>
                <div key={i.id}>

                  <li style={{ backgroundColor: i.staff ? 'grey' : 'white' }}>
                    <p onClick={() => this.onIncidencia(i.id)}  > {i.cerrada === 1 ? <FontAwesomeIcon icon={faLock}></FontAwesomeIcon> : null}{i.titulo}</p>

                  </li>

                </div>
              )
              }

            </ul>


          </div>
        }

        {this.state.incidencia !== 0 &&
          <Incidencia incidencia={this.state.incidencia} general={() => this.general()} />}

      </div>

    );
  }

}







