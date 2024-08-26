import React from "react";
import postService from "../../../../services/posts.service";
import ReactHtmlParser from 'react-html-parser';
import partidaService from "../../../../services/partida.service"
import { SPACE_URL } from "../../../../constantes";
import personajeService from "../../../../services/personaje.service"
import authService from "../../../../services/auth.service";
import TiradaConstructor from "../../Posts/tiradaConstructor.component";

export default class VistaPDF extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      carga: null,
      escenas: [],
      posts: [],
      avatares: [],
      partida: null,
      personajesAsignados: [],
      personajesNoAsignados: []
    };
  }
  componentDidMount = async e => {
    await this.setState({
      partida: await partidaService.infoPartidaId(this.props.partida),
      posts: await postService.listaExportar(this.props.escenas, this.props.usuario),

    })

    let a = [];
    for (let i = 0; i < this.props.personajes.length; i++) {
      a[this.props.personajes[i].id] = this.props.personajes[i].avatar;
    }

    if (this.props.opciones.mostrarPjs) {
      let b = [];
      for (let i = 0; i < this.props.personajesAsignados.length; i++) {
        b.push(await personajeService.infoCompletaId(this.props.personajesAsignados[i], authService.getCurrentUser().id))
      }
      this.setState({ personajesAsignados: b })
    }

    if (this.props.opciones.mostrarPnjs) {
      let c = [];
      for (let i = 0; i < this.props.personajesNoAsignados.length; i++) {
        c.push(await personajeService.infoCompletaId(this.props.personajesNoAsignados[i], authService.getCurrentUser().id))
      }
      this.setState({ personajesNoAsignados: c })
    }


    this.setState({
      avatares: a,
      carga: 1
    })
    console.log(this.state)
  };

  render() {
    return (
      <div style={{ marginLeft: "60px", marginRight: "60px", marginBottom: "200px", marginTop: "200px" }}>
        <style>{"@page { margin-top: 44mm }"}</style>
        {this.state.carga &&
          <div>
            <div style={{ textAlign: "center" }}>
              <h1>{this.state.partida.nombre}</h1>
              <img src={SPACE_URL + "/portada/" + this.state.partida.imagen} width="300px" alt="" style={{ textAlign: "center" }} />

              {ReactHtmlParser(this.state.partida.descripcion)}

            </div>
            <div className="page-break" style={{ pageBreakBefore: 'always' }} />
            <ul >
              {this.state.posts.map((i, index) =>
                <li key={index} style={{ display: 'block', textAlign: 'left' }}>
                  <h1 style={{ textAlign: "center", marginBottom: "15px" }}>{this.props.nombreEscenas[index]}</h1>
                  <ul style={{ display: "block" }}>
                    {i.map((j, index) =>
                      <div key={j.id}>

                        {(this.props.opciones.blanco || (j.texto.length > 0 && j.texto !== "<p></p>") || (j.notas.length > 0 && j.notas !== "<p></p>" && this.props.opciones.notas) || (this.props.opciones.tiradas && j.tiradas.length > 0)) &&
                          <li style={{ display: 'block', textAlign: 'left', marginBottom: "35px", minHeight: "120px" }}>

                            <img src={SPACE_URL + "/avatarPj/" + j.avPersonaje} width="200px" alt="" style={{ display: "inline", width: "90px", float: "left", marginRight: "12px", marginBottom: "5px" }} />

                            <h3>{j.nPersonaje}</h3>

                            <ul style={{ display: "flex" }}>

                              {this.props.opciones.destinatarios && j.destinatarios.map((k, index) =>
                                <li key={k} style={{ display: 'block', textAlign: 'left', minHeight: j.texto.length < 150 ? "120px" : null }}>


                                  <img src={SPACE_URL + "/avatarPj/" + this.state.avatares[k]} width="20px" alt="" style={{ display: "inline", width: "25px", marginRight: "6px", marginBottom: "2px" }} />



                                </li>
                              )}

                            </ul>
                            <p></p>
                            <div style={{ fontFamily: "Times New Roman", fontSize: "15.5px" }}>

                              {ReactHtmlParser(j.texto)}
                              {j.notas.length > 0 && this.props.opciones.notas ?
                                <div>

                                  {ReactHtmlParser(j.notas)}

                                </div>
                                : null}

                            </div>
                            {this.props.opciones.tiradas && j.tiradas.length > 0 &&
                               <div className="tiradasPost">
                               <p className="tituloTiradas">Tiradas</p>
                               <ul className="listaTiradas">
                                   {this.props.post.tiradas.map(i =>
                                       <li key={i.id} className="itemTirada">
                                      
                                           {TiradaConstructor(i)}
                                       </li>
                                   )}
                               </ul>
                           </div>
                             }
                          </li>
                        }
                      </div>
                    )}
                  </ul >

                  <div className="page-break" style={{ pageBreakBefore: 'always' }} />

                </li>
              )}
            </ul>

            {this.props.opciones.mostrarPjs && <div>
              <div className="page-break" style={{ pageBreakBefore: 'always' }} />
              <h1>Personajes</h1>
              <ul >
                {this.state.personajesAsignados.map((i, index) =>
                  <li key={index} style={{ display: 'block', textAlign: 'left' }}>
                           <img src={SPACE_URL + "/avatarPj/" + i.avatar} width="50px" alt="" style={{ display: "inline", width: "50px", marginRight: "6px", marginBottom: "2px" }} />
             
                    <h2 style={{ textAlign: "center", marginBottom: "15px" }}>{i.nombre}</h2>

                    <ul >
                      {i.pestanas.map((j, index) =>
                        <li key={index} style={{ display: 'block', textAlign: 'left' }}>
                          <h3 style={{ textAlign: "center", marginBottom: "15px" }}>{j.titulo}</h3>
                          {ReactHtmlParser(j.info)}

                        </li>
                      )}
                    </ul>
                  </li>
                )}
              </ul>
            </div>
            }


            {this.props.opciones.mostrarPnjs && <div>
              <div className="page-break" style={{ pageBreakBefore: 'always' }} />
              <h1>Personajes no Jugadores</h1>

              <ul >
                {this.state.personajesNoAsignados.map((i, index) =>
                  <li key={index} style={{ display: 'block', textAlign: 'left' }}>
                    
                    <h2 style={{ textAlign: "center", marginBottom: "15px" }}>{i.nombre}</h2>
                    <img src={SPACE_URL + "/avatarPj/" + i.avatar} width="50px" alt="" style={{ display: "inline", width: "50px", marginRight: "6px", marginBottom: "2px" }} />
                    <ul >
                      {i.pestanas.map((j, index) =>
                        <li key={index} style={{ display: 'block', textAlign: 'left' }}>
                          <h3 style={{ textAlign: "center", marginBottom: "15px" }}>{j.titulo}</h3>
                          {ReactHtmlParser(j.info)}

                        </li>
                      )}
                    </ul>
                  </li>
                )}
              </ul>
            </div>
            }
          </div>
        }

      </div>
    );
  }
}