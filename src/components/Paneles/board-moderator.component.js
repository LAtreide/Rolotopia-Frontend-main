import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import UserService from "../../services/user.service";

import Tareas from "../Tareas";
import EditorSistemas from "../Sistemas/EditorSistemas.component";
import NuevoSistema from "../Sistemas/NuevoSistema.component";
import Importador from "../Importador/Importador";
import IncidenciasAdministracion from "../Incidencias/IncidenciasAdministracion";
import FormularioGeneral from "../Formularios/FormulariosGeneral"

export default class BoardAdmin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: "",
      editarTareas: false,
      editarSistemas: false,
      showImportador: false,
      showIncidencias: false,
      showFormularios: false,
    };
  }

  componentDidMount() {
    UserService.getAdminBoard().then(
      response => {
        this.setState({
          content: response.data
        });
      },
      error => {
        this.setState({
          content:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString()
        });
      }
    );
  }

  render() {
    return (
      <div>
        <div className="container">
          <header className="jumbotron">
            <h3>{this.state.content}</h3>
            {this.state.editarTareas === true ?
              <div>


                <Tareas />

                <label style={{ width: "150px", border: "1px solid grey", cursor: "pointer", backgroundColor: "black", color: "white", textAlign: "center" }} onClick={() => this.setState({ editarTareas: false })}>
                  <p>Cerrar Tareas</p>

                </label>
              </div>
              :
              <label style={{ width: "150px", border: "1px solid grey", cursor: "pointer", backgroundColor: "black", color: "white", textAlign: "center" }} onClick={() => this.setState({ editarTareas: true })}>
                <p>Editar Tareas</p>

              </label>
            }

            {this.state.editarSistemas === true ?
              <div>



                <NuevoSistema />
                <EditorSistemas />

                <label style={{ width: "150px", border: "1px solid grey", cursor: "pointer", backgroundColor: "black", color: "white", textAlign: "center" }} onClick={() => this.setState({ editarSistemas: false })}>
                  <p>Cerrar Sistemas</p>

                </label>
              </div>
              :
              <label style={{ width: "150px", border: "1px solid grey", cursor: "pointer", backgroundColor: "black", color: "white", textAlign: "center" }} onClick={() => this.setState({ editarSistemas: true })}>
                <p>Editar Sistemas</p>

              </label>
            }


            {this.state.showImportador === true ?
              <div>

                <Importador />

                <label style={{ width: "150px", border: "1px solid grey", cursor: "pointer", backgroundColor: "black", color: "white", textAlign: "center" }} onClick={() => this.setState({ showImportador: false })}>
                  <p>Cerrar Importador</p>

                </label>
              </div>
              :
              <label style={{ width: "150px", border: "1px solid grey", cursor: "pointer", backgroundColor: "black", color: "white", textAlign: "center" }} onClick={() => this.setState({ showImportador: true })}>
                <p>Importar Partida</p>

              </label>
            }

            {this.state.showIncidencias === true ?
              <div>

                <IncidenciasAdministracion />

                <label style={{ width: "150px", border: "1px solid grey", cursor: "pointer", backgroundColor: "black", color: "white", textAlign: "center" }} onClick={() => this.setState({ showIncidencias: false })}>
                  <p>Cerrar Incidencias</p>

                </label>
              </div>
              :
              <label style={{ width: "150px", border: "1px solid grey", cursor: "pointer", backgroundColor: "black", color: "white", textAlign: "center" }} onClick={() => this.setState({ showIncidencias: true })}>
                <p>Ver Incidencias</p>

              </label>
            }


            {this.state.showFormularios === true ?
              <div>

                <FormularioGeneral />

                <label style={{ width: "150px", border: "1px solid grey", cursor: "pointer", backgroundColor: "black", color: "white", textAlign: "center" }} onClick={() => this.setState({ showFormularios: false })}>
                  <p>Cerrar Formularios</p>

                </label>
              </div>
              :
              <label style={{ width: "150px", border: "1px solid grey", cursor: "pointer", backgroundColor: "black", color: "white", textAlign: "center" }} onClick={() => this.setState({ showFormularios: true })}>
                <p>Ver formularios</p>

              </label>
            }

          </header>









        </div>
      </div>

    );
  }
}
