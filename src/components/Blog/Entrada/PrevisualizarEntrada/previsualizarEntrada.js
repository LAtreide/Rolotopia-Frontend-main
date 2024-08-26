import React, { Component } from 'react';
import { FaComment, FaCommentSlash } from "react-icons/fa";
import "../../../../css/Blog.css"
import ReactHtmlParser from 'react-html-parser';
import comentarioService from '../../../../services/comentario.service';
import entradaService from '../../../../services/entrada.service';
import authService from '../../../../services/auth.service';
import EditorTextoCompleto from '../../../EditorTexto/editorTextoCompleto';
import NombreUsuario from '../../../Usuarios/NombreUsuario';
import { faEdit, faTrash} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default class PrevisualizarEntrada extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cargan: null,
      asunto: "",
      texto: "",
      titulo: "",
      borrador: false,
      emojis: [],
      nComentarios: 0,
      reaccion: null,
      reacciones: [["👍", "Me gusta"], ["❤️", "Me encanta"], ["😂", "Me divierte"], ["🔥", ""], ["😱", ""], ["👏", ""]],
      comentar: false,
      comentario: "",
      showComentarios: false,
      cargaComentarios: false,
      listaComentarios: []
    };
  }

  async componentDidMount() {
    this.setState({
      nComentarios: await comentarioService.nComentarios(this.props.entrada.id),
      emojis: await entradaService.getEmojis(this.props.entrada.id),
      reaccion: await entradaService.emojiUsuarioEntrada(this.props.entrada.id, authService.getCurrentUser().id),


    })
    this.setState({ carga: 1 })

  }

  handleReactionClick = async (emoji) => {
    if (this.state.reaccion === emoji) {
      await entradaService.guardarEmoji(this.props.entrada.id, authService.getCurrentUser().id, 0)
      this.setState({
        reaccion: null,
        emojis: await entradaService.getEmojis(this.props.entrada.id)
      });

    }
    else {
      await entradaService.guardarEmoji(this.props.entrada.id, authService.getCurrentUser().id, emoji);
      this.setState({
        reaccion: emoji,
        emojis: await entradaService.getEmojis(this.props.entrada.id)
      });

    }
  };

  async enviarComentario() {
    this.setState({ comentario: "", comentar: false })
    await comentarioService.crearComentario(this.props.entrada.id, this.state.comentario, authService.getCurrentUser().id)

  }


  async mostrarComentarios() {

    await this.setState({
      showComentarios: !this.state.showComentarios,
      cargaComentarios: false,
    })
    if (this.state.showComentarios) {
      await this.setState({ listaComentarios: await comentarioService.listaComentarios(this.props.entrada.id) })
      this.setState({ cargaComentarios: true })
    }
    
  }


  render() {
    return (
      <div>
        {this.state.carga === 1 &&
          <div className="blog-entry">
            <div className="blog-entry-header" style={{opacity: this.props.entrada.borrador? 0.5 : 1}}>
            {this.props.entrada.borrador===1 && <h2>Borrador</h2>}
            {this.props.entrada.idBlog === authService.getCurrentUser().id && 
            <div style={{display: "flex", justifyContent: "flex-end"}} >
            <span style={{cursor: "pointer", padding: "2px"}} onClick={()=>{this.props.onEditar()}}><FontAwesomeIcon icon={faEdit}/></span>
            <span style={{cursor: "pointer", padding: "2px", marginLeft: "3px"}} onClick={()=>{this.props.onBorrar()}}><FontAwesomeIcon icon={faTrash}/></span>
           </div>
           }
              <h2 className="blog-entry-title" onClick={() => this.props.handleEntrada(this.props.entrada.enlace)}>{this.props.entrada.titulo}</h2>
              <div className="blog-entry-meta">
                <span className="blog-entry-date">Fecha de publicación: {this.props.entrada.fecha}</span>

                {this.props.entrada.etiquetas.length > 0 ?
                  <div>
                    <span className="blog-entry-tags" >Etiquetas:
                      {this.props.entrada.etiquetas.map((i, index) => {
                        return (
                          <span href="#" key={i}>{i}</span>
                        );
                      })}
                    </span>
                  </div>
                  : null}


                <span className="blog-entry-comments" onClick={() => this.mostrarComentarios()}> <FaComment />
                  {this.state.nComentarios === 1 ? "1 comentario" : this.state.nComentarios + " comentarios"}
                </span>
              </div>
            </div>
            <div className="blog-entry-text">
              {ReactHtmlParser(this.props.entrada.texto)}
            </div>
            <div className="blog-entry-reactions">


              {this.state.reacciones.map((i, index) => {
                return (
                  <div className="blog-entry-reaction" key={index}>
                    <button className={"blog-entry-reaction-button " + (this.state.reaccion === index + 1 ? "active" : "")} onClick={() => this.handleReactionClick(index + 1)}>
                      <span role="img" aria-label={i[1]}>{i[0]}</span>
                    </button><span>{this.state.emojis[index + 1]}</span>
                  </div>
                );
              })}
            </div>

            <div className="blog-entry-buttons">
              {this.state.comentar ?
                <button className="blog-entry-comment-button" onClick={() => { this.setState({ comentar: false }) }}><FaCommentSlash /> No comentar</button>
                :
                <button className="blog-entry-comment-button" onClick={() => { this.setState({ comentar: true }) }}><FaComment /> Comentar</button>
              }

            </div>
            {this.state.cargaComentarios && this.state.listaComentarios.length>0 &&
              <ul style={{listStyle: "none", paddingLeft: "5px"}}>


                {this.state.listaComentarios.map(i =>
                  <li key={i.id} style={{border: "1px solid black", borderRadius: "3px", marginBottom:"3px", padding: "3px"}}>
                    <p><NombreUsuario usuario={i.nombreUsuario}/> escribió</p>
                    
                    {ReactHtmlParser(i.texto)}
                    
                  </li>
                )}
                
              </ul>
            }
          </div>
        }

        {this.state.comentar &&
          <div>

            <EditorTextoCompleto texto={this.state.comentario} onCambio={(comentario) => this.setState({ comentario: comentario })} />

            <div style={{ display: "inline-flex", width: '700px', justifyContent: "space-between", marginBottom: '5px' }}>

              {this.state.comentario && this.state.comentario !== "<p></p>" ?

                <button className='botonActivo' onClick={() => this.enviarComentario()}>Comentar</button> :
                <button onClick={(e) => e.preventDefault()} className="botonActivo botonProhibido">Comentar</button>
              }

            </div>
          </div>
        }
      </div>
    )

  }
}

