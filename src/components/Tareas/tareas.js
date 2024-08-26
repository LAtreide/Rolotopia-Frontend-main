import React, { Component } from "react";
import tareaService from "../../services/tarea.service";
import Numeroeditable from "../Utilidad/Numero editable";
import ReactHtmlParser from 'react-html-parser';
import EditorTextoCompleto from "../EditorTexto/editorTextoCompleto";
import authService from "../../services/auth.service";


export default class Tareas extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tareas: null,
      secciones: null,
      carga: 0,
      nuevaTarea: false,
      tipo: "",
      nombre: "",
      descripcion: "",
      porcentaje: null,
      estado: "Prioritario",
      filtro: "Prioritario",
    };
  }


  async componentDidMount() {
    await this.setState({
      tareas: await tareaService.listaTareas()
    })


    this.setState({
      carga: 1,
      secciones: Object.keys(this.state.tareas)
    })


    }
  
  

  async eliminarTarea(i, index) {
    await tareaService.eliminarTarea(this.state.tareas[i][index].id);
    let a = this.state.tareas[i];
    a.splice(index, 1);
    let b = this.state.tareas;
    b[i] = a;
    this.setState({ tareas: b })

  }

  handleSubmit = async e => {
    e.preventDefault();
    let v_id = await tareaService.nuevaTarea(
      this.state.tipo,
      this.state.nombre,
      this.state.descripcion,
      this.state.estado,
      this.state.porcentaje,
      authService.getCurrentUser().username
    )


    var a = {
      id: v_id,
      tipo: this.state.tipo,
      nombre: this.state.nombre,
      descripcion: this.state.descripcion,
      estado: this.state.estado,
      porcentaje: this.state.porcentaje,
    }
    let b = this.state.tareas[a.tipo] ? this.state.tareas[a.tipo] : [];
    b.push(a);
    let c = this.state.tareas;
    c[a.tipo] = b;

    await this.setState({ tareas: c })

    this.setState({
      tipo: "",
      nombre: "",
      descripcion: "",
      estado: "",
      porcentaje: null,
      nuevaTarea: false,
      secciones: Object.keys(this.state.tareas)
    })


  }

  cambioNombre(i, index, nombre) {
    let a = this.state.tareas[i];
    a[index].nombre = nombre;
    let b = this.state.tareas;
    b[i] = a;
    this.setState({ tareas: b })
    tareaService.editarTarea(this.state.tareas[i][index]);
  }

  cambioEstado(i, index, estado) {
    let a = this.state.tareas[i];
    a[index].estado = estado;
    let b = this.state.tareas;
    b[i] = a;
    this.setState({ tareas: b })
    tareaService.editarTarea(this.state.tareas[i][index]);
  }

  cambioDescripcion(i, index, descripcion) {
    let a = this.state.tareas[i];
    a[index].descripcion = descripcion;
    let b = this.state.tareas;
    b[i] = a;
    this.setState({ tareas: b })
    tareaService.editarTarea(this.state.tareas[i][index]);
  }
  cambioPorcentaje(i, index, porcentaje) {
    let a = this.state.tareas[i];
    a[index].porcentaje = porcentaje;
    let b = this.state.tareas;
    b[i] = a;
    this.setState({ tareas: b })
    tareaService.editarTarea(this.state.tareas[i][index]);
  }



  render() {
    return (
      <div>
        <ul>
          {this.state.carga === 1 ?
            <div>


              <select value={this.state.filtro} onChange={(e) => this.setState({ filtro: e.target.value })}>

                <option value="Prioritario" key="Prioritario">Prioritario</option>
                <option value="Aplazado" key="Aplazado">Aplazado</option>
                <option value="A valorar" key="A valorar">A valorar</option>
                <option value="En proceso" key="En proceso">En proceso</option>
                <option value="Finalizado - Nuevo" key="Nuev">Finalizado - Nuevo</option>
                <option value="Finalizado" key="Finalizado">Finalizado</option>
                <option value="" key="Sin establecer">Sin establecer</option>

              </select>

              {this.state.secciones.map(i =>
                this.state.tareas[i].length > 0 &&
                <li key={i}>
                  <h2>{i}</h2>
                  <ul>
                    {
                      this.state.tareas[i].map((j, index) =>
                        <div>
                          {j.estado === this.state.filtro &&

                            <li key={j.id} style={{ display: "flex" }}>

                              <Tarea tarea={j} seccion={i} index={index}
                                cambioNombre={(a, b, c) => this.cambioNombre(a, b, c)}
                                cambioDescripcion={(a, b, c) => this.cambioDescripcion(a, b, c)}
                                cambioEstado={(a, b, c) => this.cambioEstado(a, b, c)}
                                cambioPorcentaje={(a, b, c) => this.cambioPorcentaje(a, b, c)}
                                eliminarTarea={(a, b) => this.eliminarTarea(a, b)}
                              />
                            </li>
                          }
                        </div>
                      )
                    }
                  </ul>

                </li>)}

            </div>

            :
            null}
        </ul>

        {this.state.nuevaTarea === true ?
          <div>
            <form onSubmit={this.handleSubmit}>
              <span>Tipo</span>
              <input
                type="text"
                value={this.state.tipo}
                onChange={e => this.setState({ tipo: e.target.value })}
              />
              <p></p>
              <span>Nombre</span>
              <input
                type="text"
                value={this.state.nombre}
                onChange={e => this.setState({ nombre: e.target.value })}
              />
              <p></p>
              <span>Descripción</span>
              <EditorTextoCompleto texto={this.state.descripcion} onCambio={(texto) => this.setState({ descripcion: texto })} />



              <select value={this.state.estado} onChange={(e) => this.setState({ estado: e.target.value })}>

                <option value="Prioritario" key="Prioritario">Prioritario</option>
                <option value="Aplazado" key="Aplazado">Aplazado</option>
                <option value="A valorar" key="A valorar">A valorar</option>
                <option value="En proceso" key="En proceso">En proceso</option>
                <option value="Finalizado - Nuevo" key="Nuev">Finalizado - Nuevo</option>
                <option value="Finalizado" key="Finalizado">Finalizado</option>

              </select>

              <p></p>
              <span>Porcentaje</span>
              <input
                type="number"
                checked={this.state.porcentaje}
                onChange={e => this.setState({ porcentaje: e.target.value })}
              />

              <p></p>
              <button type="submit">Enviar</button>
            </form>
            <button onClick={() => this.setState({ nuevaTarea: false })}>Cancelar nueva tarea</button>
          </div>
          :
          <button onClick={() => this.setState({ nuevaTarea: true })}>Nueva tarea</button>

        }
      </div>
    );
  }
}



class Tarea extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editarNombre: false,
      nombre: this.props.tarea.nombre,
      editarDescripcion: false,
      descripcion: this.props.tarea.descripcion,
      editarEstado: false,
      estado: this.props.tarea.estado,


    };
  }


  cambioNombre() {
    this.props.cambioNombre(this.props.seccion, this.props.index, this.state.nombre)
    this.setState({ editarNombre: false })

  }

  changeDescripcion(texto) {
    this.setState({ descripcion: texto })
    
  }

  cambioDescripcion() {
    
    this.props.cambioDescripcion(this.props.seccion, this.props.index, this.state.descripcion)
    this.setState({ editarDescripcion: false })

  }

  cambioEstado() {
    this.props.cambioEstado(this.props.seccion, this.props.index, this.state.estado)
    this.setState({ editarEstado: false })

  }

  render() {
    return (
      <div style={{ border: "1px solid black", width: "100%" }}>
        <div style={{ width: "100%", textAlign: "right" }}>
          <button style={{ marginLeft: "5px", height: "1.6em" }} onClick={() => this.props.eliminarTarea(this.props.seccion, this.props.index)}> <span style={{ padding: 10 }}>X</span> </button>
        </div>
        {this.state.editarNombre ?
          <div>
            <input
              style={{ maxWidth: "80%" }}
              type="text"
              value={this.state.nombre}
              onChange={e => this.setState({ nombre: e.target.value })}
            />
            <button onClick={() => this.cambioNombre()}>Guardar</button>
          </div>
          :
          <div>
            <h4 style={{ fontSize: "1.4em" }} onClick={() => this.setState({ editarNombre: !this.state.editarNombre })}>{this.state.nombre}</h4>
          </div>
        }
        <p>Autor: {this.props.tarea.autor}</p>
        <p>Fecha: {this.props.tarea.fecha}</p>
        {this.state.editarDescripcion ?
          <div>

            <EditorTextoCompleto texto={this.state.descripcion} onCambio={(texto) => this.changeDescripcion(texto)} />


            <button onClick={() => this.cambioDescripcion()}>Guardar</button>
          </div>
          :
          <div onClick={() => this.setState({ editarDescripcion: !this.state.editarDescripcion })} >
            {ReactHtmlParser(this.state.descripcion)}

          </div>
        }

        {this.state.editarEstado ?
          <div>
            <select value={this.state.estado} onChange={(e) => this.setState({ estado: e.target.value })}>

              <option value="Prioritario" key="Prioritario">Prioritario</option>
              <option value="Aplazado" key="Aplazado">Aplazado</option>
              <option value="A valorar" key="A valorar">A valorar</option>
              <option value="En proceso" key="En proceso">En proceso</option>
              <option value="Finalizado - Nuevo" key="Nuev">Finalizado - Nuevo</option>
              <option value="Finalizado" key="Finalizado">Finalizado</option>
              <option value="" key="Sin establecer">Sin establecer</option>

            </select>
            <button onClick={() => this.cambioEstado()}>Guardar</button>
          </div>
          :
          <div>
            <span onClick={() => this.setState({ editarEstado: !this.state.editarEstado })}>Estado: {this.state.estado}</span>
          </div>
        }


        {this.props.tarea.porcentaje ?
          <div style={{ minWidth: "30%", border: "1px solid black", marginBottom: "0px", height: "1.6em" }}>
            <div style={{ width: this.props.tarea.porcentaje + "%", background: this.props.tarea.porcentaje < 20 ? "red" : this.props.tarea.porcentaje < 50 ? "orange" : "green", marginBottom: "0px" }}>
              <div style={{ marginBottom: "0px", color: "white" }}><Numeroeditable valor={this.props.tarea.porcentaje} onCambio={(v) => this.props.cambioPorcentaje(this.props.seccion, this.props.index, v)} /></div>

            </div>
          </div>
          :
          null}

      </div>
    )
  }
}