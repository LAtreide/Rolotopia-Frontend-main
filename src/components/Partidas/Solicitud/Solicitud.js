import React from 'react';
import EditorTextoCompleto from '../../EditorTexto/editorTextoCompleto';
import ReactHtmlParser from 'react-html-parser';
import { faPenSquare, faTrash, faPlus, faCheck, faBan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import partidaService from '../../../services/partida.service';
import authService from '../../../services/auth.service';
import confirm from '../../Utilidad/Confirmacion';
import Emitter from '../../Utilidad/EventEmitter';

export default class Solicitud extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      formulario: [],
      ver: false,
      noLeidos: 0,
      legibles: 0,
      crear: false,
      leer: false,
      anterior: "0",
    };
  }


  async componentDidMount() {

    this.setState({ formulario: await partidaService.cargarFormulario(this.props.partida) })
    this.setState({ carga: true })

    if (this.props.director) { 
      this.setState({ legibles: await partidaService.formulariosLegiblesPartida(this.props.partida),     
      noLeidos: await partidaService.formulariosNoLeidosPartida(authService.getCurrentUser().id, this.props.partida) }) 
    }
    else {
      await this.setState({ anterior: await partidaService.formularioPrevio(authService.getCurrentUser().id, this.props.partida) })
      if (this.state.anterior === "Entregado") {
        if (!await confirm('Ya has entregado un formulario para esta partida, ¿quieres sobreescribirlo con uno nuevo?')) {
          let a = await partidaService.cargarBorradorFormulario(authService.getCurrentUser().id, this.props.partida);
          this.setState({formulario: JSON.parse(a.form).formulario, respuestas: JSON.parse(a.form).respuestas, anterior: "Recuperado"})
      
        }
      }

      else if (this.state.anterior === "Borrador") {
        if (await confirm('Tienes un borrador de este formulario, ¿quieres recuperarlo?')) {
          let a = await partidaService.cargarBorradorFormulario(authService.getCurrentUser().id, this.props.partida);
          this.setState({formulario: JSON.parse(a.form).formulario, respuestas: JSON.parse(a.form).respuestas, anterior: "Recuperado"})
      
        }
      }
   
    }

    Emitter.on('solicitudLeida2', (data) => {
      console.log(data)
      if (data.dato.idPartida === this.props.partida) this.setState({ noLeidos: data.dato.noLeidas })
  });

  

  }

  componentWillUnmount() {

    Emitter.off('solicitudLeida2', this.handleNotificationReceived);

}

  guardarFormulario() {
    partidaService.guardarFormulario(this.props.partida, JSON.stringify(this.state.formulario))
  }


  async actuNoLeidos(){
    partidaService.formulariosNoLeidosPartida(authService.getCurrentUser().id, this.props.partida) 
  }

  render() {
    return (
      <div className='container'>

        <div className='"jumbotron' style={{ background: "rgba(200,200,200,0.7)", borderRadius: "15px", padding: "10px", margin: "10px" }}>
          {this.props.director &&

            <div>
              <p>Has recibido {this.state.legibles} solicitudes para esta partida.</p>
              <p>Tienes {this.state.noLeidos} solicitudes sin leer.</p>
              {this.state.legibles > 0 && <button onClick={() => this.setState({ leer: true, crear: false })}>Leer solicitudes</button>}
              <button onClick={() => this.setState({ crear: true, leer: false })}>Crear o editar formulario</button>
              <button onClick={() => this.props.volver()}>Volver</button>
            </div>
          }

          {this.props.director && this.state.leer &&
            <LeerSolicitudes partida={this.props.partida} actuNoLeidos={()=>this.actuNoLeidos()}/>

          }

          {((this.props.director && this.state.crear) || !this.props.director) &&
            <div>
              {!this.state.ver && this.props.director ?
                this.state.carga && <Formulario formulario={this.state.formulario} entrega={() => { this.guardarFormulario() }} volver={() => this.props.volver()} ver={() => this.setState({ ver: true })} />
                :
                this.state.carga && this.state.anterior !== "Recuperado" ?
                <MostrarFormulario formulario={this.state.formulario} partida={this.props.partida} volver={() => this.props.director ? this.setState({ ver: false }) : this.props.volver()} />
              : this.state.carga && this.state.anterior === "Recuperado" && 
              <MostrarFormulario formulario={this.state.formulario} key={"Recuperado"} respuestas={this.state.respuestas} partida={this.props.partida} volver={() => this.props.director ? this.setState({ ver: false }) : this.props.volver()} />
              }
            </div>
          }

        </div>
      </div>
    );
  }
}


class Formulario extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tipo: 'Bloque',
      formulario: this.props.formulario,
      carga: true,
    };
    this.addCampo = this.addCampo.bind(this);
    this.nuevoCampo = this.nuevoCampo.bind(this);
    this.actualizarTexto = this.actualizarTexto.bind(this);
    this.agregarOpcion = this.agregarOpcion.bind(this);
    this.moverElemento = this.moverElemento.bind(this); // Método para mover elementos de la lista
  }

  nuevoCampo(tipo) {
    switch (tipo) {
      case "Bloque":
        return ["Bloque", "Texto"];
      case "Texto":
        return ["Texto", "Pregunta"];
      case "Checkbox":
        return ["Checkbox", "Pregunta", []];
      case "Radiobutton":
        return ["Radiobutton", "Pregunta", []];
      default:
        return "";
    }
  }

  addCampo() {
    let a = this.state.formulario;
    a.push(this.nuevoCampo(this.state.tipo))
    this.setState({ formulario: a });
    this.props.entrega(this.state.formulario)
  }

  actualizarTexto(index, newText) {
    let formularioActualizado = [...this.state.formulario];
    formularioActualizado[index][1] = newText;
    this.setState({ formulario: formularioActualizado });
    this.props.entrega(this.state.formulario)
  }

  agregarOpcion(index, nuevaOpcion) {
    let formularioActualizado = [...this.state.formulario];
    formularioActualizado[index][2].push(nuevaOpcion);
    this.setState({ formulario: formularioActualizado });
    this.props.entrega(this.state.formulario)
  }

  async moverElemento(index, direction) {
    const { formulario } = this.state;
    const newIndex = direction === 'up' ? index - 1 : index + 1;

    // Verificamos si newIndex está dentro de los límites del array
    if (newIndex >= 0 && newIndex < formulario.length) {
      await this.setState({ carga: false })
      let a = this.state.formulario;
      let b = this.state.formulario[newIndex];
      a[newIndex] = a[index];
      a[index] = b;
      this.setState({ formulario: a, carga: true });

    }
    this.props.entrega(this.state.formulario)
  }

  async cambiarOpciones(index, valor) {
    await this.setState({ carga: false })
    let a = this.state.formulario;
    a[index][2] = valor;
    this.setState({ formulario: a, carga: true });
    this.props.entrega(this.state.formulario)
  }

  async eliminarPregunta(index) {
    await this.setState({ carga: false })
    let a = this.state.formulario;
    a.splice(index, 1)
    this.setState({ formulario: a, carga: true });
    this.props.entrega(this.state.formulario)
  }

  render() {
    return (

      <div>
        <select value={this.state.tipo} onChange={(e) => this.setState({ tipo: e.target.value })}>
          <option value="Bloque">Bloque de texto</option>
          <option value="Texto">Pregunta de texto</option>
          <option value="Checkbox">Pregunta de checkbox</option>
          <option value="Radiobutton">Pregunta de radiobutton</option>
        </select>
        <button onClick={this.addCampo}><FontAwesomeIcon icon={faPlus} /></button>
        <ul>
          {this.state.carga && this.state.formulario.map((i, index) =>
            <li key={index} style={{ display: "flex" }}>

              {/* Botones para mover el elemento hacia arriba y hacia abajo */}
              {index > 0 && <button onClick={() => this.moverElemento(index, 'up')}>↑</button>}
              {index < this.state.formulario.length - 1 && <button onClick={() => this.moverElemento(index, 'down')}>↓</button>}
              <Campo
                datos={i}
                index={index}
                actualizarTexto={this.actualizarTexto}
                agregarOpcion={this.agregarOpcion}
                cambiarOpciones={valor => this.cambiarOpciones(index, valor)}
                eliminarPregunta={() => this.eliminarPregunta(index)}
              />
            </li>
          )}
        </ul>
        <button onClick={() => this.props.entrega(this.state.formulario)}>Guardar</button>
        <button onClick={() => this.props.volver()}>Volver</button>
        <button onClick={() => this.props.ver()}>Ver Formulario</button>


      </div>
    );
  }
}

class Campo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editarTexto: false,
      texto: props.datos[1],
      nuevaOpcion: '',

    };
  }

  handleEditar = () => {
    this.setState({ editarTexto: true });
  }

  handleGuardar = () => {
    this.props.actualizarTexto(this.props.index, this.state.texto);
    this.setState({ editarTexto: false });
  }

  handleInputChange = (texto) => {
    this.setState({ texto: texto });
  }

  handleAgregarOpcion = () => {
    this.props.agregarOpcion(this.props.index, this.state.nuevaOpcion);
    this.setState({ nuevaOpcion: '' });
  }

  handleNuevaOpcionChange = (event) => {
    this.setState({ nuevaOpcion: event.target.value });
  }

  async moverElemento(index, direction) {

    const newIndex = direction === 'up' ? index - 1 : index + 1;

    // Verificamos si newIndex está dentro de los límites del array
    if (newIndex >= 0 && newIndex < this.props.datos[2].length) {

      let a = this.props.datos[2];
      let b = this.props.datos[2][newIndex];
      a[newIndex] = a[index];
      a[index] = b;
      this.props.cambiarOpciones(a);

    }

  }

  cambiarOpcion(index, texto) {
    let a = this.props.datos[2];
    a[index] = texto;
    this.props.cambiarOpciones(a);
  }


  eliminarOpcion(index) {
    let a = this.props.datos[2];
    a.splice(index, 1);
    this.props.cambiarOpciones(a);
  }

  render() {
    return (
      <div>
        {this.state.editarTexto ?
          <div>
            <EditorTextoCompleto texto={this.state.texto} onCambio={(texto) => this.handleInputChange(texto)} />

            <button onClick={this.handleGuardar}>Guardar</button>
          </div>
          :
          <div>
            {ReactHtmlParser(this.state.texto)}
            <button onClick={this.handleEditar}><FontAwesomeIcon icon={faPenSquare} /> </button>
            <button onClick={() => this.props.eliminarPregunta()}><FontAwesomeIcon icon={faTrash} /></button>
          </div>
        }
        {this.props.datos[0] === "Checkbox" || this.props.datos[0] === "Radiobutton" ?
          <div>

            <input
              type="text"
              value={this.state.nuevaOpcion}
              onChange={this.handleNuevaOpcionChange}
              placeholder="Nueva opción"
            />
            <button onClick={this.handleAgregarOpcion}>Añadir opción</button>
            <ul>
              {this.props.datos[2].map((opcion, index) =>
                <li key={index} style={{ display: "flex" }}>
                  <div>
                    {/* Botones para mover el elemento hacia arriba y hacia abajo */}
                    {index > 0 && <button onClick={() => this.moverElemento(index, 'up')}>↑</button>}
                    {index < this.props.datos[2].length - 1 && <button onClick={() => this.moverElemento(index, 'down')}>↓</button>}
                    <Opcion opcion={opcion} index={index} actualizarOpcion={(texto) => this.cambiarOpcion(index, texto)} eliminarOpcion={() => this.eliminarOpcion(index)} />

                  </div>
                </li>
              )}
            </ul>
          </div>
          : null}
      </div>
    );
  }
}

class Opcion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editarTexto: false,
      texto: props.opcion,
      nuevaOpcion: '',

    };
  }

  handleEditar = () => {
    this.setState({ editarTexto: true });
  }

  handleEliminar = () => {
    this.props.eliminarOpcion();
  }

  handleGuardar = () => {
    this.props.actualizarOpcion(this.state.texto);
    this.setState({ editarTexto: false });
  }

  handleInputChange = (texto) => {
    this.setState({ texto: texto });
  }




  render() {
    return (
      <div>
        {this.state.editarTexto ?
          <div>
            <EditorTextoCompleto texto={this.state.texto} onCambio={(texto) => this.handleInputChange(texto)} />
            <button onClick={this.handleGuardar}>Guardar</button>
          </div>
          :
          <div>
            {this.state.texto}
            <button onClick={this.handleEditar}><FontAwesomeIcon icon={faPenSquare} /></button>
            <button onClick={this.handleEliminar}><FontAwesomeIcon icon={faTrash} /></button>
          </div>
        }

      </div>
    );
  }
}



class MostrarFormulario extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      respuestas: this.props.respuestas ? this.props.respuestas : []
    };
  }

  handleTextChange(index, texto) {
    let a = this.state.respuestas;
    a[index] = texto;
    this.setState({ respuestas: a })
  }

  handleCheckboxChange(index, index2, value) {
    let a = this.state.respuestas;
    a[index][index2] = value;
    this.setState({ respuestas: a })

  }
  handleRadiobuttonChange(index, index2, value) {
    let a = this.state.respuestas;
    a[index] = new Array(this.props.formulario[index][2].length).fill(false);
    a[index][index2] = true;
    this.setState({ respuestas: a })

  }


  componentDidMount() {

  
    if(!this.props.respuestas){ 
      let a = this.state.respuestas;
      this.props.formulario.forEach((elemento, index) => {

      if (elemento[0] === "Texto") a[index] = "";
      else if (elemento[0] === "Bloque") a[index] = "";
      else if (elemento[0] === "Checkbox") a[index] = new Array(elemento[2].length).fill(false);
      else if (elemento[0] === "Radiobutton") a[index] = 0;

    });
    this.setState({ respuestas: a });
    
  }
  
  }


  enviarSolicitud() {

    partidaService.formularioRelleno(authService.getCurrentUser().id, this.props.partida, JSON.stringify({ formulario: this.props.formulario, respuestas: this.state.respuestas }), 0)

    this.props.volver();
  }

  formularioBorrador() {

    partidaService.formularioRelleno(authService.getCurrentUser().id, this.props.partida, JSON.stringify({ formulario: this.props.formulario, respuestas: this.state.respuestas }), 1)

    this.props.volver();
  }



  render() {
    return (
      <div>
        <ul style={{ listStyle: "none" }}>
          {this.props.formulario.map((elemento, index) =>
            <li key={index}>
              {elemento[0] === "Bloque" ?
                ReactHtmlParser(elemento[1])
                :
                elemento[0] === "Texto" ?
                  <div>
                    {ReactHtmlParser(elemento[1])}
                    <EditorTextoCompleto texto={this.state.respuestas[index]} onCambio={(texto) => this.handleTextChange(index, texto)} />
                  </div>
                  :
                  elemento[0] === "Checkbox" ?
                    <div>
                      {ReactHtmlParser(elemento[1])}
                      {elemento[2].map((opcion, index2) => (
                        <div key={index2} style={{ display: "flex" }}>
                          <input
                            type="checkbox"
                            id={`opcion-${index}-${index2}`}
                            name={`opcion-${index}-${index2}`}
                            value={opcion}
                            onChange={(e) => this.handleCheckboxChange(index, index2, e.target.checked)}
                            defaultChecked={this.props.respuestas ? this.props.respuestas[index][index2] : false}
                          />
                          <label htmlFor={`opcion-${index}-${index2}`}>{opcion}</label>
                        </div>
                      ))}
                    </div>
                    :
                    elemento[0] === "Radiobutton" ?
                      <div>
                        {ReactHtmlParser(elemento[1])}
                        {elemento[2].map((opcion, index2) => (
                          <div key={index2} style={{ display: "flex" }}>
                            <input
                              type="radio"
                              id={`opcion-${index}-${index2}`}
                              name={`opcion-${index}`}
                              value={opcion}
                              onChange={(e) => this.handleRadiobuttonChange(index, index2)}
                              defaultChecked={this.props.respuestas ? this.props.respuestas[index][index2] : false}
                            
                            />
                            <label htmlFor={`opcion-${index}-${index2}`}>{opcion}</label>
                          </div>
                        ))}
                      </div>
                      :
                      null}


              <div>
                <p></p>
              </div>
            </li>
          )}
        </ul>
        <button onClick={() => this.formularioBorrador()}>Guardar borrador</button>
        <button onClick={() => this.enviarSolicitud()}>Enviar Solicitud</button>
        <button onClick={() => this.props.volver()}>Volver</button>
      </div>
    );
  }
}




class LeerSolicitudes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lista: [],
      carga: false,
      formulario: {},
      paginador: 0,
      listaJugadores: [],
      form: [],
      respuestas: [],
      agregado: false,
    };
  }


  async componentDidMount() {
    await this.setState({ lista: await partidaService.listaFormulariosPartida(this.props.partida) })
    if (this.state.lista.length > 0) this.setState({
      formulario: await partidaService.cargarFormularioId(authService.getCurrentUser().id, this.state.lista[0]),
      paginador: 1,
      listaJugadores: await partidaService.jugadores(this.props.partida)
    })
    this.setState({
      carga: true,
      form: JSON.parse(this.state.formulario.form).formulario,
      respuestas: JSON.parse(this.state.formulario.form).respuestas
    })
 

this.props.actuNoLeidos();
  }


  async cargaForm(id) {

    this.setState({
      lista: await partidaService.listaFormulariosPartida(this.props.partida),
      formulario: await partidaService.cargarFormularioId(authService.getCurrentUser().id, id),
      listaJugadores: await partidaService.jugadores(this.props.partida),
      agregado: false,
    });

    this.props.actuNoLeidos();
  }

  async borrarFormulario() {
    if (await confirm('¿Estás seguro de que quieres borrar este formulario?')) {
      partidaService.borrarFormulario(this.state.lista[this.state.paginador - 1]);
      if (this.state.lista.length === 1) {
        this.setState({

          paginador: 0,
          lista: [],

        })

      }
    }
    else if (this.state.paginador === this.state.lista.length) {
      this.setState({ paginador: this.state.paginador - 1 });
      this.cargaForm(this.state.lista[this.state.paginador]);
    }

  }

async agregarUsuario(nombreJugador){
  partidaService.nuevoJugador(nombreJugador,this.props.partida,0);
  this.setState({
    listaJugadores: await partidaService.jugadores(this.props.partida), agregado: true
  });


}



  render() {
    return (
      <>
        {this.state.carga &&
          <div>
            {this.state.lista.length > 0 ? <div>
              <div>
                <p>{this.state.formulario.nombreJugador} envió la siguiente solicitud: </p>
              </div>
              <ul style={{ minHeight: "200px", listStyle: "none" }}>

                {this.state.form.map((elemento, index) => {
                  return (

                    <li key={index}>
                      {elemento[0] === "Bloque" ?
                        ReactHtmlParser(elemento[1])
                        :
                        elemento[0] === "Texto" ?
                          <div>
                            {ReactHtmlParser(elemento[1])}
                            {ReactHtmlParser(this.state.respuestas[index])}

                          </div>
                          :
                          elemento[0] === "Checkbox" ?
                            <div>
                              {ReactHtmlParser(elemento[1])}
                              {elemento[2].map((opcion, index2) => (
                                <div key={index2} style={{ display: "flex" }}>
                                  {this.state.respuestas[index][index2] ? <FontAwesomeIcon icon={faCheck} /> : <FontAwesomeIcon icon={faBan} />}
                                  {opcion}
                                </div>
                              ))}
                            </div>
                            :
                            elemento[0] === "Radiobutton" ?
                              <div>
                                {ReactHtmlParser(elemento[1])}
                                {elemento[2].map((opcion, index2) => (
                                  <div key={index2} style={{ display: "flex" }}>
                                    {this.state.respuestas[index][index2] ? <FontAwesomeIcon icon={faCheck} /> : <FontAwesomeIcon icon={faBan} />}
                                    {opcion}
                                  </div>
                                ))}
                              </div>
                              :
                              null}


                      <div>
                        <p></p>
                      </div>
                    </li>
                  )

                })}


              </ul>
              <div style={{ minHeight: "50px" }}>
                {(this.state.formulario.nombreJugador in this.state.listaJugadores || this.state.agregado) ? <p>Este usuario ya es jugador de la partida.</p> : <button onClick={()=>this.agregarUsuario(this.state.formulario.nombreJugador)}>Agregar jugador</button>}
                <p></p>
              </div>
              <button onClick={() => this.borrarFormulario()}>Borrar solicitud</button>
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "20px" }}>
                {this.state.paginador > 1 ? <span style={{ margin: "0 10px", cursor: "pointer", minWidth: "10px" }} onClick={() => { this.cargaForm(this.state.lista[this.state.paginador - 2]); this.setState({ paginador: this.state.paginador - 1 }); }}>-</span> : <span style={{ margin: "0 10px", minWidth: "10px" }}>&nbsp;</span>}
                <span style={{ margin: "0 20px", textAlign: "center", minWidth: "20px" }}>{this.state.paginador}</span>
                {this.state.paginador < this.state.lista.length ? <span style={{ margin: "0 10px", cursor: "pointer", minWidth: "10px" }} onClick={() => { this.cargaForm(this.state.lista[this.state.paginador]); this.setState({ paginador: this.state.paginador + 1 }); }}>+</span> : <span style={{ margin: "0 10px", minWidth: "10px" }}>&nbsp;</span>}
              </div>
            </div>
              :
              <p>No hay solicitudes que mostrar.</p>}


          </div>
        }

      </>
    );
  }
}




