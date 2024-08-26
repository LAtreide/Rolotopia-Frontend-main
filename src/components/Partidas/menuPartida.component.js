import React from 'react';
import '../../css/App.css';
import '../../css/Partida.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import LEscenas from '../../services/escena.service';
import PartidaService from '../../services/partida.service';
import ReactHtmlParser from 'react-html-parser';
import AuthService from "../../services/auth.service";
import MenuCrearEscena from "./Escenas/menuCrearEscena.component"
import NavPartida from "../Navbar/navPartida.component";
import EscenaService from '../../services/escena.service';
import Escenap from "./Escenas/escena.component";
import GenerarPDF from './Informacion/GenerarPDF';
import Portada from "./Portada/portada.component"
import { SPACE_URL } from '../../constantes';
import MenuCrearCapitulo from './Capitulos/menuCrearCapitulo.component';
import Capitulo from './Capitulos/capìtulo.component';
import EscenaPreview from './Escenas/escenaPreview.component';
import escenaService from '../../services/escena.service';
import personajeService from '../../services/personaje.service';
import PostService from '../../services/posts.service';
import Solicitud from "./Solicitud";


export default class MenuPartida extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      partida: null,
      escenas: null,
      director: null,
      carga: null,
      usuarios: null,
      escena: this.props.escena ? this.props.escena : "",
      exportar: false,
      formulario: false,
      mostrarPortada: true,
      listaCapitulos: [],
      personajesEscena: [],
      destinatarios: [],
      avdestinatarios: [],
      infoEscena: null,
      nombresPj: {},
      cambiosAvatar: {},

    };

  }
  async componentDidMount() {
    window.history.pushState({ escena: this.state.escena }, "New Page Title", "/partida/" + this.props.partida)

    this.setState({ partida: await PartidaService.infolink(this.props.partida) });
    this.setState({
      escenas: await LEscenas.lista(this.state.partida.id, AuthService.getCurrentUser().id),
      director: await PartidaService.isDirector(this.state.partida.id, AuthService.getCurrentUser().id),
      notificaciones: await PartidaService.isNotification(this.state.partida.id, AuthService.getCurrentUser().id),
      listaCapitulos: await EscenaService.listaCapitulos(this.state.partida.id, AuthService.getCurrentUser().id)
    });

    if (this.props.escena && this.props.escena !== "") {
      await this.handleEscena(this.props.escena)
    }

    this.setState({
      carga: 1,
    });

    document.querySelector(':root').style.setProperty('--imagen-fondo', 'url("' + this.state.partida.estilo.imagenFondo + '")')
    document.querySelector(':root').style.setProperty('--texto-escenas', this.state.partida.estilo.textoEscenas)
    document.querySelector(':root').style.setProperty('--color-titulo', this.state.partida.estilo.colorTitulo)
    document.querySelector(':root').style.setProperty('--fuente-titulo', this.state.partida.estilo.fuenteTitulo)
    document.querySelector(':root').style.setProperty('--fondo-escenas', this.state.partida.estilo.fondoEscenas)
    document.querySelector(':root').style.setProperty('--fondo-post', this.state.partida.estilo.fondoPost)


    window.addEventListener('popstate', () => {



      this.setState({ escena: window.history.state.escena })
      this.setState({ carga: false })
      this.setState({ carga: true })

    }, false);
  }


  async handleEscena(newValew) {

    this.setState({
      exportar: false,
      formulario: false,
      nombresPj: {},
      cambiosAvatar: {},
    })
    this.setState({ infoEscena: await EscenaService.infolink(newValew) })

    this.setState({
      personajesEscena: await personajeService.personajesEscena(this.state.infoEscena.id),
      destinatarios: await PostService.destinatarios(this.state.infoEscena.id),
      pjsescribir: await personajeService.pjsescribir(this.state.infoEscena.id, this.state.partida.id, AuthService.getCurrentUser().id),
    })
    let a = {}
    for (let i in this.state.personajesEscena) {
      a[this.state.personajesEscena[i].id] = this.state.personajesEscena[i].avatar;
      this.setState({ avdestinatarios: a })
    }

    await this.setState({ escena: newValew })

    window.history.pushState({ escena: newValew }, "New Page Title", "/partida/" + this.state.partida.enlace + "/escena/" + newValew)

  }

  onPaginaPartida = () => {
    this.setState({ escena: "" });

    window.history.pushState({ escena: "" }, "New Page Title", "/partida/" + this.state.partida.enlace)

  }

  generarPDF() {

    this.setState({ exportar: true, formulario: false })

  }

  
  activarFormulario() {

    this.setState({ exportar: false, formulario: true })

  }

  onSaveEscenaData(i, nombre, texto, recuento) {

    let a = this.state.escenas;
    a[i].descripcion = texto;
    a[i].nombre = nombre;
    a[i].recuento = recuento;
    this.setState({ escenas: a })
    EscenaService.changeData(this.state.escenas[i].id, nombre, texto, recuento)
  }

  onSaveCapituloData(i, nombre, texto) {

    let a = this.state.escenas;
    a[i].descripcion = texto;
    a[i].nombre = nombre;
    this.setState({ escenas: a })
    EscenaService.changeCapituloData(this.state.escenas[i].id, nombre, texto)
  }

  escenaCreada(e) {
    let a = this.state.escenas;
    e.tipo = 1;
    a.splice(0, 0, e)
    this.setState({ escenas: a })
  }

  capituloCreado(e) {
    let a = this.state.escenas;
    let b = this.state.listaCapitulos;
    e.tipo = 3;
    a.splice(0, 0, e)
    b.splice(0, 0, e)
    this.setState({ escenas: a, listaCapitulos: b })

  }

  onCambio = (cambio) => {
    if (cambio.tipo === "Titulo") {
      let a = this.state.partida;
      a.nombre = cambio.titulo;
      a.enlace = cambio.enlace;
      this.setState({ partida: a });
      this.state.escena !== "" ?
        window.history.replaceState(null, "New Page Title", "/partida/" + cambio.enlace + "/escena/" + this.state.escena)
        :
        window.history.replaceState(null, "New Page Title", "/partida/" + cambio.enlace)
    }
    if (cambio.tipo === "Sistema") {
      let a = this.state.partida;
      a.idSistema = parseInt(cambio.sistema);
      this.setState({ partida: a });
    }

    if (cambio.tipo === "Descripcion") {
      let a = this.state.partida;
      a.descripcion = cambio.descripcion;
      this.setState({ partida: a });
    }

    if (cambio.tipo === "Portada") {
      let a = this.state.partida;
      a.imagen = cambio.portada;
      this.setState({ partida: a });
    }

    if (cambio.tipo === "Estilo") {
      let a = this.state.partida;
      a.estilo = cambio.estilo;
      this.setState({ partida: a });
      document.querySelector(':root').style.setProperty('--imagen-fondo', 'url("' + this.state.partida.estilo.imagenFondo + '")')
      document.querySelector(':root').style.setProperty('--texto-escenas', this.state.partida.estilo.textoEscenas)
      document.querySelector(':root').style.setProperty('--color-titulo', this.state.partida.estilo.colorTitulo)
      document.querySelector(':root').style.setProperty('--fuente-titulo', this.state.partida.estilo.fuenteTitulo)
      document.querySelector(':root').style.setProperty('--fondo-escenas', this.state.partida.estilo.fondoEscenas)
      document.querySelector(':root').style.setProperty('--fondo-post', this.state.partida.estilo.fondoPost)

    }


    if (cambio.tipo === "AvatarPj") {


      let b = this.state.avdestinatarios;
      b[cambio.idPj] = cambio.avatar;
      this.setState({ avdestinatarios: b })
      let a = this.state.cambiosAvatar;
      a[cambio.idPj] = cambio.avatar;
      this.setState({ cambiosAvatar: b })


    }

    if (cambio.tipo === "NombrePj") {


      let b = this.state.nombresPj;
      b[cambio.idPj] = cambio.nombre;
      this.setState({ nombresPj: b })

    }


    if (cambio.tipo === "CreacionPj" && this.state.pjsescribir) {


      let b = this.state.pjsescribir;
      b.push(cambio.personaje);
      this.setState({ pjsescribir: b })

    }

  }


  onMoverEscena(escena, idCapitulo) {
    if (escena.idCapitulo === 0) {
      let a = this.state.escenas;
      a.splice(this.state.escenas.indexOf(escena), 1);
      this.setState({ escenas: a })
    }

    if (idCapitulo === 0) {
      let a = this.state.escenas;
      escena.idCapitulo = idCapitulo;
      a.unshift(escena);
      this.setState({ escenas: a })
    }

    EscenaService.moverEscena(escena.id, idCapitulo)

  }

  borrarEscena(escena) {
    let a = this.state.escenas;
    let b = this.state.escenas.indexOf(escena);
    if (b >= 0) {
      a.splice(b, 1);
      this.setState({ escenas: a })
    }
    escenaService.borrarEscena(escena.id);
  }

  borrarCapitulo(capitulo, escenas) {
    let a = this.state.escenas;
    let b = this.state.listaCapitulos;
    a.splice(this.state.escenas.indexOf(capitulo), 1);
    b.splice(this.state.listaCapitulos.indexOf(capitulo), 1);
    for (let i = escenas.length - 1; i >= 0; i--)
      a.unshift(escenas[i])

    this.setState({
      escenas: a,
      listaCapitulos: b
    })

    escenaService.borrarCapitulo(capitulo.id);
  }



  render() {


    return (
      <div className="partida"> {this.state.carga &&
        <div>
          <NavPartida
            partida={this.state.partida.id}
            enlace={this.state.partida.enlace}
            director={this.state.director}
            notificaciones={this.state.notificaciones}
            onCambio={(cambio) => this.onCambio(cambio)}
            generarPDF={() => this.generarPDF()}
            activarFormulario={()=> this.activarFormulario()}
            titulo={this.state.partida.nombre}
            escenas={this.state.escenas}
            salir={this.onPaginaPartida}
            handleEscena={(enlace) => this.handleEscena(enlace)}
            nombresPj={this.state.nombresPj}
            cambiosAvatar={this.state.cambiosAvatar}
            abierta={this.state.partida.abierta}

          />
          {this.state.exportar ?

            <GenerarPDF
              partida={this.state.partida.id}
              volver={() => this.setState({ exportar: false })}
              
            />


            :

            this.state.formulario ?
             
             <Solicitud
             partida={this.state.partida.id}
             volver={()=> this.setState({formulario: false})}
             director = {this.state.director}
             />
             
              :

              <div style={{ textAlign: 'center' }} className="containerPartida mt-3">



                {this.state.escena !== "" ?
                  <Escenap
                    key={this.state.escena}
                    partida={this.state.partida}
                    escena={this.state.escena}
                    listaEscenas={this.state.escenas}
                    setEscena={(escena) => this.handleEscena(escena)}
                    pagina={this.props.pagina}
                    post={this.props.post}
                    director={this.state.director}
                    destinatarios={this.state.destinatarios}
                    avdestinatarios={this.state.avdestinatarios}
                    personajesEscena={this.state.personajesEscena}
                    nombresPj={this.state.nombresPj}
                    cambiosAvatar={this.state.cambiosAvatar}
                    cambioNombre={(idPj, nombre) => this.onCambio({ tipo: "NombrePj", idPj: idPj, nombre: nombre })}
                    subida={(avatar, idPj) => this.onCambio({ tipo: "AvatarPj", avatar: avatar, idPj: idPj })}
                    pjsescribir={this.state.pjsescribir}

                  />
                  :
                  <div>
                    <h1 onClick={this.onPaginaPartida} className="titulo">{this.state.partida.nombre}</h1>
                    {this.state.mostrarPortada && <Portada src={SPACE_URL + "/portada/" + this.state.partida.imagen} key={this.state.partida.imagen} />}
                    <p></p>
                    {this.state.partida.descripcion !== null && ReactHtmlParser(this.state.partida.descripcion)}

                    {this.state.carga && <ListaEscenasP
                      partida={this.state.partida}
                      escenas={this.state.escenas}
                      director={this.state.director}
                      handleEscena={escena => this.handleEscena(escena)}
                      onSaveEscenaData={(i, nombre, texto, recuento) => this.onSaveEscenaData(i, nombre, texto, recuento)}
                      onSaveCapituloData={(i, nombre, texto) => this.onSaveCapituloData(i, nombre, texto)}
                      escenaCreada={(e) => this.escenaCreada(e)}
                      capituloCreado={(e) => this.capituloCreado(e)}
                      listaCapitulos={this.state.listaCapitulos}
                      onMover={(escena, idCapitulo) => this.onMoverEscena(escena, parseInt(idCapitulo))}
                      onSacar={(escena) => this.onSacarEscena(escena)}
                      borrarEscena={(escena) => this.borrarEscena(escena)}
                      borrarCapitulo={(capitulo, escenas) => this.borrarCapitulo(capitulo, escenas)}

                    />
                    }


                  </div>}
              </div>}
        </div>}
      </div>
    );
  }
}


function ListaEscenasP(props) {


  let [characters, updateCharacters] = React.useState(props.escenas);
  const [ordenar, setOrdenar] = React.useState(false);
  const [crearEscena, setCrearEscena] = React.useState(false);
  const [crearCapitulo, setCrearCapitulo] = React.useState(false);
  const [orden, setOrden] = React.useState([]);

  const onClickOrdenar1 = () => setOrdenar(true);
  const onClickOrdenar2 = () => { setOrdenar(false); EscenaService.orden(props.partida.id, orden); }
  const OnClickCrearEscena = () => setCrearEscena(!crearEscena);
  const OnClickCrearCapitulo = () => setCrearCapitulo(!crearCapitulo);


  const setEscena = (escena) => {
    props.handleEscena(escena);
  };




  function handleOnDragEnd(result) {
    if (!result.destination) return;
    const items = Array.from(characters);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    var a = [];
    items.forEach(function (i) {

      a.push(i.id);

    });
    setOrden(a);
    updateCharacters(items);
  }

  function escenaCreada(e) {
    props.escenaCreada(e)
    updateCharacters(props.escenas)
    OnClickCrearEscena();
  }

  function capituloCreado(e) {
    props.capituloCreado(e)
    updateCharacters(props.escenas)
    OnClickCrearCapitulo();
  }


  return (
    <div>
      {props.director ?
        <div>
          {!ordenar && !crearEscena && !crearCapitulo && <button onClick={onClickOrdenar1}>Ordenar</button>}
          {ordenar && <button onClick={onClickOrdenar2}>No ordenar</button>}
          {!crearEscena && !ordenar && !crearCapitulo && <button onClick={OnClickCrearEscena}>Crear Nueva Escena</button>}
          {!crearEscena && !ordenar && !crearCapitulo && <button onClick={OnClickCrearCapitulo}>Crear Nuevo Capitulo</button>}
          {crearCapitulo && <button onClick={OnClickCrearCapitulo}>No crear</button>}

          {crearCapitulo &&
            <MenuCrearCapitulo partida={props.partida} capituloCreado={e => capituloCreado(e)} />
          }

          {crearEscena && <button onClick={OnClickCrearEscena}>No crear</button>}
          {crearEscena &&
            <MenuCrearEscena partida={props.partida} escenaCreada={e => escenaCreada(e)} />
          }

        </div>
        : null}



      {ordenar ?
        <div>
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="characters">
              {(provided) => (
                <ul className="listaEscenas" {...provided.droppableProps} ref={provided.innerRef}>
                  {characters.map((i, index) => {
                    return (
                      <Draggable key={i.id} draggableId={i.id + ""} index={index}>
                        {(provided) => (
                          <li className="escena" style={{ border: '1px solid white' }} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                            <p className="link" style={{ fontWeight: "bold" }}>{i.nombre}</p>
                            <p></p>
                          </li>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>
        </div>
        :
        <div>


          <ul className="listaEscenas" >
            {characters.map((i, index) =>
              <li key={i.id} style={{ display: 'block', textAlign: 'left' }}>

                {i.tipo === 1 ?
                  <EscenaPreview
                    escena={i}
                    director={props.director}
                    saveEscenaData={(nombre, texto, recuento) => props.onSaveEscenaData(index, nombre, texto, recuento)}
                    setEscena={(enlace) => setEscena(enlace)}
                    partida={props.partida}
                    listaCapitulos={props.listaCapitulos}
                    onMover={(idEscena, idCapitulo) => props.onMover(idEscena, idCapitulo)}
                    onSacar={(idEscena) => props.onSacar(idEscena)}
                    borrarEscena={(escena) => props.borrarEscena(escena)}
                  />
                  :
                  <Capitulo
                    capitulo={i}
                    partida={props.partida}
                    director={props.director}
                    saveCapituloData={(nombre, texto) => props.onSaveCapituloData(index, nombre, texto)}
                    handleEscena={(escena) => setEscena(escena)}
                    listaCapitulos={props.listaCapitulos}
                    onMover={(idEscena, idCapitulo) => props.onMover(idEscena, idCapitulo)}
                    onSacar={(idEscena) => props.onSacar(idEscena)}
                    borrarEscena={(escena) => props.borrarEscena(escena)}
                    borrarCapitulo={(capitulo, escenas) => props.borrarCapitulo(capitulo, escenas)}
                  />
                }


              </li>
            )}
          </ul>
        </div>
      }

    </div >
  );
}

