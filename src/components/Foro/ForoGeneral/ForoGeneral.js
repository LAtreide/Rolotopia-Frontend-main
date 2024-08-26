import React from 'react';
import { Rnd } from 'react-rnd';
import foroService from '../../../services/foro.service';
import authService from '../../../services/auth.service';
import ForoSeccion from '../ForoSeccion';
import ForoHilo from '../ForoHilo';
import "../../../css/Foro.css"
import "../../../css/Boton.css"

export default class ForoGeneral extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      listaSecciones: [],
      carga: 0,
      menuNuevaSeccion: false,
      titulo: "",
      descripcion: "",
      staff: false,
      seccion: this.props.seccion,
      hilo: this.props.hilo
    };
  }

  async componentDidMount() {
    this.setState({ listaSecciones: await foroService.listaSecciones(authService.getCurrentUser().id) })
    this.setState({ carga: 1 })
  }

  handleSubmit = async e => {
    e.preventDefault();
    this.setState({
      menuNuevaSeccion: false,
      titulo: "",
      descripcion: "",
      staff: false
    });
    let a = await foroService.crearSeccion(this.state.titulo, this.state.descripcion, this.state.staff ? 1 : 0)
    let b = this.state.listaSecciones;
    b.push(a);
    this.setState({ listaSecciones: b })
  }

  general() {
    window.history.replaceState(null, "New Page Title", "/foros")
    this.setState({
      seccion: null,
      hilo: null
    })
  }

  async onSeccion(enlace) {
    await this.setState({
      seccion: enlace,
      hilo: null
    })
    window.history.replaceState(null, "New Page Title", "/foro/" + enlace)
  }

  async onHilo(enlace) {
    await this.setState({ hilo: enlace })
    window.history.replaceState(null, "New Page Title", "/foro/" + this.state.seccion + "/hilo/" + enlace)
  }

  onEditSeccion(infoSeccion) {
    let a = this.state.listaSecciones;
    for (let i = 0; i < a.length; i++) {
      if (a[i].id === infoSeccion.id) a[i] = infoSeccion;
    }
    this.setState({ listaSecciones: a })
  }

  onEditHilo() {}

  render() {
    return (
      <div className="container mt-3">
        <h1 onClick={() => this.general()}>Foros de Rolotopia</h1>
        {this.state.carga === 1 && !this.state.seccion && (
          <div>
            <h2>Secciones</h2>
            {authService.getCurrentUser().roles.includes("ROLE_MODERATOR") ||
            authService.getCurrentUser().roles.includes("ROLE_ADMIN") ? (
              <div>
                <button onClick={() => this.setState({ menuNuevaSeccion: true })}>Nueva Sección</button>
                {this.state.menuNuevaSeccion && (
                  <Rnd disableDragging enableResizing={{ bottom: false }} className="nuevaSeccion">
                    <form onSubmit={this.handleSubmit}>
                      <p>Titulo: </p>
                      <input
                        type="text"
                        value={this.state.titulo}
                        onChange={e => this.setState({ titulo: e.target.value })}
                      />

                      <p>Descripcion: </p>
                      <input
                        type="text"
                        value={this.state.descripcion}
                        onChange={e => this.setState({ descripcion: e.target.value })}
                      />

                      <p>Solo apta para Staff: </p>
                      <input
                        type="checkbox"
                        checked={this.state.staff}
                        onChange={e => this.setState({ staff: e.target.checked })}
                      />

                      <p></p>

                      {this.state.titulo !== "" ? (
                        <button type="submit">Crear Seccion</button>
                      ) : (
                        <button onClick={(e) => e.preventDefault()} className="botonProhibido">Crear Sección</button>
                      )}

                    </form>

                    <button onClick={() => this.setState({ menuNuevaSeccion: false, titulo: "", descripcion: "", staff: false })}> Cancelar</button>

                  </Rnd>
                )}

              </div>
            ) : null}

            <ul>
              {this.state.listaSecciones.map(i => (
                <div key={i.id}>
                  {i.staff === 0 || authService.getCurrentUser().roles.includes("ROLE_MODERATOR") || authService.getCurrentUser().roles.includes("ROLE_ADMIN") ? (
                    <li className={`seccionForo ${i.staff ? "seccionStaff" : "seccionNoStaff"}`} onClick={() => this.onSeccion(i.enlace)}>
                      <p>{i.titulo}</p>
                    </li>
                  ) : null}
                </div>
              ))}
            </ul>
          </div>
        )}

        {this.state.seccion && !this.state.hilo && (
          <ForoSeccion seccion={this.state.seccion} hilo={this.state.hilo} general={() => this.general()} onHilo={(enlace) => this.onHilo(enlace)} onEditSeccion={(infoSeccion) => this.onEditSeccion(infoSeccion)} />
        )}

        {this.state.seccion && this.state.hilo && (
          <ForoHilo seccion={this.state.seccion} hilo={this.state.hilo} general={() => this.general()} onSeccion={(enlace) => this.onSeccion(enlace)} onHilo={(enlace) => this.onHilo(enlace)} />
        )}

      </div>
    );
  }
}

