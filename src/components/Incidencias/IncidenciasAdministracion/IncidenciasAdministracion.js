import React from 'react';
import incidenciaService from '../../../services/incidencia.service';
import authService from '../../../services/auth.service';
import IncidenciasSeccion from '../IncidenciasSeccion';
import Incidencia from '../Incidencia';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLockOpen } from '@fortawesome/free-solid-svg-icons';
import { faCrosshairs } from "@fortawesome/free-solid-svg-icons";

export default class IncidenciasAdministracion extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      listaSecciones: [],
      carga: 0,
      menuNuevaIncidencia: false,
      seccion: "",
      incidencia: 0,
      abiertasSecciones: [],
      noAtendidasSecciones: []

    };
  }

  async componentDidMount() {

    if (authService.getCurrentUser().roles.includes("ROLE_MODERATOR") || authService.getCurrentUser().roles.includes("ROLE_ADMIN")) {
      this.setState({
        listaSecciones: await incidenciaService.listaSecciones(authService.getCurrentUser().id),
      })
      let a = [];
      for (let i = 0; i < this.state.listaSecciones.length; i++) {
        a[i] = await this.getSeccionAbiertas(this.state.listaSecciones[i]);
      }
      this.setState({ abiertasSecciones: a })
      let b = [];
      for (let i = 0; i < this.state.listaSecciones.length; i++) {
        b[i] = await this.getSeccionNoAtendidas(this.state.listaSecciones[i]);
      }
      this.setState({ noAtendidasSecciones: b })

    }
   

    this.setState({ carga: 1 })

  }


  onSeccion(idSeccion) {
    this.setState({ seccion: idSeccion })
  }

  onIncidencia(idIncidencia) {

    this.setState({ incidencia: idIncidencia })
  }

  general() {
    this.setState({
      seccion: "",
      subseccion: "",
      incidencia: 0
    })

    this.componentDidMount();
  }

  async getSeccionAbiertas(i) {
    return await incidenciaService.getSeccionAbiertas(i);
  }

  async getSeccionNoAtendidas(i) {
    return await incidenciaService.getSeccionNoAtendidas(i);
  }

  render() {
    return (

      <div style={{border:"1px solid black"}}>
        <h1 onClick={() => this.general()}>Incidencias</h1>
        {this.state.carga === 1 && !this.state.seccion && this.state.incidencia === 0 &&

          <div>



            <h2>Secciones</h2>


            <ul>
              {this.state.listaSecciones.map((i, index) =>
                <div key={i}>

                  <li style={{ backgroundColor: i.pendiente ? 'grey' : 'white' }}>
                    <p onClick={() => this.onSeccion(i)}>{i} {this.state.abiertasSecciones[index]}<FontAwesomeIcon icon={faLockOpen}></FontAwesomeIcon> {this.state.noAtendidasSecciones[index]}<FontAwesomeIcon icon={faCrosshairs}></FontAwesomeIcon> </p>


                  </li>
                </div>
              )
              }

            </ul>

          </div>
        }

        {this.state.seccion !== "" && this.state.incidencia === 0 &&
          <IncidenciasSeccion seccion={this.state.seccion} general={() => this.general()} onIncidencia={(id) => this.onIncidencia(id)} />}

        {this.state.incidencia !== 0 &&
          <Incidencia incidencia={this.state.incidencia} general={() => this.general()} />}

      </div>

    );
  }

}







