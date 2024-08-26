import React, { Component } from 'react';
import authService from '../../services/auth.service';
import blogService from '../../services/blog.service';
import PortadaBlog from './PortadaBlog';
import { SPACE_URL } from '../../constantes';
import NuevaEntrada from "./Entrada/NuevaEntrada"
import entradaService from '../../services/entrada.service';
import "../../css/Blog.css"
import PrevisualizarEntrada from './Entrada/PrevisualizarEntrada';
import Entrada from './Entrada';
import confirm from "../Utilidad/Confirmacion"

export default class Blog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      existe: false,
      blog: {},
      nuevaEntrada: false,
      listaEntradas: [],
      reaction: null,
      entrada: this.props.entrada,
      listaEntradasEditar: [],
    };
  }




  async componentDidMount() {
    this.setState({
      blog: await blogService.infoBlogEnlace(this.props.blog),
    })

    this.setState({
      listaEntradas: await entradaService.listaEntradas(this.state.blog.idUsuario, authService.getCurrentUser().id)
    })

  }

  addEntrada(entrada) {
    let a = this.state.listaEntradas;
    a.push(entrada);
    this.setState({ listaEntradas: a, nuevaEntrada: false })

  }

  handlePortada() {
    this.setState({ entrada: null })
    window.history.pushState({ entrada: this.state.entrada }, "New Page Title", "/blog/" + this.props.blog)
  }
  handleEntrada = async (entrada) => {
    await this.setState({ entrada: entrada })
    window.history.pushState({ entrada: this.state.entrada }, "New Page Title", "/blog/" + this.props.blog + "/entrada/" + entrada)
  }

  editarEntrada(id) {
    let a = this.state.listaEntradasEditar;
    a.push(id);
    this.setState({ listaEntradasEditar: a })
  }

  cancelarEditarEntrada(id) {
    let a = this.state.listaEntradasEditar;
    a.splice(a.indexOf(id), 1);
    this.setState({ listaEntradasEditar: a })
  }

  editEntrada(index, entrada) {
    let a=this.state.listaEntradas;
    a[index]=entrada;
    this.setState({listaEntradas: a})
    entradaService.editarEntrada(entrada);

  }

  eliminarEntrada = async (index) => {
    if (await confirm('¿Estás seguro de que quieres borrar esta entrada?')) {
      entradaService.borrarEntrada(this.state.listaEntradas[index].id);
      let a=this.state.listaEntradas;
      a.splice(index,1);
      this.setState({listaEntradas: a})

    }

  }


  render() {
    return (
      <div>

        {this.state.blog.idUsuario !== 0 ?
          <div className="container">

            <h1 className="blog-title" onClick={() => { this.handlePortada() }}>{this.state.blog.titulo}</h1>
            {!this.state.entrada ?
              <div key={this.state.entrada}>
                <PortadaBlog src={SPACE_URL + "/portadaBlog/" + this.state.blog.portada} key={this.state.blog.portada} />
                {authService.getCurrentUser().id === this.state.blog.idUsuario &&
                  <button
                    style={{
                      backgroundColor: "#4CAF50",
                      color: "white",
                      padding: "10px 20px",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "16px",

                    }}
                    onClick={() => this.setState({ nuevaEntrada: true })}
                  >
                    Crear nueva entrada
                  </button>
                }

                {this.state.nuevaEntrada && <NuevaEntrada idBblog={this.state.blog.idUsuario} cancelar={() => this.setState({ nuevaEntrada: false })} onPublicado={(entrada) => this.addEntrada(entrada)} />}
                {this.state.listaEntradas.map((i, index) => {
                  return (
                    this.state.listaEntradasEditar.includes(i.id) ?

                      <NuevaEntrada
                        key={i.id}
                        idBblog={this.state.blog.idUsuario}
                        cancelar={() => this.cancelarEditarEntrada(i.id)}
                        onPublicado={(entrada) => { this.cancelarEditarEntrada(i.id); this.editEntrada(index, entrada) }}
                        titulo={i.titulo}
                        etiquetas={i.etiquetas}
                        texto={i.texto}
                        borrador={i.borrador}
                        idEntrada={i.id}
                      />

                      :
                      <PrevisualizarEntrada
                        entrada={i}
                        key={i.id}
                        handleEntrada={(entrada) => this.handleEntrada(entrada)}
                        onEditar={() => { this.editarEntrada(i.id) }}
                        onBorrar={()=> this.eliminarEntrada(index)}

                      />

                  );
                })}


              </div>
              :
              <div>
                <Entrada enlace={this.state.entrada} />
              </div>
            }
          </div>

          : <div>
            <p>Ese blog no existe</p>


          </div>}

      </div>
    )

  }
}