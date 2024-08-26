import React from 'react';
import { Rnd } from 'react-rnd';
import foroService from '../../../services/foro.service';
import authService from '../../../services/auth.service';
import EditorTextoCompleto from "../../EditorTexto/editorTextoCompleto"
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";



export default class ForoSeccion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listaHilos: [],
      carga: 0,
      menuNuevoHilo: false,
      titulo: "",
      seccion: this.props.seccion,
      hilo: this.props.hilo,
      infoSeccion: null,
      texto: "",
      menu: false,
      menuEditar: false,
      tituloAux: null,
      descripcionAux: null,
      staffAux: null
    };


  }


  async componentDidMount() {

    this.setState({ infoSeccion: await foroService.infoSeccion(this.state.seccion) })
    this.setState({ listaHilos: await foroService.listaHilos(this.state.infoSeccion.id) })
    this.setState({ carga: 1 })


  }

  seccion() {
    window.history.replaceState(null, "New Page Title", "/foro/" + this.props.seccion)
    this.setState({ hilo: null })
  }


  async onHilo(enlace) {
    this.props.onHilo(enlace)
  }



  handleSubmit = async e => {
    e.preventDefault();
    this.setState({
      menuNuevoHilo: false,
      titulo: "",
    });
    let a = await foroService.crearHilo(this.state.infoSeccion.id, this.state.titulo, authService.getCurrentUser().id, authService.getCurrentUser().username)
    await foroService.nuevoMensaje(a.id, authService.getCurrentUser().id, this.state.texto);
    this.props.onHilo(a.enlace);
  }

  async borrarSeccion() {
    await foroService.borrarSeccion(this.state.infoSeccion.id);
    this.setState({
      menu: false,
    })
    this.props.general();

  }


  handleSubmitEditar = async e => {
    e.preventDefault();
    let a = this.state.infoSeccion;
    a.titulo = this.state.tituloAux;
    a.descripcion = this.state.descripcionAux;
    a.staff = this.state.staffAux ? 1:0;
   this.setState({
      infoSeccion: a,
      menuEditar: false, 
      tituloAux: null, 
      descripcionAux: null, 
      staffAux: null,

    });
    let b = await foroService.editarSeccion(this.state.infoSeccion);  
    window.history.replaceState(null, "New Page Title", "/foro/" + b.enlace)
    this.props.onEditSeccion(b);
  }

  render() {
    return (

      <div>

        {this.state.carga === 1 && !this.state.hilo && (this.state.infoSeccion.staff===0 || (authService.getCurrentUser().roles.includes("ROLE_MODERATOR") || authService.getCurrentUser().roles.includes("ROLE_ADMIN"))) ?

          <div>
            <h2>{this.state.infoSeccion.titulo}</h2>
            <div style={{ float: 'right' }}>
              {(authService.getCurrentUser().roles.includes("ROLE_MODERATOR") || authService.getCurrentUser().roles.includes("ROLE_ADMIN")) &&
                <input type="submit" value={this.state.menu ? "⇭" : "⤋"} onClick={() => this.setState({ menu: !this.state.menu })} />}

              {this.state.menu &&
                <div style={{ display: 'block' }}>
                  <Rnd
                    disableDragging
                    enableResizing={{
                      bottom: false
                    }}
                    style={{ boxSizing: 'border-box', border: '1px solid blue', backgroundColor: 'white', paddingRight: '10px' }}
                  >
                    <ul>
                      <li><button onClick={() => { if (window.confirm('¿Estás seguro de que quieres borrar esta sección?')) this.borrarSeccion() }}> Borrar sección</button></li>
                      <li><button onClick={() => this.setState({ menu: false, menuEditar: true, tituloAux: this.state.infoSeccion.titulo, descripcionAux: this.state.infoSeccion.descripcion, staffAux: this.state.infoSeccion.staff })}> EditarSección</button></li>

                    </ul>
                  </Rnd>
                </div>
              }

              {this.state.menuEditar &&
                <Rnd
                  disableDragging
                  enableResizing={{
                    bottom: false
                  }}
                  style={{ boxSizing: 'border-box', border: '1px solid blue', backgroundColor: 'white', paddingRight: '10px', paddingLeft: '10px' }}>
                  <form onSubmit={this.handleSubmitEditar}>
                    <p>Titulo: </p>
                    <input
                      type="text"
                      value={this.state.tituloAux}
                      onChange={e => this.setState({ tituloAux: e.target.value })}
                    />

                    <p>Descripcion: </p>
                    <input
                      type="text"
                      value={this.state.descripcionAux}
                      onChange={e => this.setState({ descripcionAux: e.target.value })}
                    />


                    <p>Solo apta para Staff: </p>
                    <input
                      type="checkbox"
                      checked={this.state.staffAux}
                      onChange={e => this.setState({ staffAux: e.target.checked })}
                    />

                    <p></p>
                    <button type="submit">Guardar Cambios</button>
                  </form>

                  <button onClick={() => this.setState({ menuEditar: false, tituloAux: null, descripcionAux: null, staffAux: null })}> Cancelar</button>

                </Rnd>
              }

            </div>
            <h3>Hilos</h3>
            <div>

              <button onClick={() => this.setState({ menuNuevoHilo: true })}>Nuevo Hilo</button>
              {this.state.menuNuevoHilo &&
                <Rnd
                  disableDragging
                  enableResizing={{
                    bottom: false
                  }}
                  style={{ boxSizing: 'border-box', border: '1px solid blue', backgroundColor: 'white', paddingRight: '10px', paddingLeft: '10px' }}>
                  <form onSubmit={this.handleSubmit}>
                    <p>Titulo: </p>
                    <input
                      type="text"
                      value={this.state.titulo}
                      onChange={e => this.setState({ titulo: e.target.value })}
                    />


                    <p></p>
                    <div style={{ width: '700px', textAlign: 'left', color: 'black' }}>

                      <EditorTextoCompleto texto={this.state.texto} onCambio={(texto) => this.setState({ texto: texto })} />

                      <div style={{ display: "inline-flex", width: '700px', justifyContent: "space-between", marginBottom: '5px' }}>
                      </div>
                    </div>
                    {this.state.titulo !== "" &&  this.state.texto !== ""? 
                    <button type="submit">Crear Hilo</button>:
                    <button onClick={(e)=>e.preventDefault()} style={{opacity:'50%', cursor:'not-allowed'}}>Crear Hilo</button>
                    }
                  </form>

               <button onClick={() => this.setState({ menuNuevoHilo: false, titulo: "" })}> Cancelar</button>
                    
                </Rnd>
              }

            </div>


            <ul>
              {this.state.listaHilos.map(i =>

                <li key={i.id}>
                  <div className='seccionForo' onClick={() => this.onHilo(i.enlace)}>
                  <p >
                  {i.cerrado === 1 ? <FontAwesomeIcon icon={faLock}></FontAwesomeIcon> : null}
                    {i.titulo}
                    </p>

                    </div>
                </li>)
              }

            </ul>

            <p onClick={() => { this.props.general() }}>Volver</p>
          </div>
        :null}

      </div>
    )
  }
}

